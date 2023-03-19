const prayerTimesDiv = document.querySelector(".prayer-times");
const locationDiv = document.querySelector(".location");
const dateDiv = document.querySelector(".date");
const pageDiv = document.querySelector(".page");
let prayerTimesArr = [];
const interval = 1000; // update the timer every second
const timerElement = document.querySelector(".timer"); // get the HTML element where you want to display the timer

locationDiv.addEventListener("click", function () {
  pageDiv.classList.toggle("dark-mode");
});

fetch("https://api.vaktija.ba/vaktija/v1/110")
  .then((response) => response.json())
  .then((data) => {
    const prayerTimes = data;
    const prayerNames = [
      "Zora",
      "Izlazak sunca",
      "Podne",
      "Ikindija",
      "Akšam",
      "Jacija",
    ];
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
    // prayerTimes.vakat[5] = "18:10";

    let prayerTimesHours = [];
    let prayerTimesMinutes = [];
    for (let i = 0; i < prayerTimes.vakat.length; i++) {
      prayerTimesHours.push(prayerTimes.vakat[i].split(":")[0]);
      prayerTimesMinutes.push(prayerTimes.vakat[i].split(":")[1]);
    }

    console.log(prayerTimesHours, prayerTimesMinutes);
    // let timer = 0;
    function updateTimer() {
      let diff = 0;
      let prayerIndex = 0;

      while (diff <= 0) {
        const targetTime = new Date();
        targetTime.setHours(prayerTimesHours[prayerIndex]);
        targetTime.setMinutes(prayerTimesMinutes[prayerIndex]);
        targetTime.setSeconds(0);
        const now = new Date();
        diff = targetTime - now;
        if (diff <= 0) prayerIndex++;
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
    }

    updateTimer();
    setInterval(updateTimer, interval);
  })
  .catch((error) => {
    prayerTimesDiv.innerHTML = `Error: ${error}`;
  });
