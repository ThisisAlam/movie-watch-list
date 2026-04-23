const searchBtn = document.getElementById('searchBtn');
const moviesDisplay = document.getElementById('movies');
const emptyState = document.getElementById('emptyState');
const watchlistContainer = document.getElementById("watchlist");

const watchlistBtn = document.getElementById('watchlist-btn');
const searchPageBtn = document.getElementById('search-page-btn');
const searchPage = document.getElementById('search-page');
const watchlistPage = document.getElementById('watchlist-page');

let moviesArray = [];
let selectedMovies = JSON.parse(localStorage.getItem("selectedMovies")) || [];


// ================= SEARCH =================
async function searchMovies() {
    const query = document.getElementById('searchInput').value.trim();

    if (!query) {
        emptyState.classList.remove('hidden');
        emptyState.innerHTML = `<h3 class="empty">Please enter a movie name</h3>`;
        return;
    }

    try {
        const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=162dd92f`);
        const data = await response.json();

        if (data.Response !== "True") {
            emptyState.classList.remove('hidden');
            emptyState.innerHTML = `<h3 class="empty">${data.Error}</h3>`;
            moviesDisplay.innerHTML = "";
            return;
        }

        const moviesInfo = data.Search.map(movie => movie.imdbID);

        moviesArray = await filterMovies(moviesInfo);
        renderMovies(moviesArray, moviesDisplay, "search");

        emptyState.classList.add('hidden');

    } catch (error) {
        console.error(error);
        emptyState.classList.remove('hidden');
        emptyState.innerHTML = `<h3 class="empty">Something went wrong</h3>`;
    }
}


// ================= FETCH DETAILS =================
async function filterMovies(moviesInfo) {
    let movies = [];

    for (let movieId of moviesInfo) {
        const response = await fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=162dd92f`);
        const data = await response.json();

        movies.push({
            Title: data.Title,
            Rating: data.imdbRating,
            Runtime: data.Runtime,
            Genre: data.Genre,
            Plot: data.Plot,
            Poster: data.Poster,
            Id: data.imdbID
        });
    }

    return movies;
}


// ================= RENDER =================
function renderMovies(moviesArray, container, mode = "search") {

    const display = moviesArray.map((movie) => {

        const buttonHTML = mode === "search"
            ? `<button class="add-btn" data-id="${movie.Id}">+</button><span>Watchlist</span>`
            : `<button class="remove-btn" data-id="${movie.Id}">−</button><span>Remove</span>`;

        return `
        <div class="movie-container">
            <div class="movie-poster">
                <img src="${movie.Poster}" alt="Movie poster image">
            </div>
            <div class="movie-info-container">
                <div class="movie-title-rating">
                    <h3 class="movie-title">${movie.Title}</h3>
                    <p class="movie-rating">⭐ <span>${movie.Rating}</span></p>
                </div>
                <div class="movie-info-addBtn">
                    <p class="movie-length-min">${movie.Runtime}</p>
                    <p class="movie-genre">${movie.Genre}</p>
                    <div class="add-btn-container"> 
                        ${buttonHTML} 
                    </div>
                </div>
                <div class="movie-description">
                    <p class="description">${movie.Plot}</p>
                </div>
            </div>
        </div>`
    }).join("");

    container.innerHTML = display;
}


// ================= ADD MOVIE =================
moviesDisplay.addEventListener("click", function (e) {

    if (e.target.classList.contains("add-btn")) {

        const movieId = e.target.dataset.id;

        const addMovie = moviesArray.find(movie => movie.Id === movieId);

        const exists = selectedMovies.some(movie => movie.Id === movieId);

        if (!exists) {
            selectedMovies.push(addMovie);
            localStorage.setItem("selectedMovies", JSON.stringify(selectedMovies));
        }
    }
});


// ================= REMOVE MOVIE =================
watchlistContainer.addEventListener("click", function (e) {

    if (e.target.classList.contains("remove-btn")) {

        const movieId = e.target.dataset.id;

        selectedMovies = selectedMovies.filter(movie => movie.Id !== movieId);

        localStorage.setItem("selectedMovies", JSON.stringify(selectedMovies));

        renderMovies(selectedMovies, watchlistContainer, "watchlist");
    }
});


// ================= PAGE SWITCH =================
watchlistBtn.addEventListener('click', function (e) {
    e.preventDefault();

    searchPage.classList.add('hidden');
    watchlistPage.classList.remove('hidden');

    renderMovies(selectedMovies, watchlistContainer, "watchlist");
});

searchPageBtn.addEventListener('click', function (e) {
    e.preventDefault();

    watchlistPage.classList.add('hidden');
    searchPage.classList.remove('hidden');
});


// ================= INITIAL LOAD =================
renderMovies(selectedMovies, watchlistContainer, "watchlist");

searchBtn.addEventListener('click', searchMovies);
