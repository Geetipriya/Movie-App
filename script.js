const apiKey = "47bfdff8"; // Replace with your OMDb API key
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const movieResults = document.getElementById("movieResults");
const favoritesDiv = document.getElementById("favorites");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Display favorites on load
window.onload = () => {
  displayFavorites();
};

searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (!query) return alert("Enter a movie name");
  fetch(`https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      if (data.Response === "True") {
        displayMovies(data.Search, movieResults);
      } else {
        movieResults.innerHTML = "No results found";
      }
    });
});

function displayMovies(movies, container) {
  container.innerHTML = "";
  movies.forEach(movie => {
    const div = document.createElement("div");
    div.className = "movie-card";
    div.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/150'}" alt="${movie.Title}">
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
      <button onclick="addFavorite('${movie.imdbID}')">Add to Favorites</button>
    `;
    container.appendChild(div);
  });
}

function addFavorite(id) {
  fetch(`https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`)
    .then(res => res.json())
    .then(movie => {
      if (!favorites.some(fav => fav.imdbID === movie.imdbID)) {
        favorites.push(movie);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        displayFavorites();
      } else {
        alert("Already in favorites");
      }
    });
}

function displayFavorites() {
  favoritesDiv.innerHTML = "";
  favorites.forEach(movie => {
    const div = document.createElement("div");
    div.className = "movie-card";
    div.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/150'}" alt="${movie.Title}">
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
      <button onclick="removeFavorite('${movie.imdbID}')">Remove</button>
    `;
    favoritesDiv.appendChild(div);
  });
}

function removeFavorite(id) {
  favorites = favorites.filter(movie => movie.imdbID !== id);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  displayFavorites();
}