document.addEventListener('DOMContentLoaded', () => {
    let currentStep = 1;
    const totalSteps = 4;

    const btnNext = document.querySelector('#btn-next-pdt');
    const btnPrev = document.querySelector('#btn-prev-pdt');
    const btnSubmit = document.querySelector('#btn-submit-pdt');
    const form = document.querySelector('#form-pdt621');
    const modal = document.querySelector('#modal-constancia-pdt');
    const btnCerrarConstancia = document.querySelector('#btn-cerrar-constancia');

    // Casillas IGV
    const cas100 = document.querySelector('#cas-100'); // Base Ventas
    const cas101 = document.querySelector('#cas-101'); // IGV Ventas
    const cas102 = document.querySelector('#cas-102'); // Desc Ventas Base
    const cas103 = document.querySelector('#cas-103'); // Desc Ventas IGV
    const cas107 = document.querySelector('#cas-107'); // Base Compras
    const cas108 = document.querySelector('#cas-108'); // IGV Compras
    const cas140 = document.querySelector('#cas-140'); // IGV Resultante

    // Casillas Renta
    const selectRegimen = document.querySelector('#pdt-regimen');
    const labelTasaRenta = document.querySelector('#label-tasa-renta');
    const cas301 = document.querySelector('#cas-301'); // Ingresos Netos Renta
    const cas312 = document.querySelector('#cas-312'); // Renta Calculada

    // Casillas Determinación
    const detIgv140 = document.querySelector('#det-igv-140');
    const detRenta302 = document.querySelector('#det-renta-302');
    const cas145 = document.querySelector('#cas-145'); // Saldo favor IGV anterior
    const cas303 = document.querySelector('#cas-303'); // Saldo favor Renta anterior
    const cas164 = document.querySelector('#cas-164'); // Percepciones no aplicadas
    const cas326 = document.querySelector('#cas-326'); // Retenciones Renta
    const cas187 = document.querySelector('#cas-187'); // Interés IGV
    const cas319 = document.querySelector('#cas-319'); // Interés Renta
    const cas188 = document.querySelector('#cas-188'); // Total Deuda IGV
    const cas324 = document.querySelector('#cas-324'); // Total Deuda Renta

    // Sonido de éxito
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

    // FUNCIÓN DE LIMPIEZA DE NEGATIVOS (CORRECCIÓN)
    const sanitizePositiveValue = (inputEl) => {
        if (!inputEl) return 0;
        let val = parseFloat(inputEl.value);
        if (isNaN(val) || val < 0) {
            val = 0;
            inputEl.value = '';
        }
        return val;
    };

    // 1. CÁLCULOS EN TIEMPO REAL IGV (18%)
    const calcularIGV = (e) => {
        if (e && e.target) sanitizePositiveValue(e.target);

        const vtaBase = sanitizePositiveValue(cas100);
        const vtaDescBase = sanitizePositiveValue(cas102);
        const compBase = sanitizePositiveValue(cas107);

        const vtaIgv = (vtaBase * 0.18);
        const vtaDescIgv = (vtaDescBase * 0.18);
        const compIgv = (compBase * 0.18);

        if (cas101) cas101.value = vtaIgv.toFixed(2);
        if (cas103) cas103.value = vtaDescIgv.toFixed(2);
        if (cas108) cas108.value = compIgv.toFixed(2);

        const igvDebitoNeto = vtaIgv - vtaDescIgv;
        const igvResultante = Math.max(0, igvDebitoNeto - compIgv);

        if (cas140) cas140.value = igvResultante.toFixed(2);
        if (detIgv140) detIgv140.value = igvResultante.toFixed(2);

        calcularDeudaFinal();
    };

    // 2. CÁLCULOS EN TIEMPO REAL RENTA
    const calcularRenta = (e) => {
        if (e && e.target && e.target.type === 'number') sanitizePositiveValue(e.target);

        const ingresos = sanitizePositiveValue(cas301);
        const regimen = selectRegimen?.value || 'MYPE';
        let tasa = 0.01;

        if (regimen === 'GENERAL') {
            tasa = 0.015;
            if (labelTasaRenta) labelTasaRenta.textContent = '1.5% (0.0150)';
        } else if (regimen === 'ESPECIAL') {
            tasa = 0.015;
            if (labelTasaRenta) labelTasaRenta.textContent = '1.5% (RER)';
        } else {
            tasa = 0.01;
            if (labelTasaRenta) labelTasaRenta.textContent = '1.0% (0.0100)';
        }

        const rentaCalculada = ingresos * tasa;
        if (cas312) cas312.value = rentaCalculada.toFixed(2);
        if (detRenta302) detRenta302.value = rentaCalculada.toFixed(2);

        calcularDeudaFinal();
    };

    // 3. DETERMINACIÓN FINAL DE LA DEUDA
    const calcularDeudaFinal = (e) => {
        if (e && e.target) sanitizePositiveValue(e.target);

        const igvRes = parseFloat(cas140?.value || 0);
        const igvSaldoAnt = sanitizePositiveValue(cas145);
        const igvPerc = sanitizePositiveValue(cas164);
        const igvInt = sanitizePositiveValue(cas187);

        const deudaIgv = Math.max(0, (igvRes - igvSaldoAnt - igvPerc)) + igvInt;
        if (cas188) cas188.value = deudaIgv.toFixed(2);

        const rentaRes = parseFloat(cas312?.value || 0);
        const rentaSaldoAnt = sanitizePositiveValue(cas303);
        const rentaRet = sanitizePositiveValue(cas326);
        const rentaInt = sanitizePositiveValue(cas319);

        const deudaRenta = Math.max(0, (rentaRes - rentaSaldoAnt - rentaRet)) + rentaInt;
        if (cas324) cas324.value = deudaRenta.toFixed(2);
    };

    // LISTENERS REACTIVOS Y PREVENCIÓN DE SIMBOLO '-'
    const preventMinus = (e) => {
        if (e.key === '-' || e.key === 'e') {
            e.preventDefault();
        }
    };

    [cas100, cas102, cas107, cas301, cas145, cas303, cas164, cas326, cas187, cas319].forEach(el => {
        if (el) {
            el.addEventListener('keydown', preventMinus);
            el.addEventListener('blur', (e) => sanitizePositiveValue(e.target));
        }
    });

    [cas100, cas102, cas107].forEach(el => el?.addEventListener('input', calcularIGV));
    selectRegimen?.addEventListener('change', calcularRenta);
    cas301?.addEventListener('input', calcularRenta);
    [cas145, cas303, cas164, cas326, cas187, cas319].forEach(el => el?.addEventListener('input', calcularDeudaFinal));

    // ACCIONES DEL STEPPER
    const updateStepperUI = () => {
        for (let i = 1; i <= totalSteps; i++) {
            const content = document.querySelector(`#step-content-${i}`);
            const indicator = document.querySelector(`#step-indicator-${i}`);
            const line = document.querySelector(`#step-line-${i}`);

            if (i === currentStep) {
                content?.classList.remove('hidden');
                if (indicator) indicator.className = 'flex h-8 w-8 items-center justify-center rounded-full bg-[#0877a7] text-white font-bold text-xs ring-4 ring-sky-100 dark:ring-sky-900/40';
            } else if (i < currentStep) {
                content?.classList.add('hidden');
                if (indicator) indicator.className = 'flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-xs';
                if (line) line.className = 'h-1 flex-1 bg-emerald-500 mx-4';
            } else {
                content?.classList.add('hidden');
                if (indicator) indicator.className = 'flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 font-bold text-xs dark:bg-slate-800 dark:text-slate-400';
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

    btnNext?.addEventListener('click', () => {
        if (currentStep < totalSteps) {
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

    // SUBMIT Y MOSTRAR CONSTANCIA CON DETALLE OFICIAL
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const periodoVal = document.querySelector('#pdt-periodo')?.value || '2026-09';
        const igvResVal = parseFloat(cas140?.value || 0).toFixed(2);
        const rentaResVal = parseFloat(cas312?.value || 0).toFixed(2);
        const totalIgv = parseFloat(cas188?.value || 0).toFixed(2);
        const totalRenta = parseFloat(cas324?.value || 0).toFixed(2);
        const totalDeuda = (parseFloat(totalIgv) + parseFloat(totalRenta)).toFixed(2);

        // Inyectar datos en la constancia tipo formato oficial
        document.querySelector('#const-periodo').textContent = periodoVal;
        document.querySelector('#const-vta-igv').textContent = `S/ ${parseFloat(cas101?.value || 0).toFixed(2)}`;
        document.querySelector('#const-com-igv').textContent = `S/ ${parseFloat(cas108?.value || 0).toFixed(2)}`;
        document.querySelector('#const-res-igv').textContent = `S/ ${igvResVal}`;
        document.querySelector('#const-res-renta').textContent = `S/ ${rentaResVal}`;
        document.querySelector('#const-total-pagar').textContent = `S/ ${totalDeuda}`;

        playSuccessSound();
        modal?.classList.remove('hidden');
    });

    btnCerrarConstancia?.addEventListener('click', () => modal?.classList.add('hidden'));

    // CORRECCIÓN DE IMPRESIÓN PDF/CONSTANCIA
    document.querySelector('#btn-imprimir-constancia')?.addEventListener('click', () => {
        window.print();
    });
});