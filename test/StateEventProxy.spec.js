import events from 'src/stateEvents';
import StateEventProxy, {
    DISABLE,
} from '../src/StateEventProxy';

describe('StateEventProxy', () => {

    afterEach(() => {
        Object.keys(DISABLE).forEach(k => { delete DISABLE[k]; });
    });

    describe('StateProxy exported function (integration tests)', () => {
        beforeEach(() => sandbox.stub(events, 'emit'));

        it(`should assign proxy properties from a list of keys to the provided object
        and emit state events when a property is reassigned`, (done) => {
            let obj = { d: null };

            StateEventProxy.create(obj, 'obj', [ 'a', 'b', 'c' ], { def: 0 });
            expect(obj).to.exist;
            expect(obj).to.have.all.keys([ 'a', 'b', 'c', 'd' ]);
            expect(obj).to.eql({ a: 0, b: 0, c: 0, d: null });
            obj.d = 5;
            expect(obj.d).to.equal(5);
            obj.a = { foo: 'bar' };
            expect(obj.a).to.eql({ foo: 'bar' });
            obj.b = [ 1, obj.a, 'three' ];
            expect(obj.b).to.eql([ 1, { foo: 'bar' }, 'three' ]);
            obj.b = null;
            expect(obj).to.eql({
                a: { foo: 'bar' },
                b: null,
                c: 0,
                d: 5
            });
            setTimeout(() => {
                expect(events.emit.callCount).to.equal(3);
                expect(events.emit).to.have.been.calledWith('obj.a', { foo: 'bar' });
                expect(events.emit).to.have.been.calledWith('obj.b', [ 1, { foo: 'bar' }, 'three' ]);
                expect(events.emit).to.have.been.calledWith('obj.b', null);
                done();
            });
        });

        it(`should assign proxy properties from a map of keys and values to the provided
        object and emit state events when a property is reassigned`, (done) => {
            let obj = { d: 10 };

            StateEventProxy.create(obj, 'obj', {
                a: null,
                b: { foo: 'bar' },
                c: [ 'foo', 'bar' ]
            });
            expect(obj).to.have.all.keys([ 'a', 'b', 'c', 'd' ]);
            expect(obj).to.eql({ a: null, b: { foo: 'bar' }, c: [ 'foo', 'bar' ], d: 10 });
            obj.d = 42;
            expect(obj.d).to.equal(42);
            obj.a = [ 1, 2, 3];
            expect(obj.a).to.eql([ 1, 2, 3 ]);
            obj.b.foo = 'foo';
            expect(obj.b).to.eql({ foo: 'foo' });
            obj.b = 'foobar';
            expect(obj.b).to.equal('foobar');
            setTimeout(() => {
                expect(events.emit.callCount).to.equal(2);
                expect(events.emit).to.have.been.calledWith('obj.a', [ 1, 2, 3 ]);
                expect(events.emit).to.have.been.calledWith('obj.b', 'foobar');
                done();
            });
        });
    });

    describe('StateEventProxy Class', () => {

        describe('isMutateFn method', () => {

            it(`should return true if provided key is an Array member-function that mutates
            itself`, () => {
                expect(StateEventProxy.isMutateFn('copyWithin')).to.equal(true);
                expect(StateEventProxy.isMutateFn('fill')).to.equal(true);
                expect(StateEventProxy.isMutateFn('pop')).to.equal(true);
                expect(StateEventProxy.isMutateFn('push')).to.equal(true);
                expect(StateEventProxy.isMutateFn('reverse')).to.equal(true);
                expect(StateEventProxy.isMutateFn('shift')).to.equal(true);
                expect(StateEventProxy.isMutateFn('sort')).to.equal(true);
                expect(StateEventProxy.isMutateFn('splice')).to.equal(true);
                expect(StateEventProxy.isMutateFn('unshift')).to.equal(true);
            });

            it(`should return false if provided key is not an Array member-function that
            mutates itself`, () => {
                expect(StateEventProxy.isMutateFn('concat')).to.equal(false);
                expect(StateEventProxy.isMutateFn('forEach')).to.equal(false);
                expect(StateEventProxy.isMutateFn('join')).to.equal(false);
                expect(StateEventProxy.isMutateFn('slice')).to.equal(false);
                expect(StateEventProxy.isMutateFn('toString')).to.equal(false);
                expect(StateEventProxy.isMutateFn('length')).to.equal(false);
            });
        });

        describe('emit method', () => {
            beforeEach(() => sandbox.stub(events, 'emit'));

            it(`should call events.emit if the scope is not disabled`, (done) => {
                const v = 40;
                const obj = {};

            StateEventProxy.emit('test.scope', v, obj);
                setTimeout(() => {
                    expect(events.emit.callCount).to.equal(1);
                    expect(events.emit)
                        .to.have.been.calledWithExactly('test.scope', v, obj);
                    done();
                });
            });

            it(`should not call events.emit if the scope is disabled`, (done) => {
                DISABLE['test.scope'] = true;
                StateEventProxy.emit('test.scope', 30, {});
                setTimeout(() => {
                    expect(events.emit.callCount).to.equal(0);
                    DISABLE['test.scope'] = false;
                    done();
                });
            });
        });

        describe('proxifyProperty method', () => {
            beforeEach(() => {
                sandbox.stub(StateEventProxy, 'buildProxyObject').callsFake((s, v) => v);
                sandbox.stub(StateEventProxy, 'buildProxyArray').callsFake((s, o, v) => v);
                sandbox.stub(StateEventProxy, 'emit');
            });

            it(`should assign to the provided object a wrapped property that, when
            set, will emit a state event`, (done) => {
                const obj = {};
                const prop = 'testProp';
                const scope = 'test.obj.testProp';

                StateEventProxy.proxifyProperty(scope, obj, prop);
                expect(obj).to.exist;
                expect(obj).to.have.property('testProp');
                expect(obj).to.have.key('testProp');
                expect(obj.testProp).to.not.exist;
                expect(StateEventProxy.buildProxyObject.callCount).to.equal(0);
                expect(StateEventProxy.buildProxyArray.callCount).to.equal(0);
                obj.testProp = 'foobar';
                expect(obj.testProp).to.equal('foobar');
                setTimeout(() => {
                    expect(StateEventProxy.emit.callCount).to.equal(1);
                    expect(StateEventProxy.emit)
                        .to.have.been.calledWithExactly('test.obj.testProp', 'foobar', obj);
                    done();
                })
            });

            it(`should assign to the provided object a deeply-proxied value when
            the value to be assigned is an array and deep=true`, (done) => {
                const obj = {};
                const prop = 'test';
                const scope = 'obj.test';
                const v = [ 1, 2, 3 ];
                const opts = { deep: true, enumerable: true };

                StateEventProxy.proxifyProperty(scope, obj, prop, v, opts);
                expect(obj).to.exist;
                expect(obj).to.have.property('test').that.eqls([ 1, 2, 3 ]);
                expect(StateEventProxy.buildProxyObject.callCount).to.equal(0);
                expect(StateEventProxy.buildProxyArray.callCount).to.equal(1);
                expect(StateEventProxy.buildProxyArray)
                    .to.have.been.calledWithExactly(scope, obj, v, opts);
                obj.test = [ 3, 2 ];
                expect(obj.test).to.eql([ 3, 2 ]);
                expect(StateEventProxy.buildProxyArray.callCount).to.equal(2);
                expect(StateEventProxy.buildProxyArray)
                    .to.have.been.calledWithExactly(scope, obj, [ 3, 2 ], opts);
                setTimeout(() => {
                    expect(StateEventProxy.emit.callCount).to.equal(1);
                    expect(StateEventProxy.emit)
                        .to.have.been.calledWithExactly(scope, [ 3, 2 ], obj);
                    done();
                });
            });

            it(`should assign to the provided object a deeply-proxied value when
            the value to be assigned is an object and deep=true`, (done) => {
                const obj = {};
                const prop = 'test';
                const scope = 'obj.test';
                const v = { foo: 'bar' };
                const opts = { deep: true, enumerable: true };

                StateEventProxy.proxifyProperty(scope, obj, prop, v, opts);
                expect(obj).to.exist;
                expect(obj).to.have.property('test').that.eqls(v);
                expect(StateEventProxy.buildProxyArray.callCount).to.equal(0);
                expect(StateEventProxy.buildProxyObject.callCount).to.equal(1);
                expect(StateEventProxy.buildProxyObject)
                    .to.have.been.calledWithExactly(scope, v, opts);
                obj.test = { bar: 'foo' };
                expect(obj.test).to.eql({ bar: 'foo' });
                expect(StateEventProxy.buildProxyObject.callCount).to.equal(2);
                expect(StateEventProxy.buildProxyObject)
                    .to.have.been.calledWithExactly(scope, { bar: 'foo' }, opts);
                setTimeout(() => {
                    expect(StateEventProxy.emit.callCount).to.equal(1);
                    expect(StateEventProxy.emit)
                        .to.have.been.calledWithExactly(scope, { bar: 'foo' }, obj);
                    done();
                });
            });

            it(`should assign to the provided object a wrapped property that is
            not enumerable when enumerable=false`, (done) => {
                const obj = {};
                const prop = 'testProp';
                const scope = 'test.obj.testProp';

                StateEventProxy.proxifyProperty(scope, obj, prop, 42, {
                    enumerable: false
                });
                expect(obj).to.exist;
                expect(obj).to.have.property('testProp');
                expect(obj).to.not.have.key('testProp');
                expect(obj.testProp).to.equal(42);
                expect(StateEventProxy.buildProxyObject.callCount).to.equal(0);
                expect(StateEventProxy.buildProxyArray.callCount).to.equal(0);
                obj.testProp = 'foobar';
                expect(obj.testProp).to.equal('foobar');
                setTimeout(() => {
                    expect(StateEventProxy.emit.callCount).to.equal(1);
                    expect(StateEventProxy.emit)
                        .to.have.been.calledWithExactly('test.obj.testProp', 'foobar', obj);
                    done();
                })
            });
        });

        describe('buildProxyObject method', () => {

            beforeEach(() => sandbox.stub(StateEventProxy, 'proxifyProperty'));

            it(`should return an object that has proxified properties forEach
            each property on the original object`, () => {
                const scope = 'test.obj.obj';
                const obj = {
                    foo: 'bar',
                    bar: 'foo'
                };
                const opts = { deep: true };
                const p = StateEventProxy.buildProxyObject(scope, obj, opts);

                expect(p).to.exist;
                expect(StateEventProxy.proxifyProperty.callCount).to.equal(2);
                expect(StateEventProxy.proxifyProperty)
                    .to.have.been.calledWithExactly(scope + '.foo', p, 'foo', 'bar', opts);
                expect(StateEventProxy.proxifyProperty)
                    .to.have.been.calledWithExactly(scope + '.bar', p, 'bar', 'foo', opts);
            });

        });

        describe('buildProxyArray method', () => {
            beforeEach(() => {
                sandbox.stub(StateEventProxy, 'buildProxyObject').callsFake((s, v) => v);
                sandbox.stub(StateEventProxy, 'emit');
            });

            it(`should create and return an Array Proxy that wraps sets to be
            deeply-watched for new values, and gets to be watched if a mutation
            method is requested`, (done) => {
                let p, scope = 'test.obj.arr',
                    arr = [ [ 1, 2, 3 ], 7, 42, { foo: 'bar' } ],
                    obj = { arr },
                    opts = { deep: true };

                expect(() => p = StateEventProxy.buildProxyArray(scope, obj, arr, opts))
                    .to.not.throw(Error);
                expect(p).to.exist;
                expect(p.length).to.equal(4);
                expect(p[0].length).to.equal(3);
                expect(p.sort()).to.eql(arr.sort());
                expect(StateEventProxy.buildProxyObject.callCount).to.equal(1);
                expect(StateEventProxy.buildProxyObject)
                    .to.have.been.calledWithExactly(`${scope}[3]`, { foo: 'bar' }, opts);
                p[1] = 8;
                delete p[0][1];
                setTimeout(() => {
                    expect(StateEventProxy.emit.callCount).to.equal(3);
                    expect(StateEventProxy.emit)
                        .to.have.been.calledWithExactly(scope, p, obj);
                    expect(StateEventProxy.emit)
                        .to.have.been.calledWithExactly(`${scope}[1]`, 8, p);
                    expect(StateEventProxy.emit)
                        .to.have.been.calledWithExactly(`${scope}[0][1]`, undefined, p[0]);
                    done();
                });
            });
        });
    });
});
