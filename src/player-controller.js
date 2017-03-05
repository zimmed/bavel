import {_} from './utils';
import Singleton from 'basic-singleton';
import StateProxy from './state-event-proxy';

/**
 * @typedef {Object} Message
 * @property {string} time
 * @property {string} type
 * @property {?string} sender
 * @property {string} message
 */

let _engine;

/**
 * Controller for player logic and interactions.
 *
 * @property {number} MAX_MESSAGES - The maximum number of messages to keep in the array.
 * @example <caption>Definition</caption>
 * class MyGamePlayerController extends PlayerController {
 *     get DOM_EVENTS() {
 *         return {contextmenu: 'mAltClick', click: 'myClickMethod'};
 *     }
 *     entityOver(entity, event) {
 *         super.entityOver(entity, event);
 *         entity.MyActionableComponent.doAction();
 *     }
 *     entityClick(entity, {pointerX, pointerY}) {
 *         let {x, y, z} = this.engine.scene.baby.pick(pointerX, pointerY).pickedPoint;
 *
 *         this.player.MyOtherActionableComponent.beginMovementTo(x, y, z);
 *     }
 *     myClickMethod(event) {
 *         this.player.DestructionComponent.killAllHumans();
 *     }
 * }
 * @example <caption>Implementation</caption>
 * let engine = Engine.init(myLogger, myResourceLoader, MyGamePlayerController, {});
 */
export default class PlayerController extends Singleton {

    /**
     * Used for generating readable-timestamps in messages.
     *
     * @param {Date} [date=new Date()]
     * @return {string} - Current time in HH:mm:ss format.
     */
    static getTime(date=new Date()) {
        return `${_.padStart(date.getHours(), 2, '0')}:${_.padStart(date.getMinutes(), 2, '0')}:${_.padStart(date.getSeconds(), 2, '0')}`;
    }

    /**
     * Map of HTML DOM events to controller functions to be hooked into the window
     * when engine is mounted.
     *
     * @type {Object}
     * @example <caption>Override DOM_EVENTS</caption>
     * get DOM_EVENTS() { return {click: 'mClick'}; }
     * // Only the browser click action will trigger a Controller method.
     */
    get DOM_EVENTS() {
        return {
            click: 'mClick',
            contextmenu: 'mAltClick',
            wheel: 'mWheel',
            mouseover: 'mOver',
            mouseout: 'mOut'
        };
    }

    /**
     * @param {Engine} engine - The reference to the parent game engine.
     */
    constructor(engine) {
        super();
        StateProxy(this, `engine.ctrl`, ['messages', 'player', 'target']);
        /**
         * The list of logged game messages. New messages are inserted into the
         * beginning of the array.
         *
         * @type {Message[]}
         */
        this.messages = [];
        /**
         * The controlled player entity.
         *
         * @type {?EntityInstance}
         */
        this.player = null;
        /**
         * The currently-targeted entity (based on mouse-over).
         *
         * @type {?EntityInstance}
         */
        this.target = null;
        _engine = engine;
    }

    /**
     * Reference to the parent game engine instance.
     *
     * @type {Engine}
     */
    get engine() { return _engine; }

    /**
     * Supplies the key listeners defined in the provided game settings to
     *  {@link PlayerController#registerKeyActions}.
     *
     * @param {Settings} settings
     */
    setup(settings) {
        this.registerKeyActions(_.get(settings, 'input.keys', []));
    }

    /**
     * Hooks the provided key handlers into the game's keystroke actions.
     *
     * @param {KeyDefinition[]} keyHandlers
     */
    registerKeyActions(keyHandlers) {
        _.forEach(keyHandlers, (desc) => {
            this.engine.registerKeyAction(desc.key, desc);
        });
    }

    /**
     * Inserts new message into controller's messages array.
     *
     * @param {string} type
     * @param {?string} sender
     * @param {string} message
     * @param {number} [max=PlayerController.MAX_MESSAGES]
     * @return {Message[]} - The updated messages array.
     */
    message(type, sender, message, max=this.constructor.MAX_MESSAGES) {
        return this.messages = _.take(
            _.concat(
                {time: this.constructor.getTime(), type, sender, message},
                this.messages),
            max);
    }

    /**
     * The event handler for a mouse cursor-over event on a game entity.
     *
     * @param {EntityInstance} entity
     * @param {BabylonJS.ActionEvent} event
     */
    entityOver(entity, event) {
        if (!entity || !event) {
            throw new Error('Improper arguments passed to entityOver');
        }
        this.target = entity;
    }

    /**
     * The event handler for a mouse cursor-out event on a game entity.
     *
     * @param {EntityInstance} entity
     * @param {BabylonJS.ActionEvent} event
     */
    entityOut(entity, event) {
        if (!entity || !event) {
            throw new Error('Improper arguments passed to entityOut');
        }
        if (!this.target || this.target.uid === entity.uid) {
            this.target = null;
        }
    }

