//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = ""; 

  episodeList.forEach((episode) => {
    const episodeCard = document.createElement("div");
    episodeCard.className = "episode-card";

    const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(
      episode.number
    ).padStart(2, "0")}`;

    episodeCard.innerHTML = `
      <img src="${episode.image.medium}" alt="${episode.name}">
      <h3>${episode.name} (${episodeCode})</h3>
      <p>${episode.summary}</p>
      <a href="${episode.url}" target="_blank">View on TVMaze</a>
    `;

    rootElem.appendChild(episodeCard);
  });

  const attribution = document.createElement("p");
  attribution.innerHTML =
    'Data provided by <a href="https://tvmaze.com" target="_blank">TVMaze.com</a>';
  rootElem.appendChild(attribution);
}


window.onload = setup;
