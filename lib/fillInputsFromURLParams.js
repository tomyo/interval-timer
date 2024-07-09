export function fillInputsFromURLParams() {
  const urlParams = new URLSearchParams(window.location.search);

  urlParams.forEach((value, key) => {
    // Find the input element with the matching name attribute
    const inputElement = document.querySelector(`input[name=${key}]`);
    if (inputElement) {
      // Set the value of the input element
      inputElement.value = value;
    }
  });
}
