const d = document,
    $main = d.querySelector("main"),
    $links = d.querySelector(".links");

let urlAPI = "https://pokeapi.co/api/v2/pokemon/";

// *********************************************** Función para cargar Pokémons ***********************************
async function loadPokemons(url) {
    try {
        $main.innerHTML = `<img class="loader" src="assets/three-dots.svg" alt="Cargando...">`;
    
        let res = await fetch(url),
        json = await res.json(),
        $template = "",
        $prevLink,
        $nextLink;

        console.log(json);

        if(!res.ok) throw { status: res.status, statusText: res.statusText }

//----------------------------------------------- Recorrer arreglo por cada Pokémon ----------------------------
        for (let i = 0; i < json.results.length; i++) {
            //console.log(json.results[i]);
            try {
                let res = await fetch(json.results[i].url),
                pokemon = await res.json();
                console.log(res, pokemon);

                if(!res.ok) throw { status: res.status, statusText: res.statusText }

                $template += `
                    <figure class="pokemon-card" data-pokemon="${json.results[i].url}">
                        <img class="pokemon-img" src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                        <figcaption>${pokemon.name} 🏴‍☠️ type: ${pokemon.types[0].type.name}</figcaption>
                    </figure>
                `;
//---------------------------------------------------- Capturar error por cada Pokémon -----------------------------
            } catch (err) {
                console.log(err);
                let message = err.statusText || "Ocurrio un error";
                $template += `
                    <figure>
                        <figcaption>Error ${err.status}: ${message}</figcaption>
                    </figure>
                `;
            }
//--------------------------------------------------- Pintamos en el HTML -----------------------
            $main.innerHTML = $template;
            $prevLink = json.previous ? `<a href="${json.previous}">◀️</a>` : "";
            $nextLink = json.next ? `<a href="${json.next}">▶️</a>` : "";
            $links.innerHTML = $prevLink + " " + $nextLink;
        }
        
//--------------------------------------------------- Captura error en el arreglo de Pokémons ------------------------
    } catch (err) {
        console.log(err);
        let message = err.statusText || "Ocurrio un error";
        $main.innerHTML = `<p>Error ${err.status}: ${message}</p>`;
    }
}

//******************************************************** Función para buscar Pokémon ************************************/
async function searchPokemons(url) {
    try {
        $main.innerHTML = `<img class="loader" src="assets/three-dots.svg" alt="Cargando...">`;
        let res = await fetch(url),
        $template = "",
        pokemon = await res.json();
        console.log(pokemon);

        if(!res.ok) throw { status: res.status, statusText: res.statusText }

        $template += `
            <figure class="pokemon-card" data-pokemon="${url}">
                <img class="pokemon-img" src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                <figcaption>${pokemon.name} 🏴‍☠️ type: ${pokemon.types[0].type.name}</figcaption>
            </figure>
        `;
        $main.innerHTML = $template;
        $links.innerHTML = `<a href="${urlAPI}">⚒️</a>`;

//--------------------------------- Captura de error en busqueda ---------------------------------/
    } catch (err) {
        console.log(err);
        let message = err.statusText || "Pokemon no encontrado en la base de datos!";
        $main.innerHTML = `<p class="error">Error ${err.status}: ${message}</p>`;
        $links.innerHTML = `<a href="${urlAPI}">⚒️</a>`;
    }
}

//******************************* Cargar pokémons al iniciar la página ***************************
d.addEventListener("DOMContentLoaded", e => loadPokemons(urlAPI));

//****************************** Evento click para paginación y modal ********************/
d.addEventListener("click", async e => {
//------------------------------ Evento para paginación ------------------------
    if(e.target.matches(".links a")){
        e.preventDefault();
        loadPokemons(e.target.getAttribute("href"));
    }
//----------------------------- Evento para modal -------------------------------
    if (e.target.matches(".pokemon-card, .pokemon-card *")) {
        let $card = e.target.closest(".pokemon-card");
        if ($card) {
            //console.log($card.dataset.pokemon);
            let apiURL = $card.dataset.pokemon;
            let res = await fetch(apiURL);
//----------------------------- Captura de error --------------------------
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            } else {
//------------------------------ Agregar caracteristas del pokémon al modal ------------
                let pokemon = await res.json(),
                    $modal = d.getElementById("modal"),
                    abilities = pokemon.abilities.map(ability => `<li>⚔️ ${ability.ability.name}</li>`).join(''),
                    $template = `
                        <div class="modal-content">
                            <h2>${pokemon.name}</h2>
                            <img class="pokemon-img-modal" src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                            <p>Type: ${pokemon.types[0].type.name}</p>
                            <p>Abilities: 
                                <ul>
                                    ${abilities}
                                </ul>
                            </p>
                            <!-- Aquí puedes agregar más características del Pokémon -->
                        </div>
                    `;
                $modal.innerHTML = $template;
                $modal.style.display = "block"; 
            }
        }
    }
});

//******************************** Evento click para cerrar modal ***********************
window.onclick = function(event) {
    let $modal = d.querySelector("#modal");
    if (event.target == $modal) {
        $modal.style.display = "none";
    }
}

//********************************* Evento click para buscar Pokémons  ****************/
d.addEventListener("keypress", async e =>{
    if (e.target.matches("#search")) {
        if (e.key === "Enter") {
            let query = e.target.value.toLowerCase();
            searchPokemons(`${urlAPI}${query}`);
        }
    }
});
