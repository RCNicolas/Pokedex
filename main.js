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
  let img = poke.sprites.other["official-artwork"].front_default;
  let defaultImg = "Img/Pokeball.png";
  div.innerHTML = `
    <p class="pokemon-id-back">#${pokeId}</p>
    <div class="pokemon-imagen">
        <img src="${img ? img : defaultImg}" alt="${poke.name}">
    </div>
    <div class="pokemon-info">
        <div class="nombre-contenedor">
        <p class="pokemon-id">#${pokeId}</p>
        <h2 class="pokemon-nombre">${poke.name}</h2>
        </div>
    </div>
  `;
  listaPokemon.append(div);
  //! Agrega el event listener dentro de la función mostrarPokemon
  div.addEventListener("click", async () => {
    let img = poke.sprites.other["official-artwork"].front_default;
    let defaultImg = "Img/Pokeball.png";

    Swal.fire({
      title: `<h2 class="pokemon-nombre">${poke.name}</h2>
                <div class="pokemon-tipos" style="text-align: center;">
                  ${tipos}
                </div>`,
      imageUrl: `${img ? img : defaultImg}`,
      html: `${poke.stats
        .map(
          (data) => `
              <div class="stat-bar-container">
                <div class="stat-bar">
                  <div class="stat-bar-fill" style="width: ${
                    data.base_stat / 1.5
                  }%;"></div>
                </div>
                <span class="stat_poke">${data.base_stat}: ${
            data.stat.name
          }</span>
              </div><br>
              `
        )
        .join("")}`,
      imageWidth: "75%",
      imageHeight: "75%",
      width: "24rem",
      height: "10rem",
      background: "#252525",
      padding: "0rem",
      margin: "0rem",
      // grow: "column",
      showConfirmButton: false,
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
