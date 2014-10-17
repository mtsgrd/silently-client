// Copyright 2012 Mattias Granlund


/**
 * @fileoverview A model object for frames.
 */


goog.require('goog.Uri');
goog.require('goog.crypt.base64');
goog.require('goog.date.Date');
goog.require('goog.date.DateTime');
goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.json');
goog.require('goog.net.cookies');
goog.require('goog.string');

goog.provide('silently.tools');


/**
 * Get the file size in a human readable format.
 * @param {String} bytes The size in bytes.
 * @return {string} A file size in a human readable format.
 */
silently.tools.byteCount = function(bytes) {
  var unit = 1000;
  if (bytes < (unit = unit || 1000)) {
    return bytes + ' B';
  }
  var exp = Math.floor(Math.log(bytes) / Math.log(unit));
  var pre = ' ' + (unit === 1000 ? 'kMGTPE' : 'KMGTPE').charAt(exp - 1) +
      (unit === 1000 ? '' : 'i') + 'B';
  return (bytes / Math.pow(unit, exp)).toFixed(1) + pre;
};


/**
 * Converts an epoch in ms to a datetime str.
 * @param {Date} epoch Current epoch.
 * @return {string} A formatted datetime str.
 */
silently.tools.formatDate = function(ts) {
  var d = new Date(ts / 1000);
  var dateStr = d.getFullYear().toString() + '-' +
    silently.tools.zfill((d.getMonth() + 1), 2) + '-' +
    silently.tools.zfill(d.getDate(), 2);
  return dateStr;
};


/**
 * Converts an epoch in ms to a datetime str.
 * @param {Date} epoch Current epoch.
 * @return {string} A formatted datetime str.
 */
silently.tools.formatDateTime = function(ts) {
var dateStr = ts.getFullYear().toString() + '-' +
                  (ts.getMonth() + 1).toString() + '-' +
                  ts.getDate().toString() + ' ' +
                  ts.getHours().toString() + ':' +
                  ts.getMinutes().toString() + ':' +
                  ts.getSeconds().toString();
  return dateStr;
};

/**
 * Converts an epoch in seconds to a datetime str.
 * @param {seconds} integer Number of seconds.
 * @return {dictionary} A dictionary of strings.
 */
silently.tools.formatTime = function(seconds) {
  var seconds = Math.floor(seconds),
      hours = Math.floor(seconds / 3600);
      seconds -= hours * 3600;
  var minutes = Math.floor(seconds / 60);
      seconds -= minutes * 60;

      if (hours < 10) {hours = '0' + hours;}
      if (minutes < 10) {minutes = '0' + minutes;}
      if (seconds < 10) {seconds = '0' + seconds;}

      return {
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
      };
};


/**
 * Formats seconds.
 * @param {seconds} integer Number of seconds.
 * @return {dictionary} A dictionary of strings.
 */
silently.tools.formatSeconds = function(value) {
  var seconds = Math.floor(value) % 60;
  var minutes = Math.floor(value / 60);
  var fraction = Math.floor(1000 * (value % 1));
  return minutes + ':' + silently.tools.zfill(seconds, 2) + '.' +
    silently.tools.zfill(fraction, 3);
};


/**
 * Gets a page id from a string.
 * @return {goog.Uri} The current URI.
 */
silently.tools.getPageIdFromString = function(s) {
  return goog.string.hashCode(s.toString()).toString();
};


/**
 * Gets the current Uri.
 * @return {goog.Uri} The current URI.
 */
silently.tools.getPageIdFromUri = function(uri) {
  return goog.string.hashCode(uri.toString()).toString();
};


/**
 * Gets the current Uri.
 * @return {goog.Uri} The current URI.
 */
silently.tools.getUri = function() {
  return goog.Uri.parse(window.location);
};


/**
 * Gets the first child element of the container by class name.
 * @param {String} node The element to search within.
 * @param {String} className The class name.
 * @return {Element} An element.
 */
silently.tools.getElement = function(className, node) {
  return goog.dom.getElementByClass(className, node);
};

silently.tools.getElements = function(className, node) {
  return goog.dom.getElementsByClass(className, node);
};

silently.tools.getElementById = function(className) {
  return goog.dom.getElement(className);
};

silently.tools.formatUsecTime = function(usec) {
      var usec = new goog.date.DateTime.fromTimestamp(usec / 1000);
      return silently.tools.zfill(usec.getHours(), 2) +
              ':' + silently.tools.zfill(usec.getMinutes(), 2) +
              ':' + silently.tools.zfill(usec.getSeconds(), 2);
};

silently.tools.formatUsecDate = function(usec) {
      var usec = new goog.date.DateTime.fromTimestamp(usec / 1000);
      return usec.getFullYear() +
              '-' + silently.tools.zfill(usec.getMonth(), 2) +
              '-' + silently.tools.zfill(usec.getDate(), 2);
};

