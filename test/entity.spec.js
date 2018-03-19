import Entity from 'src/Entity';

const _entity = { id: 'test', _primaryMesh: 'TestComponent', TestComponent: { foo: 'bar' } };
const _comp = { id: 'TestComponent', dismount: () => null, update: () => Promise.resolve(_comp) };
const engine = {
    provider: {
        getEntity: (id) => _entity,
        getComponent: (id) => ({ TestComponent: _comp }[id]),
    }
};

describe('The Entity Class', () => {

    it(`should be a static class`, () => {
        expect(() => new Entity()).to.throw(Error);
    });

    describe('create method', () => {
        beforeEach(() => {
            sandbox.stub(Entity, 'updateComponents').callsFake((e, et) => Promise.resolve(et));
            sandbox.stub(engine.provider, 'getEntity').returns(_entity);
        });

        it(`should get the entity data for the provided entity ID, create a new
        entity object with that data, merged with any extra data provided, then
        return the updateComponents method with the new object and the aggregated
        component data (which is a promise that eventually resolves to entity)`, async () => {
            const entity = await Entity.create(engine, { id: 'test', uid: 'foo' });

            expect(entity).to.exist;
            expect(entity).to.have.all.keys([ 'id', 'uid' ]);
            expect(entity).to.have.property('mesh');
            expect(entity).to.have.property('tick');
            expect(entity).to.have.property('meshAsync');
            expect(engine.provider.getEntity.callCount).to.equal(1);
            expect(engine.provider.getEntity).to.have.been.calledWithExactly('test');
            expect(Entity.updateComponents.callCount).to.equal(1);
            expect(Entity.updateComponents).to.have.been.calledWithExactly(
                engine, entity, { TestComponent: { foo: 'bar' } }
            );
            entity.TestComponent = {}; // To avoid hangtime, since expect().to.have.property invokes the getter for meshAsync.
        });

        describe('Entity object', () => {
            let entity;

            beforeEach(async () => entity = await Entity.create(engine, { id: 'test', uid: 'bar' }));

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

            it(`should have a meshAsync property that is configurable until
            it's returned promise resolves to the entity mesh once available, then
            redefining the property to resolve directly to the mesh, and no longer
            reconfigurable`, (done) => {
                let count = 0;

                entity.meshAsync.then((mesh) => {
                    expect(mesh).to.exist;
                    expect(mesh).to.equal(_comp);
                    count++;
                }).catch(done);
                entity.meshAsync.then((mesh) => {
                    expect(mesh).to.exist;
                    expect(mesh).to.equal(_comp);
                    count++;
                }).catch(done);
                wait(10)
                    .then(() => expect(count).to.equal(0))
                    .then(() => entity.TestComponent = _comp)
                    .then(() => wait(10))
                    .then(() => entity.meshAsync)
                    .then((mesh) => {
                        expect(count).to.equal(2);
                        expect(mesh).to.exist;
                        expect(mesh).to.equal(_comp);
                        done();
                    })
                    .catch(done);
            });

            // it(`should have a get method that takes a property path and
            // returns the value or false if it doesn't exist`, () => {
            //     expect(entity.get('id')).to.equal('test');
            //     expect(entity.get('TestComponent.id')).to.equal(false);
            //     entity.TestComponent = _comp;
            //     expect(entity.get('TestComponent.id')).to.equal('TestComponent');
            // });

            it(`should have a tick setter that will add a new tick method when the
            assignment is an object with both id and tick properties, or delete
            an existing tick when only an id property is in the assignment object`, () => {
                let cb = 0;
                const fn = () => cb++;

                entity.tick = { id: 'Test', tick: fn };
                expect(cb).to.equal(0);
                entity.tick();
                expect(cb).to.equal(1);
                entity.tick();
                expect(cb).to.equal(2);
                entity.tick = { id: 'Test' };
                entity.tick();
                expect(cb).to.equal(2);
            });
            it(`should have a tick getter that returns a function that will fire
            each registered component tick method`, () => {
                let a = 0, b = 0, c = 0;
                const fnA = () => a++;
                const fnB = () => b++;
                const fnC = () => c++;

                entity.tick = { id: 'A', tick: fnA };
                entity.tick = { id: 'B', tick: fnB };
                entity.tick = { id: 'C', tick: fnC };
                entity.tick();
                expect([ a, b, c ]).to.eql([ 1, 1, 1 ]);
                entity.tick = { id: 'A'};
                entity.tick = { id: 'B', tick: fnC };
                entity.tick();
                expect([ a, b, c ]).to.eql([ 1, 1, 3 ]);
                entity.tick();
                expect([ a, b, c ]).to.eql([ 1, 1, 5 ]);
            });
        });
    });

    describe('updateComponent method', () => {
        let entity;

        beforeEach(() => {
            sandbox.stub(engine.provider, 'getComponent').callsFake((id) => ({ TestComponent: _comp }[id]));
            entity = { id: 'test', uid: '' };
        });

        it(`should return a promise that calls the update class method for the
        given component, stores the updated result to the entity at the property
        name that matches the component ID, and  finally resolves to the newly-
        updated component`, async () => {
            expect(entity.TestComponent).to.not.exist;
            const comp = await Entity.updateComponent(engine, entity, 'TestComponent');

            expect(comp).to.exist;
            expect(comp).to.equal(_comp);
            expect(entity.TestComponent).to.equal(comp);
            expect(engine.provider.getComponent.callCount).to.equal(1);
            expect(engine.provider.getComponent).to.have.been.calledWithExactly('TestComponent');
        });
    });

    describe('updateComponents method', () => {
        let entity;

        beforeEach(() => {
            sandbox.stub(Entity, 'updateComponent').callsFake((e, et, id, data) => Promise.resolve(et[id] = data));
            entity = { id: 'test', uid: 'foo' };
        });

        it(`should return a promise that sequentially updates/creates each component
        from the provided data using the updateComponent method, then resolve
        to the updated entity`, async () => {
            const n = await Entity.updateComponents(engine, entity, {
                TestComponent: { foo: 'bar' },
                AnotherComponent: { meaning: 42 }
            });

            expect(n).to.exist;
            expect(n.TestComponent).to.eql({ foo: 'bar' });
            expect(n.AnotherComponent).to.eql({ meaning: 42 });
            expect(Entity.updateComponent.callCount).to.equal(2);
        });
    });

    describe('dismountComponent method', () => {
        let entity;

        beforeEach(() => {
            entity = { TestComponent: { foo: 'bar' }, id: 'test', uid: 42 };
            sandbox.stub(engine.provider, 'getComponent').callsFake((id) => ({ TestComponent: _comp }[id]));
        });

        it(`should dismount the specified component using it's class dismount
        method and assigning the result (null) to the component property of the
        entity`, () => {
            const ret = Entity.dismountComponent(engine, entity, 'TestComponent');

            expect(ret).to.equal(null);
            expect(entity.TestComponent).to.equal(null);
            expect(engine.provider.getComponent.callCount).to.equal(1);
        });
    });

    describe('update method', () => {
        let entity;

        beforeEach(() => {
            sandbox.stub(Entity, 'create').returns(Promise.resolve({ id: 'test' }));
            sandbox.stub(Entity, 'updateComponents').callsFake((e, et) => Promise.resolve(et));
            entity = { id: 'test' };
        });

        it(`should create a new entity if none provided`, async () => {
            const n = await Entity.update(engine, null, { id: 'foo' });

            expect(n).to.exist;
            expect(Entity.create.callCount).to.equal(1);
            expect(Entity.updateComponents.callCount).to.equal(0);
        });
        it(`should call updateComponents for existing entity`, async () => {
            const n = await Entity.update(engine, entity, { id: 'foo' });

            expect(n).to.exist;
            expect(n).to.equal(entity)
            expect(Entity.create.callCount).to.equal(0);
            expect(Entity.updateComponents.callCount).to.equal(1);
        });
    });

    describe('dismount method', () => {
        let entity;

        beforeEach(() => {
            entity = { id: 'k', BigAssComponent: { some: 'stuff' }, TestComponent: { ok: 4 } };
            sandbox.stub(Entity, 'dismountComponent').returns(null);
        });

        it(`should dismount each component then return null`, () => {
            let ret = Entity.dismount(engine, entity);

            expect(ret).to.equal(null);
            expect(entity.id).to.equal('k');
            expect(Entity.dismountComponent.callCount).to.equal(2);
        });
    });

    describe('tick method', () => {
        let entity;

        beforeEach(() => {
            entity = { tick: sinon.spy(), id: 'test' };
        });

        it(`should call the tick method on the provided entity instance`, () => {
            Entity.tick(engine, entity, 100, 10);
            expect(entity.tick.callCount).to.equal(1);
            expect(entity.tick).to.have.been.calledWithExactly(engine, 100, 10);
        });
    });
});
