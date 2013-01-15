node-binder
===========

Mixin class for managing bindings in Node.js.

# Install

```
npm install node-binder
```

# Interfaces
```javascript
interface Binder {
  attribute Array bindings;
  Binding bind(EventEmitter emitter, String event, Function handler, optional any context = emitter);
  Binding once(EventEmitter emitter, String event, Function handler, optional any context = emitter);
  Binding bindKey(EventEmitter emitter, String event, Function handler, String key, optional any context = emitter);
  void destroy()
}
```

```javascript
interface Binding {
  attribute Binder binder;
  attribute String event;
  attribute Function handler;
  attribute EventEmitter emitter;
  void unbind()
}
```

# API
## Binder
The `Binder` class helps you manage bindings when gluing various classes and
events together. When your program or instance no longer needs these bindings,
simply call `binder.destroy()` to automatically remove all bindings to their 
respective `EventEmitter`s. 

### Binder#bind(emitter, event, handler [, context])
Binds `handler` to the `event` of `emitter`.

*Aliases: `on`, `addListener`*

__Arguments__

* `emitter` - Any object that inheriets from `EventEmitter`.
* `event` - Name of the event on `emitter` to which the `handler` will be bound.
* `handler` - Function handler for the `event`.
* `context` - Optional. Context with which to execute the `handler`.

__Returns__
`Binding`

__Example__
```javascript
var binding = binder.bind(someEventEmitter, "data", function( chunk ) {
  console.log("got a chunk!");
  console.log(chunk); // "foo"
}, someEventEmitter);

someEventEmitter.emit("data", "foo")

binding.unbind();
```

### Binder#once(emitter, event, handler [, context])
Binds `handler` to one emission of `event` on `emitter`.

*Aliases: `one`*

__Arguments__

* `emitter` - Any object that inheriets from `EventEmitter`.
* `event` - Name of the event on `emitter` to which the `handler` will be bound.
* `handler` - Function handler for the `event`.
* `context` - Optional. Context with which to execute the `handler`.

__Returns__
`Binding`

__Example__
```javascript
var binding = binder.once(someEventEmitter, "open", function( chunk ) {
  // Open now, do your stuff!
}, someEventEmitter);

someEventEmitter.emit("open")
```

### Binder#bindKey(emitter, event, object, key, [, context])
Binds `object[key]` to the `event` of `emitter`.

__Arguments__

* `emitter` - Any object that inheriets from `EventEmitter`.
* `event` - Name of the event on `emitter` to which the `handler` will be bound.
* `handler` - Function handler for the `event`.
* `context` - Optional. Context with which to execute the `handler`.

__Returns__
`Binding`

__Example__
```javascript
var someLiteral = {

  foo: function(data) {
    console.log("beep");
  },

  bar: function() {
    console.log("boop");
  }

};

var binding = binder.bindKey(someEventEmitter, "open", someLiteral, "dataHandler");

someLiteral.dataHandler = someLiteral.foo;
someEventEmitter.emit("data"); // "beep"

someLiteral.dataHandler = someLiteral.bar;
someEventEmitter.emit("data"); // "boop"
```

### Binder#destroy()
Unbinds all events previously bound using `bind`.

*Aliases: `removeAllListeners`*

__Example__
```javascript
binder.bind(someStream, "open", someClassThatHandlesStreams.onOpen, someClassThatHandlesStreams);
binder.bind(someStream, "data", someClassThatHandlesStreams.onData, someClassThatHandlesStreams);
binder.bind(someStream, "end", someClassThatHandlesStreams.onEnd, someClassThatHandlesStreams);
binder.bind(someStream, "error", someClassThatHandlesStreams.onError, someClassThatHandlesStreams);

/* Later on when you no longer need someClassThatHandlesStreams… */
binder.destroy();
```

## Binding
All `Binder` methods that perform a binding return 
a `Binding` instance which represents the binding created from the `Binder`.
This `Binding` instance has only one method, `unbind`, which removes it's
handler from it's `EventEmitter`.

### Binding#unbind()
Unbinds the binding it represents.

*Aliases: `off`, `removeListener`*

__Example__
```javascript
var binding = binder.bind(someStream, "open", someClassThatHandlesStreams.onOpen, someClassThatHandlesStreams);

binding.unbind();
```

# License
MIT license
