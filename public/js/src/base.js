// Copyright 2014 silently
// Author: Mattias Granlund


/**
 * @fileoverview Base for Yoin
 */

goog.require('goog.dom');
goog.require('goog.events.KeyHandler');
goog.require('goog.history.EventType');
goog.require('goog.history.Html5History');
goog.require('goog.math.Coordinate');
goog.require('goog.ui.Component');
goog.require('silently.CssRenameMapping');
goog.require('silently.Restaurants');
goog.require('silently.net.WebSocket');
goog.require('silently.templates.Body');
goog.require('silently.ui.MapsAPI');
goog.require('silently.ui.RestaurantList');
goog.require('silently.ui.RestaurantPage');
goog.require('silently.ui.Splash');
goog.require('silently.ui.Splash');
goog.require('soy');
goog.provide('silently.Base');


/**
 * Keep this line here to keep fixjsstyle to from removing the dependency.
 * @type {Placeholder}
 */
silently.CssRenameMapping;

/**
 * @constructor
 * @param apiKey Google API key.
 * @param lat Default latitude.
 * @param lng Default longitude.
 */
silently.Base = function(apiKey, lat, lng) {
    goog.base(this);

    // Default to San Francisco if coordinates not supplied.
    if (lat && lng) {
        this.loc = new goog.math.Coordinate(lat, lng);
    } else {
        this.loc = new goog.math.Coordinate(37.47, 122.25);
    }

    // Store the Google API key.
    this.apiKey = apiKey;

    // Connect web socket.
    silently.net.WebSocket.getInstance().connect();

    // Initialize Maps API
    silently.ui.MapsAPI.getInstance(apiKey);

    // Key handler for listening to global keyboard events.
    this.keyHandler_ = new goog.events.KeyHandler(document);

    // History object for limited traditional navigation. Most of the time
    // the page acts more like an app than as a website.
    this.history_ = new goog.history.Html5History();

    goog.dom.removeNode(goog.dom.getElement('loading_js'));
};
goog.inherits(silently.Base, goog.ui.Component);

// Just making template call cleaner.
silently.Base.init = function(apiKey, lat, lng) {
    var base = new silently.Base(apiKey, lat, lng);
    base.render();
    return base;
};

/** @override */
silently.Base.prototype.createDom = function() {
    goog.base(this, 'createDom');
    this.element_.id = 'home';
    soy.renderElement(this.element_, silently.templates.Body.main);
};

/** @override */
silently.Base.prototype.enterDocument = function() {
    goog.base(this, 'enterDocument');
    //this.signup = silently.ui.Signup.getInstance();
    this.splash = silently.ui.Splash.getInstance();
    this.attachEvents();
};

silently.Base.prototype.attachEvents = function() {
    var eh = this.getHandler();
    eh.listenOnce(this.splash,
            silently.ui.Splash.EventType.READY, this.onSplashReady);
    eh.listen(this.history_, goog.history.EventType.NAVIGATE,
            this.onHistoryEvent);
};

/**
 * Load up restaurant list once the splash screen has indicated we are ready
 * to proceed.
 * @param {goog.events.Event} e An event object.
 */
silently.Base.prototype.onSplashReady = function(e) {
    this.splash.dispose();
    this.restaurants = silently.Restaurants.getInstance();
    this.restaurantList = silently.ui.RestaurantList.getInstance();
    this.addChild(this.restaurantList, true);
    this.restaurantList.setVisible(true);
    this.restaurantPage = silently.ui.RestaurantPage.getInstance();
    this.restaurantPage.setKey(this.apiKey);
    this.addChild(this.restaurantPage, true);
};

/**
 * Not implemented yet, but back button support is necessary.
 * @param {goog.events.Event} e An event object.
 */
silently.Base.prototype.onHistoryEvent = function(e) {
    var token = e.token,
        isNavigation = e.isNavigation;
    console.log('Navigation not implemented yet.');
};

/**
 * Not implemented yet, but back button support is necessary.
 * @param {goog.events.Event} e An event object.
 */
silently.Base.prototype.setCSRFToken = function(token) {
    this.csrfToken = token;
};
