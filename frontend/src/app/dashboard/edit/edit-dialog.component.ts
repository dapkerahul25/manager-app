import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Employee } from 'src/app/models/user-console/employee';
import { EmployeeService } from 'src/app/services/user-console/employee.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/authorization/auth.service';
import { SnackbarService } from 'src/app/services/shared/snackbar.service';
import { UserService } from 'src/app/services/user-console/user.service';
import { Router } from '@angular/router';
import { ConfirmDialogModel, ConfirmDialogComponent } from 'src/app/core/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent implements OnInit {
  submitEmpBtnLbl = 'Save'
  public emp: FormGroup;
  maxDate: Date = new Date();

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public employee: Employee,
    private employeeService: EmployeeService,
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

  initFormControl() {
    this.emp = this.fb.group({
      _id: [null],
      emp_id: [null, [Validators.required]],
      country_code: ['+91', [Validators.required]],
      firstname: [null, [Validators.required, Validators.pattern('[a-zA-Z ]{1,50}')]],
      lastname: [null, [Validators.required, Validators.pattern('[a-zA-Z ]{1,50}')]],
      mobile: [null, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: [null, [Validators.required, Validators.maxLength(50)]],
      city: [null, [Validators.required, Validators.maxLength(20)]],
      dob: [null, [Validators.required]],
    });
    if (this.employee && this.employee._id) { this.submitEmpBtnLbl = 'Update'; this.patchEmpData() }
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    let control = this.emp.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }


  patchEmpData() {
    this.emp.patchValue({
      _id: this.employee._id,
      firstname: this.employee.firstname,
      lastname: this.employee.lastname,
      address: this.employee.address,
      city: this.employee.city,
      emp_id: this.employee.emp_id,
      mobile: this.employee.mobile,
      country_code: this.employee.country_code,
      dob: this.employee.dob
    })
  }

  confirmAddUpdate() {
    if (this.employee && this.employee._id) {
      const message = `Are you sure you want to do this?`;
      const actionData = { action: 'UPDATE', employee: this.emp.value }
      const dialogData = new ConfirmDialogModel('Update Employee', message, actionData);
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: "400px",
        data: dialogData
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res && res.action === 'UPDATE') {
          this.onSubmitEmp()
        }
      });
    } else {
      this.onSubmitEmp()
    }
  }

  cancelAddUpdate() {
    this.dialogRef.close();
  }

  /* handle the add/update employee operation */
  onSubmitEmp() {
    const controls = this.emp.controls;
    if (this.emp.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    if (this.employee && this.employee._id) {
      /* handle the update employee operation */
      this.employeeService.updateEmployee(this.emp.value).subscribe(res => {
        if (res) {
          this.snackbarService.openSnackBar('success', res.message);
          this.dialogRef.close();
        }
      }, err => { this.snackbarService.openSnackBar('error', err.error.message); })
    } else {
      /* handle the add employee operation */
      this.employeeService.saveEmployee(this.emp.value).subscribe(res => {
        if (res) {
          this.snackbarService.openSnackBar('success', res.message);
          if (res.status_code == 201) {
            return
          }
          this.dialogRef.close();
        }
      }, err => { this.snackbarService.openSnackBar('error', err.error.message); })
    }
  }

  /* cancel add/update employee */
  cancelEmpUpdate(): void {
    this.dialogRef.close();
  }

}
