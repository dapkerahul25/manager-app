import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, finalize} from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { SnackbarService } from '../shared/snackbar.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
@Injectable()

export class AuthInterceptorService implements HttpInterceptor {

    constructor(
        private router : Router,
        private authService: AuthService,
        private snackbarService: SnackbarService,
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        var authRequest = this.addAuthenticationToken(request);

        return next.handle(authRequest).pipe(
            catchError(err => {
                if (err.status === 401) {
                    this.snackbarService.openSnackBar('error', err.error.message);
                    this.authService.removeUserData()
                    this.router.navigate(['auth/signin'])
                }
                else if (err.status == 0) {
                    this.snackbarService.openSnackBar('error', 'server connection lost');
                }
                else if (err.status == 404) {
                    this.snackbarService.openSnackBar('error', "Not Found");
                }
                else if (err.status == 400 || err.status == 403 || err.status == 409) {
                    this.snackbarService.openSnackBar('error', err.error.message);
                }
                else if (err.status == 500) {
                    this.snackbarService.openSnackBar('error', 'Internal Server Error');
                }
                const error = err || err.statusText;
                return throwError(error);
            }),
            finalize(
                () => { }
            )
        )

    }

    private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
        // If we do not have a token yet then we should not set the header.
        // Here we could first retrieve the token from where we store it.
        if (!this.authService.getUserData() || !this.authService.getUserData().token) {
            return request;
        }
        // If you are calling an outside domain then do not add the token.
        if (!request.url.match(environment.apiUrl)) {
            return request;
        }
        return request.clone({
            headers: request.headers.set("Authorization", this.authService.getUserData().token)
        });
    }

}
