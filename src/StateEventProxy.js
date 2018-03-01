import Static from 'basic-static';
import forEach from 'lodash.foreach';
import isObject from 'lodash.isobject';
import isPlainObject from 'lodash.isplainobject';
import isNumber from 'lodash.isnumber';
import stateEvents from './stateEvents';

/**
 * @typedef {function(scope: string, newValue: *, parentObject: Object): undefined} ScopedEventListener
 * @typedef {string} ScopedEvent - Handled by {@link ScopedEventListener}.
 */
/**
 * @typedef {Object} ProxifiedObject
 * @emits {ScopedEvent} - emits event name scoped to property change for proxied
 *  properties.
 */

/**
 * @access private
 */
export const DISABLE = {};

/**
 * The StateEventProxy class.
 * 
 * @example <caption>Setup</caption>
 * const StateEventProxy = require('./StateEventProxy');
 * let myObject = {};
 * @example <caption>Property Keys</caption>
 * StateEventProxy.create(myObject, 'myObject', ['myPropA', 'myPropB']);
 * console.log(myObject) // {myPropA: undefined, myPropB: undeinfed}
 * myObject.myPropA = 10; // Emits event w/ args: 'myObject.myPropA', 10, myObject
 * myObject.myPropB = {}; // Emits event w/ args: 'myObject.myPropB', {}, myObject
 * console.log(myObject) // {myPropA: 10, myPropB: {}}
 * @example <caption>Property Map</caption>
 * StateEventProxy.create(myObject, 'myObject', {
 *     myPropA: 42,
 *     myPropB: {foo: 'bar'}
 * });
 * console.log(myObject) // {myPropA: 42, myPropB: {foo: 'bar'}}
 * myObject.myPropA = 10; // Emits event w/ args: 'myObject.myPropA', 10, myObject
 * myObject.myPropB.foo = 'foo'; // Does not emit an event.
 * console.log(myObject) // {myPropA: 10, myPropB: {foo: 'foo'}}
 * @example <caption>Property Map w/ Deep Proxy</caption>
 * StateEventProxy.create(myObject, 'myObject', {
 *     myPropA: [{id: 'foo'}, {id: 'bar'}],
 *     myPropB: {a: 1, b: 2, c: 3}
 * }, {deep: true});
 * console.log(myObject) // {myPropA: [{id: 'foo'}, {id: 'bar'}], myPropB: {a: 1, b: 2, c: 3}}
 * myObject.myPropB.a = 0; // Emits event w/ args: 'myObject.myPropB.a', 0, myObject.myPropB
 * myObject.myPropB = {}; // Emits event w/ args: 'myObject.myPropB', {}, myObject
 * myObject.myPropA[0].id = 42; // Emits event w/ args: 'myObject.myPropA[0].id', 42, myObject.myPropA[0]
 * myObject.myPropA.push('foobar'); // Emits event w/ args: 'myObject.myPropA', myObject.myPropA, myObject
 * console.log(myObject) // {myPropA: [{id: 42}, {id: 'bar'}, 'foobar'], myPropB: {}}

 */
export default class StateEventProxy extends Static {

    /**
    * @return {ProxifiedObject}
    */
    static create(obj, scope, properties, options={}) {
        let self = obj || {};

        forEach(properties, (prop, k) => {
            let name = isNumber(k) ? prop : k,
                value = isNumber(k) ? options.def : prop;

            this.proxifyProperty(
                `${scope}.${name}`,
                obj,
                name,
                value,
                options);
        });
        return self;
    }

    static proxifyProperty(scope, obj, prop, value, {
        deep=false, enumerable=true
    }={}) {
        let p = value;

        if (deep && isPlainObject(value)) {
            p = this.buildProxyObject(scope, value, {deep, enumerable});
        } else if (deep && Array.isArray(value)) {
            p = this.buildProxyArray(scope, obj, value, {deep, enumerable});
        }
        Object.defineProperty(obj, prop, {
            get: () => p,
            set: (v) => {
                if (deep && isObject(v)) {
                    v = Array.isArray(v)
                        ? this.buildProxyArray(scope, obj, v, {deep, enumerable})
                        : this.buildProxyObject(scope, v, {deep, enumerable});
                }
                this.emit(scope, v, obj);
                p = v;
                return true;
            },
            configurable: true,
            enumerable
        });
    }

    static buildProxyObject(scope, obj, o) {
        let p = {};

        forEach(obj, (v, k) => this.proxifyProperty(`${scope}.${k}`, p, k, v, o));
        return p;
    }

    static buildProxyArray(scope, parent, arr, o) {
        const ret = new Proxy(
            arr.map((e, i) =>
                isPlainObject(e) && this.buildProxyObject(`${scope}[${i}]`, e, o) ||
                Array.isArray(e) && this.buildProxyArray(`${scope}[${i}]`, ret, e, o) || e),
            {
                get: (target, key) => {
                    if (this.isMutateFn(key)) {
                        return (...args) => {
                            DISABLE[scope] = true;
                            let v = target[key](...args);

                            delete DISABLE[scope];
                            this.emit(scope, ret, parent);
                            return v;
                        };
                    }
                    return target[key];
                },
                set: (target, i, v) => {
                    if (!isNaN(i)) {
                        v = isPlainObject(v) && this.buildProxyObject(`${scope}[${i}]`, v, o) ||
                            Array.isArray(v) && this.buildProxyArray(`${scope}[${i}]`, ret, v, o) || v;
                        this.emit(`${scope}[${i}]`, v, ret);
                    }
                    target[i] = v;
                    return true;
                },
                deleteProperty: (target, i) => {
                    if (!isNaN(i)) {
                        this.emit(`${scope}[${i}]`, undefined, ret);
                    }
                    delete target[i];
                    return true;
                }
            }
        );

        return ret;
    }

    static emit(scope, v, obj) {
        if (!DISABLE[scope]) {
            setTimeout(() => stateEvents.emit(scope, v, obj));
        }
    }

    static isMutateFn(key) {
        return [
            'copyWithin',
            'fill',
            'pop',
            'push',
            'reverse',
            'shift',
            'sort',
            'splice',
            'unshift',
        ].includes(key);
    }
}
