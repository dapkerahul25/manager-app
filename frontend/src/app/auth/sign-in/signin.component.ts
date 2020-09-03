import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user-console/user.service';
import { SnackbarService } from 'src/app/services/shared/snackbar.service';
import { AuthService } from 'src/app/services/authorization/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SignInComponent implements OnInit {
  public form: FormGroup;

  /* depedency incjection */
  constructor(
    private authservice: AuthService,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private fb: FormBuilder,
    private router: Router) {
    if (this.authservice.isToken) {
      this.router.navigate(['']);
    }
  }

  ngOnInit(): void {
    this.initFormControl()
  }
/* initialize login form data */
  initFormControl() {
    this.form = this.fb.group({
      username: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])]
    });
  }

  /* manager sign up */
  onSubmit() {
    const controls = this.form.controls;
    if (this.form.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    this.userService.signIn(this.form.value).subscribe(res => {
      if (res && res.data) {
        this.authservice.setUserData(res.data);
        this.router.navigate(['/home'])
      }
      this.snackbarService.openSnackBar('success', res.message);
    }, err => {
      this.snackbarService.openSnackBar('error', err.error.message);
    })
  }

}
