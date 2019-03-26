import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LoginService} from './login.service';
import {StateStorageService} from '../core/auth/state-storage.service';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'cat-page',
  templateUrl: './login.html'
})

export class PagesLogin implements OnInit {
    authenticationError: boolean;

    constructor(
        private router:Router,
        private loginService: LoginService,
        private stateStorageService: StateStorageService
    ){}

  ngOnInit() {
      const newThis = this;
      $(function() {

      // Form Validation
      $('#form-validation').validate({
        submit: {
          settings: {
            inputContainer: '.form-group',
            errorListClass: 'form-control-error',
            errorClass: 'has-danger'
          },
        callback: {
            onSubmit: function (node, formData) {
                newThis.loginService.login({
                    username: formData.validation.username,
                    password: formData.validation.password,
                    rememberMe: formData.rememberMe
                }).then(() => {
                    newThis.authenticationError = false;
                    //没有绑定角色，跳回到登录界面，提醒无权操作。
                    if(newThis.loginService.hasRoles()){
                        const redirect = newThis.stateStorageService.getUrl();
                        if (redirect) {
                            newThis.stateStorageService.storeUrl(null);
                            newThis.router.navigate([redirect]);
                        }else{
                            newThis.router.navigate(['/dashboard']);
                        }
                    }else{
                        newThis.authenticationError = true;
                        newThis.loginService.logout();
                    }

                }).catch(() => {
                    newThis.authenticationError = true;
                });
            }
        }
        }
      });

      // Show/Hide Password
      $('.password').password({
        eyeClass: '',
        eyeOpenClass: 'icmn-eye',
        eyeCloseClass: 'icmn-eye-blocked'
      });

      // Change BG
      setInterval(function() {
           var min = 1, max = 5,
              next = Math.floor($('.cat__pages__login').data('img')) + 1,
              final = next > max ? min : next;

           $('.cat__pages__login').data('img', final);
           $('.cat__pages__login').data('img', final).css('backgroundImage', 'url(assets/modules/pages/common/img/login/' + final + '.jpg)');
       }, 5000);

    });
  }

    register() {
       this.router.navigate(['/register']);
    }

    requestResetPassword() {
        this.router.navigate(['/reset', 'request']);
    }

}

