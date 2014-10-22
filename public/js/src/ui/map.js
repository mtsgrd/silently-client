/**
 * @fileoverview Google Maps API component.
 *
 * @author mattias@silently.com (Mattias Granlund)
 */


goog.provide('silently.ui.Map');
goog.require('goog.array');
goog.require('goog.ui.Component');
goog.require('silently.ui.MapsAPI');

/**
 * @constructor
 */
silently.ui.Map = function(apiKey) {
    goog.base(this);

    var mapsAPI = silently.ui.MapsAPI.getInstance();
    // If Maps script hasn't loaded then buffer init function.
    if (silently.ui.MapsAPI.state != silently.ui.MapsAPI.State.READY) {
        this.getHandler().listenOnce(mapsAPI, silently.ui.MapsAPI.EventType.READY,
                silently.ui.Map.onReady);
        goog.array.insert(silently.ui.Map.waiting, this);
    } else {
        silently.ui.Map.onReady();
    }
};
goog.inherits(silently.ui.Map, goog.ui.Component);

/** @override */
silently.ui.Map.prototype.enterDocument = function(loc) {
    goog.base(this, 'enterDocument');
    this.element_.id = 'map-canvas';
    this.attachEvents();
};

// Instances waiting to initialize while script is loading.
silently.ui.Map.waiting = [];

silently.ui.Map.onReady = function() {
    var obj = goog.array.forEach(silently.ui.Map.waiting, function(map) {
        if (map.pos) {
            map.initialize();
        }
    });
};

silently.ui.Map.prototype.initialize = function() {
    if (this.pos) {
        var mapOptions = {
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: silently.ui.Map.styleIndex,
            center: this.pos,
            disableDefaultUI: true
        };
        this.map = new google.maps.Map(this.element_,
                mapOptions);

        if (this.marker) {
            this.marker.setMap(this.map);
        }
    }
};

silently.ui.Map.prototype.attachEvents = function() {
    var eh = this.getHandler();
};

silently.ui.Map.prototype.setLocation = function(lat, lng) {
    this.pos = new google.maps.LatLng(lat, lng);
    if (this.marker) {
        // Setting map to null removes the marker.
        this.marker.setMap(null);
    }
    this.marker = new google.maps.Marker({
        position: this.pos,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            strokeColor: '#000',
            fillColor: '#fff',
            fillOpacity: 1,
            strokeWeight: 2,
            scale: 5
        }
    });

    // Allow context switch to not lock the browser on slower devices.
    var self = this;
    setTimeout(function() {
        if (self.map) {
            self.map.panTo(self.pos);
            self.marker.setMap(self.map);
        } else if (silently.ui.MapsAPI.state ==
                   silently.ui.MapsAPI.State.READY) {
            self.initialize();
        }
    }, 10);
};
