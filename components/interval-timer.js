let intervalId, activities, currentActivity, audioContext, soundVolume;

// The timer follows the order of this list
// For each activity, an input with name `${activity}-minutes` and `${activity}-seconds` is expected
const ACTIVITIES = ["preparation", "work", "rest", "cooldown"];

function* getActivities({ startAt = ACTIVITIES[0] } = {}) {
  let started = false;
  for (const activity of ACTIVITIES) {
    if (!started) {
      if (activity != startAt) continue;
      started = true;
    }
    yield activity;
  }
}

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
    }

    setUpIntervalTimer() {
      activities = getActivities();

      do {
        this.setCurrentActivity(activities.next().value);
        this.set.textContent = document.querySelector("input[name=sets]").value;
      } while (!this.getCurrentActivityDuration());
    }

    setCurrentActivity(act) {
      currentActivity = act;

      this.activity.textContent = currentActivity == "preparation" ? "prepare" : currentActivity; // Preparation is too long

      this.minutes.textContent = this.querySelector(`[name=${currentActivity}-minutes]`).value;
      this.seconds.textContent = this.querySelector(`[name=${currentActivity}-seconds]`).value;

      // bg color
      let color = "#1a7cbd"; // rest and cooldown
      if (currentActivity == "preparation") color = "#c85100";
      if (currentActivity == "work") color = "#008943";

      document.documentElement.style.setProperty("--background-color", color);
    }

    /**
     * Get the current activity duration in seconds
     * @returns {number} The current activity duration in seconds
     */
    getCurrentActivityDuration() {
      return Number(this.minutes.textContent) * 60 + Number(this.seconds.textContent);
    }

    isCurrentSetLast() {
      return this.set.textContent == 1;
    }

    nextActivity() {
      if (currentActivity == "work" && this.isCurrentSetLast())
        // When working on the last set, we'll skip the rest activity.
        // We are either done or we are going to cooldown.
        activities.next();

      if (currentActivity == "rest") {
        assert(
          !this.isCurrentSetLast(),
          `We shouldn't be resting as a last activity, work or cooldown can only be the last activity.`
        );
        // Start over with the first workout activity (skip preparation)
        activities = getActivities({ startAt: "work" });
        this.set.textContent -= 1;
      }

      if (currentActivity == "cooldown") return this.finish();

      // Normal flow where a next activity is available
      this.setCurrentActivity(activities.next().value);

      if (!this.getCurrentActivityDuration()) {
        // Probably a "cooldown" or "rest" activity not set (thus having no duration)
        this.nextActivity();
      }

      playBeep();
    }

    previousActivity() {
      if (ACTIVITIES.indexOf(currentActivity) < 1) return;

      this.setCurrentActivity(ACTIVITIES[ACTIVITIES.indexOf(currentActivity) - 1]);
      // TODO: skip last rest activity when going back from cooldown
    }

    /**
     * Tick the timer one second
     * @returns {void}
     */
    tick = () => {
      let m = Number(this.minutes.textContent);
      let s = Number(this.seconds.textContent);

      // A second passed
      if (s == 0) {
        m = m - 1;
        s = 59;
      } else {
        s = s - 1;
      }

      if (m == 0 && s == 0) {
        return this.nextActivity();
      }

      this.seconds.textContent = s.toString().padStart(2, "0");
      this.minutes.textContent = m.toString().padStart(2, "0");
    };

    startIntervalTimer() {
      if (intervalId) return console.warn("Timer already running");
      if (!activities) this.setUpIntervalTimer();

      playBeep();
      intervalId = setInterval(this.tick, 1000);
      this.setAttribute("running", "");
      this.removeAttribute("finished");
    }

    pauseIntervalTimer() {
      if (!intervalId) return console.warn("Timer not running");
      intervalId = clearInterval(intervalId);
      this.removeAttribute("running");
    }

    finish() {
      if (this.hasAttribute("finished")) return console.warn("Timer already finished");
      if (intervalId) this.pauseIntervalTimer();
      playBeep({ times: 3 });
      this.setAttribute("finished", "");
      this.activity.textContent = "finished";
      activities = null;
    }
  }
);

/**
 * Play a beep sound
 * @param {AudioContext} audioContext The audio context to use, a new is created if not provided
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
  oscillator.frequency.setValueAtTime(f_5, audioContext.currentTime);

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
