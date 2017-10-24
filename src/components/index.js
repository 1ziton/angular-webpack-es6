'use strict'

import Datepicker from './datepicker';

import Notification from './notification';

import uiBootstrap from './bootstrap/index';


const MODULE_NAME = "laoui.bootstrap.components";

angular.module(MODULE_NAME, [Notification, Datepicker, uiBootstrap])


export default MODULE_NAME;
