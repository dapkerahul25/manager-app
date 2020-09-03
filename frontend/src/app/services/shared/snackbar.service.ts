import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private _snackBar: MatSnackBar) {
  }

  openSnackBar(type: string, message: string, time?, hPosition?) {
    this._snackBar.open(message, '', {
      duration: time ? time : type == 'error' ? 3000 : 2000,
      horizontalPosition: hPosition ? hPosition : 'right',
      verticalPosition: 'top',
      panelClass: [type == 'error' ? 'red-snackbar' : 'green-snackbar'],
    });
  }

}
