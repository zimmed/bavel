import {_} from '../src/utils';
import sinon from 'sinon';

const mock = {
    reset: () => {
        mock.Engine.reset();
        mock.Vector3.reset();
        mock.ActionManager.reset();
        mock.ExecuteCodeAction.reset();
    },
    ActionManager: sinon.spy(function ActionManager() {
        this.actions = []
        this.registerAction = sinon.spy(function registerAction(t) {this.actions.push(t);});
        this.reset = () => this.registerAction.reset();
    }),
    ExecuteCodeAction: sinon.spy(function ExecuteCodeAction() {}),
    Vector3: sinon.spy(function Vector3() {}),
    Engine: sinon.spy(function Engine(...args) {
        this.fps = 60;
        this.runRenderLoop = _.noop;
        this.stopRenderLoop = _.noop;
        this.dispose = _.noop;
        this.resize = _.noop;
        this.stubs = {
            constructor: {
                calledWith: args
            },
            runRenderLoop: sinon.stub(this, 'runRenderLoop'),
            stopRenderLoop: sinon.stub(this, 'stopRenderLoop'),
            dispose: sinon.stub(this, 'dispose'),
            resize: sinon.stub(this, 'resize')
        };
    })
};

mock.ActionManager.OnKeyUpTrigger = 'up';
mock.ActionManager.OnKeyDownTrigger = 'down';
mock.ActionManager.OnLeftPickTrigger = 'left';
mock.ActionManager.OnRightPickTrigger = 'right';
mock.ActionManager.OnPointerOverTrigger = 'over';
mock.ActionManager.OnPointerOutTrigger = 'out';

module.exports = mock;