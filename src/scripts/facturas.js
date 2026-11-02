document.addEventListener('DOMContentLoaded', function() {
    var selectTipo = document.getElementById('tipo-comprobante');
    var selectSerie = document.getElementById('serie-comprobante');
    var clienteSearch = document.getElementById('cliente-search');
    var clienteFeedback = document.getElementById('cliente-feedback');
    var tablaBody = document.getElementById('tabla-productos');
    
    // Modal Producto
    var modalProd = document.getElementById('modal-producto');
    var modalTitulo = document.getElementById('modal-titulo');
    var btnModalProd = document.getElementById('btn-modal-producto');
    var btnCerrarModal = document.getElementById('btn-cerrar-modal');
    var btnCancelarModal = document.getElementById('btn-cancelar-modal');
    var btnGuardarProd = document.getElementById('btn-guardar-producto');
    var mpFeedback = document.getElementById('mp-feedback');

    // Modal Cliente
    var modalCliente = document.getElementById('modal-cliente');
    var btnAbrirModalCliente = document.getElementById('btn-abrir-modal-cliente');
    var btnCerrarModalCliente = document.getElementById('btn-cerrar-modal-cliente');
    var btnCancelarModalCliente = document.getElementById('btn-cancelar-modal-cliente');
    var btnGuardarCliente = document.getElementById('btn-guardar-cliente');
    var btnConsultarSunat = document.getElementById('btn-consultar-sunat');
    var mcTipoDoc = document.getElementById('mc-tipo-doc');
    var mcNumero = document.getElementById('mc-numero');
    var mcNombre = document.getElementById('mc-nombre');
    var mcContadorDoc = document.getElementById('mc-contador-doc');
    var mcFeedback = document.getElementById('mc-feedback');

    // Modal Vista Previa y Éxito
    var modalPV = document.getElementById('modal-vista-previa');
    var btnVistaPrevia = document.getElementById('btn-vista-previa');
    var btnCerrarPV = document.getElementById('btn-cerrar-pv');
    var form = document.getElementById('form-facturador');
    var modalExito = document.getElementById('modal-exito');
    var btnCerrarExitoX = document.getElementById('btn-cerrar-exito-x');
    var btnNuevoComprobante = document.getElementById('btn-nuevo-comprobante');
    var btnDescargaA4 = document.getElementById('btn-descarga-a4');
    var btnDescarga80mm = document.getElementById('btn-descarga-80mm');
    var btnDescargaA5 = document.getElementById('btn-descarga-a5');

    var clienteValido = false;
    var idEnEdicion = null;
    var productos = [];

    function mostrarAlerta(el, txt, esError) {
        if (!el) return;
        el.textContent = txt;
        el.className = esError 
            ? 'text-xs font-semibold p-2.5 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 block'
            : 'text-xs font-semibold p-2.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 block';
    }

    function reproducirSonidoExito() {
        try {
            var AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            var ctx = new AudioCtx();

            var osc1 = ctx.createOscillator();
            var gain1 = ctx.createGain();
            osc1.type = 'sine';
            osc1.frequency.value = 523.25;
            gain1.gain.setValueAtTime(0.15, ctx.currentTime);
            gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.start(ctx.currentTime);
            osc1.stop(ctx.currentTime + 0.2);

            var osc2 = ctx.createOscillator();
            var gain2 = ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.value = 659.25;
            gain2.gain.setValueAtTime(0.2, ctx.currentTime + 0.12);
            gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start(ctx.currentTime + 0.12);
            osc2.stop(ctx.currentTime + 0.45);
        } catch (err) {
            console.log('Audio no disponible');
        }
    }

    // LIMPIEZA COMPLETA PARA NUEVO COMPROBANTE
    function resetearFormularioFactura() {
        if (form) form.reset();
        
        productos = [];
        clienteValido = false;
        idEnEdicion = null;

        if (clienteSearch) clienteSearch.value = '';
        if (clienteFeedback) {
            clienteFeedback.textContent = '';
            clienteFeedback.classList.add('hidden');
        }

        if (selectTipo) {
            selectSerie.innerHTML = selectTipo.value === 'BOLETA' 
                ? '<option value="B001">B001</option><option value="B002">B002</option>'
                : '<option value="F001">F001</option><option value="F002">F002</option>';
        }

        renderTabla();

        if (modalExito) modalExito.hidden = true;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (btnAbrirModalCliente) {
        btnAbrirModalCliente.addEventListener('click', function() {
            mcNumero.value = '';
            mcNombre.value = '';
            var elComer = document.getElementById('mc-nombre-comercial');
            if (elComer) elComer.value = '';
            mcContadorDoc.textContent = '0/11';
            mcFeedback.className = 'hidden';
            modalCliente.hidden = false;
        });
    }

    if (btnCerrarModalCliente) btnCerrarModalCliente.addEventListener('click', function() { modalCliente.hidden = true; });
    if (btnCancelarModalCliente) btnCancelarModalCliente.addEventListener('click', function() { modalCliente.hidden = true; });

    if (mcTipoDoc) {
        mcTipoDoc.addEventListener('change', function() {
            var esRUC = mcTipoDoc.value === 'RUC';
            mcNumero.maxLength = esRUC ? 11 : 8;
            mcContadorDoc.textContent = '0/' + mcNumero.maxLength;
            mcNumero.value = '';
        });
    }

    if (mcNumero) {
        mcNumero.addEventListener('input', function() {
            var max = mcTipoDoc.value === 'RUC' ? 11 : 8;
            mcNumero.value = mcNumero.value.replace(/\D/g, '');
            mcContadorDoc.textContent = mcNumero.value.length + '/' + max;
        });
    }

    if (btnConsultarSunat) {
        btnConsultarSunat.addEventListener('click', function() {
            var num = mcNumero.value.trim();
            var esRUC = mcTipoDoc.value === 'RUC';

            if (esRUC && num.length === 11) {
                mcNombre.value = 'ABP TECNOLOGIA CONSULT S.A.C.';
                mostrarAlerta(mcFeedback, '✓ Consulta SUNAT Exitosa: Datos recuperados automáticamente.', false);
            } else if (!esRUC && num.length === 8) {
                mcNombre.value = 'PÉREZ GÓMEZ JUAN CARLOS';
                mostrarAlerta(mcFeedback, '✓ Consulta RENIEC Exitosa: Datos recuperados automáticamente.', false);
            } else {
                var msg = esRUC ? '✕ Ingrese un RUC de 11 dígitos numéricos para consultar.' : '✕ Ingrese un DNI de 8 dígitos numéricos para consultar.';
                mostrarAlerta(mcFeedback, msg, true);
            }
        });
    }

    if (btnGuardarCliente) {
        btnGuardarCliente.addEventListener('click', function() {
            var num = mcNumero.value.trim();
            var nom = mcNombre.value.trim();
            var esRUC = mcTipoDoc.value === 'RUC';

            if ((esRUC && num.length !== 11) || (!esRUC && num.length !== 8)) {
                var msgDoc = esRUC ? '✕ El RUC es obligatorio y debe tener 11 dígitos.' : '✕ El DNI es obligatorio y debe tener 8 dígitos.';
                mostrarAlerta(mcFeedback, msgDoc, true);
                mcNumero.focus();
                return;
            }

            if (nom.length === 0) {
                mostrarAlerta(mcFeedback, '✕ El campo Nombre / Razón Social es obligatorio.', true);
                mcNombre.focus();
                return;
            }

            clienteSearch.value = num;
            validarCliente();
            modalCliente.hidden = true;
        });
    }

    function cargarDatosVistaPrevia() {
        var numSerie = selectSerie.value;
        var tipoNom = selectTipo.value === 'BOLETA' ? 'BOLETA DE VENTA ELECTRÓNICA' : 'FACTURA ELECTRÓNICA';
        document.getElementById('pv-tipo-doc').textContent = tipoNom;
        document.getElementById('pv-num-doc').textContent = numSerie + '-00000042';

        var valCliente = clienteSearch.value.trim();
        if (valCliente) {
            document.getElementById('pv-cliente-ruc').textContent = valCliente;
            document.getElementById('pv-cliente-nom').textContent = valCliente.length === 11 ? 'ABP TECNOLOGIA CONSULT S.A.C.' : 'PÉREZ GÓMEZ JUAN CARLOS';
        } else {
            document.getElementById('pv-cliente-ruc').textContent = '-';
            document.getElementById('pv-cliente-nom').textContent = 'CLIENTE NO INGRESADO';
        }

        var pvBody = document.getElementById('pv-tabla-body');
        pvBody.innerHTML = '';
        for (var i = 0; i < productos.length; i++) {
            var p = productos[i];
            var row = document.createElement('tr');
            row.innerHTML = '<td class="py-1 font-bold">' + p.cant + '</td>' +
                '<td class="py-1">' + p.unidad + '</td>' +
                '<td class="py-1">' + p.nombre + '</td>' +
                '<td class="py-1 text-right">' + p.punit.toFixed(2) + '</td>' +
                '<td class="py-1 text-right font-bold">' + (p.cant * p.punit).toFixed(2) + '</td>';
            pvBody.appendChild(row);
        }

        var totalG = document.getElementById('txt-total').textContent;
        var subG = document.getElementById('txt-subtotal').textContent;
        var igvG = document.getElementById('txt-igv').textContent;

        document.getElementById('pv-subtotal').textContent = subG;
        document.getElementById('pv-igv').textContent = igvG;
        document.getElementById('pv-total').textContent = totalG;
        document.getElementById('pv-letras').textContent = 'SON: ' + totalG + ' SOLES';
    }

    function imprimirFormato(formato) {
        cargarDatosVistaPrevia();
        modalPV.hidden = false;

        var docElem = document.getElementById('documento-impreso');
        if (formato === '80MM') {
            docElem.style.maxWidth = '80mm';
        } else if (formato === 'A5') {
            docElem.style.maxWidth = '148mm';
        } else {
            docElem.style.maxWidth = '210mm';
        }

        setTimeout(function() {
            window.print();
            docElem.style.maxWidth = '';
            modalPV.hidden = true;
        }, 150);
    }

    if (btnDescargaA4) btnDescargaA4.addEventListener('click', function() { imprimirFormato('A4'); });
    if (btnDescarga80mm) btnDescarga80mm.addEventListener('click', function() { imprimirFormato('80MM'); });
    if (btnDescargaA5) btnDescargaA5.addEventListener('click', function() { imprimirFormato('A5'); });

    if (selectTipo) {
        selectTipo.addEventListener('change', function() {
            var esBoleta = selectTipo.value === 'BOLETA';
            selectSerie.innerHTML = esBoleta 
                ? '<option value="B001">B001</option><option value="B002">B002</option>'
                : '<option value="F001">F001</option><option value="F002">F002</option>';
            
            clienteSearch.placeholder = esBoleta 
                ? 'Escriba DNI (8 dígitos) o RUC (11 dígitos) del cliente'
                : 'Escriba el número de RUC del cliente (11 dígitos obligatorio)';
            
            validarCliente();
        });
    }

    function validarCliente() {
        var val = clienteSearch.value.trim();
        var esBoleta = selectTipo.value === 'BOLETA';

        if (val.length === 0) {
            clienteFeedback.classList.add('hidden');
            clienteValido = false;
            return;
        }

        if (val.length === 11 && /^\d+$/.test(val)) {
            clienteFeedback.textContent = '✓ RUC Válido: ABP TECNOLOGIA CONSULT S.A.C.';
            clienteFeedback.className = 'text-xs font-semibold text-emerald-600 dark:text-emerald-400 block';
            clienteValido = true;
        } else if (esBoleta && val.length === 8 && /^\d+$/.test(val)) {
            clienteFeedback.textContent = '✓ DNI Válido: PÉREZ GÓMEZ JUAN CARLOS';
            clienteFeedback.className = 'text-xs font-semibold text-emerald-600 dark:text-emerald-400 block';
            clienteValido = true;
        } else {
            clienteFeedback.textContent = esBoleta 
                ? '✕ Ingrese 8 dígitos para DNI u 11 dígitos para RUC.'
                : '✕ La Factura exige un RUC de 11 dígitos numéricos.';
            clienteFeedback.className = 'text-xs font-semibold text-rose-600 dark:text-rose-400 block';
            clienteValido = false;
        }
    }

    if (clienteSearch) clienteSearch.addEventListener('input', validarCliente);

    function renderTabla() {
        var totalGeneral = 0;
        tablaBody.innerHTML = '';

        if (productos.length === 0) {
            var trEmpty = document.createElement('tr');
            trEmpty.innerHTML = '<td colspan="7" class="p-6 text-center text-slate-400 dark:text-slate-500">No hay productos agregados. Haz clic en <strong>"Agregar Producto"</strong> para registrar uno.</td>';
            tablaBody.appendChild(trEmpty);
        } else {
            for (var i = 0; i < productos.length; i++) {
                var p = productos[i];
                var totalFila = p.cant * p.punit;
                var subtotalFila = totalFila / 1.18;
                var vunit = p.punit / 1.18;
                totalGeneral += totalFila;

                var tr = document.createElement('tr');
                tr.className = 'producto-row';
                tr.setAttribute('data-id', p.id);
                tr.innerHTML = '<td class="p-3">' +
                        '<p class="font-bold text-slate-900 dark:text-slate-100">' + p.nombre + '</p>' +
                        '<span class="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">' + p.afectacion + '</span>' +
                        '<div class="flex items-center gap-1.5 mt-1">' +
                            '<button type="button" class="btn-editar grid h-6 w-6 place-items-center rounded border border-sky-300 text-sunat-blue hover:bg-sky-50 dark:border-sky-700 dark:text-sky-300" title="Editar este producto">✏️</button>' +
                            '<button type="button" class="btn-eliminar grid h-6 w-6 place-items-center rounded border border-rose-300 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400" title="Eliminar ítem">🗑️</button>' +
                        '</div>' +
                    '</td>' +
                    '<td class="p-3 font-semibold text-slate-700 dark:text-slate-300">' + p.unidad + '</td>' +
                    '<td class="p-3 text-center font-bold text-slate-900 dark:text-slate-100">' + p.cant + '</td>' +
                    '<td class="p-3 text-right font-medium text-slate-700 dark:text-slate-300">' + vunit.toFixed(2) + '</td>' +
                    '<td class="p-3 text-right font-bold text-slate-900 dark:text-slate-100">' + p.punit.toFixed(2) + '</td>' +
                    '<td class="p-3 text-right font-medium text-slate-700 dark:text-slate-300">' + subtotalFila.toFixed(2) + '</td>' +
                    '<td class="p-3 text-right font-bold text-slate-900 dark:text-slate-100">' + totalFila.toFixed(2) + '</td>';
                tablaBody.appendChild(tr);
            }
        }

        var subtotalG = totalGeneral / 1.18;
        var igvG = totalGeneral - subtotalG;

        document.getElementById('txt-subtotal').textContent = subtotalG.toFixed(2);
        document.getElementById('txt-igv').textContent = igvG.toFixed(2);
        document.getElementById('txt-total').textContent = totalGeneral.toFixed(2);
        document.getElementById('monto-pago-input').value = totalGeneral.toFixed(2);
        document.getElementById('txt-total-items').textContent = 'Total de ítems: ' + productos.length;
    }

    if (tablaBody) {
        tablaBody.addEventListener('click', function(e) {
            var tr = e.target.closest('tr');
            if (!tr) return;
            var id = parseInt(tr.getAttribute('data-id'));

            if (e.target.classList.contains('btn-eliminar')) {
                productos = productos.filter(function(p) { return p.id !== id; });
                renderTabla();
            }

            if (e.target.classList.contains('btn-editar')) {
                var prod = productos.find(function(p) { return p.id === id; });
                if (prod) {
                    idEnEdicion = id;
                    modalTitulo.textContent = "Editar Producto";
                    document.getElementById('m-nombre').value = prod.nombre;
                    document.getElementById('m-desc').value = prod.nombre;
                    document.getElementById('m-unidad').value = prod.unidad;
                    document.getElementById('m-cantidad').value = prod.cant;
                    document.getElementById('m-precio').value = prod.punit.toFixed(2);
                    document.getElementById('m-afectacion').value = prod.afectacion;
                    mpFeedback.className = 'hidden';
                    modalProd.hidden = false;
                }
            }
        });
    }

    if (btnModalProd) {
        btnModalProd.addEventListener('click', function() {
            idEnEdicion = null;
            modalTitulo.textContent = "Nuevo Producto";
            document.getElementById('m-nombre').value = '';
            document.getElementById('m-desc').value = '';
            document.getElementById('m-cantidad').value = '1';
            document.getElementById('m-precio').value = '0.00';
            document.getElementById('m-unidad').value = 'Unidad';
            mpFeedback.className = 'hidden';
            modalProd.hidden = false;
        });
    }

    if (btnCerrarModal) btnCerrarModal.addEventListener('click', function() { modalProd.hidden = true; });
    if (btnCancelarModal) btnCancelarModal.addEventListener('click', function() { modalProd.hidden = true; });

    if (btnGuardarProd) {
        btnGuardarProd.addEventListener('click', function() {
            var inputNombre = document.getElementById('m-nombre');
            var inputDesc = document.getElementById('m-desc');
            var inputCant = document.getElementById('m-cantidad');
            var inputPrecio = document.getElementById('m-precio');

            var nom = inputNombre.value.trim() || inputDesc.value.trim();
            var unidad = document.getElementById('m-unidad').value;
            var cant = parseFloat(inputCant.value);
            var precio = parseFloat(inputPrecio.value);
            var afectacion = document.getElementById('m-afectacion').value;

            if (!nom) {
                mostrarAlerta(mpFeedback, '✕ El nombre o descripción del producto no puede estar vacío.', true);
                inputNombre.focus();
                return;
            }

            if (isNaN(cant) || cant <= 0) {
                mostrarAlerta(mpFeedback, '✕ La cantidad debe ser un número mayor a 0.', true);
                inputCant.focus();
                return;
            }

            if (isNaN(precio) || precio < 0) {
                mostrarAlerta(mpFeedback, '✕ El precio unitario no puede ser menor a 0.00.', true);
                inputPrecio.focus();
                return;
            }

            if (idEnEdicion) {
                var prod = productos.find(function(p) { return p.id === idEnEdicion; });
                if (prod) {
                    prod.nombre = nom;
                    prod.unidad = unidad;
                    prod.cant = cant;
                    prod.punit = precio;
                    prod.afectacion = afectacion;
                }
            } else {
                productos.push({
                    id: Date.now(),
                    nombre: nom,
                    unidad: unidad,
                    cant: cant,
                    punit: precio,
                    afectacion: afectacion
                });
            }

            renderTabla();
            modalProd.hidden = true;
        });
    }

    if (btnVistaPrevia) {
        btnVistaPrevia.addEventListener('click', function() {
            cargarDatosVistaPrevia();
            modalPV.hidden = false;
        });
    }

    if (btnCerrarPV) btnCerrarPV.addEventListener('click', function() { modalPV.hidden = true; });
    if (btnCerrarExitoX) btnCerrarExitoX.addEventListener('click', function() { modalExito.hidden = true; });

    // EVENTO DEL BOTÓN NUEVO COMPROBANTE
    if (btnNuevoComprobante) {
        btnNuevoComprobante.addEventListener('click', resetearFormularioFactura);
    }

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!clienteValido) {
                alert('Por favor ingrese un número de RUC (11 dígitos) o DNI (8 dígitos) válido antes de emitir.');
                clienteSearch.focus();
                return;
            }

            if (productos.length === 0) {
                alert('Debe agregar al menos un producto antes de generar el comprobante.');
                return;
            }

            var numSerie = selectSerie.value;
            var tipoNom = selectTipo.value === 'BOLETA' ? 'La Boleta' : 'La Factura';
            var codDoc = numSerie + '-00000042';

            document.getElementById('modal-exito-titulo').textContent = 'Comprobante: ' + codDoc;
            document.getElementById('txt-alerta-sunat').textContent = tipoNom + ' numero ' + codDoc + ', ha sido aceptada';

            reproducirSonidoExito();
            modalExito.hidden = false;
        });
    }

    renderTabla();
});