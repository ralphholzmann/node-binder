module.exports = (function() {

  function Binder() {
    this.bindings = [];
  }

  Binder.prototype.bind = function(emitter, event, fn, context) {
    var bound = fn.bind(context);
    this.bindings.push({
      emitter: emitter,
      event: event,
      fn: bound
    });
    emitter.on(event, bound);
  };

  Binder.prototype.destroy = function() {
    this.bindings.forEach(function(binding) {
      binding.emitter.removeListener(binding.event, binding.fn);
    });
    this.bindings = [];
  };

  return Binder;

})();
