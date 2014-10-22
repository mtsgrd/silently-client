/**
 * @fileoverview Common tools.
 *
 * @author mtsgrd@gmail.com (Mattias Granlund)
 */

goog.provide('silently.tools');

/**
 * Distance between two points.
 * @param {goog.math.Coordinate} from First coordinate.
 * @param {goog.math.Coordinate} to Second coordinate.
 */
silently.tools.getCoordinateDistance = function(from, to) {
    function deg2rad(deg) {
        return deg * (Math.PI/180)
    }
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(to.y - from.y);
    var dLon = deg2rad(to.x - from.x);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(from.y)) * Math.cos(deg2rad(to.y)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d / 1.609344; // Distance in mi
};
