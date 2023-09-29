import { request } from "./request.js";

const listaPokemon = document.querySelector("#listaPokemon");

// URL de mockApi
const apiURL = "https://6509d051f6553137159c10d2.mockapi.io/PokemonAPI";

// Función para buscar un Pokémon en la API por nombre
async function buscarPokemonEnAPI(name) {
  try {
    const apiUrl = `${apiURL}?name=${name}`;
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      // Verificar si se encontró un Pokémon con el nombre
      if (data && data.length > 0) {
        return {
          idPokemon: data[0].idPokemon,
          name: data[0].name,
        };
      } else {
        // Si no se encontró ningún Pokémon con ese nombre, retorna false
        return false;
      }
    } else {
      console.error("Error al buscar el Pokémon en la API.");
      return false;
    }
  } catch (error) {
    console.error("Error al buscar el Pokémon en la API:", error);
    return false;
  }
}

// Función para crear o actualizar un Pokémon en la mockApi
async function createOrUpdatePokemon(poke) {
  try {
    const existingPokemon = await buscarPokemonEnAPI(poke.name);

    if (existingPokemon) {
      // Si el Pokémon ya existe, actualiza los datos usando una solicitud PUT
      const apiUrl = `${apiURL}/${existingPokemon.idPokemon}`;
      const putResponse = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(poke),
      });

      if (putResponse.ok) {
        Swal.fire({
          icon: "success",
          html: /*html*/ `<div class="actualizarPoke">
          Pokémon ${poke.name} actualizado con éxito en la API mock
          </div>`,
          showConfirmButton: false,
          timer: 1500,
          background: "#161616",
        });

        // Después de actualizar el Pokémon, vuelve a cargar todos los Pokémon
        cargarPokemonPorDefecto();
      } else {
        Swal.fire({
          icon: "error",
          title: "Problema al actualizar los datos",
          showConfirmButton: false,
          timer: 1500,
          background: "#161616",
        });
      }
    } else {
      // Si el Pokémon no existe, se crea usando la solicitud POST
      const postResponse = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(poke),
      });

      if (postResponse.ok) {
        Swal.fire({
          icon: "success",
          html: /*html*/ `<div class="actualizarPoke">
          Pokémon ${poke.name} creado con éxito en la API mock
          </div>`,
          showConfirmButton: false,
          timer: 1500,
          background: "#161616",
        });

        // Después de crear el Pokémon, vuelve a cargar todos los Pokémon
        cargarPokemonPorDefecto();
      } else {
        Swal.fire({
          icon: "error",
          title: "Problema al guardar los datos",
          showConfirmButton: false,
          timer: 1500,
          background: "#161616",
        });
      }
    }
  } catch (error) {
    console.error("Error al enviar datos:", error);
  }
}


export const cargarPokemonPorDefecto = async () => {
  const limit = 18;

  // Obtener todos los Pokémon de mockapki
  const responsePersonalizada = await fetch(apiURL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  let pokemonsPersonalizados = [];
  if (responsePersonalizada.ok) {
    pokemonsPersonalizados = await responsePersonalizada.json();
  }

  // Obtener los Pokémon de PokeAPI
  const data = await request(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}`
  );
  const pokemonsPokeAPI = data.results;

  // Crear una lista combinada de todos los Pokémon
  const allPokemons = [];

  // Agregar Pokémon de mockapi
  for (const pokePersonalizado of pokemonsPersonalizados) {
    allPokemons.push(pokePersonalizado);
  }

  // Agregar Pokémon de PokeAPI si no están en la lista
  for (const pokePokeAPI of pokemonsPokeAPI) {
    const pokemonName = pokePokeAPI.name;
    const existeEnPersonalizada = pokemonsPersonalizados.some(
      (poke) => poke.name === pokemonName
    );

    if (!existeEnPersonalizada) {
      allPokemons.push({
        idPokemon: null, 
        name: pokemonName,
      });
    }
  }

  // Iterar a través de la lista de todos los Pokémon y mostrarlos o agregarlos
  listaPokemon.innerHTML = "";

  for (const pokemon of allPokemons) {
    if (pokemon.idPokemon) {
      // Si el Pokémon tiene un ID personalizado, se muestra
      mostrarPokemon(pokemon);
    } else {
      // Si el Pokémon no tiene un ID personalizado,se obtine los datos de PokeAPI
      const pokeDataPokeAPI = await request(
        `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
      );
      mostrarPokemon(pokeDataPokeAPI);
    }
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

    const contenedorHtml = document.querySelector(".pokeStat");

    contenedorHtml
      .querySelector("form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        // Obtener los valores de las estadísticas editadas
        const statsData = poke.stats.map((stat) => ({
          stat: { name: stat.stat.name },
          base_stat: parseInt(formData.get(stat.stat.name)),
        }));

        // Crear un objeto con la misma estructura que la pokeApi para guardarlo en la mockApi
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

        // Llama a la función para crear o actualizar el Pokémon
        createOrUpdatePokemon(editedPokemonData);
      });

    contenedorHtml.addEventListener("input", (e) => {
      let myLabelStat = e.target.nextElementSibling;
      myLabelStat.innerHTML = `<b>${e.target.value}</b> ${myLabelStat.dataset.name}`;
    });
  });
};
