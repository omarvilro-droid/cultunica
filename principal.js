import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    addDoc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAODMr_rNzPz2tWXv3hi_l_SOkjXsbJWA8",
    authDomain: "cultunica-62c4f.firebaseapp.com",
    projectId: "cultunica-62c4f",
    storageBucket: "cultunica-62c4f.appspot.com", // corregido
    messagingSenderId: "320924758775",
    appId: "1:320924758775:web:0bcd9a276aa1bef784d9f2",
    measurementId: "G-GMDKFNPWBG"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Obtener usuario actual
const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

// Función para guardar post en Firebase (única, combinando ambas versiones)
async function guardarPostEnFirebase({ fecha_publicacion, text_post, tipo_post, ubicacion_publicacion }) {
        // Si no se pasa fecha_publicacion, se genera
        if (!fecha_publicacion) fecha_publicacion = new Date().toISOString();

        // Si hay currentUser, se agrega autorId y nombre_usuario
        let postData = {
                fecha_publicacion,
                text_post,
                tipo_post,
                ubicacion_publicacion
        };
        if (currentUser && currentUser.uid) {
                postData.autorId = currentUser.uid;
                postData.nombre_usuario = currentUser.nombre_usuario;
        }

        // Genera un código único de 9 dígitos si no hay autorId
        let docRef;
        try {
                if (postData.autorId) {
                        docRef = await addDoc(collection(db, "posts"), postData);
                } else {
                        const codigo = Math.floor(100000000 + Math.random() * 900000000);
                        postData.codigo = codigo;
                        await setDoc(doc(db, "tamba", "posttip", "posts", codigo.toString()), postData);
                }
                console.log("Post guardado en Firebase:", postData);
        } catch (error) {
                console.error("Error al guardar el post en Firebase:", error);
        }
}

// Ejemplo de uso al publicar en Feed, Reels o Audios
// guardarPostEnFirebase({
//     fecha_publicacion: new Date().toISOString(),
//     text_post: mensaje,
//     tipo_post: selectedFeedType || 'texto',
//     ubicacion_publicacion: 'Nicaragua'
// });

function showSection(sectionName, event) {
        const sections = document.querySelectorAll('.section-content');
        sections.forEach(section => section.classList.add('hidden'));
        document.getElementById(sectionName + '-section').classList.remove('hidden');
        const navButtons = document.querySelectorAll('.nav-btn, .mobile-nav-btn');
        navButtons.forEach(btn => {
                btn.classList.remove('bg-white/30', 'text-blue-600');
                btn.classList.add('text-gray-600');
        });
        if (event && event.target) {
                event.target.closest('button').classList.add('bg-white/30');
                event.target.closest('button').classList.remove('text-gray-600');
        }
}

function showEventInfo(title, desc, location, time, date) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-desc').textContent = desc;
        document.getElementById('modal-extra').innerHTML =
                `<div><strong>Fecha:</strong> ${date}</div>
                 <div><strong>Lugar:</strong> ${location}</div>
                 <div><strong>Hora:</strong> ${time}</div>`;
        document.getElementById('event-modal').classList.remove('hidden');
}
// function closeEventModal() {
//         document.getElementById('event-modal').classList.add('hidden');
// }
/* function closeEventModal() {
        document.getElementById('event-modal').classList.add('hidden');
} */
// =========================
document.addEventListener('DOMContentLoaded', function() {
        function asignarEventosCalendario() {
                document.querySelectorAll('#calendar-section .border.border-gray-200').forEach(card => {
                        card.style.cursor = 'pointer';
                        card.onclick = function() {
                                const title = card.querySelector('h4').textContent;
                                const desc = card.querySelector('p.text-sm').textContent;
                                const location = card.querySelector('.fa-map-marker-alt').parentElement.textContent.trim();
                                const time = card.querySelector('.fa-clock').parentElement.textContent.trim();
                                const date = card.querySelector('.text-lg.font-bold').textContent + ' ' + card.querySelector('.text-xs').textContent;
                                showEventInfo(title, desc, location, time, date);
                        };
                });
        }
        asignarEventosCalendario();

        const eventForm = document.getElementById('new-event-form');
        if (eventForm) {
                eventForm.addEventListener('submit', function() {
                        setTimeout(asignarEventosCalendario, 100);
                });
        }
});

