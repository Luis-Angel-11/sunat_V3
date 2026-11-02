document.addEventListener('DOMContentLoaded', () => {
    let currentStep = 1;
    const totalSteps = 4;
    let archivosAdjuntos = [];

    // Referencias DOM
    const btnNext = document.querySelector('#btn-next-step');
    const btnPrev = document.querySelector('#btn-prev-step');
    const btnSubmit = document.querySelector('#btn-submit-reclamacion');
    const form = document.querySelector('#form-libro-reclamaciones');
    const modal = document.querySelector('#modal-exito-reclamacion');

    // Campos Paso 1
    const presCelular = document.querySelector('#pres-celular');
    const presCorreo = document.querySelector('#pres-correo');

    // Campos Paso 2
    const btnTemas = document.querySelectorAll('.btn-tema');
    const inputTema = document.querySelector('#tema-seleccionado');

    // Campos Paso 3
    const detRubro = document.querySelector('#det-rubro');
    const detMotivo = document.querySelector('#det-motivo');
    const detCategoria = document.querySelector('#det-categoria');
    const detContenido = document.querySelector('#det-contenido');
    const cntCaracteres = document.querySelector('#cnt-caracteres');

    // Campos Paso 4
    const inputArchivos = document.querySelector('#input-archivos');
    const btnBrowse = document.querySelector('#btn-browse-file');
    const tablaArchivos = document.querySelector('#tabla-archivos');
    const dropZone = document.querySelector('#step-content-4 .border-dashed');

    // Reproducción de sonido de éxito
    const playSuccessSound = () => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, ctx.currentTime);
            osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
            osc.start();
            osc.stop(ctx.currentTime + 0.35);
        } catch (e) {
            console.error(e);
        }
    };

    // Funciones auxiliares para mostrar/limpiar errores dinámicos
    const showError = (inputId, errId, message) => {
        const inputEl = document.getElementById(inputId);
        const errEl = document.getElementById(errId);
        
        if (errEl) {
            errEl.textContent = message;
            errEl.classList.remove('hidden');
        }
        if (inputEl) {
            inputEl.classList.add('border-rose-500', 'focus:ring-rose-500');
            inputEl.classList.remove('border-slate-300', 'dark:border-slate-700');
        }
    };

    const clearError = (inputId, errId) => {
        const inputEl = document.getElementById(inputId);
        const errEl = document.getElementById(errId);

        if (errEl) errEl.classList.add('hidden');
        if (inputEl) {
            inputEl.classList.remove('border-rose-500', 'focus:ring-rose-500');
            inputEl.classList.add('border-slate-300', 'dark:border-slate-700');
        }
    };

    // --- VALIDACIONES INDIVIDUALES PARA PASO 1 ---

    const validateCelular = () => {
        const cel = presCelular?.value.trim() || '';
        if (!cel) {
            showError('pres-celular', 'err-pres-celular', 'El teléfono celular es obligatorio');
            return false;
        }
        if (cel.length !== 9 || !cel.startsWith('9')) {
            showError('pres-celular', 'err-pres-celular', 'Ingrese un celular válido de 9 dígitos que empiece con 9');
            return false;
        }
        clearError('pres-celular', 'err-pres-celular');
        return true;
    };

    const validateCorreo = () => {
        const correo = presCorreo?.value.trim() || '';
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!correo) {
            showError('pres-correo', 'err-pres-correo', 'El correo electrónico es obligatorio');
            return false;
        }
        if (!regexCorreo.test(correo)) {
            showError(
                'pres-correo', 
                'err-pres-correo', 
                'Ingrese un correo válido (debe incluir "@" y una extensión como ".com" o ".pe")'
            );
            return false;
        }
        clearError('pres-correo', 'err-pres-correo');
        return true;
    };

    // --- EVENTOS REACTIVOS (INPUT + BLUR) PASO 1 ---

    if (presCelular) {
        presCelular.addEventListener('input', () => {
            presCelular.value = presCelular.value.replace(/\D/g, '');
            if (document.getElementById('err-pres-celular') && !document.getElementById('err-pres-celular').classList.contains('hidden')) {
                validateCelular();
            }
        });
        presCelular.addEventListener('blur', validateCelular);
    }

    if (presCorreo) {
        presCorreo.addEventListener('input', () => {
            if (document.getElementById('err-pres-correo') && !document.getElementById('err-pres-correo').classList.contains('hidden')) {
                validateCorreo();
            }
        });
        presCorreo.addEventListener('blur', validateCorreo);
    }

    // --- SELECCIÓN DE TEMAS EN PASO 2 ---

    btnTemas.forEach(btn => {
        btn.addEventListener('click', () => {
            btnTemas.forEach(b => {
                b.classList.remove(
                    'border-[#0877a7]', 
                    'bg-sky-100', 
                    'text-[#0877a7]', 
                    'ring-2', 
                    'ring-[#0877a7]/30',
                    'dark:bg-sky-950',
                    'dark:text-sky-300'
                );
                b.classList.add('bg-white', 'dark:bg-slate-900', 'text-slate-800', 'dark:text-slate-200');
                if (b.textContent.startsWith('✓ ')) {
                    b.textContent = b.textContent.replace('✓ ', '');
                }
            });

            btn.classList.remove('bg-white', 'dark:bg-slate-900', 'text-slate-800', 'dark:text-slate-200');
            btn.classList.add(
                'border-[#0877a7]', 
                'bg-sky-100', 
                'text-[#0877a7]', 
                'ring-2', 
                'ring-[#0877a7]/30',
                'dark:bg-sky-950',
                'dark:text-sky-300'
            );

            const temaTexto = btn.textContent.trim();
            btn.textContent = `✓ ${temaTexto}`;

            if (inputTema) inputTema.value = temaTexto;
            clearError('tema-seleccionado', 'err-tema-seleccionado');
        });
    });

    // --- EVENTOS PASO 3 ---

    detRubro?.addEventListener('change', () => {
        if (detRubro.value) clearError('det-rubro', 'err-det-rubro');
    });
    detMotivo?.addEventListener('change', () => {
        if (detMotivo.value) clearError('det-motivo', 'err-det-motivo');
    });
    detCategoria?.addEventListener('change', () => {
        if (detCategoria.value) clearError('det-categoria', 'err-det-categoria');
    });
    
    detContenido?.addEventListener('input', () => {
        if (cntCaracteres) {
            cntCaracteres.textContent = `${detContenido.value.length} / 1800 caracteres`;
        }
        if (detContenido.value.trim()) clearError('det-contenido', 'err-det-contenido');
    });
    detContenido?.addEventListener('blur', () => {
        if (!detContenido.value.trim()) {
            showError('det-contenido', 'err-det-contenido', 'El detalle de la reclamación es obligatorio');
        }
    });

    // --- GESTIÓN CORREGIDA DE ARCHIVOS ADJUNTOS EN PASO 4 ---

    const procesarArchivos = (files) => {
        const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB Límite amigable
        const MAX_FILES = 5;

        Array.from(files).forEach(file => {
            if (archivosAdjuntos.length >= MAX_FILES) {
                alert(`Solo puede adjuntar un máximo de ${MAX_FILES} archivos.`);
                return;
            }

            if (file.size > MAX_SIZE_BYTES) {
                alert(`El archivo "${file.name}" supera el límite máximo permitido de 5 MB.`);
                return;
            }

            // Evitar duplicados por nombre
            if (!archivosAdjuntos.some(f => f.name === file.name)) {
                archivosAdjuntos.push(file);
            }
        });

        renderTablaArchivos();
    };

    btnBrowse?.addEventListener('click', () => {
        if (inputArchivos) {
            inputArchivos.value = ''; // Resetea el valor previo para permitir seleccionar el mismo archivo
            inputArchivos.click();
        }
    });

    inputArchivos?.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
            procesarArchivos(e.target.files);
        }
    });

    // Soporte Drag & Drop visual en la zona de carga
    if (dropZone) {
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                dropZone.classList.add('border-[#0877a7]', 'bg-sky-50/80');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                dropZone.classList.remove('border-[#0877a7]', 'bg-sky-50/80');
            }, false);
        });

        dropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            if (dt && dt.files) {
                procesarArchivos(dt.files);
            }
        });
    }

    const renderTablaArchivos = () => {
        if (!tablaArchivos) return;

        if (archivosAdjuntos.length === 0) {
            tablaArchivos.innerHTML = `
                <tr>
                    <td colspan="3" class="p-4 text-center text-slate-400 italic">No hay archivos adjuntados.</td>
                </tr>`;
            return;
        }

        tablaArchivos.innerHTML = archivosAdjuntos.map((f, i) => `
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                <td class="p-3 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <span class="text-[#0877a7]">📄</span>
                    <span>${f.name}</span>
                </td>
                <td class="p-3 text-slate-500 font-medium">${(f.size / 1024).toFixed(1)} KB</td>
                <td class="p-3 text-center">
                    <button type="button" data-idx="${i}" class="btn-del-file inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition">
                        <span>✕</span>
                        <span>Eliminar</span>
                    </button>
                </td>
            </tr>
        `).join('');

        // Listeners para botones eliminar
        document.querySelectorAll('.btn-del-file').forEach(b => {
            b.addEventListener('click', (e) => {
                const target = e.currentTarget;
                const idx = parseInt(target.getAttribute('data-idx'));
                archivosAdjuntos.splice(idx, 1);
                renderTablaArchivos();
            });
        });
    };

    // --- ACTUALIZACIÓN DE STEPPER Y NAVEGACIÓN ---

    const updateStepperUI = () => {
        for (let i = 1; i <= totalSteps; i++) {
            const content = document.querySelector(`#step-content-${i}`);
            const indicator = document.querySelector(`#step-indicator-${i}`);
            const line = document.querySelector(`#step-line-${i}`);

            if (i === currentStep) {
                content?.classList.remove('hidden');
                if (indicator) {
                    indicator.className = 'flex h-8 w-8 items-center justify-center rounded-full bg-[#0877a7] text-white font-bold text-xs ring-4 ring-sky-100 dark:ring-sky-900/40';
                }
            } else if (i < currentStep) {
                content?.classList.add('hidden');
                if (indicator) {
                    indicator.className = 'flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-xs';
                }
                if (line) line.className = 'h-1 flex-1 bg-emerald-500 mx-4';
            } else {
                content?.classList.add('hidden');
                if (indicator) {
                    indicator.className = 'flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 font-bold text-xs dark:bg-slate-800 dark:text-slate-400';
                }
                if (line) line.className = 'h-1 flex-1 bg-slate-200 dark:bg-slate-800 mx-4';
            }
        }

        if (currentStep === 1) btnPrev?.classList.add('hidden');
        else btnPrev?.classList.remove('hidden');

        if (currentStep === totalSteps) {
            btnNext?.classList.add('hidden');
            btnSubmit?.classList.remove('hidden');
        } else {
            btnNext?.classList.remove('hidden');
            btnSubmit?.classList.add('hidden');
        }
    };

    const validateStep = (step) => {
        let valid = true;

        if (step === 1) {
            const isCelValid = validateCelular();
            const isCorreoValid = validateCorreo();
            valid = isCelValid && isCorreoValid;
        }

        if (step === 2) {
            if (!inputTema?.value) {
                showError('tema-seleccionado', 'err-tema-seleccionado', 'Debe seleccionar un tema principal');
                valid = false;
            } else {
                clearError('tema-seleccionado', 'err-tema-seleccionado');
            }
        }

        if (step === 3) {
            if (!detRubro?.value) { showError('det-rubro', 'err-det-rubro', 'Seleccione un rubro'); valid = false; }
            if (!detMotivo?.value) { showError('det-motivo', 'err-det-motivo', 'Seleccione un motivo'); valid = false; }
            if (!detCategoria?.value) { showError('det-categoria', 'err-det-categoria', 'Seleccione una categoría'); valid = false; }
            if (!detContenido?.value.trim()) { showError('det-contenido', 'err-det-contenido', 'El detalle de la reclamación es obligatorio'); valid = false; }
        }

        return valid;
    };

    btnNext?.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            currentStep++;
            updateStepperUI();
        }
    });

    btnPrev?.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateStepperUI();
        }
    });

    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateStep(4)) {
            playSuccessSound();
            modal?.classList.remove('hidden');
        }
    });
});