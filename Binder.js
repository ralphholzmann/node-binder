module.exports = (function() {

  function Binder() {
    this.bindings = [];
  }

  Binder.prototype._bind = function(method, emitter, event, handler, context) {
    var bound = handler.bind(context);
    var binding = new Binding(this, {
      emitter: emitter,
      event: event,
      handler: bound
    });
    this.bindings.push(binding);
    emitter[method](event, bound);
    return binding;
  };

  Binder.prototype.bind = 
  Binder.prototype.on = 
  Binder.prototype.addListener = function(emitter, event, handler, context) {
    return this._bind("on", emitter, event, handler, context);
  };

  Binder.prototype.one =
  Binder.prototype.once = function(emitter, event, handler, context) {
    var binder = this;
    var binding = this._bind("once", emitter, event, function() {
      binding.unbind();
      handler.apply(this, arguments);
    }, context);
    return binding;
  };

  Binder.prototype.bindKey = function(emitter, event, object, key, context) {
    return this._bind("on", emitter, event, function() {
      object[key].apply(this, arguments);
    }, context || object);
  };

  Binder.prototype.removeAllListeners =
  Binder.prototype.destroy = function() {
    while (this.bindings.length) {
      this.bindings[0].unbind();
    }
  };

  function Binding(binder, props) {
    this.binder = binder;
    this.emitter = props.emitter;
    this.event = props.event;
    this.handler = props.handler;
  }

  Binding.prototype.off =
  Binding.prototype.removeListener =
  Binding.prototype.unbind = function() {
    this.binder.bindings.splice(this.binder.bindings.indexOf(this), 1);
    this.emitter.removeListener(this.event, this.handler);
  };

  return Binder;

})();
