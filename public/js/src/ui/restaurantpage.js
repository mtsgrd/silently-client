/**
 * @fileoverview Restaurant view for Silently.
 *
 * @author mattias@silently.com (Mattias Granlund)
 */

goog.provide('silently.ui.RestaurantPage');
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyHandler');
goog.require('goog.ui.Component');
goog.require('goog.ui.CustomButton');
goog.require('silently.Restaurants');
goog.require('silently.ui.Component');
goog.require('silently.ui.Control');
goog.require('silently.ui.Map');
goog.require('silently.ui.Menu');

/**
 * @constructor
 */
silently.ui.RestaurantPage = function() {
    goog.base(this);

    // Key handler for listening to the escape button.
    this.keyHandler_ = new goog.events.KeyHandler();
};
goog.inherits(silently.ui.RestaurantPage, silently.ui.Component);
goog.addSingletonGetter(silently.ui.RestaurantPage);

/**
 * When creating the dom, items with dynamic content is added as a control
 * to make use of the Closure library's existing helper functions.
 * @overrides
 */
silently.ui.RestaurantPage.prototype.createDom = function() {
    var dh = this.getDomHelper(),
        title = dh.createDom('div', {'id': 'restaurant-title'}),
        phone = dh.createDom('div', {'id': 'restaurant-phone'}),
        navigationContainer = dh.createDom('div'),
        titleContainer = dh.createDom('div', null, title, phone),
        closeContainer = dh.createDom('div'),
        headerTable = dh.createDom('div', null, navigationContainer,
                titleContainer, closeContainer),
        mapContainer = dh.createDom('div'),
        container = dh.createDom('div', {'id': 'restaurant-page'},
                headerTable, mapContainer);
    this.setElementInternal(container);

    // Button for closing the info page.
    this.close = new goog.ui.CustomButton();
    this.close.addClassName(goog.getCssName('close-button'));
    this.close.render(closeContainer);

    // Button for viewig the next restaurant in the list.
    this.previous = new goog.ui.CustomButton();
    this.previous.addClassName(goog.getCssName('prev-button'));
    this.previous.render(navigationContainer);

    // Button for viewig the previous restaurant in the list.
    this.next = new goog.ui.CustomButton();
    this.next.addClassName(goog.getCssName('next-button'));
    this.next.render(navigationContainer);

    // Restaurant name.
    this.title = new silently.ui.Control();
    this.addChild(this.title, false);
    this.title.decorate(title);

    // Restaurant phone.
    this.phone = new silently.ui.Control();
    this.addChild(this.phone, false);
    this.phone.decorate(phone);

    // A Google map showing the location of the restaurant. This is prehaps
    // not a necessary component?
    //this.map = new silently.ui.Map();
    //this.addChild(this.map, false);
    //this.map.decorate(mapContainer);

    //this.menu = new silently.ui.Menu();
    //this.addChild(this.menu, true);
};

/** @overrides */
silently.ui.RestaurantPage.prototype.enterDocument = function() {
    goog.base(this, 'enterDocument');

    // Attach keyhandler onto page element and intercept events in the
    // capture phase.
    this.keyHandler_.attach(document, true);

    this.attachEvents();
};

silently.ui.RestaurantPage.prototype.attachEvents = function() {
    var eh = this.getHandler();
    eh.listen(this.previous, goog.ui.Component.EventType.ACTION,
            this.onPrevious);
    eh.listen(this.next, goog.ui.Component.EventType.ACTION,
            this.onNext);
    eh.listen(this.close, goog.ui.Component.EventType.ACTION,
            this.onClose);
    eh.listen(this.keyHandler_, goog.events.KeyHandler.EventType.KEY,
              this.onKey);
};

/**
 * Handler for when a new restaurant is added.
 * @param {goog.events.Event} e An event object.
 */
silently.ui.RestaurantPage.prototype.onRestaurantAdded = function(e) {
    this.addRestaurant(e.restaurant);
};

/**
 * Updates the model and associated DOM elements.
 * @param {silently.Restaurant} restaurant A restaurant object.
 */
silently.ui.RestaurantPage.prototype.load = function(restaurant) {

    // Phone numbers need to be prefixed with the international access code
    // for links to work in mobile operating systems.
    var formattedPhoneNumber =
        goog.string.startsWith(restaurant.phone, '+1') ?
        'tel:' + restaurant.phone : 'tel:+1-' + restaurant.phone;
    var phoneLink = this.getDomHelper().createDom('a',
            {'href': formattedPhoneNumber}, restaurant.phone);

    this.restaurant_ = restaurant;
    this.title.setContent(restaurant.name);
    this.phone.setContent(phoneLink);
    //this.map.setLocation(restaurant.location.x, restaurant.location.y);
    //this.menu.load(restaurant.menu);
};

/**
 * Handles click on the close button.
 * @param {goog.events.Event} e An event object.
 */
silently.ui.RestaurantPage.prototype.onClose = function(e) {
    this.setVisible(false);
};

/**
 * Handles click on the previous button.
 * @param {goog.events.Event} e An event object.
 */
silently.ui.RestaurantPage.prototype.onPrevious = function(e) {
    if (this.restaurant_) {
        var restaurants = silently.Restaurants.getInstance(),
            node = restaurants.children.getNode(this.restaurant_.id);
        this.load(node.prev.value);
    }
};

/**
 * Handles click on the next button.
 * @param {goog.events.Event} e An event object.
 */
silently.ui.RestaurantPage.prototype.onNext = function(e) {
    if (this.restaurant_) {
        var restaurants = silently.Restaurants.getInstance(),
            node = restaurants.children.getNode(this.restaurant_.id);
        this.load(node.next.value);
    }
};

/**
 * Handle key events. Be careful, the key events are global.
 * @param {goog.events.Event} e An event object.
 */
silently.ui.RestaurantPage.prototype.onKey = function(e) {
    switch (e.keyCode) {
        case goog.events.KeyCodes.ESC:
            this.setVisible(false);
            break;
    }
};

/**
 * @param {string} apiKey A Google API key.
 */
silently.ui.RestaurantPage.prototype.setKey = function(apiKey) {
    // We need the API key for Google Maps.
    this.apiKey = apiKey;
};
