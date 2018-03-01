import sinon from 'sinon';
import noop from 'lodash.noop';

export default function PlayerController(...args) {
    this.DOM_EVENTS = {click: noop, contextmenu: noop};
    this.setup = noop;
    this.entityClick = noop;
    this.entityAltClick = noop;
    this.entityOver = noop;
    this.entityOut = noop;
    this.stubs = {
        constructor: {calledWith: args},
        setup: sinon.stub(this, 'setup'),
        entityClick: sinon.stub(this, 'entityClick'),
        entityAltClick: sinon.stub(this, 'entityAltClick'),
        entityOver: sinon.stub(this, 'entityOver'),
        entityOut: sinon.stub(this, 'entityOut'),
        click: sinon.stub(this.DOM_EVENTS, 'click')
    };
    this.restore = () => {
        this.stubs.setup.restore();
        this.stubs.entityClick.restore();
        this.stubs.entityAltClick.restore();
        this.stubs.entityOver.restore();
        this.stubs.entityOut.restore();
        this.stubs.click.restore();
    };
}
