import sinon from 'sinon';

export default (...args) => {
    const sb = sinon.createSandbox();
    const ctrl = {
        constructor: sb.spy(),
        DOM_EVENTS: { click: sb.spy(), contextmenu: sb.spy() },
        setup: sb.spy(),
        entityClick: sb.spy(),
        entityAltClick: sb.spy(),
        entityOver: sb.spy(),
        entityOut: sb.spy(),
        reset: sb.resetHistory(),
    };

    ctrl.constructor(...args);
    return ctrl;
};
