/**
 * @fileoverview Subclassed component with our special saunce..
 *
 * @author mtsgrd@gmail.com (Mattias Granlund)
 */

goog.provide('silently.ui.Component');
goog.require('goog.dom.classlist');
goog.require('goog.ui.Component');

/**
 * @constructor
 */
silently.ui.Component = function(opt_domHelper) {
    goog.base(this, opt_domHelper);
};
goog.inherits(silently.ui.Component, goog.ui.Component);

/**
 * Conveience method for visibility class.
 * @param {boolean} visible Visibility indicator.
 */
silently.ui.Component.prototype.setVisible = function(visible) {
    goog.dom.classlist.enable(this.element_, goog.getCssName('visible'),
            visible);
};
