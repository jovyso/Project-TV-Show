//You can edit ALL of the code here
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

  
  makePageForEpisodes(allEpisodes);
  searchResultCount.textContent = `${allEpisodes.length} / ${allEpisodes.length} episodes found`;
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
