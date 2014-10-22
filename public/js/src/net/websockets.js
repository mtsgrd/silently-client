// This script licensed under the MIT.
// http://orgachem.mit-license.org

/**
 * @fileoverview A wrapper class for Socket.IO.
 * @author orga.chem.job@gmail.com (OrgaChem)
 */


goog.provide('silently.net.WebSocket');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.debug');
goog.require('goog.debug.Logger');
goog.require('goog.dom');
goog.require('goog.events.Event');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');
goog.require('goog.structs.Queue');



/**
 * A wrapper class for Socket.IO.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
silently.net.WebSocket = function() {
    goog.base(this);
    this.log = goog.debug.Logger.getLogger('silently.net.WebSocket');

    this.callbacks_ = {};
    this.listenerMap_ = {};
    this.rooms_ = [];
    this.buffer_ = new goog.structs.Queue();
    this.handler_ = new goog.events.EventHandler(this);
    this.listenerBuffer_ = new goog.structs.Queue();
};
goog.inherits(silently.net.WebSocket, goog.events.EventTarget);
goog.addSingletonGetter(silently.net.WebSocket);


/**
 * Client-side script path of Socket.IO.
 * @type {string}
 * @const
 */
silently.net.WebSocket.SCRIPT_PATH = '//cdnjs.cloudflare.com/ajax/libs/socket.io/0.9.16/socket.io.min.js';

silently.net.WebSocket.ENDPOINT = 'http://' + document.location.host + '/default';


/**
 * Event type for the Socket.IO.
 * See: https://github.com/LearnBoost/socket.io/wiki/Exposed-events#client
 * @enum {string}
 */
silently.net.WebSocket.EventType = {
    /** "load" is emitted when the socket was loaded. */
    LOAD: 'load',

    /** "connect" is emitted when the socket connected successfully. */
    CONNECT: 'connect',

    /** "disconnect" is emitted when the socket disconnected. */
    DISCONNECT: 'disconnect',

    /**
     * "connect_failed" is emitted when socket.io fails to establish a connection
     * to the server and has no more transports to fallback to.
     */
    CONNECT_FAILED: 'connect_failed',

    /**
     * "error" is emitted when an error occurs and it cannot be handled by the
     * other event types.
     */
    ERROR: 'error',

    /**
     * "message" is emitted when a message sent with socket.send is received.
     *  message is the sent message, and callback is an optional acknowledgement
     *  function.
     */
    MESSAGE: 'message',
    ROOM_MESSAGE: 'room_message',
    ROOM_EVENT: 'room_event',
    USERNAME_CHECK: 'username_check',
    VERIFY_NUMBER: 'verify_number',
    CONFIRM_PIN: 'confirm_pin',
    RESTAURANT_LIST: 'restaurant_list',
    RESTAURANT_DETAILS: 'restaurant_details'
};


/**
 * State for theSocket.IO sciprt loading.
 * @enum {string}
 */
silently.net.WebSocket.State = {
    /** Has not started loading yet. */
    UNINITIALIZED: 'uninitialized',
    /** Is loading. */
    LOADING: 'loading',
    /** Fully loaded. */
    COMPLETE: 'complete'
};


/**
 * Whether the client-side Socket.IO script was imported.
 * @type {silently.net.WebSocket.State}
 */
silently.net.WebSocket.state = silently.net.WebSocket.State.UNINITIALIZED;


/**
 * Element ID for the Socket.IO script tag.
 * @type {string}
 * @const
 */
silently.net.WebSocket.SCRIPT_ID = 'socket-io-closure';


/**
 * @type {Object.<function>}
 * @private
 */
silently.net.WebSocket.wrapperMap_ = {};


/**
 * @type {Object.<function>}
 * @private
 */
silently.net.WebSocket.wrapperMap_ = {};


/**
 * SocketNamespace object from Socket.IO.
 * @type {SocketNamespace}
 * @private
 */
silently.net.WebSocket.prototype.socket_ = null;


/** @override */
silently.net.WebSocket.prototype.listen = function(type, listener, opt_useCapture,
        opt_listenerScope) {
    if (!this.socketExists()) {
        this.listenerBuffer_.enqueue([type, listener, opt_useCapture,
                opt_listenerScope]);
        return;
    }
    this.setWrapperIfNecessary_(type);
    goog.base(this, 'listen', type, listener, opt_useCapture,
            opt_listenerScope);
};


/** @override */
silently.net.WebSocket.prototype.listenOnce = function(type, listener, opt_useCapture,
        opt_listenerScope) {

    this.setWrapperIfNecessary_(type);
    goog.base(this, 'listenOnce', type, listener, opt_useCapture,
            opt_listenerScope);
};


