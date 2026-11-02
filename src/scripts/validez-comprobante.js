document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // BASE DE DATOS DE PRUEBA (CASOS REGISTRADOS EN SUNAT)
    // -------------------------------------------------------------------------
    const BASE_DATOS_SUNAT = [
        {
            tipo: 'FACTURA',
            rucEmisor: '20517352059',
            tipoDocRec: '6', // RUC
            numDocRec: '20615611809',
            serie: 'F001',
            numero: '00000042',
            fecha: '2026-10-31',
            monto: '150.00',
            estado: 'ACEPTADO',
            mensaje: 'El comprobante Factura Electrónica F001-00000042 ha sido emitido válidamente y se encuentra ACEPTADO por la SUNAT.'
        },
        {
            tipo: 'BOLETA',
            rucEmisor: '20517352059',
            tipoDocRec: '1', // DNI
            numDocRec: '74859612',
            serie: 'B001',
            numero: '00000128',
            fecha: '2026-10-30',
            monto: '85.50',
            estado: 'ACEPTADO',
            mensaje: 'La Boleta de Venta Electrónica B001-00000128 figura informada y ACEPTADA en los sistemas de SUNAT.'
        },
        {
            tipo: 'BOLETA',
            rucEmisor: '20517352059',
            tipoDocRec: '0', // SIN DOCUMENTO
            numDocRec: '',
            serie: 'B001',
            numero: '00000129',
            fecha: '2026-10-30',
            monto: '45.00',
            estado: 'ACEPTADO',
            mensaje: 'La Boleta de Venta Electrónica a Público General B001-00000129 es VÁLIDA y ACEPTADA.'
        },
        {
            tipo: 'RHE',
            rucEmisor: '10457896321', // Persona Natural (RUC 10)
            tipoDocRec: '6', // RUC Empresa que contrata
            numDocRec: '20517352059',
            serie: 'E001',
            numero: '00000045',
            fecha: '2026-11-01',
            monto: '1200.00',
            estado: 'ACEPTADO',
            mensaje: 'El Recibo por Honorarios Electrónico E001-00000045 fue emitido conforme a ley y se encuentra VÁLIDO en SUNAT.'
        },
        {
            tipo: 'GRE',
            rucEmisor: '20517352059',
            tipoDocRec: '6', // RUC Destinatario
            numDocRec: '20615611809',
            serie: 'T001',
            numero: '00000012',
            fecha: '2026-10-31',
            monto: '0.00', // Las guías a veces no llevan importe o se valida 0.00
            estado: 'ACEPTADO',
            mensaje: 'La Guía de Remisión Electrónica T001-00000012 cuenta con Código QR emitido y está ACEPTADA por SUNAT.'
        },
        {
            tipo: 'NC',
            rucEmisor: '20517352059',
            tipoDocRec: '6',
            numDocRec: '20615611809',
            serie: 'FC01',
            numero: '00000005',
            fecha: '2026-10-28',
            monto: '50.00',
            estado: 'ACEPTADO',
            mensaje: 'La Nota de Crédito FC01-00000005 relacionada a la Factura F001-00000042 es VÁLIDA.'
        }
    ];

    // Referencias DOM
    const rucEmisorInput = document.querySelector('#val-ruc-emisor');
    const cntRucEmisor = document.querySelector('#cnt-ruc-emisor');
    
    const selectTipoCpe = document.querySelector('#val-tipo-cpe');
    const selectTipoDocRec = document.querySelector('#val-tipo-doc-rec');
    const numDocRecInput = document.querySelector('#val-num-doc-rec');
    const cntDocReceptor = document.querySelector('#cnt-doc-receptor');

    const serieInput = document.querySelector('#val-serie');
    const numeroInput = document.querySelector('#val-numero');
    const fechaInput = document.querySelector('#val-fec-emision');
    const montoInput = document.querySelector('#val-monto-total');

    const form = document.querySelector('#form-validez-cpe');
    const btnLimpiar = document.querySelector('#btn-limpiar-validez');

    // Elementos del Modal
    const modal = document.querySelector('#modal-resultado-validez');
    const btnCerrarX = document.querySelector('#btn-cerrar-modal-x');
    const btnOtraConsulta = document.querySelector('#btn-otra-consulta');
    
    const modalAlertaBox = document.querySelector('#modal-alerta-box');
    const modalBadgeIcon = document.querySelector('#modal-badge-icon');
    const modalEstadoTitulo = document.querySelector('#modal-estado-titulo');
    const modalEstadoMensaje = document.querySelector('#modal-estado-mensaje');
    
    const resModalCpe = document.querySelector('#res-modal-cpe');
    const resModalEmisor = document.querySelector('#res-modal-emisor');
    const resModalFecha = document.querySelector('#res-modal-fecha');
    const resModalMonto = document.querySelector('#res-modal-monto');

    // Reproducción de sonido de éxito al consultar
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
            console.error('AudioContext no soportado:', e);
        }
    };

    // Funciones de error/limpieza visual
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

    // Validaciones individuales
    const validateRucEmisor = () => {
        const val = rucEmisorInput?.value.trim() || '';
        if (!val) {
            showError('val-ruc-emisor', 'err-val-ruc-emisor', 'El número de RUC es obligatorio');
            return false;
        }
        if (val.length !== 11 || (!val.startsWith('10') && !val.startsWith('20'))) {
            showError('val-ruc-emisor', 'err-val-ruc-emisor', 'Ingrese un RUC válido de 11 dígitos que inicie con 10 o 20');
            return false;
        }
        clearError('val-ruc-emisor', 'err-val-ruc-emisor');
        return true;
    };

    const validateDocReceptor = () => {
        const tipo = selectTipoDocRec?.value || '0';
        const val = numDocRecInput?.value.trim() || '';

        if (tipo === '0') {
            clearError('val-num-doc-rec', 'err-val-num-doc-rec');
            return true;
        }
        if (!val) {
            showError('val-num-doc-rec', 'err-val-num-doc-rec', 'Ingrese el número de documento');
            return false;
        }
        if (tipo === '6' && val.length !== 11) {
            showError('val-num-doc-rec', 'err-val-num-doc-rec', 'El RUC del receptor debe tener 11 dígitos');
            return false;
        }
        if (tipo === '1' && val.length !== 8) {
            showError('val-num-doc-rec', 'err-val-num-doc-rec', 'El DNI del receptor debe tener 8 dígitos');
            return false;
        }
        clearError('val-num-doc-rec', 'err-val-num-doc-rec');
        return true;
    };

    const validateCorrelativo = () => {
        const serie = serieInput?.value.trim() || '';
        const numero = numeroInput?.value.trim() || '';

        if (!serie || serie.length < 4 || !numero) {
            showError('val-serie', 'err-val-correlativo', 'Ingrese una serie de 4 caracteres y el número correlativo');
            if (numeroInput) numeroInput.classList.add('border-rose-500');
            return false;
        }
        clearError('val-serie', 'err-val-correlativo');
        if (numeroInput) numeroInput.classList.remove('border-rose-500');
        return true;
    };

    const validateFecha = () => {
        const val = fechaInput?.value.trim() || '';
        if (!val) {
            showError('val-fec-emision', 'err-val-fec-emision', 'Seleccione la fecha de emisión');
            return false;
        }
        clearError('val-fec-emision', 'err-val-fec-emision');
        return true;
    };

    const validateMonto = () => {
        const tipo = selectTipoCpe?.value;
        const val = montoInput?.value.trim() || '';
        
        // Las guías de remisión pueden ser 0.00
        if (tipo !== 'GRE' && (!val || parseFloat(val) <= 0)) {
            showError('val-monto-total', 'err-val-monto-total', 'Ingrese un importe total mayor a 0.00');
            return false;
        }
        clearError('val-monto-total', 'err-val-monto-total');
        return true;
    };

    // Eventos blur e input
    if (rucEmisorInput && cntRucEmisor) {
        rucEmisorInput.addEventListener('input', () => {
            rucEmisorInput.value = rucEmisorInput.value.replace(/\D/g, '');
            cntRucEmisor.textContent = `${rucEmisorInput.value.length}/11`;
            if (document.getElementById('err-val-ruc-emisor') && !document.getElementById('err-val-ruc-emisor').classList.contains('hidden')) {
                validateRucEmisor();
            }
        });
        rucEmisorInput.addEventListener('blur', validateRucEmisor);
    }

    if (selectTipoDocRec && numDocRecInput && cntDocReceptor) {
        selectTipoDocRec.addEventListener('change', () => {
            const tipo = selectTipoDocRec.value;
            numDocRecInput.value = '';
            clearError('val-num-doc-rec', 'err-val-num-doc-rec');

            if (tipo === '0') {
                numDocRecInput.disabled = true;
                numDocRecInput.placeholder = 'Sin documento requerido';
                numDocRecInput.classList.add('bg-slate-100', 'dark:bg-slate-950');
                cntDocReceptor.classList.add('hidden');
            } else {
                numDocRecInput.disabled = false;
                numDocRecInput.classList.remove('bg-slate-100', 'dark:bg-slate-950');
                cntDocReceptor.classList.remove('hidden');

                if (tipo === '6') numDocRecInput.maxLength = 11;
                else if (tipo === '1') numDocRecInput.maxLength = 8;
                else numDocRecInput.maxLength = 12;

                cntDocReceptor.textContent = `0/${numDocRecInput.maxLength}`;
            }
        });

        numDocRecInput.addEventListener('input', () => {
            const tipo = selectTipoDocRec.value;
            if (tipo === '6' || tipo === '1') {
                numDocRecInput.value = numDocRecInput.value.replace(/\D/g, '');
            }
            cntDocReceptor.textContent = `${numDocRecInput.value.length}/${numDocRecInput.maxLength}`;
            if (document.getElementById('err-val-num-doc-rec') && !document.getElementById('err-val-num-doc-rec').classList.contains('hidden')) {
                validateDocReceptor();
            }
        });
        numDocRecInput.addEventListener('blur', validateDocReceptor);
    }

    serieInput?.addEventListener('input', () => {
        if (!document.getElementById('err-val-correlativo')?.classList.contains('hidden')) validateCorrelativo();
    });
    serieInput?.addEventListener('blur', validateCorrelativo);

    numeroInput?.addEventListener('input', () => {
        numeroInput.value = numeroInput.value.replace(/\D/g, '');
        if (!document.getElementById('err-val-correlativo')?.classList.contains('hidden')) validateCorrelativo();
    });
    numeroInput?.addEventListener('blur', validateCorrelativo);

    fechaInput?.addEventListener('change', validateFecha);
    montoInput?.addEventListener('blur', validateMonto);

    selectTipoCpe?.addEventListener('change', () => {
        const val = selectTipoCpe.value;
        if (val === 'FACTURA') serieInput.placeholder = 'F001';
        else if (val === 'BOLETA') serieInput.placeholder = 'B001';
        else if (val === 'RHE') serieInput.placeholder = 'E001';
        else if (val === 'GRE') serieInput.placeholder = 'T001';
        else if (val === 'NC') serieInput.placeholder = 'FC01';
        else if (val === 'ND') serieInput.placeholder = 'FD01';
    });

    // Submit del Formulario
    form?.addEventListener('submit', (e) => {
        e.preventDefault();

        const isRucValid = validateRucEmisor();
        const isRecValid = validateDocReceptor();
        const isCorrValid = validateCorrelativo();
        const isFecValid = validateFecha();
        const isMonValid = validateMonto();

        if (!isRucValid || !isRecValid || !isCorrValid || !isFecValid || !isMonValid) return;

        const ruc = rucEmisorInput.value.trim();
        const tipoCpe = selectTipoCpe.value;
        const tipoCpeText = selectTipoCpe.options[selectTipoCpe.selectedIndex].text;
        const tipoDocRec = selectTipoDocRec.value;
        const numDocRec = numDocRecInput.value.trim();
        const serie = serieInput.value.trim().toUpperCase();
        const numero = numeroInput.value.trim().padStart(8, '0');
        const fecha = fechaInput.value.trim();
        const monto = parseFloat(montoInput.value.trim() || '0').toFixed(2);

        // BUSCAR SI COINCIDE EXACTAMENTE EN LA BASE DE DATOS REGISTRADA
        const encontrado = BASE_DATOS_SUNAT.find(item => 
            item.tipo === tipoCpe &&
            item.rucEmisor === ruc &&
            item.tipoDocRec === tipoDocRec &&
            item.numDocRec === numDocRec &&
            item.serie === serie &&
            item.numero === numero &&
            item.fecha === fecha &&
            parseFloat(item.monto).toFixed(2) === monto
        );

        const correlativoCompleto = `${serie}-${numero}`;

        if (resModalCpe) resModalCpe.textContent = `${tipoCpeText} (${correlativoCompleto})`;
        if (resModalEmisor) resModalEmisor.textContent = ruc;
        if (resModalFecha) resModalFecha.textContent = fecha;
        if (resModalMonto) resModalMonto.textContent = `S/ ${monto}`;

        if (encontrado) {
            modalAlertaBox.className = 'flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200';
            modalBadgeIcon.className = 'grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-500 text-white font-black text-xs';
            modalBadgeIcon.textContent = '✓';
            modalEstadoTitulo.textContent = 'ES UN COMPROBANTE DE PAGO VÁLIDO';
            modalEstadoMensaje.textContent = encontrado.mensaje;
            playSuccessSound();
        } else {
            modalAlertaBox.className = 'flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-800 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-200';
            modalBadgeIcon.className = 'grid h-7 w-7 shrink-0 place-items-center rounded-full bg-rose-500 text-white font-black text-xs';
            modalBadgeIcon.textContent = '✕';
            modalEstadoTitulo.textContent = 'COMPROBANTE NO REGISTRADO O ANULADO';
            modalEstadoMensaje.textContent = `El documento ${tipoCpeText} ${correlativoCompleto} NO figura en los registros oficiales de SUNAT con los datos ingresados.`;
        }

        modal?.classList.remove('hidden');
    });

    const resetForm = () => {
        form?.reset();
        if (cntRucEmisor) cntRucEmisor.textContent = '0/11';
        if (numDocRecInput) numDocRecInput.disabled = true;
        if (cntDocReceptor) cntDocReceptor.classList.add('hidden');

        ['val-ruc-emisor', 'val-num-doc-rec', 'val-serie', 'val-numero', 'val-fec-emision', 'val-monto-total'].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.classList.remove('border-rose-500', 'focus:ring-rose-500');
        });

        document.querySelectorAll('[id^="err-val-"]').forEach((el) => el.classList.add('hidden'));
    };

    btnCerrarX?.addEventListener('click', () => modal?.classList.add('hidden'));
    btnOtraConsulta?.addEventListener('click', () => {
        modal?.classList.add('hidden');
        resetForm();
    });

    btnLimpiar?.addEventListener('click', resetForm);
});