node-binder
===========

Mixin class for managing bindings in Node.js

## API
### bind(emitter, event, fn [, context])
Binds `fn` to the `event` of `emitter` and keeps track of bindings for easy destruction.

__Arguments__

* `emitter` - Any object that inheriets from `EventEmitter`.
* `event` - Name of the event on `emitter` to which the `fn` will be bound.
* `fn` - Function handler for the `event`.
* `context` - Optional. Context with which to execute the `fn`.

### destroy()
Unbinds all events previously bound using `bind`.

## Example
```javascript
function SomeStreamingClass() {}

SomeStreamClass.prototype.onData = function(chunk) {
    /* Do some cool stuff… */
}

var Binder = require("node-binder");
var binder = new Binder();
var someStream = new SomeStreamClass();

binder.bind(someStream, "data", someStream.onData, someStream);

/* Later on when you no longer need someStream… */
binder.destroy();
```

