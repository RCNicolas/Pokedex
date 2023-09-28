import { cargarPokemonPorDefecto, mostrarPokemon } from "./api.js";
import { request } from "./request.js";

document.addEventListener("DOMContentLoaded", cargarPokemonPorDefecto);

// Agregar un evento de clic al botón "Todos"
document
  .querySelector("#cargarTodos")
  .addEventListener("click", cargarPokemonPorDefecto);

  // Agregar un evento de clic al botón "Mostrar Pokémon"
document
.querySelector("#mostrarPokemon")
.addEventListener("click", async () => {
  const offset = document.querySelector("#offset").value - 1;
  const limit = document.querySelector("#limit").value;

  // Realizar una solicitud a la API de Pokémon usando la función request
  const data = await request(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
  );
  const pokemons = data.results;
  listaPokemon.innerHTML = "";
  // Iterar a través de la lista de Pokémon y mostrarlos
  for (const pokemon of pokemons) {
    const pokemonData = await request(pokemon.url);
    mostrarPokemon(pokemonData)
  }
});