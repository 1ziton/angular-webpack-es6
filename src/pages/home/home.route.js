/**
 * Created by Giscafer
 */
let pageHtml = {};
let templs = require.context("../", true, /^((?!\/unknown\/).)*.html$/);
let ctrls = require.context("../", true, /^((?!\/unknown\/).)*.ctrl.js$/);
templs.keys().forEach(key => {
    pageHtml[key] = templs(key);
});

export default ($stateProvider, $urlRouterProvider) => {
    "ngInject";

    $stateProvider
        .state('page.home', {
            url: 'home',
            templateUrl: pageHtml['./home/home.html'],
            controller: ctrls('./home/home.ctrl.js').default,
            controllerAs: 'ctrl'
        })
        .state('page.about', {
            title: '关于我们',
            url: 'about',
            templateUrl: pageHtml['./about/about.html'],
            controller: ctrls('./about/about.ctrl.js').default,
            controllerAs: 'ctrl'
        })
}