System.register([], function (_export, _context) {
  "use strict";

  return {
    setters: [],
    execute: function () {
      // The Animator runs the Model's step() and draw() methods.

      // Because not all models have the same amimator requirements, we build a class
      // for customization by the programmer.  See these URLs for more info:
      // * [JavaScript timers docs](
      //    https://developer.mozilla.org/en-US/docs/JavaScript/Timers)
      // * [Using timers & requestAnimationFrame together](http://goo.gl/ymEEX)

      class Animator {
        // Create initial animator for the model, specifying rate (fps) and
        // multiStep. Called by Model during initialization, use setRate to modify.
        // If multiStep, run the draw() and step() methods separately by
        // draw() using requestAnimationFrame and step() using setTimeout.
        constructor(model, rate = 30, multiStep = false) {
          Object.assign(this, { model, rate, multiStep });
          this.reset();
        }
        // Adjust animator. Call before model.start()
        // in setup() to change default settings
        setRate(rate, multiStep = false) {
          Object.assign(this, { rate, multiStep });
          this.resetTimes();
        }
        // start/stop model, often used for debugging and resetting model
        start() {
          if (this.stopped) return; // avoid multiple starts
          this.resetTimes();
          this.stopped = false;
          this.animate();
        }
        stop() {
          this.stopped = true;
          if (this.animHandle) cancelAnimationFrame(this.animHandle);
          if (this.timeoutHandle) clearTimeout(this.timeoutHandle);
          this.animHandle = this.timeoutHandle = null;
        }
        // Internal utility: reset time instance variables
        resetTimes() {
          this.startMS = this.now();
          this.startTick = this.ticks;
          this.startDraw = this.draws;
        }
        // Reset used by model.reset when resetting model.
        reset() {
          this.stop();this.ticks = this.draws = 0;
        }
        // Two handlers used by animation loop
        step() {
          this.ticks++;this.model.step();
        }
        draw() {
          this.draws++;this.model.draw();
        }
        // step and draw the model once, mainly debugging
        once() {
          this.step();return this.draw();
        }
        // Get current time, with high resolution timer if available
        now() {
          return performance.now();
        }
        // Time in ms since starting animator
        ms() {
          return this.now() - this.startMS;
        }
        // Get ticks/draws per second. They will differ if multiStep.
        ticksPerSec() {
          const dt = this.ticks - this.startTick;
          return dt === 0 ? 0 : Math.round(dt * 1000 / this.ms()); // avoid divide by 0
        }
        drawsPerSec() {
          const dt = this.draws - this.startDraw;
          return dt === 0 ? 0 : Math.round(dt * 1000 / this.ms());
        }
        // Return a status string for debugging and logging performance
        toString() {
          return `ticks: ${ this.ticks }, draws: ${ this.draws }, rate: ${ this.rate } tps/dps: ${ this.ticksPerSec() }/${ this.drawsPerSec() }`;
        }
        // Animation via setTimeout and requestAnimationFrame
        animateSteps() {
          this.step();
          if (!this.stopped) this.timeoutHandle = setTimeout(this.animateSteps, 10);
        }
        animateDraws() {
          if (this.drawsPerSec() < this.rate) {
            // throttle drawing to @rate
            if (!this.multiStep) this.step();
            this.draw();
          }
          if (!this.stopped) this.animHandle = requestAnimationFrame(this.animateDraws);
        }
        animate() {
          if (this.multiStep) this.animateSteps();
          this.animateDraws();
        }
      }

      _export("default", Animator);
    }
  };
});