// =========================
// Próximos eventos en sidebar
// =========================
function actualizarProximosEventosSidebar() {
        const eventosCalendario = document.querySelectorAll('#calendar-section .space-y-4 > .border.border-gray-200');
        const eventosSidebar = document.getElementById('sidebar-events-list');
        if (!eventosSidebar) return;
        eventosSidebar.innerHTML = '';
        eventosCalendario.forEach((evento, idx) => {
                if (idx < 3) {
                        const titulo = evento.querySelector('h4').textContent;
                        const dia = evento.querySelector('.text-lg.font-bold').textContent;
                        const mes = evento.querySelector('.text-xs').textContent;
                        const hora = evento.querySelector('.fa-clock').parentElement.textContent.trim();
                        const eventoSidebar = document.createElement('div');
                        eventoSidebar.className = 'border-l-4 border-blue-500 pl-3 cursor-pointer';
                        eventoSidebar.innerHTML = `
                                <p class="font-medium text-sm">${titulo}</p>
                                <p class="text-xs text-gray-500">${dia} ${mes} ${hora}</p>
                        `;
                        eventoSidebar.onclick = function() {
                                const desc = evento.querySelector('p.text-sm').textContent;
                                const location = evento.querySelector('.fa-map-marker-alt').parentElement.textContent.trim();
                                showEventInfo(titulo, desc, location, hora, `${dia} ${mes}`);
                        };
                        eventosSidebar.appendChild(eventoSidebar);
                }
        });
}
document.addEventListener('DOMContentLoaded', function() {
        actualizarProximosEventosSidebar();
        const eventForm = document.getElementById('new-event-form');
        if (eventForm) {
                eventForm.addEventListener('submit', function() {
                        setTimeout(actualizarProximosEventosSidebar, 100);
                });
        }
        setInterval(actualizarProximosEventosSidebar, 3000);
});