silently.tools.isToday = function(usec) {
    var d1 = new goog.date.DateTime.fromTimestamp(usec / 1000);
    var d2 = new goog.date.DateTime();
    return d1.getUTCFullYear() == d2.getUTCFullYear() &&
        d1.getUTCMonth() == d2.getUTCMonth() &&
        d1.getUTCDate() == d2.getUTCDate();
};

silently.tools.getMilliseconds = function() {
  var now = new goog.date.DateTime();
  var today = new goog.date.Date();
  var epoch = today.getTime() + (now.getHours() * 60 * 60 +
      now.getMinutes() * 60 + now.getSeconds()) * 1000 +
      now.getMilliseconds();
  return epoch;
};

silently.tools.getUsec = function() {
  return silently.tools.getMilliseconds() * 1000;
};


silently.tools.fbIdToUserId = function(fbUserId) {
  function DoAsciiHex(x, dir)
  {hex = '0123456789ABCDEF';almostAscii = ' !"#$%&' + "'" + '()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[' + '\\' + ']^_`abcdefghijklmnopqrstuvwxyz{|}';r = '';
    if (dir == 'A2H')
    {for (i = 0; i < x.length; i++) {let1 = x.charAt(i);pos = almostAscii.indexOf(let1) + 32;h16 = Math.floor(pos / 16);h1 = pos % 16;r += hex.charAt(h16) + hex.charAt(h1);}}
    if (dir == 'H2A')
    {for (i = 0; i < x.length; i++) {let1 = x.charAt(2 * i);let2 = x.charAt(2 * i + 1);val = hex.indexOf(let1) * 16 + hex.indexOf(let2);r += almostAscii.charAt(val - 32);}}
    return r;
  };
  return 'fb_' + DoAsciiHex(fbUserId, 'A2H');
};

silently.tools.timeDifference = function(current, previous) {

    var usecPerSecond = 1000 * 1000;
    var usecPerMinute = 60 * usecPerSecond;
    var usecPerHour = usecPerMinute * 60;
    var usecPerDay = usecPerHour * 24;
    var usecPerMonth = usecPerDay * 30;
    var usecPerYear = usecPerDay * 365;

    var elapsed = current - previous;
    var value;
    var label;

    if (elapsed < usecPerMinute) {
      value = Math.round(elapsed / usecPerSecond);
      label = value == 1 ? 'second' : 'seconds';
    } else if (elapsed < usecPerHour) {
      value = Math.round(elapsed / usecPerMinute);
      label = value == 1 ? 'minute' : 'minutes';
    } else if (elapsed < 2.1 * usecPerDay) {
      value = Math.round(elapsed / usecPerHour);
      label = value == 1 ? 'hour' : 'hours';
    } else if (elapsed < 2 * usecPerMonth) {
      value = Math.round(elapsed / usecPerDay);
      label = value == 1 ? 'day' : 'days';
    } else if (elapsed < usecPerYear) {
      value = Math.round(elapsed / usecPerMonth);
      label = value == 1 ? 'month' : 'months';
    } else {
      value = Math.round(elapsed / usecPerYear);
      label = value == 1 ? 'year' : 'years';
    }
    return value + ' ' + label;
};

