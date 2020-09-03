import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'angular2-cookie/core';

@Injectable()
export class AuthService {

    constructor(
        public router: Router,
        private CookieService: CookieService) { }

    setUserData(data: any) {
        this.CookieService.remove('subject');
        this.CookieService.put('subject', JSON.stringify(data))
    }

    getUserData() {
        if (this.CookieService.get('subject'))
            return JSON.parse(this.CookieService.get('subject'))
        return
    }

    removeUserData() {
        this.CookieService.removeAll();
        this.router.navigate(['auth/signin'])
    }

    get userName() {
        if (this.CookieService.get('subject')){
            let user = JSON.parse(this.CookieService.get('subject'))
            return user.firstname+' '+user.lastname
        }
        return false
    }

    get isToken() {
        if (this.CookieService.get('subject')){
            let user = JSON.parse(this.CookieService.get('subject'))
            return !!user.token
        }

        return false
    }

}