// =========================
// Publicaciones (Feed, Reels, Audios)
// =========================
document.addEventListener('DOMContentLoaded', function() {
        // Usuario actual
        const usuarioActual = {
                nombre: currentUser.nombre_usuario || "María González",
                username: currentUser.username || "maria.gonzalez",
                avatar: currentUser.avatar || "https://ui-avatars.com/api/?name=María+González&background=3b82f6&color=fff"
        };

        // Etiquetas
        const etiquetas = [
                { value: "Tradiciones", html: `<span class="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full">Tradiciones</span>` },
                { value: "Recetas", html: `<span class="bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full">Recetas</span>` },
                { value: "Leyendas", html: `<span class="bg-purple-200 text-purple-800 text-xs px-2 py-1 rounded-full">Leyendas</span>` },
                { value: "Historia", html: `<span class="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded-full">Historia</span>` },
                { value: "Artesanías", html: `<span class="bg-red-200 text-red-800 text-xs px-2 py-1 rounded-full">Artesanías</span>` },
                { value: "Música", html: `<span class="bg-orange-200 text-orange-800 text-xs px-2 py-1 rounded-full">Música</span>` }
        ];

        // Selector de etiquetas
        function crearSelectorEtiquetas(parentDiv) {
                if (parentDiv.querySelector('.etiqueta-select')) return;
                const selectDiv = document.createElement('div');
                selectDiv.className = 'etiqueta-select mb-2 flex items-center space-x-2';
                selectDiv.innerHTML = `
                        <label class="text-sm font-semibold text-gray-700 mr-2">Etiqueta:</label>
                        <select class="bg-gray-100 rounded px-2 py-1 border border-gray-300 focus:ring-2 focus:ring-blue-500" required>
                                <option value="">Selecciona una etiqueta</option>
                                ${etiquetas.map(e => `<option value="${e.value}">${e.value}</option>`).join('')}
                        </select>
                `;
                parentDiv.appendChild(selectDiv);
        }

        // FEED
        const feedPublicarDiv = document.querySelector('#feed-section .bg-white.rounded-xl.card-shadow.p-6.mb-6 .flex.items-center.space-x-4');
        crearSelectorEtiquetas(feedPublicarDiv);
        const feedInput = document.querySelector('#feed-section input[type="text"]');
        const feedPublishBtn = document.querySelector('#feed-section .bg-blue-600');
        const feedPhotoBtn = document.querySelector('#feed-section .fa-image').parentElement;
        const feedVideoBtn = document.querySelector('#feed-section .fa-video').parentElement;
        const feedAudioBtn = document.querySelector('#feed-section .fa-microphone').parentElement;
        let feedPostsContainer = document.querySelector('#feed-posts');
        if (!feedPostsContainer) {
                feedPostsContainer = document.createElement('div');
                feedPostsContainer.id = 'feed-posts';
                feedPostsContainer.className = 'space-y-4 mt-6';
                document.querySelector('#feed-section .lg\\:col-span-2').appendChild(feedPostsContainer);
        }
        let feedPhotoInput = document.createElement('input');
        feedPhotoInput.type = 'file';
        feedPhotoInput.accept = 'image/*';
        feedPhotoInput.style.display = 'none';
        document.body.appendChild(feedPhotoInput);

        let feedVideoInput = document.createElement('input');
        feedVideoInput.type = 'file';
        feedVideoInput.accept = 'video/*';
        feedVideoInput.style.display = 'none';
        document.body.appendChild(feedVideoInput);

        let feedAudioInput = document.createElement('input');
        feedAudioInput.type = 'file';
        feedAudioInput.accept = 'audio/*';
        feedAudioInput.style.display = 'none';
        document.body.appendChild(feedAudioInput);

        let selectedFeedFile = null;
        let selectedFeedType = null;

        feedPhotoBtn.onclick = function() { feedPhotoInput.click(); };
        feedPhotoInput.onchange = function(e) {
                selectedFeedFile = e.target.files[0];
                selectedFeedType = 'foto';
                alert('Foto seleccionada para publicar.');
        };
        feedVideoBtn.onclick = function() { feedVideoInput.click(); };
        feedVideoInput.onchange = function(e) {
                selectedFeedFile = e.target.files[0];
                selectedFeedType = 'video';
                alert('Video seleccionado para publicar.');
        };
        feedAudioBtn.onclick = function() { feedAudioInput.click(); };
        feedAudioInput.onchange = function(e) {
                selectedFeedFile = e.target.files[0];
                selectedFeedType = 'audio';
                alert('Audio seleccionado para publicar.');
        };

        // REELS
        const reelsPublicarDiv = document.querySelector('#reels-section .bg-white.rounded-xl.card-shadow.p-6.mb-6 .flex.items-center.space-x-4');
        crearSelectorEtiquetas(reelsPublicarDiv);
        const reelsVideoBtn = document.querySelector('#reels-section .fa-video').parentElement;
        const reelsPublishBtn = document.querySelector('#reels-section .bg-blue-600');
        const reelsInput = document.querySelector('#reels-section input[type="text"]');
        let reelsPostsContainer = document.querySelector('#reels-posts');
        if (!reelsPostsContainer) {
                reelsPostsContainer = document.createElement('div');
                reelsPostsContainer.id = 'reels-posts';
                reelsPostsContainer.className = 'space-y-4 mt-6';
                document.querySelector('#reels-section > .bg-white').appendChild(reelsPostsContainer);
        }
        let reelsVideoInput = document.createElement('input');
        reelsVideoInput.type = 'file';
        reelsVideoInput.accept = 'video/*';
        reelsVideoInput.style.display = 'none';
        document.body.appendChild(reelsVideoInput);

        let selectedReelVideo = null;
        reelsVideoBtn.onclick = function() { reelsVideoInput.click(); };
        reelsVideoInput.onchange = function(e) {
                selectedReelVideo = e.target.files[0];
                alert('Video seleccionado para reel.');
        };

        // AUDIOS
        const audiosPublicarDiv = document.querySelector('#audios-section .bg-white.rounded-xl.card-shadow.p-6.mb-6 .flex.items-center.space-x-4');
        crearSelectorEtiquetas(audiosPublicarDiv);
        const audiosAudioBtn = document.querySelector('#audios-section .fa-microphone').parentElement;
        const audiosPublishBtn = document.querySelector('#audios-section .bg-blue-600');
        const audiosInput = document.querySelector('#audios-section input[type="text"]');
        let audiosPostsContainer = document.querySelector('#audios-posts');
        if (!audiosPostsContainer) {
                audiosPostsContainer = document.createElement('div');
                audiosPostsContainer.id = 'audios-posts';
                audiosPostsContainer.className = 'space-y-4 mt-6';
                document.querySelector('#audios-section > .bg-white').appendChild(audiosPostsContainer);
        }
        let audiosAudioInput = document.createElement('input');
        audiosAudioInput.type = 'file';
        audiosAudioInput.accept = 'audio/*';
        audiosAudioInput.style.display = 'none';
        document.body.appendChild(audiosAudioInput);

        let selectedAudioFile = null;
        audiosAudioBtn.onclick = function() { audiosAudioInput.click(); };
        audiosAudioInput.onchange = function(e) {
                selectedAudioFile = e.target.files[0];
                alert('Audio seleccionado para publicar.');
        };

        // Función para ver perfil
        window.verPerfilUsuario = function(username) {
                window.location.href = 'perfil2.html?user=' + encodeURIComponent(username);
        };

        // =========================
        // Barra de interacciones
        // =========================
        function crearBarraInteracciones(postDiv, fechaPublicacion) {
                let likes = 0;
                let comentarios = [];
                const barra = document.createElement('div');
                barra.className = 'flex items-center space-x-6 mt-2 pt-2 border-t border-gray-100';
                barra.innerHTML = `
                        <button class="like-btn flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
                                <i class="fas fa-thumbs-up"></i>
                                <span class="text-sm">Me gusta</span>
                                <span class="ml-1 text-xs font-bold like-count">0</span>
                        </button>
                        <button class="comment-btn flex items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors">
                                <i class="fas fa-comment"></i>
                                <span class="text-sm">Comentar</span>
                                <span class="ml-1 text-xs font-bold comment-count">0</span>
                        </button>
                        <button class="share-btn flex items-center space-x-1 text-gray-500 hover:text-purple-600 transition-colors">
                                <i class="fas fa-share"></i>
                                <span class="text-sm">Compartir</span>
                        </button>
                        <button class="save-btn flex items-center space-x-1 text-gray-500 hover:text-yellow-600 transition-colors">
                                <i class="fas fa-bookmark"></i>
                                <span class="text-sm">Guardar</span>
                        </button>
                `;
                barra.querySelector('.like-btn').onclick = function() {
                        this.classList.toggle('text-blue-600');
                        likes += this.classList.contains('text-blue-600') ? 1 : -1;
                        barra.querySelector('.like-count').textContent = likes;
                };
                barra.querySelector('.comment-btn').onclick = function() {
                        let commentBox = postDiv.querySelector('.comment-box');
                        if (!commentBox) {
                                commentBox = document.createElement('div');
                                commentBox.className = 'comment-box mt-2';
                                commentBox.innerHTML = `
                                        <input type="text" class="w-full border rounded px-2 py-1 mb-2" placeholder="Escribe un comentario...">
                                        <button class="bg-blue-600 text-white px-3 py-1 rounded text-sm">Publicar</button>
                                        <div class="comments-list mt-2 space-y-2"></div>
                                `;
                                postDiv.appendChild(commentBox);
                                commentBox.querySelector('button').onclick = function() {
                                        const input = commentBox.querySelector('input');
                                        const text = input.value.trim();
                                        if (text) {
                                                const fechaComentario = new Date();
                                                comentarios.push({ usuario: usuarioActual, text, fecha: fechaComentario });
                                                barra.querySelector('.comment-count').textContent = comentarios.length;
                                                renderizarComentarios(commentBox.querySelector('.comments-list'), comentarios);
                                                input.value = '';
                                        }
                                };
                        } else {
                                commentBox.classList.toggle('hidden');
                        }
                };
                barra.querySelector('.share-btn').onclick = function() {
                        alert('¡Enlace de la publicación copiado para compartir!');
                };
                barra.querySelector('.save-btn').onclick = function() {
                        this.classList.toggle('text-yellow-600');
                        alert('¡Publicación guardada para ver después!');
                };
                postDiv.appendChild(barra);

                // Tiempo de publicación
                const tiempoDiv = document.createElement('div');
                tiempoDiv.className = 'text-xs text-gray-400 mt-1';
                function actualizarTiempo() {
                        tiempoDiv.textContent = `Publicado hace ${tiempoTranscurrido(fechaPublicacion)}`;
                }
                actualizarTiempo();
                postDiv.appendChild(tiempoDiv);
                setInterval(actualizarTiempo, 60000);

                function renderizarComentarios(container, comentariosArr) {
                        container.innerHTML = '';
                        comentariosArr.forEach(com => {
                                container.innerHTML += `
                                        <div class="flex items-start space-x-2">
                                                <img src="${com.usuario.avatar}" class="w-8 h-8 rounded-full border-2 border-blue-100" alt="Avatar">
                                                <div>
                                                        <span class="font-semibold text-blue-700">${com.usuario.nombre}</span>
                                                        <span class="text-xs text-gray-500 ml-2">${tiempoTranscurrido(com.fecha)}</span>
                                                        <div class="text-sm text-gray-800">${com.text}</div>
                                                </div>
                                        </div>
                                `;
                        });
                }
        }

        // =========================
        // Publicar en Feed
        // =========================
        feedPublishBtn.onclick = function() {
                let mensaje = feedInput.value.trim();
                const etiquetaSelect = feedPublicarDiv.querySelector('select');
                const etiquetaValue = etiquetaSelect.value;
                if (!mensaje && !selectedFeedFile) {
                        alert('Escribe una memoria o selecciona un archivo para publicar.');
                        return;
                }
                if (!etiquetaValue) {
                        alert('Selecciona una etiqueta para tu publicación.');
                        etiquetaSelect.focus();
                        return;
                }
                let post = document.createElement('div');
                post.className = 'bg-white rounded-xl card-shadow p-4';
                let fecha = new Date();
                let hora = fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                let etiquetaHtml = etiquetas.find(e => e.value === etiquetaValue)?.html || '';
                let html = `
                        <div class="flex items-center mb-2 cursor-pointer" onclick="verPerfilUsuario('${usuarioActual.username}')">
                                <img src="${usuarioActual.avatar}" class="w-10 h-10 rounded-full mr-3 border-2 border-blue-200" alt="Avatar">
                                <div>
                                        <span class="font-semibold text-blue-700">${usuarioActual.nombre}</span>
                                        <span class="text-xs text-gray-500 ml-2">${hora}</span>
                                </div>
                        </div>
                        <div class="mb-2 text-gray-800">${mensaje ? mensaje : ''}</div>
                        ${etiquetaHtml}
                `;
                if (selectedFeedFile && selectedFeedType === 'foto') {
                        html += `<img src="${URL.createObjectURL(selectedFeedFile)}" class="rounded-lg max-w-xs mb-2" alt="Foto publicada">`;
                }
                if (selectedFeedFile && selectedFeedType === 'video') {
                        html += `<video controls class="rounded-lg max-w-xs mb-2"><source src="${URL.createObjectURL(selectedFeedFile)}"></video>`;
                }
                if (selectedFeedFile && selectedFeedType === 'audio') {
                        html += `<audio controls class="w-full mb-2"><source src="${URL.createObjectURL(selectedFeedFile)}"></audio>`;
                }
                post.innerHTML = html;
                crearBarraInteracciones(post, fecha);
                feedPostsContainer.prepend(post);
                feedInput.value = '';
                etiquetaSelect.value = '';
                selectedFeedFile = null;
                selectedFeedType = null;

                // Guardar en Firebase
                guardarPostEnFirebase({
                        fecha_publicacion: fecha.toISOString(),
                        text_post: mensaje,
                        tipo_post: selectedFeedType || 'texto',
                        ubicacion_publicacion: 'Nicaragua'
                });
        };

        // =========================
        // Publicar en Reels
        // =========================
        reelsPublishBtn.onclick = function() {
                let mensaje = reelsInput.value.trim();
                const etiquetaSelect = reelsPublicarDiv.querySelector('select');
                const etiquetaValue = etiquetaSelect.value;
                if (!mensaje && !selectedReelVideo) {
                        alert('Escribe una memoria o selecciona un video para publicar.');
                        return;
                }
                if (!etiquetaValue) {
                        alert('Selecciona una etiqueta para tu publicación.');
                        etiquetaSelect.focus();
                        return;
                }
                let fecha = new Date();
                let hora = fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                let etiquetaHtml = etiquetas.find(e => e.value === etiquetaValue)?.html || '';
                let post = document.createElement('div');
                post.className = 'bg-white rounded-xl card-shadow p-4';
                let html = `
                        <div class="flex items-center mb-2 cursor-pointer" onclick="verPerfilUsuario('${usuarioActual.username}')">
                                <img src="${usuarioActual.avatar}" class="w-10 h-10 rounded-full mr-3 border-2 border-blue-200" alt="Avatar">
                                <div>
                                        <span class="font-semibold text-blue-700">${usuarioActual.nombre}</span>
                                        <span class="text-xs text-gray-500 ml-2">${hora}</span>
                                </div>
                        </div>
                        <div class="mb-2 text-gray-800">${mensaje ? mensaje : ''}</div>
                        ${etiquetaHtml}
                `;
                if (selectedReelVideo) {
                        html += `<video controls class="rounded-lg max-w-xs mb-2"><source src="${URL.createObjectURL(selectedReelVideo)}"></video>`;
                }
                post.innerHTML = html;
                crearBarraInteracciones(post, fecha);
                reelsPostsContainer.prepend(post);
                reelsInput.value = '';
                etiquetaSelect.value = '';
                selectedReelVideo = null;

                guardarPostEnFirebase({
                        fecha_publicacion: fecha.toISOString(),
                        text_post: mensaje,
                        tipo_post: 'video',
                        ubicacion_publicacion: 'Nicaragua'
                });
        };

        // =========================
        // Publicar en Audios
        // =========================
        audiosPublishBtn.onclick = function() {
                let mensaje = audiosInput.value.trim();
                const etiquetaSelect = audiosPublicarDiv.querySelector('select');
                const etiquetaValue = etiquetaSelect.value;
                if (!mensaje && !selectedAudioFile) {
                        alert('Escribe una memoria o selecciona un audio para publicar.');
                        return;
                }
                if (!etiquetaValue) {
                        alert('Selecciona una etiqueta para tu publicación.');
                        etiquetaSelect.focus();
                        return;
                }
                let fecha = new Date();
                let hora = fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                let etiquetaHtml = etiquetas.find(e => e.value === etiquetaValue)?.html || '';
                let post = document.createElement('div');
                post.className = 'bg-white rounded-xl card-shadow p-4';
                let html = `
                        <div class="flex items-center mb-2 cursor-pointer" onclick="verPerfilUsuario('${usuarioActual.username}')">
                                <img src="${usuarioActual.avatar}" class="w-10 h-10 rounded-full mr-3 border-2 border-blue-200" alt="Avatar">
                                <div>
                                        <span class="font-semibold text-blue-700">${usuarioActual.nombre}</span>
                                        <span class="text-xs text-gray-500 ml-2">${hora}</span>
                                </div>
                        </div>
                        <div class="mb-2 text-gray-800">${mensaje ? mensaje : ''}</div>
                        ${etiquetaHtml}
                `;
                if (selectedAudioFile) {
                        html += `<audio controls class="w-full mb-2"><source src="${URL.createObjectURL(selectedAudioFile)}"></audio>`;
                }
                post.innerHTML = html;
                crearBarraInteracciones(post, fecha);
                audiosPostsContainer.prepend(post);
                audiosInput.value = '';
                etiquetaSelect.value = '';
                selectedAudioFile = null;

                guardarPostEnFirebase({
                        fecha_publicacion: fecha.toISOString(),
                        text_post: mensaje,
                        tipo_post: 'audio',
                        ubicacion_publicacion: 'Nicaragua'
                });
        }
});

