/**
 * 帮助中心
 */
'use strict'

export default class HelpCenterCtrl {

	constructor($rootScope, $scope, $location) {
		"ngInject";
		this._$scope=$scope;
		this._$rootScope=$rootScope;
		this._$scope.title = "帮助中心";
		this.ctrlTitle = "ctrlTitle";
	}


}