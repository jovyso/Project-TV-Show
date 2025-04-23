// You can edit ALL of the code here

const cache = {}; 

function setup() {
  const allEpisodes = getAllEpisodes();

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search episodes...";
  searchInput.id = "searchInput";

  const searchResultCount = document.createElement("p");
  searchResultCount.id = "searchResultCount";

  const episodeSelector = document.createElement("select");
  episodeSelector.id = "episodeSelector";


  const showSelector = document.createElement("select");
  showSelector.id = "showSelector";

 
  const defaultShowOption = document.createElement("option");
  defaultShowOption.value = "";
  defaultShowOption.textContent = "Select a Show";
  showSelector.appendChild(defaultShowOption);

  const defaultEpisodeOption = document.createElement("option");
  defaultEpisodeOption.value = "all";
  defaultEpisodeOption.textContent = "All Episodes";
  episodeSelector.appendChild(defaultEpisodeOption);

  const rootElem = document.getElementById("root");
  rootElem.before(showSelector, episodeSelector, searchInput, searchResultCount);

  fetchShows(showSelector);

  showSelector.addEventListener("change", () => {
    const selectedShowId = showSelector.value;
    if (selectedShowId) {
      fetchEpisodesForShow(selectedShowId);
    }
  });

  episodeSelector.addEventListener("change", () => {
    const selectedEpisodeId = episodeSelector.value;
    if (selectedEpisodeId === "all") {
      makePageForEpisodes(cache[`episodes_${showSelector.value}`]);
    } else {
      const selectedEpisode = cache[`episodes_${showSelector.value}`].find(
        (episode) => episode.id === parseInt(selectedEpisodeId)
      );
      makePageForEpisodes([selectedEpisode]);
    }
  });

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredEpisodes = cache[`episodes_${showSelector.value}`].filter(
      (episode) =>
        episode.name.toLowerCase().includes(searchTerm) ||
        episode.summary.toLowerCase().includes(searchTerm)
    );
    makePageForEpisodes(filteredEpisodes);
    searchResultCount.textContent = `${filteredEpisodes.length} / ${cache[`episodes_${showSelector.value}`].length} episodes found`;
  });

  makePageForEpisodes(allEpisodes);
  searchResultCount.textContent = `${allEpisodes.length} / ${allEpisodes.length} episodes found`;
}

function fetchShows(showSelector) {
  const showsUrl = "https://api.tvmaze.com/shows";

  if (cache[showsUrl]) {
    populateShowSelector(cache[showsUrl], showSelector);
    return;
  }

  fetch(showsUrl)
    .then((response) => response.json())
    .then((shows) => {
      cache[showsUrl] = shows;

      shows.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

      populateShowSelector(shows, showSelector);
    })
    .catch((error) => console.error("Error fetching shows:", error));
}

function populateShowSelector(shows, showSelector) {
  shows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id; 
    option.textContent = show.name;
    showSelector.appendChild(option);
  });
}
function fetchEpisodesForShow(showId) {
  const episodesUrl = `https://api.tvmaze.com/shows/${showId}/episodes`;

  if (cache[episodesUrl]) {
    populateEpisodeSelector(cache[episodesUrl]);
    makePageForEpisodes(cache[episodesUrl]);
    return;
  }

  fetch(episodesUrl)
    .then((response) => response.json())
    .then((episodes) => {
      cache[episodesUrl] = episodes;
      cache[`episodes_${showId}`] = episodes;

      populateEpisodeSelector(episodes);
      makePageForEpisodes(episodes);
    })
    .catch((error) => console.error("Error fetching episodes:", error));
}


function populateEpisodeSelector(episodes) {
  const episodeSelector = document.getElementById("episodeSelector");
  episodeSelector.innerHTML = ""; 

  const defaultOption = document.createElement("option");
  defaultOption.value = "all";
  defaultOption.textContent = "All Episodes";
  episodeSelector.appendChild(defaultOption);

  episodes.forEach((episode) => {
    const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(
      episode.number
    ).padStart(2, "0")}`;
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `${episodeCode} - ${episode.name}`;
    episodeSelector.appendChild(option);
  });
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
      <img src="${episode.image ? episode.image.medium : ""}" alt="${episode.name}">
      <h3>${episode.name} (${episodeCode})</h3>
      <p>${episode.summary || "No summary available."}</p>
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
