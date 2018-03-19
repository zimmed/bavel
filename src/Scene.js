import mapValues from 'lodash.mapvalues';
import pickBy from 'lodash.pickby';
import get from 'lodash.get';
import forEach from 'lodash.foreach';
import noop from 'lodash.noop';
import Entity from 'src/Entity';

/**
 * local vars for read-only class members
 * 
 * @access private
 */
let instance = null;

/**
 * The Scene class
 */
export default class Scene {
    /**
     * Singleton instance of Scene
     * 
     * @type {?Scene}
     */
    static get instance() { return instance; }

    /**
     * Destroys singleton instance of class. (Hack until Singleton has own destroy method).
     */
    static destroy() {
        instance = null;
    }

    /**
     * Helper method to create a new Scene instance, or return an existing one.
     * 
     * @returns {Scene}
     */
    static create() {
        return (instance) ? instance : new Scene();
    }

    /**
     * Scene constructor.
     */
    constructor() {
        if (instance) throw new Error('Cannot instantiate more than one instance of Scene');
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
        /**
         * The underlying BabylonJS scene object.
         * 
         * @type {?BabylonJS#Scene}
         */
        this._baby = null;
        instance = this;
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
    async updateEntities(engine, entities) {
        await entities.reduce(
            (promise, e) => promise.then(() => this.updateEntity(engine, e)),
            Promise.resolve()
        );
        return this;
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
