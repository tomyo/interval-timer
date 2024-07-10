customElements.define(
  "interval-timer-controls",
  class extends HTMLElement {
    constructor() {
      super().innerHTML = /*html*/ `
        <a class="button" name="exit" href="/">
          <svg viewBox="0 0 1024 1024" fill="currentColor" with="50px" height="40px" xmlns="http://www.w3.org/2000/svg" fill="#000000" ><g stroke-width="0"></g><g stroke-linecap="round" stroke-linejoin="round"></g><g ><path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"></path><path d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z" ></path></g></svg>
          </a>
        <button
          name="prev"
          title="Previous activity"
          onclick="intervalTimer.previousActivity()"
        >
          <svg
            width="40px"
            height="40px"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M18.4265377,4.18076808 L8.42653766,11.1807681 C7.85782078,11.5788699 7.85782078,12.4211301 8.42653766,12.8192319 L18.4265377,19.8192319 C19.0893151,20.2831762 20,19.809023 20,19 L20,5 C20,4.19097699 19.0893151,3.71682385 18.4265377,4.18076808 Z M5,4 C4.44771525,4 4,4.44771525 4,5 L4,19 C4,19.5522847 4.44771525,20 5,20 C5.55228475,20 6,19.5522847 6,19 L6,5 C6,4.44771525 5.55228475,4 5,4 Z M18,6.92065556 L18,17.0793444 L10.7437937,12 L18,6.92065556 Z"
            />
          </svg>
        </button>
        <button
          name="pause"
          title="Pause timer"
          onclick="intervalTimer.pauseIntervalTimer()"
        >
          <svg
            width="40px"
            height="40px"
            viewBox="0 0 24 24"
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 5V19M16 5V19"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <button
          name="play"
          title="Start timer"
          onclick="intervalTimer.startIntervalTimer()"
        >
          <svg
            width="40px"
            height="40px"
            stroke="currentColor"
            fill="transparent"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.6582 9.28638C18.098 10.1862 18.8178 10.6361 19.0647 11.2122C19.2803 11.7152 19.2803 12.2847 19.0647 12.7878C18.8178 13.3638 18.098 13.8137 16.6582 14.7136L9.896 18.94C8.29805 19.9387 7.49907 20.4381 6.83973 20.385C6.26501 20.3388 5.73818 20.0469 5.3944 19.584C5 19.053 5 18.1108 5 16.2264V7.77357C5 5.88919 5 4.94701 5.3944 4.41598C5.73818 3.9531 6.26501 3.66111 6.83973 3.6149C7.49907 3.5619 8.29805 4.06126 9.896 5.05998L16.6582 9.28638Z"
              stroke-width="2"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <button
          name="next"
          title="Next activity"
          onclick="intervalTimer.nextActivity()"
        >
          <svg
            width="40px"
            height="40px"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.028,20.882a1,1,0,0,0,1.027-.05l12-8a1,1,0,0,0,0-1.664l-12-8A1,1,0,0,0,3.5,4V20A1,1,0,0,0,4.028,20.882ZM5.5,5.869,14.7,12,5.5,18.131ZM18.5,18V6a1,1,0,0,1,2,0V18a1,1,0,0,1-2,0Z"
            />
          </svg>
        </button>
      `;
    }
  }
);
