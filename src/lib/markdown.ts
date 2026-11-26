/**
 * Convierte el markdown sencillo que devuelve la IA (negritas, enlaces, listas)
 * en HTML seguro: todo se escapa primero y solo se permiten enlaces http(s) o rutas internas.
 */
const escapar = (t: string) => t.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const enLinea = (t: string) =>
	escapar(t)
		.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
		.replace(/\[([^\]]+)\]\(((?:https?:\/\/|\/)[^\s)]+)\)/g, (_, texto, url) => {
			const externo = url.startsWith('http');
			return `<a href="${url}"${externo ? ' target="_blank" rel="noopener noreferrer"' : ''}>${texto}</a>`;
		});

export const markdownSeguro = (md: string): string => {
	const html: string[] = [];
	let lista: 'ul' | 'ol' | null = null;
	const cerrarLista = () => {
		if (lista) html.push(`</${lista}>`);
		lista = null;
	};
	for (const cruda of md.split('\n')) {
		const linea = cruda.trim();
		const vineta = linea.match(/^[-*•]\s+(.*)$/);
		const numerada = linea.match(/^\d+[.)]\s+(.*)$/);
		if (vineta || numerada) {
			const tipo = vineta ? 'ul' : 'ol';
			if (lista !== tipo) {
				cerrarLista();
				html.push(`<${tipo}>`);
				lista = tipo;
			}
			html.push(`<li>${enLinea((vineta || numerada)![1])}</li>`);
		} else {
			cerrarLista();
			if (!linea) continue;
			const titulo = linea.match(/^#{1,6}\s+(.*)$/);
			html.push(titulo ? `<p><strong>${enLinea(titulo[1])}</strong></p>` : `<p>${enLinea(linea)}</p>`);
		}
	}
	cerrarLista();
	return html.join('');
};
