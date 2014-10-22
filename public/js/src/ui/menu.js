/**
 * @fileoverview A restaurant menu.
 *
 * @author mattias@giflike.com (Mattias Granlund)
 */

goog.provide('silently.ui.Menu');
goog.require('goog.array')
goog.require('silently.ui.Control')
goog.require('silently.ui.MenuItem')

/**
 * @constructor
 * @param {object} menu The menu data.
 */
silently.ui.Menu = function() {
    goog.base(this);
};
goog.inherits(silently.ui.Menu, silently.ui.Component);

/** @override */
silently.ui.Menu.prototype.createDom = function() {
    this.setElementInternal(this.getDomHelper().createDom('div',
                {'id': 'menu'}));
};

/** @override */
silently.ui.Menu.prototype.enterDocument = function() {
    goog.base(this, 'enterDocument');
    this.attachEvents();
};

silently.ui.Menu.prototype.attachEvents = function() {
    var eh = this.getHandler();
};

silently.ui.Menu.prototype.load = function(menu) {
    this.removeChildren(true);
    goog.array.forEach(menu['categories'], function(category) {
        this.addCategory(category);
    }, this);
};

silently.ui.Menu.prototype.addCategory = function(category) {
    var categoryControl = new silently.ui.Control();
    categoryControl.addClassName('category');
    categoryControl.setContent(category['name']);
    this.addChild(categoryControl, true);

    goog.array.forEach(category['items'], function(item) {
        var itemControl = new silently.ui.MenuItem(item);
        this.addChild(itemControl, true);
    }, this);
};
