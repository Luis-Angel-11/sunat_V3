document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('buzon-modal');
    const closeBtn = document.getElementById('close-buzon-modal');
    const container = document.getElementById('lista-mensajes-buzon');

    // Estado inicial de los mensajes
    const mensajesIniciales = [
        {
            id: 'msg-1',
            titulo: 'Constancia de presentación – Declaración mensual (Formulario 621)',
            fecha: '30 oct. 2026',
            resumen: 'Tu declaración del periodo setiembre 2026 fue recibida correctamente. Puedes descargar la constancia desde Consultar declaraciones y pagos.'
        },
        {
            id: 'msg-2',
            titulo: 'Recordatorio: actualiza tus datos de contacto',
            fecha: '28 oct. 2026',
            resumen: 'Verifica y actualiza tu correo electrónico y teléfono celular registrados en tu Ficha RUC para recibir alertas importantes.'
        },
        {
            id: 'msg-3',
            titulo: 'Bienvenido al nuevo Menú SOL',
            fecha: '15 oct. 2026',
            resumen: 'Te damos la bienvenida a la plataforma mejorada de Operaciones en Línea. Disfruta de un acceso más rápido a tus trámites frecuentes.'
        }
    ];

    // Leer mensajes leídos guardados en localStorage
    const getLeidos = () => JSON.parse(localStorage.getItem('sunat-sol-leidos') || '[]');

    // Actualizar badges en Header y tarjeta lateral
    const actualizarBadges = () => {
        const leidos = getLeidos();
        const noLeidosCount = mensajesIniciales.filter(m => !leidos.includes(m.id)).length;

        document.querySelectorAll('[data-buzon-badge], [data-open-buzon] span').forEach(badge => {
            badge.textContent = String(noLeidosCount);
            if (badge.hasAttribute('hidden')) {
                badge.hidden = noLeidosCount === 0;
            }
        });

        const textoTarjeta = document.querySelector('[data-open-buzon] h4');
        if (textoTarjeta) {
            textoTarjeta.textContent = noLeidosCount > 0 
                ? `Tienes ${noLeidosCount} nuevo${noLeidosCount > 1 ? 's' : ''} en tu buzón`
                : 'No tienes mensajes nuevos';
        }
    };

    // Renderizar lista interactiva
    const renderMensajes = () => {
        if (!container) return;
        const leidos = getLeidos();
        container.innerHTML = '';

        mensajesIniciales.forEach(msg => {
            const isLeido = leidos.includes(msg.id);
            const card = document.createElement('div');
            card.className = `mensaje-item rounded-2xl border transition-all cursor-pointer p-4 overflow-hidden ${
                !isLeido
                    ? 'border-amber-300 bg-amber-50/80 dark:border-amber-900/60 dark:bg-amber-950/30'
                    : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
            }`;

            card.innerHTML = `
                <div class="flex items-start justify-between gap-3">
                    <div class="flex-1">
                        <div class="flex items-center justify-between gap-2">
                            <h3 class="text-xs font-extrabold text-slate-900 dark:text-white leading-snug">
                                ${msg.titulo}
                            </h3>
                            ${!isLeido ? `<span class="badge-nuevo text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 shrink-0">NUEVO</span>` : ''}
                        </div>
                        <p class="mt-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                            ${msg.fecha}
                        </p>
                    </div>
                </div>
                <div class="contenido-desplegable hidden mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800">
                    <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        ${msg.resumen}
                    </p>
                </div>
            `;

            // Al hacer clic: desplegar texto + cambiar color de amarillo a blanco
            card.addEventListener('click', () => {
                const contenido = card.querySelector('.contenido-desplegable');
                const isHidden = contenido.classList.contains('hidden');

                // Abrir/cerrar desplegable
                if (isHidden) {
                    contenido.classList.remove('hidden');
                } else {
                    contenido.classList.add('hidden');
                }

                // Marcar como leído si aún era nuevo
                const leidosActuales = getLeidos();
                if (!leidosActuales.includes(msg.id)) {
                    leidosActuales.push(msg.id);
                    localStorage.setItem('sunat-sol-leidos', JSON.stringify(leidosActuales));

                    // Cambiar estilos de la tarjeta instantáneamente
                    card.className = 'mensaje-item rounded-2xl border transition-all cursor-pointer p-4 overflow-hidden border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900';
                    const badge = card.querySelector('.badge-nuevo');
                    if (badge) badge.remove();

                    actualizarBadges();
                }
            });

            container.appendChild(card);
        });
    };

    // Apertura y cierre del Modal
    if (modal) {
        const openModal = (e) => {
            if (e) e.preventDefault();
            renderMensajes();
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        };

        const closeModal = () => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        };

        document.querySelectorAll('[data-open-buzon], a[href="#buzon"], a[href="/sol#buzon"]').forEach(el => {
            el.addEventListener('click', openModal);
        });

        if (closeBtn) closeBtn.addEventListener('click', closeModal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                closeModal();
            }
        });
    }

    actualizarBadges();
});