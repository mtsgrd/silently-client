// Copyright 2014 The Giflike Authors. All Rights Reserved.
//
// License: not open sourced.


/**
 * @fileoverview Control.
 *
 * @author mattias@silently.com (Mattias Granlund)
 */


goog.require('goog.ui.Control');
goog.require('silently.ControlRenderer');
goog.provide('silently.Control');

/**
 * @constructor
 */
silently.Control = function(opt_content, opt_renderer, opt_domHelper) {
    goog.base(this, opt_content, opt_renderer ||
            silently.ControlRenderer.getInstance(), opt_domHelper);
    this.allowTextSelection_ = true;
    this.setSupportedState(goog.ui.Component.State.FOCUSED, false);
    this.handleMouseEvents_ = false;
};
goog.inherits(silently.Control, goog.ui.Control);

silently.Control.prototype.attachEvents = function() {
    // Placeholder for now. To support inheritance.
};

silently.Control.prototype.detachEvents = function() {
    // Placeholder for now. To support inheritance.
};

silently.Control.prototype.enterDocument = function() {
    goog.base(this, 'enterDocument');
};

silently.Control.prototype.disposeInternal = function() {
    goog.base(this, 'disposeInternal');
    this.detachEvents();
};
