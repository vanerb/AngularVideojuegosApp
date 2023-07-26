import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collectionData,
  collection,
  doc,
  deleteDoc,
  addDoc,
  updateDoc,
  getDoc,
  DocumentData
} from '@angular/fire/firestore';

import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CrudService {
  constructor(private firestore: Firestore) {}

  addItem(item: any) {
    const aCollection = collection(this.firestore, 'videojuegos');
    return addDoc(aCollection, item);
  }

  getItems(): Observable<any[]> {
    const aCollection = collection(this.firestore, 'videojuegos');
    return collectionData(aCollection, { idField: 'id' }) as Observable<any[]>;
  }

  deleteItem(id: any) {
    const aCollection = doc(this.firestore, `videojuegos/${id}`);
    return deleteDoc(aCollection);
  }

  updateItem(id: any, item: any) {
    const aCollection = doc(this.firestore, `videojuegos/${id}`);
    return updateDoc(aCollection, item);
  }

  getItem(id: string): Observable<any> {
    const specificDocRef = doc(this.firestore, `videojuegos/${id}`);

    return from(getDoc(specificDocRef)).pipe(
      map((snapshot: any) => {
        if (snapshot.exists()) {
          return snapshot.data() as any;
        } else {
          // Si el documento no existe, puedes manejarlo como consideres adecuado
          return null;
        }
      })
    );
  }

 
}
