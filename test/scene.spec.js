import {expect} from 'chai';
import sinon from 'sinon';
import Promise from 'bluebird';
import Scene from '../src/scene';
import Entity from '../src/scene/entity';
import {instances} from 'basic-singleton';

const engine = {
    GL: {
        Scene: function Scene() { this.isBaby = true; }
    }
};

describe('The Scene Class', () => {
    let dismount, update, tick;

    before(() => {
        dismount = sinon.stub(Entity, 'dismount', () => null);
        tick = sinon.stub(Entity, 'tick', () => null);
        update = sinon.stub(Entity, 'update', (e, et) => Promise.resolve(et));
    });
    after(() => {
        dismount.restore();
        update.restore();
        tick.restore();
    });
    afterEach(() => {
        dismount.reset();
        update.reset();
        delete instances['Scene'];
    });

    it(`should be a singleton`, () => {
        expect(Scene).to.be.a('function');
        expect(Scene.__proto__.name).to.equal('Singleton');
    });

    describe('Constructor', () => {

        it(`should create a new object with an empty children map and a null
        activeCamera property, as well as a non-enumerable _baby property`, () => {
            let scene;

            expect(() => scene = new Scene()).to.not.throw(Error);
            expect(scene).to.exist;
            expect(scene).to.have.all.keys(['children', 'activeCamera']);
            expect(scene.children).to.eql({});
            expect(scene.activeCamera).to.equal(null);
            expect(scene._baby).to.equal(null);
        });
    });

    describe('scene instance', () => {
        let scene;

        beforeEach(() => {
            scene = new Scene();
        });

        describe('baby getter method', () => {

            it(`should get the scene._baby property`, () => {
                expect(scene.baby).to.equal(null);
                scene._baby = 42;
                expect(scene.baby).to.equal(42);
            });
        });

        describe('mount method', () => {

            it('should set the scene._baby property to a new BabylonJS Scene', () => {
                expect(() => scene.mount(engine)).to.not.throw(Error);
                expect(scene.baby.isBaby).to.equal(true);
            });
        });

        describe('dismount method', () => {

            it(`should dismount each child in scene.children then delete the _baby
            property before returning null`, () => {
                let ret;

                scene.children = {foo: {uid: 'foo'}, bar: {uid: 'bar'}};
                expect(() => ret = scene.dismount(engine)).to.not.throw(Error);
                expect(ret).to.equal(null);
                expect(scene.baby).to.equal(null);
                expect(scene.children).to.eql({});
                expect(dismount.callCount).to.equal(2);
                expect(dismount.calledWithExactly(engine, {uid: 'foo'})).to.equal(true);
                expect(dismount.calledWithExactly(engine, {uid: 'bar'})).to.equal(true);
            });
        });

        describe('getEntity method', () => {

            it(`should get a child entity by uid`, () => {
                let e;

                scene.children = {bar: {uid: 'bar'}};
                expect(() => e = scene.getEntity('bar')).to.not.throw(Error);
                expect(e).to.eql({uid: 'bar'});
                expect(() => e = scene.getEntity('foo')).to.not.throw(Error);
                expect(e).to.not.exist;
            });
        });

        describe('updateEntity method', () => {

            it(`should return a promise that updates an entity by uid with
            Entity.update, then saves the updated entity back in children`, (done) => {
                scene.children = {bar: {uid: 'bar', d: 0}};
                expect(() => scene.updateEntity(engine, {uid: 'bar'})
                    .then(entity => {
                        expect(entity).to.eql({uid: 'bar', d: 0});
                        expect(update.callCount).to.equal(1);
                        expect(update.calledWithExactly(engine, {uid: 'bar', d: 0}, {uid: 'bar'})).to.equal(true);
                        expect(scene.children.bar).to.eql({uid: 'bar', d: 0});
                        done();
                    }).catch(done)
                ).to.not.throw(Error);
            });
        });

        describe('updateEntities method', () => {
            let updateEntity;

            beforeEach(() => updateEntity = sinon.stub(scene, 'updateEntity', function(en, et) {
                return this.children[et.uid] = et;
            }));
            afterEach(() => updateEntity.restore());

            it(`should return a promise that sequentially updates/creates each entity
            from the provided data using the updateEntity method, then resolve
            to the updated scene`, (done) => {
                expect(() => scene.updateEntities(engine, [
                    {uid: 'foo', data: 42},
                    {data: 0, uid: 'bar'}
                ]).then(scene => {
                    expect(scene).to.exist;
                    expect(scene.children).to.have.all.keys(['foo', 'bar']);
                    expect(scene.children.foo.data).to.equal(42);
                    expect(scene.children.bar.data).to.equal(0);
                    expect(updateEntity.callCount).to.equal(2);
                    done();
                }).catch(done)).to.not.throw(Error);
            });
        });

        describe('removeEntity method', () => {

            it(`should call Entity.dismount for the entity at the provided uid,
            and replace the entity in scene.children with the result (null)`, () => {
                scene.children = {foo: {uid: 'foo'}, bar: {uid: 'bar'}};
                expect(() => scene.removeEntity(engine, 'bar')).to.not.throw(Error);
                expect(scene.children.bar).to.equal(null);
                expect(scene.children.foo.uid).to.equal('foo');
                expect(dismount.callCount).to.equal(1);
                expect(dismount.calledWithExactly(engine, {uid: 'bar'})).to.equal(true);
            });
        });

        describe('tick method', () => {

            it(`should call Entity.tick for each entity in its children`, () => {
                let foo = {uid: 'foo'}, bar = {uid: 'bar'};

                scene.children = {foo, bar};
                expect(() => scene.tick(engine, 100, 10)).to.not.throw(Error);
                expect(tick.callCount).to.equal(2);
                expect(tick.calledWithExactly(engine, foo, 100, 10)).to.equal(true);
                expect(tick.calledWithExactly(engine, bar, 100, 10)).to.equal(true);
            });
        });

    });
});