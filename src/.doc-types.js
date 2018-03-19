/**
 * @typedef {string|number|Object|boolean} ProxyValue - Emits the scoped event when this property changes.
 */

/**
 * @typedef {Object} ComponentData
 * @property {string} id - The component class name, used by the {@link ResourceProvider}
 *  to pull the component class.
 * @property {*} [*] - Any data.
 */

/**
 * @typedef {ComponentData} Component
 */

/**
 * @typedef {Object} EntityData
 * @property {string} [_primaryMesh] - Optional ID of component that holds entity's
 *  primary mesh object.
 * @property {ComponentData} [*] - Component properties.
 * @example <caption>ID: 'objects.sphere'</caption>
 * objects = {
 *     sphere: {
 *         _primaryMesh: 'MyMeshComponent',
 *
 *         MyMeshComponent: {position: {x: 0, y: 5, z: 0}},
 *         MyLogicComponent: {value: 'foobar'}
 *     }
 * };
 */

/**
 * @typedef {EntityData} EntityMetaData
 * @property {string} id - The generic Entity ID, used by the {@link ResourceProvider}
 *  to pull the data.
 * @property {string} uid - the instance-specific identifier.
 * @example <caption>Basic Definition</caption>
 * let entityData1 = {id: 'objects.sphere', uid: 'myFirstSphere'};
 * @example <caption>Advanced Definition</caption>
 * let entityData2 = {
 *     id: 'objects.sphere',
 *     uid: 'mySecondSphere',
 *     MyMeshComponent: {rotation: {y: Math.PI},
 *     MyLogicComponent: {value: 42} // This will override the default definition.
 * };
 */

 /**
 * @typedef {Object} EntityInstance
 * @property {string} id - The Entity ID.
 * @property {string} uid - The unique identifier for the entity instance.
 * @property {Component|undefined} mesh - The component that holds the primary mesh
 *  object for the entity.
 * @property {function(engine: Engine, time: number, deltaTime: number): undefined} tick -
 *  Executes all registered component tick methods.
 * @property {Promise<Component>} meshAsync - Wait for entity's mesh component to be
 *  set and get the value, asynchronously.
 */

/**
 * @typedef {class} ComponentClass - A static class for a component
 * @example <caption>Basic Logic Component</caption>
 * class MyLogicComponent {
 *     constructor(engine, entity, id, {value}) {
 *         this.id = id;
 *         this.value = value;
 *         this.enabled = true;
 *         entity.tick = {id, tick: MyLogicComponent.tick};
 *         return comp;
 *     }
 *     disableMe() {
 *         this.enabled = false;
 *     }
 *     static update(engine, entity, comp, id, data) {
 *         if (!comp) {
 *             comp = new MyLogicComponent(engine, entity, id, data);
 *         } else {
 *             comp.value = data.value;
 *         }
 *         return comp;
 *     }
 *     static dismount(engine, entity, comp) {
 *         delete comp.value;
 *         return null;
 *     }
 *     static tick(engine, entity, comp, t, dt) {
 *         if (comp.enabled) {
 *             engine.ctrl.target.AnotherComponent.doSomething(comp.value);
 *         }
 *     }
 * }
 * @example <caption>BabylonJS Object Wrapper</caption>
 * class MyMeshComponent {
 *     static create(engine, entity, id, meshData) {
 *         const comp = {id, baby: null};
 *
 *         return someFancyAsyncAction().then(() => {
 *             comp.baby = engine.GL.Mesh.CreateSphere('mySphere', 10, 2, engine.scene.baby);
 *             Object.assign(comp.baby, meshData);
 *             return comp;
 *          });
 *     static update(engine, entity, comp, id, data) {
 *         if (!comp) {
 *             return this.create(engine, entity, id, data);
 *         }
 *         Object.assign(comp.baby, data);
 *         return Promise.resolve(comp);
 *     }
 *     static dismount(engine, entity, comp) {
 *          comp.baby.dispose();
 *          delete comp.baby;
 *          return null;
 *     }
 * }
 */
/**
 * @typedef {Object} ResourceProvider
 * @property {function(id: string): EntityData} getEntity - Raw object containing default component definitions for Entity ID.
 * @property {function(id: string): ComponentClass} getComponent - Static component class for Component ID.
 */
/**
 * @typedef {function(): Promise<ResourceProvider>} ResourceLoader
 */

/**
 * @typedef {function(engine: Engine, k: string, down: bool)} KeyHandler
 */
/**
 * @typedef {Object} KeyDefinition
 * @property {string} key
 * @property {KeyHandler} [handler] - The handler function for both key up and down.
 * @property {KeyHandler} [upHandler] - The handler specifically for key up.
 * @property {KeyHandler} [downHandler] - The handler specifically for key down.
 */
/**
 * @typedef {Object} Settings
 * @property {bool} [debug=false]
 * @property {Object} [input]
 * @property {KeyDefinition[]} [input.keys]
 * @property {number} [statsInterval=1000]
 */

/**
 * @typedef {Object} Logger
 * @property {function} info
 * @property {function} debug
 * @property {function} warn
 * @property {function} error
 */
