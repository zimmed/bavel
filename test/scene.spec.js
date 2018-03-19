import Scene from 'src/Scene';
import Entity from 'src/Entity';

const engine = {
    GL: {
        Scene: function Scene() { this.isBaby = true; }
    }
};

describe('The Scene Class', () => {
    beforeEach(() => {
        sandbox.stub(Entity, 'dismount').returns(null);
        sandbox.stub(Entity, 'tick').returns(null);
        sandbox.stub(Entity, 'update').callsFake((e, et) => Promise.resolve(et));
    });
    afterEach(() => {
        Scene.destroy();
    });

    it(`should be a singleton`, () => {
        let scene = new Scene();
        expect(() => scene = new Scene()).to.throw(Error);
    });

    describe('Constructor', () => {

        it(`should create a new object with an empty children map and a null
        activeCamera property, as well as a non-enumerable _baby property`, () => {
            let scene = new Scene();

            expect(scene).to.exist;
            expect(scene).to.have.all.keys([ 'children', 'activeCamera' ]);
            expect(scene.children).to.eql({});
            expect(scene.activeCamera).to.equal(null);
            expect(scene._baby).to.equal(null);
        });
    });

    describe('scene instance', () => {
        let scene;

        beforeEach(() => scene = new Scene());

        describe('baby getter method', () => {

            it(`should get the scene._baby property`, () => {
                expect(scene.baby).to.equal(null);
                scene._baby = 42;
                expect(scene.baby).to.equal(42);
            });
        });

        describe('mount method', () => {

            it('should set the scene._baby property to a new BabylonJS Scene', () => {
                scene.mount(engine);
                expect(scene.baby.isBaby).to.equal(true);
            });
        });

        describe('dismount method', () => {

            it(`should dismount each child in scene.children then delete the _baby
            property before returning null`, () => {
                let ret;

                scene.children = { foo: { uid: 'foo' }, bar: { uid: 'bar' } };
                ret = scene.dismount(engine);
                expect(ret).to.equal(null);
                expect(scene.baby).to.equal(null);
                expect(scene.children).to.eql({});
                expect(Entity.dismount.callCount).to.equal(2);
                expect(Entity.dismount).to.have.been.calledWithExactly(engine, { uid: 'foo' });
                expect(Entity.dismount).to.have.been.calledWithExactly(engine, { uid: 'bar' });
            });
        });

        describe('getEntity method', () => {

            it(`should get a child entity by uid`, () => {
                let e;

                scene.children = { bar: { uid: 'bar' } };
                e = scene.getEntity('bar');
                expect(e).to.eql({ uid: 'bar' });
                e = scene.getEntity('foo');
                expect(e).to.not.exist;
            });
        });

        describe('updateEntity method', () => {

            it(`should return a promise that updates an entity by uid with
            Entity.update, then saves the updated entity back in children`, async () => {
                scene.children = { bar: { uid: 'bar', d: 0 } };
                const entity = await scene.updateEntity(engine, { uid: 'bar' });

                expect(entity).to.eql({ uid: 'bar', d: 0 });
                expect(Entity.update.callCount).to.equal(1);
                expect(Entity.update).to.have.been.calledWithExactly(engine, { uid: 'bar', d: 0 }, { uid: 'bar' });
                expect(scene.children.bar).to.eql({ uid: 'bar', d: 0 });
            });
        });

        describe('updateEntities method', () => {
            beforeEach(() => sandbox.stub(scene, 'updateEntity').callsFake(function(en, et) {
                return this.children[et.uid] = et;
            }));

            it(`should return a promise that sequentially updates/creates each entity
            from the provided data using the updateEntity method, then resolve
            to the updated scene`, async () => {
                const n = await scene.updateEntities(engine, [
                    { uid: 'foo', data: 42 },
                    { data: 0, uid: 'bar' }
                ]);

                expect(n).to.exist;
                expect(n).to.equal(scene);
                expect(scene.children).to.have.all.keys([ 'foo', 'bar' ]);
                expect(scene.children.foo.data).to.equal(42);
                expect(scene.children.bar.data).to.equal(0);
                expect(scene.updateEntity.callCount).to.equal(2);
            });
        });

        describe('removeEntity method', () => {

            it(`should call Entity.dismount for the entity at the provided uid,
            and replace the entity in scene.children with the result (null)`, () => {
                scene.children = {foo: {uid: 'foo'}, bar: {uid: 'bar'}};
                scene.removeEntity(engine, 'bar');
                expect(scene.children.bar).to.equal(null);
                expect(scene.children.foo.uid).to.equal('foo');
                expect(Entity.dismount.callCount).to.equal(1);
                expect(Entity.dismount).to.have.been.calledWithExactly(engine, { uid: 'bar' });
            });
        });

        describe('tick method', () => {

            it(`should call Entity.tick for each entity in its children`, () => {
                const foo = { uid: 'foo' };
                const bar = { uid: 'bar'};

                scene.children = { foo, bar };
                scene.tick(engine, 100, 10);
                expect(Entity.tick.callCount).to.equal(2);
                expect(Entity.tick).to.have.been.calledWithExactly(engine, foo, 100, 10);
                expect(Entity.tick).to.have.been.calledWithExactly(engine, bar, 100, 10);
            });
        });
    });
});
