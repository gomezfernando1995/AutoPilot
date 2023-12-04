import { Component, OnInit, ViewChild } from '@angular/core';
import { PerfilService } from 'src/app/shared/services/perfil/perfil.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent  implements OnInit {

  constructor(public servicePerfil:PerfilService) { }

  ngOnInit() {}

}
