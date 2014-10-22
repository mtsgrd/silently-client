/**
 * @fileoverview Google Maps API Loader.
 *
 * @author mattias@giflike.com (Mattias Granlund)
 */

goog.provide('silently.ui.MapsAPI');
goog.require('goog.events.EventTarget');

/**
 * @constructor
 */
silently.ui.MapsAPI = function(apiKey) {
    goog.base(this);
};
goog.inherits(silently.ui.MapsAPI, goog.events.EventTarget);

silently.ui.MapsAPI.EventType = {
    READY: 'mapsapiready'
};

silently.ui.MapsAPI.State = {
    UNINITIALIZED: 0,
    LOADING: 1,
    READY: 2
};

/**
 * Singleton instance.
 * @type {silently.ui.MapsAPI}
 */
silently.ui.MapsAPI.instance_;

silently.ui.MapsAPI.state = silently.ui.MapsAPI.State.UNINITIALIZED;

/**
 * Singleton getter.
 * This one is a little over the top, but not all initializers have access
 * to the API key so it's necessary that the race condition is addressed.
 */
silently.ui.MapsAPI.getInstance = function(apiKey) {
    if (!goog.isDefAndNotNull(silently.ui.MapsAPI.instance_)) {
        silently.ui.MapsAPI.instance_ = new silently.ui.MapsAPI(apiKey);
    }
    if (silently.ui.MapsAPI.state == silently.ui.MapsAPI.State.UNINITIALIZED
        && apiKey) {
        silently.ui.MapsAPI.instance_.load(apiKey);
    }
    return silently.ui.MapsAPI.instance_;
};

silently.ui.MapsAPI.prototype.load = function(apiKey) {
    if (silently.ui.MapsAPI.state == silently.ui.MapsAPI.State.UNINITIALIZED
        && apiKey) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' +
            'callback=silently.ui.MapsAPI.onReady&key=' + apiKey;
        document.body.appendChild(script);
        silently.ui.MapsAPI.state = silently.ui.MapsAPI.State.LOADING;
    }
};

silently.ui.MapsAPI.onReady = function() {
    silently.ui.MapsAPI.state = silently.ui.MapsAPI.State.READY;
    silently.ui.MapsAPI.instance_.dispatchEvent(
            {type: silently.ui.MapsAPI.EventType.READY});
};
goog.exportSymbol('silently.ui.MapsAPI.onReady', silently.ui.MapsAPI.onReady);
