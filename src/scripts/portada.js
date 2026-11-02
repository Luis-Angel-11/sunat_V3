document.addEventListener('DOMContentLoaded', () => {
    const inputBuscador = document.getElementById('buscador-portada');
    const resultadosContainer = document.getElementById('resultados-busqueda-portada');
    const formBuscador = document.getElementById('form-buscador-portada');

    // CATÁLOGO COMPLETO Y DIVERSIFICADO DE LA SUNAT
    const tramites = [
        // --- COMPROBANTES DE PAGO Y FACTURACIÓN ---
        { 
            titulo: 'Emitir Factura / Boleta de Venta Electrónica', 
            url: '/facturas/emitir', 
            desc: 'Emisión de comprobantes de pago electrónicos con validación de RUC/DNI', 
            tag: 'Clave SOL' 
        },
        { 
            titulo: 'Consulta de Facturas, Boletas y Comprobantes', 
            url: '/facturas/consulta', 
            desc: 'Consulta masiva por lote, verificación de CDR y descarga XML/PDF', 
            tag: 'Clave SOL' 
        },
        { 
            titulo: 'Validar Autenticidad de Comprobante de Pago', 
            url: '/comprobantes/validar', 
            desc: 'Verifica si una factura, boleta o ticket es válido y está registrado en SUNAT', 
            tag: 'Sin Clave SOL' 
        },

        // --- TRABAJO INDEPENDIENTE (RHE) ---
        { 
            titulo: 'Emitir Recibo por Honorarios Electrónico (RHE)', 
            url: '/rhe/emitir', 
            desc: 'Emisión de recibos por honorarios para trabajadores independientes (Cuarta Categoría)', 
            tag: 'Clave SOL' 
        },
        { 
            titulo: 'Validar Recibo por Honorarios Electrónico', 
            url: '/rhe/validar', 
            desc: 'Verificación pública de validez e información de un RHE emitido', 
            tag: 'Sin Clave SOL' 
        },
        { 
            titulo: 'Solicitar Suspensión de Retenciones de Cuarta Categoría', 
            url: '/rhe/suspension', 
            desc: 'Formulario 1609 para suspender la retención del 8% de Impuesto a la Renta', 
            tag: 'Clave SOL' 
        },

        // --- TRASLADO Y GUÍAS DE REMISIÓN ---
        { 
            titulo: 'Emitir Guía de Remisión Electrónica (GRE) Remitente / Transportista', 
            url: '/guias/emitir', 
            desc: 'Generación de guías de transporte de bienes vinculadas a facturas de venta', 
            tag: 'Clave SOL' 
        },

        // --- RUC Y REGISTRO ---
        { 
            titulo: 'Inscripción en el RUC / Obtener RUC por Primera Vez', 
            url: '/ruc/inscripcion', 
            desc: 'Registro para personas naturales con o sin negocio y empresas', 
            tag: 'Sin Clave SOL' 
        },
        { 
            titulo: 'Consulta RUC / Estado y Condición del Contribuyente', 
            url: '/ruc/consulta', 
            desc: 'Verifica la condición de Habido/No Habido y actividad económica de una persona o empresa', 
            tag: 'Sin Clave SOL' 
        },
        { 
            titulo: 'Obtener o Recuperar Clave SOL', 
            url: '/clave-sol/recuperar', 
            desc: 'Genera o restablece tu contraseña de acceso a SUNAT Operaciones en Línea', 
            tag: 'Sin Clave SOL' 
        },

        // --- RECLAMOS, QUEJAS Y ATENCIÓN AL CIUDADANO ---
        { 
            titulo: 'Libro de Reclamaciones Virtual', 
            url: '/reclamos/nuevo', 
            desc: 'Registra una queja o reclamo formal sobre la atención recibida en SUNAT', 
            tag: 'Sin Clave SOL' 
        },
        { 
            titulo: 'Mesa de Partes Virtual (MPV-SUNAT)', 
            url: '/mesa-partes', 
            desc: 'Presentación e ingreso de documentos, trámites, cartas y solicitudes electrónicas', 
            tag: 'Acceso Libre' 
        },
        { 
            titulo: 'Central de Consultas y Canales de Atención', 
            url: '/atencion/contacto', 
            desc: 'Teléfonos de contacto, chatbot Sofia, centros de servicios y redes sociales', 
            tag: 'Ayuda y Orientación' 
        },
        { 
            titulo: 'Guías, Tutoriales y Orientación Tributaria', 
            url: '/orientacion/guias', 
            desc: 'Material educativo, videos explicativos e instrucciones paso a paso para trámites', 
            tag: 'Ayuda y Orientación' 
        },

        // --- PAGOS, FRACCIONAMIENTO Y DEUDAS ---
        { 
            titulo: 'Solicitar o Pagar Fraccionamiento de Deuda (Art. 36)', 
            url: '/pagos/fraccionamiento', 
            desc: 'Paga en cuotas mensuales tus deudas tributarias o fraccionamientos vigentes', 
            tag: 'Clave SOL' 
        },
        { 
            titulo: 'Buzón Electrónico SOL - Notificaciones y Avisos', 
            url: '/buzon/mensajes', 
            desc: 'Revisa las notificaciones, alertas de vencimiento y esquelas enviadas por SUNAT', 
            tag: 'Clave SOL' 
        },
        { 
            titulo: 'Denuncias por Actos de Corrupción o Infracciones Tributarias', 
            url: '/denuncias/nueva', 
            desc: 'Reporte confidencial de irregularidades, no emisión de comprobantes o corrupción', 
            tag: 'Sin Clave SOL' 
        }
    ];

    if (!inputBuscador || !resultadosContainer) return;

    // EVENTO EN TIEMPO REAL AL ESCRIBIR
    inputBuscador.addEventListener('input', () => {
        const query = inputBuscador.value.trim().toLowerCase();

        // REGLA: Activación obligatoria a partir del 3.er carácter
        if (query.length < 3) {
            resultadosContainer.classList.add('hidden');
            resultadosContainer.innerHTML = '';
            return;
        }

        // Búsqueda cruzada por palabras clave en título y descripción
        const coincidencias = tramites.filter(item => 
            item.titulo.toLowerCase().includes(query) || 
            item.desc.toLowerCase().includes(query)
        );

        resultadosContainer.innerHTML = '';

        if (coincidencias.length === 0) {
            resultadosContainer.innerHTML = `
                <div class="p-4 text-xs text-slate-500 dark:text-slate-400 font-medium text-center">
                    No se encontraron trámites o servicios relacionados con "<strong>${inputBuscador.value}</strong>".<br>
                    <span class="text-[11px] text-slate-400">Intenta buscar palabras clave como <em>factura, RHE, reclamos, clave SOL, RUC o ayuda</em>.</span>
                </div>`;
        } else {
            coincidencias.forEach(item => {
                const opcion = document.createElement('a');
                opcion.href = item.url;
                opcion.className = 'flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left group';
                opcion.innerHTML = `
                    <div class="pr-3">
                        <p class="font-bold text-xs text-slate-900 dark:text-white group-hover:text-[#0877a7] dark:group-hover:text-sky-400">
                            ${ resaltarTexto(item.titulo, query) }
                        </p>
                        <p class="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                            ${ item.desc }
                        </p>
                    </div>
                    <span class="text-[10px] font-extrabold px-2 py-0.5 rounded bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 shrink-0">
                        ${ item.tag }
                    </span>`;
                resultadosContainer.appendChild(opcion);
            });
        }

        resultadosContainer.classList.remove('hidden');
    });

    // Función auxiliar para resaltar coincidencias
    function resaltarTexto(texto, busqueda) {
        const regex = new RegExp(`(${busqueda})`, 'gi');
        return texto.replace(regex, '<mark class="bg-amber-200 text-slate-900 dark:bg-amber-500/40 dark:text-white rounded-sm px-0.5">$1</mark>');
    }

    // Manejo del envío del formulario (Enter o botón Buscar)
    if (formBuscador) {
        formBuscador.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = inputBuscador.value.trim().toLowerCase();
            
            if (query.length < 3) return;

            const coincidencia = tramites.find(t => 
                t.titulo.toLowerCase().includes(query) || query.includes(t.titulo.toLowerCase())
            );

            if (coincidencia) {
                window.location.href = coincidencia.url;
            } else {
                window.location.href = `/facturas/consulta?q=${encodeURIComponent(query)}`;
            }
        });
    }

    // Ocultar desplegable si se hace clic fuera del buscador
    document.addEventListener('click', (e) => {
        if (!inputBuscador.contains(e.target) && !resultadosContainer.contains(e.target)) {
            resultadosContainer.classList.add('hidden');
        }
    });

    // Abrir menú si ya tiene 3 o más caracteres y recibe el foco
    inputBuscador.addEventListener('focus', () => {
        if (inputBuscador.value.trim().length >= 3) {
            inputBuscador.dispatchEvent(new Event('input'));
        }
    });
});