document.addEventListener("DOMContentLoaded", function() {
  cargarEquipo();
});

function cargarEquipo() {
    console.log("Cargando equipo...");

    const teamMembers = [
        {
            name: "Àngel Jiménez",
            position: "Estudiante Ingeniería Informática UIB",
            imgSrc: "https://www.explorarmallorca.com/assets/img/contacto/angel.jpeg",
            linkedIn: "https://www.linkedin.com/in/angel-jimenez-sanchis-bbb37a351/"
        },
        {
            name: "Iván Pérez",
            position: "Estudiante Ingeniería Informática UIB",
            imgSrc: "https://www.explorarmallorca.com/assets/img/contacto/ivan.jpeg",
            linkedIn: "https://www.linkedin.com/in/iv%C3%A1n-p%C3%A9rez-garc%C3%ADa-583b97330/"
        },
        {
            name: "Alex Hierro",
            position: "Estudiante Ingeniería Informática UIB",
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
                    <h3>${member.name}</h3>
                    <p class="text-light">${member.position}</p>
                </div>
            </div>
        `;
        // Insertamos el HTML generado en el contenedor
        teamGrid.innerHTML += memberHTML;
    });

    console.log("Equipo cargado correctamente");
};