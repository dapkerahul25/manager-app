import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SnackbarService } from './services/shared/snackbar.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './services/authorization/auth.service';
import { CookieService, CookieOptions } from 'angular2-cookie';
import { AuthInterceptorService } from './services/authorization/auth-interceptor.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './core/material/material.module';
import { EditDialogComponent } from './dashboard/edit/edit-dialog.component';
import { MatDialogRef, MatDialogTitle, MAT_DIALOG_DATA } from '@angular/material';
import { ConfirmDialogComponent } from './core/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    EditDialogComponent,
    ConfirmDialogComponent
  ],
  imports: [
    MaterialModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    SnackbarService, AuthService, CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    { provide: CookieOptions, useValue: false },
    { provide: MatDialogTitle, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] }],
  entryComponents: [EditDialogComponent,ConfirmDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
