// Elementos principales del formulario
const formulario = document.getElementById('formulario');
const mensaje = document.getElementById('mensaje');
const contenedorFormulario = document.getElementById('formulario-container');
const noAsistiraBtn = document.getElementById('noAsistiraBtn');
const INVITADOS_API = 'https://script.google.com/macros/s/AKfycbzK4ePx3BVIKZkABheMyH2szzZgOrYJZWoJ-taS5IUZ_gZQ1rR6PC56DguTfs9lasuk/exec';

// Evento para envío del formulario (Confirmar asistencia)
if (formulario) {
  formulario.addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const tipoDocumento = document.getElementById('tipoDocumento').value;
    const numeroDocumento = document.getElementById('numeroDocumento').value;

    // Cambia la URL por la de tu Apps Script
    fetch(INVITADOS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        nombre,
        tipoDocumento,
        numeroDocumento,
        estado: 'confirmado'
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.result === "ok") {
        mostrarMensajeConfirmado();
      } else {
        alert("No se encontró el invitado en la lista.");
      }
    })
    .catch(() => alert("Error al registrar la confirmación."));
  });
}

// Evento para el botón "No podré asistir"
if (noAsistiraBtn) {
  noAsistiraBtn.addEventListener('click', function () {
    const nombre = document.getElementById('nombre').value;
    const tipoDocumento = document.getElementById('tipoDocumento').value;
    const numeroDocumento = document.getElementById('numeroDocumento').value;

    if (!nombre) {
      alert('Por favor selecciona tu nombre antes de continuar.');
      document.getElementById('nombre').focus();
      return;
    }

    fetch(INVITADOS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        nombre,
        tipoDocumento,
        numeroDocumento,
        estado: 'no asistirá'
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.result === "ok") {
        mostrarMensajeNoAsiste();
      } else {
        alert("No se encontró el invitado en la lista.");
      }
    })
    .catch(() => alert("Error al registrar la respuesta."));
  });
}

// Botones tipo toggle para tipo de documento
document.querySelectorAll('.tipo-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.tipo-btn').forEach(b => b.classList.remove('selected'));
    this.classList.add('selected');
    const inputTipo = document.getElementById('tipoDocumento');
    if (inputTipo) inputTipo.value = this.dataset.value;
  });
});

// Mensaje de confirmación de asistencia
function mostrarMensajeConfirmado() {
  if (contenedorFormulario && mensaje) {
    contenedorFormulario.style.display = "none";
    mensaje.style.display = "block";
    mensaje.style.color = "#2b9348";
    mensaje.innerHTML = `
      <p>🎉 <strong>Muchas gracias por confirmar.</strong></p>
      <p>Nos alegra mucho que hagas parte de esta reunión.</p>
      <p>Puedes revisar la lista de regalos, pero no te preocupes, tu asistencia siempre será lo más valioso para nosotros.</p>
      <div class="buttons">
        <a href="https://babymania.com.co/" class="boton" target="_blank">Ver regalos 🎁</a>
        <a href="index.html" class="boton">Volver a la invitación 📝</a>
      </div>
    `;
  }
}

// Mensaje para quienes no asisten
function mostrarMensajeNoAsiste() {
  if (contenedorFormulario && mensaje) {
    contenedorFormulario.style.display = "none";
    mensaje.style.display = "block";
    mensaje.style.color = "#0077b6";
    mensaje.innerHTML = `
      <p>🙏🏻 <strong>Muchas gracias por confirmar.</strong></p>
      <p>Sabemos que estarás de corazón con nosotros. ¡Un abrazo!</p>
      <div class="buttons">
        <a href="index.html" class="boton">Volver a la invitación 📝</a>
        <a href="https://babymania.com.co/" class="boton" target="_blank">Ver regalos 🎁</a>
      </div>
    `;
  }
}

function cargarInvitados() {
  fetch(INVITADOS_API)
    .then(res => res.json())
    .then(invitados => {
      const select = document.getElementById('nombre');
      if (select && Array.isArray(invitados)) {
        invitados.forEach(nombre => {
          const option = document.createElement('option');
          option.value = nombre;
          option.textContent = nombre;
          select.appendChild(option);
        });
      }
    });
}
cargarInvitados();