import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignUpComponent } from './sign-up/signup.component';
import { SignInComponent } from './sign-in/signin.component';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user-console/user.service';
import { MaterialModule } from '../core/material/material.module';


@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent
  ],
  imports: [
    MaterialModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: 'signin',
        component: SignInComponent
      },
      {
        path: 'signup',
        component: SignUpComponent
      }
    ])
  ],
  providers:[UserService]
})
export class AuthModule { }
