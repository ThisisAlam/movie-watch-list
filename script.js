const searchBtn = document.getElementById('searchBtn')
const addMovieBtn = document.getElementById('add-btn')
const removeMovieBtn = document.getElementById('remove-btn')
const moviesDisplay = document.getElementById('movies')
const emptyState = document.getElementById('emptyState')


let newDataArray = []
let moviesArray = []
let selectedMovies = JSON.parse(localStorage.getItem("selectedMovies")) || [];


async function searchMovies(){
    const query = document.getElementById('searchInput').value.trim()
    
    // 1. Guard against empty input
    if (!query) { 
        emptyState.classList.remove('hidden'); 
        emptyState.innerHTML = `
        <h3 class="empty">Please enter a movie name</h3>`; 
        return; 
    }
    try{
        const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=162dd92f`)
        const data = await response.json()
        
        // 2. Handle API failure safely 
        if (data.Response !== "True") { 
            emptyState.classList.remove('hidden'); 
            
            emptyState.innerHTML = `
            <h3 class="empty">${data.Error}</h3>
            <h3 class="empty">No movies to display</h3>`
            
            moviesDisplay.innerHTML = ""
            return; 
        }

        // 3. Extract imdbIDs cleanly 
        const moviesInfo = data.Search.map(movie => movie.imdbID); 
        console.log(moviesInfo);

        // 4. Fetch full movie details 
        moviesArray = await filterMovies(moviesInfo); 
        renderMovies(moviesArray, moviesDisplay, "search");; 
        
        // 5. Hide empty state if successful 
        emptyState.classList.add('hidden');

    } catch (error) { 
        console.error(error); 
        emptyState.classList.remove('hidden'); 
        emptyState.innerHTML = `
        <h3 class="empty">Something went wrong</h3>`; 
    }
}

async function filterMovies(moviesInfo){
    let movies = []
    for (let movieId of moviesInfo){
        const response = await fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=162dd92f`)
        const data = await response.json()
        movies.push({
            "Title": data.Title, 
            "Rating": data.imdbRating,
            "Runtime": data.Runtime,
            "Genre": data.Genre,
            "Plot": data.Plot,
            "Poster":data.Poster,
            "Id": data.imdbID
        },)
    }
    return movies
}

function  renderMovies(moviesArray, container, mode = "search"){
    const display = moviesArray.map((movie) =>{
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
    }).join("")
    
    container.innerHTML = display
        
}

moviesDisplay.addEventListener("click", function (e) {
    e.preventDefault()
    if (e.target.classList.contains("add-btn")) {
        const movieId = e.target.dataset.id;
        console.log(movieId);
        const addMovie = moviesArray.find(movie => movie.Id === movieId)
        const exists = selectedMovies.some(movie => movie.Id === movieId);
        if (!exists) {
            selectedMovies.push(addMovie);
            localStorage.setItem("selectedMovies", JSON.stringify(selectedMovies));
        }
    }

})

watchlistContainer.addEventListener("click", function (e) {

    if (e.target.classList.contains("remove-btn")) {

        const movieId = e.target.dataset.id;

        selectedMovies = selectedMovies.filter(movie => movie.Id !== movieId);

        localStorage.setItem("selectedMovies", JSON.stringify(selectedMovies));

        renderMovies(selectedMovies, watchlistContainer, "watchlist"); // 🔥 re-render
    }
});

const watchlistContainer = document.getElementById("watchlist");
const watchlistBtn = document.getElementById('watchlist-btn')
const searchPageBtn = document.getElementById('search-page-btn')
const searchPage = document.getElementById('search-page')
const watchlistPage = document.getElementById('watchlist-page')

renderMovies(selectedMovies, watchlistContainer, "watchlist");

searchBtn.addEventListener('click', searchMovies)


watchlistBtn.addEventListener('click', function(e){
    e.preventDefault();

    searchPage.classList.add('hidden');
    watchlistPage.classList.remove('hidden');

    renderMovies(selectedMovies, watchlistContainer, "watchlist"); // 🔥 important
});

searchPageBtn.addEventListener('click', function(e){
    e.preventDefault()
    watchlistPage.classList.add('hidden')
    searchPage.classList.remove('hidden')
})