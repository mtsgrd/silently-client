// Copyright 2014 The Giflike Authors. All Rights Reserved.
//
// License: not open sourced.


/**
 * @fileoverview Control.
 *
 * @author mattias@silently.com (Mattias Granlund)
 */


goog.require('goog.ui.Component');
goog.require('goog.ui.Control');
goog.require('silently.ui.ControlRenderer');
goog.provide('silently.ui.Control');

/**
 * @constructor
 */
silently.ui.Control = function(opt_content, opt_renderer, opt_domHelper) {
    goog.base(this, opt_content, opt_renderer ||
            silently.ui.ControlRenderer.getInstance(), opt_domHelper);
    this.allowTextSelection_ = true;
    this.setSupportedState(goog.ui.Component.State.FOCUSED, false);
    this.handleMouseEvents_ = false;
};
goog.inherits(silently.ui.Control, goog.ui.Control);

silently.ui.Control.prototype.attachEvents = function() {
    // Placeholder for now. To support inheritance.
};

silently.ui.Control.prototype.detachEvents = function() {
    // Placeholder for now. To support inheritance.
};

silently.ui.Control.prototype.enterDocument = function() {
    goog.base(this, 'enterDocument');
};

silently.ui.Control.prototype.disposeInternal = function() {
    goog.base(this, 'disposeInternal');
    this.detachEvents();
};
