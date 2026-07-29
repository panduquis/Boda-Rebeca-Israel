(() => {
  "use strict";

  // 24 de octubre de 2026, 6:00 p.m., hora de Atlixco/Puebla.
  const weddingDate = new Date("2026-10-24T18:00:00-06:00");

  const elements = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds")
  };

  const pad = (value, digits = 2) => String(value).padStart(digits, "0");

  function updateCountdown() {
    const difference = weddingDate.getTime() - Date.now();

    if (difference <= 0) {
      elements.days.textContent = "000";
      elements.hours.textContent = "00";
      elements.minutes.textContent = "00";
      elements.seconds.textContent = "00";
      return;
    }

    const totalSeconds = Math.floor(difference / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    elements.days.textContent = pad(days, 3);
    elements.hours.textContent = pad(hours);
    elements.minutes.textContent = pad(minutes);
    elements.seconds.textContent = pad(seconds);
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const revealElements = document.querySelectorAll(".reveal");

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach((element) => observer.observe(element));
  }
  const storyMusic = document.getElementById("storyMusic");
const storyMusicButton = document.getElementById("storyMusicButton");
const storyMusicStatus = document.getElementById("storyMusicStatus");

let storyMusicWasPlayed = false;

if (storyMusic && storyMusicButton && storyMusicStatus) {
  storyMusicButton.addEventListener("click", async () => {
    if (storyMusicWasPlayed) {
      return;
    }

    try {
      storyMusic.currentTime = 0;

      await storyMusic.play();

      storyMusicWasPlayed = true;
      storyMusicButton.disabled = true;
      storyMusicButton.classList.add("is-playing");
      storyMusicButton.innerHTML =
        '<span aria-hidden="true">♪</span> Reproduciendo…';

      storyMusicStatus.textContent =
        "Escuchando una canción que forma parte de nuestra historia";
    } catch (error) {
      console.error("Error al reproducir el audio:", error);

      storyMusicButton.disabled = false;
      storyMusicButton.classList.remove("is-playing");
      storyMusicButton.innerHTML =
        '<span aria-hidden="true">♫</span> Escuchar nuestra canción';

      storyMusicStatus.textContent =
        "No fue posible reproducir el audio. Intenta nuevamente.";
    }
  });

  storyMusic.addEventListener("ended", () => {
    storyMusicButton.classList.remove("is-playing");
    storyMusicButton.innerHTML =
      '<span aria-hidden="true">♡</span> Gracias por escuchar';

    storyMusicStatus.textContent =
      "Una canción que forma parte de nuestra historia";
  });

  storyMusic.addEventListener("error", () => {
    storyMusicButton.disabled = false;
    storyMusicButton.innerHTML =
      '<span aria-hidden="true">♫</span> Audio no disponible';

    storyMusicStatus.textContent =
      "Revisa que nuestra-cancion.mp3 esté correctamente publicado.";
  });
}

})();
