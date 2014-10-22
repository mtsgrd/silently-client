/**
 * @fileoverview Restaurant abstraction object.
 *
 * @author mtsgrd@gmail.com (Mattias Granlund)
 */

goog.provide('silently.Restaurant');
goog.require('goog.events.EventTarget');
goog.require('goog.math.Coordinate');


/**
 * @constructor
 * @param {object} details JSON representation of restaurant.
 */
silently.Restaurant = function(details) {
    this.id = details['id'];
    this.address = details['address'];
    this.allowsAsap = details['allows_asap'];
    this.name = details['name'];
    this.partner = details['partner'];
    this.phone = details['phone'];
    this.taking_orders = details['taking_orders'];

    this.location = new goog.math.Coordinate(details['location'][0],
            details['location'][1]);

    var geoCoder = silently.GeoCoder.getInstance();
    // Compute distance so we can show it next to the name.
    this.distance = silently.tools.getCoordinateDistance(geoCoder.location,
            this.location);
};
goog.inherits(silently.Restaurant, goog.events.EventTarget);

/**
 * The menu is only available in individual API calls so we add it later.
 * @param {object} menu The menu JSON.
 */
silently.Restaurant.prototype.addMenu = function(menu) {
    this.menu = menu;
};
