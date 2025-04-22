let allEpisodes = []; 

function setup() {
  const rootElem = document.getElementById("root");

  rootElem.innerHTML = "<p>Loading episodes...</p>";

  fetch("https://api.tvmaze.com/shows/82/episodes")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch episodes");
      }
      return response.json();
    })
    .then((data) => {
      allEpisodes = data; 
      makePageForEpisodes(allEpisodes);
      setupSearchAndFilter(allEpisodes);
    })
    .catch((error) => {
      rootElem.innerHTML = `<p>Error: ${error.message}. Please try again later.</p>`;
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
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search episodes...";
  searchInput.id = "searchInput";

  const searchResultCount = document.createElement("p");
  searchResultCount.id = "searchResultCount";

  const episodeSelector = document.createElement("select");
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

  const rootElem = document.getElementById("root");
  rootElem.before(searchInput, searchResultCount, episodeSelector);

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

  searchResultCount.textContent = `${allEpisodes.length} / ${allEpisodes.length} episodes found`;
}

window.onload = setup;
