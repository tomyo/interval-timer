let intervalId, activities, currentActivity, audioContext;

/**
 * Custom element for an interval timer
 * @element interval-timer
 * @slot set - The current sets remaining
 * @slot minutes - The minutes left
 * @slot seconds - The seconds left
 * @slot activity - The activity name
 */
customElements.define(
  "interval-timer",
  class extends HTMLElement {
    constructor() {
      super();

      this.set = this.querySelector("[slot=set]");
      this.minutes = this.querySelector("[slot=minutes]");
      this.seconds = this.querySelector("[slot=seconds]");
      this.activity = this.querySelector("[slot=activity]");
      this.sets = this.querySelector("input[name=sets]");
    }

    setUpIntervalTimer() {
      this.set.textContent = this.sets.value;
      activities = this.activitiesGenerator({ sets: this.sets.value });
      this.setCurrentActivity(activities.next().value);
    }

    startIntervalTimer() {
      if (intervalId) return console.warn("Timer already running");
      if (!activities) this.setUpIntervalTimer();

      playBeep({ length: 0.5 });
      intervalId = setInterval(this.tick, 1000);
      this.setAttribute("running", "");
      this.removeAttribute("finished");
    }

    pauseIntervalTimer() {
      if (!intervalId) return console.warn("Timer not running");
      intervalId = clearInterval(intervalId);
      this.removeAttribute("running");
    }

    setCurrentActivity(activity) {
      let color = "#1a7cbd";
      let beepOptions = { length: 0.6 };
      let activityText = activity;
      currentActivity = activity;

      if (!currentActivity) return this.finish();

      switch (currentActivity) {
        case "preparation":
          activityText = "prepare"; // Preparation is too long
          color = "#c85100";
          break;
        case "work":
          color = "#008943";
          beepOptions = { times: 2 };
          break;
        case "rest":
          color = "#1a7cbd";
          break;
        case "cooldown":
          color = "#1a7cbd";
          break;
      }

      playBeep(beepOptions);

      this.minutes.textContent = this.querySelector(`[name=${currentActivity}-minutes]`).value;
      this.seconds.textContent = this.querySelector(`[name=${currentActivity}-seconds]`).value;
      this.activity.textContent = activityText;

      document.documentElement.style.setProperty("--background-color", color);
    }

    doNextActivity() {
      if (currentActivity == "rest") {
        // We have completed a set
        this.set.textContent -= 1;
      }
      this.setCurrentActivity(activities.next().value);
    }

    finish() {
      if (this.hasAttribute("finished")) return console.warn("Timer already finished");
      if (intervalId) this.pauseIntervalTimer();
      playBeep({ times: 3 });
      this.setAttribute("finished", "");
      this.activity.textContent = "finished";
      activities = null;
    }

    /**
     * Get the activities that have a duration set.
     * For each activity, children inputs are expected with the names
     *  `${activity}-minutes` and `${activity}-seconds`
     *
     * @returns {string[]} The list of activities available to do
     */
    getAvailableActivities() {
      const allActivities = ["preparation", "work", "rest", "cooldown"];
      return allActivities.filter((activity) => {
        const m = this.querySelector(`[name=${activity}-minutes]`);
        const s = this.querySelector(`[name=${activity}-seconds]`);
        return m?.value > 0 || s?.value > 0;
      });
    }

    /**
     *
     * @param {Object} options
     * @param {string} options.startAt - The activity to start at
     * @param {number} options.sets - The number of sets to do (> 0)
     * @returns {Generator<string>}
     */
    *activitiesGenerator({ startAt = "preparation", sets = 1 } = {}) {
      let started = false;
      let currentSet = sets;

      while (currentSet > 0) {
        for (const activity of this.getAvailableActivities()) {
          if (!started) {
            // Skip until we find activity to start at
            if (activity != startAt) continue;
            started = true;
          }

          if (activity == "preparation") {
            // Skip preparation after the first set
            if (currentSet != sets) continue;
          }
          if (activity == "cooldown") {
            // Skip cooldown until the last set
            if (currentSet > 1) continue;
          }
          if (activity == "rest") {
            // Skip rest on the last set
            if (currentSet == 1) continue;
          }

          yield activity;
        }
        currentSet--;
      }
    }

    /**
     * Tick the timer one second.
     * If the time is up, move to the next activity.
     * @returns {void}
     */
    tick = () => {
      // A second has passed
      let m = Number(this.minutes.textContent);
      let s = Number(this.seconds.textContent);

      // Update display
      if (s == 0) {
        m = m - 1;
        s = 59;
      } else {
        s = s - 1;
      }
      this.seconds.textContent = s.toString().padStart(2, "0");
      this.minutes.textContent = m.toString().padStart(2, "0");

      if (m == 0 && s == 0) {
        // Time is up
        return this.doNextActivity();
      }

      if (m == 0 && s < 4) {
        // Last 3 seconds
        playBeep();
      }
    };
  }
);

/**
 * Play a beep sound
 * @param {object} options
 * @param {number} options.volume - The volume of the beep (0-1)
 * @param {number} options.length - The length of the beep (in seconds)
 * @param {number} options.times - The number of times the beep should repeat, the pause is the same `length` as the beep
 *
 * @returns {AudioContext} The audio context
 */
function playBeep({ volume = 0.4, length = 0.2, times = 1 } = {}) {
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();

  const oscillator = audioContext.createOscillator();
  oscillator.type = "sine"; // You can also use 'square', 'sawtooth', 'triangle'

  // Create a gain node to control volume
  const gainNode = audioContext.createGain();

  // Connect the gain node to the destination to control the output volume
  gainNode.connect(audioContext.destination);

  // Connect the oscillator to the gain node
  oscillator.connect(gainNode);

  // Set the frequency of the oscillator (in Hz)
  const f5 = 698.46;
  const f_5 = 739.99;
  const a_5 = 880.0;
  const freq = 1024;
  oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);

  // Set the volume of the oscillator
  volume = Math.min(1, Math.max(0, volume));
  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);

  // Start the oscillator
  oscillator.start();

  oscillator.stop(audioContext.currentTime + length);

  // Call itself recursively repeate the beeb `times` times.
  oscillator.onended = () => {
    if (times > 1) {
      setTimeout(() => {
        playBeep({ volume, length, times: times - 1 });
      }, length * 1000); // Use same audio length for pause length
    }
  };

  return audioContext;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}
