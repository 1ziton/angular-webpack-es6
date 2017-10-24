'use strict'

export default class IndexPageCtrl {

	constructor($rootScope, $scope, $location, uiNotification, ApiSrv) {
		"ngInject";
		this.ApiSrv = ApiSrv;
		this.uiNotification = uiNotification;

	}

	selectMenu(menu) {
		this.curMenu = menu;
	}
} 