    /**
     * Example event handler for a mouse left-click event on a game entity.
     *
     * @abstract
     * @param {EntityInstance} entity
     * @param {BabylonJS.ActionEvent} event
     */
    entityClick(entity, {pointerX, pointerY}) {
        if (!entity || _.isUndefined(pointerX) || _.isUndefined(pointerY)) {
            throw new Error('Improper arguments passed to entityClick');
        }
        let {x, y, z} = this.engine.scene.baby.pick(pointerX, pointerY).pickedPoint;

        this.engine.logger.debug(`3D Click on ${entity.uid} at (${round(x)}, ${round(y)}, ${round(z)})`);
    }

    /**
     * Example event handler for a mouse right-click event on a game entity.
     *
     * @abstract
     * @param {EntityInstance} entity
     * @param {BabylonJS.ActionEvent} event
     */
    entityAltClick(entity, {pointerX, pointerY}) {
        if (!entity || _.isUndefined(pointerX) || _.isUndefined(pointerY)) {
            throw new Error('Improper arguments passed to entityAltClick');
        }
        let {x, y, z} = this.engine.scene.baby.pick(pointerX, pointerY).pickedPoint;

        this.engine.logger.debug(`3D Alt Click on ${entity.uid} at (${round(x)}, ${round(y)}, ${round(z)})`);
    }

    /**
     * Example event handler for the browser's left mouse click.
     *
     * @abstract
     * @param {SyntheticEvent} event
     * @param {number} event.pageX - The X-position of the click relative to the
     *  HTML document.
     * @param {number} event.pageY - The Y-position of the click relative to the
     *  HTML document.
     */
    mClick({pageX, pageY}) {
        if (_.isUndefined(pageX) || _.isUndefined(pageY)) {
            throw new Error('Improper event passed to mClick');
        }
        this.engine.logger.debug(`Click at (${pageX}, ${pageY})`);
    }

    /**
     * Example event handler for the browser's right mouse click.
     *
     * @abstract
     * @param {SyntheticEvent} event
     * @param {number} event.pageX - The X-position of the click relative to the
     *  HTML document.
     * @param {number} event.pageY - The Y-position of the click relative to the
     *  HTML document.
     */
    mAltClick({pageX, pageY}) {
        if (_.isUndefined(pageX) || _.isUndefined(pageY)) {
            throw new Error('Improper event passed to mAltClick');
        }
        this.engine.logger.debug(`Alt Click at (${pageX}, ${pageY})`);
    }

    /**
     * Example event handler for the browser's mouse wheel event.
     *
     * @abstract
     * @param {SyntheticEvent} event
     * @param {number} event.deltaX - The value scrolled along the X axis.
     * @param {number} event.deltaY - The value scrolled along the Y axis.
     * @param {number} event.deltaZ - The value scrolled along the Z axis.
     */
    mWheel({deltaX, deltaY, deltaZ}) {
        if (_.isUndefined(deltaY) && _.isUndefined(deltaX) && _.isUndefined(deltaX)) {
            throw new Error('Improper event passed to mWheel');
        }
        if (deltaY) {
            this.engine.logger.debug(`MouseWheel scroll ${deltaY > 0 ? 'out' : 'in'} ${deltaY}`);
        }
    }

    /**
     * Example event handler for the browser's mouse over event.
     *
     * @abstract
     * @param {SyntheticEvent} event
     * @param {number} event.pageX - The X-position of the click relative to the
     *  HTML document.
     * @param {number} event.pageY - The Y-position of the click relative to the
     *  HTML document.
     */
    mOver({pageX, pageY}) {
        if (_.isUndefined(pageX) || _.isUndefined(pageY)) {
            throw new Error('Improper event passed to mAltClick');
        }
        this.engine.logger.debug('Pointer has entered canvas element.');
    }

    /**
     * Example event handler for the browser's mouse out event.
     *
     * @abstract
     * @param {SyntheticEvent} event
     * @param {number} event.pageX - The X-position of the click relative to the
     *  HTML document.
     * @param {number} event.pageY - The Y-position of the click relative to the
     *  HTML document.
     */
    mOut({pageX, pageY}) {
        if (_.isUndefined(pageX) || _.isUndefined(pageY)) {
            throw new Error('Improper event passed to mAltClick');
        }
        this.engine.logger.debug('Pointer has left cavnas element.');
    }
}

/** @type {number} **/
PlayerController.MAX_MESSAGES = 100;

/**
 * Simple decimal cut-off utility function that rounds a number to the nearest
 *  second decimal place.
 *
 * @param {number} x - The number to round.
 * @return {number} - The rounded number.
 * @example
 * console.assert(round(Math.PI) === 3.14);
 */
export const round = (x) => Math.floor(x * 100 + .5) / 100;