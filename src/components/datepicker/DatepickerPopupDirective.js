'use strict';
var moment = require('moment-timezone');
var PRISTINE_CLASS = 'ng-pristine',
    DIRTY_CLASS = 'ng-dirty';
var datePickerUtils = require('./_utils.js');
var MODULE_NAME = 'ui.module.uiDatepicker';
var Module = angular.module(MODULE_NAME, []);

Module.constant('datePickerPopupConfig', {
    template: function (attrs, id) {
        return '' +
            '<div ' +
            (id ? 'id="' + id + '" ' : '') +
            'date-picker="' + attrs.ngModel + '" ' +
            (attrs.view ? 'view="' + attrs.view + '" ' : '') +
            (attrs.maxView ? 'max-view="' + attrs.maxView + '" ' : '') +
            (attrs.maxDate ? 'max-date="' + attrs.maxDate + '" ' : '') +
            (attrs.template ? 'template="' + attrs.template + '" ' : '') +
            (attrs.minView ? 'min-view="' + attrs.minView + '" ' : '') +
            (attrs.minDate ? 'min-date="' + attrs.minDate + '" ' : '') +
            (attrs.partial ? 'partial="' + attrs.partial + '" ' : '') +
            (attrs.step ? 'step="' + attrs.step + '" ' : '') +
            (attrs.onSetDate ? 'date-change="' + attrs.onSetDate + '" ' : '') +
            (attrs.ngModel ? 'ng-model="' + attrs.ngModel + '" ' : '') +
            (attrs.firstDay ? 'first-day="' + attrs.firstDay + '" ' : '') +
            (attrs.timezone ? 'timezone="' + attrs.timezone + '" ' : '') +
            (attrs.autoClose ? 'auto-close="' + attrs.autoClose + '" ' : '') +
            (attrs.format ? 'attrs.format="' + attrs.format + '" ' : '') +
            (attrs.disabledDate ? 'disabled-date="' + attrs.disabledDate + '" ' : '') +
            'class="date-picker-date-time" popup="true"></div>';
    },
    format: 'YYYY-MM-DD HH:mm',
    views: ['date', 'year', 'month', 'hours', 'minutes'],
    position: 'relative'
});

Module.directive('dateTimeAppend', function () {
    return {
        link: function (scope, element) {
            element.bind('click', function () {
                element.find('input')[0].focus();
            });
        }
    };
});