/**
 * Sets event listener wrapper if necessary.
 * Do not set the wrapper if specified event type was already set.
 * @param {string} type The event type to listen.
 * @private
 */
silently.net.WebSocket.prototype.setWrapperIfNecessary_ = function(type) {
    var wrapperMap = silently.net.WebSocket.wrapperMap_;
    var wrapper;

    if (type !== silently.net.WebSocket.EventType.LOAD && !(type in wrapperMap)) {
        wrapper = wrapperMap[type] = this.createWrapper(type);
            this.addCustomEventListener_(type, wrapper);
    }
};


/**
 * Asserts whether this socket is opened.
 * @private
 */
silently.net.WebSocket.prototype.assertSocketExists_ = function() {
    goog.asserts.assert(goog.isDefAndNotNull(this.socket_),
            'This socket is not opened.');
};

silently.net.WebSocket.prototype.socketExists = function() {
    return goog.isDefAndNotNull(this.socket_);
};


/**
 * Adds a listener to the end of the listeners array for the specified event.
 * @param {string} type The type of the event to listen for.
 * @param {Function|Object} handler The function to handle the event.
 * @private
 */
silently.net.WebSocket.prototype.addCustomEventListener_ = function(type, handler) {
    this.assertSocketExists_();
    this.socket_['on'](type, handler);
};


/**
 * Remove a listener from the listener array for the specified event.
 * Caution: changes array indices in the listener array behind the listener.
 * @param {string} type The type of the event to listen for.
 * @param {Function|Object} handler The function to handle the event.
 * @private
 */
silently.net.WebSocket.prototype.removeCustomEventListener_ = function(type, handler) {
    var wrapperMap = silently.net.WebSocket.wrapperMap_;

    this.assertSocketExists_();
    this.socket_['removeListener'](type, handler);
};


/**
 * Returns created listener wrapper for Socket.IO.
 * @param {string} type The event type of wrapper.
 * @return {Function} Created wrapper function.
 * @protected
 */
silently.net.WebSocket.prototype.createWrapper = function(type) {
    var wrapper;
    var that = this;

    switch (type) {
        case silently.net.WebSocket.EventType.MESSAGE:
            return function(data) {
                var message = data['message'] || 'this is a blank message';
                that.log.fine('Message: ' + goog.debug.expose(data));
                that.dispatchEvent({ type: type, data: data});
            };
        case silently.net.WebSocket.EventType.ROOM_MESSAGE:
            return function(data) {
                var message = data['message'] || 'this is a blank message';
                var room = data['room'];
                that.log.fine('Message: ' + goog.debug.expose(data));
                that.dispatchEvent({ type: type, room: room, data: data});
            };
        case silently.net.WebSocket.EventType.ROOM_EVENT:
            return function(data) {
                var room = data['room'];
                that.log.fine('Message: ' + goog.debug.expose(data));
                that.dispatchEvent({ type: type, room: room, data: data});
            };
        case silently.net.WebSocket.EventType.CONNECT:
            return function() {
                that.log.fine('Connection: ' + type);
                that.dispatchEvent({ type: type });
            };
        case silently.net.WebSocket.EventType.DISCONNECT:
        case silently.net.WebSocket.EventType.CONNECT_FAILED:
        case silently.net.WebSocket.EventType.ERROR:
            return function(reason) {
                that.log.fine('Connection: ' + type + ' ' + reason);
                that.dispatchEvent({ type: type, data: reason });
            };
        default:
            return function(data) {
                that.dispatchEvent({type: type, data: data});
            };
    }
};


/**
 * Checks to see if the web socket is open or not.
 * @return {boolean} True if the web socket is open, false otherwise.
 */
silently.net.WebSocket.prototype.isOpen = function() {
    return silently.net.WebSocket.imported_ && this.socket_ &&
        this.socket_['socket']['open'];
};


/**
 * Creates and opens the Socket.IO.
 * @param {string} url The URL to which to connect.
 * @param {?Object=} opt_options Optional arguments for Socket.IO.
 */
silently.net.WebSocket.prototype.connect = function() {
    this.importSocketIo();
};


/**
 * Imports client-side Socket.IO script.
 */
