customElements.define(
  "interval-timer-controls",
  class extends HTMLElement {
    constructor() {
      super();
      this.intervalTimer = this.closest("interval-timer");
      this.wakeLock = null;

      this.addEventListener("click", this);
      this.render();
    }

    handleEvent(event) {
      switch (event.target.closest("button").name) {
        case "play":
        case "replay":
          this.preventScreenLock();
          this.intervalTimer.startIntervalTimer();
          break;
        case "pause":
          this.intervalTimer.pauseIntervalTimer();
          this.releaseScreenLock();
          break;
        case "prev":
          // TODO: this.intervalTimer.previousActivity();
          break;
        case "next":
          this.intervalTimer.doNextActivity();
          break;
      }
    }

    async preventScreenLock() {
      if (!("wakeLock" in navigator)) return;

      try {
        this.wakeLock = await navigator.wakeLock.request("screen");
      } catch (err) {
        console.error(`Could not lock screen: ${err.name}, ${err.message}`);
      }
    }

    async releaseScreenLock() {
      if (!this.wakeLock) return;

      await this.wakeLock.release();
      this.wakeLock = null;
    }

    render() {
      this.innerHTML = /*html*/ `
        <a class="button" name="exit" href="/">
          <svg
            viewBox="0 0 1024 1024"
            fill="currentColor"
            with="50px"
            height="60px"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
          >
            <g stroke-width="0"></g>
            <g stroke-linecap="round" stroke-linejoin="round"></g>
            <g>
              <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"></path>
              <path
                d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
              ></path>
            </g>
          </svg>
        </a>
        <button name="pause" title="Pause timer">
          <svg
            width="60px"
            height="60px"
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
        >
          <svg
            width="60px"
            height="60px"
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
        <button name="next" title="Next activity">
          <svg
            width="60px"
            height="60px"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.028,20.882a1,1,0,0,0,1.027-.05l12-8a1,1,0,0,0,0-1.664l-12-8A1,1,0,0,0,3.5,4V20A1,1,0,0,0,4.028,20.882ZM5.5,5.869,14.7,12,5.5,18.131ZM18.5,18V6a1,1,0,0,1,2,0V18a1,1,0,0,1-2,0Z"
            />
          </svg>
        </button>
        <a class="button" name="close" title="Close" href="/">
          <svg width="60px" height="60px" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg"><g stroke-width="0"></g><g stroke-linecap="round" stroke-linejoin="round"></g><g> <g> <path  d="M5 8.2002V15.8002C5 16.9203 5 17.4796 5.21799 17.9074C5.40973 18.2837 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8036C16.9215 19 17.4805 19 17.9079 18.7822C18.2842 18.5905 18.5905 18.2837 18.7822 17.9074C19 17.48 19 16.921 19 15.8031V8.19691C19 7.07899 19 6.5192 18.7822 6.0918C18.5905 5.71547 18.2842 5.40973 17.9079 5.21799C17.4801 5 16.9203 5 15.8002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>
        </a>
        <button name="replay" title="Again">
          <svg width="60px" height="60px" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 20.75C10.078 20.7474 8.23546 19.9827 6.8764 18.6236C5.51733 17.2645 4.75265 15.422 4.75 13.5C4.75 13.3011 4.82902 13.1103 4.96967 12.9697C5.11032 12.829 5.30109 12.75 5.5 12.75C5.69891 12.75 5.88968 12.829 6.03033 12.9697C6.17098 13.1103 6.25 13.3011 6.25 13.5C6.25 14.6372 6.58723 15.7489 7.21905 16.6945C7.85087 17.6401 8.74889 18.3771 9.79957 18.8123C10.8502 19.2475 12.0064 19.3614 13.1218 19.1395C14.2372 18.9177 15.2617 18.37 16.0659 17.5659C16.87 16.7617 17.4177 15.7372 17.6395 14.6218C17.8614 13.5064 17.7475 12.3502 17.3123 11.2996C16.8771 10.2489 16.1401 9.35087 15.1945 8.71905C14.2489 8.08723 13.1372 7.75 12 7.75H9.5C9.30109 7.75 9.11032 7.67098 8.96967 7.53033C8.82902 7.38968 8.75 7.19891 8.75 7C8.75 6.80109 8.82902 6.61032 8.96967 6.46967C9.11032 6.32902 9.30109 6.25 9.5 6.25H12C13.9228 6.25 15.7669 7.01384 17.1265 8.37348C18.4862 9.73311 19.25 11.5772 19.25 13.5C19.25 15.4228 18.4862 17.2669 17.1265 18.6265C15.7669 19.9862 13.9228 20.75 12 20.75Z" fill="#000000"/>
            <path d="M12 10.75C11.9015 10.7505 11.8038 10.7313 11.7128 10.6935C11.6218 10.6557 11.5392 10.6001 11.47 10.53L8.47 7.53003C8.32955 7.38941 8.25066 7.19878 8.25066 7.00003C8.25066 6.80128 8.32955 6.61066 8.47 6.47003L11.47 3.47003C11.5387 3.39634 11.6215 3.33724 11.7135 3.29625C11.8055 3.25526 11.9048 3.23322 12.0055 3.23144C12.1062 3.22966 12.2062 3.24819 12.2996 3.28591C12.393 3.32363 12.4778 3.37977 12.549 3.45099C12.6203 3.52221 12.6764 3.60705 12.7141 3.70043C12.7518 3.79382 12.7704 3.89385 12.7686 3.99455C12.7668 4.09526 12.7448 4.19457 12.7038 4.28657C12.6628 4.37857 12.6037 4.46137 12.53 4.53003L10.06 7.00003L12.53 9.47003C12.6704 9.61066 12.7493 9.80128 12.7493 10C12.7493 10.1988 12.6704 10.3894 12.53 10.53C12.4608 10.6001 12.3782 10.6557 12.2872 10.6935C12.1962 10.7313 12.0985 10.7505 12 10.75Z" fill="#000000"/>
          </svg>
        </button>
        <style>
          interval-timer-controls {
            /* Show/Hide animation */
            
            &[show] {
              animation: showContent 1s ease-out forwards;
            }

          }

          /* Hide buttons when not needed based on interval-timer state */
          interval-timer:not([state="finished"]) interval-timer-controls {
            [name="close"], [name="replay"] {
              display: none;
            }

            &:not([show]) {
              animation: hideContent 1s ease-in forwards;
            }
          }
          interval-timer[state="finished"] interval-timer-controls {
            [name="pause"], [name="play"], [name="next"], [name="prev"] {
              display: none;
            }

            margin-top: 4rem;
          }

          @keyframes hideContent {
            0% {
              opacity: 1;
              visibility: visible;
            }
            100% {
              opacity: 0;
              visibility: hidden;
            }
          }

          @keyframes showContent {
            0% {
              opacity: 0;
              visibility: hidden;
            }
            100% {
              opacity: 1;
              visibility: visible;
            }
          }
        </style>
      `;
    }
  }
);
