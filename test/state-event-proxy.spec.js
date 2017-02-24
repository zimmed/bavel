import {expect} from 'chai';
import sinon from 'sinon';
import events from '../src/state-events';
import StateProxy from '../src/state-event-proxy';

describe('StateProxy', () => {
    let stub, calls = [];

    beforeEach(() => stub = sinon.stub(events, 'emit', (e, v) => calls.push([e, v])));
    afterEach(() => (calls = []) && stub.restore());

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
            expect(stub.callCount).to.equal(3);
            expect(calls[0]).to.eql(['obj.a', {foo: 'bar'}]);
            expect(calls[1]).to.eql(['obj.b', [1, {foo: 'bar'}, 'three']]);
            expect(calls[2]).to.eql(['obj.b', null]);
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
            expect(stub.callCount).to.equal(2);
            expect(calls[0]).to.eql(['obj.a', [1,2,3]]);
            expect(calls[1]).to.eql(['obj.b', 'foobar']);
            done();
        }, 1);
    });

    it(`should deeply watch proxy properties when deep option is passed as true`);
});