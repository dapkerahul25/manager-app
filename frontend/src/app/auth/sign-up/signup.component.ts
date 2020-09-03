import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user-console/user.service';
import { SnackbarService } from 'src/app/services/shared/snackbar.service';
import { AuthService } from 'src/app/services/authorization/auth.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})


export class SignUpComponent implements OnInit {

  public user: FormGroup;
  isShowPassword: boolean = false;
  maxDate: Date = new Date();

  /* depedency injection */
  constructor(
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router) {
    if (this.authService.isToken) { this.router.navigate(['']); }
  }

  ngOnInit(): void {
    this.initFormControl();
  }

  /* initialize manager form data */
  initFormControl() {
    const password = new FormControl('', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z]).{8,30}$')]);
    this.user = this.fb.group({
      email: [null, [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]],
      country_code: ['+91', [Validators.required]],
      firstname: [null, [Validators.required, Validators.pattern('[a-zA-Z ]{1,50}')]],
      lastname: [null, [Validators.required, Validators.pattern('[a-zA-Z ]{1,50}')]],
      mobile: [null, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: password,
      confirmPassword: ["", Validators.required],
      address: [null, [Validators.required, Validators.maxLength(50)]],
      company: [null, [Validators.required, Validators.maxLength(30)]],
      dob: [null, [Validators.required]],
    },
      {
        validator: MustMatch('password', 'confirmPassword')
      });
  }

  /* password validator */
  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.user.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  /* manager sign up */
  onSubmit() {
    const controls = this.user.controls;
    if (this.user.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    this.userService.signUp(this.user.value).subscribe(res => {
      if (res) {
        this.snackbarService.openSnackBar('success', res.message);
        if (res.status_code == 201) {
          return
        }
        this.router.navigate(['auth/signin'])
      }
    }, err => { this.snackbarService.openSnackBar('error', err.error.message); })
  }
}

/* custom validator to check that two fields match */
export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      /* return if another validator has already found an error on the matchingControl*/
      return;
    }

    /*set error on matchingControl if validation fails */
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  }
}