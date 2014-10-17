/**
 * @fileoverview Signup flow for Silently.
 *
 * @author mattias@silently.com (Mattias Granlund)
 */


goog.provide('silently.Signup');
goog.require('silently.Status');
goog.require('goog.async.Delay');
goog.require('goog.ui.LabelInput');
goog.require('goog.ui.CustomButton');
goog.require('goog.ui.Component');

/**
 * @constructor
 */
silently.Signup = function(apiKey, lat, lng) {
    goog.base(this);
    this.ws = silently.net.WebSocket.getInstance();
    this.focusable_ = false;
    this.checkUsername = new goog.async.Delay(this.checkUsername, 250, this);
};
goog.inherits(silently.Signup, goog.ui.Component);

/**
 * @protected
 * @type silently.Signup
 */
silently.Signup.instance_;

/**
 * @protected
 * @type {goog.ui.Component}
 */
silently.Signup.highlighted_;

silently.Signup.getInstance = function() {
    if (silently.Signup.instance_) {
        return silently.Signup.instance_;
    } else {
        var signup = new silently.Signup();
        silently.Signup.instance_ = signup;
        signup.render();
        return signup;
    }
};

/** @override */
silently.Signup.prototype.createDom = function() {
    var dm = this.getDomHelper(),
        // Placeholder so we can transition into first splsah screen.
        beginPlaceHolder = dm.createDom('div'),
        // First splash screen
        logo = dm.createDom('div', {'id': 'logo'}, 'Silently'),
        // Second splash screen
        tagline = dm.createDom('div', {'id': 'tagline'},
                'Whatever you want.'),
        // Login button if user is already registered.
        loginIcon = dm.createDom('div'),
        loginLink = dm.createDom('div', {'id': 'login', 'class': goog.getCssName('login')},
                'Already registered?', loginIcon),
        // Username form
        usernameStatus = dm.createDom('div', goog.getCssName('status'),
                'choose username'),
        usernameProgress = dm.createDom('div', goog.getCssName('progress')),
        username = dm.createDom('div', goog.getCssName('form-field')),
        usernameGo = dm.createDom('div', goog.getCssName('form-go'), 'Go'),
        usernameContainer = dm.createDom('div', goog.getCssName('form-container'),
                loginLink, usernameStatus, usernameProgress, username, usernameGo),
        // number verification form.
        numberStatus = dm.createDom('div', goog.getCssName('status'),
                'verify number'),
        numberProgress = dm.createDom('div', goog.getCssName('progress')),
        numberInput = dm.createDom('input', {'type': 'tel'}),
        number = dm.createDom('div', goog.getCssName('form-field'), numberInput),
        numberGo = dm.createDom('div', goog.getCssName('form-go'), 'Go'),
        numberBack = dm.createDom('div', goog.getCssName('form-back'), 'Back'),
        numberContainer = dm.createDom('div', goog.getCssName('form-container'),
                numberStatus, numberProgress, number, numberGo, numberBack),
        // Code verification.
        pinStatus = dm.createDom('div', goog.getCssName('status'),
                'verfiy pin code'),
        pinProgress = dm.createDom('div', goog.getCssName('progress')),
        pinInput = dm.createDom('input', {'type': 'tel'}),
        pin = dm.createDom('div', goog.getCssName('form-field'), pinInput),
        pinGo = dm.createDom('div', goog.getCssName('form-go'), 'Go'),
        pinBack = dm.createDom('div', goog.getCssName('form-back'), 'Back'),
        pinContainer = dm.createDom('div', goog.getCssName('form-container'),
                pinStatus, pinProgress, pin, pinGo, pinBack),
        // Password prompt.
        passwordStatus = dm.createDom('div', goog.getCssName('status'),
                'choose password'),
        passwordProgress = dm.createDom('div', goog.getCssName('progress')),
        passwordInput = dm.createDom('input', {'type': 'password'}),
        password = dm.createDom('div', goog.getCssName('form-field'), passwordInput),
        passwordConfirmInput = dm.createDom('input', {'type': 'password'}),
        passwordConfirm = dm.createDom('div', goog.getCssName('form-field'),
                passwordConfirmInput),
        passwordConfirmLabel = dm.createDom('div', goog.getCssName('field-label'),
                'confirm password'),
        passwordGo = dm.createDom('div', goog.getCssName('form-go'), 'Go'),
        passwordBack = dm.createDom('div', goog.getCssName('form-back'), 'Back'),
        passwordContainer = dm.createDom('div', goog.getCssName('form-container'),
                passwordStatus, passwordProgress, password, passwordConfirmLabel,
                passwordConfirm, passwordGo, passwordBack),
        // Login prompt.
        loginStatus = dm.createDom('div', goog.getCssName('status'),
                'Sign-in'),
        loginProgress = dm.createDom('div', goog.getCssName('progress')),
        login = dm.createDom('div', goog.getCssName('form-field')),
        loginPasswordInput = dm.createDom('input', {'type': 'password'}),
        loginPassword = dm.createDom('div', goog.getCssName('form-field'),
                loginPasswordInput),
        loginConfirmLabel = dm.createDom('div', goog.getCssName('field-label'),
                'password'),
        loginGo = dm.createDom('div', goog.getCssName('form-go'), 'Go'),
        loginBack = dm.createDom('div', goog.getCssName('form-back'), 'Back'),
        loginContainer = dm.createDom('div', goog.getCssName('form-container'),
                loginStatus, loginProgress, login, loginConfirmLabel,
                loginPassword, loginGo, loginBack),
        spinner = dm.createDom('div', {'id': 'spinner'});

    this.setElementInternal(dm.createDom('div', {'id': 'signup'},
            beginPlaceHolder, logo, tagline, usernameContainer,
            numberContainer, pinContainer, passwordContainer, loginContainer,
            spinner));

    this.beginPlaceHolder = new silently.Control();
    this.beginPlaceHolder.setSupportedState(goog.ui.Component.State.SELECTED, true);
    this.addChild(this.beginPlaceHolder, false);
    this.beginPlaceHolder.decorate(beginPlaceHolder);

    this.logo = new silently.Control();
    this.logo.setSupportedState(goog.ui.Component.State.SELECTED, true);
    this.addChild(this.logo, false);
    this.logo.decorate(logo);

    this.tagline = new silently.Control();
    this.tagline.setSupportedState(goog.ui.Component.State.SELECTED, true);
    this.addChild(this.tagline, false);
    this.tagline.decorate(tagline);

    this.usernameContainer = new silently.Control();
    this.usernameContainer.setSupportedState(
            goog.ui.Component.State.SELECTED, true);
    this.addChild(this.usernameContainer, false);
    this.usernameContainer.decorate(usernameContainer);

    this.username = new goog.ui.LabelInput();
    this.username.render(username, true);
    this.username.focusAndSelect();

    this.usernameGo = new goog.ui.CustomButton();
    this.usernameContainer.addChild(this.usernameGo, false);
    this.usernameGo.decorate(usernameGo);
    this.usernameGo.setEnabled(false);

    this.usernameStatus = new silently.Status();
    this.usernameContainer.addChild(this.usernameStatus, false);
    this.usernameStatus.decorate(usernameStatus);

    this.usernameProgress = usernameProgress;

    this.numberContainer = new silently.Control();
    this.numberContainer.setSupportedState(
            goog.ui.Component.State.SELECTED, true);
    this.addChild(this.numberContainer, false);
    this.numberContainer.decorate(numberContainer);

    this.number = new goog.ui.LabelInput('+X-XXX-XXX-XXXX');
    this.number.decorate(numberInput, true);
    this.number.focusAndSelect();

    this.numberBack = new goog.ui.CustomButton();
    this.numberContainer.addChild(this.numberBack, false);
    this.numberBack.decorate(numberBack);

    this.numberGo = new goog.ui.CustomButton();
    this.numberContainer.addChild(this.numberGo, false);
    this.numberGo.decorate(numberGo);

    this.numberStatus = new silently.Status();
    this.numberContainer.addChild(this.numberStatus, false);
    this.numberStatus.decorate(numberStatus);

    this.numberProgress = numberProgress;

    this.pinContainer = new silently.Control();
    this.pinContainer.setSupportedState(
            goog.ui.Component.State.SELECTED, true);
    this.addChild(this.pinContainer, false);
    this.pinContainer.decorate(pinContainer);

    this.pin = new goog.ui.LabelInput('');
    this.pin.decorate(pinInput, true);
    this.pin.focusAndSelect();

    this.pinBack = new goog.ui.CustomButton();
    this.pinContainer.addChild(this.pinBack, false);
    this.pinBack.decorate(pinBack);

    this.pinGo = new goog.ui.CustomButton();
    this.pinContainer.addChild(this.pinGo, false);
    this.pinGo.decorate(pinGo);

    this.pinStatus = new silently.Status();
    this.pinContainer.addChild(this.pinStatus, false);
    this.pinStatus.decorate(pinStatus);

    this.pinProgress = pinProgress;

    this.passwordContainer = new silently.Control();
    this.passwordContainer.setSupportedState(
            goog.ui.Component.State.SELECTED, true);
    this.addChild(this.passwordContainer, false);
    this.passwordContainer.decorate(passwordContainer);

    this.password = new goog.ui.LabelInput('');
    this.passwordContainer.addChild(this.password, false);
    this.password.decorate(passwordInput);
    this.password.focusAndSelect();

    this.passwordConfirm = new goog.ui.LabelInput('confirm password');
    this.passwordContainer.addChild(this.passwordConfirm, false);
    this.passwordConfirm.decorate(passwordConfirm);

    this.passwordBack = new goog.ui.CustomButton();
    this.passwordContainer.addChild(this.passwordBack, false);
    this.passwordBack.decorate(passwordBack);

    this.passwordGo = new goog.ui.CustomButton();
    this.passwordContainer.addChild(this.passwordGo, false);
    this.passwordGo.decorate(passwordGo);

    this.passwordStatus = new silently.Status();
    this.passwordContainer.addChild(this.passwordStatus, false);
    this.passwordStatus.decorate(passwordStatus);

    this.passwordProgress = passwordProgress;

    this.loginContainer = new silently.Control();
    this.loginContainer.setSupportedState(
            goog.ui.Component.State.SELECTED, true);
    this.addChild(this.loginContainer, false);
    this.loginContainer.decorate(loginContainer);

    this.login = new goog.ui.LabelInput('username');
    this.loginContainer.addChild(this.login, false);
    this.login.render(login);
    this.login.focusAndSelect();

    this.loginPassword = new goog.ui.LabelInput('confirm login');
    this.loginContainer.addChild(this.loginPassword, false);
    this.loginPassword.decorate(loginPassword);

    this.loginBack = new goog.ui.CustomButton();
    this.loginContainer.addChild(this.loginBack, false);
    this.loginBack.decorate(loginBack);

    this.loginGo = new goog.ui.CustomButton();
    this.loginContainer.addChild(this.loginGo, false);
    this.loginGo.decorate(loginGo);

    this.loginStatus = new silently.Status();
    this.loginContainer.addChild(this.loginStatus, false);
    this.loginStatus.decorate(loginStatus);

    this.loginProgress = loginProgress;



    this.loginLink = loginLink;
};

