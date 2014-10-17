/**
 * @fileoverview Google Maps API bubble and marker.
 *
 * @author mattias@silently.com (Mattias Granlund)
 */

goog.provide('silently.MapInfo');
goog.provide('silently.MapInfoLinkedMap');
goog.require('goog.structs.LinkedMap');
goog.require('goog.Disposable');

/**
 * @constructor
 */
silently.MapInfo = function(map, pos, username) {
    this.map = map
        this.marker = new google.maps.Marker({
            position: pos,
            title: username,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                strokeColor: '#9B59B6',
                fillColor: '#fff',
                fillOpacity: 1,
                strokeWeight: 3,
                scale: 8
            }
        });
    this.marker.setMap(this.map);

    var contentString = '<div id="yobubble"><a href="http://justyo.co/' +
                        username + '">Yo from ' + username + '!</a></div>';
    this.infowindow = new google.maps.InfoWindow({
        content: contentString
    });
};
goog.inherits(silently.MapInfo, goog.Disposable);

silently.MapInfo.prototype.show = function() {
    this.infowindow.open(this.map, this.marker)
}

silently.MapInfo.prototype.hide = function() {
    this.marker.setMap(null);
    this.infowindow.close()
}

silently.MapInfo.prototype.disposeInternal = function() {
    goog.base(this, 'disposeInternal');
    this.hide();
    delete this.map;
    delete this.marker;
    delete this.infowindow;
};


/**
 * @constructor
 */
silently.MapInfoLinkedMap = function(opt_maxCount, opt_cache) {
    goog.base(this, opt_maxCount, opt_cache);
};
goog.inherits(silently.MapInfoLinkedMap, goog.structs.LinkedMap);

silently.MapInfoLinkedMap.prototype.removeNode = function(node) {
    node.value.dispose();
    node.remove();
    this.map_.remove(node.key);
};
