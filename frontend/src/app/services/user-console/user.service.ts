import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Manager } from 'src/app/models/user-console/manager';
@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(
        private http: HttpClient,
        handler: HttpBackend) {
        this.http = new HttpClient(handler);
    }

    signUp(user: Manager): Observable<any> {
        return this.http
            .post<any>(environment.apiUrl + 'signUp', user)
            .pipe(catchError(this.handleErrorObservable));
    }

    signIn(user: Manager): Observable<any> {
        return this.http
            .post<Manager>(environment.apiUrl + 'signIn', user)
            .pipe(catchError(this.handleErrorObservable));
    }


    private handleErrorObservable(error: Response | any) {
        console.error(error.message || error);
        return throwError(error);
    }
}
