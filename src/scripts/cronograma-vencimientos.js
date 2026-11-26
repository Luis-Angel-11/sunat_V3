import { jsPDF } from 'jspdf';

const selectDigito = document.getElementById('select-digito-ruc');
const proximoTextoEl = document.getElementById('proximo-vencimiento-texto');
const btnDescargar = document.getElementById('btn-descargar-cronograma');

const proximosNov2026 = {
	all: 'Del 15 al 23 de Diciembre 2026',
	d0: '15 de Diciembre 2026',
	d1: '16 de Diciembre 2026',
	d23: '17 de Diciembre 2026',
	d45: '18 de Diciembre 2026',
	d67: '21 de Diciembre 2026',
	d89: '22 de Diciembre 2026',
	buenos: '23 de Diciembre 2026',
};

function resaltarColumna(colSeleccionada) {
	const encabezados = document.querySelectorAll('#tabla-cronograma thead th[data-col]');
	const celdas = document.querySelectorAll('#tabla-cronograma tbody td[data-col]');

	encabezados.forEach((th) => {
		if (th.dataset.col === colSeleccionada) {
			th.classList.add('bg-[#0877a7]');
		} else {
			th.classList.remove('bg-[#0877a7]');
		}
	});

	celdas.forEach((td) => {
		if (td.dataset.col === colSeleccionada) {
			td.classList.add('font-extrabold', 'text-[#003366]', 'bg-sky-50/80', 'dark:bg-sky-950/40', 'dark:text-sky-300');
		} else {
			td.classList.remove('font-extrabold', 'text-[#003366]', 'bg-sky-50/80', 'dark:bg-sky-950/40', 'dark:text-sky-300');
		}
	});

	if (proximoTextoEl && proximosNov2026[colSeleccionada]) {
		proximoTextoEl.textContent = proximosNov2026[colSeleccionada];
	}
}

selectDigito?.addEventListener('change', (e) => {
	resaltarColumna(e.target.value);
});

btnDescargar?.addEventListener('click', () => {
	const doc = new jsPDF({ orientation: 'landscape' });
	doc.setFontSize(14);
	doc.text('SUNAT - CRONOGRAMA DE OBLIGACIONES MENSUALES 2026', 15, 18);
	doc.setFontSize(10);
	doc.text('RUC Contribuyente: 10616288475 (Ultimo digito: 5)', 15, 26);

	const filas = document.querySelectorAll('#tabla-cronograma tbody tr');
	let y = 38;

	doc.setFontSize(9);
	doc.text('Periodo       | Dig. 0  | Dig. 1  | Dig. 2-3 | Dig. 4-5 | Dig. 6-7 | Dig. 8-9 | Buenos Contrib.', 15, y);
	y += 7;

	filas.forEach((tr) => {
		const cols = Array.from(tr.querySelectorAll('td')).map((td) => td.textContent?.trim().padEnd(8, ' '));
		doc.text(cols.join(' | '), 15, y);
		y += 7;
	});

	doc.save('Cronograma_Vencimientos_SUNAT_2026.pdf');
});