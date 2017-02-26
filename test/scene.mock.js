import {_} from '../src/utils';
import sinon from 'sinon';

export default function Scene(...args) {
    this.baby = {render: _.noop};
    this.mount = _.noop;
    this.dismount = _.noop;
    this.tick = _.noop;
    this.updateEntities = _.noop;
    this.stubs = {
        constructor: {calledWith: args},
        mount: sinon.stub(this, 'mount'),
        dismount: sinon.stub(this, 'dismount'),
        render: sinon.stub(this.baby, 'render'),
        tick: sinon.stub(this, 'tick'),
        updateEntities: sinon.stub(this, 'updateEntities', () => Promise.resolve())
    };
    this.restore = () => {
        this.stubs.mount.restore();
        this.stubs.dismount.restore();
        this.stubs.render.restore();
        this.stubs.tick.restore();
        this.stubs.updateEntities.restore();
    };
}