/** @override */
silently.Signup.prototype.enterDocument = function() {
    goog.base(this, 'enterDocument');
    this.setSelectedIndex(0);
    this.setSelectedIn(this.logo, 500);
    this.setSelectedIn(this.tagline, 2000);
    this.setSelectedIn(this.usernameContainer, 4000);
    this.attachEvents();
};

silently.Signup.prototype.attachEvents = function() {
    // Convenience declarations
    var eh = this.getHandler(),
        ws = this.ws;

    eh.listen(this.usernameGo, goog.ui.Component.EventType.ACTION, this.onUsernameGo);
    eh.listen(this.numberGo, goog.ui.Component.EventType.ACTION, this.onNumberGo);
    eh.listen(this.pinGo, goog.ui.Component.EventType.ACTION, this.onPinGo);
    eh.listen(this.loginLink, goog.events.EventType.CLICK, this.onLogin);
    eh.listen(this.loginGo, goog.ui.Component.EventType.ACTION, this.onLogin);
    eh.listen(this.username.getElement(), goog.events.EventType.KEYUP, this.onCheckUsername);
    eh.listen(this.numberBack, goog.ui.Component.EventType.ACTION, this.onBack);
    eh.listen(this.pinBack, goog.ui.Component.EventType.ACTION, this.onBack);
    eh.listen(this.passwordBack, goog.ui.Component.EventType.ACTION, this.onBack);
    eh.listen(this.loginBack, goog.ui.Component.EventType.ACTION, this.onBack);
    eh.listen(ws, silently.net.WebSocket.EventType.USERNAME_CHECK, this.onUsernameChecked);
    eh.listen(ws, silently.net.WebSocket.EventType.VERIFY_NUMBER, this.onNumberVerified);
    eh.listen(ws, silently.net.WebSocket.EventType.CONFIRM_PIN, this.onPinVerified);
};

