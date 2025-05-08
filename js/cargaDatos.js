document.addEventListener("DOMContentLoaded", function() {
  cargarDatos();
});

// Función que se encargará de cargar y mostrar los datos del JSON
function cargarDatos() {
  const urlJson = "https://www.explorarmallorca.com/json/excursiones.json";
  const reviewsJson="https://www.explorarmallorca.com/json/reviews.json";
  var mapas=[];
  var coordenadas=[];
  Promise.all([fetch(urlJson).then(response=>response.json()), fetch(reviewsJson).then(response=>response.json())])
  .then(([data,reviewsData]) =>{
      console.log("He leído bien el JSON");
      
      const portfolioGrid = document.getElementById("portfolioGrid");
      const portfolioModals = document.getElementById("portfolioModals");

      // Iteramos sobre el array de rutas
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
        
        // Modal con acordeones y estilo mejorado
        var modalHTML = `
          <div class="portfolio-modal modal fade" id="portfolioModal${index + 1}" tabindex="-1" aria-labelledby="portfolioModal${index + 1}" aria-hidden="true">
            <div class="modal-dialog modal-xl">
              <div class="modal-content shadow-lg">
                <!-- Cabecera sin borde -->
                <div class="modal-header border-0">
                  <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body pb-5">
                  <div class="container">
                    <!-- Título de la Excursión -->
                    <div class="text-center mb-4">
                      <h2 class="portfolio-modal-title text-uppercase fw-bold text-primary">${item.name}</h2>
                      <div class="divider-custom my-3">
                        <div class="divider-custom-line bg-primary"></div>
                        <div class="divider-custom-icon"><i class="fas fa-tree text-primary"></i></div>
                        <div class="divider-custom-line bg-primary"></div>
                      </div>
                    </div>

                    <!-- Acordeón Principal sin data-bs-parent para mantenerlos abiertos -->
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
                          <button class="accordion-button collapsed custom-accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseGallery${index + 1}" aria-expanded="false" aria-controls="collapseGallery${index + 1}">
                            <i class="fas fa-images me-2"></i> Galería de Imágenes
                          </button>
                        </h2>
                        <div id="collapseGallery${index + 1}" class="accordion-collapse collapse" aria-labelledby="headingGallery${index + 1}">
                          <div class="accordion-body">
                            <div id="carouselExampleControlsNoTouching${index + 1}" class="carousel slide" data-bs-touch="false" data-bs-ride="carousel" data-bs-interval="4000">
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
                              <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControlsNoTouching${index + 1}" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Anterior</span>
                              </button>
                              <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControlsNoTouching${index + 1}" data-bs-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Siguiente</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Mapa de Ubicación -->
                      <div class="accordion-item mb-3 rounded shadow-sm">
                        <h2 class="accordion-header" id="headingMap${index + 1}">
                          <button class="accordion-button collapsed custom-accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseMap${index + 1}" aria-expanded="false" aria-controls="collapseMap${index + 1}">
                            <i class="fas fa-map-marker-alt me-2"></i> Ubicación en el Mapa
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
                              <iframe src="${item.subjectOf.video.embedUrl}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Aves: Audio e Imágenes -->
                      <div class="accordion-item mb-3 rounded shadow-sm">
                        <h2 class="accordion-header" id="headingAves${index + 1}">
                          <button class="accordion-button collapsed custom-accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseAves${index + 1}" aria-expanded="false" aria-controls="collapseAves${index + 1}">
                            <i class="fas fa-dove me-2"></i> Cantos e Imágenes de las Aves
                          </button>
                        </h2>
                        <div id="collapseAves${index + 1}" class="accordion-collapse collapse" aria-labelledby="headingAves${index + 1}">
                          <div class="accordion-body">
                            <div class="row align-items-center">
                              <!-- Audio -->
                              <div class="col-md-6 mb-3">
                                <div class="card border-0 shadow-sm">
                                  <div class="card-body text-center">
                                    <h5 class="card-title">Audio Ambiente</h5>
                                    <audio controls class="w-100">
                                      <source src="assets/audio/sonido-naturaleza.mp3" type="audio/mp3">
                                      Tu navegador no soporta el elemento de audio.
                                    </audio>
                                  </div>
                                </div>
                              </div>
                              <!-- Galería de Aves -->
                              <div class="col-md-6">
                                <div class="card border-0 shadow-sm">
                                  <div class="card-body text-center">
                                    <h5 class="card-title">Galería de Aves</h5>
                                    <img src="assets/img/aves1.jpg" class="img-fluid rounded mb-2" alt="Ave 1">
                                    <img src="assets/img/aves2.jpg" class="img-fluid rounded" alt="Ave 2">
                                  </div>
                                </div>
                              </div>
                            </div>
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
        coordenadas.push([item.containedInPlace.geo.latitude,item.containedInPlace.geo.longitude])
        
        portfolioModals.innerHTML += modalHTML;

        // Inicialización del mapa en cada modal al mostrarse
        mapas.push(item.hasMap)
      });
      
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
      // Llamamos a addSpeakButtons después de cargar todos los elementos
      addSpeakButtons();  

      getWeather(coordenadas);

      initializeCommentForms();
    })
    .catch(error => {
      console.error("Error al cargar el archivo JSON:", error);
      document.getElementById("portfolioGrid").innerHTML = "<p>Error al cargar los datos.</p>";
    });
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
    return `
      <div class="comment mb-3">
        <p><strong>${review.author.name}:</strong> ${review.reviewBody}</p>
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
    duration=duration+ minutos[0] + " dia(s)  ";
  }
  return duration;
}