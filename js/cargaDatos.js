document.addEventListener("DOMContentLoaded", function() {
  cargarDatos();
});

// Función que se encargará de cargar y mostrar los datos del JSON
function cargarDatos() {
  const urlJson = "https://www.explorarmallorca.com/json/excursiones.json";
  const reviewsJson = "https://www.explorarmallorca.com/json/reviews.json";
  
  const avesJson = "https://avesmallorquinas.com/assets/json/Ave.json";
  const zonasJson = "https://avesmallorquinas.com/assets/json/Zona.json";
  var mapas = [];
  var coordenadas = [];
  var infAves=[];

  // Carga simultánea de rutas, valoraciones, aves y zonas
  Promise.all([
    fetch(urlJson).then(response => response.json()),
    fetch(reviewsJson).then(response => response.json()),
    fetch(avesJson).then(response => response.json()),
    fetch(zonasJson).then(response => response.json())
  ])
  .then(([data, reviewsData, avesData, zonasData]) => {
      console.log("Datos JSON cargados correctamente");

      const portfolioGrid = document.getElementById("portfolioGrid");
      const portfolioModals = document.getElementById("portfolioModals");

      data.itemListElement.forEach((item, index) => {
        // Tarjeta del portafolio
        const portfolioItemHTML = `
          <div class="col-md-6 col-lg-4 mb-5">
            <div class="portfolio-item mx-auto" data-bs-toggle="modal" data-bs-target="#portfolioModal${index + 1}">
              <div class="portfolio-item-caption d-flex align-items-center justify-content-center h-100 w-100">
                <div class="portfolio-item-caption-content text-center text-white">
                  <i class="fas fa-plus fa-3x"></i>
                </div>
              </div>
              <img class="img-fluid" src="${item.image[0]}" alt="Excursión ${item.name}" />
            </div>
          </div>
        `;
        portfolioGrid.innerHTML += portfolioItemHTML;

        // Modal con acordeones y sección de aves dinámica
        var modalHTML = `
          <div class="portfolio-modal modal fade" id="portfolioModal${index + 1}" tabindex="-1" aria-labelledby="portfolioModal${index + 1}" aria-hidden="true">
            <div class="modal-dialog modal-xl">
              <div class="modal-content shadow-lg">
                <div class="modal-header border-0">
                  <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body pb-5">
                  <div class="container">
                    <div class="text-center mb-4">
                      <h2 class="portfolio-modal-title text-uppercase fw-bold text-primary">${item.name}</h2>
                      <div class="divider-custom my-3">
                        <div class="divider-custom-line bg-primary"></div>
                        <div class="divider-custom-icon"><i class="fas fa-tree text-primary"></i></div>
                        <div class="divider-custom-line bg-primary"></div>
                      </div>
                    </div>

                    <div class="accordion custom-accordion" id="excursionAccordion${index + 1}">
                    <!-- Detalles Generales -->
                    <div class="accordion-item mb-3 rounded shadow-sm">
                      <h2 class="accordion-header" id="headingDetails${index + 1}">
                        <button class="accordion-button custom-accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDetails${index + 1}" aria-expanded="true" aria-controls="collapseDetails${index + 1}">
                          <i class="fas fa-info-circle me-2"></i> Detalles Generales
                        </button>
                      </h2>
                      <div id="collapseDetails${index + 1}" class="accordion-collapse collapse show" aria-labelledby="headingDetails${index + 1}">
                        <div class="accordion-body">
                          <p class="lead speak-text">${item.description}</p>
                              <div class="excursion-image mb-4">
                                <img src="${item.image[0]}" alt="Imagen principal de ${item.name}">
                              </div>
                          <div class="detail-container mb-4">
                            <div class="detail-card">
                              <i class="fas fa-mountain"></i>
                              <span>Dificultad: ${item.additionalProperty[0].value}</span>
                            </div>
                            <div class="detail-card">
                              <i class="fas fa-clock"></i>
                              <span>Duración: ${parseTime(item.additionalProperty[1].value)}</span>
                            </div>
                          </div>

                          <!-- Contenedor Weather Card -->
                          <div class="d-flex justify-content-center align-items-center mb-2">
                            <div class="weather-card">
                              <div class="weather-header">
                                <div class="location">${item.name}, Mallorca</div>
                              </div>

                              <div class="temperature">Cargando...</div>
                              <div class="weather-description">Por favor espera...</div>

                              <div class="divider"></div>

                              <div class="wind-speed">Velocidad del viento: </div>

                              <div class="weather-icon">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/4/47/Weather_Forecast-Sunny.svg" alt="Clima">
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Galería de Imágenes -->
                    <div class="accordion-item mb-3 rounded shadow-sm">
                      <h2 class="accordion-header" id="headingGallery${index + 1}">
                        <button
                          class="accordion-button collapsed custom-accordion-button"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseGallery${index + 1}"
                          aria-expanded="false"
                          aria-controls="collapseGallery${index + 1}"
                        >
                          <i class="fas fa-images me-2"></i> Galería de Imágenes
                        </button>
                      </h2>
                      <div
                        id="collapseGallery${index + 1}"
                        class="accordion-collapse collapse"
                        aria-labelledby="headingGallery${index + 1}"
                      >
                        <div class="accordion-body">
                          <div
                            id="galleryCarousel${index + 1}"
                            class="carousel slide gallery-carousel"
                            data-bs-touch="false"
                            data-bs-ride="carousel"
                            data-bs-interval="4000"
                          >
                            <div class="carousel-inner">
                              ${item.image.slice(1).map((imgUrl, imgIndex) => {
                                const activeClass = imgIndex === 0 ? "active" : "";
                                return `
                                  <div class="carousel-item ${activeClass}">
                                    <img src="${imgUrl}" class="d-block w-100 rounded" alt="Imagen secundaria ${imgIndex + 1}">
                                  </div>
                                `;
                              }).join('')}
                            </div>
                            <button
                              class="carousel-control-prev"
                              type="button"
                              data-bs-target="#galleryCarousel${index + 1}"
                              data-bs-slide="prev"
                            >
                              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                              <span class="visually-hidden">Anterior</span>
                            </button>
                            <button
                              class="carousel-control-next"
                              type="button"
                              data-bs-target="#galleryCarousel${index + 1}"
                              data-bs-slide="next"
                            >
                              <span class="carousel-control-next-icon" aria-hidden="true"></span>
                              <span class="visually-hidden">Siguiente</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Mapa de Ruta -->
                    <div class="accordion-item mb-3 rounded shadow-sm">
                      <h2 class="accordion-header" id="headingMap${index + 1}">
                        <button class="accordion-button collapsed custom-accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseMap${index + 1}" aria-expanded="false" aria-controls="collapseMap${index + 1}">
                          <i class="fas fa-map-marker-alt me-2"></i> Ruta de la Excursión
                        </button>
                      </h2>
                      <div id="collapseMap${index + 1}" class="accordion-collapse collapse" aria-labelledby="headingMap${index + 1}">
                        <div class="accordion-body">
                          <div id="map2${index + 1}" 
                              data-lat="${item.containedInPlace.geo.latitude}" 
                              data-lon="${item.containedInPlace.geo.longitude}" 
                              style="height: 400px; border: 2px solid #5a83b3; border-radius: 0.5rem;"></div>
                        </div>
                      </div>
                    </div>

                    <!-- Vídeo de la Excursión -->
                    <div class="accordion-item mb-3 rounded shadow-sm">
                      <h2 class="accordion-header" id="headingVideo${index + 1}">
                        <button class="accordion-button collapsed custom-accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseVideo${index + 1}" aria-expanded="false" aria-controls="collapseVideo${index + 1}">
                          <i class="fas fa-video me-2"></i> Vídeo de la Excursión
                        </button>
                      </h2>
                      <div id="collapseVideo${index + 1}" class="accordion-collapse collapse" aria-labelledby="headingVideo${index + 1}">
                        <div class="accordion-body">
                          <div class="ratio ratio-16x9 rounded overflow-hidden shadow-sm">
                            <lite-youtube videoid="${removeSubString(item.subjectOf.video.embedUrl)}"></lite-youtube>  
                          </div>
                        </div>
                      </div>
                    </div>

                      <!-- Aves: Ave más próxima -->
                      <div class="accordion-item mb-3 rounded shadow-sm">
                        <h2 class="accordion-header" id="headingAves${index + 1}">
                          <button class="accordion-button collapsed custom-accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseAves${index + 1}" aria-expanded="false" aria-controls="collapseAves${index + 1}">
                            <i class="fas fa-dove me-2"></i> Ave más próxima
                          </button>
                        </h2>
                        <div id="collapseAves${index + 1}" class="accordion-collapse collapse" aria-labelledby="headingAves${index + 1}">
                          <div class="accordion-body text-center" id="avesInfo${index + 1}">
                            <p>Cargando ave más próxima...</p>
                          </div>
                        </div>
                      </div>

                      <!-- Valoraciones y Comentarios -->
                    <div class="accordion-item mb-3 rounded shadow-sm">
                      <h2 class="accordion-header" id="headingFeedback${index + 1}">
                        <button class="accordion-button collapsed custom-accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFeedback${index + 1}" aria-expanded="false" aria-controls="collapseFeedback${index + 1}">
                          <i class="fas fa-comments me-2"></i> Valoraciones y Comentarios
                        </button>
                      </h2>
                      <div id="collapseFeedback${index + 1}" class="accordion-collapse collapse" aria-labelledby="headingFeedback${index + 1}">
                        <div class="accordion-body">
                          <div class="mb-3">`;
              const review = reviewsData.itemListElement.find(r => r['@identifier'] === item['@identifier']);
              if (review) {
                modalHTML += `
                  <h4 class="text-secondary mb-1">Valoración:</h4>
                  <div class="d-flex align-items-center gap-2 mb-2">
                    <div class="stars">
                      ${generateStars(review.aggregateRating.ratingValue)}
                    </div>
                    <div class="small text-muted">
                      ${parseFloat(review.aggregateRating.ratingValue).toFixed(1)} / 5 
                      (${review.aggregateRating.reviewCount} opiniones)
                    </div>
                  </div>
                `;
              }     

              modalHTML+=`</div>
                          <div class="mb-3 comment-list">
                          <h4 class="text-secondary">Comentarios:</h4>`
              
              if (review) {
                modalHTML += `${generateComments(review.associatedReview)}`;
              }

              modalHTML+=`</div>
                          <!-- Formulario para añadir comentarios -->
                          <div class="mt-4" id="commentElement${index + 1}" data-excursion-id="${item['@identifier']}" style="display: none;">
                            <h4 class="text-secondary">Añadir Comentario:</h4>
                            <form class="comment-form">
                              <!-- Campo de comentario -->
                              <div class="mb-3 form-floating">
                                <textarea class="form-control comment-text" placeholder="Tu comentario" style="height: 100px" required></textarea>
                                <label>Comentario</label>
                              </div>
                              <!-- Selector de valoración 1–5 -->
                              <div class="mb-3 rating d-flex gap-1">
                                ${[1, 2, 3, 4, 5].map(n => `
                                  <input type="radio" name="rating${index+1}" id="star${n}-${index+1}" value="${n}" class="d-none">
                                  <label for="star${n}-${index+1}" class="star-label" data-value="${n}">
                                    ★
                                  </label>
                                `).join('')}
                              </div>
                              <button class="btn btn-primary btn-comment-submit" type="submit" disabled>Enviar</button>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- Fin del Acordeón Principal -->
                </div>
              </div>
            </div>
          </div>
        </div>
        `;
        portfolioModals.innerHTML += modalHTML;
        coordenadas.push([item.containedInPlace.geo.latitude,item.containedInPlace.geo.longitude]);
        infAves.push([item.containedInPlace.geo.latitude,item.containedInPlace.geo.longitude,avesData.species,zonasData.landforms]);
        mapas.push(item.hasMap);
      });

      // Evento al mostrar la sección de aves para calcular y mostrar ave más próxima
      document.querySelectorAll('[id^="collapseAves"]').forEach((modal,index)=>{
        modal.addEventListener('show.bs.collapse', function() {
          console.log("ESTO FUNCIONA");
          const avesInfo = modal.querySelector('[id^="avesInfo"]');
          const nearest = getNearestBird(infAves[index][0], infAves[index][1], infAves[index][2], infAves[index][3]);
          if (nearest) {
            const audioObj = nearest.subjectOf.find(m => m.encodingFormat.indexOf('audio') !== -1);
            avesInfo.innerHTML = `
              <h5 class="fw-bold mb-2">${nearest.name}</h5>
              <img src="${nearest.image[0]}" class="img-fluid rounded mb-3" alt="${nearest.name}" />
              <audio controls class="w-100">
                <source src="${audioObj.contentUrl}" type="${audioObj.encodingFormat}">Tu navegador no soporta audio.
              </audio>
            `;
          } else {
            avesInfo.innerHTML = '<p>No se encontró ninguna ave cercana.</p>';
          }
        });
      });
      

      // Inicializaciones comunes
      document.querySelectorAll('.portfolio-modal').forEach((modal,index) => {
        const mapContainer = modal.querySelector('[id^="map2"]');
        const map = L.map(mapContainer);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        modal.addEventListener('shown.bs.collapse', function () {
            map.invalidateSize();
            new L.GPX(mapas[index], {
                async: true,
                marker_options: {
                    startIconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet-gpx/1.4.0/pin-icon-start.png",
                    endIconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet-gpx/1.4.0/pin-icon-end.png",
                    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet-gpx/1.4.0/pin-shadow.png"
                }
            }).on('loaded', function(e) {
                map.fitBounds(e.target.getBounds());
            }).addTo(map);
        });
      });
      addSpeakButtons();
      getWeather(coordenadas);
      initializeCommentForms();
      setupLoadMore();
  })
  .catch(error => {
    console.error("Error al cargar los datos:", error);
    document.getElementById("portfolioGrid").innerHTML = "<p>Error al cargar los datos.</p>";
  });
}

