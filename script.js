let allEpisodes = [];
let allShows = [];

function fetchAndDisplayShows() {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "<p>Loading shows...</p>";

  fetch("https://api.tvmaze.com/shows")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch shows");
      }
      return response.json();
    })
    .then((shows) => {
      allShows = shows.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      displayShows(allShows);
    })
    .catch((error) => {
      rootElem.innerHTML = `<p>Error: ${error.message}. Please try again later.</p>`;
    });
}

function displayShows(shows) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = ""; 

  let showSearchInput = document.getElementById("showSearchInput");
  if (!showSearchInput) {
    showSearchInput = document.createElement("input");
    showSearchInput.type = "text";
    showSearchInput.placeholder = "Search shows...";
    showSearchInput.id = "showSearchInput";

    rootElem.before(showSearchInput);

    showSearchInput.addEventListener("input", () => {
      const searchTerm = showSearchInput.value.toLowerCase();
      const filteredShows = shows.filter(
        (show) =>
          show.name.toLowerCase().includes(searchTerm) ||
          show.genres.join(", ").toLowerCase().includes(searchTerm) ||
          show.summary.toLowerCase().includes(searchTerm)
      );
      displayShows(filteredShows); 
    });
  }

  shows.forEach((show) => {
    const showCard = document.createElement("div");
    showCard.className = "show-card";

    showCard.innerHTML = `
      <img src="${show.image?.medium || "placeholder.jpg"}" alt="${show.name}">
      <h3>${show.name}</h3>
      <p><strong>Genres:</strong> ${show.genres.join(", ")}</p>
      <p><strong>Status:</strong> ${show.status}</p>
      <p><strong>Rating:</strong> ${show.rating.average || "N/A"}</p>
      <p><strong>Runtime:</strong> ${show.runtime || "N/A"} minutes</p>
      <p>${show.summary || "No summary available."}</p>
    `;

    showCard.addEventListener("click", () => {
      fetchEpisodesForShow(show.id);
    });

    rootElem.appendChild(showCard);
  });
}

function fetchEpisodesForShow(showId) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "<p>Loading episodes...</p>";

  fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch episodes");
      }
      return response.json();
    })
    .then((episodes) => {
      allEpisodes = episodes;
      makePageForEpisodes(allEpisodes);
      setupSearchAndFilter(allEpisodes);
      addBackToShowsButton();
    })
    .catch((error) => {
      rootElem.innerHTML = `<p>Error: ${error.message}. Please try again later.</p>`;
    });
}

function addBackToShowsButton() {
  const rootElem = document.getElementById("root");
  const backButton = document.createElement("button");
  backButton.textContent = "Back to Shows";
  backButton.addEventListener("click", () => {
    displayShows(allShows);
  });
  rootElem.prepend(backButton);
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
      <img src="${episode.image?.medium || "placeholder.jpg"}" alt="${episode.name}">
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

function setupSearchAndFilter(allEpisodes) {
  let searchInput = document.getElementById("searchInput");
  let searchResultCount = document.getElementById("searchResultCount");
  let episodeSelector = document.getElementById("episodeSelector");

  if (!searchInput) {
    searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Search episodes...";
    searchInput.id = "searchInput";
    document.body.prepend(searchInput); 
  }

  if (!searchResultCount) {
    searchResultCount = document.createElement("p");
    searchResultCount.id = "searchResultCount";
    document.body.prepend(searchResultCount); 
  }

  if (!episodeSelector) {
    episodeSelector = document.createElement("select");
    episodeSelector.id = "episodeSelector";

    const defaultOption = document.createElement("option");
    defaultOption.value = "all";
    defaultOption.textContent = "All Episodes";
    episodeSelector.appendChild(defaultOption);

    allEpisodes.forEach((episode) => {
      const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(
        episode.number
      ).padStart(2, "0")}`;
      const option = document.createElement("option");
      option.value = episode.id;
      option.textContent = `${episodeCode} - ${episode.name}`;
      episodeSelector.appendChild(option);
    });

    document.body.prepend(episodeSelector); 
  }

  episodeSelector.addEventListener("change", () => {
    const selectedEpisodeId = episodeSelector.value;
    if (selectedEpisodeId === "all") {
      makePageForEpisodes(allEpisodes);
    } else {
      const selectedEpisode = allEpisodes.find(
        (episode) => episode.id === parseInt(selectedEpisodeId)
      );
      makePageForEpisodes([selectedEpisode]);
    }
  });

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredEpisodes = allEpisodes.filter(
      (episode) =>
        episode.name.toLowerCase().includes(searchTerm) ||
        episode.summary.toLowerCase().includes(searchTerm)
    );
    makePageForEpisodes(filteredEpisodes);
    searchResultCount.textContent = `${filteredEpisodes.length} / ${allEpisodes.length} episodes found`;
  });

  searchResultCount.textContent = `${allEpisodes.length} / ${allEpisodes.length} episodes found`;
}

function setup() {
  fetchAndDisplayShows();
}

window.onload = setup;