silently.Signup.prototype.setSelectedIn = function(child, ms) {
    var self = this;
    setTimeout(function() {
        self.setSelectedIndex(self.indexOfChild(child));
    }, ms);
};

silently.Signup.prototype.onPinGo = function() {
    var pin = this.pin.getValue();
    goog.dom.classlist.enable(this.pinProgress, goog.getCssName('go'), true);
    this.ws.emit('confirm_pin', {'pid': this.getProveId, 'pin': pin});
};

silently.Signup.prototype.checkUsername = function() {
    var username = this.username.getValue();
    if (username != this.lastUsername) {
        goog.dom.classlist.enable(this.usernameProgress, goog.getCssName('go'), true);
        this.ws.emit('check_username', username);
        this.lastUsername = username;
    }
};

silently.Signup.prototype.onBack = function(e) {
    switch (e.target) {
        case this.numberBack:
            this.setSelected(this.usernameContainer);
            break;
        case this.pinBack:
        case this.passwordBack:
            this.numberGo.setEnabled(true);
            this.numberStatus.reset();
            this.setSelected(this.numberContainer);
            break;
        case this.loginBack:
            this.setSelected(this.usernameContainer);
            break;
    }
};
silently.Signup.prototype.onCheckUsername = function() {
    if (this.username.hasChanged()) {
        this.checkUsername.stop();
        this.checkUsername.start();
    }
};

