'use strict'

export default class HomeCtrl {

	constructor($rootScope, $scope, $location, uiNotification, ApiSrv) {
		"ngInject";
		this.ApiSrv = ApiSrv;
		this.uiNotification = uiNotification;

		this.curMenu = "home"; // 当前菜单
		this.testNumber = 123456;
		this.testDate = new Date();

		this.data = "";
	}

	selectMenu(menu) {
		this.curMenu = menu;
	}

	test() {
		this.uiNotification('请求测试');
		let params = { code: "000000000000" }
		this.ApiSrv('commonController.findAreasByParent', params).then(data => {
			/*eslint-disable */
			console.log(data);
			this.data = JSON.stringify(data);
		}).catch(err => {

		})
	}
	test1() {
		this.uiNotification.error({ message: 'Error Bottom Right', positionY: 'top', positionX: 'right' });
	}
	test2() {
		this.uiNotification.warning({ message: '2秒关闭', positionY: 'top', positionX: 'center', delay: 2000 });
	}
}