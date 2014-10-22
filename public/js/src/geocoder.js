/**
 * @fileoverview Geocoder for address discovery.
 *
 * @author mtsgrd@gmail.com (Mattias Granlund)
 */

goog.provide('silently.GeoCoder');

goog.require('goog.array');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('silently.ui.MapsAPI');

/**
 * @constructor
 */
silently.GeoCoder = function() {
    goog.base(this);
    var mapsAPI = silently.ui.MapsAPI.getInstance();
    var eh = new goog.events.EventHandler(this);
    if (silently.ui.MapsAPI.state != silently.ui.MapsAPI.State.READY) {
        eh.listenOnce(mapsAPI, silently.ui.MapsAPI.EventType.READY,
               this.onReady);
    } else {
        this.onReady();
    }
};
goog.inherits(silently.GeoCoder, goog.events.EventTarget);
goog.addSingletonGetter(silently.GeoCoder);

silently.GeoCoder.EventType = {
    ADDRESS: 'geocoder_address'
};

silently.GeoCoder.prototype.onReady = function(e) {
    if ('geolocation' in navigator) {
        this.getLocation();
    } else {
        console.log('Geolocation not available.');
    }
};

silently.GeoCoder.prototype.getLocation = function() {
    var self = this;
    navigator.geolocation.getCurrentPosition(function(position) {
        self.codeLatLng(position.coords.latitude, position.coords.longitude);
    });
};

/**
 * Given a location, performs reverse geocoding.
 */
silently.GeoCoder.prototype.codeLatLng = function(lat, lng) {
    this.location = new goog.math.Coordinate(lat, lng);
    var latlng = new google.maps.LatLng(lat, lng);
    var geocoder = new google.maps.Geocoder();
    var self = this;
    if (goog.DEBUG) {
        var address = {'number': '375',
                       'street': 'Noe St',
                       'city': 'San Francisco',
                       'zip' : '94114'};
        self.dispatchEvent({type: silently.GeoCoder.EventType.ADDRESS,
            address: address});
        this.address = address;
    } else {
        geocoder.geocode({'latLng': latlng}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var address = self.parseResults(results);
                self.dispatchEvent({type: silently.GeoCoder.EventType.ADDRESS,
                                    address: address});
                this.address = address;
                console.log(address);
            } else {
                console.log('Geocoder failed due to: ' + status);
            }
        });
    }
};

/**
 * Parse out street address and city.
 * @param {Array.<Object>}
 */
silently.GeoCoder.prototype.parseResults = function(results) {
    var number,
        street,
        city,
        zip;
    goog.array.forEach(results[0]['address_components'], function(c) {
        var majorType = c['types'][0];
        switch (majorType) {
            case 'street_number':
                number = c['long_name'];
                break;
            case 'postal_code':
                zip = c['long_name'];
                break;
            case 'route':
                street = c['long_name'];
                break;
            case 'locality':
            case 'administrative_area_level_3':
                city = c['long_name'];
                break;
        }
    }, this);
    return {number: number,
            street: street,
            city: city,
            zip: zip};

};
