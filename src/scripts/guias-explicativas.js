const buscador = document.getElementById('buscador-guias');
const botonesCat = document.querySelectorAll('.btn-cat');
const tarjetas = document.querySelectorAll('.tarjeta-guia');
const estadoVacio = document.getElementById('guias-vacio');
const gridGuias = document.getElementById('grid-guias');
const btnReset = document.getElementById('btn-reset-guias');

let categoriaActiva = 'Todas';

function filtrarGuias() {
	const texto = (buscador?.value || '').toLowerCase().trim();
	let visibles = 0;

	tarjetas.forEach((card) => {
		const catCard = card.dataset.categoria || '';
		const textoCard = card.dataset.busqueda || '';

		const coincideCat = categoriaActiva === 'Todas' || catCard === categoriaActiva;
		const coincideTexto = !texto || textoCard.includes(texto);

		if (coincideCat && coincideTexto) {
			card.style.display = 'flex';
			visibles++;
		} else {
			card.style.display = 'none';
		}
	});

	if (estadoVacio && gridGuias) {
		if (visibles === 0) {
			gridGuias.classList.add('hidden');
			estadoVacio.classList.remove('hidden');
		} else {
			gridGuias.classList.remove('hidden');
			estadoVacio.classList.add('hidden');
		}
	}
}

botonesCat.forEach((btn) => {
	btn.addEventListener('click', () => {
		categoriaActiva = btn.dataset.cat || 'Todas';

		botonesCat.forEach((b) => {
			b.className =
				'btn-cat rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300';
		});

		btn.className =
			'btn-cat rounded-xl bg-[#003366] px-3.5 py-1.5 text-xs font-extrabold text-white transition';

		filtrarGuias();
	});
});

buscador?.addEventListener('input', filtrarGuias);

btnReset?.addEventListener('click', () => {
	categoriaActiva = 'Todas';
	if (buscador) buscador.value = '';
	botonesCat[0]?.click();
});