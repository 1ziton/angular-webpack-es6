'use strict';
var moment = require('moment-timezone');
// console.log(moment.tz)
var datePickerUtils=require('./_utils.js');
var MODULE_NAME = 'ui.module.date.picker';
var Module = angular.module(MODULE_NAME,[]);


Module.constant('uiDatePickerConstant', {
    template: require('./template/datepicker.html'),
    view: 'month',
    format: 'yyyy-MM-dd',
    autoClose: true,
    step: 5,
    firstDay: 0, //Sunday is the first day by default.
    views: ['year', 'month', 'date', 'datetime', 'time', 'hours', 'minutes'],
    momentNames: {
        year: 'year',
        month: 'month',
        date: 'day',
        datetime: 'day',
        hours: 'hours',
        minutes: 'minutes',
        time: 'time'
    },
    viewConfig: {
        year: ['years', 'isSameYear'],
        month: ['months', 'isSameMonth'],
        hours: ['hours', 'isSameHour'],
        minutes: ['minutes', 'isSameMinutes']
    }
});

//Moment format filter.
Module.filter('mFormat', function() {
    return function(m, format, tz) {
        if (!m) {
            return;
        }
        if (!(moment.isMoment(m))) {
            if(typeof m === 'object') {
                return moment(m).format(format);
            } else {
                return moment.unix(m.toString().substr(0, 10)).format(format);
            }
            
        }
        return tz ? moment.tz(m, tz).format(format) : m.format(format);
    };
});


