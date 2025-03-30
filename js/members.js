document.addEventListener("DOMContentLoaded", function() {
  cargarEquipo();
});

function cargarEquipo() {
    console.log("Cargando equipo...");

    const teamMembers = [
        {
            name: "Àngel Jiménez",
            position: "Guía de montaña & Fotógrafo",
            description: "Amante de la naturaleza y experto en rutas secretas de la isla.",
            imgSrc: "assets/img/contacto/miembro01.jpg",
            linkedIn: "https://www.linkedin.com/"
        },
        {
            name: "Iván Pérez",
            position: "Explorador & Planificador",
            description: "Organiza cada aventura para que sea una experiencia inolvidable.",
            imgSrc: "assets/img/contacto/miembro02.jpg",
            linkedIn: "https://www.linkedin.com/"
        },
        {
            name: "Alex Hierro",
            position: "Marketing & Redes",
            description: "Comparte nuestras aventuras y consejos para explorar Mallorca.",
            imgSrc: "assets/img/contacto/miembro03.jpg",
            linkedIn: "https://www.linkedin.com/"
        }
    ];

    // Obtenemos el contenedor donde se insertarán los miembros
    const teamGrid = document.getElementById("teamGrid");

    // Iteramos sobre el array de miembros y generamos el HTML para cada uno
    teamMembers.forEach(member => {
        const memberHTML = `
            <div class="col-md-4">
                <div class="team-member">
                    <a href="${member.linkedIn}" target="_blank">
                        <img class="team-img" src="${member.imgSrc}" alt="Miembro de equipo: ${member.name}">
                    </a>
                    <h4>${member.name}</h4>
                    <p class="text-light">${member.position}</p>
                    <p>${member.description}</p>
                </div>
            </div>
        `;
        // Insertamos el HTML generado en el contenedor
        teamGrid.innerHTML += memberHTML;
    });

    console.log("Equipo cargado correctamente");
};