import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent {

  createitem: FormGroup;
  submited = false;
  loading = false;
  id:string | null;
  items: any[] = [];
  constructor(private fb: FormBuilder, private _crudService: CrudService, private router: Router, private toastr: ToastrService, private aRoute: ActivatedRoute) { 
    this.createitem = this.fb.group({
      name: ['', [Validators.required]],
      developer: ['', [Validators.required]],
      price: ['', [Validators.required]],
      note: ['', [Validators.required]],
    });


    this.id = this.aRoute.snapshot.paramMap.get('id');

  }

  ngOnInit(): void {

  }

  createItems(){
    this.submited = true;

    console.log(this.createitem);
    if(this.createitem.invalid){
      return;
    }

    if(this.createitem.value.note > 10 || this.createitem.value.note < 0){
      this.toastr.error('La nota no puede ser mayor a 10 o menor a 0', 'Error');
      return;
    }

    const item: any = {
      name: this.createitem.value.name,
      developer: this.createitem.value.developer,
      price: this.createitem.value.price,
      note: this.createitem.value.note,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
    }

    this.loading = true;

    this._crudService.addItem(item).then( () => {
      this.toastr.success('Creado con exito!', 'Nuevo registro creado');
      this.router.navigate(['/list']);
      this.loading = false;
      
    }).catch( (err) => {
      console.log(err);
      
    });

    
    
  }


 
}
