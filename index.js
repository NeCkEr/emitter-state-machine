/**
 * StateMachine v0.0.1
 * Based on Oliver Caldwell git.io/stm
 * MIT license
 */

'use strict';

var Happens = require('happens');

// This is a variable that either contains the native Object.create method
// Or a custom polyfill from Douglass Crockford
// It is used in prototypical inheritance
var createObject = Object.create || function(o) {
    function F(){}
    F.prototype = o;
    return new F();
};

/**
 * Builds the class and returns it to be exposed as you wish
 *
 * @param {Function} EventEmitter Event class required by this class for extension, you decide how to load it, AMD/script tag etc
 * @return {Function} This will be the build StateMachine class to be exposed either via AMD or the global object
 */
function construct(Happens) {
    /**
     * Constructor for the StateMachine class, this is what you instantiate
     * You can also use it to set an initial state or events
     *
     * @param {Object} An object containing an optional initial state and listeners object, for example: { initialState: 'foo', listeners: { '>foo': function() {...} } }
     */
    function StateMachine(options) {
        if(options) {
            // Store the initial state if there is one
            if(options.initialState) {
                this.setState(options.initialState);
            }
        }
    }

    // This is a shortcut to the prototype to save time and bytes
    // This line also extends the EventEmitter class using createObject
    // It copies the EventEmitter prototype into its own
    // This is prototypical inheritance in action
    var proto = StateMachine.prototype = createObject(Happens.prototype);

    /**
     * Simply fetches the current state name string and returns it
     * If there is no current state it will return null
     * It will only return a string, and not null, if the state is a string with at least one character inside it
     *
     * @return {String|Object} The state name as a string or null if there is none set (null is technically an object)
     */
    proto.getState = function() {
        var state = this._state;
        return typeof state === 'string' && state ? state : null;
    };
    proto.getOldState = function() {
        var oldState = this._oldState;
        return typeof oldState === 'string' && oldState ? oldState : null;
    };

    /**
     * Sets the state of the StateMachine instance
     * Executes the appropriate listeners along the way
     *
     * @param {String} next The new state to use
     * @param {Array} [args] An optional array of arguments to pass to the event listeners
     * @return The current instance to allow chaining
     */
    proto.setState = function(next, args) {
        // Store the original state for reference
        var orig = this.getState(),
            // And this is the transition indicator
            trans = '>';

        // And then override it with the new one
        // We can still do stuff with the old one though because it has been stored in orig
        this._state = next;
        this._oldState = orig;

        // Now the state has actually changed it's time to emit some events
        // The first thing to check is if there was actually a previous state
        // If we have a from as well as a to then the specific transition needs to be emitted first
        // This is because it is more specific, so it should take precedence
        if(orig) {
            // So this is the most specific event
            // It is only emitted because we had a from and to
            this.emit(orig + trans + next, args);

            // Next should be the from event on its own
            this.emit(orig + trans, args);
        }

        // Emit for the one we are transitioning to
        // We do not need to check for it because it is a required argument
        this.emit(trans + next, args);

        // The last thing to emit is the changed event
        // This is a generic event so someone can monitor *all* changes
        // The listeners attached to it are passed the from and to values
        this.emit('change', [orig, next]);

        // By returning the current instance it creates a chainable API
        return this;
    };

    // Now we pass the finished class back down the chain
    // Another part of the code then exposes it in the correct way
    return StateMachine;
}

// Without AMD on the page they must load EventEmitter manually
// Which also means StateMachine must be built and exposed manually
// So we use the global EventEmitter instance and drop StateMachine into the global object too
module.exports = construct(Happens);