Module.directive('uiDatepicker', ['$compile', '$document', '$filter', 'datePickerPopupConfig', '$parse', '$timeout', function ($compile, $document, $filter, datePickerPopupConfig, $parse, $timeout) {
    var body = $document.find('body');
    var dateFilter = $filter('date');
    return {
        require: 'ngModel',
        restrict: 'EA',
        scope: true,
        replace: true,
        template: "<div class='input-group'><input id='dateInput' class='form-control' type='text'/><span class='input-group-addon'><span class='fa fa-calendar'></span></span></div>",
        link: function (scope, element, attrs, ngModel) {
            var format = attrs.format || datePickerPopupConfig.format,
                parentForm = element.inheritedData('$formController'),
                views = $parse(attrs.views)(scope) || datePickerPopupConfig.views.concat(),
                view = attrs.view || views[0],
                index = views.indexOf(view),
                dismiss = attrs.autoClose ? $parse(attrs.autoClose)(scope) : datePickerPopupConfig.autoClose,
                picker = null,
                pickerID = element[0].id,
                position = attrs.position || datePickerPopupConfig.position,
                container = null,
                $dateInput = element.find('#dateInput'),
                minDate = null,
                minValid = null,
                maxDate = null,
                maxValid = null,
                timezone = attrs.timezone || false,
                eventIsForPicker = datePickerUtils.eventIsForPicker,
                dateChange = null,
                shownOnce = false,
                template;

            //更改样式
            if (view === 'time') {
                element.find('span.fa').removeClass('fa-calendar').addClass('fa-clock-o');
            }
            if (index === -1) {
                views.splice(index, 1);
            }

            views.unshift(view);

            function formatter(value) {
                return dateFilter(value, format, timezone);
            }

            function parser(viewValue) {
                if (viewValue.length === format.length) {
                    return viewValue;
                }
                return undefined;
            }

            function setMin(date) {
                minDate = date;
                attrs.minDate = datePickerUtils.createMoment(date);
                minValid = moment.isMoment(date);
            }

            function setMax(date) {
                maxDate = date;
                attrs.maxDate = datePickerUtils.createMoment(date);
                maxValid = moment.isMoment(date);
            }

            ngModel.$formatters.push(formatter);
            //ngModel.$parsers.unshift(parser);

            attrs.$observe('minDate', (value) => {
                if (angular.isDefined(attrs.minDate)) {
                    setMin(datePickerUtils.findParam(scope, attrs.minDate));

                    ngModel.$validators.min = function (value) {
                        //If we don't have a min / max value, then any value is valid.
                        return minValid ? moment.isMoment(value) && (minDate.isSame(value) || minDate.isBefore(value)) : true;
                    };
                }
            });

            attrs.$observe('maxDate', (value) => {
                if (angular.isDefined(attrs.maxDate)) {
                    setMax(datePickerUtils.findParam(scope, attrs.maxDate));

                    ngModel.$validators.max = function (value) {
                        return maxValid ? moment.isMoment(value) && (maxDate.isSame(value) || maxDate.isAfter(value)) : true;
                    };
                }
            });

            if (angular.isDefined(attrs.dateChange)) {
                dateChange = datePickerUtils.findFunction(scope, attrs.dateChange);
            }

            function getTemplate() {
                template = datePickerPopupConfig.template(attrs);
            }


            function updateInput(event) {
                event.stopPropagation();
                if (ngModel.$pristine) {
                    ngModel.$dirty = true;
                    ngModel.$pristine = false;
                    element.removeClass(PRISTINE_CLASS).addClass(DIRTY_CLASS);
                    if (parentForm) {
                        parentForm.$setDirty();
                    }
                    ngModel.$render();
                }
            }

            function clear() {
                if (picker) {
                    picker.remove();
                    picker = null;
                }
                if (container) {
                    container.remove();
                    container = null;
                }

                $document.unbind('click');
            }
            scope.$on('updateDateMode', function (event, type, data) {
                if (data['date']) {
                    let formatDate = formatter(data['date']);
                    $dateInput.attr('value', formatDate);
                    /*setTimeout(()=>{
                       ngModel.$apply(()=>{
                           ngModel.selectDate=formatDate;
                       });
                   });*/
                }
            });
            if (pickerID) {
                scope.$on('pickerUpdate', function (event, pickerIDs, data) {
                    if (eventIsForPicker(pickerIDs, pickerID)) {
                        if (picker) {
                            //Need to handle situation where the data changed but the picker is currently open.
                            //To handle this, we can create the inner picker with a random ID, then forward 
                            //any events received to it.
                        } else {
                            var validateRequired = false;
                            if (angular.isDefined(data.minDate)) {
                                setMin(data.minDate);
                                validateRequired = true;
                            }
                            if (angular.isDefined(data.maxDate)) {
                                setMax(data.maxDate);
                                validateRequired = true;
                            }

                            if (angular.isDefined(data.minView)) {
                                attrs.minView = data.minView;
                            }
                            if (angular.isDefined(data.maxView)) {
                                attrs.maxView = data.maxView;
                            }
                            attrs.view = data.view || attrs.view;

                            if (validateRequired) {
                                ngModel.$validate();
                            }
                            if (angular.isDefined(data.format)) {
                                format = attrs.format = data.format || datePickerPopupConfig.format;
                                ngModel.$modelValue = -1; //Triggers formatters. This value will be discarded.
                            }
                            getTemplate();
                        }
                    }
                });
            }

            function showPicker() {
                if (picker) {
                    return;
                }
                // create picker element
                picker = $compile(template)(scope);
                scope.$digest();

                if (position === 'absolute') {
                    var pos = element[0].getBoundingClientRect();
                    // Support IE8
                    var height = pos.height || element[0].offsetHeight;
                    picker.css({
                        top: (pos.top + height) + 'px',
                        left: pos.left + 'px',
                        display: 'block',
                        position: position
                    });
                    body.append(picker);
                } else {
                    // relative
                    container = angular.element('<div datepicker-wrapper></div>');
                    element[0].parentElement.insertBefore(container[0], element[0]);
                    container.append(picker);
                    //          this approach doesn't work
                    //          element.before(picker);
                    picker.css({
                        top: element[0].offsetHeight + 'px',
                        display: 'block'
                    });
                }
                picker.bind('mousedown', function (evt) {
                    evt.preventDefault();
                });

                $document.bind('click', closePopupWrapper);
            }

            function closePopupWrapper(event) {
                if (event && container && container[0].contains(event.target) || event && element && event.target == element[0]) {
                    return;
                }
                clear();
            }

            element.bind('click', function () {
                $timeout(showPicker, 0);
            });
            getTemplate();


            scope.$on('closePopup', function () {
                clear();
            });
        }
    };
}]);
