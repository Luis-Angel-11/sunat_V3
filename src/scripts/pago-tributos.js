import { jsPDF } from 'jspdf';

const checkboxes = document.querySelectorAll('.tributo-checkbox');
const selectAll = document.getElementById('select-all');
const countSelectedEl = document.getElementById('count-selected');
const totalAmountEl = document.getElementById('total-amount');
const btnPagar = document.getElementById('btn-pagar');
const radiosMetodo = document.querySelectorAll('input[name="metodo_pago"]');
const bancoSelector = document.getElementById('banco-selector');
const entidadBancaria = document.getElementById('entidad-bancaria');

const modal = document.getElementById('modal-constancia');
const btnCerrarModal = document.getElementById('btn-cerrar-modal');
const btnDescargarPdf = document.getElementById('btn-descargar-pdf');

let seleccionados = [];
let totalPagar = 0;

function actualizarResumen() {
	seleccionados = [];
	totalPagar = 0;

	checkboxes.forEach((cb) => {
		if (cb.checked) {
			const total = parseFloat(cb.dataset.total || '0');
			totalPagar += total;
			seleccionados.push({
				periodo: cb.dataset.periodo || '',
				codigo: cb.dataset.codigo || '',
				descripcion: cb.dataset.descripcion || '',
				total,
			});
		}
	});

	if (countSelectedEl) countSelectedEl.textContent = seleccionados.length.toString();
	if (totalAmountEl) totalAmountEl.textContent = `S/ ${totalPagar.toFixed(2)}`;
	if (btnPagar) btnPagar.disabled = seleccionados.length === 0;
}

checkboxes.forEach((cb) => cb.addEventListener('change', actualizarResumen));

if (selectAll) {
	selectAll.addEventListener('change', () => {
		checkboxes.forEach((cb) => (cb.checked = selectAll.checked));
		actualizarResumen();
	});
}

radiosMetodo.forEach((radio) => {
	radio.addEventListener('change', () => {
		if (bancoSelector) {
			bancoSelector.style.display = radio.value === 'Cargo en Cuenta Bancaria' ? 'block' : 'none';
		}
	});
});

if (btnPagar) {
	btnPagar.addEventListener('click', () => {
		const radioActivo = document.querySelector('input[name="metodo_pago"]:checked');
		const metodoSeleccionado = radioActivo ? radioActivo.value : '';
		const detalleMedio =
			metodoSeleccionado === 'Cargo en Cuenta Bancaria' && entidadBancaria
				? `${metodoSeleccionado} (${entidadBancaria.value})`
				: metodoSeleccionado;

		const ordenGenerada = Math.floor(100000000 + Math.random() * 900000000).toString();
		const ordenEl = document.getElementById('constancia-orden');
		const medioEl = document.getElementById('constancia-medio');
		const totalModalEl = document.getElementById('constancia-total');
		const listaEl = document.getElementById('constancia-lista');

		if (ordenEl) ordenEl.textContent = ordenGenerada;
		if (medioEl) medioEl.textContent = detalleMedio;
		if (totalModalEl) totalModalEl.textContent = `S/ ${totalPagar.toFixed(2)}`;

		if (listaEl) {
			listaEl.innerHTML = seleccionados
				.map((s) => `<li>• [${s.periodo}] ${s.codigo} - ${s.descripcion}: <strong>S/ ${s.total.toFixed(2)}</strong></li>`)
				.join('');
		}

		if (modal) {
			modal.classList.remove('hidden');
			modal.classList.add('flex');
		}
	});
}

if (btnCerrarModal) {
	btnCerrarModal.addEventListener('click', () => {
		if (modal) {
			modal.classList.add('hidden');
			modal.classList.remove('flex');
		}
	});
}

if (btnDescargarPdf) {
	btnDescargarPdf.addEventListener('click', () => {
		const doc = new jsPDF();
		const orden = document.getElementById('constancia-orden')?.textContent || '';
		const medio = document.getElementById('constancia-medio')?.textContent || '';

		doc.setFontSize(14);
		doc.text('SUNAT - CONSTANCIA DE PAGO (FORMULARIO VIRTUAL 1662)', 15, 20);
		doc.setFontSize(10);
		doc.text(`N° de Orden: ${orden}`, 15, 32);
		doc.text('RUC: 10616288475 - CORDOVA RAMOS JAVIER', 15, 39);
		doc.text(`Fecha de Operacion: ${new Date().toLocaleString('es-PE')}`, 15, 46);
		doc.text(`Medio de Pago: ${medio}`, 15, 53);
		doc.text('Detalle de Tributos Pagados:', 15, 65);

		let y = 73;
		seleccionados.forEach((s) => {
			doc.text(`- Periodo ${s.periodo} | Cod. ${s.codigo} (${s.descripcion}): S/ ${s.total.toFixed(2)}`, 18, y);
			y += 7;
		});

		doc.setFontSize(12);
		doc.text(`TOTAL PAGADO: S/ ${totalPagar.toFixed(2)}`, 15, y + 8);
		doc.save(`Constancia_Pago_SUNAT_${orden}.pdf`);
	});
}