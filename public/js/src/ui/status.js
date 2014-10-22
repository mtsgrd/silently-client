/**
 * @fileoverview Text container that can revert to original text.
 *
 * @author mattias@silently.com (Mattias Granlund)
 */

goog.provide('silently.ui.Status');

goog.require('goog.ui.Component');

/**
 * @constructor
 */
silently.ui.Status = function() {
    goog.base(this);
};
goog.inherits(silently.ui.Status, goog.ui.Component);

silently.ui.Status.prototype.decorateInternal = function(element) {
    goog.base(this, 'decorateInternal', element);
    this.originalContent = this.element_.innerHTML;
};

silently.ui.Status.prototype.reset = function(element) {
    this.element_.innerHTML = this.originalContent;
};

silently.ui.Status.prototype.set = function(text) {
    this.element_.innerHTML = text;
};
