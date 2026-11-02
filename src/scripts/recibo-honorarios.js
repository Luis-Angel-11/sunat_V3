document.addEventListener('DOMContentLoaded', function() {
    var formRHE = document.getElementById('form-rhe');
    var selectTipoDoc = document.getElementById('rhe-tipo-doc');
    var inputNumDoc = document.getElementById('rhe-num-doc');
    var inputNomReceptor = document.getElementById('rhe-nom-receptor');
    var btnBuscarReceptor = document.getElementById('btn-buscar-receptor');

    var inputDescripcion = document.getElementById('rhe-descripcion');
    var inputFecEmision = document.getElementById('rhe-fec-emision');
    var selectMoneda = document.getElementById('rhe-moneda');

    var inputMontoTotal = document.getElementById('rhe-monto-total');
    var checkAplicaRetencion = document.getElementById('rhe-aplica-retencion');
    var inputMontoRetencion = document.getElementById('rhe-monto-retencion');
    var inputMontoNeto = document.getElementById('rhe-monto-neto');

    // Modales
    var modalPV = document.getElementById('modal-vista-previa-rhe');
    var btnVistaPrevia = document.getElementById('btn-vista-previa-rhe');
    var btnCerrarPV = document.getElementById('btn-cerrar-pv-rhe');

    var modalExito = document.getElementById('modal-exito-rhe');
    var btnCerrarExito = document.getElementById('btn-cerrar-exito-rhe');
    var btnDescargaA4 = document.getElementById('btn-descarga-a4-rhe');

    // Nombres aleatorios simulación
    var nombresDNI = ['JOSÉ CAMPOS RIVERA', 'MARÍA ROJAS VARGAS', 'CARLOS MENDOZA CHÁVEZ', 'ANA FLORES SILVA'];
    var nombresCE = ['JEAN PAUL DUBOIS', 'JOHN MICHAEL SMITH', 'HANS MÜLLER', 'ELENA PETROVA'];

    // FUNCIÓN REPRODUCIR SONIDO DE ÉXITO (ROBUSTA Y COMPATIBLE)
    function reproducirSonidoExito() {
        try {
            var AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            var ctx = new AudioCtx();

            // Desbloqueo explicito por políticas de autoplay de navegadores
            if (ctx.state === 'suspended') {
                ctx.resume();
            }

            var now = ctx.currentTime;
            
            // Tono 1 (Mi / E5)
            var osc1 = ctx.createOscillator();
            var gain1 = ctx.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(659.25, now);
            gain1.gain.setValueAtTime(0.2, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            osc1.connect(gain1);
            gain1.connect(ctx.destination);

            // Tono 2 (Si / B5 - Acorde de Confirmación)
            var osc2 = ctx.createOscillator();
            var gain2 = ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(987.77, now + 0.1);
            gain2.gain.setValueAtTime(0.25, now + 0.1);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);

            osc1.start(now);
            osc1.stop(now + 0.15);
            osc2.start(now + 0.1);
            osc2.stop(now + 0.4);
        } catch (e) {
            console.warn('AudioContext no soportado o bloqueado:', e);
        }
    }

    // HELPER CENTRALIZADO DE ERRORES (LIMPIEZA INMEDIATA)
    function setFeedback(fieldId, errorMsg) {
        var fb = document.getElementById('err-' + fieldId);
        var input = document.getElementById(fieldId);
        if (!fb) return;

        if (errorMsg) {
            fb.textContent = errorMsg;
            fb.classList.remove('hidden');
            if (input) input.classList.add('border-rose-500', 'ring-1', 'ring-rose-500');
        } else {
            fb.textContent = '';
            fb.classList.add('hidden');
            if (input) input.classList.remove('border-rose-500', 'ring-1', 'ring-rose-500');
        }
    }

    // VALIDACIÓN ESPECÍFICA POR CAMPO (ON-INPUT & ON-BLUR)
    function validarDocumentoReceptor() {
        var tipo = selectTipoDoc.value;
        var doc = inputNumDoc.value.trim();

        if (!doc) {
            setFeedback('rhe-num-doc', '✕ Ingrese el número de documento.');
            return false;
        }

        if (tipo === '1' && doc.length !== 8) {
            setFeedback('rhe-num-doc', '✕ El DNI debe contener exactamente 8 dígitos numéricos.');
            return false;
        }

        if (tipo === '6' && doc.length !== 11) {
            setFeedback('rhe-num-doc', '✕ El RUC debe contener exactamente 11 dígitos numéricos.');
            return false;
        }

        if (tipo === '4' && (doc.length < 9 || doc.length > 12)) {
            setFeedback('rhe-num-doc', '✕ El Carnet de Extranjería debe tener entre 9 y 12 caracteres.');
            return false;
        }

        setFeedback('rhe-num-doc', null);
        return true;
    }

    function validarNombreReceptor() {
        if (!inputNomReceptor.value.trim()) {
            setFeedback('rhe-nom-receptor', '✕ Ingrese la Razón Social o Nombres del receptor.');
            return false;
        }
        setFeedback('rhe-nom-receptor', null);
        return true;
    }

    function validarDescripcionServicio() {
        if (!inputDescripcion.value.trim()) {
            setFeedback('rhe-descripcion', '✕ Debe detallar el servicio prestado.');
            return false;
        }
        setFeedback('rhe-descripcion', null);
        return true;
    }

    function validarMontoTotal() {
        var total = parseFloat(inputMontoTotal.value);
        if (isNaN(total) || total <= 0) {
            setFeedback('rhe-monto-total', '✕ Ingrese un honorario total mayor a 0.00.');
            return false;
        }
        setFeedback('rhe-monto-total', null);
        return true;
    }

    function validarFechaEmision() {
        var hoyStr = new Date().toISOString().split('T')[0];
        if (!inputFecEmision.value) {
            setFeedback('rhe-fec-emision', '✕ Seleccione la fecha de emisión.');
            return false;
        }
        if (inputFecEmision.value < hoyStr) {
            setFeedback('rhe-fec-emision', '✕ La fecha debe ser de hoy en adelante.');
            return false;
        }
        setFeedback('rhe-fec-emision', null);
        return true;
    }

    // ASIGNACIÓN DE EVENTOS REACTIVOS
    if (selectTipoDoc) {
        selectTipoDoc.addEventListener('change', function() {
            inputNumDoc.value = '';
            inputNomReceptor.value = '';
            setFeedback('rhe-num-doc', null);
            setFeedback('rhe-nom-receptor', null);

            var tipo = selectTipoDoc.value;
            if (tipo === '1') {
                inputNumDoc.setAttribute('maxlength', '8');
                inputNumDoc.setAttribute('placeholder', 'Ej: 45892014 (8 dígitos)');
            } else if (tipo === '6') {
                inputNumDoc.setAttribute('maxlength', '11');
                inputNumDoc.setAttribute('placeholder', 'Ej: 20615611809 (11 dígitos)');
            } else if (tipo === '4') {
                inputNumDoc.setAttribute('maxlength', '12');
                inputNumDoc.setAttribute('placeholder', 'Ej: 000123456 (9-12 caracteres)');
            }
        });
    }

    if (inputNumDoc) {
        inputNumDoc.addEventListener('input', function() {
            var tipo = selectTipoDoc.value;
            if (tipo === '1' || tipo === '6') {
                this.value = this.value.replace(/\D/g, '');
            }
            if (this.value.trim()) setFeedback('rhe-num-doc', null);
        });
        inputNumDoc.addEventListener('blur', validarDocumentoReceptor);
    }

    if (inputNomReceptor) {
        inputNomReceptor.addEventListener('input', function() {
            if (this.value.trim()) setFeedback('rhe-nom-receptor', null);
        });
        inputNomReceptor.addEventListener('blur', validarNombreReceptor);
    }

    if (inputDescripcion) {
        inputDescripcion.addEventListener('input', function() {
            if (this.value.trim()) setFeedback('rhe-descripcion', null);
        });
        inputDescripcion.addEventListener('blur', validarDescripcionServicio);
    }

    if (inputMontoTotal) {
        inputMontoTotal.addEventListener('input', function() {
            calcularMontos();
            if (parseFloat(this.value) > 0) setFeedback('rhe-monto-total', null);
        });
        inputMontoTotal.addEventListener('blur', validarMontoTotal);
    }

    if (inputFecEmision) {
        var hoyStr = new Date().toISOString().split('T')[0];
        inputFecEmision.setAttribute('min', hoyStr);
        inputFecEmision.value = hoyStr;
        inputFecEmision.addEventListener('change', validarFechaEmision);
    }

    // BOTÓN VALIDAR RECEPTOR
    if (btnBuscarReceptor) {
        btnBuscarReceptor.addEventListener('click', function() {
            if (!validarDocumentoReceptor()) return;

            var tipo = selectTipoDoc.value;
            var doc = inputNumDoc.value.trim();

            if (tipo === '1') {
                var randomNomDNI = nombresDNI[Math.floor(Math.random() * nombresDNI.length)];
                inputNomReceptor.value = randomNomDNI;
            } else if (tipo === '6') {
                inputNomReceptor.value = (doc === '20615611809') ? 'ABP TECNOLOGIA CONSULT S.A.C.' : 'EMPRESA CLIENTE S.A.C.';
            } else if (tipo === '4') {
                var randomNomCE = nombresCE[Math.floor(Math.random() * nombresCE.length)];
                inputNomReceptor.value = randomNomCE;
            }
            setFeedback('rhe-nom-receptor', null);
        });
    }

    // CÁLCULO DE MONTOS Y RETENCIÓN
    function calcularMontos() {
        var total = parseFloat(inputMontoTotal.value) || 0;
        var retencion = 0;

        if (total > 1500 && !checkAplicaRetencion.checked) {
            checkAplicaRetencion.checked = true;
        }

        if (checkAplicaRetencion.checked) {
            retencion = total * 0.08;
        }

        var neto = total - retencion;
        inputMontoRetencion.value = retencion.toFixed(2);
        inputMontoNeto.value = neto.toFixed(2);
    }

    if (checkAplicaRetencion) checkAplicaRetencion.addEventListener('change', calcularMontos);

    // CARGAR VISTA PREVIA
    function cargarVistaPrevia() {
        var monedaSimbolo = selectMoneda.value === 'USD' ? '$' : 'S/';
        var elementosSimbolo = document.querySelectorAll('.pv-moneda-simbolo');
        elementosSimbolo.forEach(function(el) { el.textContent = monedaSimbolo; });

        document.getElementById('pv-rhe-recibi-de').textContent = inputNomReceptor.value || '-';
        document.getElementById('pv-rhe-doc-num').textContent = inputNumDoc.value || '-';
        
        var tipoDocTexto = selectTipoDoc.options[selectTipoDoc.selectedIndex].text.split(' ')[0];
        document.getElementById('pv-rhe-doc-tipo').textContent = tipoDocTexto;

        document.getElementById('pv-rhe-fec-emision').textContent = inputFecEmision.value;
        document.getElementById('pv-rhe-concepto').textContent = inputDescripcion.value || '-';

        document.getElementById('pv-rhe-total').textContent = (parseFloat(inputMontoTotal.value) || 0).toFixed(2);
        document.getElementById('pv-rhe-retencion').textContent = inputMontoRetencion.value;
        document.getElementById('pv-rhe-neto').textContent = inputMontoNeto.value;
    }

    // ESTRATEGIA COMPLETA DE VALIDACIÓN HÍBRIDA / REACTIVA
    function validarFormularioCompleto() {
        var v1 = validarDocumentoReceptor();
        var v2 = validarNombreReceptor();
        var v3 = validarDescripcionServicio();
        var v4 = validarMontoTotal();
        var v5 = validarFechaEmision();

        return v1 && v2 && v3 && v4 && v5;
    }

    if (btnVistaPrevia) {
        btnVistaPrevia.addEventListener('click', function() {
            if (validarFormularioCompleto()) {
                cargarVistaPrevia();
                modalPV.classList.remove('hidden');
            }
        });
    }

    if (btnCerrarPV) btnCerrarPV.addEventListener('click', function() { modalPV.classList.add('hidden'); });

    // EMISIÓN Y REPRODUCCIÓN DEL SONIDO
    if (formRHE) {
        formRHE.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validarFormularioCompleto()) {
                modalExito.classList.remove('hidden');
                reproducirSonidoExito();
            }
        });
    }

    if (btnCerrarExito) {
        btnCerrarExito.addEventListener('click', function() {
            modalExito.classList.add('hidden');
            formRHE.reset();
            setFeedback('rhe-num-doc', null);
            setFeedback('rhe-nom-receptor', null);
            setFeedback('rhe-descripcion', null);
            setFeedback('rhe-monto-total', null);
            setFeedback('rhe-fec-emision', null);
            var hoy = new Date().toISOString().split('T')[0];
            inputFecEmision.value = hoy;
            calcularMontos();
        });
    }

    if (btnDescargaA4) {
        btnDescargaA4.addEventListener('click', function() {
            cargarVistaPrevia();
            modalPV.classList.remove('hidden');
            setTimeout(function() {
                window.print();
                modalPV.classList.add('hidden');
            }, 150);
        });
    }
});