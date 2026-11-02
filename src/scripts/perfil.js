document.addEventListener('DOMContentLoaded', () => {
    // MODAL BONITO CENTRADO PERSONALIZADO
    const modalSol = document.getElementById('modal-sol-exito');
    const modalSolMensaje = document.getElementById('modal-sol-mensaje');
    const modalSolTitulo = document.getElementById('modal-sol-titulo');
    const btnCerrarModalSol = document.getElementById('btn-cerrar-modal-sol');

    const mostrarModalBonito = (mensaje, titulo = '¡Éxito!') => {
        if (modalSol && modalSolMensaje) {
            modalSolMensaje.textContent = mensaje;
            if (modalSolTitulo) modalSolTitulo.textContent = titulo;
            modalSol.classList.remove('hidden');
            modalSol.classList.add('flex');
        } else {
            alert(mensaje); // Fallback por seguridad extrema
        }
    };

    if (btnCerrarModalSol && modalSol) {
        btnCerrarModalSol.addEventListener('click', () => {
            modalSol.classList.add('hidden');
            modalSol.classList.remove('flex');
        });
    }

    const sol = {
        toast: (msg) => mostrarModalBonito(msg, 'Aviso SUNAT')
    };

    const root = document.documentElement;

    const store = {
        get: (key) => { try { return localStorage.getItem(key); } catch { return null; } },
        set: (key, value) => {
            try {
                if (value === null) localStorage.removeItem(key);
                else localStorage.setItem(key, value);
            } catch {}
        },
    };

    // 1. HORA ACTUAL EN TIEMPO REAL
    const horaEl = document.getElementById('hora-ingreso-real');
    const actualizarHora = () => {
        if (!horaEl) return;
        const ahora = new Date();
        const opciones = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
        horaEl.textContent = `Hoy, ${ahora.toLocaleTimeString('es-PE', opciones)}`;
    };
    actualizarHora();
    setInterval(actualizarHora, 1000);

    // 2. MOSTRAR / OCULTAR CLAVE ACTUAL EN EL PERFIL
    const txtClaveMask = document.getElementById('txt-clave-actual-mask');
    const btnTogglePerfilPass = document.getElementById('btn-toggle-perfil-pass');
    let claveVisible = false;
    let claveActualValor = '12345678';

    if (btnTogglePerfilPass && txtClaveMask) {
        btnTogglePerfilPass.addEventListener('click', () => {
            claveVisible = !claveVisible;
            txtClaveMask.textContent = claveVisible ? claveActualValor : '••••••••';
            btnTogglePerfilPass.textContent = claveVisible ? 'Ocultar' : 'Mostrar';
        });
    }

    document.addEventListener('click', (event) => {
        const button = event.target instanceof Element ? event.target.closest('[data-simular]') : null;
        if (button && button.dataset.simular) sol.toast(button.dataset.simular);
    });

    const setMessage = (input, message, state) => {
        const status = document.getElementById(`${input.id}-estado`);
        input.classList.toggle('border-rose-500', state === 'error');
        input.classList.toggle('border-emerald-500', state === 'success');
        input.setAttribute('aria-invalid', state === 'error' ? 'true' : 'false');
        if (status) {
            status.textContent = message;
            status.className = `mt-1 text-[11px] font-semibold ${state === 'error' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`;
        }
    };

    // Progreso del perfil
    const CONTACT_KEY = 'sunat-perfil-contacto';
    const readContact = () => { try { return JSON.parse(store.get(CONTACT_KEY) || '{}'); } catch { return {}; } };

    const updateProgress = () => {
        const contact = readContact();
        const pasos = [true, true, Boolean(contact.correo), Boolean(contact.celular)];
        const value = Math.round((pasos.filter(Boolean).length / pasos.length) * 100);
        
        const barra = document.querySelector('#perfil-progreso-barra');
        const progreso = document.querySelector('#perfil-progreso');
        const texto = document.querySelector('#perfil-progreso-texto');
        const ayuda = document.querySelector('#perfil-progreso-ayuda');

        if (barra) barra.style.width = `${value}%`;
        if (progreso) progreso.setAttribute('aria-valuenow', String(value));
        if (texto) texto.textContent = `${value}%`;
        
        if (ayuda) {
            const faltan = [!contact.correo && 'tu correo', !contact.celular && 'tu celular'].filter(Boolean);
            ayuda.innerHTML = '';
            if (faltan.length) {
                const link = document.createElement('a');
                link.href = '#contacto';
                link.className = 'text-[#0877a7] underline font-bold dark:text-sky-400';
                link.textContent = `Agrega ${faltan.join(' y ')}`;
                ayuda.append(link, ' para recibir avisos.');
            } else {
                ayuda.textContent = '¡Tu perfil está completo!';
            }
        }
    };

    // Contacto
    const form = document.querySelector('#form-contacto');
    const correo = document.querySelector('#correo');
    const celular = document.querySelector('#celular');

    const fillContact = () => {
        const contact = readContact();
        if (correo) correo.value = contact.correo || '';
        if (celular) celular.value = contact.celular || '';
        if (correo) setMessage(correo, '', '');
        if (celular) setMessage(celular, '', '');
    };

    const validarCorreo = () => {
        if (!correo) return true;
        const value = correo.value.trim();
        if (!value) return setMessage(correo, '', ''), true;
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
        setMessage(correo, ok ? 'Correo válido.' : 'Revisa el correo (ej. nombre@correo.com)', ok ? 'success' : 'error');
        return ok;
    };

    const validarCelular = () => {
        if (!celular) return true;
        const value = celular.value;
        if (!value) return setMessage(celular, '', ''), true;
        if (!/^9/.test(value)) return setMessage(celular, 'El celular debe empezar con 9.', 'error'), false;
        if (value.length < 9) {
            const faltan = 9 - value.length;
            return setMessage(celular, `${faltan === 1 ? 'Falta 1 dígito' : `Faltan ${faltan} dígitos`}.`, 'error'), false;
        }
        setMessage(celular, 'Celular válido.', 'success');
        return true;
    };

    if (celular) {
        celular.addEventListener('input', () => {
            const digits = celular.value.replace(/\D/g, '');
            if (digits !== celular.value) celular.value = digits;
            validarCelular();
        });
    }

    if (correo) correo.addEventListener('blur', validarCorreo);

    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const okCorreo = validarCorreo();
            const okCelular = validarCelular();
            if (!okCorreo) return correo.focus();
            if (!okCelular) return celular.focus();
            store.set(CONTACT_KEY, JSON.stringify({ correo: correo.value.trim(), celular: celular.value }));
            updateProgress();
            sol.toast('Guardamos tus datos de contacto.');
        });

        form.addEventListener('reset', (event) => {
            event.preventDefault();
            fillContact();
            sol.toast('Restauramos los datos que tenías guardados.');
        });
    }

    // Cambio de clave
    const formClave = document.querySelector('#form-clave');
    const nueva = document.querySelector('#clave-nueva');
    const confirmar = document.querySelector('#clave-confirmar');
    const fuerza = document.querySelector('#clave-fuerza');

    const reglas = () => ({
        largo: nueva?.value.length >= 8 && nueva?.value.length <= 12,
        letra: /[a-zA-Z]/.test(nueva?.value || ''),
        numero: /\d/.test(nueva?.value || ''),
        distinta: nueva?.value.length > 0 && nueva?.value !== claveActualValor,
    });

    const pintarReglas = () => {
        if (!nueva || !fuerza) return false;
        const r = reglas();
        const cumplidas = Object.values(r).filter(Boolean).length;
        Object.entries(r).forEach(([id, ok]) => {
            const li = formClave?.querySelector(`[data-regla="${id}"]`);
            if (li) {
                li.classList.toggle('text-emerald-600', ok);
                const iconSpan = li.querySelector('span');
                if (iconSpan) {
                    iconSpan.className = ok 
                        ? 'grid h-4 w-4 place-items-center rounded-full bg-emerald-500 text-white' 
                        : 'grid h-4 w-4 place-items-center rounded-full border border-slate-400 text-slate-400';
                }
            }
        });
        fuerza.style.width = `${(cumplidas / 4) * 100}%`;
        fuerza.className = `h-full rounded-full transition-all ${cumplidas <= 1 ? 'bg-rose-500' : cumplidas < 4 ? 'bg-amber-500' : 'bg-emerald-500'}`;
        return cumplidas === 4;
    };

    const validarConfirmacion = () => {
        if (!confirmar || !nueva) return false;
        if (!confirmar.value) return setMessage(confirmar, '', ''), false;
        const ok = confirmar.value === nueva.value;
        setMessage(confirmar, ok ? 'Las claves coinciden.' : 'Las claves no coinciden.', ok ? 'success' : 'error');
        return ok;
    };

    if (nueva) {
        nueva.addEventListener('input', () => {
            pintarReglas();
            if (confirmar?.value) validarConfirmacion();
        });
    }

    if (confirmar) confirmar.addEventListener('input', validarConfirmacion);

    formClave?.querySelectorAll('[data-ver-clave]').forEach((button) =>
        button.addEventListener('click', () => {
            const input = document.getElementById(button.dataset.verClave);
            const show = input.type === 'password';
            input.type = show ? 'text' : 'password';
            if (confirmar) confirmar.type = input.type;
            button.textContent = show ? 'Ocultar' : 'Mostrar';
            button.setAttribute('aria-pressed', String(show));
        }),
    );

    if (formClave) {
        formClave.addEventListener('submit', (event) => {
            event.preventDefault();
            if (!pintarReglas()) return sol.toast('La nueva clave aún no cumple todos los requisitos.'), nueva.focus();
            if (!validarConfirmacion()) {
                setMessage(confirmar, 'Repite la nueva clave para confirmarla.', 'error');
                return confirmar.focus();
            }
            
            claveActualValor = nueva.value;
            if (txtClaveMask) {
                txtClaveMask.textContent = claveVisible ? claveActualValor : '••••••••';
            }

            formClave.reset();
            pintarReglas();
            [nueva, confirmar].forEach((input) => setMessage(input, '', ''));
            sol.toast('Tu Clave SOL se actualizó correctamente.');
        });
    }

    // Preferencias: tema
    const temaRadios = [...document.querySelectorAll('input[name="tema"]')];
    const syncTemaRadios = () => {
        const stored = store.get('sunat-theme') || 'system';
        temaRadios.forEach((r) => (r.checked = r.value === stored));
    };

    temaRadios.forEach((radio) =>
        radio.addEventListener('change', () => {
            const value = radio.value;
            const dark = value === 'system' ? matchMedia('(prefers-color-scheme: dark)').matches : value === 'dark';
            store.set('sunat-theme', value === 'system' ? null : value);
            root.classList.toggle('dark', dark);
            root.dataset.theme = dark ? 'dark' : 'light';
        }),
    );

    // Preferencias: tamaño de texto
    const textoRadios = [...document.querySelectorAll('input[name="texto"]')];
    const textoActual = store.get('sunat-texto') || 'normal';

    textoRadios.forEach((radio) => {
        radio.checked = radio.value === textoActual;
        radio.addEventListener('change', () => {
            root.dataset.texto = radio.value;
            store.set('sunat-texto', radio.value === 'normal' ? null : radio.value);
            
            const nombreTamano = radio.parentElement.textContent.trim().replace(/^Aa\s*/, '');
            sol.toast(`Se ha aplicado el tamaño "${nombreTamano}" en todo el sistema.`);
        });
    });

    // Resaltar sección activa en menú lateral
    const links = [...document.querySelectorAll('[data-seccion-link]')];
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                links.forEach((link) => {
                    if (link.dataset.seccionLink === entry.target.id) {
                        link.classList.add('bg-[#0877a7]', 'text-white', 'shadow-sm');
                        link.classList.remove('text-slate-600', 'dark:text-slate-400');
                    } else {
                        link.classList.remove('bg-[#0877a7]', 'text-white', 'shadow-sm');
                        link.classList.add('text-slate-600', 'dark:text-slate-400');
                    }
                });
            });
        },
        { rootMargin: '-40% 0px -55% 0px' },
    );
    document.querySelectorAll('[data-seccion]').forEach((section) => observer.observe(section));

    fillContact();
    updateProgress();
    syncTemaRadios();
    pintarReglas();
});