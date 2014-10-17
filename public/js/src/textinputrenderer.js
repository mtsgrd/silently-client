/**
 * @fileoverview Custom renderer.
 *
 * @author mattias@silently.com (Mattias Granlund)
 */


goog.require('silently.ControlRenderer');
goog.provide('silently.TextInputRenderer');

/**
 * @constructor
 */
silently.TextInputRenderer = function() {
    goog.base(this);
};
goog.inherits(silently.TextInputRenderer, silently.ControlRenderer);
goog.addSingletonGetter(silently.TextInputRenderer);

silently.TextInputRenderer.CSS_CLASS = goog.getCssName('textinput');

silently.TextInputRenderer.prototype.getCssClass = function() {
    return silently.TextInputRenderer.CSS_CLASS;
};

