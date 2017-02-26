import {_} from './utils';
import Static from 'basic-static';
import events from './state-events';

export default (...args) => StateEventProxy.create(...args);

export const DISABLE = {};

export class StateEventProxy extends Static {

    static create(obj, scope, properties, options) {
        let self = obj || {};

        _.forEach(properties, (prop, k) => {
            let name = _.isNumber(k) ? prop : k,
                value = _.isNumber(k) ? options.def : prop;

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

        if (deep && _.isPlainObject(value)) {
            p = this.buildProxyObject(scope, value, {deep, enumerable});
        } else if (deep && _.isArray(value)) {
            p = this.buildProxyArray(scope, obj, value, {deep, enumerable});
        }
        Object.defineProperty(obj, prop, {
            get: () => p,
            set: (v) => {
                if (deep && _.isObject(v)) {
                    v = _.isArray(v)
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

        _.forEach(obj, (v, k) => this.proxifyProperty(`${scope}.${k}`, p, k, v, o));
        return p;
    }

    static buildProxyArray(scope, parent, arr, o) {
        const ret = new Proxy(
            _.map(arr, (e, i) =>
                _.isPlainObject(e) && this.buildProxyObject(`${scope}[${i}]`, e, o) ||
                _.isArray(e) && this.buildProxyArray(`${scope}[${i}]`, ret, e, o) || e),
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
                    console.log(i, typeof i);
                    if (!_.isNaN(i)) {
                        v = _.isPlainObject(v) && this.buildProxyObject(`${scope}[${i}]`, v, o) ||
                            _.isArray(v) && this.buildProxyArray(`${scope}[${i}]`, ret, v, o) || v;
                        this.emit(`${scope}[${i}]`, v, ret);
                    }
                    target[i] = v;
                    return true;
                },
                deleteProperty: (target, i) => {
                    if (!_.isNaN(i)) {
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
            setTimeout(() => events.emit(scope, v, obj));
        }
    }

    static isMutateFn(key) {
        return _.includes([
            'copyWithin',
            'fill',
            'pop',
            'push',
            'reverse',
            'shift',
            'sort',
            'splice',
            'unshift'
        ], key);
    }
}
