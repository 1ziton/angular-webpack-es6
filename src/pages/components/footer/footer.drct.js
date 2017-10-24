
import FooterTemp from './footer.html';

class FooterDrct {

    constructor() {
        this.replace = true; //
        this.restrict = 'E'; // element
        this.scope = {};
        this.templateUrl = FooterTemp; //模板路径
        this.controllerAs = 'ctrl'; //controller实例化对象名称
        this.testName="测试。"
        this.model={

        }
    }

    controller( $rootScope, $location, uiNotification) {
        "ngInject";

        // this.logout = ()=> {
        //     userSrv.logout($rootScope.userInfo.userId).then(() => {
        //         $location.url('/login');
        //     }).catch(data => {
        //         uiNotification.error({message: data.resultMsg})
        //     });
        // }
    }

    static factory() {
        return new FooterDrct();
    }
}
export default FooterDrct