// Función para hallar el ave más próxima usando distancia haversine
function getNearestBird(lat, lon, birds, zones) {
  let minDist = Infinity;
  let nearest = null;
  birds.forEach(bird => {
    const zonasDist = bird.additionalProperty.find(p => p.name === 'Zona de distribución');
    if (!zonasDist) return;
    zonasDist.value.forEach(idZ => {
      const zone = zones.find(z => z.identifier === idZ);
      if (!zone || !zone.geo) return;
      const d = haversineDistance(lat, lon, zone.geo.latitude, zone.geo.longitude);
      if (d < minDist) {
        minDist = d;
        nearest = bird;
      }
    });
  });
  return nearest;
}

// Cálculo de distancia en km entre dos puntos geográficos
function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = x => x * Math.PI / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
// Función para generar las estrellas de la valoración
function generateStars(ratingValue) {
  const rating = parseFloat(ratingValue);
  if (isNaN(rating)) return ''; 

  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  let starsHTML = '';

  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fas fa-star text-warning"></i>';
  }

  if (halfStar) {
    starsHTML += '<i class="fas fa-star-half-alt text-warning"></i>';
  }

  for (let i = fullStars + (halfStar ? 1 : 0); i < 5; i++) {
    starsHTML += '<i class="far fa-star text-muted"></i>';
  }

  return starsHTML;
}

