const searchBtn = document.getElementById('searchBtn')
const moviesDisplay = document.getElementById('movies')
const emptyState = document.getElementById('emptyState')
const addMovieBtn = document.getElementById('add-btn')
const removeMovieBtn = document.getElementById('remove-btn')

let newDataArray = []
let moviesArray = []
let selectedMovies = []
async function searchMovies(){
    const query = document.getElementById('searchInput').value
    const response = await fetch(`http://www.omdbapi.com/?s=${query}&apikey=162dd92f`)
    const data = await response.json()
    newDataArray = data.Search
    let moviesInfo = []
    newDataArray.forEach((movie) => {
        moviesInfo.push(movie.imdbID)
    })
    
    console.log(moviesInfo)
    
    if(moviesInfo.length >= 1){
       moviesArray = await filterMovies(moviesInfo)
       renderMovies(moviesArray)
    } else{
        emptyState.classList.remove('hidden')
        emptyState.innerHTML =`
        <h3 class="empty">No movies to display</h3>`
    }
}

async function filterMovies(moviesInfo){
    let movies = []
    for (let movieId of moviesInfo){
        const response = await fetch(`http://www.omdbapi.com/?i=${movieId}&apikey=162dd92f`)
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

function  renderMovies(moviesArray){
    const display = moviesArray.map((movie) =>{
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
                        <button class="add-btn" data-id="${movie.Id}">+</button>
                        <span>Watchlist</span>
                    </div>
                </div>
                <div class="movie-description">
                    <p class="description">${movie.Plot}</p>
                </div>
            </div>
        </div>`
    }).join("")
    
    moviesDisplay.innerHTML = display
    
}

moviesDisplay.addEventListener("click", function (e) {
    e.preventDefault()
    if (e.target.classList.contains("add-btn")) {
        const movieId = e.target.dataset.id;
        console.log(movieId);
        const addMovie = moviesArray.find(movie => movie.Id === movieId)
        selectedMovies.push(addMovie)
        console.log(selectedMovies)
    }
});
searchBtn.addEventListener('click', searchMovies)

export {selectedMovies}


// addMovieBtn.addEventListener('click', function(){})
// removeMovieBtn.addEventListener('click', function(){})