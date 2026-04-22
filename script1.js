import {selectedMovies} from '/script.js'


const watchList = document.getElementById('watchlist')


renderMovies(selectedMovies)

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
    
    watchList.innerHTML = display
    
}
