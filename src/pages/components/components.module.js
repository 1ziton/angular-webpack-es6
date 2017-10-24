/**
 * @author giscafer
 * @date 2017-10-19 16:58:17
 */

 import yztFooter from './footer/footer.drct.js';

export default angular.module("yzt.components", [])
    .directive('yztFooter', yztFooter.factory)
    // .filter('bussTypeTran', bussTypeTran.filter)
    .name;