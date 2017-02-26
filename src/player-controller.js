import {_} from './utils';
import Singleton from 'basic-singleton';
import StateProxy from './state-event-proxy';

export default class PlayerController extends Singleton {

    static getTime(date=new Date()) {
        return `${_.padStart(date.getHours(), 2, '0')}:${_.padStart(date.getMinutes(), 2, '0')}:${_.padStart(date.getSeconds(), 2, '0')}`;
    }

    get DOM_EVENTS() {
        return {
            click: 'mClick',
            contextmenu: 'mAltClick',
            wheel: 'mWheel',
            mouseover: 'mOver',
            mouseout: 'mOut'
        };
    }

    constructor(engine, uiData={}) {
        super();
        StateProxy(this, `engine.ctrl`, _.assign({
            messages: [],
            player: null,
            target: null
        }, uiData));
        Object.defineProperty(this, 'engine', {
            get: () => engine
        });
    }

    setup(settings) {
        this.registerKeyActions(_.get(settings, 'input.keys', []));
    }

    registerKeyActions(keyHandlers) {
        _.forEach(keyHandlers, (desc) => {
            this.engine.registerKeyAction(desc.key, desc);
        });
    }

    message(type, sender, msg, max=this.constructor.MAX_MESSAGES) {
        return this.messages = _.take(
            _.concat(
                {time: this.constructor.getTime(), type, sender, msg},
                this.messages),
            max);
    }

    mClick({pageX, pageY}) {
        if (_.isUndefined(pageX) || _.isUndefined(pageY)) {
            throw new Error('Improper event passed to mClick');
        }
        this.engine.logger.debug(`Click at (${pageX}, ${pageY})`);
    }

    mAltClick({pageX, pageY}) {
        if (_.isUndefined(pageX) || _.isUndefined(pageY)) {
            throw new Error('Improper event passed to mAltClick');
        }
        this.engine.logger.debug(`Alt Click at (${pageX}, ${pageY})`);
    }

    mWheel({deltaX, deltaY, deltaZ}) {
        if (_.isUndefined(deltaY) && _.isUndefined(deltaX) && _.isUndefined(deltaX)) {
            throw new Error('Improper event passed to mWheel');
        }
        if (deltaY) {
            this.engine.logger.debug(`MouseWheel scroll ${deltaY > 0 ? 'out' : 'in'} ${deltaY}`);
        }
    }

    mOver({pageX, pageY}) {
        if (_.isUndefined(pageX) || _.isUndefined(pageY)) {
            throw new Error('Improper event passed to mAltClick');
        }
        this.engine.logger.debug('Pointer has entered canvas element.');
    }

    mOut({pageX, pageY}) {
        if (_.isUndefined(pageX) || _.isUndefined(pageY)) {
            throw new Error('Improper event passed to mAltClick');
        }
        this.engine.logger.debug('Pointer has left cavnas element.');
    }

    entityOver(entity, evt) {
        if (!entity || !evt) {
            throw new Error('Improper arguments passed to entityOver');
        }
        this.target = entity;
    }

    entityOut(entity, evt) {
        if (!entity || !evt) {
            throw new Error('Improper arguments passed to entityOut');
        }
        if (!this.target || this.target.uid === entity.uid) {
            this.target = null;
        }
    }

    entityClick(entity, {pointerX, pointerY}) {
        if (!entity || _.isUndefined(pointerX) || _.isUndefined(pointerY)) {
            throw new Error('Improper arguments passed to entityClick');
        }
        let {x, y, z} = this.engine.scene.baby.pick(pointerX, pointerY).pickedPoint;

        this.engine.logger.debug(`3D Click on ${entity.uid} at (${round(x)}, ${round(y)}, ${round(z)})`);
    }

    entityAltClick(entity, {pointerX, pointerY}) {
        if (!entity || _.isUndefined(pointerX) || _.isUndefined(pointerY)) {
            throw new Error('Improper arguments passed to entityAltClick');
        }
        let {x, y, z} = this.engine.scene.baby.pick(pointerX, pointerY).pickedPoint;

        this.engine.logger.debug(`3D Alt Click on ${entity.uid} at (${round(x)}, ${round(y)}, ${round(z)})`);
    }
}

PlayerController.MAX_MESSAGES = 100;

export const round = (x) => Math.floor(x * 100 + .5) / 100;