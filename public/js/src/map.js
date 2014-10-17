/**
 * @fileoverview Google Maps API component.
 *
 * @author mattias@silently.com (Mattias Granlund)
 */


goog.provide('silently.Map');
goog.require('silently.MapInfoLinkedMap');
goog.require('goog.dom.classlist');
goog.require('goog.ui.Component');
goog.require('goog.events.EventType');

/**
 * @constructor
 */
silently.Map = function(apiKey, loc) {
    goog.base(this);

    // Default location determined by GeoIP.
    this.loc = loc;
    this.yolm = new silently.MapInfoLinkedMap(/** max count */ 10, /** cache */ true);

    //TODO: Send API key in template.
    if (silently.Map.state == silently.Map.State.UNINITIALIZED) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' +
            'callback=silently.Map.onReady&key=' + apiKey;
        document.body.appendChild(script);
        silently.Map.state = silently.Map.State.LOADING;
    }

    // If Maps script hasn't loaded then buffer init function.
    if (silently.Map.state != silently.Map.State.READY) {
        goog.array.insert(silently.Map.waiting, this);
    }
};
goog.inherits(silently.Map, goog.ui.Component);

/** @override */
silently.Map.prototype.enterDocument = function(loc) {
    goog.base(this, 'enterDocument');
    this.element_.id = 'map-canvas';
    this.attachEvents();
};

// Instances waiting to initialize while script is loading.
silently.Map.waiting = [];

/**
 * type {Number}
 */
silently.Map.prototype.styleIndex;

silently.Map.State = {
    UNINITIALIZED: 0,
    LOADING: 1,
    READY: 2
}

silently.Map.state = silently.Map.State.UNINITIALIZED;

silently.Map.onReady = function() {
    silently.Map.state = silently.Map.State.READY;
    var obj = goog.array.forEach(silently.Map.waiting, function(map) {
        map.initialize();
    });
};

silently.Map.prototype.initialize = function() {
    if (!this.isDisposed()) {
        var mapOptions = {
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: silently.Map.styleIndex,
            center: new google.maps.LatLng(this.loc.x, this.loc.y)
        };
        this.map = new google.maps.Map(this.element_,
                mapOptions);

    }
    silently.net.WebSocket.getInstance().emit('get_history', 10);
};

silently.Map.prototype.getTransform = function(enabled) {
    return goog.dom.classlist.contains(this.element_, goog.getCssName('tilt'));
};

silently.Map.prototype.setTransform = function(enabled) {
    // Remove element style set by Maps JS>
    goog.style.setStyle(this.element_, '-webkit-transform', null);
    goog.dom.classlist.enable(this.element_, goog.getCssName('tilt'), enabled);
};

silently.Map.prototype.nextStyle = function() {
    // Set the empty style if style is undefined.
    var style = this.styleIndex ? this.styleIndex : silently.Map.styles_[0];
    var i = goog.array.indexOf(silently.Map.styles_, style);
    if (i >= silently.Map.styles_.length) {
        i = 0;
    } else {
        i += 1;
    }
    this.styleIndex = silently.Map.styles_[i];
    var mapOptions = {
        styles: this.styleIndex
    };
    this.map.setOptions(mapOptions);
};

silently.Map.prototype.attachEvents = function() {
    var eh = this.getHandler();
    eh.listen(silently.net.WebSocket.getInstance(), 'new_yo',
            this.handleYo);
    eh.listen(silently.net.WebSocket.getInstance(), 'history_yo',
            this.handleHistoryYo);
};

silently.Map.prototype.addYo = function(data, opt_pan) {
    var username = data['username'],
        lat = data['lat'],
        lng = data['lng'];

    var pos = new google.maps.LatLng(lat, lng);
    if (this.yolm.containsKey(username)) {
        this.yolm.remove(username);
    }

    var info = new silently.MapInfo(this.map, pos, username);
    this.yolm.set(username, info);

    if (opt_pan) {
        this.map.panTo(pos);
        info.show();
    }
};

silently.Map.prototype.handleHistoryYo = function(e) {
    this.addYo(e.data, false)
};

silently.Map.prototype.handleYo = function(e) {
    this.addYo(e.data, true)
};

// Make shit cool Yo.
silently.Map.styles_ = [
[],
[
    {
        "featureType": "administrative",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "water",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "transit",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "landscape",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.local",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "water",
        "stylers": [
            {
                "color": "#84afa3"
            },
            {
                "lightness": 52
            }
        ]
    },
    {
        "stylers": [
            {
                "saturation": -17
            },
            {
                "gamma": 0.36
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#3f518c"
            }
        ]
    }
],
/** http://snazzymaps.com/style/4/tripitty */
[{
    "featureType": "water",
    "elementType": "all",
    "stylers": [
    {
        "color": "#193a70"
    },
    {
        "visibility": "on"
    }
    ]
},
{
    "featureType": "road",
    "stylers": [
    {
        "visibility": "off"
    }
    ]
},
{
    "featureType": "transit",
    "stylers": [
    {
        "visibility": "off"
    }
    ]
},
{
    "featureType": "administrative",
    "stylers": [
    {
        "visibility": "off"
    }
    ]
},
{
    "featureType": "landscape",
    "elementType": "all",
    "stylers": [
    {
        "color": "#2c5ca5"
    }
    ]
},
{
    "featureType": "poi",
    "stylers": [
    {
        "color": "#2c5ca5"
    }
    ]
},
{
    "elementType": "labels",
    "stylers": [
    {
        "visibility": "off"
    }
    ]
}
]
];
