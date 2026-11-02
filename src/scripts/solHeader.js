document.addEventListener('DOMContentLoaded', () => {
    // Función para mostrar el modal de cierre de sesión dinámico y centrado
    const mostrarModalCierreSesion = (razon) => {
        // Si ya existe el modal en el DOM, no volver a crearlo
        if (document.getElementById('modal-cierre-sesion-custom')) return;

        const textoRazon = razon === 'inactividad' ? 'por inactividad' : 'correctamente';

        // Inyección del modal estético con diseño Tailwind (estilo SUNAT)
        const modalHtml = `
            <div id="modal-cierre-sesion-custom" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 transition-opacity duration-200">
                <div class="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800 text-center space-y-4">
                    <div class="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-base font-black text-slate-900 dark:text-white">Cerrando sesión</h3>
                        <p class="mt-1 text-xs text-slate-600 dark:text-slate-400">
                            Has salido ${textoRazon}. Redirigiendo al inicio...
                        </p>
                    </div>
                    <div class="pt-2">
                        <div class="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                            <div class="h-full w-full bg-[#0877a7] animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Muestra el modal durante 1.2 segundos y luego redirige a /
        setTimeout(() => {
            window.location.href = '/';
        }, 1200);
    };

    // Declaración del objeto global SUNAT SOL asociando la salida al modal personalizado
    const sol = window.sunatSol || {
        logout: (razon) => {
            mostrarModalCierreSesion(razon);
        }
    };
    window.sunatSol = sol;

    // 1. Lectura de mensajes sin leer del buzón
    try {
        const leidos = JSON.parse(localStorage.getItem('sunat-sol-leidos') || '[]');
        const nuevos = ['msg-1', 'msg-2'].filter((id) => !leidos.includes(id)).length;
        document.querySelectorAll('[data-buzon-badge]').forEach((el) => {
            el.textContent = String(nuevos);
            el.hidden = nuevos === 0;
        });
    } catch (e) {
        console.error('Error al leer mensajes del buzón:', e);
    }

    // 2. Reloj vivo en tiempo real con fecha y segundos
    const clock = document.querySelector('#sol-reloj');
    const updateClock = () => {
        if (!clock) return;
        const now = new Date();
        const text = now.toLocaleString('es-PE', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
        clock.textContent = text.charAt(0).toUpperCase() + text.slice(1);
        clock.dateTime = now.toISOString();
    };

    updateClock();
    setInterval(updateClock, 1000);

    // 3. Menú desplegable de usuario
    const menuButton = document.querySelector('#user-menu-button');
    const menu = document.querySelector('#user-menu');
    const getMenuItems = () => menu ? [...menu.querySelectorAll('[role="menuitem"]')] : [];

    const setMenu = (open, focusFirst = false) => {
        if (!menu || !menuButton) return;
        menu.hidden = !open;
        menuButton.setAttribute('aria-expanded', String(open));
        if (open && focusFirst) getMenuItems()[0]?.focus();
    };

    if (menuButton && menu) {
        menuButton.addEventListener('click', () => setMenu(menu.hidden, true));
        menu.addEventListener('keydown', (event) => {
            const list = getMenuItems();
            const index = list.indexOf(document.activeElement);
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                list[(index + 1) % list.length].focus();
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                list[(index - 1 + list.length) % list.length].focus();
            } else if (event.key === 'Escape') {
                setMenu(false);
                menuButton.focus();
            }
        });
        document.addEventListener('click', (event) => {
            if (!menu.hidden && !event.target.closest('[data-user-menu]')) setMenu(false);
        });
    }

    // 4. Menú móvil
    const mobileToggle = document.querySelector('#sol-menu-toggle');
    const mobileMenu = document.querySelector('#sol-menu-movil');
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            const open = mobileMenu.hidden;
            mobileMenu.hidden = !open;
            mobileToggle.setAttribute('aria-expanded', String(open));
            const iconOpen = mobileToggle.querySelector('[data-icon-open]');
            const iconClose = mobileToggle.querySelector('[data-icon-close]');
            if (iconOpen) iconOpen.hidden = open;
            if (iconClose) iconClose.hidden = !open;
        });
    }

    // 5. Gestión de cierre de sesión (Llama al modal sin abrir alertas ni diálogos del navegador)
    const idleDialog = document.querySelector('#dialogo-inactividad');

    document.addEventListener('click', (event) => {
        const target = event.target instanceof Element ? event.target : null;
        if (!target) return;

        if (target.closest('[data-logout]')) {
            event.preventDefault();
            setMenu(false);
            sol.logout('salida');
        } else if (target.closest('[data-confirm-logout]')) {
            event.preventDefault();
            sol.logout('salida');
        } else if (target.closest('[data-dialog-cancel]')) {
            const dialog = target.closest('dialog');
            if (dialog) dialog.close();
        }
    });

    // 6. Temporizador regresivo en tiempo real (15:00 -> 00:00) y auto-cerrar sesión
    const LIMIT = 15 * 60; 
    const WARNING = 60;   
    const timer = document.querySelector('#sol-timer');
    const idleCount = document.querySelector('#inactividad-cuenta');
    let remaining = LIMIT;

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const countdownInterval = setInterval(() => {
        remaining -= 1;

        if (timer) {
            timer.textContent = formatTime(Math.max(remaining, 0));
        }

        if (remaining <= WARNING && remaining > 0) {
            if (idleDialog && !idleDialog.open && typeof idleDialog.showModal === 'function') {
                idleDialog.showModal();
            }
            if (idleCount) {
                idleCount.textContent = String(remaining);
            }
        }

        if (remaining <= 0) {
            clearInterval(countdownInterval);
            if (idleDialog && idleDialog.open) idleDialog.close();
            sol.logout('inactividad');
        }
    }, 1000);

    if (idleDialog) {
        idleDialog.addEventListener('close', () => {
            remaining = LIMIT;
        });
    }
});