/**
 * @fileoverview FX enabled component.
 *
 * @author mattias@silently.com (Mattias Granlund)
 */


/**
 * @constructor
 */
silently.ui.FXComponent = function(opt_element) {
    goog.base(this, opt_domHelper);
    if (opt_element) {
        this.setElementInternal(opt_element);
    }
};
goog.inherits(silently.ui.FXComponent, goog.ui.Component);

/**
 * CSS class to make element appear.
 */
silently.ui.FXComponent.ENTER_CSS_NAME = goog.getCssName('enter');

/**
 * CSS class to make element disappear.
 */
silently.ui.FXComponent.LEAVE_CSS_NAME = goog.getCssName('leave');

silently.ui.FXComponent.prototype.enter = function() {
    goog.dom.classlist.add(this.element_, silently.ui.FXComponent.ENTER_CSS_NAME);
};

silently.ui.FXComponent.prototype.enterIn = function(ms) {
    var self = this;
    setTimeout(function() {
        self.enter();
    }, ms);
    return this;
};

silently.ui.FXComponent.prototype.leave = function() {
    goog.dom.classlist.add(this.element_, silently.ui.FXComponent.LEAVE_CSS_NAME);
};

silently.ui.FXComponent.prototype.leaveIn = function(ms) {
    var self = this;
    setTimeout(function() {
        self.enter();
    }, ms);
    return this;
};
