const chatContenedor = document.getElementById('chat-mensajes');
const formChat = document.getElementById('form-chat-sofia');
const inputMensaje = document.getElementById('input-mensaje-sofia');
const botonesRapidos = document.querySelectorAll('.btn-consulta-rapida');
const btnLimpiarChat = document.getElementById('btn-limpiar-chat');

const baseConocimiento = {
	vencimientos: {
		texto:
			'Tu RUC <strong>10616288475</strong> termina en el dígito <strong>5</strong>. Para el periodo tributario <strong>Noviembre 2026</strong>, tu fecha máxima de declaración y pago es el <strong>18 de diciembre de 2026</strong>.',
		enlaceTexto: 'Ver Cronograma Completo 2026',
		enlaceUrl: '/ayuda/cronograma-vencimientos',
	},
	factura: {
		texto:
			'Para emitir una <strong>Factura Electrónica</strong> ingresa a <em>Emitir > Factura Electrónica</em>, digita el RUC de tu cliente, selecciona la moneda y agrega los ítems. El IGV (18%) se calcula automáticamente.',
		enlaceTexto: 'Ir a Guía de Factura Electrónica',
		enlaceUrl: '/ayuda/factura',
	},
	pagar: {
		texto:
			'Puedes cancelar tus tributos pendientes mediante <strong>Cargo en Cuenta Bancaria</strong>, <strong>Tarjeta de Débito/Crédito</strong> o generando un <strong>Número de Pago SUNAT (NPS)</strong> a través del Formulario Virtual 1662.',
		enlaceTexto: 'Ir a Pago de Tributos Pendientes',
		enlaceUrl: '/declara/pago-tributos',
	},
	fraccionamiento: {
		texto:
			'Puedes acoger tus deudas exigibles al fraccionamiento del <strong>Art. 36° del Código Tributario (Form. 687)</strong> en hasta 36 cuotas mensuales. Se requiere una cuota de acogimiento mínima del 10% y tu cuota mensual no puede ser menor al 5% de la UIT.',
		enlaceTexto: 'Simular y Solicitar Fraccionamiento',
		enlaceUrl: '/tramites/fraccionamiento',
	},
	clave: {
		texto:
			'Desde el módulo de <strong>Mi Perfil / Clave SOL</strong> puedes actualizar tu contraseña (8 a 12 caracteres alfanuméricos) y administrar usuarios secundarios para tu contador.',
		enlaceTexto: 'Ir a Gestión de Clave SOL',
		enlaceUrl: '/clave-sol',
	},
	asesor: {
		texto:
			'Si necesitas atención personalizada, puedes comunicarte con nuestra Central de Consultas al <strong>*4000</strong> desde celulares o al <strong>0-801-12-100</strong> de lunes a viernes de 8:30 a.m. a 6:00 p.m.',
		enlaceTexto: 'Registrar consulta o reclamo formal',
		enlaceUrl: '/libro-reclamaciones/registrar',
	},
};

function detectarTema(textoUsuario) {
	const t = textoUsuario.toLowerCase();
	if (t.includes('venc') || t.includes('cronograma') || t.includes('fecha') || t.includes('digito') || t.includes('ruc')) {
		return baseConocimiento.vencimientos;
	}
	if (t.includes('factura') || t.includes('emitir') || t.includes('comprobante') || t.includes('guia')) {
		return baseConocimiento.factura;
	}
	if (t.includes('pagar') || t.includes('pago') || t.includes('nps') || t.includes('tributo') || t.includes('boleta')) {
		return baseConocimiento.pagar;
	}
	if (t.includes('fraccion') || t.includes('cuota') || t.includes('deuda') || t.includes('687')) {
		return baseConocimiento.fraccionamiento;
	}
	if (t.includes('clave') || t.includes('contraseña') || t.includes('sol') || t.includes('usuario')) {
		return baseConocimiento.clave;
	}
	if (t.includes('asesor') || t.includes('telefono') || t.includes('ayuda') || t.includes('reclamo')) {
		return baseConocimiento.asesor;
	}

	return {
		texto:
			'Entiendo tu consulta sobre <em>"' +
			textoUsuario +
			'"</em>. Puedes revisar nuestros manuales paso a paso en el Centro de Guías Explicativas o elegir una de las consultas frecuentes del panel izquierdo.',
		enlaceTexto: 'Explorar Centro de Guías Explicativas',
		enlaceUrl: '/ayuda/guias',
	};
}

function agregarMensajeUsuario(texto) {
	if (!chatContenedor) return;
	const div = document.createElement('div');
	div.className = 'flex items-start justify-end gap-3';
	div.innerHTML = `
		<div class="max-w-lg rounded-2xl rounded-tr-none bg-[#003366] px-4 py-3 text-sm text-white shadow-sm">
			${texto}
		</div>
		<div class="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-slate-200 text-xs font-black text-slate-700 dark:bg-slate-800 dark:text-slate-200">
			JC
		</div>
	`;
	chatContenedor.appendChild(div);
	chatContenedor.scrollTop = chatContenedor.scrollHeight;
}

function agregarRespuestaSofia(respuesta) {
	if (!chatContenedor) return;

	const typingDiv = document.createElement('div');
	typingDiv.className = 'flex items-start gap-3';
	typingDiv.innerHTML = `
		<div class="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-[#003366] text-xs font-black text-white">SF</div>
		<div class="rounded-2xl rounded-tl-none border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-400 dark:border-slate-800 dark:bg-slate-900">
			Sofía está escribiendo...
		</div>
	`;
	chatContenedor.appendChild(typingDiv);
	chatContenedor.scrollTop = chatContenedor.scrollHeight;

	setTimeout(() => {
		typingDiv.remove();
		const msgDiv = document.createElement('div');
		msgDiv.className = 'flex items-start gap-3';
		msgDiv.innerHTML = `
			<div class="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-[#003366] text-xs font-black text-white">
				SF
			</div>
			<div class="max-w-lg space-y-3 rounded-2xl rounded-tl-none border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
				<p class="leading-relaxed">${respuesta.texto}</p>
				<a href="${respuesta.enlaceUrl}" class="inline-flex items-center gap-1.5 rounded-xl bg-sky-50 px-3 py-1.5 text-xs font-extrabold text-[#0877a7] transition hover:bg-sky-100 dark:bg-sky-950 dark:text-sky-300">
					${respuesta.enlaceTexto} →
				</a>
			</div>
		`;
		chatContenedor.appendChild(msgDiv);
		chatContenedor.scrollTop = chatContenedor.scrollHeight;
	}, 450);
}

formChat?.addEventListener('submit', (e) => {
	e.preventDefault();
	const texto = inputMensaje?.value.trim();
	if (!texto) return;

	agregarMensajeUsuario(texto);
	if (inputMensaje) inputMensaje.value = '';

	const respuesta = detectarTema(texto);
	agregarRespuestaSofia(respuesta);
});

botonesRapidos.forEach((btn) => {
	btn.addEventListener('click', () => {
		const topic = btn.dataset.topic || '';
		const pregunta = btn.dataset.pregunta || '';
		agregarMensajeUsuario(pregunta);
		const respuesta = baseConocimiento[topic] || detectarTema(pregunta);
		agregarRespuestaSofia(respuesta);
	});
});

btnLimpiarChat?.addEventListener('click', () => {
	if (!chatContenedor) return;
	const primerMensaje = chatContenedor.firstElementChild;
	chatContenedor.innerHTML = '';
	if (primerMensaje) chatContenedor.appendChild(primerMensaje);
});