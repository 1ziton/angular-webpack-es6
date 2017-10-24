'use strict';
var moment = require('moment-timezone');
var datePickerUtils=require('./_utils.js');
var PRISTINE_CLASS = 'ng-pristine',
    DIRTY_CLASS = 'ng-dirty';

var MODULE_NAME = 'ui.module.uiDatepickerRangePopup';
var Module = angular.module(MODULE_NAME,[]);

Module.constant('datePickerRangePopupConfig', {
    template: function(attrs, id) {
        return '' +
            '<div ' +
            (id ? 'id="' + id + '" ' : '') +
            'ui-datepicker="' + attrs.ngModel + '" ' +
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
            (attrs.disabledDate ? 'disabled-date="' + attrs.disabledDate + '" ' : '') +
            'class="date-picker-date-time" popup="true"></div>';
    },
    format: 'yyyy-MM-dd HH:mm',
    views: ['date', 'year', 'month', 'hours', 'minutes'],
    position: 'relative'
});

Module.directive('dateTimeRangeAppend', function() {
    return {
        link: function(scope, element) {
            element.bind('click', function() {
                element.find('input')[0].focus();
            });
        }
    };
});

Module.directive('uiDatepickerRangePopup', ['$compile', '$document', '$filter', 'datePickerRangePopupConfig', '$parse',  '$timeout', function($compile, $document, $filter, datePickerRangePopupConfig, $parse, $timeout) {
    var body = $document.find('body');
    var dateFilter = $filter('date');

    function randomName() {
        return 'picker' + Math.random().toString().substr(2);
    }

    return {
        require: 'ngModel',
        scope: true,
        link: function(scope, element, attrs, ngModel) {
            var format = attrs.format || datePickerRangePopupConfig.format,
                parentForm = element.inheritedData('$formController'),
                views = $parse(attrs.views)(scope) || datePickerRangePopupConfig.views.concat(),
                view = attrs.view || views[0],
                index = views.indexOf(view),
                dismiss = attrs.autoClose ? $parse(attrs.autoClose)(scope) : datePickerRangePopupConfig.autoClose,
                picker = null,
                pickerID = element[0].id,
                pickerIDs = [randomName(), randomName()],
                position = attrs.position || datePickerRangePopupConfig.position,
                container = null,
                minDate = null,
                minValid = null,
                maxDate = null,
                maxValid = null,
                timezone = attrs.timezone || false,
                eventIsForPicker = datePickerUtils.eventIsForPicker,
                dateChange = null,
                shownOnce = false,
                template;

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
            ngModel.$parsers.unshift(parser);

            if (angular.isDefined(attrs.minDate)) {
                setMin(datePickerUtils.findParam(scope, attrs.minDate));

                ngModel.$validators.min = function(value) {
                    //If we don't have a min / max value, then any value is valid.
                    return minValid ? moment.isMoment(value) && (minDate.isSame(value) || minDate.isBefore(value)) : true;
                };
            }

            if (angular.isDefined(attrs.maxDate)) {
                setMax(datePickerUtils.findParam(scope, attrs.maxDate));

                ngModel.$validators.max = function(value) {
                    return maxValid ? moment.isMoment(value) && (maxDate.isSame(value) || maxDate.isAfter(value)) : true;
                };
            }

            if (angular.isDefined(attrs.dateChange)) {
                dateChange = datePickerUtils.findFunction(scope, attrs.dateChange);
            }

            // function getTemplate() {
            //     template = datePickerRangePopupConfig.template(attrs);
            // }


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

            if (pickerID) {
                scope.$on('pickerUpdate', function(event, pickerIDs, data) {
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

            function getTemplate(attrs, id, model, min, max) {
              return datePickerRangePopupConfig.template(angular.extend(attrs, {
                  ngModel: model,
                  //minDate: min && moment.isMoment(min) ? min.format() : false,
                  //maxDate: max && moment.isMoment(max) ? max.format() : false
                }), id);
            }

            function showPicker() {
                if (picker) {
                    return;
                }
                // create picker element

                var _template = '<div><table class="date-range"><tr><td valign="top">' +
                    getTemplate(attrs, pickerIDs[0], attrs.ngModel, false, scope.end) +
                    '</td><td valign="top">' +
                    getTemplate(attrs, pickerIDs[1], 'end', scope.start, false) +
                  '</td></tr></table></div>';
                  
                picker = $compile(_template)(scope);
                scope.$digest();

                // move picker below input element

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
                picker.bind('mousedown', function(evt) {
                    evt.preventDefault();
                });

                $document.bind('click', closePopupWrapper);
            }

            function closePopupWrapper(event) {
                if(event && container && container[0].contains(event.target) || event && element && event.target == element[0]) {
                    return;
                }
                clear();
            }

            element.bind('click', function() {
                $timeout(showPicker, 0);
            });
            //getTemplate();


            scope.$on('closePopup', function() {
                clear();
            });
        }
    };
}]);
