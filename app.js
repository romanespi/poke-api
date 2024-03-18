const d = document,
    $main = d.querySelector("main"),
    $links = d.querySelector(".links");

let urlAPI = "https://pokeapi.co/api/v2/pokemon/";

async function loadPokemons(url) {
    try {
        $main.innerHTML = `<img class="loader" src="assets/three-dots.svg" alt="Cargando...">`;
    } catch (err) {
        
    }
}

d.addEventListener("DOMContentLoaded", e => loadPokemons(urlAPI));