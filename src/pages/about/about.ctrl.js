/**
 * 会员中心
 */
'use strict'

export default class AboutCtrl {

	constructor($rootScope, $scope, $location) {
        "ngInject";
		this._$scope = $scope;
		this._$scope.title = "会员中心";
		this.ctrlTitle = "ctrlTitle";
	}


}