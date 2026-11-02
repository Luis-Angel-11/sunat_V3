import { cargarLogo } from './constancia-pdf';

export interface DatosReciboPDF {
	numero: string;
	emisorNombre: string;
	emisorRuc: string;
	emisorDomicilio: string;
	clienteNombre: string;
	clienteDocumento: string;
	clienteDomicilio?: string;
	fecha: string;
	formaPago: string;
	descripcion: string;
	observacion?: string;
	inciso: string;
	gratuito: boolean;
	total: string;
	retencionTexto: string;
	retencion: string;
	neto: string;
	medioPago?: string;
	pendiente?: string;
	cuotas?: { numero: number; fecha: string; monto: string }[];
	paciente?: string;
}

type RGB = readonly [number, number, number];

export async function descargarReciboPDF(datos: DatosReciboPDF): Promise<void> {
	const [{ jsPDF }, logo] = await Promise.all([import('jspdf'), cargarLogo()]);
	const doc = new jsPDF({ unit: 'mm', format: 'a4' });
	const rojo: RGB = [174, 13, 65];
	const azul: RGB = [0, 86, 172];
	const gris: RGB = [100, 116, 139];
	const oscuro: RGB = [15, 23, 42];
	const borde: RGB = [226, 232, 240];
	const X = 18;
	const ANCHO = 174;
	const DER = X + ANCHO;

	// Encabezado
	if (logo) {
		doc.addImage(logo, 'PNG', X, 14, 48, 10.3);
	} else {
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(20);
		doc.setTextColor(...rojo);
		doc.text('SUNAT', X, 23);
	}

	doc.setDrawColor(...azul);
	doc.setLineWidth(0.6);
	doc.roundedRect(124, 12, 68, 26, 2, 2, 'S');
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(10.5);
	doc.setTextColor(...oscuro);
	doc.text(`RUC ${datos.emisorRuc}`, 158, 19, { align: 'center' });
	doc.setFontSize(8.5);
	doc.setTextColor(...azul);
	doc.text('RECIBO POR HONORARIOS', 158, 25, { align: 'center' });
	doc.text('ELECTRÓNICO', 158, 29.5, { align: 'center' });
	doc.setFontSize(10.5);
	doc.setTextColor(...oscuro);
	doc.text(`Nro. ${datos.numero}`, 158, 35, { align: 'center' });

	doc.setFont('helvetica', 'bold');
	doc.setFontSize(12);
	doc.setTextColor(...oscuro);
	doc.text(datos.emisorNombre.toUpperCase(), X, 32);
	doc.setFont('helvetica', 'normal');
	doc.setFontSize(8.5);
	doc.setTextColor(...gris);
	doc.text(doc.splitTextToSize(datos.emisorDomicilio, 100), X, 37);

	doc.setDrawColor(...rojo);
	doc.setLineWidth(0.8);
	doc.line(X, 45, DER, 45);

	// Datos
	let y = 54;
	const fila = (etiqueta: string, valor: string) => {
		doc.setFont('helvetica', 'normal');
		doc.setFontSize(9);
		doc.setTextColor(...gris);
		doc.text(etiqueta, X, y);
		doc.setFont('helvetica', 'bold');
		doc.setTextColor(...oscuro);
		const lineas = doc.splitTextToSize(valor || '—', 120);
		doc.text(lineas, X + 54, y);
		y += Math.max(1, lineas.length) * 4.6 + 2.4;
	};

	fila('Recibí de', datos.clienteNombre);
	fila('Identificado con', datos.clienteDocumento);
	if (datos.clienteDomicilio) fila('Domicilio del cliente', datos.clienteDomicilio);
	if (datos.paciente) fila('Paciente', datos.paciente);
	fila('Forma de pago', datos.formaPago);
	fila('Por concepto de', datos.descripcion);
	if (datos.observacion) fila('Observación', datos.observacion);
	fila('Tipo de renta', datos.inciso);
	if (datos.gratuito) fila('Servicio gratuito', 'Sí');
	fila('Fecha de emisión', datos.fecha);
	if (datos.medioPago) fila('Medio de pago', datos.medioPago);

	// Totales
	y += 3;
	doc.setFillColor(248, 250, 252);
	doc.setDrawColor(...borde);
	doc.setLineWidth(0.3);
	doc.roundedRect(104, y, 88, 30, 2, 2, 'FD');
	const total = (etiqueta: string, valor: string, yy: number, fuerte = false) => {
		doc.setFont('helvetica', fuerte ? 'bold' : 'normal');
		doc.setFontSize(fuerte ? 10.5 : 9.5);
		doc.setTextColor(...(fuerte ? oscuro : gris));
		doc.text(etiqueta, 108, yy);
		doc.setFont('helvetica', 'bold');
		doc.setTextColor(...oscuro);
		doc.text(valor, 188, yy, { align: 'right' });
	};
	total('Total por honorarios', datos.total, y + 8);
	total(datos.retencionTexto, datos.retencion, y + 15);
	doc.setDrawColor(...borde);
	doc.line(108, y + 19, 188, y + 19);
	total('Total neto recibido', datos.neto, y + 25.5, true);
	y += 38;

	// Crédito
	if (datos.cuotas && datos.cuotas.length) {
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(9);
		doc.setTextColor(...gris);
		doc.text('PAGO AL CRÉDITO', X, y);
		y += 5;
		doc.setFont('helvetica', 'normal');
		doc.setTextColor(...oscuro);
		doc.text(`Monto neto pendiente de pago: ${datos.pendiente ?? '—'}`, X, y);
		y += 6;
		doc.setFillColor(241, 245, 249);
		doc.rect(X, y - 4, ANCHO, 6.5, 'F');
		doc.setFont('helvetica', 'bold');
		doc.text('Cuota', X + 3, y);
		doc.text('Fecha de vencimiento', X + 40, y);
		doc.text('Monto', DER - 3, y, { align: 'right' });
		y += 7;
		doc.setFont('helvetica', 'normal');
		datos.cuotas.forEach((cuota) => {
			doc.text(String(cuota.numero), X + 3, y);
			doc.text(cuota.fecha, X + 40, y);
			doc.text(cuota.monto, DER - 3, y, { align: 'right' });
			y += 6;
		});
		y += 2;
	}

	// Aviso
	y = Math.max(y + 4, 200);
	doc.setFillColor(255, 251, 235);
	doc.setDrawColor(253, 230, 138);
	doc.roundedRect(X, y, ANCHO, 15, 2, 2, 'FD');
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(8.5);
	doc.setTextColor(146, 64, 14);
	doc.text('Demostración del prototipo', X + 4, y + 5.5);
	doc.setFont('helvetica', 'normal');
	doc.text('Este recibo no tiene validez legal. Los recibos reales se emiten en SUNAT Operaciones en Línea.', X + 4, y + 10.5);

	const generado = new Date().toLocaleString('es-PE', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
	doc.setFontSize(8);
	doc.setTextColor(...gris);
	doc.text(`Generado el ${generado}`, X, y + 22);

	doc.setDrawColor(...rojo);
	doc.setLineWidth(0.5);
	doc.line(X, 280, DER, 280);
	doc.setFontSize(7.5);
	doc.text('SUNAT · Operaciones en línea', X, 285);
	doc.text('Página 1 de 1', DER, 285, { align: 'right' });

	doc.save(`recibo-honorarios-${datos.numero.replace(/[^a-zA-Z0-9-]/g, '')}.pdf`);
}
