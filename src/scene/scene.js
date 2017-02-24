import {_} from '../utils';
import reducePromise from 'reduce-promise';
import Singleton from 'basic-singleton';
import Entity from './entity';

export default class Scene extends Singleton {

    constructor() {
        super();
        Object.defineProperties(_.assign(this, {
            children: {},
            activeCamera: null
        }), {
            _baby: {
                value: null,
                writable: true
            }
        });
    }

    get baby() { return this._baby; }

    mount(engine) {
        this._baby = new engine.GL.Scene(engine.baby);
    }

    dismount(engine) {
        this.children = _.pickBy(_.mapValues(this.children, e => Entity.dismount(engine, e)));
        _.get(this, '_baby.dispose', _.noop)();
        this._baby = null;
        return null;
    }

    getEntity(uid) {
        return _.get(this.children, uid);
    }

    updateEntity(engine, entityData) {
        return Entity.update(engine, this.children[entityData.uid], entityData)
            .then(e => this.children[entityData.uid] = e);
    }

    updateEntities(engine, entities) {
        return reducePromise(entities, e => this.updateEntity(engine, e))
            .then(() => this);
    }

    removeEntity(engine, entityUid) {
        return this.children[entityUid] = Entity.dismount(engine, _.get(this.children, entityUid));
    }

    tick(engine, t, dt) {
        _.forEach(this.children, e => { Entity.tick(engine, e, t, dt) });
    }
}
