import { Component, OnInit } from '@angular/core';
declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'cat-page',
  templateUrl: './lockscreen.html'
})

export class PagesLockscreen implements OnInit {
  ngOnInit() {

    $(function() {

      // Form Validation
      $('#form-validation').validate({
        submit: {
          settings: {
            inputContainer: '.form-group',
            errorListClass: 'form-control-error',
            errorClass: 'has-danger'
          }
        }
      });

      // Show/Hide Password
      $('.password').password({
        eyeClass: '',
        eyeOpenClass: 'icmn-eye',
        eyeCloseClass: 'icmn-eye-blocked'
      });

      // Switch to fullscreen
      $('.switch-to-fullscreen').on('click', function () {
        $('.cat__pages__login').toggleClass('cat__pages__login--fullscreen');
      })

        // Change BG
        setInterval(function() {

            var min = 1, max = 5,
                next = Math.floor($('.cat__pages__login').data('img')) + 1,
                final = next > max ? min : next;

            $('.cat__pages__login').data('img', final);
            $('.cat__pages__login').data('img', final).css('backgroundImage', 'url(assets/modules/pages/common/img/login/' + final + '.jpg)');


            console.log(final);
        }, 5000);

    });

  }
}