silently.tools.titleToPath = function(value) {
  var path = value.replace(/['"]/g, '');
  path = path.replace(/[^a-zA-Z0-9]/g, '-');
  path = path.replace(/[-]+/g, '-');
  path = path.replace(/-$/g, '');
  path = path.replace(/^-/g, '');
  return path.toLowerCase();
};


silently.tools.toAlphaNumeric = function(value) {
  return value.replace(/[^a-zA-Z0-9-_]/g, '');
};


silently.tools.getPathByIndex = function(url, index) {
  var uri;
  if (url instanceof goog.Uri) {
    uri = url;
  } else {
    uri = goog.Uri.parse(url);
  }
  var path = uri.getPath();
  var parts = path.split('/');
  if (index + 1 > parts.length) {
    return null;
  } else {
    return parts[index];
  }
};

silently.tools.getLastPath = function(url) {
  var uri = goog.Uri.parse(url);
  var path = uri.getPath();
  var parts = path.split('/');
  return parts[parts.length - 1];
};

silently.tools.hashtagsToLinks = function(text) {
  var out = text;
  var re = new RegExp('#([A-Z0-9_]+)', 'gi');
  out = text.replace(re, function(match, hashtag) {
        return "<a class='" + goog.getCssName('hashtag') + "' id='" + hashtag + "'>#" + hashtag + '</a>';
      });
  return out;
};


silently.tools.getYouTubeIdFromUrl = function(url) {
  var uri = goog.Uri.parse(goog.string.unescapeEntities(url));
  if (uri) {
    var queryData = uri.getQueryData();
    var videoId = queryData.get('v');
    if (videoId) {
      if (silently.tools.toAlphaNumeric(videoId).length > 5) {
        return silently.tools.toAlphaNumeric(videoId);
      }
    } else {
      var preliminaryId = silently.tools.getPathByIndex(uri, 1);
      if (preliminaryId) {
        var cleanId = silently.tools.toAlphaNumeric(preliminaryId);
        if (cleanId.length > 5) {
          return cleanId;
        }
      } else {
        return;
      }
    }
  }
};


silently.tools.getCurrentHindex = function(url) {
  var ms = silently.tools.getMilliseconds();
  return Math.round(ms / (1000 * 3600));
};


silently.tools.subtractText = function(textA, textB) {
  index = textB.indexOf(textA);
  if (index == -1) {
    return textB;
  }
  return textB.subString(index, tebB.length);
};

/**
 * Tracks pageviews.
 * @param {goog.Uri} destination The destination URI.
 */
silently.tools.trackPageview = function(destination) {
    if (typeof ga != 'undefined') {
        ga('send', 'pageview');
    }
};

silently.tools.trackEvent = function(category, action, label, value) {
    if (typeof ga != 'undefined') {
        ga('send', 'event', category, action, label, value);
    }
};


silently.tools.setCookie = function(name, value) {
  var json_str = goog.json.serialize(value);
  var b64_str = goog.crypt.base64.encodeString(json_str, true);
  var quoted_b64_str = goog.string.urlEncode(b64_str);
  goog.net.cookies.set(name, quoted_b64_str);
};

silently.tools.getCookie = function(name) {
  try {
    var cookieData = goog.net.cookies.get(name);
    if (cookieData) {
      var cleanCookieData = goog.string.urlDecode(goog.string.stripQuotes(
            cookieData, '"'));
      return goog.json.parse(goog.crypt.base64.decodeString(cleanCookieData, true));
    }
  } catch (err) {
    return {};
  }
};


/**
 * Returns a UUID
 * See: http://stackoverflow.com/questions/105034
 * /how-to-create-a-guid-uuid-in-javascript
 * @return {String} A uuid.
 */
silently.tools.guid = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
      function(c) {
        var r = Math.random() * 16 | 0;
        var v = c == 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);}
      );
};

silently.tools.getUuid = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
      function(c) {
        var r = Math.random() * 16 | 0;
        var v = c == 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);}
      );
};

silently.tools.randomStr = function(len) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < len; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};

silently.tools.commaSeparateNumber = function(val) {
  while (/(\d+)(\d{3})/.test(val.toString())) {
    val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
  }
  return val;
};

silently.tools.zfill = function(n, width) {
  z = '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};



/**
 * Returns a new container element, optionally with a rendered template.
 * @param {function=} opt_template Optional template to render.
 * @param {Object=} opt_templateArgs Optional template arguments.
 * @param {string=} opt_className Optional class name for base element.
 * @return {Element}
 */
silently.tools.getNewContainer = function(opt_template,
    opt_templateArgs, opt_className) {
  var pageContainer = goog.dom.createDom('div');
  if (opt_className) {
    goog.dom.classes.add(pageContainer, opt_className);
  }
  if (opt_template) {
    pageContainer.innerHTML = opt_template(opt_templateArgs);
  }
  return pageContainer;
};


silently.tools.getIdealPlayerWidth = function(fmt) {
  var vpWidth = goog.dom.getViewportSize().width;
  if (fmt == 'gif') {
    return 300;
  } else if (vpWidth < 520) {
    return 300;
  } else if (vpWidth < 600) {
    return 480;
  } else {
    return 600;
  }
};

silently.tools.getRecommendedPlayerSize = function(animation, fullscreen) {
  var uri = goog.Uri.parse(window.location);
  var size = uri.getQueryData().get('size');
  var vpSize = goog.dom.getViewportSize();
  if (!(size)) {
    if (fullscreen) {
      if (vpSize.width < 480) {
        size = 'p';
      } else {
        size = 'd';
      }
    } else {
      if (vpSize.width < 900) {
        size = 'p';
      } else {
        size = 'd';
      }
    }
  }
  return size;
};

silently.tools.jsonReplacer = function(name, value) {
  if (typeof(value) == 'string') {
    return value.replace('/', '\\/');
  } else {
    return value;
  }
};

silently.tools.getCloudFrontQueryString = function() {
  var uri = new goog.Uri(document.URL);
  return uri.getScheme() + '_' + uri.getDomain();
};

// encode(decode) html text into html entity
silently.tools.decodeHtmlEntity = function(mystring) {
  var replaceFunc = function(match, dec) {
      return String.fromCharCode(dec);
  };
  var rv = mystring.replace('/&#(\d+);/g', replaceFunc);
  return rv;
};

silently.tools.encodeHtmlEntity = function(str) {
  var buf = [];
  for (var i = str.length - 1; i >= 0; i--) {
    buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
  }
  return buf.join('');
};
