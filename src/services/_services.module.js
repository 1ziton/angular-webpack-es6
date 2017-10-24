/**
 * Created by giscafer on 2017-10-23 13:58:35.
 */
let services = require.context("./", true, /.srv.js$/);
  /*eslint-disable */
console.log(env);
export default angular.module("ctg.service",[])
    .factory('ApiSrv',services(`./api.${env}.srv.js`).default.factory)
    .factory('httpInterceptor',services("./httpInterceptor.srv.js").default.factory)
    .name;
