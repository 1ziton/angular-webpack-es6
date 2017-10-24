
/**
 * @author giscafer
 * @date 2017-10-22 16:58:17
 */

import digitUpp from './digit-uppcase.flt.js';
import dateFormat from './date-format.flt.js';

export default angular.module("yzt.filters", [])
    .filter('digitUpp', digitUpp.filter)
    .filter('dateFormat', dateFormat.filter)
    .name;