const listaPokemon = document.querySelector("#listaPokemon");
const URl = "https://pokeapi.co/api/v2/pokemon/";
const botonesHearder = document.querySelectorAll(".btn-header");

for (let i = 1; i <= 1292; i++) {
  fetch(URl + i)
    .then((response) => response.json())
    .then((data) => mostrarPokemon(data));
}

function mostrarPokemon(poke) {
  let tipos = poke.types.map(
    (type) =>
      `<p class="tipo ${type.type.name}">${type.type.name}</p>
  `
  );
  tipos = tipos.join("");

  let pokeId = poke.id.toString();
  if (pokeId.length === 1) {
    pokeId = "00" + pokeId;
  } else if (pokeId.length === 2) {
    pokeId = "0" + pokeId;
  }
  const div = document.createElement("div");
  div.classList.add("pokemon");
  div.innerHTML = `
    <p class="pokemon-id-back">#${pokeId}</p>
    <div class="pokemon-imagen">
        <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
    </div>
    <div class="pokemon-info">
        <div class="nombre-contenedor">
            <p class="pokemon-id">#${pokeId}</p>
            <h2 class="pokemon-nombre">${poke.name}</h2>
        </div>
        <div class="pokemon-tipos">
            ${tipos}
        </div>
    </div>
  `;
  listaPokemon.append(div);

  //! Agrega el event listener dentro de la función mostrarPokemon
  div.addEventListener("click", async () => {
    console.log("Evento pokemoooon");
    // let res = await (
    //   await fetch("https://pokeapi.co/api/v2/pokemon/greninja")
    // ).json();

    let img = poke.sprites.other["official-artwork"].front_default;
    let defaultImg =
      "https://i.pinimg.com/originals/27/ae/5f/27ae5f34f585523fc884c2d479731e16.gif";

    Swal.fire({
      title: `${poke.name}`,
      text: "Modal with a custom image.",
      imageUrl: `${img ? img : defaultImg}`,
      html: `
        ${poke.stats
          .map(
            (data) => `
              <input
                type="range"
                value="${data.base_stat}">
              <label>
                <b>${data.base_stat}</b>
                ${data.stat.name}</label><br>
            `
          )
          .join("")}`,
      imageWidth: "80%",
      imageHeight: "80%",
      imageAlt: "Custom image",
    });
  });
}

botonesHearder.forEach((boton) =>
  boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id;

    listaPokemon.innerHTML = "";

    for (let i = 1; i <= 1292; i++) {
      fetch(URl + i)
        .then((response) => response.json())
        .then((data) => {
          if (botonId === "Todos") {
            mostrarPokemon(data);
          } else {
            const tipos = data.types.map((type) => type.type.name);
            if (tipos.some((tipo) => tipo.includes(botonId))) {
              mostrarPokemon(data);
            }
          }
        });
    }
  })
);
