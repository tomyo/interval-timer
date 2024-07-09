let intervalId, activities, currentActivity, audioContext, soundVolume;

customElements.define(
  "interval-timer",
  class extends HTMLElement {
    constructor() {
      super();
    }

    setUpIntervalTimer() {
      activities = getActivities();

      do {
        setActivity(activities.next().value);
        set.textContent = document.querySelector("input[name=sets]").value;
      } while (!getCurrentActivityDuration());
    }

    startIntervalTimer() {
      if (!activities) this.setUpIntervalTimer();

      playBeep();
      intervalId = setInterval(tick, 1000);
    }
  }
);

function* getActivities({ startAt = "preparation" } = {}) {
  let started = false;
  for (const activity of ["preparation", "work", "rest", "cooldown"]) {
    if (!started) {
      if (activity != startAt) continue;
      started = true;
    }
    yield activity;
  }
}

/**
 * Get the current activity duration in seconds
 * @returns {number} The current activity duration in seconds
 */
function getCurrentActivityDuration() {
  return Number(minutes.textContent) * 60 + Number(seconds.textContent);
}

function startIntervalTimer() {
  if (!activities) setUpIntervalTimer();

  startButton.style.display = "none";

  playBeep();
  intervalId = setInterval(tick, 1000);
}

function setActivity(act) {
  currentActivity = act;
  activity.textContent =
    currentActivity == "preparation" ? "prepare" : currentActivity;
  setNewTimerFor(currentActivity);

  // bg color
  let color = "#1a7cbd"; // rest and cooldown
  if (currentActivity == "preparation") color = "#c85100";
  if (currentActivity == "work") color = "#008943";

  document.documentElement.style.setProperty("--background-color", color);
}

function setNewTimerFor(activity) {
  minutes.textContent = document.querySelector(
    `[name=${currentActivity}-minutes]`
  ).value;
  seconds.textContent = document.querySelector(
    `[name=${currentActivity}-seconds]`
  ).value;
}

function finish() {
  clearInterval(intervalId);
  playBeep({ times: 3 });
}
function isCurrentSetLast() {
  return set.textContent == 1;
}

function nextActivity() {
  if (currentActivity == "work" && isCurrentSetLast())
    // When working on the last set, we'll skip the rest activity.
    // We are either done or we are going to cooldown.
    activities.next();

  if (currentActivity == "rest") {
    assert(
      !isCurrentSetLast(),
      `We shouldn't be resting as a last activity, work or cooldown can only be the last activity.`
    );
    // Start over with the first workout activity (skip preparation)
    activities = getActivities({ startAt: "work" });
    set.textContent -= 1;
  }

  if (currentActivity == "cooldown") return finish();

  // Normal flow where a next activity is available
  setActivity(activities.next().value);

  if (!getCurrentActivityDuration()) {
    // Probably a cooldown or rest activity not set (thus having no duration)
    nextActivity();
  }

  playBeep();
}

function tick() {
  let m = Number(minutes.textContent);
  let s = Number(seconds.textContent);

  // A second passed
  if (s == 0) {
    m = m - 1;
    s = 59;
  } else {
    s = s - 1;
  }

  if (m == 0 && s == 0) {
    return nextActivity();
  }

  seconds.textContent = s.toString().padStart(2, "0");
  minutes.textContent = m.toString().padStart(2, "0");
}

/**
 * Play a beep sound
 * @param {AudioContext} audioContext The audio context to use, a new is created if not provided
 * @returns {AudioContext} The audio context
 */
function playBeep({ volume = 0.5, length = 0.2, times = 1 } = {}) {
  if (!audioContext)
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

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