silently.Signup.prototype.onNumberGo = function() {
    var number = this.number.getValue();
    if (number == this.verifiedNumber_) {
        this.numberStatus.set('number already verified');
        this.setSelectedIn(this.passwordContainer, 1000);
    } else {
        this.pinGo.setEnabled(true);
        this.numberGo.setEnabled(false);
        this.ws.emit(silently.net.WebSocket.EventType.VERIFY_NUMBER, number);
        goog.dom.classlist.enable(this.numberProgress, goog.getCssName('go'), true);
    }
};

silently.Signup.prototype.onPinVerified = function(e) {
    goog.dom.classlist.enable(this.pinProgress, goog.getCssName('go'), false);
    if ('error' in e.data) {
        // TODO: Panic?
        this.pinGo.setEnabled(true);
        this.pinStatus.set(e.data['error']);
    } else if (e.data['verified']) {
        this.verifiedNumber_ = e.data['tel'];
        this.pinStatus.set('pin verified');
        this.setSelectedIn(this.passwordContainer, 1000);
    } else {
        this.pinStatus.set('incorrect pin');
    }
};

silently.Signup.prototype.onNumberVerified = function(e) {
    goog.dom.classlist.enable(this.numberProgress, goog.getCssName('go'), false);
    if ('error' in e.data) {
        // TODO: Panic?
        this.numberStatus.set(e.data['error']);
        this.numberGo.setEnabled(true);
    } else {
        this.getProveId = e.data['id'];
        this.numberStatus.set('verification sent');
        this.pinStatus.reset();
        this.setSelectedIn(this.pinContainer, 1000);
    }
};

silently.Signup.prototype.onUsernameGo = function() {
    this.setSelected(this.numberContainer);
};

silently.Signup.prototype.onUsernameChecked = function(e) {
    var available = e.data['available'],
        username = e.data['username'];

    if (username != this.username.getValue()) {
        // Do nothing if the username is now different from what is in the
        // response.
        return;
    } else if (available) {
        this.usernameStatus.set("Username available");
        this.usernameGo.setEnabled(true);
        // Ask for number number verification.
    } else {
        this.usernameStatus.set("Username unavailable");
        this.usernameGo.setEnabled(false);
    }
    goog.dom.classlist.enable(this.usernameProgress, goog.getCssName('go'), false);

};

silently.Signup.prototype.onLogin = function() {
    this.setSelected(this.loginContainer);
};

silently.Signup.prototype.setSelected = function(child) {
    if (child && child.isEnabled()) {
        switch (child) {
            case this.usernameContainer:
                this.username.getElement().focus();
                break;
            case this.numberContainer:
                this.number.getElement().focus();
                break;
            case this.pinContainer:
                this.pin.getElement().focus();
                break;
            case this.passwordContainer:
                this.password.getElement().focus();
                break;
            case this.loginContainer:
                this.login.getElement().focus();
                break;
        }

        if (this.highlighted_) {
            this.highlighted_.setSelected(false);
        }
        this.highlighted_ = child;
        child.setSelected(true);
    }
};
silently.Signup.prototype.setSelectedIndex = function(index) {
    var child = this.getChildAt(index);
    this.setSelected(child);
};
