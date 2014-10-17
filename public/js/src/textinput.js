/**
 * @fileoverview Text input control.
 *
 * @author mattias@silently.com (Mattias Granlund)
 */

goog.provide('silently.TextInput');

goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyHandler');
goog.require('goog.ui.Component');
goog.require('silently.Control');
goog.require('silently.TextInputRenderer');

silently.TextInput = function() {
    goog.base(this, null,
            silently.TextInputRenderer.getInstance());
    this.supportedStates_ =
        goog.ui.Component.State.DISABLED |
        goog.ui.Component.State.HOVER |
        goog.ui.Component.State.ACTIVE;
};
goog.inherits(silently.TextInput, silently.Control);

silently.TextInput.prototype.attachEvents = function() {
    goog.base(this, 'attachEvents');
    var eh = this.getHandler();

    // Bubble phase allows this to react to keyboard when no other
    // context is available.
    eh.listen(this.getKeyHandler(), goog.events.KeyHandler.EventType.KEY,
            this.handleKey);
};

silently.TextInput.prototype.enterDocument = function() {
    goog.base(this, 'enterDocument');
    this.getKeyHandler().attach(document, /** Capture */ false);
    this.attachEvents();
};

silently.TextInput.prototype.handleKey = function(e) {
    if (goog.events.KeyCodes.isCharacterKey(e.keyCode)) {
        console.log(e.keyCode);
    } else {
        switch (e.keyCode) {
            case goog.events.KeyCodes.ENTER:
                console.log('Bring it up!');
                break;
        }
    }
};
