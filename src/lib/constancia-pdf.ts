export interface DatosConstancia {
	tipo: string;
	numero: string;
	ruc: string;
	documento: string;
	fecha: string;
	importe: string;
}

export function cargarLogo(): Promise<string | null> {
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => {
			try {
				const canvas = document.createElement('canvas');
				const proporcion = img.naturalWidth / img.naturalHeight || 149 / 32;
				canvas.width = 596;
				canvas.height = Math.round(canvas.width / proporcion);
				const contexto = canvas.getContext('2d');
				if (!contexto) return resolve(null);
				contexto.fillStyle = '#ffffff';
				contexto.fillRect(0, 0, canvas.width, canvas.height);
				contexto.drawImage(img, 0, 0, canvas.width, canvas.height);
				resolve(canvas.toDataURL('image/png'));
			} catch {
				resolve(null);
			}
		};
		img.onerror = () => resolve(null);
		img.src = '/img/sunat-logo.svg';
	});
}

export async function crearConstanciaPDF(datos: DatosConstancia) {
	const [{ jsPDF }, logo] = await Promise.all([import('jspdf'), cargarLogo()]);
	const doc = new jsPDF({ unit: 'mm', format: 'a4' });
	const rojo = [174, 13, 65] as const;
	const verde = [5, 122, 85] as const;
	const gris = [100, 116, 139] as const;
	const oscuro = [15, 23, 42] as const;

	if (logo) {
		doc.addImage(logo, 'PNG', 18, 14, 48, 10.3);
	} else {
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(20);
		doc.setTextColor(...rojo);
		doc.text('SUNAT', 18, 23);
	}

	doc.setFont('helvetica', 'normal');
	doc.setFontSize(8);
	doc.setTextColor(...gris);
	doc.text('OPERACIONES EN LÍNEA', 192, 18, { align: 'right' });
	doc.text('Constancia de consulta', 192, 22.5, { align: 'right' });

	doc.setDrawColor(...rojo);
	doc.setLineWidth(0.8);
	doc.line(18, 31, 192, 31);

	doc.setFont('helvetica', 'bold');
	doc.setFontSize(16);
	doc.setTextColor(...oscuro);
	doc.text('Consultar la validez de un comprobante de pago', 18, 42);

	doc.setFont('helvetica', 'normal');
	doc.setFontSize(9.5);
	doc.setTextColor(...gris);
	doc.text('Resultado de la consulta realizada en el servicio en línea de SUNAT', 18, 48);

	doc.setFillColor(236, 253, 245);
	doc.setDrawColor(167, 243, 208);
	doc.setLineWidth(0.3);
	doc.roundedRect(18, 55, 174, 22, 2, 2, 'FD');

	doc.setFillColor(...verde);
	doc.circle(26, 66, 5, 'F');
	doc.setDrawColor(255, 255, 255);
	doc.setLineWidth(0.7);
	doc.lines(
		[
			[1.2, 1.4],
			[2.6, -3.2],
		],
		24.6,
		66.2,
	);

	doc.setFont('helvetica', 'bold');
	doc.setFontSize(13);
	doc.setTextColor(6, 78, 59);
	doc.text('Comprobante válido', 34, 64);

	doc.setFont('helvetica', 'normal');
	doc.setFontSize(9);
	doc.setTextColor(4, 120, 87);
	doc.text('El comprobante está registrado e informado a SUNAT.', 34, 70);

	doc.setFillColor(248, 250, 252);
	doc.setDrawColor(226, 232, 240);
	doc.setLineWidth(0.2);
	doc.roundedRect(18, 84, 174, 87, 2, 2, 'S');
	doc.roundedRect(18, 84, 174, 12, 2, 2, 'F');

	doc.setFont('helvetica', 'bold');
	doc.setFontSize(8.5);
	doc.setTextColor(...gris);
	doc.text('DATOS DEL COMPROBANTE', 22, 91.2);

	const filas: [string, string][] = [
		['Tipo de comprobante', datos.tipo],
		['Serie y número', datos.numero],
		['RUC del emisor', datos.ruc],
		['Documento del cliente', datos.documento],
		['Fecha de emisión', datos.fecha],
		['Importe total', datos.importe],
	];

	let y = 104;
	filas.forEach(([etiqueta, valor], indice) => {
		doc.setFont('helvetica', 'normal');
		doc.setFontSize(9.5);
		doc.setTextColor(...gris);
		doc.text(etiqueta, 22, y);

		doc.setFont('helvetica', 'bold');
		doc.setFontSize(10);
		doc.setTextColor(...oscuro);
		doc.text(valor, 188, y, { align: 'right' });

		if (indice < filas.length - 1) {
			doc.setDrawColor(226, 232, 240);
			doc.setLineWidth(0.2);
			doc.setLineDashPattern([0.8, 0.9], 0);
			doc.line(22, y + 4, 188, y + 4);
			doc.setLineDashPattern([], 0);
		}
		y += 12.5;
	});

	doc.setFillColor(255, 251, 235);
	doc.setDrawColor(253, 230, 138);
	doc.roundedRect(18, 180, 174, 15, 2, 2, 'FD');
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(8.5);
	doc.setTextColor(146, 64, 14);
	doc.text('Demostración del prototipo', 22, 185.5);
	doc.setFont('helvetica', 'normal');
	doc.text('La consulta real se hace en el servicio de SUNAT.', 22, 190.5);

	const fechaGeneracion = new Date().toLocaleString('es-PE', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
	doc.setFont('helvetica', 'normal');
	doc.setFontSize(8);
	doc.setTextColor(...gris);
	doc.text(`Generado el ${fechaGeneracion}`, 18, 203);

	doc.setDrawColor(...rojo);
	doc.setLineWidth(0.5);
	doc.line(18, 280, 192, 280);
	doc.setFontSize(7.5);
	doc.text('SUNAT · Operaciones en línea', 18, 285);
	doc.text('Página 1 de 1', 192, 285, { align: 'right' });

	return doc;
}

export async function descargarConstanciaPDF(datos: DatosConstancia): Promise<void> {
	const doc = await crearConstanciaPDF(datos);
	const numero = datos.numero.replace(/[^a-zA-Z0-9-]/g, '') || 'sunat';
	doc.save(`constancia-validez-${numero}.pdf`);
}
