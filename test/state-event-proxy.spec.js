import {expect} from 'chai';
import sinon from 'sinon';
import events from '../src/state-events';
import {StateEventProxy, DISABLE, default as StateProxy} from '../src/state-event-proxy';


describe('StateEventProxy', () => {

    afterEach(() => {
        Object.keys(DISABLE).forEach(k => { delete DISABLE[k]; });
    });

    describe('StateProxy exported function (integration tests)', () => {
        let emit;

        beforeEach(() => {
            emit = sinon.stub(events, 'emit');
        });
        afterEach(() => {
            emit.restore();
        });

        it(`should assign proxy properties from a list of keys to the provided object
        and emit state events when a property is reassigned`, (done) => {
            let obj = {d: null};

            expect(() => StateProxy(obj, 'obj', ['a', 'b', 'c'], {def: 0})).to.not.throw(Error);
            expect(obj).to.exist;
            expect(obj).to.have.all.keys(['a', 'b', 'c', 'd']);
            expect(obj).to.eql({a: 0, b: 0, c: 0, d: null});
            expect(() => obj.d = 5).to.not.throw(Error);
            expect(obj.d).to.equal(5);
            expect(() => obj.a = {foo: 'bar'}).to.not.throw(Error);
            expect(obj.a).to.eql({foo: 'bar'});
            expect(() => obj.b = [1, obj.a, 'three']).to.not.throw(Error);
            expect(obj.b).to.eql([1, {foo: 'bar'}, 'three']);
            expect(() => obj.b = null).to.not.throw(Error);
            expect(obj).to.eql({
                a: {foo: 'bar'},
                b: null,
                c: 0,
                d: 5
            });
            setTimeout(() => {
                expect(emit.callCount).to.equal(3);
                expect(emit.calledWith('obj.a', {foo: 'bar'})).to.equal(true);
                expect(emit.calledWith('obj.b', [1, {foo: 'bar'}, 'three'])).to.equal(true);
                expect(emit.calledWith('obj.b', null)).to.equal(true);
                done();
            }, 1);
        });

        it(`should assign proxy properties from a map of keys and values to the provided
        object and emit state events when a property is reassigned`, (done) => {
            let obj = {d: 10};

            expect(() => StateProxy(obj, 'obj', {
                a: null,
                b: {foo: 'bar'},
                c: ['foo', 'bar']
            })).to.not.throw(Error);
            expect(obj).to.have.all.keys(['a', 'b', 'c', 'd']);
            expect(obj).to.eql({a: null, b: {foo: 'bar'}, c: ['foo', 'bar'], d: 10});
            obj.d = 42;
            expect(obj.d).to.equal(42);
            obj.a = [1,2,3];
            expect(obj.a).to.eql([1,2,3]);
            obj.b.foo = 'foo';
            expect(obj.b).to.eql({foo: 'foo'});
            obj.b = 'foobar';
            expect(obj.b).to.equal('foobar');
            setTimeout(() => {
                expect(emit.callCount).to.equal(2);
                expect(emit.calledWith('obj.a', [1, 2, 3])).to.equal(true);
                expect(emit.calledWith('obj.b', 'foobar')).to.equal(true);
                done();
            }, 1);
        });
    });

    describe('StateEventProxy Class', () => {

        describe('create method', () => {
            let emit;

            beforeEach(() => {
                emit = sinon.stub(StateEventProxy, 'emit');
            });
            afterEach(() => {
                emit.restore();
            });
        });

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
            let emit;

            beforeEach(() => {
                emit = sinon.stub(events, 'emit');
            });
            afterEach(() => {
                emit.restore();
            });

            it(`should call events.emit if the scope is not disabled`, (done) => {
                let v = 40, obj = {};

                expect(() => StateEventProxy.emit('test.scope', v, obj)).to.not.throw(Error);
                setTimeout(() => {
                    expect(emit.callCount).to.equal(1);
                    expect(emit.calledWithExactly('test.scope', v, obj)).to.equal(true);
                    done();
                }, 1);
            });

            it(`should not call events.emit if the scope is disabled`, (done) => {
                DISABLE['test.scope'] = true;
                expect(() => StateEventProxy.emit('test.scope', 30, {})).to.not.throw(Error);
                setTimeout(() => {
                    expect(emit.callCount).to.equal(0);
                    DISABLE['test.scope'] = false;
                    done();
                }, 1);
            });
        });

        describe('proxifyProperty method', () => {
            let buildObject, buildArray, emit;

            beforeEach(() => {
                buildObject = sinon.stub(StateEventProxy, 'buildProxyObject', (s, v) => v);
                buildArray = sinon.stub(StateEventProxy, 'buildProxyArray', (s, o, v) => v);
                emit = sinon.stub(StateEventProxy, 'emit');
            });
            afterEach(() => {
                buildObject.restore();
                buildArray.restore();
                emit.restore();
            });

            it(`should assign to the provided object a wrapped property that, when
            set, will emit a state event`, (done) => {
                let obj = {}, prop = 'testProp', scope = 'test.obj.testProp';

                expect(() => StateEventProxy.proxifyProperty(scope, obj, prop))
                    .to.not.throw(Error);
                expect(obj).to.exist;
                expect(obj).to.have.property('testProp');
                expect(obj).to.have.key('testProp');
                expect(obj.testProp).to.not.exist;
                expect(buildObject.callCount).to.equal(0);
                expect(buildArray.callCount).to.equal(0);
                obj.testProp = 'foobar';
                expect(obj.testProp).to.equal('foobar');
                setTimeout(() => {
                    expect(emit.callCount).to.equal(1);
                    expect(emit.calledWithExactly('test.obj.testProp', 'foobar', obj));
                    done();
                }, 1)
            });

            it(`should assign to the provided object a deeply-proxied value when
            the value to be assigned is an array and deep=true`, (done) => {
                let obj = {},
                    prop = 'test',
                    scope = 'obj.test',
                    v = [1, 2, 3],
                    opts = {deep: true, enumerable: true};

                expect(() => StateEventProxy.proxifyProperty(scope, obj, prop, v, opts))
                    .to.not.throw(Error);
                expect(obj).to.exist;
                expect(obj).to.have.property('test').that.eqls([1, 2, 3]);
                expect(buildObject.callCount).to.equal(0);
                expect(buildArray.callCount).to.equal(1);
                expect(buildArray.calledWithExactly(scope, obj, v, opts)).to.equal(true);
                obj.test = [3, 2];
                expect(obj.test).to.eql([3, 2]);
                expect(buildArray.callCount).to.equal(2);
                expect(buildArray.calledWithExactly(scope, obj, [3, 2], opts));
                setTimeout(() => {
                    expect(emit.callCount).to.equal(1);
                    expect(emit.calledWithExactly(scope, [3, 2], obj)).to.equal(true);
                    done();
                }, 1);
            });

            it(`should assign to the provided object a deeply-proxied value when
            the value to be assigned is an object and deep=true`, (done) => {
                let obj = {},
                    prop = 'test',
                    scope = 'obj.test',
                    v = {foo: 'bar'},
                    opts = {deep: true, enumerable: true};

                expect(() => StateEventProxy.proxifyProperty(scope, obj, prop, v, opts))
                    .to.not.throw(Error);
                expect(obj).to.exist;
                expect(obj).to.have.property('test').that.eqls(v);
                expect(buildArray.callCount).to.equal(0);
                expect(buildObject.callCount).to.equal(1);
                expect(buildObject.calledWithExactly(scope, v, opts))
                    .to.equal(true);
                obj.test = {bar: 'foo'};
                expect(obj.test).to.eql({bar: 'foo'});
                expect(buildObject.callCount).to.equal(2);
                expect(buildObject.calledWithExactly(scope, {bar: 'foo'}, opts));
                setTimeout(() => {
                    expect(emit.callCount).to.equal(1);
                    expect(emit.calledWithExactly(scope, {bar: 'foo'}, obj)).to.equal(true);
                    done();
                }, 1);
            });

            it(`should assign to the provided object a wrapped property that is
            not enumerable when enumerable=false`, (done) => {
                let obj = {}, prop = 'testProp', scope = 'test.obj.testProp';

                expect(() => StateEventProxy.proxifyProperty(scope, obj, prop, 42, {
                    enumerable: false
                })).to.not.throw(Error);
                expect(obj).to.exist;
                expect(obj).to.have.property('testProp');
                expect(obj).to.not.have.key('testProp');
                expect(obj.testProp).to.equal(42);
                expect(buildObject.callCount).to.equal(0);
                expect(buildArray.callCount).to.equal(0);
                obj.testProp = 'foobar';
                expect(obj.testProp).to.equal('foobar');
                setTimeout(() => {
                    expect(emit.callCount).to.equal(1);
                    expect(emit.calledWithExactly('test.obj.testProp', 'foobar', obj));
                    done();
                }, 1)
            });
        });

        describe('buildProxyObject method', () => {
            let proxify;

            beforeEach(() => proxify = sinon.stub(StateEventProxy, 'proxifyProperty'));
            afterEach(() => proxify.restore());

            it(`should return an object that has proxified properties forEach
            each property on the original object`, () => {
                let p,
                    scope = 'test.obj.obj',
                    obj = {
                        foo: 'bar',
                        bar: 'foo'
                    },
                    opts = {deep: true};

                expect(() => p = StateEventProxy.buildProxyObject(scope, obj, opts))
                    .to.not.throw(Error);
                expect(p).to.exist;
                expect(proxify.callCount).to.equal(2);
                expect(proxify.calledWithExactly(scope + '.foo', p, 'foo', 'bar', opts))
                    .to.equal(true);
                expect(proxify.calledWithExactly(scope + '.bar', p, 'bar', 'foo', opts))
                    .to.equal(true);
            });

        });

        describe('buildProxyArray method', () => {
            let buildObject, emit;

            beforeEach(() => {
                buildObject = sinon.stub(StateEventProxy, 'buildProxyObject', (s, v) => v);
                emit = sinon.stub(StateEventProxy, 'emit');
            });
            afterEach(() => {
                buildObject.restore();
                emit.restore();
            });

            it(`should create and return an Array Proxy that wraps sets to be
            deeply-watched for new values, and gets to be watched if a mutation
            method is requested`, (done) => {
                let p, scope = 'test.obj.arr',
                    arr = [[1, 2, 3], 7, 42, {foo: 'bar'}],
                    obj = {arr},
                    opts = {deep: true};

                expect(() => p = StateEventProxy.buildProxyArray(scope, obj, arr, opts))
                    .to.not.throw(Error);
                expect(p).to.exist;
                expect(p.length).to.equal(4);
                expect(p[0].length).to.equal(3);
                expect(p.sort()).to.eql(arr.sort());
                expect(buildObject.callCount).to.equal(1);
                expect(buildObject.calledWithExactly(scope + '[3]', {foo: 'bar'}, opts))
                    .to.equal(true);
                p[1] = 8;
                delete p[0][1];
                setTimeout(() => {
                    expect(emit.callCount).to.equal(3);
                    expect(emit.calledWithExactly(scope, p, obj)).to.equal(true);
                    expect(emit.calledWithExactly(`${scope}[1]`, 8, p)).to.equal(true);
                    expect(emit.calledWithExactly(`${scope}[0][1]`, undefined, p[0]))
                        .to.equal(true);
                    done();
                }, 1);
            });
        });
    });

});