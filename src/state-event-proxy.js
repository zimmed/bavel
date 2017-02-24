import {_} from './utils';
import events from './state-events';

const DISABLE = {};

export default (obj, scope, properties, options={}) => {
    let self = obj || {};

    _.forEach(properties, (prop, k) => {
        let name = _.isNumber(k) ? prop : k,
            value = _.isNumber(k) ? options.def : prop;

        proxifyProperty(
            `${scope}.${name}`,
            obj,
            name,
            value,
            options);
    });
    return self;
};

export function proxifyProperty(scope, obj, prop, value, {
    deep=false, enumerable=true
}={}) {
    let p = value;

    if (deep && _.isPlainObject(value)) {
        p = buildProxyObject(scope, value, {deep, enumerable});
    } else if (deep && _.isArray(value)) {
        p = buildProxyArray(scope, obj, value, {deep, enumerable});
    }
    Object.defineProperty(obj, prop, {
        get: () => p,
        set: (v) => {
            if (deep && _.isObject(v)) {
                v = _.isArray(v)
                    ? buildProxyArray(scope, obj, v, {deep, enumerable})
                    : buildProxyObject(scope, v, {deep, enumerable});
            }
            emit(scope, v, obj);
            p = v;
            return true;
        },
        configurable: true,
        enumerable
    });
}

export function buildProxyObject(scope, obj, o) {
    let p = {};

    _.forEach(obj, (v, k) => proxifyProperty(`${scope}.${k}`, p, k, v, o));
    return p;
}

export function buildProxyArray(scope, parent, arr, o) {
    const ret = new Proxy(
        _.map(arr, (e, i) =>
            _.isPlainObject(e) && buildProxyObject(`${scope}[${i}]`, e, o) ||
            _.isArray(e) && buildProxyArray(`${scope}[${i}]`, e, o) || e),
        {
            get: (target, key) => {
                if (isMutateFn(key)) {
                    return (...args) => {
                        DISABLE[scope] = true;
                        let v = target[key](...args);

                        delete DISABLE[scope];
                        emit(scope, ret, parent);
                        return v;
                    };
                }
                return target[key];
            },
            set: (target, i, v) => {
                if (_.isNumber(i)) {
                    v = _.isPlainObject(v) && buildProxyObject(`${scope}[${i}]`, v, o) ||
                        _.isArray(v) && buildProxyArray(`${scope}[${i}]`, ret, v, o) || v;
                    emit(`${scope}[${i}]`, v, ret);
                }
                target[i] = v;
                return true;
            },
            deleteProperty: (target, i) => {
                if (_.isNumber(i)) {
                    emit(`${scope}[${i}]`, undefined, ret);
                }
                delete target[i];
                return true;
            }
        }
    );
}

export function emit(scope, v, obj) {
    if (!DISABLE[scope]) {
        setTimeout(() => events.emit(scope, v, obj));
    }
}

export function isMutateFn(key) {
    return _.includes([
        'push',
        'pop',
        'shift',
        'unshift',
        'splice'
    ], key);
}
