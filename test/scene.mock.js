import sinon from 'sinon';

export default (...args) => {
    const sb = sinon.createSandbox();
    const scene = {
        constructor: sb.spy(),
        baby: { render: sb.spy() },
        mount: sb.spy(),
        dismount: sb.spy(),
        tick: sb.spy(),
        updateEntities: sb.spy(() => Promise.resolve()),
        reset: () => sb.resetHistory(),
    };

    scene.constructor(...args);
    return scene;
};
