const MIN_VALUE = 0;

customElements.define(
  "input-duration",
  class extends HTMLElement {
    constructor() {
      super();
      this.decButton = this.querySelector("button:first-of-type");
      this.incButton = this.querySelector("button:last-of-type");
      this.minutes = this.querySelector("[name$=-minutes]");
      this.seconds = this.querySelector("[name$=-seconds]");

      this.toChange = this.seconds;

      this.addEventListener("click", this);
    }

    updateValue(newValue) {
      this.toChange.value = String(newValue).padStart(2, "0");
    }

    handleEvent(event) {
      if (event.target == this.seconds) return (this.toChange = this.seconds);
      if (event.target == this.minutes) return (this.toChange = this.minutes);
      if (event.target == this.decButton) return this.updateValue(Math.max(Number(this.toChange.value) - 1, MIN_VALUE));
      if (event.target == this.incButton) return this.updateValue(Number(this.toChange.value) + 1);
    }
  }
);
