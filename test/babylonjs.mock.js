import sinon from 'sinon';

const mock = module.exports = {
    reset: () => {
        mock.Engine.resetHistory();
        mock.Vector3.resetHistory();
        mock.ActionManager.resetHistory();
        mock.ExecuteCodeAction.resetHistory();
    },
    ActionManager: sinon.spy(function ActionManager() {
        this.actions = []
        this.registerAction = sinon.spy(t => { this.actions.push(t); });
        this.resetHistory = () => this.registerAction.resetHistory();
    }),
    ExecuteCodeAction: sinon.spy(function ExecuteCodeAction() {}),
    Vector3: sinon.spy(function Vector3() {}),
    Engine: sinon.spy(function Engine(...args) {
        const sb = sinon.createSandbox();

        Object.assign(this, {
            fps: 60,
            constructor: sb.spy(),
            runRenderLoop: sb.spy(),
            stopRenderLoop: sb.spy(),
            dispose: sb.spy(),
            resize: sb.spy(),
            reset: () => sb.resetHistory(),
        });
        this.constructor(...args);
    }),
};

mock.ActionManager.OnKeyUpTrigger = 'up';
mock.ActionManager.OnKeyDownTrigger = 'down';
mock.ActionManager.OnLeftPickTrigger = 'left';
mock.ActionManager.OnRightPickTrigger = 'right';
mock.ActionManager.OnPointerOverTrigger = 'over';
mock.ActionManager.OnPointerOutTrigger = 'out';
