document.addEventListener('DOMContentLoaded', function() {
    var currentStep = 1;
    var totalSteps = 4;
    var formGuia = document.getElementById('form-guia');
    var btnPrev = document.getElementById('btn-prev-step');
    var btnNext = document.getElementById('btn-next-step');
    var btnSubmit = document.getElementById('btn-submit-guia');

    // Elementos de Vincular Factura
    var checkVincular = document.getElementById('vincular-factura-check');
    var containerFacturaInfo = document.getElementById('container-factura-info');
    var inputNumFactura = document.getElementById('input-num-factura');
    var btnBuscarFactura = document.getElementById('btn-buscar-factura');
    var feedbackFactura = document.getElementById('feedback-factura');
    var facturaVinculada = false;

    // Campos Paso 1
    var fechaInicio = document.getElementById('fec-inicio-traslado');
    var rucDest = document.getElementById('ruc-destinatario');
    var nomDest = document.getElementById('nom-destinatario');

    if (fechaInicio) {
        var hoyStr = new Date().toISOString().split('T')[0];
        fechaInicio.setAttribute('min', hoyStr);
        fechaInicio.value = hoyStr;
    }

    // Campos Paso 2
    var dirPartida = document.getElementById('dir-partida');
    var dirLlegada = document.getElementById('dir-llegada');

    // Campos Paso 3
    var selectModalidad = document.getElementById('modalidad-transporte');
    var secTranspPrivado = document.getElementById('sec-transporte-privado');
    var secTranspPublico = document.getElementById('sec-transporte-publico');
    var conductorDoc = document.getElementById('conductor-doc');
    var conductorNombre = document.getElementById('conductor-nombre');
    var vehiculoPlaca = document.getElementById('vehiculo-placa');
    var transpRuc = document.getElementById('transp-ruc');
    var transpNombre = document.getElementById('transp-nombre');

    // Campos Paso 4
    var pesoTotal = document.getElementById('peso-total');
    var cantBultos = document.getElementById('cant-bultos');

    // Modales
    var modalExito = document.getElementById('modal-exito-gre');
    var btnCerrarExitoGre = document.getElementById('btn-cerrar-exito-gre');

    var modalPV = document.getElementById('modal-vista-previa-gre');
    var btnVistaPrevia = document.getElementById('btn-vista-previa-gre');
    var btnCerrarPV = document.getElementById('btn-cerrar-pv-gre');

    // Botones de Descarga
    var btnDescargaA4 = document.getElementById('btn-descarga-a4-gre');
    var btnDescarga80mm = document.getElementById('btn-descarga-80mm-gre');
    var btnDescargaA5 = document.getElementById('btn-descarga-a5-gre');

    // Tabla de Bienes
    var btnAgregarBien = document.getElementById('btn-agregar-bien');
    var tablaBienes = document.getElementById('tabla-bienes');
    var bienesList = [];
    var idEnEdicionBien = null;

    var modalBien = document.getElementById('modal-bien');
    var modalBienTitulo = document.getElementById('modal-bien-titulo');
    var btnCerrarBien = document.getElementById('btn-cerrar-bien');
    var btnCancelarBien = document.getElementById('btn-cancelar-bien');
    var btnGuardarBien = document.getElementById('btn-guardar-bien');
    var feedbackBien = document.getElementById('feedback-bien');

    // FUNCIÓN PARA REPRODUCIR SONIDO DE ÉXITO (SINTETIZADO)
    function reproducirSonidoExito() {
        try {
            var AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            var ctx = new AudioCtx();

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
            console.warn('AudioContext no disponible o bloqueado:', e);
        }
    }

    // HELPER PARA VALIDACIONES
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

    // LIMPIEZA DE DATOS DE TRANSPORTE
    function limpiarDatosTransporte() {
        if (conductorDoc) conductorDoc.value = '';
        if (conductorNombre) conductorNombre.value = '';
        if (vehiculoPlaca) vehiculoPlaca.value = '';
        if (transpRuc) transpRuc.value = '';
        if (transpNombre) transpNombre.value = '';

        setFeedback('conductor-doc', null);
        setFeedback('conductor-nombre', null);
        setFeedback('vehiculo-placa', null);
        setFeedback('transp-ruc', null);
        setFeedback('transp-nombre', null);
    }

    // RESETEO DE DATOS VINCULADOS DE FACTURA AL DESMARCAR
    function desvincularYLimpiarFactura() {
        facturaVinculada = false;
        if (containerFacturaInfo) containerFacturaInfo.classList.add('hidden');
        if (feedbackFactura) feedbackFactura.className = 'hidden';
        if (inputNumFactura) inputNumFactura.value = '';

        if (rucDest) rucDest.value = '';
        if (nomDest) nomDest.value = '';
        if (dirLlegada) dirLlegada.value = '';

        setFeedback('ruc-destinatario', null);
        setFeedback('nom-destinatario', null);
        setFeedback('dir-llegada', null);

        bienesList = [];
        renderBienes();
    }

    // LIMPIEZA GENERAL COMPLETA
    function resetearFormularioGuia() {
        if (formGuia) formGuia.reset();
        
        var hoyStr = new Date().toISOString().split('T')[0];
        if (fechaInicio) fechaInicio.value = hoyStr;

        desvincularYLimpiarFactura();
        limpiarDatosTransporte();

        var errorElements = document.querySelectorAll('[id^="err-"]');
        errorElements.forEach(function(el) {
            el.textContent = '';
            el.classList.add('hidden');
        });

        currentStep = 1;
        showStep(1);
    }

    // EVENTO AL CAMBIAR CHECKBOX VINCULAR FACTURA
    if (checkVincular) {
        checkVincular.addEventListener('change', function() {
            if (checkVincular.checked) {
                containerFacturaInfo.classList.remove('hidden');
            } else {
                desvincularYLimpiarFactura();
            }
        });
    }

    if (btnBuscarFactura) {
        btnBuscarFactura.addEventListener('click', function() {
            var num = inputNumFactura.value.trim().toUpperCase();
            if (num === 'F001-42' || num === 'F001-00000042') {
                facturaVinculada = true;
                
                limpiarDatosTransporte();

                rucDest.value = '20615611809';
                nomDest.value = 'ABP TECNOLOGIA CONSULT S.A.C.';
                dirLlegada.value = 'AV. LOS OLIVOS NRO. 452 (LOS OLIVOS - LIMA)';
                
                setFeedback('ruc-destinatario', null);
                setFeedback('nom-destinatario', null);
                setFeedback('dir-llegada', null);

                feedbackFactura.textContent = '✓ Factura ' + num + ' vinculada exitosamente. Datos autocompletados.';
                feedbackFactura.className = 'text-xs font-semibold p-2.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 block';
                
                bienesList = [
                    { id: 1, codigo: 'PROD-001', descripcion: 'Servicio de Consultoría TI / Desarrollo Web', unidad: 'NIU', cantidad: 2 },
                    { id: 2, codigo: 'PROD-002', descripcion: 'Licencia Software SUNAT SOL Astro UI', unidad: 'NIU', cantidad: 2 }
                ];
                renderBienes();
            } else {
                facturaVinculada = false;
                feedbackFactura.textContent = '✕ No se encontró la factura. Ingrese F001-42.';
                feedbackFactura.className = 'text-xs font-semibold p-2.5 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 block';
            }
        });
    }

    // VALIDACIONES REACTIVAS EN TIEMPO REAL (ON-INPUT & ON-BLUR)
    if (fechaInicio) {
        fechaInicio.addEventListener('change', function() {
            var hoyStr = new Date().toISOString().split('T')[0];
            if (!this.value) {
                setFeedback('fec-inicio-traslado', '✕ Debe seleccionar la fecha de inicio.');
            } else if (this.value < hoyStr) {
                setFeedback('fec-inicio-traslado', '✕ La fecha debe ser de hoy en adelante.');
            } else {
                setFeedback('fec-inicio-traslado', null);
            }
        });
    }

    if (rucDest) {
        rucDest.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '');
            if (this.value.length === 11) {
                setFeedback('ruc-destinatario', null);
            }
        });
        rucDest.addEventListener('blur', function() {
            if (!this.value.trim()) {
                setFeedback('ruc-destinatario', '✕ Ingrese el RUC del destinatario.');
            } else if (this.value.length !== 11) {
                setFeedback('ruc-destinatario', '✕ El RUC debe contener exactamente 11 dígitos.');
            } else {
                setFeedback('ruc-destinatario', null);
            }
        });
    }

    if (nomDest) {
        nomDest.addEventListener('input', function() {
            if (this.value.trim()) setFeedback('nom-destinatario', null);
        });
        nomDest.addEventListener('blur', function() {
            setFeedback('nom-destinatario', this.value.trim() ? null : '✕ La Razón Social del destinatario no puede estar vacía.');
        });
    }

    if (dirPartida) {
        dirPartida.addEventListener('input', function() {
            if (this.value.trim()) setFeedback('dir-partida', null);
        });
        dirPartida.addEventListener('blur', function() {
            setFeedback('dir-partida', this.value.trim() ? null : '✕ Ingrese la dirección completa de partida.');
        });
    }

    if (dirLlegada) {
        dirLlegada.addEventListener('input', function() {
            if (this.value.trim()) setFeedback('dir-llegada', null);
        });
        dirLlegada.addEventListener('blur', function() {
            setFeedback('dir-llegada', this.value.trim() ? null : '✕ Ingrese la dirección completa de llegada.');
        });
    }

    if (conductorDoc) {
        conductorDoc.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '');
            if (this.value.length >= 8) setFeedback('conductor-doc', null);
        });
        conductorDoc.addEventListener('blur', function() {
            if (!this.value.trim() || this.value.length < 8) {
                setFeedback('conductor-doc', '✕ El DNI/Brevete debe tener al menos 8 dígitos.');
            } else {
                setFeedback('conductor-doc', null);
            }
        });
    }

    if (conductorNombre) {
        conductorNombre.addEventListener('input', function() {
            if (this.value.trim()) setFeedback('conductor-nombre', null);
        });
        conductorNombre.addEventListener('blur', function() {
            setFeedback('conductor-nombre', this.value.trim() ? null : '✕ El nombre del conductor es obligatorio.');
        });
    }

    if (vehiculoPlaca) {
        vehiculoPlaca.addEventListener('input', function() {
            this.value = this.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
            if (this.value.length >= 6) setFeedback('vehiculo-placa', null);
        });
        vehiculoPlaca.addEventListener('blur', function() {
            if (!this.value.trim() || this.value.length < 6) {
                setFeedback('vehiculo-placa', '✕ Formato de placa inválido (mínimo 6 caracteres).');
            } else {
                setFeedback('vehiculo-placa', null);
            }
        });
    }

    if (transpRuc) {
        transpRuc.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '');
            if (this.value.length === 11) setFeedback('transp-ruc', null);
        });
        transpRuc.addEventListener('blur', function() {
            if (!this.value.trim() || this.value.length !== 11) {
                setFeedback('transp-ruc', '✕ El RUC del transportista debe tener 11 dígitos.');
            } else {
                setFeedback('transp-ruc', null);
            }
        });
    }

    if (transpNombre) {
        transpNombre.addEventListener('input', function() {
            if (this.value.trim()) setFeedback('transp-nombre', null);
        });
        transpNombre.addEventListener('blur', function() {
            setFeedback('transp-nombre', this.value.trim() ? null : '✕ La razón social del transportista es obligatoria.');
        });
    }

    if (pesoTotal) {
        pesoTotal.addEventListener('input', function() {
            var val = parseFloat(this.value);
            if (!isNaN(val) && val > 0) setFeedback('peso-total', null);
        });
        pesoTotal.addEventListener('blur', function() {
            var val = parseFloat(this.value);
            if (isNaN(val) || val <= 0) {
                setFeedback('peso-total', '✕ Ingrese un peso bruto mayor a 0.00 KGM.');
            } else {
                setFeedback('peso-total', null);
            }
        });
    }

    if (selectModalidad) {
        selectModalidad.addEventListener('change', function() {
            if (selectModalidad.value === '01') {
                secTranspPublico.classList.remove('hidden');
                secTranspPrivado.classList.add('hidden');
            } else {
                secTranspPrivado.classList.remove('hidden');
                secTranspPublico.classList.add('hidden');
            }
        });
    }

    // GESTIÓN DE BIENES
    if (btnAgregarBien) {
        btnAgregarBien.addEventListener('click', function() {
            idEnEdicionBien = null;
            if (modalBienTitulo) modalBienTitulo.textContent = 'Agregar Bien al Traslado';
            document.getElementById('m-bien-codigo').value = '';
            document.getElementById('m-bien-desc').value = '';
            document.getElementById('m-bien-cant').value = '1';
            feedbackBien.className = 'hidden';
            modalBien.classList.remove('hidden');
        });
    }

    if (btnCerrarBien) btnCerrarBien.addEventListener('click', function() { modalBien.classList.add('hidden'); });
    if (btnCancelarBien) btnCancelarBien.addEventListener('click', function() { modalBien.classList.add('hidden'); });

    if (btnGuardarBien) {
        btnGuardarBien.addEventListener('click', function() {
            var cod = document.getElementById('m-bien-codigo').value.trim();
            var desc = document.getElementById('m-bien-desc').value.trim();
            var cant = parseFloat(document.getElementById('m-bien-cant').value);
            var unidad = document.getElementById('m-bien-unidad').value;

            if (!desc) {
                feedbackBien.textContent = '✕ La descripción del bien es obligatoria.';
                feedbackBien.className = 'text-xs font-semibold p-2.5 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 block';
                return;
            }

            if (isNaN(cant) || cant <= 0) {
                feedbackBien.textContent = '✕ La cantidad debe ser mayor a 0.';
                feedbackBien.className = 'text-xs font-semibold p-2.5 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 block';
                return;
            }

            if (idEnEdicionBien) {
                var item = bienesList.find(function(b) { return b.id === idEnEdicionBien; });
                if (item) {
                    item.codigo = cod || 'S/C';
                    item.descripcion = desc;
                    item.unidad = unidad;
                    item.cantidad = cant;
                }
            } else {
                bienesList.push({
                    id: Date.now(),
                    codigo: cod || 'S/C',
                    descripcion: desc,
                    unidad: unidad,
                    cantidad: cant
                });
            }

            renderBienes();
            modalBien.classList.add('hidden');
        });
    }

    function renderBienes() {
        if (!tablaBienes) return;
        tablaBienes.innerHTML = '';

        var totalBultosCalculados = 0;

        if (bienesList.length === 0) {
            var trEmpty = document.createElement('tr');
            trEmpty.innerHTML = '<td colspan="5" class="p-6 text-center text-slate-400 dark:text-slate-500">No hay bienes registrados. Ingrese F001-42 en vincular factura o agréguelos manualmente.</td>';
            tablaBienes.appendChild(trEmpty);
        } else {
            for (var i = 0; i < bienesList.length; i++) {
                var b = bienesList[i];
                totalBultosCalculados += b.cantidad;

                var tr = document.createElement('tr');
                tr.setAttribute('data-id', b.id);
                tr.innerHTML = '<td class="p-3 font-semibold text-slate-600 dark:text-slate-400">' + b.codigo + '</td>' +
                    '<td class="p-3 font-bold text-slate-900 dark:text-slate-100">' + b.descripcion + '</td>' +
                    '<td class="p-3 font-medium text-slate-700 dark:text-slate-300">' + b.unidad + '</td>' +
                    '<td class="p-3 text-center font-bold text-slate-900 dark:text-slate-100">' + b.cantidad + '</td>' +
                    '<td class="p-3 text-center">' +
                        '<div class="flex items-center justify-center gap-1.5">' +
                            '<button type="button" class="btn-edit-bien text-sunat-blue hover:text-sky-700 font-bold" title="Editar bien">✏️</button>' +
                            '<button type="button" class="btn-del-bien text-rose-600 hover:text-rose-800 font-bold" title="Eliminar bien">🗑️</button>' +
                        '</div>' +
                    '</td>';
                tablaBienes.appendChild(tr);
            }
        }

        if (cantBultos) cantBultos.value = totalBultosCalculados;
    }

    if (tablaBienes) {
        tablaBienes.addEventListener('click', function(e) {
            var tr = e.target.closest('tr');
            if (!tr) return;
            var id = parseInt(tr.getAttribute('data-id'));

            if (e.target.classList.contains('btn-del-bien')) {
                bienesList = bienesList.filter(function(b) { return b.id !== id; });
                renderBienes();
            }

            if (e.target.classList.contains('btn-edit-bien')) {
                var bien = bienesList.find(function(b) { return b.id === id; });
                if (bien) {
                    idEnEdicionBien = id;
                    if (modalBienTitulo) modalBienTitulo.textContent = 'Editar Bien del Traslado';
                    document.getElementById('m-bien-codigo').value = bien.codigo;
                    document.getElementById('m-bien-desc').value = bien.descripcion;
                    document.getElementById('m-bien-cant').value = bien.cantidad;
                    document.getElementById('m-bien-unidad').value = bien.unidad;
                    feedbackBien.className = 'hidden';
                    modalBien.classList.remove('hidden');
                }
            }
        });
    }

    // NAVEGACIÓN PASO A PASO
    function showStep(step) {
        for (var i = 1; i <= totalSteps; i++) {
            var sec = document.getElementById('step-content-' + i);
            var indicator = document.getElementById('step-indicator-' + i);
            var line = document.getElementById('step-line-' + i);

            if (sec) sec.classList.toggle('hidden', i !== step);

            if (indicator) {
                if (i === step) {
                    indicator.className = 'flex h-8 w-8 items-center justify-center rounded-full bg-sunat-blue text-white font-bold text-xs ring-4 ring-sky-100 dark:ring-sky-900/40';
                } else if (i < step) {
                    indicator.className = 'flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-xs';
                    indicator.textContent = '✓';
                } else {
                    indicator.className = 'flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 font-bold text-xs dark:bg-slate-800 dark:text-slate-400';
                    indicator.textContent = i;
                }
            }

            if (line && i < totalSteps) {
                line.className = i < step ? 'h-1 flex-1 bg-emerald-500' : 'h-1 flex-1 bg-slate-200 dark:bg-slate-800';
            }
        }

        btnPrev.classList.toggle('hidden', step === 1);
        if (step === totalSteps) {
            btnNext.classList.add('hidden');
            btnSubmit.classList.remove('hidden');
            if (btnVistaPrevia) btnVistaPrevia.classList.remove('hidden');
        } else {
            btnNext.classList.remove('hidden');
            btnSubmit.classList.add('hidden');
            if (btnVistaPrevia) btnVistaPrevia.classList.add('hidden');
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function validateCurrentStep() {
        var esValido = true;

        if (currentStep === 1) {
            var hoyStr = new Date().toISOString().split('T')[0];
            if (!fechaInicio.value) {
                setFeedback('fec-inicio-traslado', '✕ Debe seleccionar la fecha de inicio.');
                esValido = false;
            } else if (fechaInicio.value < hoyStr) {
                setFeedback('fec-inicio-traslado', '✕ La fecha debe ser de hoy en adelante.');
                esValido = false;
            }

            if (!rucDest || rucDest.value.trim().length !== 11) {
                setFeedback('ruc-destinatario', '✕ Ingrese un RUC de destinatario válido (11 dígitos numéricos).');
                esValido = false;
            }

            if (!nomDest || !nomDest.value.trim()) {
                setFeedback('nom-destinatario', '✕ Ingrese la Razón Social del destinatario.');
                esValido = false;
            }

            if (checkVincular && checkVincular.checked && !facturaVinculada) {
                alert('Paso 1: Marcó la opción Vincular Factura. Presione "Vincular Factura" con el código F001-42.');
                esValido = false;
            }
        }

        if (currentStep === 2) {
            if (!dirPartida || !dirPartida.value.trim()) {
                setFeedback('dir-partida', '✕ Ingrese la dirección completa de punto de partida.');
                esValido = false;
            }
            if (!dirLlegada || !dirLlegada.value.trim()) {
                setFeedback('dir-llegada', '✕ Ingrese la dirección completa de punto de llegada.');
                esValido = false;
            }
        }

        if (currentStep === 3) {
            if (selectModalidad.value === '02') {
                if (!conductorDoc || conductorDoc.value.trim().length < 8) {
                    setFeedback('conductor-doc', '✕ Ingrese el DNI/Brevete del conductor (mínimo 8 dígitos).');
                    esValido = false;
                }
                if (!conductorNombre || !conductorNombre.value.trim()) {
                    setFeedback('conductor-nombre', '✕ El nombre del conductor es obligatorio.');
                    esValido = false;
                }
                if (!vehiculoPlaca || vehiculoPlaca.value.trim().length < 6) {
                    setFeedback('vehiculo-placa', '✕ Ingrese la placa del vehículo (Ej: ABC-123).');
                    esValido = false;
                }
            } else {
                if (!transpRuc || transpRuc.value.trim().length !== 11) {
                    setFeedback('transp-ruc', '✕ Ingrese el RUC de la empresa de transportes (11 dígitos).');
                    esValido = false;
                }
                if (!transpNombre || !transpNombre.value.trim()) {
                    setFeedback('transp-nombre', '✕ La razón social del transportista es obligatoria.');
                    esValido = false;
                }
            }
        }

        return esValido;
    }

    if (btnNext) {
        btnNext.addEventListener('click', function() {
            if (validateCurrentStep()) {
                currentStep++;
                showStep(currentStep);
            }
        });
    }

    if (btnPrev) {
        btnPrev.addEventListener('click', function() {
            if (currentStep > 1) {
                currentStep--;
                showStep(currentStep);
            }
        });
    }

    // PREVISUALIZACIÓN DE LA GUÍA DE REMISIÓN
    function cargarVistaPrevia() {
        var hoyStr = new Date().toISOString().split('T')[0];
        
        var elFecEmision = document.getElementById('pv-gre-fec-emision');
        if (elFecEmision) elFecEmision.textContent = hoyStr;

        var elFecInicio = document.getElementById('pv-gre-fec-inicio');
        if (elFecInicio) elFecInicio.textContent = fechaInicio.value || hoyStr;

        var elDestNom = document.getElementById('pv-gre-dest-nom');
        if (elDestNom) elDestNom.textContent = nomDest.value || '-';

        var elDestRuc = document.getElementById('pv-gre-dest-ruc');
        if (elDestRuc) elDestRuc.textContent = rucDest.value || '-';

        var elDestDir = document.getElementById('pv-gre-dest-dir');
        if (elDestDir) elDestDir.textContent = dirLlegada.value || '-';

        var docRel = (checkVincular && checkVincular.checked && inputNumFactura.value) 
            ? 'Factura: ' + inputNumFactura.value.toUpperCase() 
            : 'Sin documento relacionado';
        var elDocRel = document.getElementById('pv-gre-doc-rel');
        if (elDocRel) elDocRel.textContent = docRel;

        var motivoSelect = document.getElementById('motivo-traslado');
        var motivoTexto = motivoSelect ? motivoSelect.options[motivoSelect.selectedIndex].text : 'Venta';
        var elMotivo = document.getElementById('pv-gre-motivo');
        if (elMotivo) elMotivo.textContent = motivoTexto;

        var esPrivado = selectModalidad.value === '02';
        var elModalidad = document.getElementById('pv-gre-modalidad');
        if (elModalidad) elModalidad.textContent = esPrivado ? 'Transporte privado' : 'Transporte público';
        
        var elPeso = document.getElementById('pv-gre-peso');
        if (elPeso) elPeso.textContent = (pesoTotal.value || '0.00');

        var elBultos = document.getElementById('pv-gre-bultos');
        if (elBultos) elBultos.textContent = cantBultos.value || '0';

        var elPartida = document.getElementById('pv-gre-partida');
        if (elPartida) elPartida.textContent = dirPartida.value || '-';

        var elLlegada = document.getElementById('pv-gre-llegada');
        if (elLlegada) elLlegada.textContent = dirLlegada.value || '-';

        var infoTransp = '';
        if (esPrivado) {
            infoTransp = 'Conductor: ' + (conductorNombre.value || '-') + ' | Doc: ' + (conductorDoc.value || '-') + ' | Placa: ' + (vehiculoPlaca.value || '-');
        } else {
            infoTransp = 'Transportista: ' + (transpNombre.value || '-') + ' | RUC: ' + (transpRuc.value || '-');
        }
        var elTransp = document.getElementById('pv-gre-transporte');
        if (elTransp) elTransp.textContent = infoTransp;

        var pvBody = document.getElementById('pv-gre-tabla-body');
        if (pvBody) {
            pvBody.innerHTML = '';
            for (var i = 0; i < bienesList.length; i++) {
                var b = bienesList[i];
                var row = document.createElement('tr');
                row.className = 'border-t border-slate-200';
                row.innerHTML = '<td class="py-1.5 px-2 text-center font-bold">' + (i + 1) + '</td>' +
                    '<td class="py-1.5 px-2 font-semibold">' + b.codigo + '</td>' +
                    '<td class="py-1.5 px-2 font-bold">' + b.descripcion + '</td>' +
                    '<td class="py-1.5 px-2 text-center">' + b.unidad + '</td>' +
                    '<td class="py-1.5 px-2 text-right font-bold">' + b.cantidad + '</td>';
                pvBody.appendChild(row);
            }
        }
    }

    function imprimirFormato(formato) {
        cargarVistaPrevia();
        if (modalPV) modalPV.classList.remove('hidden');

        var docElem = document.getElementById('documento-impreso-gre');
        if (docElem) {
            if (formato === '80MM') {
                docElem.style.maxWidth = '80mm';
            } else if (formato === 'A5') {
                docElem.style.maxWidth = '148mm';
            } else {
                docElem.style.maxWidth = '210mm';
            }
        }

        setTimeout(function() {
            window.print();
            if (docElem) docElem.style.maxWidth = '';
            if (modalPV) modalPV.classList.add('hidden');
        }, 150);
    }

    if (btnDescargaA4) btnDescargaA4.addEventListener('click', function() { imprimirFormato('A4'); });
    if (btnDescarga80mm) btnDescarga80mm.addEventListener('click', function() { imprimirFormato('80MM'); });
    if (btnDescargaA5) btnDescargaA5.addEventListener('click', function() { imprimirFormato('A5'); });

    if (btnVistaPrevia) {
        btnVistaPrevia.addEventListener('click', function() {
            var valPeso = parseFloat(pesoTotal.value);
            if (isNaN(valPeso) || valPeso <= 0) {
                setFeedback('peso-total', '✕ Ingrese un peso bruto mayor a 0.00 KGM antes de previsualizar.');
                pesoTotal.focus();
                return;
            }
            if (bienesList.length === 0) {
                alert('Paso 4: Debe incluir al menos un bien antes de previsualizar la guía.');
                return;
            }
            cargarVistaPrevia();
            if (modalPV) modalPV.classList.remove('hidden');
        });
    }

    if (btnCerrarPV) btnCerrarPV.addEventListener('click', function() { if (modalPV) modalPV.classList.add('hidden'); });

    // EMISIÓN DE LA GUÍA CON REPRODUCCIÓN DE AUDIO DE ÉXITO
    if (formGuia) {
        formGuia.addEventListener('submit', function(e) {
            e.preventDefault();
            var valPeso = parseFloat(pesoTotal.value);
            if (isNaN(valPeso) || valPeso <= 0) {
                setFeedback('peso-total', '✕ Ingrese un peso bruto mayor a 0.00 KGM antes de emitir.');
                pesoTotal.focus();
                return;
            }

            if (bienesList.length === 0) {
                alert('Paso 4: Debe incluir al menos un bien para emitir la Guía.');
                return;
            }

            if (modalExito) {
                modalExito.classList.remove('hidden');
                reproducirSonidoExito(); // Disparo del sonido al ser exitoso
            }
        });
    }

    if (btnCerrarExitoGre) {
        btnCerrarExitoGre.addEventListener('click', function() {
            if (modalExito) modalExito.classList.add('hidden');
            resetearFormularioGuia();
        });
    }

    renderBienes();
    showStep(1);
});