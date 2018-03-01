import reducePromise from 'reduce-promise';
import Singleton from 'basic-singleton';
import mapValues from 'lodash.mapvalues';
import pickBy from 'lodash.pickby';
import get from 'lodash.get';
import forEach from 'lodash.foreach';
import noop from 'lodash.noop';
import Entity from '../Entity';

/**
 * The Scene class
 */
export default class Scene extends Singleton {

    constructor() {
        super();
        /**
         * The map of entities registered to the scene (keys are entity.uid).
         *
         * @type {Object}
         */
        this.children = {};
        /**
         * The active camera entity.
         *
         * @type {?EntityInstance}
         */
        this.activeCamera = null;
        Object.defineProperty(this, '_baby', {
            value: null,
            writable: true
        });
    }

    /**
     * The BabylonJS.Scene instance.
     *
     * @type {?BabylonJS.Scene}
     */
    get baby() { return this._baby; }

    /**
     * Instantiates the {@link Scene#baby} object.
     *
     * @param {Engine} engine
     */
    mount(engine) {
        this._baby = new engine.GL.Scene(engine.baby);
    }

    /**
     * Dismounts all child entities and disposes {@link Scene#baby} property.
     *
     * @param {Engine} engine
     * @return {null}
     */
    dismount(engine) {
        this.children = pickBy(mapValues(this.children, e => Entity.dismount(engine, e)));
        get(this, '_baby.dispose', noop)();
        this._baby = null;
        return null;
    }

    /**
     * Gets child entity by EntityInstance#uid.
     *
     * @param {string} uid
     * @return {EntityInstance} if entity is found.
     * @return {undefined} if entity is not found.
     */
    getEntity(uid) {
        return get(this.children, uid);
    }

    /**
     * Updates/creates an entity with the provided data, and saves it to {@link Scene#children}.
     *
     * @param {Engine} engine
     * @param {EntityMetaData} entityData
     * @return {Promise<EntityInstance>} - The new/updated entity.
     */
    updateEntity(engine, entityData) {
        return Entity.update(engine, this.children[entityData.uid], entityData)
            .then(e => this.children[entityData.uid] = e);
    }

    /**
     * Updates all entities in the provided list of entity data.
     *
     * @param {Engine} engine
     * @param {EntityMetaData[]} entities
     * @return {Promise<Scene>}
     */
    updateEntities(engine, entities) {
        return reducePromise(entities, e => this.updateEntity(engine, e))
            .then(() => this);
    }

    /**
     * Dismounts and removes child entity by EntityInstance#uid.
     *
     * @param {Engine} engine
     * @param {string} entityUid
     * @return {null}
     */
    removeEntity(engine, entityUid) {
        return this.children[entityUid] = Entity.dismount(engine, get(this.children, entityUid));
    }

    /**
     * Executes registered tick methods for all child entities.
     *
     * @param {Engine} engine
     * @param {number} t - The current timestamp in miliseconds.
     * @param {number} dt - The elapsed miliseconds since the last tick.
     */
    tick(engine, t, dt) {
        forEach(this.children, e => { Entity.tick(engine, e, t, dt) });
    }
}
