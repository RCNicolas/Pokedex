const listaPokemon = document.querySelector("#listaPokemon");
const URl = "https://pokeapi.co/api/v2/pokemon/";
const botonesHearder = document.querySelectorAll(".btn-header");

for (let i = 1; i <= 504; i++) {
  fetch(URl + i)
    .then((response) => response.json())
    .then((data) => mostrarPokemon(data));
}

// const mostrarPokemon = async (URl) => {
//   let data = await (
//     await fetch(URl)
//   ).json();
//   return data
// }

function mostrarPokemon(poke) {
  // let data = await (
  //   await fetch(URl)
  // ).json();

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

  div.innerHTML = /*html */ `
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
  listaPokemon.append(div);
  //! Agrega el event listener dentro de la función mostrarPokemon
  div.addEventListener("click", async () => {
    let img = poke.sprites.other["official-artwork"].front_default;
    let defaultImg = "Img/Pokeball.png";

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
        <div class="pokeStat">${poke.stats
          .map(
            (data) => /*html */ `
          <div class="stat-bar-container">
            <div class="stat-bar">
              <div class="stat-bar-fill" style="width: ${data.base_stat / 2}%;">
              </div>
            </div>
            <span class="stat_poke">
              <b class="base_stat">${data.base_stat}</b> <b class="name_stat">${
              data.stat.name
            }</b>
            </span>
          </div>`
          )
          .join("")}</div>
      </div>`,
      width: "auto",
      height: "auto",
      background: "transparent",
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
    for (let i = 1; i <= 200; i++) {
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
