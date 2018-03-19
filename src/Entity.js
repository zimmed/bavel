import merge from 'lodash.merge';
import omit from 'lodash.omit';
import get from 'lodash.get';
import forEach from 'lodash.foreach';

/**
 * List of entity keys that are not components.
 * 
 * @access private
 * @type {Array<string>}
 */ 
const nonCompKeys = ['id', 'uid', 'tick', 'mesh', '_primaryMesh'];
/**
 * Time in MS to tick a check when waiting for entity's primary mesh to resolve.
 * 
 * @access private
 * @type {number}
 */
const asyncStep = 50;
/**
 * Time in MS to wait before the primary mesh resolution times out.
 * 
 * @access private
 * @type {number}
 */
const asyncTimeout = 2000;

/**
 * The Entity class
 */
export default class Entity {

    /**
     * Un-used constructor. Throws an error if instantiation is attempted.
     * 
     * @access private
     * @throws {Error}
     */
    constructor() {
        throw new Error('Cannot instantiate static class Entity');
    }

    /**
     * Uses the provided metadata and the engine's resourceProvider to create a
     *  new entity.
     *
     * @param {Engine} engine
     * @param {EntityMetaData} data
     * @return {EntityInstance}
     */
    static create(engine, data) {
        const ticks = {};
        const { id, uid } = data;
        const polyData = merge(engine.provider.getEntity(id), data);
        const componentData = omit(polyData, nonCompKeys);
        const entity = Object.defineProperties({ id, uid }, {
            mesh: { get: () => get(entity, polyData._primaryMesh) },
            tick: {
                get: () => (eng, t, dt) =>
                    forEach(ticks, (v, k) => { v(eng, entity, entity[k], t, dt); }),
                set: ({ id, tick }) => tick ? (ticks[id] = tick) : (delete ticks[id])
            },
            meshAsync: {
                get: () => new Promise((res, rej) => {
                    const t = Date.now();
                    const stop = setInterval(() => {
                        if (entity.mesh) {
                            clearInterval(stop);
                            if (Object.getOwnPropertyDescriptor(entity, 'meshAsync').get) {
                                Object.defineProperty(entity, 'meshAsync', {
                                    value: Promise.resolve(entity.mesh),
                                    configurable: false,
                                    writable: false
                                });
                            }
                            res(entity.mesh);
                        } else if (Date.now() - t > asyncTimeout) {
                            clearInterval(stop);
                            rej(new Error('Timed out waiting for mesh of entity: ' + uid));
                        }
                    }, asyncStep);
                }),
                configurable: true
            }
        });

        return this.updateComponents(engine, entity, componentData);
    }

    /**
     * Updates/creates the component for the specified id.
     *
     * @param {Engine} engine
     * @param {EntityInstance} entity
     * @param {string} id - The component ID
     * @param {ComponentData} data - The data with which to initialize/update the component.
     * @return {Promise<Component>}
     */
    static async updateComponent(engine, entity, id, data) {
        return entity[id] = await engine.provider.getComponent(id)
            .update(engine, entity, entity[id], id, data);
    }

    /**
     * Update/create all the components in the provided list of component data.
     *
     * @param {Engine} engine
     * @param {EntityInstance} entity
     * @param {ComponentData[]} componentData
     * @return {Promise<EntityInstance>}
     */
    static async updateComponents(engine, entity, componentData) {
        await Object.entries(componentData).reduce(
            (promise, [ k, v ]) => promise.then(() => this.updateComponent(engine, entity, k, v)),
            Promise.resolve()
        );
        return entity;
    }

    /**
     * Dismount the specified component.
     *
     * @param {Engine} engine
     * @param {EntityInstance} entity
     * @param {string} id - The component ID.
     * @return {null}
     */
    static dismountComponent(engine, entity, id) {
        return entity[id] = engine.provider
            .getComponent(id)
            .dismount(engine, entity, entity[id]);
    }

    /**
     * Update the entity or create if it doesn't exist.
     *
     * @param {Engine} engine
     * @param {?EntityInstance} entity
     * @param {EntityMetaData} data
     * @return {Promise<EntityInstance>}
     */
    static update(engine, entity, data) {
        if (!entity) {
            return this.create(engine, data);
        }
        return this.updateComponents(engine, entity, omit(data, nonCompKeys));
    }

    /**
     * Dismount the entity and all of its components.
     *
     * @param {Engine} engine
     * @param {EntityInstance} entity
     * @return {null}
     */
    static dismount(engine, entity) {
        forEach(
            omit(entity, nonCompKeys),
            (v, k) => { this.dismountComponent(engine, entity, k); }
        );
        return null;
    }

    /**
     * Execute the tick method for the provided EntityInstance.
     *
     * @param {Engine} engine
     * @param {EntityInstance} entity
     * @param {number} t
     * @param {number} dt
     */
    static tick(engine, entity, t, dt) {
        entity.tick(engine, t, dt);
    }
}
