import { Html5Qrcode } from 'html5-qrcode';
import QRCode from 'qrcode';

document.addEventListener('DOMContentLoaded', () => {
	// -------------------------------------------------------------------------
	// BASE DE DATOS DE PRUEBA (CASOS REGISTRADOS EN SUNAT)
	// -------------------------------------------------------------------------
	const BASE_DATOS_SUNAT = [
		{
			tipo: 'FACTURA',
			codigoSunat: '01',
			etiqueta: 'Factura Electrónica',
			rucEmisor: '20517352059',
			tipoDocRec: '6',
			numDocRec: '20615611809',
			serie: 'F001',
			numero: '00000042',
			fecha: '2026-10-31',
			igv: '22.88',
			monto: '150.00',
			estado: 'ACEPTADO',
			mensaje: 'El comprobante Factura Electrónica F001-00000042 ha sido emitido válidamente y se encuentra ACEPTADO por la SUNAT.',
		},
		{
			tipo: 'BOLETA',
			codigoSunat: '03',
			etiqueta: 'Boleta de Venta (con DNI)',
			rucEmisor: '20517352059',
			tipoDocRec: '1',
			numDocRec: '74859612',
			serie: 'B001',
			numero: '00000128',
			fecha: '2026-10-30',
			igv: '13.04',
			monto: '85.50',
			estado: 'ACEPTADO',
			mensaje: 'La Boleta de Venta Electrónica B001-00000128 figura informada y ACEPTADA en los sistemas de SUNAT.',
		},
		{
			tipo: 'BOLETA',
			codigoSunat: '03',
			etiqueta: 'Boleta Público General',
			rucEmisor: '20517352059',
			tipoDocRec: '0',
			numDocRec: '',
			serie: 'B001',
			numero: '00000129',
			fecha: '2026-10-30',
			igv: '6.86',
			monto: '45.00',
			estado: 'ACEPTADO',
			mensaje: 'La Boleta de Venta Electrónica a Público General B001-00000129 es VÁLIDA y ACEPTADA.',
		},
		{
			tipo: 'RHE',
			codigoSunat: 'RHE',
			etiqueta: 'Recibo por Honorarios',
			rucEmisor: '10457896321',
			tipoDocRec: '6',
			numDocRec: '20517352059',
			serie: 'E001',
			numero: '00000045',
			fecha: '2026-11-01',
			igv: '0.00',
			monto: '1200.00',
			estado: 'ACEPTADO',
			mensaje: 'El Recibo por Honorarios Electrónico E001-00000045 fue emitido conforme a ley y se encuentra VÁLIDO en SUNAT.',
		},
		{
			tipo: 'GRE',
			codigoSunat: '09',
			etiqueta: 'Guía de Remisión (GRE)',
			rucEmisor: '20517352059',
			tipoDocRec: '6',
			numDocRec: '20615611809',
			serie: 'T001',
			numero: '00000012',
			fecha: '2026-10-31',
			igv: '0.00',
			monto: '0.00',
			estado: 'ACEPTADO',
			mensaje: 'La Guía de Remisión Electrónica T001-00000012 cuenta con Código QR emitido y está ACEPTADA por SUNAT.',
		},
		{
			tipo: 'NC',
			codigoSunat: '07',
			etiqueta: 'Nota de Crédito',
			rucEmisor: '20517352059',
			tipoDocRec: '6',
			numDocRec: '20615611809',
			serie: 'FC01',
			numero: '00000005',
			fecha: '2026-10-28',
			igv: '7.63',
			monto: '50.00',
			estado: 'ACEPTADO',
			mensaje: 'La Nota de Crédito FC01-00000005 relacionada a la Factura F001-00000042 es VÁLIDA.',
		},
	];

	// Referencias DOM Formulario Principal
	const rucEmisorInput = document.querySelector('#val-ruc-emisor');
	const cntRucEmisor = document.querySelector('#cnt-ruc-emisor');
	const selectTipoCpe = document.querySelector('#val-tipo-cpe');
	const selectTipoDocRec = document.querySelector('#val-tipo-doc-rec');
	const numDocRecInput = document.querySelector('#val-num-doc-rec');
	const cntDocReceptor = document.querySelector('#cnt-doc-receptor');
	const serieInput = document.querySelector('#val-serie');
	const numeroInput = document.querySelector('#val-numero');
	const fechaInput = document.querySelector('#val-fec-emision');
	const montoInput = document.querySelector('#val-monto-total');
	const form = document.querySelector('#form-validez-cpe');
	const btnLimpiar = document.querySelector('#btn-limpiar-validez');

	// Elementos del Modal Resultado
	const modal = document.querySelector('#modal-resultado-validez');
	const btnCerrarX = document.querySelector('#btn-cerrar-modal-x');
	const btnOtraConsulta = document.querySelector('#btn-otra-consulta');
	const modalAlertaBox = document.querySelector('#modal-alerta-box');
	const modalBadgeIcon = document.querySelector('#modal-badge-icon');
	const modalEstadoTitulo = document.querySelector('#modal-estado-titulo');
	const modalEstadoMensaje = document.querySelector('#modal-estado-mensaje');
	const resModalCpe = document.querySelector('#res-modal-cpe');
	const resModalEmisor = document.querySelector('#res-modal-emisor');
	const resModalFecha = document.querySelector('#res-modal-fecha');
	const resModalMonto = document.querySelector('#res-modal-monto');

	// Sonido de confirmación
	const playSuccessSound = () => {
		try {
			const ctx = new (window.AudioContext || window.webkitAudioContext)();
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.connect(gain);
			gain.connect(ctx.destination);
			osc.type = 'sine';
			osc.frequency.setValueAtTime(587.33, ctx.currentTime);
			osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
			gain.gain.setValueAtTime(0.2, ctx.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
			osc.start();
			osc.stop(ctx.currentTime + 0.35);
		} catch (e) {
			console.warn('AudioContext no disponible:', e);
		}
	};

	const showError = (inputId, errId, message) => {
		const inputEl = document.getElementById(inputId);
		const errEl = document.getElementById(errId);
		if (errEl) {
			errEl.textContent = message;
			errEl.classList.remove('hidden');
		}
		if (inputEl) {
			inputEl.classList.add('border-rose-500', 'focus:ring-rose-500');
			inputEl.classList.remove('border-slate-300', 'dark:border-slate-700');
		}
	};

	const clearError = (inputId, errId) => {
		const inputEl = document.getElementById(inputId);
		const errEl = document.getElementById(errId);
		if (errEl) errEl.classList.add('hidden');
		if (inputEl) {
			inputEl.classList.remove('border-rose-500', 'focus:ring-rose-500');
			inputEl.classList.add('border-slate-300', 'dark:border-slate-700');
		}
	};

	const validateRucEmisor = () => {
		const val = rucEmisorInput?.value.trim() || '';
		if (!val) {
			showError('val-ruc-emisor', 'err-val-ruc-emisor', 'El número de RUC es obligatorio');
			return false;
		}
		if (val.length !== 11 || (!val.startsWith('10') && !val.startsWith('20'))) {
			showError('val-ruc-emisor', 'err-val-ruc-emisor', 'Ingrese un RUC válido de 11 dígitos que inicie con 10 o 20');
			return false;
		}
		clearError('val-ruc-emisor', 'err-val-ruc-emisor');
		return true;
	};

	const validateDocReceptor = () => {
		const tipo = selectTipoDocRec?.value || '0';
		const val = numDocRecInput?.value.trim() || '';
		if (tipo === '0') {
			clearError('val-num-doc-rec', 'err-val-num-doc-rec');
			return true;
		}
		if (!val) {
			showError('val-num-doc-rec', 'err-val-num-doc-rec', 'Ingrese el número de documento');
			return false;
		}
		if (tipo === '6' && val.length !== 11) {
			showError('val-num-doc-rec', 'err-val-num-doc-rec', 'El RUC del receptor debe tener 11 dígitos');
			return false;
		}
		if (tipo === '1' && val.length !== 8) {
			showError('val-num-doc-rec', 'err-val-num-doc-rec', 'El DNI del receptor debe tener 8 dígitos');
			return false;
		}
		clearError('val-num-doc-rec', 'err-val-num-doc-rec');
		return true;
	};

	const validateCorrelativo = () => {
		const serie = serieInput?.value.trim() || '';
		const numero = numeroInput?.value.trim() || '';
		if (!serie || serie.length < 4 || !numero) {
			showError('val-serie', 'err-val-correlativo', 'Ingrese una serie de 4 caracteres y el número correlativo');
			if (numeroInput) numeroInput.classList.add('border-rose-500');
			return false;
		}
		clearError('val-serie', 'err-val-correlativo');
		if (numeroInput) numeroInput.classList.remove('border-rose-500');
		return true;
	};

	const validateFecha = () => {
		const val = fechaInput?.value.trim() || '';
		if (!val) {
			showError('val-fec-emision', 'err-val-fec-emision', 'Seleccione la fecha de emisión');
			return false;
		}
		clearError('val-fec-emision', 'err-val-fec-emision');
		return true;
	};

	const validateMonto = () => {
		const tipo = selectTipoCpe?.value;
		const val = montoInput?.value.trim() || '';
		if (tipo !== 'GRE' && (!val || parseFloat(val) <= 0)) {
			showError('val-monto-total', 'err-val-monto-total', 'Ingrese un importe total mayor a 0.00');
			return false;
		}
		clearError('val-monto-total', 'err-val-monto-total');
		return true;
	};

	function actualizarEstadoInputReceptor() {
		if (!selectTipoDocRec || !numDocRecInput || !cntDocReceptor) return;
		const tipo = selectTipoDocRec.value;
		clearError('val-num-doc-rec', 'err-val-num-doc-rec');

		if (tipo === '0') {
			numDocRecInput.value = '';
			numDocRecInput.disabled = true;
			numDocRecInput.placeholder = 'Sin documento requerido';
			numDocRecInput.classList.add('bg-slate-100', 'dark:bg-slate-950');
			cntDocReceptor.classList.add('hidden');
		} else {
			numDocRecInput.disabled = false;
			numDocRecInput.classList.remove('bg-slate-100', 'dark:bg-slate-950');
			cntDocReceptor.classList.remove('hidden');
			if (tipo === '6') numDocRecInput.maxLength = 11;
			else if (tipo === '1') numDocRecInput.maxLength = 8;
			else numDocRecInput.maxLength = 12;
			cntDocReceptor.textContent = `${numDocRecInput.value.length}/${numDocRecInput.maxLength}`;
		}
	}

	if (rucEmisorInput && cntRucEmisor) {
		rucEmisorInput.addEventListener('input', () => {
			rucEmisorInput.value = rucEmisorInput.value.replace(/\D/g, '');
			cntRucEmisor.textContent = `${rucEmisorInput.value.length}/11`;
			if (!document.getElementById('err-val-ruc-emisor')?.classList.contains('hidden')) validateRucEmisor();
		});
		rucEmisorInput.addEventListener('blur', validateRucEmisor);
	}

	if (selectTipoDocRec && numDocRecInput && cntDocReceptor) {
		selectTipoDocRec.addEventListener('change', () => {
			numDocRecInput.value = '';
			actualizarEstadoInputReceptor();
		});
		numDocRecInput.addEventListener('input', () => {
			const tipo = selectTipoDocRec.value;
			if (tipo === '6' || tipo === '1') numDocRecInput.value = numDocRecInput.value.replace(/\D/g, '');
			cntDocReceptor.textContent = `${numDocRecInput.value.length}/${numDocRecInput.maxLength}`;
			if (!document.getElementById('err-val-num-doc-rec')?.classList.contains('hidden')) validateDocReceptor();
		});
		numDocRecInput.addEventListener('blur', validateDocReceptor);
	}

	serieInput?.addEventListener('input', () => {
		if (!document.getElementById('err-val-correlativo')?.classList.contains('hidden')) validateCorrelativo();
	});
	serieInput?.addEventListener('blur', validateCorrelativo);

	numeroInput?.addEventListener('input', () => {
		numeroInput.value = numeroInput.value.replace(/\D/g, '');
		if (!document.getElementById('err-val-correlativo')?.classList.contains('hidden')) validateCorrelativo();
	});
	numeroInput?.addEventListener('blur', validateCorrelativo);
	fechaInput?.addEventListener('change', validateFecha);
	montoInput?.addEventListener('blur', validateMonto);

	selectTipoCpe?.addEventListener('change', () => {
		const val = selectTipoCpe.value;
		if (val === 'FACTURA') serieInput.placeholder = 'F001';
		else if (val === 'BOLETA') serieInput.placeholder = 'B001';
		else if (val === 'RHE') serieInput.placeholder = 'E001';
		else if (val === 'GRE') serieInput.placeholder = 'T001';
		else if (val === 'NC') serieInput.placeholder = 'FC01';
		else if (val === 'ND') serieInput.placeholder = 'FD01';
	});

	function ejecutarValidacion() {
		const isRucValid = validateRucEmisor();
		const isRecValid = validateDocReceptor();
		const isCorrValid = validateCorrelativo();
		const isFecValid = validateFecha();
		const isMonValid = validateMonto();

		if (!isRucValid || !isRecValid || !isCorrValid || !isFecValid || !isMonValid) return;

		const ruc = rucEmisorInput.value.trim();
		const tipoCpe = selectTipoCpe.value;
		const tipoCpeText = selectTipoCpe.options[selectTipoCpe.selectedIndex].text;
		const tipoDocRec = selectTipoDocRec.value;
		const numDocRec = numDocRecInput.value.trim();
		const serie = serieInput.value.trim().toUpperCase();
		const numero = numeroInput.value.trim().padStart(8, '0');
		const fecha = fechaInput.value.trim();
		const monto = parseFloat(montoInput.value.trim() || '0').toFixed(2);

		const encontrado = BASE_DATOS_SUNAT.find(
			(item) =>
				item.tipo === tipoCpe &&
				item.rucEmisor === ruc &&
				item.tipoDocRec === tipoDocRec &&
				item.numDocRec === numDocRec &&
				item.serie === serie &&
				item.numero === numero &&
				item.fecha === fecha &&
				parseFloat(item.monto).toFixed(2) === monto
		);

		const correlativoCompleto = `${serie}-${numero}`;

		if (resModalCpe) resModalCpe.textContent = `${tipoCpeText} (${correlativoCompleto})`;
		if (resModalEmisor) resModalEmisor.textContent = ruc;
		if (resModalFecha) resModalFecha.textContent = fecha;
		if (resModalMonto) resModalMonto.textContent = `S/ ${monto}`;

		if (encontrado) {
			modalAlertaBox.className = 'flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200';
			modalBadgeIcon.className = 'grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-500 text-white font-black text-xs';
			modalBadgeIcon.textContent = '✓';
			modalEstadoTitulo.textContent = 'ES UN COMPROBANTE DE PAGO VÁLIDO';
			modalEstadoMensaje.textContent = encontrado.mensaje;
			playSuccessSound();
		} else {
			modalAlertaBox.className = 'flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-800 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-200';
			modalBadgeIcon.className = 'grid h-7 w-7 shrink-0 place-items-center rounded-full bg-rose-500 text-white font-black text-xs';
			modalBadgeIcon.textContent = '✕';
			modalEstadoTitulo.textContent = 'COMPROBANTE NO REGISTRADO O ANULADO';
			modalEstadoMensaje.textContent = `El documento ${tipoCpeText} ${correlativoCompleto} NO figura en los registros oficiales de SUNAT con los datos ingresados.`;
		}

		modal?.classList.remove('hidden');
	}

	form?.addEventListener('submit', (e) => {
		e.preventDefault();
		ejecutarValidacion();
	});

	const resetForm = () => {
		form?.reset();
		if (cntRucEmisor) cntRucEmisor.textContent = '0/11';
		if (numDocRecInput) numDocRecInput.disabled = true;
		if (cntDocReceptor) cntDocReceptor.classList.add('hidden');
		['val-ruc-emisor', 'val-num-doc-rec', 'val-serie', 'val-numero', 'val-fec-emision', 'val-monto-total'].forEach((id) => {
			document.getElementById(id)?.classList.remove('border-rose-500', 'focus:ring-rose-500');
		});
		document.querySelectorAll('[id^="err-val-"]').forEach((el) => el.classList.add('hidden'));
	};

	btnCerrarX?.addEventListener('click', () => modal?.classList.add('hidden'));
	btnOtraConsulta?.addEventListener('click', () => {
		modal?.classList.add('hidden');
		resetForm();
	});
	btnLimpiar?.addEventListener('click', resetForm);

	// =========================================================================
	// MÓDULO QR: ESCANEO POR CÁMARA, SUBIDA DE IMAGEN Y GALERÍA DE PRUEBA
	// =========================================================================
	const modalEscaner = document.getElementById('modal-escaner-qr');
	const btnAbrirEscaner = document.getElementById('btn-abrir-escaner-qr');
	const btnCerrarEscanerX = document.getElementById('btn-cerrar-escaner-x');
	const tabCamara = document.getElementById('tab-qr-camara');
	const tabImagen = document.getElementById('tab-qr-imagen');
	const panelCamara = document.getElementById('panel-qr-camara');
	const panelImagen = document.getElementById('panel-qr-imagen');
	const inputArchivoQr = document.getElementById('input-archivo-qr');

	const qrAlertaError = document.getElementById('qr-alerta-error');
	const qrErrorTitulo = document.getElementById('qr-error-titulo');
	const qrErrorDetalle = document.getElementById('qr-error-detalle');
	const btnQrReintentar = document.getElementById('btn-qr-reintentar');

	const tarjetaDetectados = document.getElementById('tarjeta-datos-detectados');
	const detRucEmisor = document.getElementById('det-ruc-emisor');
	const detTipoCpe = document.getElementById('det-tipo-cpe');
	const detSerie = document.getElementById('det-serie');
	const detNumero = document.getElementById('det-numero');
	const detFecha = document.getElementById('det-fecha');
	const detMonto = document.getElementById('det-monto');
	const detTipoDocRec = document.getElementById('det-tipo-doc-rec');
	const detNumDocRec = document.getElementById('det-num-doc-rec');
	const avisoFaltanteQr = document.getElementById('aviso-faltante-qr');

	const btnUsarDatos = document.getElementById('btn-qr-usar-datos');
	const btnCorregir = document.getElementById('btn-qr-corregir');
	const botonesManual = document.querySelectorAll('.btn-qr-manual');

	let html5QrScanner = null;
	let camaraActiva = false;

	const MAPA_TIPO_SUNAT = {
		'01': 'FACTURA',
		FACTURA: 'FACTURA',
		'03': 'BOLETA',
		BOLETA: 'BOLETA',
		RHE: 'RHE',
		'02': 'RHE',
		'07': 'NC',
		NC: 'NC',
		'08': 'ND',
		ND: 'ND',
		'09': 'GRE',
		GRE: 'GRE',
	};

	async function detenerCamara() {
		if (html5QrScanner && camaraActiva) {
			try {
				await html5QrScanner.stop();
				html5QrScanner.clear();
			} catch (err) {
				console.warn('Deteniendo cámara:', err);
			}
			camaraActiva = false;
		}
	}

	function mostrarErrorQr(titulo, detalle) {
		tarjetaDetectados?.classList.add('hidden');
		if (qrErrorTitulo) qrErrorTitulo.textContent = titulo;
		if (qrErrorDetalle) qrErrorDetalle.textContent = detalle;
		qrAlertaError?.classList.remove('hidden');
	}

	async function iniciarCamara() {
		qrAlertaError?.classList.add('hidden');
		tarjetaDetectados?.classList.add('hidden');

		await detenerCamara();
		html5QrScanner = new Html5Qrcode('qr-reader');

		try {
			await html5QrScanner.start(
				{ facingMode: 'environment' },
				{ fps: 10, qrbox: { width: 220, height: 220 } },
				(textoDecodificado) => {
					detenerCamara();
					procesarContenidoQr(textoDecodificado);
				},
				() => {}
			);
			camaraActiva = true;
		} catch (err) {
			mostrarErrorQr(
				'No se pudo acceder a la cámara',
				'Verifica que hayas otorgado permisos de cámara al navegador o utiliza la pestaña "Subir Imagen QR" / "Ingresar manualmente".'
			);
		}
	}

	function procesarContenidoQr(rawText) {
		const texto = (rawText || '').trim();

		// 1. Seguridad: Bloquear URLs externas o enlaces potencialmente maliciosos
		if (/^https?:\/\//i.test(texto) || texto.includes('www.') || texto.includes('<script')) {
			mostrarErrorQr(
				'Contenido bloqueado por seguridad',
				'El código QR escaneado contiene un enlace externo o formato no compatible con comprobantes electrónicos de SUNAT.'
			);
			return;
		}

		// 2. Parseo formato oficial SUNAT: RUC|TIPO|SERIE|NUMERO|IGV|TOTAL|FECHA|TIPODOC_REC|NUMDOC_REC
		const partes = texto.split('|');
		if (partes.length < 6) {
			mostrarErrorQr(
				'Formato de QR no compatible',
				'El código leído no contiene la estructura estándar de un comprobante electrónico SUNAT.'
			);
			return;
		}

		const ruc = (partes[0] || '').replace(/\D/g, '').slice(0, 11);
		const codTipo = (partes[1] || '').trim().toUpperCase();
		const tipoMapeado = MAPA_TIPO_SUNAT[codTipo];
		const serie = (partes[2] || '').trim().toUpperCase().slice(0, 4);
		const numero = (partes[3] || '').replace(/\D/g, '').padStart(8, '0').slice(-8);
		const total = parseFloat(partes[5] || '0');
		const fecha = (partes[6] || '').trim();
		const tipoDocRec = (partes[7] || '0').trim();
		const numDocRec = (partes[8] || '').trim();

		if (!ruc || ruc.length !== 11 || !tipoMapeado || !serie || !numero) {
			mostrarErrorQr(
				'Datos incompletos o ilegibles en el QR',
				'No se pudieron extraer los identificadores mínimos del comprobante (RUC, Serie o Número).'
			);
			return;
		}

		// Bloquear inputs por defecto (solo lectura hasta pulsar "Corregir")
		document.querySelectorAll('.det-input').forEach((el) => {
			if (el.tagName === 'SELECT') el.disabled = true;
			else el.readOnly = true;
		});

		if (detRucEmisor) detRucEmisor.value = ruc;
		if (detTipoCpe) detTipoCpe.value = tipoMapeado;
		if (detSerie) detSerie.value = serie;
		if (detNumero) detNumero.value = numero;
		if (detFecha) detFecha.value = /^\d{4}-\d{2}-\d{2}$/.test(fecha) ? fecha : '';
		if (detMonto) detMonto.value = !isNaN(total) ? total.toFixed(2) : '0.00';
		if (detTipoDocRec) detTipoDocRec.value = ['0', '1', '4', '6', '7'].includes(tipoDocRec) ? tipoDocRec : '0';
		if (detNumDocRec) detNumDocRec.value = numDocRec;

		// Si falta fecha o algún campo, avisar al usuario para que complete solo lo necesario
		if (!detFecha?.value) {
			avisoFaltanteQr?.classList.remove('hidden');
			if (detFecha) detFecha.readOnly = false;
		} else {
			avisoFaltanteQr?.classList.add('hidden');
		}

		qrAlertaError?.classList.add('hidden');
		tarjetaDetectados?.classList.remove('hidden');
		playSuccessSound();
	}

	// Abrir modal escáner
	btnAbrirEscaner?.addEventListener('click', () => {
		modalEscaner?.classList.remove('hidden');
		tabCamara?.click();
	});

	// Cerrar modal escáner
	async function cerrarEscaner() {
		await detenerCamara();
		modalEscaner?.classList.add('hidden');
	}

	btnCerrarEscanerX?.addEventListener('click', cerrarEscaner);
	botonesManual.forEach((btn) =>
		btn.addEventListener('click', async () => {
			await cerrarEscaner();
			rucEmisorInput?.focus();
		})
	);

	// Cambio de pestañas (Cámara / Subir Imagen)
	tabCamara?.addEventListener('click', () => {
		tabCamara.className = 'rounded-lg bg-white py-2 text-xs font-extrabold text-[#003366] shadow-sm transition dark:bg-slate-900 dark:text-sky-400';
		tabImagen.className = 'rounded-lg py-2 text-xs font-bold text-slate-600 transition hover:text-slate-900 dark:text-slate-400';
		panelCamara?.classList.remove('hidden');
		panelImagen?.classList.add('hidden');
		iniciarCamara();
	});

	tabImagen?.addEventListener('click', async () => {
		await detenerCamara();
		tabImagen.className = 'rounded-lg bg-white py-2 text-xs font-extrabold text-[#003366] shadow-sm transition dark:bg-slate-900 dark:text-sky-400';
		tabCamara.className = 'rounded-lg py-2 text-xs font-bold text-slate-600 transition hover:text-slate-900 dark:text-slate-400';
		panelImagen?.classList.remove('hidden');
		panelCamara?.classList.add('hidden');
		qrAlertaError?.classList.add('hidden');
		tarjetaDetectados?.classList.add('hidden');
	});

	// Lectura desde imagen subida
	inputArchivoQr?.addEventListener('change', async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const fileScanner = new Html5Qrcode('qr-file-reader');
		try {
			const resultado = await fileScanner.scanFile(file, true);
			procesarContenidoQr(resultado);
		} catch (err) {
			mostrarErrorQr(
				'No se detectó un código QR legible en la imagen',
				'Asegúrate de que la imagen no esté borrosa, recortada o con poca iluminación, o ingresa los datos manualmente.'
			);
		} finally {
			inputArchivoQr.value = '';
		}
	});

	btnQrReintentar?.addEventListener('click', () => {
		qrAlertaError?.classList.add('hidden');
		if (!panelCamara?.classList.contains('hidden')) {
			iniciarCamara();
		}
	});

	// Botón "Corregir" en la tarjeta de Datos Detectados
	btnCorregir?.addEventListener('click', () => {
		document.querySelectorAll('.det-input').forEach((el) => {
			if (el.tagName === 'SELECT') el.disabled = false;
			else el.readOnly = false;
		});
		detSerie?.focus();
	});

	// Botón "Usar estos datos": autocompleta el formulario principal y valida
	btnUsarDatos?.addEventListener('click', async () => {
		if (rucEmisorInput && detRucEmisor) {
			rucEmisorInput.value = detRucEmisor.value.trim();
			if (cntRucEmisor) cntRucEmisor.textContent = `${rucEmisorInput.value.length}/11`;
		}
		if (selectTipoCpe && detTipoCpe) selectTipoCpe.value = detTipoCpe.value;
		if (selectTipoDocRec && detTipoDocRec) {
			selectTipoDocRec.value = detTipoDocRec.value;
			actualizarEstadoInputReceptor();
		}
		if (numDocRecInput && detNumDocRec && detTipoDocRec?.value !== '0') {
			numDocRecInput.value = detNumDocRec.value.trim();
			if (cntDocReceptor) cntDocReceptor.textContent = `${numDocRecInput.value.length}/${numDocRecInput.maxLength}`;
		}
		if (serieInput && detSerie) serieInput.value = detSerie.value.trim().toUpperCase();
		if (numeroInput && detNumero) numeroInput.value = detNumero.value.trim();
		if (fechaInput && detFecha) fechaInput.value = detFecha.value;
		if (montoInput && detMonto) montoInput.value = detMonto.value;

		await cerrarEscaner();
		ejecutarValidacion();
	});

	// =========================================================================
	// GALERÍA DE QR DE PRUEBA (GENERADOS DESDE BASE_DATOS_SUNAT + CASO MALICIOSO)
	// =========================================================================
	const modalQrPrueba = document.getElementById('modal-qr-prueba');
	const btnAbrirQrPrueba = document.getElementById('btn-abrir-qr-prueba');
	const btnCerrarQrPrueba = document.getElementById('btn-cerrar-qr-prueba');
	const gridQrs = document.getElementById('grid-qrs-generados');

	btnAbrirQrPrueba?.addEventListener('click', async () => {
		if (!gridQrs) return;
		gridQrs.innerHTML = '';

		const casosPrueba = [
			...BASE_DATOS_SUNAT.map((item) => ({
				titulo: item.etiqueta,
				subtitulo: `${item.serie}-${item.numero} · S/ ${item.monto}`,
				cadenaQr: `${item.rucEmisor}|${item.codigoSunat}|${item.serie}|${item.numero}|${item.igv}|${item.monto}|${item.fecha}|${item.tipoDocRec}|${item.numDocRec}`,
				esMalicioso: false,
			})),
			{
				titulo: 'Prueba Seguridad (Enlace)',
				subtitulo: 'Debe ser bloqueado',
				cadenaQr: 'https://phishing-sunat-falso.com/login',
				esMalicioso: true,
			},
		];

		for (const caso of casosPrueba) {
			const dataUrl = await QRCode.toDataURL(caso.cadenaQr, { width: 160, margin: 1 });
			const card = document.createElement('div');
			card.className = `flex flex-col items-center justify-between rounded-2xl border p-3 text-center space-y-1.5 ${
				caso.esMalicioso
					? 'border-rose-200 bg-rose-50/40 dark:border-rose-900/50 dark:bg-rose-950/20'
					: 'border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-950/50'
			}`;

			card.innerHTML = `
				<div class="space-y-0.5">
					<span class="block text-xs font-extrabold leading-tight ${caso.esMalicioso ? 'text-rose-700 dark:text-rose-400' : 'text-slate-900 dark:text-white'}">
						${caso.titulo}
					</span>
					<span class="block text-[10px] text-slate-500">${caso.subtitulo}</span>
				</div>
				<img src="${dataUrl}" alt="QR ${caso.titulo}" class="h-28 w-28 rounded-xl border border-slate-200 bg-white p-1 shadow-sm" />
				<a
					href="${dataUrl}"
					download="QR_${caso.titulo.replace(/\s+/g, '_')}.png"
					class="inline-flex items-center gap-1 rounded-lg bg-white border border-slate-300 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
				>
					Descargar PNG
				</a>
			`;
			gridQrs.appendChild(card);
		}

		modalQrPrueba?.classList.remove('hidden');
	});

	btnCerrarQrPrueba?.addEventListener('click', () => modalQrPrueba?.classList.add('hidden'));

	// Cerrar modales al hacer clic fuera del cuadro o presionar Escape
	modalQrPrueba?.addEventListener('click', (e) => {
		if (e.target === modalQrPrueba) modalQrPrueba.classList.add('hidden');
	});
	modalEscaner?.addEventListener('click', (e) => {
		if (e.target === modalEscaner) cerrarEscaner();
	});
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') {
			if (modalQrPrueba && !modalQrPrueba.classList.contains('hidden')) {
				modalQrPrueba.classList.add('hidden');
			}
			if (modalEscaner && !modalEscaner.classList.contains('hidden')) {
				cerrarEscaner();
			}
		}
	});

	btnCerrarQrPrueba?.addEventListener('click', () => modalQrPrueba?.classList.add('hidden'));
});