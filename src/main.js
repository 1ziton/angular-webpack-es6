/**
 * Created by giscafer
 * @Date 2017-10-17 17:00:16
 */
import './styles/index.less';
import angular from 'angular';
// import ngRoute from 'angular-route';
import uiRouter from 'angular-ui-router';
import route from './_route.js';

angular.module('ng-app', ['ui.router'])
    .config(route)
    .run(['$window', '$rootScope', '$location',($window, $rootScope) => {
        $window.angular=angular;
        $window.$ = angular.element;
        $rootScope.title="angular-webpack-es6";
        $rootScope.$on('$routeChangeSuccess', function(event, next, current) {
            /*eslint-disable */
            console.log('route changed');
        });
    }]);