// src/scripts/lectorPantalla.js
const CLAVE_STORAGE = 'sunat_lector_activo';
let activo = localStorage.getItem(CLAVE_STORAGE) === 'true';
let ultimoTexto = '';
let timerDebounce = null;
let leyendoPagina = false;

function obtenerVozEspanol() {
	const voces = window.speechSynthesis.getVoices();
	return (
		voces.find((v) => v.lang.startsWith('es-PE')) ||
		voces.find((v) => v.lang.startsWith('es-419')) ||
		voces.find((v) => v.lang.startsWith('es')) ||
		null
	);
}

export function hablar(texto, interrumpir = true) {
	if (!activo || !('speechSynthesis' in window)) return;
	const limpio = texto.replace(/\s+/g, ' ').trim();
	if (!limpio) return;

	if (interrumpir) {
		leyendoPagina = false;
		window.speechSynthesis.cancel();
	}

	const utterance = new SpeechSynthesisUtterance(limpio);
	const voz = obtenerVozEspanol();
	if (voz) utterance.voice = voz;
	utterance.lang = 'es-PE';
	utterance.rate = 1.05;
	window.speechSynthesis.speak(utterance);
}

export function leerPaginaCompleta() {
	if (!activo || !('speechSynthesis' in window)) return;
	window.speechSynthesis.cancel();
	leyendoPagina = true;

	const contenedor = document.querySelector('main') || document.body;
	const bloques = contenedor.querySelectorAll('h1, h2, h3, p, li, th, td, label, button, a');
	const textos = [];

	bloques.forEach((el) => {
		if (!(el instanceof HTMLElement)) return;
		if (el.offsetParent === null || el.closest('[hidden], [aria-hidden="true"]')) return;
		if (el.children.length > 0 && el.querySelector('h1, h2, h3, p, li')) return;

		const txt = (el.getAttribute('aria-label') || el.innerText || '').replace(/\s+/g, ' ').trim();
		if (txt && textos[textos.length - 1] !== txt) {
			textos.push(txt);
		}
	});

	if (!textos.length) {
		leyendoPagina = false;
		return;
	}

	textos.forEach((fragmento, idx) => {
		const utterance = new SpeechSynthesisUtterance(fragmento);
		const voz = obtenerVozEspanol();
		if (voz) utterance.voice = voz;
		utterance.lang = 'es-PE';
		utterance.rate = 1.05;
		if (idx === textos.length - 1) {
			utterance.onend = () => {
				leyendoPagina = false;
			};
		}
		window.speechSynthesis.speak(utterance);
	});
}

export function alternarLector() {
	activo = !activo;
	localStorage.setItem(CLAVE_STORAGE, String(activo));
	actualizarBotonesUI();

	if (activo) {
		leerPaginaCompleta();
	} else {
		leyendoPagina = false;
		window.speechSynthesis.cancel();
	}
	return activo;
}

export function estaLectorActivo() {
	return activo;
}

function actualizarBotonesUI() {
	document.querySelectorAll('[data-toggle-lector]').forEach((btn) => {
		btn.setAttribute('aria-pressed', String(activo));
		const etiqueta = btn.querySelector('[data-lector-label]');
		if (etiqueta) etiqueta.textContent = activo ? 'Lector: ON' : 'Lector de voz';
		btn.classList.toggle('bg-amber-300', activo);
		btn.classList.toggle('text-slate-950', activo);
	});
}

function extraerTextoElemento(el) {
	if (!(el instanceof HTMLElement)) return '';
	const objetivo = el.closest('button, a, input, textarea, select, h1, h2, h3, h4, p, td, th, label, [role="menuitem"]');
	if (!objetivo) return '';

	const aria = objetivo.getAttribute('aria-label');
	if (aria) return aria;

	if (objetivo instanceof HTMLInputElement || objetivo instanceof HTMLTextAreaElement) {
		const lbl = objetivo.id ? document.querySelector(`label[for="${objetivo.id}"]`)?.textContent : '';
		return `${lbl || objetivo.placeholder || 'Campo de texto'}${objetivo.value ? ': ' + objetivo.value : ''}`;
	}

	if (objetivo instanceof HTMLSelectElement) {
		const opcion = objetivo.options[objetivo.selectedIndex]?.text || '';
		return `Selector: ${opcion}`;
	}

	const prefijo = objetivo.tagName === 'A' ? 'Enlace: ' : objetivo.tagName === 'BUTTON' ? 'Botón: ' : '';
	return prefijo + (objetivo.innerText || objetivo.textContent || '');
}

document.addEventListener('DOMContentLoaded', () => {
	if ('speechSynthesis' in window) {
		window.speechSynthesis.getVoices();
		window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
	}

	actualizarBotonesUI();

	if (activo) {
		setTimeout(() => leerPaginaCompleta(), 350);
	}

	// Vincular botones de activación en header o perfil
	document.addEventListener('click', (e) => {
		const btn = e.target instanceof Element ? e.target.closest('[data-toggle-lector]') : null;
		if (btn) {
			e.preventDefault();
			alternarLector();
		}
	});

	// Lectura al enfocar con teclado (Tab) sí interrumpe la lectura general
	document.addEventListener('focusin', (e) => {
		if (!activo) return;
		const texto = extraerTextoElemento(e.target);
		if (texto) {
			ultimoTexto = texto;
			hablar(texto, true);
		}
	});

	// Lectura al pasar el cursor solo cuando no está leyendo toda la página de corrido
	document.addEventListener('mouseover', (e) => {
		if (!activo || leyendoPagina) return;
		const texto = extraerTextoElemento(e.target);
		if (!texto || texto === ultimoTexto) return;

		clearTimeout(timerDebounce);
		timerDebounce = setTimeout(() => {
			ultimoTexto = texto;
			hablar(texto, true);
		}, 250);
	});
});