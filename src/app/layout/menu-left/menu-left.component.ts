import {Component, Input, OnChanges, OnInit, Renderer2, SimpleChanges} from '@angular/core';
import {Router} from '@angular/router';
import {Permission} from './permission';
import {Application} from '../header/application';


declare var $: any;
declare var jQuery: any;

@Component({
    selector: 'cat-menu-left',
    templateUrl: './menu-left-horizontal.component.html',
})
export class MenuLeftComponent implements OnInit,OnChanges {

    menushow: boolean = true;
    basepath: string = '/dashboard';
    @Input() application: Application;
    @Input() permissions: Array<Permission> = [];

    colorfulClasses: String = 'cat__menu-left--colorful--primary cat__menu-left--colorful--secondary cat__menu-left--colorful--primary cat__menu-left--colorful--default cat__menu-left--colorful--info cat__menu-left--colorful--success cat__menu-left--colorful--warning cat__menu-left--colorful--danger cat__menu-left--colorful--yellow';
    colorfulClassesArray: String[] = this.colorfulClasses.split(' ');

    constructor(private router: Router,
                private render2: Renderer2) {

    }

    ngOnInit(): void {

    }

    ngOnChanges(changes: SimpleChanges): void {
        if(changes['application'] && changes['application'].currentValue) {
            // 根据当前登录人的权限显示系统
            this.application = changes['application'].currentValue;
            this.basepath = this.application.basepath;
            if(this.application.name == '前端UI'){
                this.menushow = false;
            }
        }

        const that = this;
        // 调用菜单初始化js
        $(function () {
            // scripts for "menu-left" module
            /////////////////////////////////////////////////////////////////////////////////////////
            // add backdrop

            $('.cat__menu-left').after('<div class="cat__menu-left__backdrop cat__menu-left__action--backdrop-toggle"><!-- --></div>');

            /////////////////////////////////////////////////////////////////////////////////////////
            // submenu
            $('.cat__menu-left__submenu > a').unbind("click").bind('click', function () {

                if ($('body').hasClass('cat__config--vertical') || $('body').width() < 768) {

                    var parent = $(this).parent(),
                        opened = $('.cat__menu-left__submenu--toggled');

                    if (!parent.hasClass('cat__menu-left__submenu--toggled') && !parent.parent().closest('.cat__menu-left__submenu').length)
                        opened.removeClass('cat__menu-left__submenu--toggled').find('> .cat__menu-left__list').slideUp(200);

                    parent.toggleClass('cat__menu-left__submenu--toggled');
                    parent.find('> .cat__menu-left__list').slideToggle(200);

                }

            });

            // remove submenu toggle class when viewport back to full view
            $(window).on('resize', function () {
                if ($('body').hasClass('cat__config--horizontal') || $('body').width() > 768) {
                    $('.cat__menu-left__submenu--toggled').removeClass('cat__menu-left__submenu--toggled').find('> .cat__menu-left__list')
                        .attr('style', '');
                }
            });

            /////////////////////////////////////////////////////////////////////////////////////////
            // custom scroll init
            if ($('body').hasClass('cat__config--vertical')) {
                if (!(/Mobi/.test(navigator.userAgent)) && jQuery().jScrollPane) {
                    $('.cat__menu-left__inner').each(function () {
                        $(this).jScrollPane({
                            contentWidth: '0px',
                            autoReinitialise: true,
                            autoReinitialiseDelay: 100
                        });
                        var api = $(this).data('jsp'),
                            throttleTimeout;
                        $(window).bind('resize', function () {
                            if (!throttleTimeout) {
                                throttleTimeout = setTimeout(function () {
                                    api.reinitialise();
                                    throttleTimeout = null;
                                }, 50);
                            }
                        });
                    });
                }
            }

        });

        /////////////////////////////////////////////////////////////////////////////////////////
        // colorful menu
        let bodyClass = document.body.classList;
        if (bodyClass.contains('cat__menu-left--colorful')) {
            that.setColorfulClasses();
        }

    }

    toggle() {
        let classStr = document.body.classList.toString();
        this.render2.removeAttribute(document.body, 'class');
        if (document.body.clientWidth < 768) {
            if (classStr.search('cat__menu-left--visible--mobile') > 0) {
                this.render2.setAttribute(document.body, 'class', classStr.replace('cat__menu-left--visible--mobile', ''));
            } else {
                this.render2.setAttribute(document.body, 'class', classStr + ' cat__menu-left--visible--mobile');
            }
        } else {
            if (classStr.search('cat__menu-left--visible') > 0) {
                this.render2.setAttribute(document.body, 'class', classStr.replace('cat__menu-left--visible', ''));
            } else {
                this.render2.setAttribute(document.body, 'class', classStr + ' cat__menu-left--visible');
            }
        }
    }

    setColorfulClasses() {
        const that = this;
        $('.cat__menu-left__list--root > .cat__menu-left__item').each(function () {
            let randomClass = that.colorfulClassesArray[Math.floor(Math.random() * that.colorfulClassesArray.length)];
            $(this).addClass(randomClass);
        })
    }

}
