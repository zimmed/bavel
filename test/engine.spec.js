import {expect} from 'chai';
import Engine from '../src/engine';

describe('The Engine Class', () => {

    it(`should be a singleton class`, () => {
        expect(Engine).to.be.a('function');
        expect(Engine.__proto__.name).to.equal('Singleton');
    });

    describe('init method', () => {

        it(`should initialize a new Engine instance if none exist by calling the
        Engine constructor, and kicking off the resourceLoader`);
        it(`should return the engine instance if it has already been initialized`);
    });

    describe('constructor', () => {

        it(`should instantiate a new Engine instance with EventProxied properties
        (fps, loading) and standard enumerable properties (scene, running,
        settings)`);
    });

    describe('Engine instance', () => {

        describe('GL getter method', () => {

            it(`should return the read-only GraphicsLibary once loaded`);
        });

        describe('baby getter method', () => {

            it(`should return the read-only GraphicsLibary Engine instance once mounted`);
        });

        describe('canvas getter method', () => {

            it(`should return the read-only canvas element once mounted`);
        });

        describe('provider getter method', () => {

            it(`should return the read-only ResourceProvider once loaded`);
        });

        describe('playerCtrl getter method', () => {

            it(`should return the read-only PlayerController instance`);
        });

        describe('logger getter method', () => {

            it(`should return the read-only logger instance`);
        });

        describe('terrain getter and setter methods', () => {

            it(`should set and get the engine's terrain entity`);
        });

        describe('mount method', () => {

            it(`should return a promise that mounts the engine to the provided
            canvas element after the ResourceProvider and GraphicsLibrary have
            been loaded (resolves to self)`);
        });

        describe('dismount method', () => {

            it(`should return a promise that stops the engine render process (if
            running), dismounts and deletes the scene, along with the GraphicsLibrary
            Engine instance and canvas element before resolving to self`);
        });

        describe('run method', () => {

            it(`returns a promise that initializes the scene with the provided
            entities, attaches event listeners to the canvas element, and begins
            the main render/update loop before resolving to self`);

            it(`returns a promise that attaches event listeners to the canvas
            element and begins the main render/update loop without adding new
            entites, when none provided, before resolving to self`);
        });

        describe('stop method', () => {

            it(`should stop the render/update loop if running`);
        });

        describe('resize method', () => {

            it(`should call the resize method of the GraphicsLibrary engine
            instance`);
        });

        describe('toVector method', () => {

            it(`should convert a plain object with (x,y,z) properties into a 3D
            Vector object`);
        });

        describe('emitDebugEvent method', () => {

            it(`should emit a state event if settings.debug = true`);
            it(`should not emit an event if settings.debug = false`);
        });

        describe('onDebugEvent method', () => {

            it(`should add an event listener if settings.debug = true`);
            it(`should not add an event listener if settings.debug = false`);
        });

        describe('emitEvent method', () => {

            it(`should unconditionally emit a state event`);
        });

        describe('onEvent method', () => {

            it(`should unconditionally listen to a state event`);
        });

        describe('registerKeyAction method', () => {

            it(`should register event listeners to fire the handler provided for
            the key event specified, onKeyUp or onKeyDown`);
            it(`should register an event listener for the onKeyUp event for the
            provided key if the upHandler argument is set`);
            it(`should register an event listener for the onKeyDown event for the
            provided key if the downHandler argument is set`);
        });

        describe('registerMouseEventsForEntity method', () => {

            it(`should set the hover cursor for the entity's primary mesh if cursor
            arugment is provided`);
            it(`should set an entityClick event listener on the entity's primary
            mesh if click argument is provided`);
            it(`should set an entityAltClick event listener on the entity's primary
            mesh if the altClick argument is provided`);
            it(`should set an entityOver event listener on the entity's primary
            mesh if the over argument is provided`);
            it(`should set an entityOut event listener on the entity's primrary
            mesh if the out argument is provided`);
        });

        describe('deregisterMouseEventsForEntity method', () => {

            it(`should remove all click/altClick/over/out event listeners for the
            given entity's primary mesh, and reset the hover cursor style`);
        });
    });
});