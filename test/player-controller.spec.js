import {_} from '../src/utils';
import {expect} from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import {instances} from 'basic-singleton';

proxyquire.noCallThru();
const EventProxyMock = sinon.spy(function (obj, s, p) { return _.assign(obj, p); });
const CtrlModule = proxyquire('../src/player-controller', {
    './state-event-proxy': EventProxyMock
});
const PlayerController = CtrlModule.default;
const {round} = CtrlModule;
const engine = {
    logger: {debug: _.noop},
    scene: {baby: {pick: () => ({pickedPoint: {x: 0, y: 0, z: 0}})}},
    registerKeyAction: _.noop
};

describe('PlayerController Class', () => {

    afterEach(() => {
        delete instances['PlayerController'];
        EventProxyMock.reset();
    });

    it(`should be a singleton class`, () => {
        expect(PlayerController).to.be.a('function');
        expect(PlayerController.__proto__.name).to.equal('Singleton');
    });

    describe('round function', () => {

        it(`should round a float to the second decimal place`, () => {
            expect(round(Math.PI)).to.equal(3.14);
            expect(round(1923.2250199)).to.equal(1923.23);
            expect(round(0.005)).to.equal(0.01);
            expect(round(0.00499)).to.equal(0);
            expect(round(2.3)).to.equal(2.3);
        });
    });

    describe('getTime method', () => {

        it(`should return a 24hr timestamp of HH:mm:ss for a given date object,
        or the current time if no argument supplied.`, () => {
            let date = new Date('December 17, 1995 03:24:01');

            expect(PlayerController.getTime(date)).to.equal('03:24:01');
            date = new Date('February 02, 2017 13:09:22');
            expect(PlayerController.getTime(date)).to.equal('13:09:22');
        });
    });

    describe('constructor', () => {

        it(`should create a new PlayerController instance with proied properties
        for messages, player, target and any others passed in via the uiData param,
        and an engine getter`, () => {
            let ctrl, engine = {}, uiData = {testProp: 'foobar'};

            expect(() => ctrl = new PlayerController(engine, uiData))
                .to.not.throw(Error);
            expect(ctrl).to.exist;
            expect(ctrl).to.have.property('messages').that.eqls([]);
            expect(ctrl).to.have.property('player').that.equals(null);
            expect(ctrl).to.have.property('target').that.equals(null);
            expect(ctrl).to.have.property('testProp').that.equals('foobar');
            expect(ctrl.engine).to.equal(engine);
            expect(EventProxyMock.callCount).to.equal(1);
            expect(EventProxyMock.calledWithExactly(ctrl, 'engine.ctrl', {
                messages: [], player: null, target: null, testProp: 'foobar'
            })).to.equal(true);
        });
    });

    describe('PlayerController instance', () => {
        let ctrl;

        beforeEach(() => ctrl = new PlayerController(engine));

        describe('setup method', () => {
            let register, settings = {
                input: {keys: [{key: 'f', handler: _.noop}, {key: 'g', handler: _.noop}]}
            };

            beforeEach(() => register = sinon.stub(ctrl, 'registerKeyActions'));
            afterEach(() => register.restore());

            it(`should call registerKeyActions for the settings.input.keys
            configuration`, () => {
                expect(() => ctrl.setup(settings)).to.not.throw(Error);
                expect(register.callCount).to.equal(1);
                expect(register.calledWithExactly(settings.input.keys));
            });
        });

        describe('registerKeyActions method', () => {
            let register, handlers = [
                {key: 'f', handler: _.noop}, {key: 'g', handler: _.noop}
            ];

            beforeEach(() => register = sinon.stub(engine, 'registerKeyAction'));
            afterEach(() => register.restore());

            it (`should call engine.registerKeyAction for each keyHandler passed
            in`, () => {
                expect(() => ctrl.registerKeyActions(handlers)).to.not.throw(Error);
                expect(register.callCount).to.equal(2);
                expect(register.calledWithExactly('f', handlers[0])).to.equal(true);
                expect(register.calledWithExactly('g', handlers[1])).to.equal(true);
            });
        });

        describe('message method', () => {

            it(`should functionally update this.messages by adding the new message
            from the provided data at the front of messages`, () => {
                let orig = ctrl.messages, origS = JSON.stringify(orig), msgs;

                expect(() => msgs = ctrl.message('test', null, 'foobar'))
                    .to.not.throw(Error);
                expect(msgs).to.have.length(1);
                expect(msgs[0]).to.have.property('type').that.equals('test');
                expect(msgs[0]).to.have.property('sender').that.equals(null);
                expect(msgs[0]).to.have.property('msg').that.equals('foobar');
                expect(msgs).to.not.equal(orig);
                expect(orig).to.have.length(0);
                expect(JSON.stringify(orig)).to.equal(origS);
                expect(() => msgs = ctrl.message('test', 'dude', 'barfoo'))
                    .to.not.throw(Error);
                expect(msgs).to.have.length(2);
                expect(msgs[0]).to.have.property('sender').that.equals('dude');
                expect(msgs[0]).to.have.property('msg').that.equals('barfoo');
                expect(msgs[1]).to.have.property('msg').that.equals('foobar');
            });

            it(`should trim messages to the provided max`, () => {
                let msgs;

                ctrl.message('test', null, 'one', 5);
                ctrl.message('test', null, 'two', 5);
                ctrl.message('test', null, 'three', 5);
                ctrl.message('test', null, 'four', 5);
                ctrl.message('test', null, 'five', 5);
                expect(ctrl.messages).to.have.length(5);
                expect(ctrl.messages[0].msg).to.equal('five');
                expect(ctrl.messages[4].msg).to.equal('one');
                expect(() => ctrl.message('test', null, 'six', 5)).to.not.throw(Error);
                expect(ctrl.messages).to.have.length(5);
                expect(ctrl.messages[0].msg).to.equal('six');
                expect(ctrl.messages[4].msg).to.equal('two');
                expect(() => ctrl.message('test', null, 'seven', 2)).to.not.throw(Error);
                expect(ctrl.messages).to.have.length(2);
                expect(ctrl.messages[0].msg).to.equal('seven');
                expect(ctrl.messages[1].msg).to.equal('six');
            });
        });

        describe('mClick method', () => {
            let evt = {pageX: 4, pageY: 24};

            it(`should not throw an error when a proper event is passed`, () => {
                expect(() => ctrl.mClick(evt)).to.not.throw(Error);
            });

            it(`should throw an error when an improper event is passed`, () => {
                expect(() => ctrl.mClick({pageX: 3})).to.throw(Error);
            });
        });

        describe('mAltClick method', () => {
            let evt = {pageX: 30, pageY: 4};

            it(`should not throw an error when a proper event is passed`, () => {
                expect(() => ctrl.mAltClick(evt)).to.not.throw(Error);
            });

            it(`should throw an error when an improper event is passed`, () => {
                expect(() => ctrl.mAltClick({pageX: 3})).to.throw(Error);
            });
        });

        describe('mWheel method', () => {
            let evt = {deltaY: 0};

            it(`should not throw an error when a proper event is passed`, () => {
                expect(() => ctrl.mWheel(evt)).to.not.throw(Error);
            });

            it(`should throw an error when an improper event is passed`, () => {
                expect(() => ctrl.mWheel({pageX: 3, pageY: 4})).to.throw(Error);
            });
        });

        describe('mOver method', () => {
            let evt = {pageX: 4, pageY: 2};

            it(`should not throw an error when a proper event is passed`, () => {
                expect(() => ctrl.mOver(evt)).to.not.throw(Error);
            });

            it(`should throw an error when an improper event is passed`, () => {
                expect(() => ctrl.mOver({pageX: 3})).to.throw(Error);
            });
        });

        describe('mOut method', () => {
            let evt = {pageX: 42, pageY: 0};

            it(`should not throw an error when a proper event is passed`, () => {
                expect(() => ctrl.mOut(evt)).to.not.throw(Error);
            });

            it(`should throw an error when an improper event is passed`, () => {
                expect(() => ctrl.mOut({pageY: 3})).to.throw(Error);
            });
        });

        describe('entityOver method', () => {
            let entity = {}, evt = {};

            it(`should set the controller's target to the provided entity`, () => {
                expect(ctrl.target).to.equal(null);
                expect(() => ctrl.entityOver(entity, evt)).to.not.throw(Error);
                expect(ctrl.target).to.equal(entity);
            });

            it(`should throw an error when an invalid entity or event is provided`, () => {
                expect(() => ctrl.entityOver(null, evt)).to.throw(Error);
                expect(() => ctrl.entityOver(entity, null)).to.throw(Error);
            });
        });

        describe('entityOut method', () => {
            let entity = {uid: 'foo'}, evt = {};

            it(`should remove the current target if the entity passed is the current
            target`, () => {
                ctrl.target = entity;
                expect(() => ctrl.entityOut(entity, evt)).to.not.throw(Error);
                expect(ctrl.target).to.equal(null);
            });

            it(`should not remove the current target if the entity passed is not
            the current target`, () => {
                let entity2 = {uid: 'bar'};

                expect(ctrl.target).to.equal(null);
                expect(() => ctrl.entityOut(entity, evt)).to.not.throw(Error);
                expect(ctrl.target).to.equal(null);
                ctrl.target = entity2;
                expect(() => ctrl.entityOut(entity, evt)).to.not.throw(Error);
                expect(ctrl.target).to.equal(entity2);
            });

            it(`should throw an error when an invalid entity or event is provided`, () => {
                expect(() => ctrl.entityOut(null, evt)).to.throw(Error);
                expect(() => ctrl.entityOut(entity, null)).to.throw(Error);
            });
        });

        describe('entityClick method', () => {
            let entity = {}, evt = {pointerX: 30, pointerY: 4};

            it(`should not throw an error when a proper entity and event is passed`, () => {
                expect(() => ctrl.entityClick(entity, evt)).to.not.throw(Error);
            });

            it(`should throw an error when an improper entity or event is passed`, () => {
                expect(() => ctrl.entityClick(null, evt)).to.throw(Error);
                expect(() => ctrl.entityClick(entity, {pointerY: 3})).to.throw(Error);
            });

        });

        describe('entityAltClick method', () => {
            let entity = {}, evt = {pointerX: 30, pointerY: 4};

            it(`should not throw an error when a proper entity and event is passed`, () => {
                expect(() => ctrl.entityAltClick(entity, evt)).to.not.throw(Error);
            });

            it(`should throw an error when an improper entity or event is passed`, () => {
                expect(() => ctrl.entityAltClick(null, evt)).to.throw(Error);
                expect(() => ctrl.entityAltClick(entity, {pointerY: 3})).to.throw(Error);
            });
        });
    });
});
