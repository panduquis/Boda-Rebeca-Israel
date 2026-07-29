(() => {
  "use strict";

  function initializeWeddingPage() {
    /*
     * CUENTA REGRESIVA
     * 24 de octubre de 2026, 6:00 p.m., hora de Puebla.
     */
    const weddingDate = new Date("2026-10-24T18:00:00-06:00");

    const countdownElements = {
      days: document.getElementById("days"),
      hours: document.getElementById("hours"),
      minutes: document.getElementById("minutes"),
      seconds: document.getElementById("seconds")
    };

    const countdownExists = Object.values(countdownElements).every(Boolean);

    const pad = (value, digits = 2) =>
      String(value).padStart(digits, "0");

    function updateCountdown() {
      if (!countdownExists) {
        return;
      }

      const difference = weddingDate.getTime() - Date.now();

      if (difference <= 0) {
        countdownElements.days.textContent = "000";
        countdownElements.hours.textContent = "00";
        countdownElements.minutes.textContent = "00";
        countdownElements.seconds.textContent = "00";
        return;
      }

      const totalSeconds = Math.floor(difference / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      countdownElements.days.textContent = pad(days, 3);
      countdownElements.hours.textContent = pad(hours);
      countdownElements.minutes.textContent = pad(minutes);
      countdownElements.seconds.textContent = pad(seconds);
    }

    if (countdownExists) {
      updateCountdown();
      window.setInterval(updateCountdown, 1000);
    }

    /*
     * ANIMACIONES AL DESPLAZARSE
     */
    const revealElements = Array.from(
      document.querySelectorAll(".reveal")
    );

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
      reducedMotion ||
      !("IntersectionObserver" in window)
    ) {
      revealElements.forEach((element) => {
        element.classList.add("is-visible");
      });
    } else {
      const observer = new IntersectionObserver(
        (entries, currentObserver) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
          });
        },
        {
          threshold: 0.08,
          rootMargin: "0px 0px -30px 0px"
        }
      );

      revealElements.forEach((element) => {
        /*
         * Dejamos visibles inmediatamente los elementos
         * que ya están dentro de la primera pantalla.
         */
        const position = element.getBoundingClientRect();

        if (position.top < window.innerHeight * 0.95) {
          element.classList.add("is-visible");
        }

        observer.observe(element);
      });

      /*
       * La clase se agrega después de configurar todo.
       * Si JavaScript falla antes, el contenido seguirá visible.
       */
      document.documentElement.classList.add(
        "animations-enabled"
      );
    }

    /*
     * MÚSICA DE NUESTRA HISTORIA
     */
    const storyMusic =
      document.getElementById("storyMusic");

    const storyMusicButton =
      document.getElementById("storyMusicButton");

    const storyMusicStatus =
      document.getElementById("storyMusicStatus");

    let storyMusicWasPlayed = false;

    if (
      storyMusic &&
      storyMusicButton &&
      storyMusicStatus
    ) {
      storyMusicButton.addEventListener(
        "click",
        async () => {
          if (storyMusicWasPlayed) {
            return;
          }

          try {
            storyMusic.currentTime = 0;

            /*
             * play() debe ejecutarse directamente después
             * de que el visitante toque el botón.
             */
            await storyMusic.play();

            storyMusicWasPlayed = true;
            storyMusicButton.disabled = true;
            storyMusicButton.classList.add("is-playing");

            storyMusicButton.innerHTML =
              '<span aria-hidden="true">♪</span> Reproduciendo…';

            storyMusicStatus.textContent =
              "Escuchando una canción que forma parte de nuestra historia";
          } catch (error) {
            console.error(
              "Error al reproducir el audio:",
              error
            );

            storyMusicWasPlayed = false;
            storyMusicButton.disabled = false;
            storyMusicButton.classList.remove(
              "is-playing"
            );

            storyMusicButton.innerHTML =
              '<span aria-hidden="true">♫</span> Escuchar nuestra canción';

            storyMusicStatus.textContent =
              "No fue posible reproducir el audio. Intenta nuevamente.";
          }
        }
      );

      storyMusic.addEventListener("ended", () => {
        storyMusicButton.classList.remove(
          "is-playing"
        );

        storyMusicButton.innerHTML =
          '<span aria-hidden="true">♡</span> Gracias por escuchar';

        storyMusicStatus.textContent =
          "Una canción que forma parte de nuestra historia";
      });

      storyMusic.addEventListener("error", () => {
        storyMusicWasPlayed = false;
        storyMusicButton.disabled = false;

        storyMusicButton.innerHTML =
          '<span aria-hidden="true">♫</span> Audio no disponible';

        storyMusicStatus.textContent =
          "No fue posible cargar nuestra canción.";
      });
    }
  }

  /*
   * Esperamos a que todo el HTML esté cargado.
   */
  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeWeddingPage
    );
  } else {
    initializeWeddingPage();
  }
})();
