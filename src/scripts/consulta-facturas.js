document.addEventListener('DOMContentLoaded', function() {
    var formConsulta = document.getElementById('form-consulta');
    var btnLimpiar = document.getElementById('btn-limpiar-consulta');
    var tablaResultados = document.getElementById('tabla-resultados-consulta');
    var txtTotalRegistros = document.getElementById('txt-total-registros');
    var feedbackConsulta = document.getElementById('feedback-consulta');

    // Filtros
    var filtroTipo = document.getElementById('filtro-tipo');
    var filtroSerie = document.getElementById('filtro-serie');
    var filtroNumero = document.getElementById('filtro-numero');
    var filtroEstado = document.getElementById('filtro-estado');
    var filtroFecInicio = document.getElementById('filtro-fec-inicio');
    var filtroFecFin = document.getElementById('filtro-fec-fin');
    var filtroCliente = document.getElementById('filtro-cliente');
    var feedbackCliente = document.getElementById('feedback-cliente-consulta');

    // Modal Detalle / Vista Previa
    var modalPVC = document.getElementById('modal-vista-previa-consulta');
    var btnCerrarPVC = document.getElementById('btn-cerrar-pvc');

    var clienteValido = true;

    // BASE DE DATOS SIMULADA DE COMPROBANTES
    var comprobantesBD = [
        // --- FACTURAS Y NOTAS DE CRÉDITO ---
        {
            id: 1,
            emision: '31-10-2026',
            clienteNom: 'AGROINDUSTRIAS RIEGOMAR E.I.R.L.',
            clienteRuc: '20612681563',
            numero: 'F001-00007231',
            tipo: 'FACTURA ELECTRÓNICA',
            tipoCod: 'FACTURA',
            serie: 'F001',
            correlativo: '7231',
            estado: 'ACEPTADO',
            gravado: 1533.90,
            igv: 276.10,
            total: 1810.00,
            items: [
                { cant: 2, desc: 'Sistema de Riego Automatizado IoT', punit: 766.95, total: 1533.90 }
            ]
        },
        {
            id: 2,
            emision: '28-10-2026',
            clienteNom: 'SERVICIOS NAVALES BIMBO E.I.R.L.',
            clienteRuc: '20541651889',
            numero: 'F001-00007230',
            tipo: 'FACTURA ELECTRÓNICA',
            tipoCod: 'FACTURA',
            serie: 'F001',
            correlativo: '7230',
            estado: 'ANULADO',
            gravado: 2500.00,
            igv: 450.00,
            total: 2950.00,
            items: [
                { cant: 1, desc: 'Mantenimiento preventivo de embarcación', punit: 2500.00, total: 2500.00 }
            ]
        },
        {
            id: 3,
            emision: '29-10-2026',
            clienteNom: 'SERVICIOS NAVALES BIMBO E.I.R.L.',
            clienteRuc: '20541651889',
            numero: 'FC01-00000105',
            tipo: 'NOTA DE CRÉDITO',
            tipoCod: 'NC',
            serie: 'FC01',
            correlativo: '0105',
            estado: 'ACEPTADO',
            gravado: -2500.00,
            igv: -450.00,
            total: -2950.00,
            items: [
                { cant: 1, desc: 'Anulación de la operación por devolución - Ref: F001-7230', punit: -2500.00, total: -2500.00 }
            ]
        },
        {
            id: 4,
            emision: '02-11-2026',
            clienteNom: 'INVERSIONES & LOGÍSTICA PÉREZ S.A.C.',
            clienteRuc: '20100123891',
            numero: 'F002-00000150',
            tipo: 'FACTURA ELECTRÓNICA',
            tipoCod: 'FACTURA',
            serie: 'F002',
            correlativo: '0150',
            estado: 'ACEPTADO',
            gravado: 850.00,
            igv: 153.00,
            total: 1003.00,
            items: [
                { cant: 5, desc: 'Servicio de consultoría logística', punit: 170.00, total: 850.00 }
            ]
        },

        // --- BOLETAS DE VENTA ---
        {
            id: 5,
            emision: '02-11-2026',
            clienteNom: 'PÉREZ GÓMEZ JUAN CARLOS',
            clienteRuc: '45891234',
            numero: 'B001-00004510',
            tipo: 'BOLETA DE VENTA ELECTRÓNICA',
            tipoCod: 'BOLETA',
            serie: 'B001',
            correlativo: '4510',
            estado: 'ACEPTADO',
            gravado: 127.12,
            igv: 22.88,
            total: 150.00,
            items: [
                { cant: 1, desc: 'Suministro de componentes electrónicos', punit: 127.12, total: 127.12 }
            ]
        },
        {
            id: 6,
            emision: '29-10-2026',
            clienteNom: 'GARCÍA LÓPEZ MARÍA',
            clienteRuc: '71234567',
            numero: 'B001-00004509',
            tipo: 'BOLETA DE VENTA ELECTRÓNICA',
            tipoCod: 'BOLETA',
            serie: 'B001',
            correlativo: '4509',
            estado: 'ANULADO',
            gravado: 500.00,
            igv: 90.00,
            total: 590.00,
            items: [
                { cant: 1, desc: 'Equipo de medición de agua portátil', punit: 500.00, total: 500.00 }
            ]
        },
        {
            id: 7,
            emision: '30-10-2026',
            clienteNom: 'RAMOS TORRES LOIDA',
            clienteRuc: '10458912341',
            numero: 'B001-00004508',
            tipo: 'BOLETA DE VENTA ELECTRÓNICA',
            tipoCod: 'BOLETA',
            serie: 'B001',
            correlativo: '4508',
            estado: 'ACEPTADO',
            gravado: 280.00,
            igv: 50.40,
            total: 330.40,
            items: [
                { cant: 2, desc: 'Filtros industriales para tratamiento de agua', punit: 140.00, total: 280.00 }
            ]
        },
        {
            id: 8,
            emision: '02-11-2026',
            clienteNom: 'TORRES MENDOZA CARLOS',
            clienteRuc: '09876543',
            numero: 'B002-00000820',
            tipo: 'BOLETA DE VENTA ELECTRÓNICA',
            tipoCod: 'BOLETA',
            serie: 'B002',
            correlativo: '0820',
            estado: 'ACEPTADO',
            gravado: 72.03,
            igv: 12.97,
            total: 85.00,
            items: [
                { cant: 1, desc: 'Mantenimiento de tubería PVC', punit: 72.03, total: 72.03 }
            ]
        }
    ];

    // 1. CAMBIO DINÁMICO DE SERIES Y MAXLENGTH SEGÚN TIPO DE COMPROBANTE
    if (filtroTipo) {
        filtroTipo.addEventListener('change', function() {
            var val = filtroTipo.value;
            if (val === 'FACTURA') {
                filtroSerie.innerHTML = '<option value="TODOS">TODAS LAS SERIES</option><option value="F001">F001</option><option value="F002">F002</option>';
            } else if (val === 'BOLETA') {
                filtroSerie.innerHTML = '<option value="TODOS">TODAS LAS SERIES</option><option value="B001">B001</option><option value="B002">B002</option>';
            } else if (val === 'NC') {
                filtroSerie.innerHTML = '<option value="FC01">FC01</option>';
            } else if (val === 'ND') {
                filtroSerie.innerHTML = '<option value="FD01">FD01</option>';
            } else {
                filtroSerie.innerHTML = '<option value="TODOS">TODAS LAS SERIES</option><option value="F001">F001</option><option value="F002">F002</option><option value="B001">B001</option><option value="B002">B002</option><option value="FC01">FC01</option><option value="FD01">FD01</option>';
            }

            // Ajustar el atributo maxLength según el tipo de comprobante
            if (filtroCliente) {
                if (val === 'BOLETA') {
                    filtroCliente.maxLength = 8;
                } else {
                    filtroCliente.maxLength = 11;
                }
                // Si al cambiar a boleta el texto actual supera los 8 caracteres, recortar automáticamente
                if (val === 'BOLETA' && /^\d+$/.test(filtroCliente.value) && filtroCliente.value.length > 8) {
                    filtroCliente.value = filtroCliente.value.slice(0, 8);
                }
            }

            validarClienteReactivo();
        });
    }

    // 2. VALIDACIÓN REACTIVA HÍBRIDA ESTRICTA EN EL CAMPO CLIENTE
    function validarClienteReactivo() {
        if (!filtroCliente || !feedbackCliente) return;

        var val = filtroCliente.value.trim();
        var tipo = filtroTipo ? filtroTipo.value : 'TODOS';
        var maxPermitido = (tipo === 'BOLETA') ? 8 : 11;

        // Establecer maxLength dinámico
        filtroCliente.maxLength = maxPermitido;

        // Caso 1: Campo Vacío (Válido porque es un filtro opcional)
        if (val.length === 0) {
            feedbackCliente.classList.add('hidden');
            clienteValido = true;
            filtroCliente.className = "h-9 w-full rounded-lg border border-slate-300 px-3 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-white";
            return;
        }

        // Caso 2: El usuario ingresó solo NÚMEROS (DNI o RUC)
        if (/^\d+$/.test(val)) {
            if (tipo === 'BOLETA') {
                // Para Boleta el máximo y único esperado son 8 dígitos de DNI (o 11 si es RUC en caso especial, pero restringido a 8 para DNI)
                if (val.length !== 8) {
                    feedbackCliente.textContent = '✕ Para Boleta debe ingresar exactamente 8 dígitos (DNI).';
                    feedbackCliente.className = 'text-xs font-semibold text-rose-600 dark:text-rose-400 block mt-1';
                    filtroCliente.className = "h-9 w-full rounded-lg border border-rose-500 ring-1 ring-rose-500 px-3 text-xs dark:bg-slate-950 dark:text-white";
                    clienteValido = false;
                } else {
                    feedbackCliente.textContent = '✓ DNI válido para filtro (8 dígitos).';
                    feedbackCliente.className = 'text-xs font-semibold text-emerald-600 dark:text-emerald-400 block mt-1';
                    filtroCliente.className = "h-9 w-full rounded-lg border border-emerald-500 ring-1 ring-emerald-500 px-3 text-xs dark:bg-slate-950 dark:text-white";
                    clienteValido = true;
                }
            } else if (tipo === 'FACTURA') {
                if (val.length !== 11) {
                    feedbackCliente.textContent = '✕ La Factura exige un RUC de exactamente 11 dígitos numéricos.';
                    feedbackCliente.className = 'text-xs font-semibold text-rose-600 dark:text-rose-400 block mt-1';
                    filtroCliente.className = "h-9 w-full rounded-lg border border-rose-500 ring-1 ring-rose-500 px-3 text-xs dark:bg-slate-950 dark:text-white";
                    clienteValido = false;
                } else {
                    feedbackCliente.textContent = '✓ RUC válido para filtro (11 dígitos).';
                    feedbackCliente.className = 'text-xs font-semibold text-emerald-600 dark:text-emerald-400 block mt-1';
                    filtroCliente.className = "h-9 w-full rounded-lg border border-emerald-500 ring-1 ring-emerald-500 px-3 text-xs dark:bg-slate-950 dark:text-white";
                    clienteValido = true;
                }
            } else {
                // Tipo "TODOS" u otros (Permite 8 o 11 dígitos exactos)
                if (val.length !== 8 && val.length !== 11) {
                    feedbackCliente.textContent = '✕ Ingrese un documento válido: 8 dígitos (DNI) u 11 dígitos (RUC).';
                    feedbackCliente.className = 'text-xs font-semibold text-rose-600 dark:text-rose-400 block mt-1';
                    filtroCliente.className = "h-9 w-full rounded-lg border border-rose-500 ring-1 ring-rose-500 px-3 text-xs dark:bg-slate-950 dark:text-white";
                    clienteValido = false;
                } else {
                    feedbackCliente.textContent = '✓ Documento válido para filtro (' + val.length + ' dígitos).';
                    feedbackCliente.className = 'text-xs font-semibold text-emerald-600 dark:text-emerald-400 block mt-1';
                    filtroCliente.className = "h-9 w-full rounded-lg border border-emerald-500 ring-1 ring-emerald-500 px-3 text-xs dark:bg-slate-950 dark:text-white";
                    clienteValido = true;
                }
            }
        } else {
            // Caso 3: Búsqueda por Texto (Razón Social o Nombre)
            feedbackCliente.textContent = '✓ Búsqueda por Razón Social / Nombre.';
            feedbackCliente.className = 'text-xs font-semibold text-sky-600 dark:text-sky-400 block mt-1';
            filtroCliente.className = "h-9 w-full rounded-lg border border-slate-300 px-3 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-white";
            clienteValido = true;
        }
    }

    if (filtroCliente) {
        filtroCliente.addEventListener('input', validarClienteReactivo);
        filtroCliente.addEventListener('blur', validarClienteReactivo);
    }

    // 3. RENDERIZAR TABLA
    function renderTabla(lista) {
        if (!tablaResultados) return;
        tablaResultados.innerHTML = '';

        if (lista.length === 0) {
            var trEmpty = document.createElement('tr');
            trEmpty.innerHTML = '<td colspan="9" class="p-6 text-center text-slate-400 dark:text-slate-500 font-semibold">No se encontraron comprobantes que coincidan con los filtros aplicados.</td>';
            tablaResultados.appendChild(trEmpty);
            if (txtTotalRegistros) txtTotalRegistros.textContent = 'Mostrando 0 comprobantes';
            return;
        }

        if (txtTotalRegistros) txtTotalRegistros.textContent = 'Mostrando ' + lista.length + ' comprobante(s)';

        for (var i = 0; i < lista.length; i++) {
            var c = lista[i];
            
            var badgeColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
            if (c.estado === 'ANULADO') badgeColor = 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';

            var tr = document.createElement('tr');
            tr.className = 'hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition';
            tr.setAttribute('data-id', c.id);
            tr.innerHTML = 
                '<td class="p-3 font-semibold text-slate-700 dark:text-slate-300">' + c.emision + '</td>' +
                '<td class="p-3">' +
                    '<p class="font-bold text-slate-900 dark:text-slate-100">' + c.clienteNom + '</p>' +
                    '<span class="text-[10px] font-mono text-slate-500 dark:text-slate-400">' + c.clienteRuc + '</span>' +
                '</td>' +
                '<td class="p-3">' +
                    '<p class="font-bold text-slate-900 dark:text-slate-100">' + c.numero + '</p>' +
                    '<span class="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">' + c.tipo + '</span>' +
                '</td>' +
                '<td class="p-3 text-center">' +
                    '<span class="inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ' + badgeColor + '">' + c.estado + '</span>' +
                '</td>' +
                '<td class="p-3 text-right font-medium text-slate-700 dark:text-slate-300">S/. ' + c.gravado.toFixed(2) + '</td>' +
                '<td class="p-3 text-right font-medium text-slate-700 dark:text-slate-300">S/. ' + c.igv.toFixed(2) + '</td>' +
                '<td class="p-3 text-right font-bold text-slate-900 dark:text-slate-100">S/. ' + c.total.toFixed(2) + '</td>' +
                '<td class="p-3 text-center">' +
                    '<div class="flex items-center justify-center gap-1">' +
                        '<button type="button" class="btn-dl-xml bg-sky-500 hover:bg-sky-600 text-white font-bold px-2 py-0.5 rounded text-[10px]">XML</button>' +
                        '<button type="button" class="btn-dl-pdf bg-sky-500 hover:bg-sky-600 text-white font-bold px-2 py-0.5 rounded text-[10px]">PDF</button>' +
                        (c.estado === 'ACEPTADO' ? '<button type="button" class="btn-dl-cdr bg-sky-500 hover:bg-sky-600 text-white font-bold px-2 py-0.5 rounded text-[10px]">CDR</button>' : '') +
                    '</div>' +
                '</td>' +
                '<td class="p-3 text-center">' +
                    '<button type="button" class="btn-ver-detalle text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold p-1" title="Ver Detalle">⋮</button>' +
                '</td>';
            
            tablaResultados.appendChild(tr);
        }
    }

    // 4. BÚSQUEDA Y FILTRADO
    function ejecutarBusqueda() {
        if (!clienteValido) {
            alert('Por favor corrija los errores en el filtro de cliente antes de buscar.');
            filtroCliente.focus();
            return;
        }

        var t = filtroTipo.value;
        var s = filtroSerie.value;
        var num = filtroNumero.value.trim();
        var est = filtroEstado.value;
        var cli = filtroCliente.value.trim().toLowerCase();

        var filtrados = comprobantesBD.filter(function(c) {
            var cumpleTipo = (t === 'TODOS' || c.tipoCod === t);
            var cumpleSerie = (s === 'TODOS' || c.serie === s);
            var cumpleNum = (!num || c.correlativo.includes(num) || c.numero.includes(num));
            var cumpleEst = (est === 'TODOS' || c.estado === est);
            var cumpleCli = (!cli || c.clienteNom.toLowerCase().includes(cli) || c.clienteRuc.includes(cli));

            return cumpleTipo && cumpleSerie && cumpleNum && cumpleEst && cumpleCli;
        });

        renderTabla(filtrados);
    }

    if (formConsulta) {
        formConsulta.addEventListener('submit', function(e) {
            e.preventDefault();
            ejecutarBusqueda();
        });
    }

    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', function() {
            formConsulta.reset();
            if (feedbackCliente) feedbackCliente.classList.add('hidden');
            filtroCliente.className = "h-9 w-full rounded-lg border border-slate-300 px-3 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-white";
            clienteValido = true;
            filtroSerie.innerHTML = '<option value="TODOS">TODAS LAS SERIES</option><option value="F001">F001</option><option value="F002">F002</option><option value="B001">B001</option><option value="B002">B002</option><option value="FC01">FC01</option><option value="FD01">FD01</option>';
            renderTabla(comprobantesBD);
        });
    }

    // 5. FUNCIONES PARA DESCARGA DE ARCHIVOS (XML / CDR)
    function descargarArchivoTexto(nombreArchivo, contenido) {
        var blob = new Blob([contenido], { type: 'text/xml;charset=utf-8;' });
        var link = document.createElement('a');
        var url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', nombreArchivo);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function generarEstructuraXML(item) {
        return '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"\n' +
            '         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"\n' +
            '         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">\n' +
            '   <cbc:UBLVersionID>2.1</cbc:UBLVersionID>\n' +
            '   <cbc:ID>' + item.numero + '</cbc:ID>\n' +
            '   <cbc:IssueDate>' + item.emision + '</cbc:IssueDate>\n' +
            '   <cac:AccountingSupplierParty>\n' +
            '       <cbc:CustomerAssignedAccountID>20517352059</cbc:CustomerAssignedAccountID>\n' +
            '   </cac:AccountingSupplierParty>\n' +
            '   <cac:AccountingCustomerParty>\n' +
            '       <cbc:CustomerAssignedAccountID>' + item.clienteRuc + '</cbc:CustomerAssignedAccountID>\n' +
            '   </cac:AccountingCustomerParty>\n' +
            '   <cac:LegalMonetaryTotal>\n' +
            '       <cbc:PayableAmount currencyID="PEN">' + item.total.toFixed(2) + '</cbc:PayableAmount>\n' +
            '   </cac:LegalMonetaryTotal>\n' +
            '</Invoice>';
    }

    function generarEstructuraCDR(item) {
        return '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<AR xmlns="urn:oasis:names:specification:ubl:schema:xsd:ApplicationResponse-2"\n' +
            '    xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"\n' +
            '    xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">\n' +
            '   <cbc:ResponseDate>' + item.emision + '</cbc:ResponseDate>\n' +
            '   <cbc:ResponseCode>0</cbc:ResponseCode>\n' +
            '   <cbc:Description>El Comprobante numero ' + item.numero + ' ha sido ACEPTADO por SUNAT SOL.</cbc:Description>\n' +
            '</AR>';
    }

    // 6. EVENTOS DE ACCIONES EN LA TABLA
    if (tablaResultados) {
        tablaResultados.addEventListener('click', function(e) {
            var tr = e.target.closest('tr');
            if (!tr) return;
            var id = parseInt(tr.getAttribute('data-id'));
            var item = comprobantesBD.find(function(c) { return c.id === id; });
            if (!item) return;

            if (e.target.classList.contains('btn-dl-xml')) {
                descargarArchivoTexto('20517352059-' + item.numero + '.xml', generarEstructuraXML(item));
            }

            if (e.target.classList.contains('btn-dl-cdr')) {
                descargarArchivoTexto('R-20517352059-' + item.numero + '.xml', generarEstructuraCDR(item));
            }

            if (e.target.classList.contains('btn-dl-pdf') || e.target.classList.contains('btn-ver-detalle')) {
                abrirDetalleComprobante(item);
            }
        });
    }

    function abrirDetalleComprobante(item) {
        document.getElementById('pvc-tipo-doc').textContent = item.tipo;
        document.getElementById('pvc-num-doc').textContent = item.numero;
        document.getElementById('pvc-fec').textContent = item.emision;
        document.getElementById('pvc-cliente-nom').textContent = item.clienteNom;
        document.getElementById('pvc-cliente-ruc').textContent = item.clienteRuc;
        document.getElementById('pvc-estado').textContent = item.estado;
        document.getElementById('pvc-subtotal').textContent = item.gravado.toFixed(2);
        document.getElementById('pvc-igv').textContent = item.igv.toFixed(2);
        document.getElementById('pvc-total').textContent = item.total.toFixed(2);

        var body = document.getElementById('pvc-tabla-body');
        if (body) {
            body.innerHTML = '';
            if (item.items.length === 0) {
                body.innerHTML = '<tr><td colspan="4" class="py-2 text-center text-slate-400">Sin detalles registrados</td></tr>';
            } else {
                for (var i = 0; i < item.items.length; i++) {
                    var it = item.items[i];
                    var row = document.createElement('tr');
                    row.className = 'border-b border-slate-200';
                    row.innerHTML = 
                        '<td class="py-1 font-bold">' + it.cant + '</td>' +
                        '<td class="py-1">' + it.desc + '</td>' +
                        '<td class="py-1 text-right">S/. ' + it.punit.toFixed(2) + '</td>' +
                        '<td class="py-1 text-right font-bold">S/. ' + it.total.toFixed(2) + '</td>';
                    body.appendChild(row);
                }
            }
        }

        if (modalPVC) modalPVC.classList.remove('hidden');
    }

    if (btnCerrarPVC) {
        btnCerrarPVC.addEventListener('click', function() {
            if (modalPVC) modalPVC.classList.add('hidden');
        });
    }

    renderTabla(comprobantesBD);
});