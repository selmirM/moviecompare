
const fetchData = async (searchTerm) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: 'd9835cc5',
            s: searchTerm
        }
    });
    // if no movie found
    if (response.data.Error) {
        return [];
    }

    return response.data.Search;
};

const root = document.querySelector('.autocomplete');
root.innerHTML = `
<label><b>Search For a Movie</b></label>
<input class="input"/>
<div class="dropdown">
    <div class="dropdown-menu">
        <div class="dropdown-content results"></div>
    </div>
</div>
`;
const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');

onInput = async event => {
    const movies = await fetchData(event.target.value);
    if (!movies.length) {
        dropdown.classList.remove('is-active');
        return;
    }
    resultsWrapper.innerHTML = '';
    dropdown.classList.add('is-active');
    for (let movie of movies) {
        const option = document.createElement('a');
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;

        option.classList.add('dropdown-item');
        option.innerHTML = `
        <img src="${imgSrc}" />
        ${movie.Title} (${movie.Year})
        `;
        option.addEventListener('click', (event) => {
            dropdown.classList.remove('is-active');
            input.value = movie.Title;
            // get movie info
            onMovieSelect(movie);
        });
        resultsWrapper.appendChild(option);
    }
};

input.addEventListener('input', debounce(onInput, 1000));
document.addEventListener('click', (e) => {
    if (!root.contains(event.target)) {
        dropdown.classList.remove('is-active');
    }
});

const onMovieSelect = async (movie) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: 'd9835cc5',
            i: movie.imdbID
        }
    });
    console.log(response);
}