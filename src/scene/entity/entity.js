import {_} from '../../utils';
import Promise from 'bluebird';
import Static from 'basic-static';
import reducePromise from 'reduce-promise';

const nonCompKeys = ['id', 'uid', 'tick', 'mesh', '_primaryMesh'];
const asyncStep = 10;
const asyncTimeout = 2000;

export default class Entity extends Static {

    static create(engine, data) {
        const ticks = {};
        const {id, uid} = data;
        const polyData = _.merge(engine.provider.getEntity(id), data);
        const componentData = _.omit(polyData, nonCompKeys);
        const entity = Object.defineProperties({id, uid}, {
            mesh: { get: () => _.get(entity, polyData._primaryMesh) },
            tick: {
                get: () => (eng, t, dt) =>
                    _.forEach(ticks, (v, k) => { v(eng, entity, entity[k], t, dt); }),
                set: ({id, tick}) => tick ? (ticks[id] = tick) : (delete ticks[id])
            },
            get: {
                value: (path) => _.get(entity, path, false)
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

    static updateComponent(engine, entity, id, data) {
        return engine.provider.getComponent(id)
            .update(engine, entity, entity[id], id, data)
            .then(comp => entity[id] = comp);
    }

    static updateComponents(engine, entity, componentData) {
        return reducePromise(componentData, (v, k) => this.updateComponent(engine, entity, k, v))
            .then(() => entity);
    }

    static dismountComponent(engine, entity, id) {
        return entity[id] = engine.provider
            .getComponent(id)
            .dismount(engine, entity, entity[id]);
    }

    static update(engine, entity, data) {
        if (!entity) {
            return this.create(engine, data);
        }
        return this.updateComponents(engine, entity, _.omit(data, nonCompKeys));
    }

    static dismount(engine, entity) {
        _.forEach(
            _.omit(entity, nonCompKeys),
            (v, k) => { this.dismountComponent(engine, entity, k); });
        return null;
    }

    static tick(engine, entity, t, dt) {
        entity.tick(engine, t, dt);
    }
}
