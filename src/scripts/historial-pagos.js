import { jsPDF } from 'jspdf';

const inputOrden = document.getElementById('filtro-orden');
const selectPeriodo = document.getElementById('filtro-periodo');
const selectMedio = document.getElementById('filtro-medio');
const btnLimpiar = document.getElementById('btn-limpiar-filtros');
const filas = document.querySelectorAll('.fila-pago');
const contadorEl = document.getElementById('contador-registros');
const botonesPdf = document.querySelectorAll('.btn-descargar-constancia');

function filtrarTabla() {
	const texto = (inputOrden?.value || '').toLowerCase().trim();
	const periodo = selectPeriodo?.value || '';
	const medio = selectMedio?.value || '';
	let visibles = 0;

	filas.forEach((fila) => {
		const ordenFila = (fila.dataset.orden || '').toLowerCase();
		const tributoFila = (fila.dataset.tributo || '').toLowerCase();
		const periodoFila = fila.dataset.periodo || '';
		const medioFila = fila.dataset.medio || '';

		const coincideTexto = !texto || ordenFila.includes(texto) || tributoFila.includes(texto);
		const coincidePeriodo = !periodo || periodoFila === periodo;
		const coincideMedio = !medio || medioFila.includes(medio);

		if (coincideTexto && coincidePeriodo && coincideMedio) {
			fila.style.display = '';
			visibles++;
		} else {
			fila.style.display = 'none';
		}
	});

	if (contadorEl) {
		contadorEl.textContent = `Mostrando ${visibles} registro${visibles === 1 ? '' : 's'}`;
	}
}

inputOrden?.addEventListener('input', filtrarTabla);
selectPeriodo?.addEventListener('change', filtrarTabla);
selectMedio?.addEventListener('change', filtrarTabla);

btnLimpiar?.addEventListener('click', () => {
	if (inputOrden) inputOrden.value = '';
	if (selectPeriodo) selectPeriodo.value = '';
	if (selectMedio) selectMedio.value = '';
	filtrarTabla();
});

botonesPdf.forEach((btn) => {
	btn.addEventListener('click', () => {
		const orden = btn.dataset.orden || '';
		const fecha = btn.dataset.fecha || '';
		const periodo = btn.dataset.periodo || '';
		const tributo = btn.dataset.tributo || '';
		const medio = btn.dataset.medio || '';
		const monto = btn.dataset.monto || '0.00';

		const doc = new jsPDF();
		doc.setFontSize(14);
		doc.text('SUNAT - BOLETA DE PAGO VIRTUAL (FORM. 1662)', 15, 20);
		doc.setFontSize(10);
		doc.text(`N° de Orden: ${orden}`, 15, 34);
		doc.text('RUC: 10616288475 - CORDOVA RAMOS JAVIER', 15, 41);
		doc.text(`Fecha y Hora de Pago: ${fecha}`, 15, 48);
		doc.text(`Periodo Tributario: ${periodo}`, 15, 55);
		doc.text(`Tributo Cancelado: ${tributo}`, 15, 62);
		doc.text(`Medio de Pago: ${medio}`, 15, 69);
		doc.setFontSize(12);
		doc.text(`IMPORTE TOTAL PAGADO: S/ ${monto}`, 15, 82);

		doc.save(`Boleta_Pago_SUNAT_${orden}.pdf`);
	});
});