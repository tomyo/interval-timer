const MIN_VALUE = 1;

customElements.define(
  "input-repetitions",
  class extends HTMLElement {
    constructor() {
      super();
      this.decButton = this.querySelector("button:first-of-type");
      this.incButton = this.querySelector("button:last-of-type");
      this.input = this.querySelector("input");

      this.addEventListener("click", this);
    }

    updateValue(newValue) {
      this.input.value = Math.max(Number(newValue), MIN_VALUE);
    }

    handleEvent(event) {
      if (event.target == this.decButton) this.input.value = Math.max(Number(this.input.value) - 1, MIN_VALUE);
      if (event.target == this.incButton) this.input.value = Number(this.input.value) + 1;
    }
  }
);
