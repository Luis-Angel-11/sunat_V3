import { markdownSeguro } from '../lib/markdown';
import { hablar } from './lectorPantalla.js';

const chatContenedor = document.getElementById('chat-mensajes');
const formChat = document.getElementById('form-chat-sofia');
const inputMensaje = document.getElementById('input-mensaje-sofia');
const btnEnviar = formChat?.querySelector('button[type="submit"]');
const botonesRapidos = document.querySelectorAll('.btn-consulta-rapida');
const btnLimpiarChat = document.getElementById('btn-limpiar-chat');

/** @type {{ rol: 'usuario' | 'asistente'; texto: string }[]} */
const historial = [];
let ocupado = false;

const escapar = (t) => t.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function agregarMensajeUsuario(texto) {
	if (!chatContenedor) return;
	const div = document.createElement('div');
	div.className = 'flex items-start justify-end gap-3';
	div.innerHTML = `
		<div class="max-w-lg rounded-2xl rounded-tr-none bg-[#003366] px-4 py-3 text-sm text-white shadow-sm">
			${escapar(texto)}
		</div>
		<div class="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-slate-200 text-xs font-black text-slate-700 dark:bg-slate-800 dark:text-slate-200">
			JC
		</div>
	`;
	chatContenedor.appendChild(div);
	chatContenedor.scrollTop = chatContenedor.scrollHeight;
}

function crearBurbujaSofia() {
	const msgDiv = document.createElement('div');
	msgDiv.className = 'flex items-start gap-3';
	msgDiv.innerHTML = `
		<div class="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-[#003366] text-xs font-black text-white">
			SF
		</div>
		<div class="sofia-md max-w-lg space-y-2 rounded-2xl rounded-tl-none border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
			<span class="text-xs font-semibold text-slate-400">Pensando...</span>
		</div>
	`;
	chatContenedor?.appendChild(msgDiv);
	if (chatContenedor) chatContenedor.scrollTop = chatContenedor.scrollHeight;
	return msgDiv.querySelector('.sofia-md');
}

async function preguntarASofia(pregunta) {
	const textoLimpio = pregunta.trim();
	if (ocupado || !textoLimpio || !chatContenedor) return;

	ocupado = true;
	if (btnEnviar) btnEnviar.disabled = true;

	historial.push({ rol: 'usuario', texto: textoLimpio });
	agregarMensajeUsuario(textoLimpio);

	const cuerpoBurbuja = crearBurbujaSofia();
	let texto = '';
	/** @type {{ url: string; titulo: string }[]} */
	let fuentes = [];
	let error = '';

	try {
		const res = await fetch('/api/chat-sunat', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ historial }),
		});

		if (!res.ok || !res.body) {
			error = (await res.json().catch(() => null))?.error || 'No pudimos conectar con el asistente.';
		} else {
			const lector = res.body.pipeThrough(new TextDecoderStream()).getReader();
			let resto = '';

			for (;;) {
				const { value, done } = await lector.read();
				if (done) break;
				resto += value;
				const lineas = resto.split('\n');
				resto = lineas.pop() ?? '';

				for (const linea of lineas) {
					if (!linea.trim()) continue;
					const ev = JSON.parse(linea);

					if (ev.t === 'buscando' && !texto && cuerpoBurbuja) {
						cuerpoBurbuja.innerHTML =
							'<span class="text-xs font-semibold text-[#0877a7] dark:text-sky-400">Buscando en sunat.gob.pe...</span>';
					}
					if (ev.t === 'texto' && cuerpoBurbuja) {
						texto += ev.v;
						cuerpoBurbuja.innerHTML = markdownSeguro(texto);
					}
					if (ev.t === 'fuentes') fuentes = ev.v;
					if (ev.t === 'error') error = ev.v;
				}
				chatContenedor.scrollTop = chatContenedor.scrollHeight;
			}
		}
	} catch {
		error = 'No pudimos conectar con el asistente. Revisa tu conexión.';
	}

	if (cuerpoBurbuja) {
		if (error && !texto) {
			cuerpoBurbuja.innerHTML = `<p><strong>Ups.</strong> ${escapar(error)}</p>`;
			historial.pop();
		} else {
			historial.push({ rol: 'asistente', texto });
			if (texto) hablar(texto);
			if (fuentes.length) {
				const enlaces = fuentes
					.map(
						(f) =>
							`<li><a href="${escapar(f.url)}" target="_blank" rel="noopener noreferrer">${escapar(f.titulo || f.url)}</a></li>`
					)
					.join('');
				cuerpoBurbuja.insertAdjacentHTML(
					'beforeend',
					`<div class="mt-3 border-t border-slate-200 pt-2 text-xs dark:border-slate-700">
						<strong class="block mb-1 text-slate-600 dark:text-slate-300">Fuentes oficiales:</strong>
						<ul class="list-disc pl-4 space-y-0.5">${enlaces}</ul>
					</div>`
				);
			}
		}
	}

	chatContenedor.scrollTop = chatContenedor.scrollHeight;
	ocupado = false;
	if (btnEnviar) btnEnviar.disabled = false;
	inputMensaje?.focus();
}

formChat?.addEventListener('submit', (e) => {
	e.preventDefault();
	const texto = inputMensaje?.value || '';
	if (inputMensaje) inputMensaje.value = '';
	preguntarASofia(texto);
});

botonesRapidos.forEach((btn) => {
	btn.addEventListener('click', () => {
		const pregunta = btn.dataset.pregunta || '';
		preguntarASofia(pregunta);
	});
});

btnLimpiarChat?.addEventListener('click', () => {
	if (!chatContenedor) return;
	const primerMensaje = chatContenedor.firstElementChild;
	chatContenedor.innerHTML = '';
	if (primerMensaje) chatContenedor.appendChild(primerMensaje);
	historial.length = 0;
});