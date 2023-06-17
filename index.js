const searchButton = document.getElementById("search-btn");
const movieName = document.getElementById("movie-name");
const moviesEl = document.getElementById("movies");
const welcomeMsg = document.getElementById("welcome-msg");
const loaderEl = document.getElementById("loader");

let savedMovies = [];

searchButton.addEventListener("click", async () => {
    searchButton.style.background = "#014f86";
    welcomeMsg.style.display = "none";
    loaderEl.innerHTML = `
    <div class="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
    `;
    const requestedMovie = movieName.value;
    const call = await fetch(
        `http://www.omdbapi.com/?apikey=262289ec&s=${requestedMovie}&type=movie&r=json`
    );
    const response = await call.json();
    if (response.Response === "False") {
        welcomeMsg.style.display = "block";
        welcomeMsg.innerHTML =
            "<h1>Unable to find your search Johanathan, Please try another search.</h1>";
        loaderEl.innerHTML = "";
    } else {
        let moviesData = response.Search;

        let htmlData = "";

        for (let movie in moviesData) {
            const call = await fetch(
                `http://www.omdbapi.com/?apikey=262289ec&i=${moviesData[movie].imdbID}`
            );

            const response = await call.json();
            const movieObject = Object.assign({}, response);
            const moviePoster =
                movieObject.Poster === "N/A"
                    ? "images/movie-poster-none.jpg"
                    : movieObject.Poster;
            htmlData += `
              <div class="movie-single">
              <img class="movie-poster" src="${moviePoster}" />
                <div class="movie-info">
                    <h3>${movieObject.Title} ⭐ ${movieObject.imdbRating}</h3>
                    <div class="movie-info-2">
                        <p>${movieObject.Runtime}</p>
                        <p>${movieObject.Genre}</p>
                        <button id="add-favourite" data-movie-id="${movieObject.imdbID}"><i class="fa fa-plus-circle" aria-hidden="true"></i> watchlist</button>
                    </div>
                    <p>
                        ${movieObject.Plot}
                    </p>
              </div>
              </div>`;
        }

        loaderEl.innerHTML = "";
        moviesEl.innerHTML = htmlData;
        searchButton.style.background = "#ef233c";
    }
});

document.addEventListener("click", (e) => {
    if (e.target.id === "add-favourite") {
        e.target.classList.add("toggle");
        savedMovies.push(e.target.dataset.movieId);
        localStorage.setItem("movies", JSON.stringify(savedMovies));
    }
});
