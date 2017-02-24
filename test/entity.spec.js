import {expect} from 'chai';
import sinon from 'sinon';
import Promise from 'bluebird';
import Entity from '../src/scene/entity';

const _entity = {id: 'test', _primaryMesh: 'TestComponent', TestComponent: {foo: 'bar'}};
const _comp = {id: 'TestComponent', dismount: () => null, update: () => Promise.resolve(_comp)};
const engine = {
    provider: {
        getEntity: (id) => _entity,
        getComponent: (id) => ({TestComponent: _comp}[id]),
    }
};

describe('The Entity Class', () => {

    it(`should be a class that inherits from Static`, () => {
        expect(Entity).to.exist;
        expect(Entity).to.be.a('function');
        expect(Entity.__proto__.name).to.equal('Static');
    });

    describe('create method', () => {
        let updateComponents, getEntity;

        beforeEach(() => {
            updateComponents = sinon.stub(Entity, 'updateComponents', (e, et) => Promise.resolve(et));
            getEntity = sinon.stub(engine.provider, 'getEntity', engine.provider.getEntity, () => _entity);
        });
        afterEach(() => {
            updateComponents.restore();
            getEntity.restore();
        });

        it(`should get the entity data for the provided entity ID, create a new
        entity object with that data, merged with any extra data provided, then
        return the updateComponents method with the new object and the aggregated
        component data (which is a promise that eventually resolves to entity)`, (done) => {
            expect(() => Entity.create(engine, {id: 'test', uid: 'foo'})
                .then(entity => {
                    expect(entity).to.exist;
                    expect(entity).to.have.all.keys([ 'id', 'uid']);
                    expect(entity).to.have.property('mesh');
                    expect(entity).to.have.property('tick');
                    expect(entity).to.have.property('get');
                    expect(entity).to.have.property('meshAsync');
                    expect(getEntity.callCount).to.equal(1);
                    expect(getEntity.calledWithExactly('test')).to.equal(true);
                    expect(updateComponents.callCount).to.equal(1);
                    expect(updateComponents.calledWithExactly(
                        engine, entity, {TestComponent: {foo: 'bar'}})).to.equal(true);
                    done();
                }).catch(done)
            ).to.not.throw(Error);

        });

        describe('Entity object', () => {
            let entity;

            beforeEach(() => Entity.create(engine, {id: 'test', uid: 'bar'})
                .then(e => { entity = e; }));

            it(`should have id and uid properties`, () => {
                expect(entity).to.have.property('id').that.equals('test');
                expect(entity).to.have.property('uid').that.equals('bar');
            });
            it(`should have a mesh method that returns the component for the
            _primaryMesh key, if set`, () => {
                expect(entity).to.have.property('mesh');
                expect(entity.mesh).to.not.exist;
                entity.TestComponent = _comp;
                expect(entity.mesh).to.exist;
                expect(entity.mesh).to.equal(_comp);
            });
            it(`should have a meshAsync property that is a promise that resolves
            to the entity mesh once available`, (done) => {
                expect(() => entity.meshAsync.then(mesh => {
                    expect(mesh).to.exist;
                    expect(mesh).to.equal(_comp);
                    done();
                }).catch(done)).to.not.throw(Error);
                setTimeout(() => entity.TestComponent = _comp, 50);
            });
            it(`should have a get method that takes a property path and
            returns the value or false if it doesn't exist`, () => {
                expect(entity.get('id')).to.equal('test');
                expect(entity.get('TestComponent.id')).to.equal(false);
                entity.TestComponent = _comp;
                expect(entity.get('TestComponent.id')).to.equal('TestComponent');
            });
            it(`should have a tick setter that will add a new tick method when the
            assignment is an object with both id and tick properties, or delete
            an existing tick when only an id property is in the assignment object`, () => {
                let cb = 0, fn = () => cb++;

                expect(() => entity.tick = {id: 'Test', tick: fn}).to.not.throw(Error);
                expect(cb).to.equal(0);
                entity.tick();
                expect(cb).to.equal(1);
                entity.tick();
                expect(cb).to.equal(2);
                expect(() => entity.tick = {id: 'Test'}).to.not.throw(Error);
                entity.tick();
                expect(cb).to.equal(2);
            });
            it(`should have a tick getter that returns a function that will fire
            each registered component tick method`, () => {
                let a = 0, b = 0, c = 0,
                    fnA = () => a++,
                    fnB = () => b++,
                    fnC = () => c++;

                entity.tick = {id: 'A', tick: fnA};
                entity.tick = {id: 'B', tick: fnB};
                entity.tick = {id: 'C', tick: fnC};
                entity.tick();
                expect([a, b, c]).to.eql([1, 1, 1]);
                entity.tick = {id: 'A'};
                entity.tick = {id: 'B', tick: fnC};
                entity.tick();
                expect([a, b, c]).to.eql([1, 1, 3]);
                entity.tick();
                expect([a, b, c]).to.eql([1, 1, 5]);
            });
        });
    });

    describe('updateComponent method', () => {
        let getComponent, entity;

        beforeEach(() => {
            getComponent = sinon.stub(engine.provider, 'getComponent', (id) => ({TestComponent: _comp}[id]));
            entity = {id: 'test', uid: ''};
        });
        afterEach(() => getComponent.restore());

        it(`should return a promise that calls the update class method for the
        given component, stores the updated result to the entity at the property
        name that matches the component ID, and  finally resolves to the newly-
        updated component`, (done) => {
            expect(entity.TestComponent).to.not.exist;
            expect(() => Entity.updateComponent(engine, entity, 'TestComponent')
                .then(comp => {
                    expect(comp).to.exist;
                    expect(comp).to.equal(_comp);
                    expect(entity.TestComponent).to.equal(comp);
                    expect(getComponent.callCount).to.equal(1);
                    expect(getComponent.calledWithExactly('TestComponent')).to.equal(true);
                    done();
                }).catch(done)
            ).to.not.throw(Error);
        });
    });

    describe('updateComponents method', () => {
        let updateComponent, entity;

        beforeEach(() => {
            updateComponent = sinon.stub(Entity, 'updateComponent', (e, et, id, data) => Promise.resolve(et[id] = data));
            entity = {id: 'test', uid: 'foo'};
        });
        afterEach(() => {
            updateComponent.restore();
        });

        it(`should return a promise that sequentially updates/creates each component
        from the provided data using the updateComponent method, then resolve
        to the updated entity`, (done) => {
            expect(() => Entity.updateComponents(engine, entity, {
                TestComponent: {foo: 'bar'},
                AnotherComponent: {meaning: 42}
            }).then(entity => {
                expect(entity).to.exist;
                expect(entity.TestComponent).to.eql({foo: 'bar'});
                expect(entity.AnotherComponent).to.eql({meaning: 42});
                expect(updateComponent.callCount).to.equal(2);
                done();
            }).catch(done)).to.not.throw(Error);
        });
    });

    describe('dismountComponent method', () => {
        let getComponent, entity;

        beforeEach(() => {
            entity = {TestComponent: {foo: 'bar'}, id: 'test', uid: 42};
            getComponent = sinon.stub(engine.provider, 'getComponent', (id) => ({TestComponent: _comp}[id]));
        });
        afterEach(() => {
            getComponent.restore();
        });

        it(`should dismount the specified component using it's class dismount
        method and assigning the result (null) to the component property of the
        entity`, () => {
            let ret;

            expect(() => ret = Entity.dismountComponent(engine, entity, 'TestComponent'))
                .to.not.throw(Error);
            expect(ret).to.equal(null);
            expect(entity.TestComponent).to.equal(null);
            expect(getComponent.callCount).to.equal(1);
        });
    });

    describe('update method', () => {
        let create, updateComponents, entity;

        beforeEach(() => {
            create = sinon.stub(Entity, 'create', () => Promise.resolve({id: 'test'}));
            updateComponents = sinon.stub(Entity, 'updateComponents', (e, et) => Promise.resolve(et));
            entity = {id: 'test'};
        });
        afterEach(() => {
            create.restore();
            updateComponents.restore();
        });

        it(`should create a new entity if none provided`, (done) => {
            expect(() => Entity.update(engine, null, {id: 'foo'})
                .then(entity => {
                    expect(entity).to.exist;
                    expect(create.callCount).to.equal(1);
                    expect(updateComponents.callCount).to.equal(0);
                    done();
                }).catch(done)
            ).to.not.throw(Error);
        });
        it(`should call updateComponents for existing entity`, (done) => {
            expect(() => Entity.update(engine, entity, {id: 'foo'})
                .then(n => {
                    expect(n).to.exist;
                    expect(n).to.equal(entity)
                    expect(create.callCount).to.equal(0);
                    expect(updateComponents.callCount).to.equal(1);
                    done();
                }).catch(done)
            ).to.not.throw(Error);
        });
    });

    describe('dismount method', () => {
        let dismountComponent, entity;

        beforeEach(() => {
            entity = {id: 'k', BigAssComponent: {some: 'stuff'}, TestComponent: {ok: 4}};
            dismountComponent = sinon.stub(Entity, 'dismountComponent', () => null);
        });
        afterEach(() => dismountComponent.restore());

        it(`should dismount each component then return null`, () => {
            let ret;

            expect(() => ret = Entity.dismount(engine, entity)).to.not.throw(Error);
            expect(ret).to.equal(null);
            expect(entity.id).to.equal('k');
            expect(dismountComponent.callCount).to.equal(2);
        });
    });

    describe('tick method', () => {
        let entity, tick;

        beforeEach(() => {
            entity = {tick: () => null, id: 'test'};
            tick = sinon.stub(entity, 'tick');
        });
        afterEach(() => tick.restore());

        it(`should call the tick method on the provided entity instance`, () => {
            expect(() => Entity.tick(engine, entity, 100, 10)).to.not.throw(Error);
            expect(tick.callCount).to.equal(1);
            expect(tick.calledWithExactly(engine, 100, 10)).to.equal(true);
        });
    });
});
