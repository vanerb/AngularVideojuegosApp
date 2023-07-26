import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { CrudService } from 'src/app/services/crud.service';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  items: any[] = [];
  currentPage = 1; // Página actual
  itemsPerPage = 6; // Cantidad de elementos por página
  totalItems = 0; // Total de elementos en la base de datos
  totalPages = 0; // Total de páginas

  constructor(
    private firestore: Firestore,
    private _crudService: CrudService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getItems();
  }

  getItems() {
    // Recuperar la cantidad total de elementos en la base de datos
    this._crudService.getItems().subscribe((data) => {
      this.totalItems = data.length;
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    });

    // Recuperar solo los elementos para la página actual
    this._crudService
      .getItems()
      .pipe(
        map((data) =>
          data.slice(
            (this.currentPage - 1) * this.itemsPerPage,
            this.currentPage * this.itemsPerPage
          )
        )
      )
      .subscribe((data) => {
        this.items = data;
      });
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getItems();
    }
  }

  deleteItem(id: string) {
    this._crudService
      .deleteItem(id)
      .then(() => {
        this.toastr.success(
          'Eliminado con éxito!',
          'Se ha eliminado correctamente'
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Método para crear un array con la cantidad de páginas
  totalPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }
}
