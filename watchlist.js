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
                        <button onclick="removeMovie" data-movie-id="${response.imdbID}"><i class="fa fa-minus-circle" aria-hidden="true"></i> remove</button>
                    </div>
                    <p>
                        ${response.Plot}
                    </p>
                </div>
            </div>`;
            welcomeMsg.style.display = "none";
            watchlist.innerHTML = likedMoviesHtml;
        }
    }
}
