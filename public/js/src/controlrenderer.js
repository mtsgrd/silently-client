// Copyright 2014 The Giflike Authors. All Rights Reserved.
//
// License: not open sourced.


/**
 * @fileoverview Custom renderer.
 *
 * @author mattias@silently.com (Mattias Granlund)
 */


goog.require('goog.object');
goog.require('goog.ui.Component');
goog.require('goog.ui.ControlRenderer');
goog.provide('silently.ControlRenderer');

/**
 * @constructor
 */
silently.ControlRenderer = function() {
    goog.base(this);
    this.classByState_ = goog.object.create(
            goog.ui.Component.State.SELECTED, goog.getCssName('selected'),
            goog.ui.Component.State.ACTIVE, goog.getCssName('active'),
            goog.ui.Component.State.DISABLED, goog.getCssName('disabled'),
            goog.ui.Component.State.HOVER, goog.getCssName('hover'));
};
goog.inherits(silently.ControlRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(silently.ControlRenderer);


/**
silently.ControlRenderer.prototype.createDom = function(control) {
    var element = control.getDomHelper().createDom(
                  'div', this.getClassNames(control).join(' '));
    if (control.hasTemplate()) {
        this.applyTemplate(element, control.getTemplate(),
                control.getTemplateArgs());
    }
    this.setAriaStates(control, element);
    if (control.getContent()) {
        this.setContent(element, control.getContent());
    }
    return element;
};

silently.ControlRenderer.prototype.decorate = function(control, element) {
    if (control.hasTemplate()) {
        this.applyTemplate(element, control.getTemplate(),
                control.getTemplateArgs());
    }
    goog.base(this, 'decorate', control, element);
    return element;
};


silently.ControlRenderer.prototype.applyTemplate = function(element, template, args) {
    element.innerHTML = template.apply(this, args);
};

*/
