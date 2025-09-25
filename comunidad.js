// comunidad.js (o el script que maneja tu página de comunidad)

document.addEventListener('DOMContentLoaded', () => {
    const eventosListContainer = document.getElementById('events-list-container');
    
    // 1. Leer los eventos desde localStorage
    let eventos = JSON.parse(localStorage.getItem('eventos')) || [];

    // 2. Limpiar el contenedor antes de mostrar los eventos
    eventosListContainer.innerHTML = '';
    
    // 3. Renderizar los eventos si existen
    if (eventos.length > 0) {
        eventos.forEach(evento => {
            const eventItemHTML = `
                <div class="event-item">
                    <div class="event-date">
                        <span class="day">${new Date(evento.fecha).getDate()}</span>
                        <span class="month">${new Date(evento.fecha).toLocaleString('es', { month: 'short' }).toUpperCase()}</span>
                    </div>
                    <div class="event-info">
                        <h5>${evento.titulo}</h5>
                        <p><i class="fas fa-map-marker-alt"></i> ${evento.ubicacion}</p>
                        <span class="event-points">+${evento.puntos} Puntos LevelUp</span>
                    </div>
                </div>
            `;
            eventosListContainer.innerHTML += eventItemHTML;
        });
    } else {
        eventosListContainer.innerHTML = '<p class="text-center text-muted mt-4">No hay eventos próximos.</p>';
    }
});