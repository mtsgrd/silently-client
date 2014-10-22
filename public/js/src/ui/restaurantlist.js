/**
 * @fileoverview Restaurant view for Silently.
 *
 * @author mattias@silently.com (Mattias Granlund)
 */

goog.provide('silently.ui.RestaurantList');
goog.require('silently.GeoCoder');
goog.require('silently.Restaurants');
goog.require('silently.net.WebSocket');
goog.require('silently.ui.Component');
goog.require('silently.ui.RestaurantListItem');

/**
 * @constructor
 */
silently.ui.RestaurantList = function() {
    goog.base(this);
    this.geoCoder = silently.GeoCoder.getInstance();
    this.log = goog.debug.Logger.getLogger('silently.ui.RestaurantList');
    this.restaurants_ = silently.Restaurants.getInstance();
    this.ws = silently.net.WebSocket.getInstance();
    if (this.geoCoder.address) {
        this.search(this.geoCoder.address);
    }
};
goog.inherits(silently.ui.RestaurantList, silently.ui.Component);
goog.addSingletonGetter(silently.ui.RestaurantList);

/** @override */
silently.ui.RestaurantList.prototype.createDom = function() {
    this.setElementInternal(this.getDomHelper().createDom('div',
                {'id': 'restaurants'}));
};

/** @override */
silently.ui.RestaurantList.prototype.enterDocument = function() {
    goog.base(this, 'enterDocument');
    this.attachEvents();
};

silently.ui.RestaurantList.prototype.attachEvents = function() {
    var eh = this.getHandler();
    eh.listen(this.restaurants_,
            silently.Restaurants.EventType.RESTAURANT_ADDED,
            this.onRestaurantAdded);
};

/**
 * Handler for when a new restaurant is added.
 */
silently.ui.RestaurantList.prototype.onRestaurantAdded = function(e) {
    this.addRestaurant(e.restaurant);
};

/**
 * Add a restaurant object as a new child control.
 * @param {silently.Restaurant}
 */
silently.ui.RestaurantList.prototype.addRestaurant = function(restaurant) {
    var restaurantControl = new silently.ui.RestaurantListItem(restaurant);
    restaurantControl.setContent(restaurant.name);
    restaurantControl.addClassName(goog.getCssName('restaurant'));
    this.addChild(restaurantControl, true);
};
