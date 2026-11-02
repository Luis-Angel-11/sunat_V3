document.addEventListener('DOMContentLoaded', () => {
    const inputBuscador = document.getElementById('buscador-sol');
    const resultadosContainer = document.getElementById('resultados-busqueda-sol');
    const formBuscador = document.getElementById('form-buscador-sol');
    const listaFavoritosContainer = document.getElementById('lista-favoritos-panel');

    // CATÁLOGO COMPLETO Y AMPLIADO DE TRÁMITES PRIVADOS SOL
    const tramitesSol = [
        { id: 'comprobantes', titulo: 'Consultar Comprobantes de Pago', url: '/sol/comprobantes/consultar', desc: 'Facturas, boletas, notas de crédito y débito', tag: 'Consulta' },
        { id: 'gre', titulo: 'Emitir Guía de Remisión Electrónica (GRE)', url: '/sol/gre/emitir', desc: 'GRE Remitente y Transportista para traslado de bienes', tag: 'GRE' },
        { id: 'rhe', titulo: 'Emitir Recibo por Honorarios Electrónico (RHE)', url: '/sol/rhe/emitir', desc: 'Cuarta Categoría - Trabajadores Independientes', tag: 'RHE' },
        { id: 'consultar-rhe', titulo: 'Consultar Recibos por Honorarios', url: '/sol/rhe/consultar', desc: 'Historial de RHE emitidos y recibidos', tag: 'RHE' },
        { id: 'factura', titulo: 'Emitir Factura Electrónica', url: '/sol/factura/emitir', desc: 'Sistema de Emisión Electrónica SOL', tag: 'Facturas' },
        { id: 'declarar', titulo: 'Declaración Mensual IGV - Renta (Formulario 621)', url: '/sol/declarar/621', desc: 'Presentación de IGV y pago a cuenta de Renta', tag: 'Declaración' },
        { id: 'devolucion', titulo: 'Solicitar Devolución de Impuestos', url: '/sol/devolucion/solicitar', desc: 'Solicitud de devolución por saldo a favor', tag: 'Devolución' },
        { id: 'deuda', titulo: 'Pagar Deuda / Fraccionamiento Art. 36', url: '/sol/deuda/pagar', desc: 'Consulta de valores y pago en cuotas', tag: 'Deuda' },
        { id: 'ruc', titulo: 'Verificar Ficha RUC y Domicilio Fiscal', url: '/sol/ruc/ficha', desc: 'Datos del contribuyente y condición de Habido', tag: 'RUC' }
    ];

    // Cargar Favoritos guardados
    let favoritos = JSON.parse(localStorage.getItem('sunat-sol-favoritos') || '[]');

    const renderFavoritos = () => {
        if (!listaFavoritosContainer) return;

        if (favoritos.length === 0) {
            listaFavoritosContainer.innerHTML = `
                <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Aún no tienes favoritos. Toca la estrella <span class="text-amber-500 font-bold">☆</span> de un trámite para tenerlo siempre a mano.
                </p>`;
        } else {
            listaFavoritosContainer.innerHTML = '';
            const listElement = document.createElement('ul');
            listElement.className = 'space-y-2';

            favoritos.forEach(favId => {
                const itemData = tramitesSol.find(t => t.id === favId);
                if (itemData) {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <a href="${itemData.url}" class="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs font-bold text-slate-800 dark:text-slate-200 group">
                            <span class="truncate pr-2 group-hover:text-[#0877a7] dark:group-hover:text-sky-400">${itemData.titulo}</span>
                            <button type="button" data-remove-fav="${itemData.id}" class="text-amber-500 hover:text-slate-400 transition p-1" title="Quitar de favoritos">★</button>
                        </a>`;
                    listElement.appendChild(li);
                }
            });
            listaFavoritosContainer.appendChild(listElement);
        }

        document.querySelectorAll('[data-fav-btn]').forEach(btn => {
            const cardId = btn.getAttribute('data-fav-btn');
            const isFav = favoritos.includes(cardId);
            btn.innerHTML = isFav ? '★' : '☆';
            btn.className = `text-base transition-colors ${isFav ? 'text-amber-500 hover:text-amber-600' : 'text-slate-400 hover:text-amber-500'}`;
        });
    };

    document.addEventListener('click', (e) => {
        const favBtn = e.target.closest('[data-fav-btn]');
        const removeBtn = e.target.closest('[data-remove-fav]');

        if (favBtn) {
            e.preventDefault();
            const id = favBtn.getAttribute('data-fav-btn');
            if (favoritos.includes(id)) {
                favoritos = favoritos.filter(f => f !== id);
            } else {
                favoritos.push(id);
            }
            localStorage.setItem('sunat-sol-favoritos', JSON.stringify(favoritos));
            renderFavoritos();
        } else if (removeBtn) {
            e.preventDefault();
            const id = removeBtn.getAttribute('data-remove-fav');
            favoritos = favoritos.filter(f => f !== id);
            localStorage.setItem('sunat-sol-favoritos', JSON.stringify(favoritos));
            renderFavoritos();
        }
    });

    renderFavoritos();

    // BUSCADOR PREDICTIVO A PARTIR DEL 3ER CARÁCTER
    if (inputBuscador && resultadosContainer) {
        inputBuscador.addEventListener('input', () => {
            const query = inputBuscador.value.trim().toLowerCase();

            // Desactivar si hay menos de 3 caracteres
            if (query.length < 3) {
                resultadosContainer.classList.add('hidden');
                resultadosContainer.innerHTML = '';
                return;
            }

            const coincidencias = tramitesSol.filter(t => 
                t.titulo.toLowerCase().includes(query) || 
                t.desc.toLowerCase().includes(query) ||
                t.tag.toLowerCase().includes(query)
            );

            resultadosContainer.innerHTML = '';

            if (coincidencias.length === 0) {
                resultadosContainer.innerHTML = `
                    <div class="p-3 text-xs text-slate-500 dark:text-slate-400 text-center">
                        No se encontraron trámites relacionados con "<strong>${inputBuscador.value}</strong>".
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
                            <p class="text-[11px] text-slate-500 dark:text-slate-400">
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

        document.addEventListener('click', (e) => {
            if (!inputBuscador.contains(e.target) && !resultadosContainer.contains(e.target)) {
                resultadosContainer.classList.add('hidden');
            }
        });
    }

    // Resaltado con <mark>
    function resaltarTexto(texto, busqueda) {
        const regex = new RegExp(`(${busqueda})`, 'gi');
        return texto.replace(regex, '<mark class="bg-amber-200 text-slate-900 dark:bg-amber-500/40 dark:text-white rounded-sm px-0.5">$1</mark>');
    }

    // Formulario de envío
    if (formBuscador) {
        formBuscador.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = inputBuscador.value.trim().toLowerCase();
            if (query.length < 3) return;

            const coincidencia = tramitesSol.find(t => 
                t.titulo.toLowerCase().includes(query)
            );

            if (coincidencia) {
                window.location.href = coincidencia.url;
            }
        });
    }
});