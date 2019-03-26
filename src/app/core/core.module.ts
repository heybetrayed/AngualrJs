import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreService} from './core.service';
import {AccountService} from './auth/account.service';
import {AuthServerProvider} from './auth/auth-jwt.service';
import {UserRouteAccessService} from './auth/user-route-access-service';
import {StateStorageService} from './auth/state-storage.service';
import {Principal} from './auth/principal.service';
import {HasAnyAuthorityDirective} from './auth/has-any-authority.directive';
import {CSRFService} from './auth/csrf.service';
import {AuxiliaryService} from './storage/auxiliary-service';
import {EqualValidator} from './validator/equal-validator';
import {SliceStrPipe} from './pipe/SliceStrPipe';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        EqualValidator,
        SliceStrPipe,
        HasAnyAuthorityDirective
    ],
    providers: [
        CoreService,
        AccountService,
        AuthServerProvider,
        UserRouteAccessService,
        StateStorageService,
        Principal,
        CSRFService,
        AuxiliaryService

    ],
    exports: [
        SliceStrPipe
    ]
})
export class CoreModule {
}
