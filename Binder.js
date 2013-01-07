module.exports = (function() {

  function Binder() {
    this.bindings = [];
  }

  Binder.prototype._bind = function(method, emitter, event, fn, context) {
    var bound = fn.bind(context);
    this.bindings.push({
      emitter: emitter,
      event: event,
      fn: bound
    });
    emitter[method](event, bound);
  };

  Binder.prototype.once = function(emitter, event, fn, context) {
    this._bind("once", emitter, event, fn, context);
  };

  Binder.prototype.bind = function(emitter, event, fn, context) {
    this._bind("on", emitter, event, fn, context);
  };

  Binder.prototype.destroy = function() {
    this.bindings.forEach(function(binding) {
      binding.emitter.removeListener(binding.event, binding.fn);
    });
    this.bindings = [];
  };

  return Binder;

})();
