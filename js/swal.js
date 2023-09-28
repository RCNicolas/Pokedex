// import Swal from "sweetalert2";

export function mostrarTarjetaSwal(poke) {
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
}
