async function createPokemon(name, imageUrl, stats) {
    try {
        const response = await fetch(apiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                imageUrl: imageUrl,
                stats: stats, // Agregar stats al cuerpo de la solicitud
            }),
        });
        const data = await response.json();
        console.log(`Pokémon ${data.name} creado con éxito en la API mock.`);
    } catch (error) {
        console.error("Error al crear un Pokémon:", error);
    }
}

// Función para actualizar un Pokémon en la API mock con stats
async function updatePokemon(id, name, imageUrl, stats) {
    try {
        const response = await fetch(`${apiURL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                imageUrl: imageUrl,
                stats: stats, // Agregar stats al cuerpo de la solicitud
            }),
        });
        const data = await response.json();
        console.log(`Pokémon ${data.name} actualizado con éxito en la API mock.`);
    } catch (error) {
        console.error("Error al actualizar un Pokémon:", error);
    }
}
