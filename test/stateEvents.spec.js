import { expect } from 'chai';
import events from '../src/stateEvents';

describe('StateEventManager', () => {

    it(`should have emit and on methods for dispatching and subscribing to
    events`, () => {
        expect(events).to.exist;
        expect(events).to.have.property('emit').that.is.a('function');
        expect(events).to.have.property('on').that.is.a('function');
    });

    it(`should dispatch an event with the emit method and callback the events
    listener for that event, registered with the on method`, (done) => {
        let test = 0;

        expect(() => {
            events.on('test', (data) => {
                expect(data).to.equal('foobar');
                test++;
            });
            events.on('finish', () => {
                expect(test).to.equal(2);
                events.removeAllListeners('test');
                events.removeAllListeners('finish');
                events.removeAllListeners('foo');
                done();
            });
            events.on('foo', () => {
                done('No foo event emitted, but handler called.');
            });
            events.emit('test', 'foobar');
            events.emit('bar');
            events.emit('test', 'foobar');
            events.emit('finish');
        }).to.not.throw(Error);
    });
})