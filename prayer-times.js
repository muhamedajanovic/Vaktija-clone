const prayerTimesDiv = document.querySelector(".prayer-times");
const locationDiv = document.querySelector(".location");
const dateDiv = document.querySelector(".date");
const pageDiv = document.querySelector(".page");
let prayerTimesArr = [];
const interval = 1000;
const timerElement = document.querySelector(".timer");
document
  .querySelector(".dark-mode-button")
  .addEventListener("click", function () {
    pageDiv.classList.toggle("dark-mode");
  });

function fetchPrayerTimes() {
  fetch("https://api.vaktija.ba/vaktija/v1/77")
    .then((response) => response.json())
    .then((data) => {
      const prayerTimes = data;
      function isWinterTime(date) {
        const januaryOffset = new Date(
          date.getFullYear(),
          0,
          1
        ).getTimezoneOffset();
        const juneOffset = new Date(
          date.getFullYear(),
          5,
          1
        ).getTimezoneOffset();
        return Math.max(januaryOffset, juneOffset) === date.getTimezoneOffset();
      }
      const danas = new Date();
      if (isWinterTime(danas)) {
        prayerTimes.vakat[2] = "12:00";
      } else {
        prayerTimes.vakat[2] = "13:00";
      }

      const prayerNames = [
        "Zora",
        "Izlazak sunca",
        "Podne",
        "Ikindija",
        "Akšam",
        "Jacija",
      ];

      if (prayerTimes.datum[1].split(",")[0] === "petak")
        prayerNames[2] = "Džuma";

      let prayerTimesHtml = "";
      let locationHtml = "";
      for (let i = 0; i < prayerTimes.vakat.length; i++) {
        prayerTimesHtml += `<div class='vakat'><p class='prayerName'>${prayerNames[i]}</p><p class='prayerTime'>${prayerTimes.vakat[i]}</p></div>`;
        prayerTimesArr.push(`${prayerTimes.vakat[i]}`);
      }

      locationHtml += `<p>${prayerTimes.lokacija}</p>`;

      dateDiv.innerHTML = `<p>${prayerTimes.datum[1]} / ${prayerTimes.datum[0]}</p>`;
      prayerTimesDiv.innerHTML = prayerTimesHtml;
      locationDiv.innerHTML = locationHtml;

      let prayerTimesHours = [];
      let prayerTimesMinutes = [];
      for (let i = 0; i < prayerTimes.vakat.length; i++) {
        prayerTimesHours.push(prayerTimes.vakat[i].split(":")[0]);
        prayerTimesMinutes.push(prayerTimes.vakat[i].split(":")[1]);
      }

      function updateTimer() {
        let diff = 0;
        let prayerIndex = 0;

        while (prayerIndex === 5 || diff <= 0) {
          const targetTime = new Date();
          targetTime.setHours(prayerTimesHours[prayerIndex]);
          targetTime.setMinutes(prayerTimesMinutes[prayerIndex]);
          targetTime.setSeconds(0);

          if (prayerIndex === 5 && diff <= 0) {
            targetTime.setDate(targetTime.getDate() + 1);
            prayerIndex = 0;
            targetTime.setHours(prayerTimesHours[prayerIndex]);
            targetTime.setMinutes(prayerTimesMinutes[prayerIndex]);
          }

          const now = new Date();
          diff = targetTime - now;

          if (diff <= 0) {
            prayerIndex++;
          }
        }

        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
          .toString()
          .padStart(2, "0");
        const minutes = Math.floor((diff / (1000 * 60)) % 60)
          .toString()
          .padStart(2, "0");
        const seconds = Math.floor((diff / 1000) % 60)
          .toString()
          .padStart(2, "0");
        timerElement.innerHTML = ` ${hours}:${minutes}:${seconds}`;

        const vremena = document.querySelectorAll(".prayerTime");
        for (let i = 0; i < vremena.length; i++) {
          vremena[i].style.color = "";
        }
        vremena[prayerIndex].style.color = "#a39572";
      }

      updateTimer();
      setInterval(updateTimer, interval);
    })
    .catch((error) => {
      prayerTimesDiv.innerHTML = `Error: ${error}`;
    });
}

fetchPrayerTimes();
const fetchInterval = 24 * 60 * 60 * 1000;
setInterval(fetchPrayerTimes, fetchInterval);
