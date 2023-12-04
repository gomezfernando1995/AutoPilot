import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { VehiculoService } from './service/vehiculo.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AlertController, IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { doc, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { vehiculo } from './models/vehiculo.model';
import { BehaviorSubject, Observable, map, startWith } from 'rxjs';
import { userVehiculo } from './models/userVehiculo.model';

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.page.html',
  styleUrls: ['./vehiculos.page.scss'],
})
export class VehiculosPage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;

  selectedVehiculoModelo!: vehiculo;
  selectedMarca: any; // Debes tener una propiedad para almacenar la marca seleccionada.
  modelosFiltrados$!: Observable<string[]>;
  tipoFiltrados$!: Observable<string[]>;
  vehiculos$: Observable<vehiculo[]>;
  userVehiculos$!: Observable<userVehiculo[]>;
  modelo!: [];

  cargaTotalCombustible: number = 40; // Carga total en litros
  ultimaCargaCombustible: number = 0; // Litros cargados en la última carga

  cargaTotalAceite: number = 4; // Carga total en litros
  ultimaCargaAceite: number = 0; // Litros cargados en la última carga

  cargaTotalAgua: number = 4; // Carga total en litros
  ultimaCargaAgua: number = 0; // Litros cargados en la última carga

  tipo: string[] = [
    'Sedán',
    'SUV',
    'Hatchback',
    'Coupe',
    'Convertible',
    'Camioneta',
    'Minivan',
    'Deportivo',
    'Crossover',
    'Pick-up',
  ];
  dataVehiculo: vehiculo[] = [];

  firestore: Firestore = inject(Firestore);
  isDesktop: boolean = window.innerWidth > 768; // Establece el valor inicial
  name!: string;
  selectedVehiculo: userVehiculo | null = null;

  marcaSelect!: string;
  modeloSelect!: string;
  imgSelect!: string;
  total_litros_combustibleSelect!: string;
  tipo_combustibleSelect!: string;
  tipo_aceiteSelect!: string;
  total_cantidad_aceiteSelect!: string;
  tipoVehiculoSelect!: string;
  fotoSelect!: string;
  idDoc!: string;
  nuevoCombustibleForm!: string;

  // ***************************************** CONSTRUCTOR *****************************************

  constructor(
    private auth: AngularFireAuth,
    private serviceVehiculo: VehiculoService,
    private alertController: AlertController
  ) {
    this.vehiculos$ = this.serviceVehiculo.getVehiculos;
    this.userVehiculos$ = this.serviceVehiculo.getUsuarioVehiculos;
  }

  ngOnInit() {
    window.addEventListener('resize', () => {
      this.isDesktop = window.innerWidth > 768; // Actualiza el valor al cambiar el tamaño de la ventana
    });
    this.vehiculoForm.get('modelo')?.disable();
    this.vehiculoForm.get('tipo')?.disable();
    this.vehiculoForm.get('patente')?.disable();
    this.vehiculoForm.get('kilometraje')?.disable();
  }

  // ***************************************** FORMULARIO DEL VEHICULO ***********************************
  public vehiculoForm: FormGroup = new FormGroup({
    marca: new FormControl('', [Validators.required]),
    modelo: new FormControl('', [Validators.required]),
    tipo: new FormControl('', [Validators.required]),
    patente: new FormControl('', [Validators.required]),
    kilometraje: new FormControl('', [Validators.required]),
  });

  // ***************************************** CANCELAR FORMULARIO ***********************************
  cancel() {
    this.modal.dismiss(null, 'cancel');
    this.vehiculoForm.get('marca')?.setValue('');
    this.vehiculoForm.get('modelo')?.setValue('');
    this.vehiculoForm.get('modelo')?.disable();
    this.vehiculoForm.get('tipo')?.disable();
    this.vehiculoForm.get('patente')?.disable();
    this.vehiculoForm.get('tipo')?.setValue('');
    this.vehiculoForm.get('patente')?.setValue('');
  }

  // ***************************************** CONFIRMAR  FORMULARIO ***********************************
  confirm() {
    this.datosVehiculo();
    this.firebase_altaVehiculo();
    this.modal.dismiss(this.name, 'confirm');
    // this.vehiculoForm.get('marca')?.setValue('');
    // this.vehiculoForm.get('modelo')?.setValue('');
    // this.vehiculoForm.get('modelo')?.disable();
    // this.vehiculoForm.get('tipo')?.disable();
    // this.vehiculoForm.get('tipo')?.setValue('');
    // this.vehiculoForm.get('patente')?.disable();
    // this.vehiculoForm.get('patente')?.setValue('');
    // this.vehiculoForm.get('kilometraje')?.disable();
    // this.vehiculoForm.get('kimetraje')?.setValue('');
  }

  /// ***************************************** CONFIRMAR  FORMULARIO ***********************************
  cargar() {
    this.datosVehiculo();
  }

  //***************************************** DESGLOSADO DEL VEHICULO  ***********************************
  datosVehiculo(): void {
    this.vehiculos$.subscribe((data: vehiculo[]) => {
      this.dataVehiculo = data;
      let encontrado: boolean = false;
      const marca = this.vehiculoForm.get('marca')?.value;
      const modelo = this.vehiculoForm.get('modelo')?.value;

      for (const vehiculo of this.dataVehiculo) {
        console.log(
          ' la marca de esta vuelta es : ',
          vehiculo.marca,
          ' y el modelo es :',
          vehiculo.modelo
        );
        // console.log(marca.trim() === vehiculo.marca.trim() && modelo.trim() === vehiculo.modelo.trim() );

        if (
          marca.trim() === vehiculo.marca.trim() &&
          modelo.trim() === vehiculo.modelo.trim()
        ) {
          console.log('Cargando datos del vehiculo : ', vehiculo.modelo);

          this.imgSelect = vehiculo.img_min.trim();
          this.tipoVehiculoSelect = vehiculo.tipo.trim();
          //COMBUSTIBLE
          this.total_litros_combustibleSelect =
            vehiculo.litros_combustible.trim();
          this.tipo_combustibleSelect = vehiculo.tipo_combustible.trim();
          //ACEITE
          this.tipo_aceiteSelect = vehiculo.tipo_aceite.trim();
          this.total_cantidad_aceiteSelect = vehiculo.cantidad_aceite.trim();

          console.log(
            'img:',
            typeof this.imgSelect,
            '...tipo:',
            typeof this.tipoVehiculoSelect,
            '...total combustible: ',
            typeof this.total_litros_combustibleSelect,
            '...tipo combustible: ',
            typeof this.tipo_combustibleSelect,
            '...tipo aceite: ',
            typeof this.tipo_aceiteSelect,
            '...total aceite: ',
            typeof this.total_cantidad_aceiteSelect
          );

          encontrado = true;
        }
        if (encontrado == true) {
          break;
        }
      }
    });
  }

  // altaVehiculo() {
  //   const marca = this.vehiculoForm.get('marca')?.value;
  //   const modelo = this.vehiculoForm.get('modelo')?.value;
  //   const motor: string = this.vehiculoForm.get('motor')?.value;
  //   const patente: string = this.vehiculoForm.get('patente')?.value;
  //
  //   this.firebase_altaVehiculo(nombre);
  //   this.tostada.mostrarMensajeDeLogin(' Registro exitoso !', 'person');
  //   this.router.navigate(['/login']);
  //
  // }

  firebase_altaVehiculo() {
    this.auth.authState.subscribe((user) => {
      if (user) {
        const id = user.uid + this.vehiculoForm.get('patente')?.value;
        const marcaForm = this.vehiculoForm.get('marca')?.value;
        const modeloForm = this.vehiculoForm.get('modelo')?.value;
        const kmForm = this.vehiculoForm.get('kilometraje')?.value;

        let tipo: string;
        const patenteForm = this.vehiculoForm.get('patente')?.value;

        let photoURL: string;
        let tipoAceite: string;
        let cantidad_totalAceite: string;
        let cantidad_totalTanqueCombustible: string;
        let tipoCombustible: string;

        const uid = user.uid;
        const displayName = user.displayName;
        const cantidad_ultimaCargaCombustible = '5';
        const cantidad_actualCargaCombustible = '20';
        const fecha_ultimaCargaCombustible = '11/11/2023';
        const cantidad_UltimaCargaAceite = '2';
        const fecha_ultimaCargaAceite = '4/4/23';
        const fecha_ultimoCambioFiltroDeAire = '5/4/23';
        const tipoFiltroDeAire = 'Comun';
        const fecha_cambioDistribucion = '5/4/23';

        this.vehiculos$.subscribe((data: vehiculo[]) => {
          this.dataVehiculo = data;
          let encontrado: boolean = false;

          console.log('Cargando datos del vehiculo : ', marcaForm);
          console.log('Cargando datos del vehiculo : ', modeloForm);

          for (const vehiculo of this.dataVehiculo) {
            console.log(
              ' la marca de esta vuelta es : ',
              vehiculo.marca,
              ' y el modelo es :',
              vehiculo.modelo
            );
            console.log(
              marcaForm.trim() === vehiculo.marca.trim() &&
                modeloForm.trim() === vehiculo.modelo.trim()
            );

            if (
              marcaForm.trim() === vehiculo.marca.trim() &&
              modeloForm.trim() === vehiculo.modelo.trim()
            ) {
              console.log('Cargando datos del vehiculo : ', vehiculo.modelo);

              photoURL = vehiculo.img_min.trim();
              tipo = vehiculo.tipo.trim();
              //COMBUSTIBLE
              cantidad_totalTanqueCombustible =
                vehiculo.litros_combustible.trim();
              tipoCombustible = vehiculo.tipo_combustible.trim();
              //ACEITE
              tipoAceite = vehiculo.tipo_aceite.trim();
              cantidad_totalAceite = vehiculo.cantidad_aceite.trim();

              encontrado = true;
            }
            if (encontrado == true) {
              break;
            }
          }
          const documentData = {
            uid: uid,
            displayName: displayName,
            marca: marcaForm || '',
            modelo: modeloForm || '',
            tipo: tipo || '',
            patente: patenteForm || '',
            photoURL: photoURL || '',
            cantidad_totalTanqueCombustible:
              cantidad_totalTanqueCombustible || '',
            tipoCombustible: tipoCombustible || '',
            cantidad_ultimaCargaCombustible:
              cantidad_ultimaCargaCombustible || '',
            cantidad_actualCargaCombustible:
              cantidad_actualCargaCombustible || '',
            fecha_ultimaCargaCombustible: fecha_ultimaCargaCombustible || '',
            tipoAceite: tipoAceite || '',
            cantidad_totalAceite: cantidad_totalAceite || '',
            cantidad_UltimaCargaAceite: cantidad_UltimaCargaAceite || '',
            fecha_ultimaCargaAceite: fecha_ultimaCargaAceite || '',
            fecha_ultimoCambioFiltroDeAire:
              fecha_ultimoCambioFiltroDeAire || '',
            tipoFiltroDeAire: tipoFiltroDeAire || '',
            fecha_cambioDistribucion: fecha_cambioDistribucion || '',
            kilometraje: kmForm || '',
          };

          setDoc(
            doc(this.firestore, 'userVehiculos', id.toString()),
            documentData
          )
            .then(() => {
              console.log('Vehiculo ALMACENADO CORRECTAMENTE');
              this.vehiculoForm.get('marca')?.setValue('');
              this.vehiculoForm.get('modelo')?.setValue('');
              this.vehiculoForm.get('modelo')?.disable();
              this.vehiculoForm.get('tipo')?.disable();
              this.vehiculoForm.get('tipo')?.setValue('');
              this.vehiculoForm.get('patente')?.disable();
              this.vehiculoForm.get('patente')?.setValue('');
              this.vehiculoForm.get('kilometraje')?.disable();
              this.vehiculoForm.get('kilometraje')?.setValue('');
              this.userVehiculos$ = this.serviceVehiculo.getUsuarioVehiculos;

            })
            .catch((error) => {
              console.error('Error al guardar el documento:', error);
            });
        });
      } else {
        console.log('No se pudo guardar los datos correctamente.');
      }
    });
  }

  // firebase_altaVehiculo() {
  //   this.auth.authState.subscribe((user) => {
  //     if (user) {
  //       const id = user.uid + this.vehiculoForm.get('patente')?.value;
  //       const marca = this.vehiculoForm.get('marca')?.value;
  //       const modelo = this.vehiculoForm.get('modelo')?.value;
  //       const tipo = this.vehiculoForm.get('tipo')?.value;
  //       const patente = this.vehiculoForm.get('patente')?.value;
  //       const photoURL = this.fotoSelect;
  //       const cantidad_totalTanqueCombustible = this.total_litros_combustibleSelect || 0;
  //       const tipoCombustible = this.tipo_combustibleSelect || 'Gasolina';
  //       const uid=user.uid;
  //       const displayName= user.displayName;
  //       const cantidad_ultimaCargaCombustible="5";
  //       const cantidad_actualCargaCombustible="20";
  //       const fecha_ultimaCargaCombustible="11/11/2023";

  //       const tipoAceite=this.tipo_aceiteSelect;
  //       const cantidad_totalAceite=this.total_cantidad_aceiteSelect;
  //       const cantidad_UltimaCargaAceite="2";
  //       const fecha_ultimaCargaAceite="4/4/23";
  //       const fecha_ultimoCambioFiltroDeAire="5/4/23";
  //       const tipoFiltroDeAire="Comun";
  //       const fecha_cambioDistribucion="5/4/23";

  //       const documentData = {
  //         uid: uid,
  //         displayName: displayName,
  //         marca: marca || '',
  //         modelo: modelo || '',
  //         tipo: tipo || '',
  //         patente: patente || '',
  //         photoURL: photoURL || '',
  //         cantidad_totalTanqueCombustible: cantidad_totalTanqueCombustible  || '',
  //         tipoCombustible: tipoCombustible || '',
  //         cantidad_ultimaCargaCombustible:cantidad_ultimaCargaCombustible || '',
  //         cantidad_actualCargaCombustible:cantidad_actualCargaCombustible || '',
  //         fecha_ultimaCargaCombustible:fecha_ultimaCargaCombustible || '',
  //         tipoAceite:tipoAceite || '',
  //         cantidad_totalAceite:cantidad_totalAceite || '',
  //         cantidad_UltimaCargaAceite:cantidad_UltimaCargaAceite || '',
  //         fecha_ultimaCargaAceite:fecha_ultimaCargaAceite || '',
  //         fecha_ultimoCambioFiltroDeAire:fecha_ultimoCambioFiltroDeAire || '',
  //         tipoFiltroDeAire:tipoFiltroDeAire || '',
  //         fecha_cambioDistribucion:fecha_cambioDistribucion || ''

  //       };

  //       setDoc(doc(this.firestore, 'userVehiculos', id.toString()), documentData)
  //       .then(() => {
  //         console.log('Vehiculo ALMACENADO CORRECTAMENTE');
  //       })
  //       .catch((error) => {
  //         console.error('Error al guardar el documento:', error);
  //       });
  //     } else {
  //       console.log('No se pudo guardar los datos correctamente.');

  //     }
  //   });
  // }

  ///*********************************************  SELECCICON DE MARCAS PARA HABILITAR LOS MODELOS **************************************************** */

  marcaSelected() {
    const marcaSelect = this.vehiculoForm.get('marca')?.value;
    if (marcaSelect) {
      this.modelosFiltrados$ = this.vehiculos$.pipe(
        map((vehiculos) => {
          this.vehiculoForm.get('modelo')?.enable();
          this.vehiculoForm.get('tipo')?.enable();
          this.vehiculoForm.get('patente')?.enable();
          this.vehiculoForm.get('kilometraje')?.enable();

          return vehiculos
            .filter((vehiculo) => vehiculo.marca === marcaSelect)
            .map((vehiculo) => vehiculo.modelo);
        })
      );
    } else {
      this.vehiculoForm.get('modelo')?.disable();
      this.modelo = [];
    }
  }

  seleccionarVehiculo(vehiculo: userVehiculo) {
    this.selectedVehiculo = vehiculo;
    this.idDoc = vehiculo.uid.trim() + vehiculo.patente.trim();
    console.log(this.idDoc);
    this.cargaTotalCombustible = Number(
      vehiculo.cantidad_totalTanqueCombustible
    ); // Carga total en litros
    this.ultimaCargaCombustible = Number(
      vehiculo.cantidad_ultimaCargaCombustible
    ); // Litros cargados en la última carga

    this.cargaTotalAceite = Number(vehiculo.cantidad_totalAceite); // Carga total en litros
    this.ultimaCargaAceite = Number(vehiculo.cantidad_UltimaCargaAceite); // Carga total en litros

    this.cargaTotalAgua = 3; // Carga total en litros
    this.ultimaCargaAgua = 2.8; // Carga total en litros
  }

  actualizarCombustible() {
    
      const nuevoValor = this.alertInputs.values;
      const id = this.idDoc;
      const vehiculoRef = doc(this.firestore, 'userVehiculos', id);
         
      const campoAActualizar = 'cantidad_ultimaCargaCombustible';
      const datosActualizados = { [campoAActualizar]: nuevoValor };
  
      try {
         updateDoc(vehiculoRef, datosActualizados);
        console.log(`Campo "${campoAActualizar}" actualizado exitosamente`);
      } catch (error) {
        console.error('Error al actualizar el campo:', error);
      }
    
  }
  


  
  public alertButtons = ['OK'];
  public alertInputs = [
    {
      type: 'number',
      placeholder: 'Introduce litros de combustible',
      min: 1,
      max: 2,
    },
  
  ];

  // Fecha y Hora de Alta en la Aplicación

  // Usuario que lo Gestiona (puede ser un campo de referencia al documento del usuario correspondiente)
  // Usuarios Secundarios que pueden Gestionarlo (pueden ser una matriz de referencias a documentos de usuarios relacionados)
  // cantidad_ultimaCargaCombustible: new FormControl('', [Validators.required]),
  // cantidad_actualCargaCombustible: new FormControl('', [Validators.required]),
  // fecha_ultimaCargaCombustible:    new FormControl('', [Validators.required]),

  // cantidad_UltimaCargaAceite: new FormControl('', [Validators.required]),
  // fecha_ultimaCargaAceite   : new FormControl('', [Validators.required]),
  // chasis: new FormControl('', [Validators.required]),
  // fecha_ultimoCambioFiltroDeAire: new FormControl('', [Validators.required]),
  // tipoFiltroDeAire:               new FormControl('', [Validators.required]),
  // fecha_cambioDistribucion:       new FormControl('', [Validators.required]),

  // uid: user.uid,
  // displayName: user.displayName,
  // marca: this.vehiculoForm.get('marca')?.value,
  // modelo: this.vehiculoForm.get('modelo')?.value,
  // tipo: this.vehiculoForm.get('tipo')?.value,
  // patente: this.vehiculoForm.get('patente')?.value,
  // photoURL: this.fotoSelect !== undefined ? this.fotoSelect : null,
  // tipoCombustible:this.tipo_combustibleSelect,
  // cantidad_totalTanqueCombustible:this.total_litros_combustibleSelect,
  // cantidad_ultimaCargaCombustible:"5",
  // cantidad_actualCargaCombustible:"20",
  // fecha_ultimaCargaCombustible:"11/11/2023",

  // tipoAceite:this.tipo_aceiteSelect,
  // cantidad_totalAceite:this.total_cantidad_aceiteSelect,
  // cantidad_UltimaCargaAceite:"2",
  // fecha_ultimaCargaAceite:"4/4/23",
  // fecha_ultimoCambioFiltroDeAire:"5/4/23",
  // tipoFiltroDeAire:"Comun",
  // fecha_cambioDistribucion:"5/4/23"
}
