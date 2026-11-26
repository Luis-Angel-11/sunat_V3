import { jsPDF } from 'jspdf';

const checksDeuda = document.querySelectorAll('.deuda-check');
const selectCuotas = document.getElementById('select-cuotas');
const selectInicial = document.getElementById('porcentaje-inicial');

const deudaTotalEl = document.getElementById('frac-deuda-total');
const cuotaInicialEl = document.getElementById('frac-cuota-inicial');
const saldoEl = document.getElementById('frac-saldo');
const cuotaMensualEl = document.getElementById('frac-cuota-mensual');
const btnEnviar = document.getElementById('btn-enviar-fraccionamiento');

const modal = document.getElementById('modal-fraccionamiento');
const btnCerrar = document.getElementById('btn-cerrar-frac');
const btnPdf = document.getElementById('btn-pdf-frac');

let deudaTotal = 0;
let cuotaInicial = 0;
let saldoFraccionar = 0;
let cuotaMensual = 0;
let numCuotas = 6;

function calcularFraccionamiento() {
	deudaTotal = 0;
	checksDeuda.forEach((cb) => {
		if (cb.checked) {
			deudaTotal += parseFloat(cb.dataset.monto || '0');
		}
	});

	numCuotas = parseInt(selectCuotas?.value || '6', 10);
	const porcInicial = parseFloat(selectInicial?.value || '0.10');

	cuotaInicial = deudaTotal * porcInicial;
	saldoFraccionar = deudaTotal - cuotaInicial;

	// Cálculo referencial con tasa efectiva mensual de fraccionamiento (0.72%)
	const tasaMensual = 0.0072;
	if (saldoFraccionar > 0) {
		const factor = Math.pow(1 + tasaMensual, numCuotas);
		cuotaMensual = (saldoFraccionar * (tasaMensual * factor)) / (factor - 1);
	} else {
		cuotaMensual = 0;
	}

	if (deudaTotalEl) deudaTotalEl.textContent = `S/ ${deudaTotal.toFixed(2)}`;
	if (cuotaInicialEl) cuotaInicialEl.textContent = `S/ ${cuotaInicial.toFixed(2)}`;
	if (saldoEl) saldoEl.textContent = `S/ ${saldoFraccionar.toFixed(2)}`;
	if (cuotaMensualEl) cuotaMensualEl.textContent = `S/ ${cuotaMensual.toFixed(2)}`;
	if (btnEnviar) btnEnviar.disabled = deudaTotal === 0;
}

checksDeuda.forEach((cb) => cb.addEventListener('change', calcularFraccionamiento));
selectCuotas?.addEventListener('change', calcularFraccionamiento);
selectInicial?.addEventListener('change', calcularFraccionamiento);

btnEnviar?.addEventListener('click', () => {
	const numSolicitud = '687-' + Math.floor(1000000 + Math.random() * 9000000);
	const numEl = document.getElementById('frac-num-solicitud');
	const plazoEl = document.getElementById('frac-resumen-plazo');
	const cuotaEl = document.getElementById('frac-resumen-cuota');

	if (numEl) numEl.textContent = numSolicitud;
	if (plazoEl) plazoEl.textContent = `${numCuotas} cuotas mensuales`;
	if (cuotaEl) cuotaEl.textContent = `S/ ${cuotaMensual.toFixed(2)}`;

	modal?.classList.remove('hidden');
	modal?.classList.add('flex');
});

btnCerrar?.addEventListener('click', () => {
	modal?.classList.add('hidden');
	modal?.classList.remove('flex');
});

btnPdf?.addEventListener('click', () => {
	const doc = new jsPDF();
	const solicitud = document.getElementById('frac-num-solicitud')?.textContent || '';

	doc.setFontSize(14);
	doc.text('SUNAT - SOLICITUD DE FRACCIONAMIENTO (FORM. 687)', 15, 20);
	doc.setFontSize(10);
	doc.text(`N° de Solicitud: ${solicitud}`, 15, 34);
	doc.text('RUC: 10616288475 - CORDOVA RAMOS JAVIER', 15, 41);
	doc.text(`Deuda Acogida: S/ ${deudaTotal.toFixed(2)}`, 15, 50);
	doc.text(`Cuota de Acogimiento (Inicial): S/ ${cuotaInicial.toFixed(2)}`, 15, 57);
	doc.text(`Saldo Fraccionado: S/ ${saldoFraccionar.toFixed(2)}`, 15, 64);
	doc.text(`Plazo: ${numCuotas} cuotas mensuales`, 15, 71);
	doc.setFontSize(12);
	doc.text(`CUOTA MENSUAL ESTIMADA: S/ ${cuotaMensual.toFixed(2)}`, 15, 84);

	doc.save(`Constancia_Fraccionamiento_${solicitud}.pdf`);
});