Module.directive('datePicker', ['uiDatePickerConstant', '$filter', function datePickerDirective(uiDatePickerConstant,$filter) {

    //noinspection JSUnusedLocalSymbols
    return {
        // this is a bug ?
        require: '?ngModel',
        restrict:'EA',
        template: '<div datepicker-view="" ng-include="template"></div>',
        scope: {
            model: '=datePicker',
            after: '=?',
            selectDate: '=',
            popup: '=',
            disabledDate: '&'
        },
        link: function(scope, element, attrs, ngModel) {
            function prepareViews() {
                scope.views = uiDatePickerConstant.views.concat();
                scope.view = attrs.view || uiDatePickerConstant.view;

                scope.views = scope.views.slice(
                    scope.views.indexOf(attrs.maxView || 'year'),
                    scope.views.indexOf(attrs.minView || 'minutes') + 1
                );

                if (scope.views.length === 1 || scope.views.indexOf(scope.view) === -1) {
                    scope.view = scope.views[0];
                }
            }

            function getDate(name) {
                return datePickerUtils.getDate(scope, attrs, name);
            }

            var arrowClick = false,
                format = attrs.format || uiDatePickerConstant.format,
                tz = scope.tz = attrs.timezone,
                createMoment = datePickerUtils.createMoment,
                eventIsForPicker = datePickerUtils.eventIsForPicker,
                setPad = datePickerUtils.setPad,
                step = parseInt(attrs.step || uiDatePickerConstant.step, 10),
                partial = !!attrs.partial,
                minDate = getDate('minDate'),
                maxDate = getDate('maxDate'),
                pickerID = element[0].id,
                now = scope.now = moment().hour(0).startOf('h'),
                selected = scope.date = createMoment(scope.model || now),
                autoClose = attrs.autoClose ? attrs.autoClose === 'true' : uiDatePickerConstant.autoClose,
                firstDay = attrs.firstDay && attrs.firstDay >= 0 && attrs.firstDay <= 6 ? parseInt(attrs.firstDay, 10) : uiDatePickerConstant.firstDay;


            datePickerUtils.setParams(tz, firstDay);


            if (!scope.model) {
                //selected.minute(Math.ceil(selected.minute() / step) * step).second(0);

                scope.time = {
                    hour: '00',
                    minute: '00',
                    second: '00'
                };
            } else {
                scope.time = {
                    hour: setPad(selected.hour()),
                    minute: setPad(selected.minute()),
                    second: setPad(selected.second())
                };
            }

            scope.template = attrs.template || uiDatePickerConstant.template;

            scope.callbackOnSetDate = attrs.dateChange ? datePickerUtils.findFunction(scope, attrs.dateChange) : undefined;

            prepareViews();

            scope.setView = function(nextView) {
                if (scope.views.indexOf(nextView) !== -1) {
                    scope.view = nextView;
                }
            };

            scope.focusYear = function($event, date) {
                var year = date.year();
                var dropdown = angular.element($event.target).next();
                var currentYear = dropdown.find('.active');
                dropdown[0].scrollTop = currentYear[0].offsetTop;
            }

            scope.focusMonth = function($event, date) {
                var month = date.month();
                var dropdown = $($event.target).next();
                var currentMonth = dropdown.find('.active');
                dropdown[0].scrollTop = currentMonth[0].offsetTop;
            }

            scope.selectYear = function(year) {
                year = moment.isMoment(year) ? year.year() : year;
                setYear(year);
                prepareViewData();
                if(scope.view === 'year' && autoClose) {
                    scope.closePopup();
                }
            };

            scope.selectMonth = function(month) {
                month = moment.isMoment(month) ? month.month() : month;
                setMonth(month);
                prepareViewData();
                if(scope.view === 'month' && autoClose) {
                    scope.closePopup();
                }
            };

            scope.selectHour = function(hour) {
                hour = moment.isMoment(hour) ? setPad(hour.hour()) : (hour > 23 ? 23 : hour);
                scope.time.hour = hour;
                setHour(hour);
            };

            scope.selectMinute = function(minute) {
                minute = moment.isMoment(minute) ? setPad(minute.minute()) : (minute > 59 ? 59 : minute);
                scope.time.minute = minute;
                setMinute(minute);
            };

            scope.selectSecond = function(second) {
                second = moment.isMoment(second) ? setPad(second.second()) : (second > 59 ? 59 : second);
                scope.time.second = second;
                setSecond(second);
            };

            scope.selectDate = function($event, date) {
                if(angular.element($event.target).hasClass('disabled')) {
                    return;
                }

                setDate(date);
                prepareViewData();
                if(scope.view === 'date' && autoClose) {
                    scope.closePopup();
                }
            };

            function setYear(year) {
                var date = scope.date.year(year);
                var timestamp = date.format('x');
                scope.model = timestamp;
                if (ngModel) {
                    updateDateMode(timestamp,'setYear');
                    ngModel.$setViewValue(timestamp);
                }
            }

            function setMonth(month) {
                var date = scope.date.month(month);
                var timestamp = date.format('x');
                scope.model = timestamp;
                if (ngModel) {
                     updateDateMode(timestamp,'setMonth');
                    ngModel.$setViewValue(timestamp);
                }
            }

            function setDate(date) {
                if (date) {
                    var _date = scope.date;
                    var timestamp;
                    _date = _date.date(date.date());
                    _date = _date.month(date.month());
                    _date = _date.year(date.year());
                    timestamp = _date.format('x');
                    scope.model = timestamp;
                    if (ngModel) {
                        updateDateMode(timestamp,'setDate');
                        ngModel.$setViewValue(timestamp);
                    }
                }
            }

            function setHour(hour) {
                var date = scope.date.hour(hour);
                var timestamp = date.format('x');
                scope.model = timestamp;
                if (ngModel) {
                    updateDateMode(timestamp,'setHour');
                    ngModel.$setViewValue(timestamp);
                }
            }

            function setMinute(minute) {
                var date = scope.date.minute(minute);
                var timestamp = date.format('x');
                scope.model = timestamp;
                if (ngModel) {
                    updateDateMode(timestamp,'setMinute');
                    ngModel.$setViewValue(timestamp);
                }
            }

            function setSecond(second) {
                var date = scope.date.second(second);
                var timestamp = date.format('x');
                scope.model = timestamp;
                if (ngModel) {
                    updateDateMode(timestamp,'setSecond');
                    ngModel.$setViewValue(timestamp);
                }
            }
            function formatter(value) {
                return $filter('date')(value, format, tz);
            }
            //更新时间
            function updateDateMode(value,type){
                let formatDate =formatter(value);
                scope.$emit('updateDateMode',type, {
                    date: value,
                    formatDate:formatDate
                });
                /*setTimeout(()=>{
                    scope.$apply(()=>{
                        scope.selectDate=formatDate;
                    })
                })*/
            }
            function update() {
                var view = scope.view;
                datePickerUtils.setParams(tz, firstDay);

                var date = scope.date;

                switch (view) {
                    case 'year':
                        scope.years = datePickerUtils.getVisibleYears(date);
                        break;
                    case 'month':
                        scope.months = datePickerUtils.getVisibleMonths(date);
                        break;
                    case 'date':
                        if(!scope.years) {
                            scope.years = datePickerUtils.getAllYears(date);
                        }
                        if(!scope.months) {
                            scope.months = datePickerUtils.getVisibleMonths(date);
                        }
                        if(!scope.weekdays) {
                            scope.weekdays = scope.weekdays || datePickerUtils.getDaysOfWeek();
                        }
                        scope.weeks = datePickerUtils.getVisibleWeeks(date);
                        break;
                    case 'datetime':
                        if(!scope.years) {
                            scope.years = datePickerUtils.getAllYears(date);
                        }
                        if(!scope.months) {
                            scope.months = datePickerUtils.getVisibleMonths(date);
                        }
                        if(!scope.weekdays) {
                            scope.weekdays = scope.weekdays || datePickerUtils.getDaysOfWeek();
                        }
                        scope.weeks = datePickerUtils.getVisibleWeeks(date);
                        scope.hours = datePickerUtils.getVisibleHours(date);
                        scope.minutes = datePickerUtils.getVisibleMinutes(date, step);
                        scope.seconds = datePickerUtils.getVisibleSeconds(date, step);
                        break;
                    case 'time':
                        scope.hours = datePickerUtils.getVisibleHours(date);
                        scope.minutes = datePickerUtils.getVisibleMinutes(date, step);
                        scope.seconds = datePickerUtils.getVisibleSeconds(date, step);
                        break;
                    case 'hours':
                        scope.hours = datePickerUtils.getVisibleHours(date);
                        break;
                    case 'minutes':
                        scope.minutes = datePickerUtils.getVisibleMinutes(date, step);
                        break;
                }

                prepareViewData();
            }

            function watchYear() {
                return scope.date ? scope.date.year() : null;
            }

            function watchMonth() {
                return scope.date ? scope.date.month() : null;
            }

            scope.$watch(watchYear, update);
            scope.$watch(watchMonth, update);

            function prepareViewData() {
                var view = scope.view,
                    date = scope.date,
                    classes = [],
                    classList = '',
                    i, j;

                datePickerUtils.setParams(tz, firstDay);

                if (view === 'time') {
                    return;
                }

                if (view === 'datetime' || view === 'date') {
                    var weeks = scope.weeks,
                        week;
                    for (i = 0; i < weeks.length; i++) {
                        week = weeks[i];
                        classes.push([]);
                        for (j = 0; j < week.length; j++) {
                            classList = '';
                            if (datePickerUtils.isSameDay(date, week[j])) {
                                classList += 'active';
                            }
                            if (isNow(week[j], view)) {
                                classList += ' now';
                            }
                            //if (week[j].month() !== date.month()) classList += ' disabled';
                            if (week[j].month() !== date.month() || !inValidRange(week[j]) || scope.disabledDate({date: week[j].format('x')})) {
                            //if (!inValidRange(week[j]) || scope.disabledDate({date: week[j].format('x')})) {
                                classList += ' disabled';
                            }
                            classes[i].push(classList);
                        }
                    }
                } else {
                    var params = uiDatePickerConstant.viewConfig[view],
                        dates = scope[params[0]],
                        compareFunc = params[1];

                    for (i = 0; i < dates.length; i++) {
                        classList = '';
                        if (datePickerUtils[compareFunc](date, dates[i])) {
                            classList += 'active';
                        }
                        if (isNow(dates[i], view)) {
                            classList += ' now';
                        }
                        if (!inValidRange(dates[i])) {
                            classList += ' disabled';
                        }
                        classes.push(classList);
                    }
                }
                scope.classes = classes;
            }

            scope.next = function(delta) {
                var date = moment(scope.date);
                delta = delta || 1;
                switch (scope.view) {
                    case 'year':
                        /*falls through*/
                    case 'month':
                        date.year(date.year() + delta);
                        break;
                    case 'date':
                        date.month(date.month() + delta);
                        break;
                    case 'datetime':
                        date.month(date.month() + delta);
                        break;
                    case 'hours':
                        /*falls through*/
                    case 'minutes':
                        date.hours(date.hours() + delta);
                        break;
                }
                date = clipDate(date);
                if (date) {
                    scope.date = date;
                    setDate(date);
                    arrowClick = true;
                    update();
                }
            };

            function inValidRange(date) {
                var valid = true;
                if (minDate && minDate.isAfter(date)) {
                    valid = isSame(minDate, date);
                }
                if (maxDate && maxDate.isBefore(date)) {
                    valid &= isSame(maxDate, date);
                }
                return valid;
            }

            function isSame(date1, date2) {
                return date1.isSame(date2, uiDatePickerConstant.momentNames[scope.view]) ? true : false;
            }

            function clipDate(date) {
                if (minDate && minDate.isAfter(date)) {
                    return minDate;
                } else if (maxDate && maxDate.isBefore(date)) {
                    return maxDate;
                } else {
                    return date;
                }
            }

            function isNow(date, view) {
                var is = true;

                switch (view) {
                    case 'minutes':
                        is &= ~~(now.minutes() / step) === ~~(date.minutes() / step);
                        /* falls through */
                    case 'hours':
                        is &= now.hours() === date.hours();
                        /* falls through */
                    case 'date':
                        is &= now.date() === date.date();
                        /* falls through */
                    case 'datetime':
                        is &= now.date() === date.date();
                        /* falls through */
                    case 'month':
                        is &= now.month() === date.month();
                        /* falls through */
                    case 'year':
                        is &= now.year() === date.year();
                }
                return is;
            }

            scope.prev = function(delta) {
                return scope.next(-delta || -1);
            };

            if (pickerID) {
                scope.$on('pickerUpdate', function(event, pickerIDs, data) {
                    if (eventIsForPicker(pickerIDs, pickerID)) {
                        var updateViews = false,
                            updateViewData = false;

                        if (angular.isDefined(data.minDate)) {
                            minDate = data.minDate ? createMoment(data.minDate) : false;
                            updateViewData = true;
                        }
                        if (angular.isDefined(data.maxDate)) {
                            maxDate = data.maxDate ? createMoment(data.maxDate) : false;
                            updateViewData = true;
                        }

                        if (angular.isDefined(data.minView)) {
                            attrs.minView = data.minView;
                            updateViews = true;
                        }
                        if (angular.isDefined(data.maxView)) {
                            attrs.maxView = data.maxView;
                            updateViews = true;
                        }
                        attrs.view = data.view || attrs.view;

                        if (updateViews) {
                            prepareViews();
                        }

                        if (updateViewData) {
                            update();
                        }
                    }
                });
            }

            scope.today = function() {
                selected = scope.date = createMoment(now);
                var timestamp = scope.date.format('x');
                scope.model = timestamp;
                if (ngModel) {
                    ngModel.$setViewValue(timestamp);
                }
                prepareViewData();
            };

            scope.closePopup = function() {
                scope.$emit('closePopup');
            };
        }
    };
}]);


