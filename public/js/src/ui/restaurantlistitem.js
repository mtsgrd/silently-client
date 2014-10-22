/**
 * @fileoverview Restaurant control.
 *
 * @author mattias@silently.com (Mattias Granlund)
 */

goog.provide('silently.ui.RestaurantListItem');
goog.require('goog.math.Coordinate');
goog.require('silently.tools');
goog.require('silently.ui.Control');
goog.require('silently.ui.RestaurantPage');

/**
 * @constructor
 * @param {silently.Restaurant} restaurant A restaurant object.
 */
silently.ui.RestaurantListItem = function(restaurant) {
    goog.base(this);
    this.model_ = restaurant;
    this.id_ = restaurant.id;
    this.handleMouseEvents_ = true;
    this.geoCoder = silently.GeoCoder.getInstance();
};
goog.inherits(silently.ui.RestaurantListItem, silently.ui.Control);

/** @override */
silently.ui.RestaurantListItem.prototype.createDom = function() {
    var dh = this.getDomHelper(),
        name = dh.createDom('div', goog.getCssName('name'), this.model_.name),
        distance = dh.createDom('div', goog.getCssName('distance'),
                this.model_.distance.toFixed(1) + ' mi'),
        container = dh.createDom('div', {'id': 'restaurant-' + this.model_.id,
                 'class': goog.getCssName('restaurant')}, name, distance);

    this.setElementInternal(container);
};

/** @override */
silently.ui.RestaurantListItem.prototype.enterDocument = function() {
    goog.base(this, 'enterDocument');
    this.attachEvents();
};

silently.ui.RestaurantListItem.prototype.attachEvents = function() {
    var eh = this.getHandler();
};

/**
 * Open the info page on click.
 * @param {goog.events.Event} e An event object.
 */
silently.ui.RestaurantListItem.prototype.handleMouseUp = function(e) {
    var restaurantInfo = silently.ui.RestaurantPage.getInstance();
    restaurantInfo.setVisible(true);
    restaurantInfo.load(this.model_);
};
