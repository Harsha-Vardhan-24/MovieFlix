const watchlist = document.getElementById("watchlist");
const welcomeMsg = document.getElementById("welcome-msg");
let likedMoviesHtml = "";

window.onload = renderWatchList;

async function renderWatchList() {
    const moviesData = JSON.parse(localStorage.getItem("movies"));
    if (moviesData.length > 0) {
        for (let movie of moviesData) {
            const call = await fetch(
                `http://www.omdbapi.com/?apikey=262289ec&i=${movie}`
            );
            const response = await call.json();
            const moviePoster =
                response.Poster === "N/A"
                    ? "images/movie-poster-none.jpg"
                    : response.Poster;
            likedMoviesHtml += `
                <div class="movie-single">
                <img class="movie-poster" src="${moviePoster}" />
                <div class="movie-info">
                    <h3>${response.Title} ⭐ ${response.imdbRating}</h3>
                    <div class="movie-info-2">
                        <p>${response.Runtime}</p>
                        <p>${response.Genre}</p>
                        <button id="remove-favourite" data-movie-id="${response.imdbID}"><i class="fa fa-minus-circle" aria-hidden="true"></i> remove</button>
                    </div>
                    <p>
                        ${response.Plot}
                    </p>
                </div>
            </div>`;
            welcomeMsg.style.display = "none";
            watchlist.innerHTML = likedMoviesHtml;
        }
    } else if (moviesData.length === 0) {
        watchlist.innerHTML = `
        <div id="welcome-msg" class="welcome-msg">
                <h1>
                    Hmm... Your watchlist is looking a little empty. <br />
                    <i class="fa fa-plus-circle" aria-hidden="true"></i> Add
                    movies here
                </h1>
        </div>
        `;
    }
}

document.addEventListener("click", (e) => {
    if (e.target.id === "remove-favourite") {
        e.target.classList.add("toggle");
        const clickedMovie = e.target.dataset.movieId;
        const moviesData = JSON.parse(localStorage.getItem("movies"));

        if (moviesData.length > 0) {
            const returnedData = moviesData.filter(checkMovie);
            function checkMovie(movie) {
                if (movie !== clickedMovie) {
                    return movie;
                }
            }
            localStorage.setItem("movies", JSON.stringify(returnedData));
        } else if (moviesData.length === 0) {
            localStorage.clear();
        }
    }
    likedMoviesHtml = "";
    renderWatchList();
});
