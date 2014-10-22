/**
 * @fileoverview Subclass of linked map to extend functionality.
 *
 * @author mtsgrd@gmail.com (Mattias Granlund)
 */

goog.provide('silently.LinkedMap');
goog.require('goog.structs.LinkedMap');

/**
 * @constructor
 * @extends
 */
silently.LinkedMap = function(opt_maxCount, opt_cache) {
    goog.base(this, opt_maxCount, opt_cache);
};
goog.inherits(silently.LinkedMap, goog.structs.LinkedMap);


/**
 * Like the original getter, except it returns the node.
 */
silently.LinkedMap.prototype.getNode = function(key) {
    var node = this.findAndMoveToTop_(key);
    return node ? node : opt_val;
};
