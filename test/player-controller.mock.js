import {_} from '../src/utils';
import sinon from 'sinon';

export default function PlayerController(...args) {
    this.DOM_EVENTS = {click: _.noop, contextmenu: _.noop};
    this.setup = _.noop;
    this.entityClick = _.noop;
    this.entityAltClick = _.noop;
    this.entityOver = _.noop;
    this.entityOut = _.noop;
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
