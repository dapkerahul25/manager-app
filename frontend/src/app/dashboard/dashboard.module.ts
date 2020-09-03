import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from '../core/layout/layout.component';
import { MaterialModule } from '../core/material/material.module';
import { HeaderComponent } from '../core/navigation/header/header.component';
import { SidenavListComponent } from '../core/navigation/sidenav-list/sidenav-list.component';
import { EmployeeComponent } from './employee/employee.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    EmployeeComponent,
    LayoutComponent,
    HeaderComponent,
    SidenavListComponent,
    DashboardComponent],
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent
      }
    ])
  ]
})
export class DashboardModule { }
