/**
 * 弹窗controller
 */
export default class ModelFromCtrl {
    constructor($scope,$modalInstance, items) {
        this.items = items;
        this.selected = {
            item: this.items && this.items[0]
        };

        this.ok = function () {
            $modalInstance.close(this.selected.item);
        };

        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
}