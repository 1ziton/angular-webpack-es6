/**
 * Created by Giscafer
 */
let pageHtml = {};
let templs = require.context("./pages/", true, /^((?!\/test\/).)*.html$/);
let ctrls = require.context("./pages/", true, /^((?!\/test\/).)*.ctrl.js$/);
templs.keys().forEach(key => {
    pageHtml[key] = templs(key);
});


export default ($stateProvider, $urlRouterProvider) => {
    "ngInject";
    $urlRouterProvider
        .otherwise(($injector, $location) => {
            $location.path('/home');
        });
    $stateProvider
        .state('home', {
            title: '首页',
            url: '/home',
            templateUrl: pageHtml['./home/home.html'],
            controller: ctrls('./home/home.ctrl.js').default,
            controllerAs: 'home'
        })
};


/* export default $routeProvider => {
    "ngInject";
    $routeProvider
        .when('/demo/home', {
            templateUrl: pageHtml['./home/home.html'],
            controller: ctrls('./home/home.ctrl.js').default,
            controllerAs: 'home',
            reloadOnSearch: false
        })
        .otherwise({
            redirectTo: '/demo/home'
        });
}; */
