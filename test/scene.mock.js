import sinon from 'sinon';
import noop from 'lodash.noop';

export default function Scene(...args) {
    this.baby = {render: noop};
    this.mount = noop;
    this.dismount = noop;
    this.tick = noop;
    this.updateEntities = noop;
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
