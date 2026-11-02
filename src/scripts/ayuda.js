document.addEventListener('DOMContentLoaded', () => {
    const modalAyuda = document.getElementById('modal-ayuda-exito');
    const modalTitulo = document.getElementById('modal-ayuda-titulo');
    const modalMensaje = document.getElementById('modal-ayuda-mensaje');
    const btnCerrarModal = document.getElementById('btn-cerrar-modal-ayuda');

    const mostrarModal = (titulo, mensaje) => {
        if (modalAyuda && modalTitulo && modalMensaje) {
            modalTitulo.textContent = titulo;
            modalMensaje.textContent = mensaje;
            modalAyuda.classList.remove('hidden');
            modalAyuda.classList.add('flex');
        }
    };

    if (btnCerrarModal && modalAyuda) {
        btnCerrarModal.addEventListener('click', () => {
            modalAyuda.classList.add('hidden');
            modalAyuda.classList.remove('flex');
        });
    }

    // ALTERNAR SUBTÍTULOS SIN MODAL
    const btnSubtitulos = document.getElementById('btn-toggle-subtitulos');
    const txtSubtitulos = document.getElementById('txt-subtitulos');
    const subtitulosOverlay = document.getElementById('subtitulos-overlay');
    let subActivos = false;

    if (btnSubtitulos && txtSubtitulos) {
        btnSubtitulos.addEventListener('click', () => {
            subActivos = !subActivos;
            btnSubtitulos.setAttribute('aria-pressed', String(subActivos));
            
            if (subActivos) {
                btnSubtitulos.classList.add('bg-[#0877a7]', 'text-white', 'border-[#0877a7]');
                btnSubtitulos.classList.remove('bg-slate-800', 'text-slate-300', 'border-slate-700');
                txtSubtitulos.textContent = 'Subtítulos: ON';
                if (subtitulosOverlay) subtitulosOverlay.classList.remove('hidden');
            } else {
                btnSubtitulos.classList.remove('bg-[#0877a7]', 'text-white', 'border-[#0877a7]');
                btnSubtitulos.classList.add('bg-slate-800', 'text-slate-300', 'border-slate-700');
                txtSubtitulos.textContent = 'Subtítulos: OFF';
                if (subtitulosOverlay) subtitulosOverlay.classList.add('hidden');
            }
        });
    }

    // Copiar transcripción al portapapeles
    const btnCopiar = document.getElementById('btn-copiar-transcripcion');
    const contenedorTranscripcion = document.getElementById('contenedor-transcripcion');
    if (btnCopiar && contenedorTranscripcion) {
        btnCopiar.addEventListener('click', () => {
            const texto = contenedorTranscripcion.innerText;
            navigator.clipboard.writeText(texto).then(() => {
                mostrarModal('Texto copiado', 'La transcripción se ha copiado al portapapeles correctamente.');
            }).catch(() => {
                mostrarModal('Error', 'No se pudo copiar el texto.');
            });
        });
    }

    // Resaltar paso guiado al hacer clic
    const pasos = document.querySelectorAll('[data-paso-item]');
    pasos.forEach((paso) => {
        paso.addEventListener('click', () => {
            pasos.forEach(p => p.classList.remove('border-[#0877a7]', 'bg-sky-50/50', 'dark:bg-sky-950/20'));
            paso.classList.add('border-[#0877a7]', 'bg-sky-50/50', 'dark:bg-sky-950/20');
        });
    });

    // Marcar Guía como Aprendida
    const btnMarcar = document.getElementById('btn-marcar-completado');
    if (btnMarcar) {
        btnMarcar.addEventListener('click', () => {
            mostrarModal('¡Felicitaciones!', 'Has marcado esta guía como aprendida. Ahora estás listo para emitir tu primera factura.');
        });
    }
});