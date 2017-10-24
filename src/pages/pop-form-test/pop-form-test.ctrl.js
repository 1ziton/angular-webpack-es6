/**
 * 弹窗测试
 */
'use strict'

import ModalInstanceCtrl from './modal-form.ctrl.js';
import ModalContentHtml from './modal-form.html';


export default class PopFormTestCtrl {

    constructor($scope, $timeout, $http, $modal, $document, $log) {
        "ngInject";

        this.items = ['item1111', 'item2', 'item3'];

        this.open = function (size) {

            var modalInstance = $modal.open({
                templateUrl: ModalContentHtml,
                controller: ModalInstanceCtrl,
                controllerAs:'objFrom',
                size: size,
                resolve: {
                    items:  ()=>{
                        return this.items;
                    }
                }
            });

            modalInstance.result.then( (selectedItem)=>{
                $log.info(selectedItem);
                $scope.selected = selectedItem;
            },  ()=>{
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    }


}