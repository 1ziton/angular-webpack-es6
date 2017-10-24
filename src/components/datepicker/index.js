// require('./datepicker-utils.service');
require('./DatepickerPopupDirective');
require('./DatepickerRangePopupDirective');
require('./DatepickerDirective');
require('./moment-zh-cn');

var MODULE_NAME = 'ui.module.datepicker';

angular.module(MODULE_NAME, ['ui.module.date.picker','ui.module.uiDatepicker','ui.module.uiDatepickerRangePopup']);

module.exports = MODULE_NAME;
