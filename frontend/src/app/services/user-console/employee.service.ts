import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Employee } from 'src/app/models/user-console/employee';
@Injectable({
  providedIn: "root"
})
export class EmployeeService {
  url = environment.apiUrl;
  constructor(private http: HttpClient) { }
  saveEmployee(employee: Employee): Observable<any> {
    return this.http
      .post<any>(this.url + "employee", employee)
      .pipe(catchError(this.handleErrorObservable));
  }

  updateEmployee(employee: Employee): Observable<any> {
    return this.http
      .put<any>(this.url + "employee", employee)
      .pipe(catchError(this.handleErrorObservable));
  }
  getAllEmployee(): Observable<any> {
    return this.http
      .get<any>(this.url + "employee")
      .pipe(catchError(this.handleErrorObservable));
  }
  deleteEmpById(id: String): Observable<any> {
    return this.http
      .delete<any>(this.url + "employee/" + id)
      .pipe(catchError(this.handleErrorObservable));
  }

  private handleErrorObservable(error: Response | any) {
    console.error(error.message || error);
    return throwError(error);
  }
}
