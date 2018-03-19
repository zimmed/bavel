import EventEmitter from 'events';

const stateEvents = new EventEmitter();

/**
 * The EventEmitter for proxified object state changes.
 *
 * @access public
 * @type {EventEmitter}
 */
export default stateEvents;