// =========================
// Utilidad tiempo transcurrido
// =========================
function tiempoTranscurrido(fecha) {
        const ahora = new Date();
        const diff = Math.floor((ahora - fecha) / 1000);
        if (diff < 60) return `${diff} seg`;
        if (diff < 3600) return `${Math.floor(diff/60)} min`;
        if (diff < 86400) return `${Math.floor(diff/3600)} h`;
        return `${Math.floor(diff/86400)} d`;
}

// =========================
// Modal para agregar evento
// =========================
document.addEventListener('DOMContentLoaded', function() {
        const addEventBtn = document.querySelector('#calendar-section .bg-blue-600');
        let eventFormModal = document.getElementById('event-form-modal');
        if (!eventFormModal) {
                eventFormModal = document.createElement('div');
                eventFormModal.id = 'event-form-modal';
                eventFormModal.className = 'fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 hidden';
                eventFormModal.innerHTML = `
                        <div class="bg-white rounded-xl p-6 max-w-md w-full shadow-lg relative">
                                <button onclick="closeEventForm()" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl">&times;</button>
                                <h3 class="text-xl font-bold mb-4">Añadir Evento</h3>
                                <form id="new-event-form" class="space-y-3">
                                        <input type="text" id="event-title" class="w-full border rounded-lg px-3 py-2" placeholder="Título" required>
                                        <textarea id="event-desc" class="w-full border rounded-lg px-3 py-2" placeholder="Descripción" required></textarea>
                                        <input type="text" id="event-location" class="w-full border rounded-lg px-3 py-2" placeholder="Ubicación" required>
                                        <input type="date" id="event-date" class="w-full border rounded-lg px-3 py-2" required>
                                        <input type="time" id="event-time" class="w-full border rounded-lg px-3 py-2" required>
                                        <select id="event-ampm" class="w-full border rounded-lg px-3 py-2" required>
                                                <option value="AM">AM</option>
                                                <option value="PM">PM</option>
                                        </select>
                                        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full">Guardar Evento</button>
                                </form>
                        </div>
                `;
                document.body.appendChild(eventFormModal);
        }
        if (addEventBtn) {
                addEventBtn.onclick = function() {
                        eventFormModal.classList.remove('hidden');
                };
        }
        // Use a local function instead of assigning to window
        function closeEventForm() {
                eventFormModal.classList.add('hidden');
        }
        // Attach closeEventForm to the close button
        // The rest of the event modal logic is handled by the form's submit event elsewhere
});
document.addEventListener('DOMContentLoaded', function() {
        const profileCircles = document.querySelectorAll('.w-12.h-12');
        profileCircles.forEach(circle => {
                circle.addEventListener('click', function() {
                        if (currentUser && currentUser.username) {
                                window.location.href = 'perfil2.html?user=' + encodeURIComponent(currentUser.username);
                        }
                });
        });
});
// =========================
// Filtrado de biblioteca
// =========================
function filterLibrary(category, event) {
        const filters = document.querySelectorAll('.library-filter');
/* function filterLibrary(category, event) {
        // ...function body removed as it was unused
} */
// Juegos
// =========================
function startGame(gameType) {
        if (gameType === 'el gueguense') {
                window.location.href = 'gamegue.html';
                return;
        }
        const gameNames = {
                'memory': 'Memoria de Tradiciones',
                'puzzle': 'Rompecabezas Histórico',
                'quiz': 'Geografía Nica',
                'words': 'Palabras Cruzadas',
                'challenge': 'Desafío Semanal'
        };
        alert(`¡Iniciando ${gameNames[gameType]}! 🎮\n\nEsta funcionalidad se implementaría con lógica de juego completa.`);
}

// =========================
// Inicialización
// =========================
document.addEventListener('DOMContentLoaded', function() {
        showSection('feed');
});

// =========================
// Animaciones de tarjetas
// =========================
document.addEventListener('DOMContentLoaded', function() {
        const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                        if (entry.isIntersecting) {
                                entry.target.style.opacity = '1';
                                entry.target.style.transform = 'translateY(0)';
                        }
                });
        });
        const cards = document.querySelectorAll('.hover-lift');
        cards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(card);
        });
