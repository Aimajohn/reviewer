
const img = document.getElementById('imagenCool')
const loadButton = document.getElementById('botonLoad')
const stopButton = document.getElementById('botonStop')
let listMovies = document.getElementById('listMovies')

const KEY = '41f595b6e9a3306dcd645e1eab82f413'
const URL = 'https://api.themoviedb.org/3/'

async function getConfig(){
    try{
        const configURL = `${URL}configuration?api_key=${KEY}`
        const response = await fetch(configURL)
        const phrase = await response.json()
        return phrase
    }catch(error){console.log(error.message)}
}
async function getPoster(imgPath){
    try{
        const baseConfig = await getConfig()
        const imgBaseURL = await baseConfig.images.secure_base_url
        const imgURL = `${imgBaseURL}w154/${imgPath}`
        return imgURL
    }catch(error){console.log(error.message)}
}
async function searchShows(keyword){
    try{
        const urlCompleta = `${URL}search/tv?api_key=${KEY}&query=${keyword}`
        const response = await fetch(urlCompleta)
        const phrase = await response.json()
        return phrase.results
    }catch(error){console.log(error.message)}
}


async function renderShow(show){
    const poster = await getPoster(show.poster_path)
    const aMovie = document.createElement('li')
    aMovie.classList = 'moviePoster'
    aMovie.innerHTML = `
        <img src='${poster}'/>
        <h2 class='movieTitle'> ${show.name} </h2>
    `
    listMovies.appendChild(aMovie)
}
async function getShows(keyword, n){
    const results = await searchShows(keyword)
    const required = await results.slice(0,n)
    for(show of required){
        if(show.poster_path){
            renderShow(show)
        }
    }
}

function cargarImagen(){
    loadButton.innerText = 'Loading ...'
    loadButton.disabled = true
    stopButton.disabled = false
}
function detenerImagen(){
    loadButton.innerText = 'Cargar Imagen'
    loadButton.disabled = false
    stopButton.disabled = true
}

//Buscador
const searchBar = document.getElementById('searchBar')
const searchIcon = document.getElementById('searchIcon')


searchIcon.onclick = () => {
    while(listMovies.firstChild){
        listMovies.firstChild.remove()
    }
    getShows(searchBar.value, 5)
    
}
const fixMyLife = document.getElementById('fixMyLife')

searchBar.addEventListener('keyup', async function(event){
    if(event.key == 'Enter'){
        while(listMovies.firstChild){
            listMovies.firstChild.remove()
        }
        getShows(searchBar.value, 5)
    }
})

// Intersection Observer

const intersectionArticle = document.getElementById('intersectionArticle')

function handlerIntersection(entries){
    const moviesDiv = entries[0]
    if(moviesDiv.intersectionRatio <= 0.2){
        intersectionArticle.classList.add('intersectionShownActivator')
    }

}

const observer = new IntersectionObserver(handlerIntersection, {threshold: 0.2}) 

observer.observe(listMovies)

