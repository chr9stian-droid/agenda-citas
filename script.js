const form = document.getElementById('formCita');
const listaCitas = document.getElementById('listaCitas');
const buscar = document.getElementById('buscar');
const btnCancelar = document.getElementById('btnCancelar');
const btnGuardar = document.getElementById('btnGuardar');
const idCitaInput = document.getElementById('idCita');

let citas = JSON.parse(localStorage.getItem('agendaCitas')) || [];

function guardarCitas() {
  localStorage.setItem('agendaCitas', JSON.stringify(citas));
}

function renderCitas() {
  const texto = buscar.value.toLowerCase();

  const citasFiltradas = citas.filter((cita) => {
    return (
      cita.nombre.toLowerCase().includes(texto) ||
      cita.servicio.toLowerCase().includes(texto)
    );
  });

  if (citasFiltradas.length === 0) {
    listaCitas.innerHTML = '<div class="vacio">No hay citas para mostrar.</div>';
    return;
  }

  listaCitas.innerHTML = '';

  citasFiltradas.forEach((cita) => {
    const div = document.createElement('div');
    div.className = 'cita';

    div.innerHTML = `
      <div class="cita-header">
        <h3>${cita.nombre}</h3>
        <span class="badge">${cita.estado}</span>
      </div>

      <p><strong>Servicio:</strong> ${cita.servicio}</p>
      <p><strong>Fecha:</strong> ${cita.fecha}</p>
      <p><strong>Hora:</strong> ${cita.hora}</p>
      <p><strong>Teléfono:</strong> ${cita.telefono || 'No registrado'}</p>
      <p><strong>Notas:</strong> ${cita.notas || 'Sin notas'}</p>

      <div class="cita-actions">
        <button class="editar" data-id="${cita.id}">Editar</button>
        <button class="eliminar" data-id="${cita.id}">Eliminar</button>
      </div>
    `;

    listaCitas.appendChild(div);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const cita = {
    id: idCitaInput.value || Date.now().toString(),
    nombre: document.getElementById('nombre').value.trim(),
    telefono: document.getElementById('telefono').value.trim(),
    servicio: document.getElementById('servicio').value.trim(),
    fecha: document.getElementById('fecha').value,
    hora: document.getElementById('hora').value,
    estado: document.getElementById('estado').value,
    notas: document.getElementById('notas').value.trim()
  };

  if (idCitaInput.value) {
    citas = citas.map((item) => item.id === cita.id ? cita : item);
  } else {
    citas.unshift(cita);
  }

  guardarCitas();
  renderCitas();

  form.reset();
  idCitaInput.value = '';
  btnGuardar.textContent = 'Guardar cita';
  btnCancelar.classList.add('hidden');
});

listaCitas.addEventListener('click', (e) => {
  const id = e.target.dataset.id;

  if (e.target.classList.contains('eliminar')) {
    citas = citas.filter((cita) => cita.id !== id);
    guardarCitas();
    renderCitas();
    return;
  }

  if (e.target.classList.contains('editar')) {
    const cita = citas.find((item) => item.id === id);
    if (!cita) return;

    idCitaInput.value = cita.id;
    document.getElementById('nombre').value = cita.nombre;
    document.getElementById('telefono').value = cita.telefono;
    document.getElementById('servicio').value = cita.servicio;
    document.getElementById('fecha').value = cita.fecha;
    document.getElementById('hora').value = cita.hora;
    document.getElementById('estado').value = cita.estado;
    document.getElementById('notas').value = cita.notas;

    btnGuardar.textContent = 'Actualizar cita';
    btnCancelar.classList.remove('hidden');
  }
});

btnCancelar.addEventListener('click', () => {
  form.reset();
  idCitaInput.value = '';
  btnGuardar.textContent = 'Guardar cita';
  btnCancelar.classList.add('hidden');
});

buscar.addEventListener('input', renderCitas);

renderCitas();
