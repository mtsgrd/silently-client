/**
 * @fileoverview Text container that can revert to original text.
 *
 * @author mattias@silently.com (Mattias Granlund)
 */

goog.provide('silently.Status');

/**
 * @constructor
 */
silently.Status = function() {
    goog.base(this);
};
goog.inherits(silently.Status, goog.ui.Component);

silently.Status.prototype.decorateInternal = function(element) {
    goog.base(this, 'decorateInternal', element);
    this.originalContent = this.element_.innerHTML;
};

silently.Status.prototype.reset = function(element) {
    this.element_.innerHTML = this.originalContent;
};

silently.Status.prototype.set = function(text) {
    this.element_.innerHTML = text;
};
