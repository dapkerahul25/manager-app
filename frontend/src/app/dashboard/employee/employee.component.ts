import { Component, OnInit, ViewChild, Input, DoCheck } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Employee } from 'src/app/models/user-console/employee';
import { EmployeeService } from 'src/app/services/user-console/employee.service';
import { SnackbarService } from 'src/app/services/shared/snackbar.service';
import { EditDialogComponent } from '../edit/edit-dialog.component';
import { MatDialog } from '@angular/material';
import { ConfirmDialogModel, ConfirmDialogComponent } from 'src/app/core/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {

  showFiller = false;
  employeeData: Employee[];

  /* depedency injection */
  constructor(
    public dialog: MatDialog,
    private employeeService: EmployeeService,
    private snackbarService: SnackbarService,
  ) { }

  /* list of employee table columns */
  displayedColumns: string[] = ['no', 'emp_id', 'firstname', 'lastname', 'address',
    'city', 'dob', 'mobile', 'action'];
  
  /* initialize employee datasource */
  dataSource = new MatTableDataSource<Employee>(this.employeeData)

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.getAllEmployee()
    this.dataSource.paginator = this.paginator;
  }

  /* open confirm dialog for update/delete employee */
  confirmDialog(actionTitle: string, actionData: Employee) {
    const message = `Are you sure you want to do this?`;
    const dialogData = new ConfirmDialogModel(actionTitle, message, actionData);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res && res.action === 'DELETE') {
        this.deleteEmployee(res.employee._id)
      } else if (res && res.action === 'UPDATE') {
        this.addUpdateEmployee(res.employee)
      }
    });
  }

  /* open dialog box add/update employee */
  addUpdateEmployee(employee: Employee): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '450px',
      data: employee
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getAllEmployee();
    });
  }

  /* delete emplyee by emp user id */
  deleteEmployee(empId: string) {
    this.employeeService.deleteEmpById(empId).subscribe(res => {
      if (res) {
        this.getAllEmployee();
        this.snackbarService.openSnackBar('success', res.message);
      }
    }, err => { this.snackbarService.openSnackBar('error', err.error.message); })
  }

  /* get all emplyee by manager id */
  getAllEmployee() {
    this.employeeService.getAllEmployee().subscribe(res => {
      if (res && res.data) {
        this.dataSource = new MatTableDataSource<Employee>(res.data);
      }
    }, err => { this.snackbarService.openSnackBar('error', err.error.message); })
  }
}