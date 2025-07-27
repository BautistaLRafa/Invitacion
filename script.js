// Inicializar Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAKh0yO1vIZNNZdd0W8SExZvN-Uh6UyRSc",
  authDomain: "babyshowerflabp.firebaseapp.com",
  databaseURL: "https://babyshowerflabp-default-rtdb.firebaseio.com",
  projectId: "babyshowerflabp",
  storageBucket: "babyshowerflabp.appspot.com",
  messagingSenderId: "81594410327",
  appId: "1:81594410327:web:07c5407622b03529784a12"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Lista de invitados
const nombres = [
  "Abelis Ortiz Molina", "Alejandro Garcia", "Alvaro Hernan Polo", "Amarilis Garcia", "Angie de Angel",
  "Beto Munive", "Bella Lopez", "Candelaria Lopez", "Cenit Peña", "Daily Bohorquez",
  "Daniela Bautista", "Diana Manjarrés Camargo", "Douglas Herazo", "Eduardo Rivero", "Electo Peña",
  "Elerney Garcia", "Elizabeth Romero", "Elias Royero", "Esther Alvarez", "Fabián Munive",
  "Gisela Lopez", "Helena Navarro Castaño", "Helena Villegas", "Hernando Mora Valderrama", "Irina Garcia",
  "Ivana Munive", "Jasmit Peña", "Johana Barrera", "Jose Saboyá", "Juan Carlos Ramos",
  "Juan Camilo Villegas", "Juan Lopez", "Jorsff Navarro Acuña", "Karen Vega", "Khaterine Hernandez",
  "Laura Alvarez", "Leandro Alvarez", "Lian Martinez", "Lina Mora Valderrama", "Lizeth Diaz Bolivar",
  "Lizzy Martinez", "Lourdes Maria Peña", "Luz marina Peña", "Maira Daza", "María Victoria Alfonso Diaz",
  "María camila Mendoza", "Mateo Bautista", "Naileth Lopez", "Noemi Polo", "Raquel Peña", "Rafael Bautista",
  "Sandra Mendoza", "Santiago Royero", "Saudith Garcia Caro", "Sebastián Diaz", "Sharon Alvarez",
  "Sofía Villegas", "Thalía Murillo", "Valentín Diaz Mendoza", "Valeria Peña", "Vanely Bohorquez",
  "Viviana Contreras", "Yaneth Peña", "Yoleida Castaño", "Zoraida Lopez"
];

// Subir lista solo si no existe (evitar duplicados)
nombres.forEach(nombre => {
  const key = nombre.toLowerCase().replace(/\s+/g, "_");
  const ref = db.ref("invitados/" + key);
  ref.once("value", snapshot => {
    if (!snapshot.exists()) {
      ref.set({
        nombre: nombre,
        estado: "esperando respuesta"
      });
    }
  });
});

// UI Elements
const formulario = document.getElementById('formulario');
const mensaje = document.getElementById('mensaje');
const contenedorFormulario = document.getElementById('formulario-container');
const noAsistiraBtn = document.getElementById('noAsistiraBtn');

// Llenar el select con los nombres
function cargarInvitados() {
  const select = document.getElementById('nombre');
  nombres.forEach(nombre => {
    const option = document.createElement('option');
    option.value = nombre;
    option.textContent = nombre;
    select.appendChild(option);
  });
}
cargarInvitados();

// Botones de tipo de documento
document.querySelectorAll('.tipo-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.tipo-btn').forEach(b => b.classList.remove('selected'));
    this.classList.add('selected');
    const inputTipo = document.getElementById('tipoDocumento');
    if (inputTipo) inputTipo.value = this.dataset.value;
  });
});

// Confirmar asistencia
formulario.addEventListener('submit', function (e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const tipoDocumento = document.getElementById('tipoDocumento').value;
  const numeroDocumento = document.getElementById('numeroDocumento').value;
  const key = nombre.toLowerCase().replace(/\s+/g, "_");

  if (!nombre || !tipoDocumento || !numeroDocumento) {
    alert("Por favor completa todos los campos.");
    return;
  }

  db.ref("invitados/" + key).update({
    tipoDocumento,
    numeroDocumento,
    estado: "confirmado",
    fecha: new Date().toISOString()
  }).then(() => {
    mostrarMensajeConfirmado();
  }).catch(() => {
    alert("Error al registrar confirmación.");
  });
});

// No podrá asistir
noAsistiraBtn.addEventListener('click', function () {
  const nombre = document.getElementById('nombre').value;
  const tipoDocumento = document.getElementById('tipoDocumento').value;
  const numeroDocumento = document.getElementById('numeroDocumento').value;
  const key = nombre.toLowerCase().replace(/\s+/g, "_");

  if (!nombre) {
    alert("Por favor selecciona tu nombre.");
    return;
  }

  db.ref("invitados/" + key).update({
    tipoDocumento,
    numeroDocumento,
    estado: "no asistirá",
    fecha: new Date().toISOString()
  }).then(() => {
    mostrarMensajeNoAsiste();
  }).catch(() => {
    alert("Error al registrar respuesta.");
  });
});

// Mensajes visuales
function mostrarMensajeConfirmado() {
  contenedorFormulario.style.display = "none";
  mensaje.style.display = "block";
  mensaje.style.color = "#2b9348";
  mensaje.innerHTML = `
    <p>🎉 <strong>Muchas gracias por confirmar.</strong></p>
    <p>Nos alegra mucho que hagas parte de esta reunión.</p>
    <p>Puedes revisar la lista de regalos, pero tu asistencia es lo más valioso.</p>
    <div class="buttons">
      <a href="regalos.html" class="boton" target="_blank">Ver regalos 🎁</a>
      <a href="index.html" class="boton">Volver a la invitación 📝</a>
    </div>
  `;
}

function mostrarMensajeNoAsiste() {
  contenedorFormulario.style.display = "none";
  mensaje.style.display = "block";
  mensaje.style.color = "#0077b6";
  mensaje.innerHTML = `
    <p>🙏🏻 <strong>Gracias por confirmar.</strong></p>
    <p>Sabemos que estarás de corazón con nosotros. ¡Un abrazo!</p>
    <div class="buttons">
      <a href="index.html" class="boton">Volver a la invitación 📝</a>
      <a href="regalos.html" class="boton" target="_blank">Ver regalos 🎁</a>
    </div>
  `;
}
