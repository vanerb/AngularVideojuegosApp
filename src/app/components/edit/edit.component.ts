import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent {

  updateitem: FormGroup;
  submited = false;
  loading = false;
  id:string | null;
  items: any[] = [];

  constructor(
    private fb: FormBuilder, private _crudService: CrudService, private router: Router, private toastr: ToastrService, private aRoute: ActivatedRoute){

      
      this.updateitem = this.fb.group({
        name: ['', [Validators.required]],
        developer: ['', [Validators.required]],
        price: ['', [Validators.required]],
        note: ['', [Validators.required]],
      });
  
      this.id = this.aRoute.snapshot.paramMap.get('id');

     

    }

    ngOnInit(): void {
      this.updateItem();
    }

  updateItem(){
    if(this.id !== null){


      this._crudService.getItem(this.id).subscribe((items) => {
        this.items.push(items);
        console.log(this.items); // Display the fetched items in the console

        this.updateitem.setValue({
          name: items['name'],
          developer: items['developer'],
          price: items['price'],
          note: items['note'],
        })
      });

      
    }
  }


  

  btUpdate(){
    this.submited = true;

    console.log(this.updateitem);
    if(this.updateitem.invalid){
      return;
    }


    if(this.updateitem.value.note > 10 || this.updateitem.value.note < 0){
      this.toastr.error('La nota no puede ser mayor a 10 o menor a 0', 'Error');
      return;
    }
   

    const item: any = {
      name: this.updateitem.value.name,
      developer: this.updateitem.value.developer,
      price: this.updateitem.value.price,
      note: this.updateitem.value.note,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
    }

   

    this.loading = true;

    this._crudService.updateItem(this.id, item).then( () => {
      this.toastr.success('Editado con exito!', 'Registro editado');
      this.router.navigate(['/list']);
      this.loading = false;
      
    }).catch( (err) => {
      console.log(err);
      
    });

  }
}
