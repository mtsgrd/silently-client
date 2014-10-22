/**
 * @fileoverview Splash flow for Silently.
 *
 * @author mattias@silently.com (Mattias Granlund)
 */


goog.provide('silently.ui.Splash');
goog.require('goog.ui.Component');
goog.require('goog.ui.CustomButton');
goog.require('silently.ui.Component');
goog.require('silently.ui.Control');

/**
 * @constructor
 */
silently.ui.Splash = function() {
    goog.base(this);
};
goog.inherits(silently.ui.Splash, silently.ui.Component);

/**
 * @protected
 * @type silently.ui.Splash
 */
silently.ui.Splash.instance_;

/**
 * @protected
 * @type {goog.ui.Component}
 */
silently.ui.Splash.highlighted_;

/**
 * @type {enum}
 */
silently.ui.Splash.EventType = {
    READY: 'ready'
};

silently.ui.Splash.getInstance = function() {
    if (silently.ui.Splash.instance_) {
        return silently.ui.Splash.instance_;
    } else {
        var signup = new silently.ui.Splash();
        silently.ui.Splash.instance_ = signup;
        signup.render();
        return signup;
    }
};

/** @override */
silently.ui.Splash.prototype.createDom = function() {
    var dm = this.getDomHelper(),
        // Placeholder so we can transition into first splsah screen.
        beginPlaceHolder = dm.createDom('div'),
        // First splash screen
        logo = dm.createDom('div', goog.getCssName('logo'), 'Food Yo!'),
        // Got it button.
        gotIt = dm.createDom('div', goog.getCssName('gotit-button'),
                'Got it!');
        // Second splash screen
        taglineText = dm.createDom('div', null, 'It\'s that simple.'),
        tagline = dm.createDom('div', goog.getCssName('tagline'),
                taglineText, gotIt),

    this.setElementInternal(dm.createDom('div', {'id': 'splash'},
            beginPlaceHolder, logo, tagline));

    this.beginPlaceHolder = new silently.ui.Control();
    this.beginPlaceHolder.setSupportedState(goog.ui.Component.State.SELECTED, true);
    this.addChild(this.beginPlaceHolder, false);
    this.beginPlaceHolder.decorate(beginPlaceHolder);

    this.logo = new silently.ui.Control();
    this.logo.setSupportedState(goog.ui.Component.State.SELECTED, true);
    this.addChild(this.logo, false);
    this.logo.decorate(logo);

    this.tagline = new silently.ui.Control();
    this.tagline.setSupportedState(goog.ui.Component.State.SELECTED, true);
    this.addChild(this.tagline, false);
    this.tagline.decorate(tagline);

    this.gotIt = new goog.ui.CustomButton();
    this.addChild(this.gotIt, false);
    this.gotIt.decorate(gotIt);
};

/** @override */
silently.ui.Splash.prototype.enterDocument = function() {
    goog.base(this, 'enterDocument');
    // Timers for splash screen messages.
    this.setSelectedIndex(0);
    this.setSelectedIn(this.logo, 500);
    this.setSelectedIn(this.tagline, 2000);
    this.attachEvents();
};

silently.ui.Splash.prototype.attachEvents = function() {
    var eh = this.getHandler();
    eh.listen(this.gotIt, goog.ui.Component.EventType.ACTION,
            function(e) {
                this.dispatchEvent({
                    type: silently.ui.Splash.EventType.READY});
            });
};

silently.ui.Splash.prototype.setSelectedIn = function(child, ms) {
    var self = this;
    setTimeout(function() {
        self.setSelectedIndex(self.indexOfChild(child));
    }, ms);
};


silently.ui.Splash.prototype.setSelected = function(child) {
    if (child && child.isEnabled()) {
        if (this.highlighted_) {
            this.highlighted_.setSelected(false);
        }
        this.highlighted_ = child;
        child.setSelected(true);
    }
};

silently.ui.Splash.prototype.setSelectedIndex = function(index) {
    var child = this.getChildAt(index);
    this.setSelected(child);
};
