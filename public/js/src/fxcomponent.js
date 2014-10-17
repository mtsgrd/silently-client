/**
 * @fileoverview FX enabled component.
 *
 * @author mattias@silently.com (Mattias Granlund)
 */


/**
 * @constructor
 */
silently.FXComponent = function(opt_element) {
    goog.base(this, opt_domHelper);
    if (opt_element) {
        this.setElementInternal(opt_element);
    }
};
goog.inherits(silently.FXComponent, goog.ui.Component);

/**
 * CSS class to make element appear.
 */
silently.FXComponent.ENTER_CSS_NAME = goog.getCssName('enter');

/**
 * CSS class to make element disappear.
 */
silently.FXComponent.LEAVE_CSS_NAME = goog.getCssName('leave');

silently.FXComponent.prototype.enter = function() {
    goog.dom.classlist.add(this.element_, silently.FXComponent.ENTER_CSS_NAME);
};

silently.FXComponent.prototype.enterIn = function(ms) {
    var self = this;
    setTimeout(function() {
        self.enter();
    }, ms);
    return this;
};

silently.FXComponent.prototype.leave = function() {
    goog.dom.classlist.add(this.element_, silently.FXComponent.LEAVE_CSS_NAME);
};

silently.FXComponent.prototype.leaveIn = function(ms) {
    var self = this;
    setTimeout(function() {
        self.enter();
    }, ms);
    return this;
};
