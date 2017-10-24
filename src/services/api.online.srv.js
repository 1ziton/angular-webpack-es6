/**
 * Created by giscafer
 */
class ApiService {
    constructor($http, $q, uiNotification, $log) {
        return (link, parameters) => {
            let deferred = $q.defer();
            let url = window.baseUrl + "/api.do";
            link = link.substring(0, 1).toLowerCase() + link.substring(1);
            let params = {
                name: link,
                args: [parameters]
            }
            $http.post(url, params)
                .success((data) => {
                    deferred.resolve(data);
                    // if (data.resultCode == '200') {
                    //     deferred.resolve(data);
                    // } else {
                    //     deferred.promise.catch(data => {
                    //         uiNotification.error({
                    //             title: data.resultMsg,
                    //             message: data.data && data.data.expDesc ? data.data.expDesc : '操作失败'
                    //         });
                    //     });
                    //     deferred.reject(data);
                    // }
                }).error((err) => {
                    uiNotification.error({
                        title: data.resultMsg,
                        message: data.data && data.data.expDesc ? data.data.expDesc : '操作失败'
                    });
                    deferred.reject(err);
                });
            return deferred.promise;
        }
    }

    static factory($http, $q, uiNotification, $log) {
        "ngInject";
        return new ApiService($http, $q, uiNotification, $log);
    }
}
export default ApiService