// function filterLibrary(category, event) {
//         const filters = document.querySelectorAll('.library-filter');
// }
/* function filterLibrary(category, event) {
        // ...function body removed as it was unused
} */
document.addEventListener('DOMContentLoaded', function() {
// function startGame(gameType) {
//         if (gameType === 'el gueguense') {
//                 window.location.href = 'gamegue.html';
//                 return;
//         }
//         const gameNames = {
//                 'memory': 'Memoria de Tradiciones',
//                 'puzzle': 'Rompecabezas Histórico',
//                 'quiz': 'Geografía Nica',
//                 'words': 'Palabras Cruzadas',
//                 'challenge': 'Desafío Semanal'
//         };
//         alert(`¡Iniciando ${gameNames[gameType]}! 🎮\n\nEsta funcionalidad se implementaría con lógica de juego completa.`);
// }
        const feedCircle = document.querySelector('#feed-section .bg-white.rounded-xl.card-shadow.p-6.mb-6 .flex.items-center.space-x-4 > .w-12.h-12');
        if (feedCircle) {
                feedCircle.innerHTML = `<img src="${usuarioActual.avatar}" class="w-12 h-12 rounded-full object-cover" alt="Perfil">`;
                feedCircle.style.background = 'none';
                feedCircle.style.padding = '0';
                feedCircle.style.display = 'flex';
                feedCircle.style.alignItems = 'center';
                feedCircle.style.justifyContent = 'center';
                feedCircle.style.cursor = 'pointer';
                feedCircle.onclick = function() {
                        window.location.href = 'perfil2.html?user=' + encodeURIComponent(usuarioActual.username);
                };
        }
        const reelsCircle = document.querySelector('#reels-section .bg-white.rounded-xl.card-shadow.p-6.mb-6 .flex.items-center.space-x-4 > .w-12.h-12');
        if (reelsCircle) {
                reelsCircle.innerHTML = `<img src="${usuarioActual.avatar}" class="w-12 h-12 rounded-full object-cover" alt="Perfil">`;
                reelsCircle.style.background = 'none';
                reelsCircle.style.padding = '0';
                reelsCircle.style.display = 'flex';
                reelsCircle.style.alignItems = 'center';
                reelsCircle.style.justifyContent = 'center';
                reelsCircle.style.cursor = 'pointer';
                reelsCircle.onclick = function() {
                        window.location.href = 'perfil2.html?user=' + encodeURIComponent(usuarioActual.username);
                };
        }
        const audiosCircle = document.querySelector('#audios-section .bg-white.rounded-xl.card-shadow.p-6.mb-6 .flex.items-center.space-x-4 > .w-12.h-12');
        if (audiosCircle) {
                audiosCircle.innerHTML = `<img src="${usuarioActual.avatar}" class="w-12 h-12 rounded-full object-cover" alt="Perfil">`;
                audiosCircle.style.background = 'none';
                audiosCircle.style.padding = '0';
                audiosCircle.style.display = 'flex';
                audiosCircle.style.alignItems = 'center';
                audiosCircle.style.justifyContent = 'center';
                audiosCircle.style.cursor = 'pointer';
                audiosCircle.onclick = function() {
                        window.location.href = 'perfil2.html?user=' + encodeURIComponent(usuarioActual.username);
                };
        }
});

