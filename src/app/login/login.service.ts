import { Injectable } from '@angular/core';

import { Principal } from '../core/auth/principal.service';
import { AuthServerProvider } from '../core/auth/auth-jwt.service';

@Injectable()
export class LoginService {

    constructor(
        private principal: Principal,
        private authServerProvider: AuthServerProvider
    ) {}

    login(credentials, callback?) {
        const cb = callback || function() {};

        return new Promise((resolve, reject) => {
            this.authServerProvider.login(credentials).subscribe((data) => {
                this.principal.identity(true).then((account) => {
                    resolve(data);
                });
                return cb();
            }, (err) => {
                this.logout();
                reject(err);
                return cb(err);
            });
        });
    }

    logout() {
        if (this.principal.isAuthenticated()) {
            this.authServerProvider.logout().subscribe(() => this.principal.authenticate(null));
        } else {
            this.principal.authenticate(null);
        }
    }

    hasRoles() {
        return this.principal.hasRoles();
    }
}