silently.net.WebSocket.prototype.importSocketIo = function() {
    var script;

    switch (silently.net.WebSocket.state) {
        case silently.net.WebSocket.State.COMPLETE:
            this.handleScriptLoad_();
            break;
        case silently.net.WebSocket.State.LOADING:
            script = goog.dom.getElement(silently.net.WebSocket.SCRIPT_ID);
            this.handler_.listen(script, goog.events.EventType.LOAD,
                    this.handleScriptLoad_);
            break;
        case silently.net.WebSocket.State.UNINITIALIZED:
            script = goog.dom.createDom('script', {
                'src': silently.net.WebSocket.SCRIPT_PATH,
                   'type': 'text/javascript',
                   'id': silently.net.WebSocket.SCRIPT_ID });

            this.handler_.listen(script, goog.events.EventType.LOAD,
                    this.handleScriptLoad_);

            goog.dom.getDocument().body.appendChild(script);
                silently.net.WebSocket.state = silently.net.WebSocket.State.LOADING;
            break;
        default:
            throw Error('Invalid state: ' + silently.net.WebSocket.state);
    }
};


/**
 * Closes the web socket connection.
 */

silently.net.WebSocket.prototype.close = function() {
    this.assertSocketExists_();
    this.socket_['disconnect']();
};

/**
 * Reconnect
 */

silently.net.WebSocket.prototype.reconnect = function() {
    this.socket_['socket']['disconnect']();
    this.socket_['socket']['connect']();
};


/**
 * Sends the message over the web socket.
 * @param {string} message The message to send.
 */
silently.net.WebSocket.prototype.send = function(message) {
    this.assertSocketExists_();
    this.socket_['send'](message);
};

silently.net.WebSocket.load = function(type, args, opt_success,
        opt_progress, opt_error, opt_handler) {
    var ws = silently.net.WebSocket.getInstance();
    ws.emit(type, args, opt_success,
        opt_progress, opt_error, opt_handler);
};

silently.net.WebSocket.prototype.joinRoom = function(room) {
    goog.array.insert(this.rooms_, room);
    silently.net.WebSocket.load('join_room', room);
};

silently.net.WebSocket.prototype.leaveRoom = function(room) {
    goog.array.remove(this.rooms_, room);
    silently.net.WebSocket.load('leave_room', room);
};

/**
 * Sends the message over the web socket.
 * @param {string} message The message to send.
 */
silently.net.WebSocket.prototype.emit = function(type, arg) {
    if (!this.socketExists()) {
        this.buffer_.enqueue([type, arg]);
        this.importSocketIo();
        return;
    }
    this.assertSocketExists_();
    rv = this.socket_['emit'](type, arg);
    this.log.fine('Emitted type ' + type + ' to socket.io:\n' + goog.debug.expose(arg));
    return rv;
};


/**
 * Dispatechs event on the connected server.
 * @param {{type: string, data: *}} e The event to dispatch.
 */
silently.net.WebSocket.prototype.dispatchEventOnServer = function(e) {
    var type, data;

    if (goog.isString(e)) {
        type = e;
        data = null;
    }
    else {
        type = e.type;
        data = e.data;
    }

    goog.asserts.assertString(type);

    this.assertSocketExists_();
    this.socket_['emit'](type, data);
};


/**
 * Handles Socket.IO message event.
 * @private
 */
silently.net.WebSocket.prototype.onmessage_ = function(msg) {
    var e = new goog.events.Event(silently.net.WebSocket.EventType.MESSAGE);
    this.dispatchEvent(e);
};


/**
 * Handles the event when fired client-side Socket.IO script was loaded.
 * @private
 */
silently.net.WebSocket.prototype.handleScriptLoad_ = function() {
    var io = goog.global['io'];
    if (!goog.isDefAndNotNull(io)) {
        throw Error('Cannot find io: ' + io);
    }
    silently.net.WebSocket.state = silently.net.WebSocket.State.COMPLETE;
    this.socket_ = io['connect'](silently.net.WebSocket.ENDPOINT,
            { 'force new connection' : true });
    var e = new goog.events.Event(silently.net.WebSocket.EventType.LOAD);
    this.dispatchEvent(e);
    while (bufferedArgs = this.buffer_.dequeue()) {
        this.emit.apply(this, bufferedArgs);
    }
    while (bufferedListener = this.listenerBuffer_.dequeue()) {
        this.listen.apply(this, bufferedListener);
    }
    this.handler_.listen(this, silently.net.WebSocket.EventType.CONNECT,
            function(e) {
                goog.array.forEach(this.rooms_, function(room) {
                    this.joinRoom(room);
                }, this);
            });
};


/** @override */
silently.net.WebSocket.prototype.disposeInternal = function() {
    goog.base(this, 'disposeInternal');
    if (this.isOpen()) {
        this.close();
    }

    this.handler_.dispose();
    delete this.socket_;
};

window.onbeforeunload = function() {
    silently.net.WebSocket.getInstance().close();
};
