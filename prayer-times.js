const prayerTimesDiv = document.querySelector(".prayer-times");
const locationDiv = document.querySelector(".location");
const dateDiv = document.querySelector(".date");
const pageDiv = document.querySelector(".page");

locationDiv.addEventListener("click", function () {
  pageDiv.classList.toggle("dark-mode");
});

let slideIndex = 0;
let slides = document
  .getElementsByClassName("slideshow-container")[0]
  .getElementsByTagName("img");
setInterval(function () {
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.opacity = 0;
  }
  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }
  slides[slideIndex - 1].style.opacity = 1;
}, 3000);

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
    }

    locationHtml += `<p>${prayerTimes.lokacija}</p>`;

    dateDiv.innerHTML = `<p>${prayerTimes.datum[1]} / ${prayerTimes.datum[0]}</p>`;
    prayerTimesDiv.innerHTML = prayerTimesHtml;
    locationDiv.innerHTML = locationHtml;
  })
  .catch((error) => {
    prayerTimesDiv.innerHTML = `Error: ${error}`;
  });
