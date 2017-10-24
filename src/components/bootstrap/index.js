'use strict'

require("./transition/transition");
require("./modal/modal");


const MODULE_NAME = "ui.bootstrap";

angular.module(MODULE_NAME, [
    'ui.bootstrap.transition',
    'ui.bootstrap.modal'
]);

export default MODULE_NAME;
