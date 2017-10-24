/**
 * 注册页面
 */
'use strict';

export default class RegisterCtrl {

    constructor($rootScope, $scope, $location, ApiSrv) {
        "ngInject";
        this._$scope = $scope;
        this._$scope.title = "注册";
        this.ctrlTitle = "ctrlTitle";
        this.ApiSrv = ApiSrv;
        // 绑定属性
        this._$scope.phoneNumber = '';
        this._$scope.verifyCode = '';
        this._$scope.loginPass = '';
        this._$scope.confirmPass = '';
        this._$scope.userName = '';
        this._$scope.location = '';
        this._$scope.detailedAddress = '';
        this._$scope.invitationCode = '';
        // 正则
        this.phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
        this.emailReg = new RegExp("^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+([.][a-zA-Z0-9_-]+)+$");
    }

    /**
     * method
     */
    /* eslint-disable */
    cusValidate() {
        if (this.phoneReg.test(this._$scope.phoneNumber)) {
            this._$scope.invitationCode = 'scrum';
            return false;
            console.log(this._scope.invitationCode);
        }
        return true;
    }

    getVerifyCode() {

        }
        /* eslint-disable */
}