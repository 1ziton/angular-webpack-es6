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
            $location.path('/');
        });
    $stateProvider
        .state('page', {
            title: 'page',
            url: '/',
            templateUrl: pageHtml['./page.html'],
            controller: ctrls('./page.ctrl.js').default,
            controllerAs: 'ctrl'
        })
        .state('register', {
            title: '注册',
            url: '/register',
            templateUrl: pageHtml['./register/register.html'],
            controller: ctrls('./register/register.ctrl.js').default,
            controllerAs: 'ctrl'
        })
        .state('member-center', {
            title: '会员中心',
            url: '/member-center',
            templateUrl: pageHtml['./member-center/member-center.html'],
            controller: ctrls('./member-center/member-center.ctrl.js').default,
            controllerAs: 'ctrl'
        })
        .state('help-center', {
            title: '帮助中心',
            url: '/help-center',
            templateUrl: pageHtml['./help-center/help-center.html'],
            controller: ctrls('./help-center/help-center.ctrl.js').default,
            controllerAs: 'ctrl'
        })
        .state('pop-form-test', {
            title: '弹窗测试demo',
            url: '/pop-form-test',
            templateUrl: pageHtml['./pop-form-test/pop-form-test.html'],
            controller: ctrls('./pop-form-test/pop-form-test.ctrl.js').default,
            controllerAs: 'ctrl'
        })
};
