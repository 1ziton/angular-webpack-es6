/**
 * Created by giscafer
 * @Date 2017-10-17 17:00:16
 */
import './styles/index.scss';
import angular from 'angular';
// import ngRoute from 'angular-route';
import uiRouter from 'angular-ui-router';
import route from './_route.js';
import homeRoute from './pages/home/home.route.js';
import yztFilters from './filters/_filters.module.js';
import yztPagesComponents from './pages/components/components.module.js';
import components from './components/index.js'
import services from './services/_services.module.js'
// import { COMPONENTS } from './components/_components.js';
/*eslint-disable */
angular.module('ng-app', ['ui.router', components, services, yztFilters, yztPagesComponents])
    .constant('uibPaginationConfig', {
        firstText: '<<',
        previousText: '<',
        nextText: '>',
        lastText: '>>',
        boundaryLinks: true,
        directionLinks: true,
        maxSize: 5
    })
    .config(['uiNotificationProvider', (uiNotificationProvider) => {
        uiNotificationProvider.setOptions({
            delay: 5000,
            startTop: 20,
            startRight: 10,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'right',
            positionY: 'bottom'
        });
    }])
    .config(route) //一级路由
    .config(homeRoute) //首页路由
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
    }])
    .config(['$locationProvider', ( $locationProvider) => {
        // html5路由（需要服务器配置支持）
        // $locationProvider.html5Mode(true);
        //angular路由为兼容低版本浏览器，路由会默认使用标签模式（hashbang）即“/#!/” 具体配置如下：
        $locationProvider.html5Mode(false);
        $locationProvider.hashPrefix('!');
    }])
    .run(['$window', '$rootScope', '$location', ($window, $rootScope) => {
        $window.angular = angular;
        $window.$ = angular.element;
        $rootScope.$on('$routeChangeSuccess', function (event, next, current) {
            /*eslint-disable */
            console.log('route changed');
        });
    }]);