Module.directive('dateRange', ['$compile', 'datePickerPopupConfig', function ($compile,  datePickerPopupConfig) {
  function getTemplate(attrs, id, model, min, max) {
    return datePickerPopupConfig.template(angular.extend(attrs, {
      ngModel: model,
      //minDate: min && moment.isMoment(min) ? min.format() : false,
      //maxDate: max && moment.isMoment(max) ? max.format() : false
    }), id);
  }

  function randomName() {
    return 'picker' + Math.random().toString().substr(2);
  }

  return {
    scope: {
      start: '=',
      end: '='
    },
    link: function (scope, element, attrs) {
      var dateChange = null,
          pickerRangeID = element[0].id,
          pickerIDs = [randomName(), randomName()],
          createMoment = datePickerUtils.createMoment,
          eventIsForPicker = datePickerUtils.eventIsForPicker;

      scope.dateChange = function (modelName, newDate) {
        //Notify user if callback exists.
        if (dateChange) {
          dateChange(modelName, newDate);
        }
      };

      function setMax(date) {
        scope.$broadcast('pickerUpdate', pickerIDs[0], {
          maxDate: date
        });
      }

      function setMin(date) {
        scope.$broadcast('pickerUpdate', pickerIDs[1], {
          minDate: date
        });
      }

      if (pickerRangeID) {
        scope.$on('pickerUpdate', function (event, targetIDs, data) {
          if (eventIsForPicker(targetIDs, pickerRangeID)) {
            //If we received an update event, dispatch it to the inner pickers using their IDs.
            scope.$broadcast('pickerUpdate', pickerIDs, data);
          }
        });
      }

      datePickerUtils.setParams(attrs.timezone);

      // scope.start = createMoment(scope.start);
      // scope.end = createMoment(scope.end);

      // scope.$watchGroup(['start', 'end'], function (dates) {
      //   //Scope data changed, update picker min/max
      //   setMin(dates[0]);
      //   setMax(dates[1]);
      // });

      if (angular.isDefined(attrs.dateChange)) {
        dateChange = datePickerUtils.findFunction(scope, attrs.dateChange);
      }

      attrs.onSetDate = 'dateChange';

      var template = '<div><table class="date-range"><tr><td valign="top">' +
                    getTemplate(attrs, pickerIDs[0], 'start', false, scope.end) +
                    '</td><td valign="top">' +
                    getTemplate(attrs, pickerIDs[1], 'end', scope.start, false) +
                  '</td></tr></table></div>';

      var picker = $compile(template)(scope);
      element.append(picker);
    }
  };


}]);
