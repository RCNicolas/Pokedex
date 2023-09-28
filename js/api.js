import { request } from "./request.js";
// import { mostrarTarjetaSwal } from "./swal.js";

const listaPokemon = document.querySelector("#listaPokemon");

export const cargarPokemonPorDefecto = async () => {
  const limit = 102;
  const data = await request(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}`
  );
  const pokemons = data.results;
  listaPokemon.innerHTML = "";

  // Iterar a través de la lista de Pokémon y mostrarlos
  for (const pokemon of pokemons) {
    const pokemonData = await request(pokemon.url);

    // Asegúrate de que pokemonData tenga la propiedad 'sprites'
    if (!pokemonData.sprites) {
      pokemonData.sprites = { other: { "official-artwork": { front_default: "" } } };
    }

    mostrarPokemon(pokemonData);
  }
};

export const mostrarPokemon = async (poke) => {
  let tipos = poke.types.map(
    (type) => `<p class="tipo ${type.type.name}">${type.type.name}</p>`
  );
  tipos = tipos.join("");
  let pokeId = poke.id.toString();

  // Ajustar el formato del ID
  if (pokeId.length === 1) {
    pokeId = "00" + pokeId;
  } else if (pokeId.length === 2) {
    pokeId = "0" + pokeId;
  }
  // Crear un elemento div para mostrar el Pokémon
  const div = document.createElement("div");
  div.classList.add("pokemon");
  let img = poke.sprites.other["official-artwork"].front_default;
  let defaultImg = "Img/Pokeball.png";

  // Crear la estructura HTML para mostrar el Pokémon
  div.innerHTML = `
        <div class="pokemon-info">
            <div class="pokemon-imagen">
                <img src="${img ? img : defaultImg}" alt="${poke.name}">
            </div>
            <div class="nombre-contenedor">
                <h2 class="pokemon-nombre">${poke.name}</h2>
                <h2 class="exp"> EXP ${poke.base_experience}</h2>
            </div>
        </div>
    `;
  // Agregar el elemento a la lista de Pokémon
  listaPokemon.append(div);
  // Creo el evento de dar clik al div que contiene el pokemon para mostar la tarjeta
  // mostrarTarjetaSwal(poke);
  div.addEventListener("click", async () => {
    let img = poke.sprites.other["official-artwork"].front_default;
    let defaultImg = "../Img/Pokeball.png";

    Swal.fire({
      html: /*html*/ `
              <div class="contenedor-swal"> 
                <div class="cont-imagen-Swal">
                  <img class="imagen-Swal" 
                    src="${img ? img : defaultImg}" 
                    alt="${poke.name}">
                </div>
                <p class="pokemon-id">#${pokeId}</p> 
                <p class="nombre-alert">${poke.name}</p>
                <div class="tipos-alert" style="text-align: center;">
                  ${tipos}
                </div>
                <div class="pokeStat">
                  <form>${poke.stats
                    .map(
                      (data) => /*html */ `
                    <div class="stat-bar-container">
                      <div class="stat-bar">
                        <input 
                          type="range" 
                          value ="${data.base_stat}"
                          name="${data.stat.name}" max="260"/>
                          <label data-name="${data.stat.name}">
                            <b>${data.base_stat}</b>
                            ${data.stat.name}
                          </label>
                      </div>
                    </div>`
                    )
                    .join("")}
          
                    <input type="submit" value="Guardar Edición"/>
                  </form>
                </div>
              </div>`,
      width: "auto",
      height: "auto",
      background: "transparent",
      padding: "0rem",
      margin: "0rem",
      showConfirmButton: false,
    });

    // Agrega el evento al formulario
    let contenedorHtml = document.querySelector(".pokeStat");
    contenedorHtml
      .querySelector("form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        // Obtén los valores de las estadísticas editadas
        const statsData = poke.stats.map((stat) => ({
          stat: { name: stat.stat.name },
          base_stat: parseInt(formData.get(stat.stat.name)),
        }));

        // Crea un objeto con la misma estructura que la API de Pokémon
        const editedPokemonData = {
          idPokemon: poke.id,
          name: poke.name,
          base_experience: poke.base_experience,
          types: poke.types,
          sprites: {
            other: {
              "official-artwork": {
                front_default:
                  poke.sprites.other["official-artwork"].front_default,
              },
            },
          },
          stats: statsData,
        };

        // Aquí debes hacer una solicitud POST a tu API para guardar los datos
        const apiUrl = "https://6509d051f6553137159c10d2.mockapi.io/PokemonAPI"; // Reemplaza con la URL de tu API
        try {
          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(editedPokemonData), // Envía los datos en formato JSON
          });

          if (response.ok) {
            Swal.fire({
              icon: "success",
              title: "Datos guardados correctamente",
              showConfirmButton: false,
              timer: 1500,
              background: "#161616",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Problema al guardar los datos",
              showConfirmButton: false,
              timer: 1500,
              background: "#161616",
            });
          }
        } catch (error) {
          console.error("Error al enviar datos:", error);
          Swal.fire("Error", "Hubo un problema al guardar los datos", "error");
        }
      });

    contenedorHtml.addEventListener("input", (e) => {
      let myLabelStat = e.target.nextElementSibling;
      myLabelStat.innerHTML = `<b>${e.target.value}</b> ${myLabelStat.dataset.name}`;
    });
  });
};