// Mostrar nombre en el header si existe
document.addEventListener('DOMContentLoaded', function() {
        if (currentUser && currentUser.nombre_usuario) {
                const profileNameHeader = document.getElementById('profileNameHeader');
                if (profileNameHeader) {
                        profileNameHeader.textContent = currentUser.nombre_usuario;
                }
        }
});

// =========================
// Mapa interactivo con geolocalización y ubicaciones de publicaciones
// =========================
function inicializarMapaPublicaciones() {
        let mapaDiv = document.getElementById('mapa-publicaciones');
        if (!mapaDiv) {
                mapaDiv = document.createElement('div');
                mapaDiv.id = 'mapa-publicaciones';
                mapaDiv.style = 'width:100%;height:500px;border-radius:16px;overflow:hidden;margin-bottom:2rem;';
                const mapSection = document.querySelector('#map-section .bg-white.rounded-xl.card-shadow.p-6');
                if (mapSection) {
                        mapSection.insertBefore(mapaDiv, mapSection.children[2]);
                }
        }

        function crearMapa() {
                mapaDiv.innerHTML = '';
                const mapa = L.map('mapa-publicaciones').setView([12.1364, -86.2514], 7);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '© OpenStreetMap contributors'
                }).addTo(mapa);

                if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function(pos) {
                                const lat = pos.coords.latitude;
                                const lng = pos.coords.longitude;
                                L.marker([lat, lng]).addTo(mapa)
                                        .bindPopup('Tu ubicación actual').openPopup();
                                mapa.setView([lat, lng], 11);
                        });
                }

                // Ejemplo: publicaciones con ubicación
                const publicaciones = [
                        {
                                titulo: "Memoria en Masaya",
                                usuario: "María González",
                                etiqueta: "Tradiciones",
                                lat: 11.9744,
                                lng: -86.0942
                        },
                        {
                                titulo: "Leyenda en Granada",
                                usuario: "Carlos Mendoza",
                                etiqueta: "Leyendas",
                                lat: 11.9344,
                                lng: -85.9560
                        },
                        {
                                titulo: "Receta en León",
                                usuario: "Ana Rodríguez",
                                etiqueta: "Recetas",
                                lat: 12.4345,
                                lng: -86.8792
                        }
                ];

                publicaciones.forEach(pub => {
                        L.marker([pub.lat, pub.lng]).addTo(mapa)
                                .bindPopup(`<strong>${pub.titulo}</strong><br>
                                                        <span>${pub.usuario}</span><br>
                                                        <span class="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full">${pub.etiqueta}</span>`);
                });
        }

        if (typeof L === 'undefined') {
                const leafletCss = document.createElement('link');
                leafletCss.rel = 'stylesheet';
                leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(leafletCss);

                const leafletJs = document.createElement('script');
                leafletJs.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                leafletJs.onload = crearMapa;
                document.body.appendChild(leafletJs);
        } else {
                crearMapa();
        }
}

document.addEventListener('DOMContentLoaded', function() {
        const mapBtn = document.querySelector('button[onclick="showSection(\'map\')"]');
        if (mapBtn) {
                mapBtn.addEventListener('click', inicializarMapaPublicaciones);
        }
        if (!document.getElementById('map-section').classList.contains('hidden')) {
                inicializarMapaPublicaciones();
        }
});
