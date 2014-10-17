// Copyright 2014 silently
// Author: Mattias Granlund


/**
 * @fileoverview Base for Yoin
 */

goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyHandler');
goog.require('goog.math.Coordinate');
goog.require('goog.ui.Component');
goog.require('soy');
goog.require('silently.Map');
goog.require('silently.Login');
goog.require('silently.Signup');
goog.require('silently.net.WebSocket');
goog.require('silently.templates.Body');
goog.require('silently.CssRenameMapping');
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

    this.keyHandler_ = new goog.events.KeyHandler(document);
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
    //var map = new silently.Map(this.apiKey, this.loc);
    //map.render();
    //this.map = map;
    this.attachEvents();
    this.signup = silently.Signup.getInstance();
};

silently.Base.prototype.attachEvents = function() {
    var eh = this.getHandler();
    //eh.listen(this.keyHandler_, goog.events.KeyHandler.EventType.KEY,
    //        this.handleKey);
};

/**
silently.Base.prototype.handleKey = function(e) {
    switch (e.keyCode) {
        case goog.events.KeyCodes.SPACE:
            this.map.nextStyle();
            break;
        case goog.events.KeyCodes.ENTER:
            this.map.setTransform(!this.map.getTransform());
            break;
    }
};
*/
