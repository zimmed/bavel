import EventEmitter from 'events';

const events = new EventEmitter();

/**
 * The EventEmitter for proxified object state changes.
 *
 * @access public
 * @type {EventEmitter}
 */
export const Events = events;