// Función para generar los comentarios
function generateComments(reviews) {
  return reviews.map(review => {
    
    const date = review.datePublished 
      ? new Date(review.datePublished).toLocaleDateString() 
      : '';

    const ratingValue = review.reviewRating?.ratingValue || review.ratingValue || 0;

    return `
      <div class="comment fade-in mb-3 p-3 border rounded bg-light-subtle">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <strong class="text-primary">${review.author.name}</strong>
          ${date ? `<small class="text-muted">${date}</small>` : ''}
        </div>
        <div class="mb-1">
          ${generateStars(ratingValue)}
        </div>
        <p class="mb-0">${review.reviewBody}</p>
      </div>
    `;
  }).join('');
}

function parseTime(time){
  var duration="";
  const re=/[0-9]+(?=D)/;
  var dias=time.match(re);
  if(dias!==null){
    console.log(dias[0]);
    duration= dias[0] + " dia(s)  ";
  }

  const re2=/[0-9]+(?=H)/;
  var horas=time.match(re2);
  console.log(horas);
  if(horas!==null){
    duration=duration+ horas[0] + " hora(s)  ";
  }

  const re3=/[0-9]+(?=M)/;
  var minutos=time.match(re3);
  if(minutos!==null){
    duration=duration+ minutos[0] + " minuto(s)  ";
  }
  return duration;
}

