/**
 * @fileoverview Restaurant list abstraction object.
 *
 * @author mattias@silently.com (Mattias Granlund)
 */

goog.provide('silently.Restaurants');
goog.require('goog.array');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('silently.GeoCoder');
goog.require('silently.LinkedMap');
goog.require('silently.Restaurant');
goog.require('silently.net.WebSocket');

/**
 * @constructor
 */
silently.Restaurants = function() {
    goog.base(this);
    this.ws = silently.net.WebSocket.getInstance();
    this.geoCoder = silently.GeoCoder.getInstance();
    if (this.geoCoder.address) {
        this.search(this.geoCoder.address);
    }
    this.eventHandler_ = new goog.events.EventHandler(this);
    this.children = new silently.LinkedMap();
    this.attachEvents();
};
goog.inherits(silently.Restaurants, goog.events.EventTarget);
goog.addSingletonGetter(silently.Restaurants);


silently.Restaurants.EventType = {
    RESTAURANT_ADDED: 'restaurant_added'
};

silently.Restaurants.prototype.attachEvents = function() {
    var eh = this.eventHandler_;
    var ws = silently.net.WebSocket.getInstance();
    eh.listen(silently.GeoCoder.getInstance(),
            silently.GeoCoder.EventType.ADDRESS,
            this.onAddressUpdated);
    eh.listen(ws, silently.net.WebSocket.EventType.RESTAURANT_LIST,
            this.onRestaurantListResult);
    eh.listen(ws, silently.net.WebSocket.EventType.RESTAURANT_DETAILS,
            this.onRestaurantDetailsResult);
};

/**
 * Updates search results if address changes.
 */
silently.Restaurants.prototype.onAddressUpdated = function(e) {
    //this.removeChildren();
    this.search(e.address);
};

/**
 * Issues a new search for delivery restaurants.
 */
silently.Restaurants.prototype.search = function(address) {
    this.ws.emit('restaurant_list', address);
};

/**
 * @overrides
 */
silently.Restaurants.prototype.disposeInternal = function() {
    goog.base(this, 'disposeInternal');
    this.eventHandler_.dispose();
    delete this.eventHandler_;
};

/**
 * Handler for restaurant details result.
 */
silently.Restaurants.prototype.onRestaurantDetailsResult = function(e) {
    var details = e.data,
        restaurantId = details['id'],
        menu = details['menu'];
    var child = this.children.get(restaurantId);
    if (child) {
        child.addMenu(menu);
    }
};

/**
 * Handler for search results.
 */
silently.Restaurants.prototype.onRestaurantListResult = function(e) {
    goog.array.forEach(e.data, function(entry) {
        var restaurant = new silently.Restaurant(entry);
        this.children.set(restaurant.id, restaurant);
        this.dispatchEvent({
            type: silently.Restaurants.EventType.RESTAURANT_ADDED,
            restaurant: restaurant});
    }, this);
};
