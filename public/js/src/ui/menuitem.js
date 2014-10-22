/**
 * @fileoverview A restaurant menu.
 *
 * @author mattias@giflike.com (Mattias Granlund)
 */

goog.provide('silently.ui.MenuItem');
goog.require('goog.array')
goog.require('silently.ui.Control')

/**
 * @constructor
 * @param {object} menu The menu data.
 */
silently.ui.MenuItem = function(item) {
    goog.base(this);
    this.model_ = item;
    this.handleMouseEvents_ = true;
};
goog.inherits(silently.ui.MenuItem, silently.ui.Control);

/** @override */
silently.ui.MenuItem.prototype.createDom = function() {
    var dh = this.getDomHelper(),
        name = dh.createDom('div', goog.getCssName('item-name'),
                this.model_.name),
        price = dh.createDom('div', goog.getCssName('price'),
                this.model_.price),
        info = dh.createDom('div', goog.getCssName('info'), name, price),
        add = dh.createDom('div', goog.getCssName('add-button')),
        subtract = dh.createDom('div', goog.getCssName('subtract-button')),
        choicesInner = dh.createDom('div', null, add, subtract),
        choices = dh.createDom('div', goog.getCssName('choices'),
                choicesInner),
        container = dh.createDom('div', goog.getCssName('menu-item'),
                info, choices);
    this.setElementInternal(container);

    this.add = new goog.ui.CustomButton();
    this.addChild(this.add, false);
    this.add.decorate(add);

    this.subtract = new goog.ui.CustomButton();
    this.addChild(this.subtract, false);
    this.subtract.decorate(subtract);
};

/** @override */
silently.ui.MenuItem.prototype.enterDocument = function() {
    goog.base(this, 'enterDocument');
    this.attachEvents();
};

silently.ui.MenuItem.prototype.attachEvents = function() {
    var eh = this.getHandler();
};