// Función para cargar más elementos en el portafolio
function setupLoadMore() {
  const grid = document.getElementById('portfolioGrid');
  const items = Array.from(grid.children);
  if (items.length <= 5) return; // nada que hacer si hay ≤5

  // 1) Oculta desde la 6ª en adelante
  items.forEach((el, i) => {
    if (i > 4) el.style.display = 'none';
  });

  // 2) Crea el botón
  const container = document.createElement('div');
  container.className = 'text-center';
  container.innerHTML = `
    <button id="loadMoreBtn" class="btn btn-primary">
      Cargar más
    </button>
  `;
  grid.parentNode.insertBefore(container, grid.nextSibling);

  // 3) Lógica toggle
  let expanded = false;
  const btn = container.querySelector('#loadMoreBtn');
  btn.addEventListener('click', () => {
    expanded = !expanded;
    if (expanded) {
      // muestro todo
      items.forEach(el => el.style.display = '');
      btn.textContent = 'Cargar menos';
    } else {
      // vuelvo a ocultar desde la 6ª
      items.forEach((el, i) => {
        el.style.display = i > 4 ? 'none' : '';
      });
      btn.textContent = 'Cargar más';
      // opcional: hacemos scroll al principio del grid
      grid.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

function removeSubString(header){
  const substring="https://www.youtube.com/embed/";
  return header.replace(substring,''); 
}