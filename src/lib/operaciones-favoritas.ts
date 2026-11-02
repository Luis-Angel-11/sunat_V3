export interface OperacionFavorita {
	id: string;
	titulo: string;
	descripcion: string;
	href: string;
	icon: string;
	guardado: string;
}

const KEY = 'sunat-operaciones-favoritas';

export function leerOperaciones(): OperacionFavorita[] {
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed.filter(
			(item): item is OperacionFavorita =>
				Boolean(item) && typeof item.id === 'string' && typeof item.href === 'string',
		);
	} catch {
		return [];
	}
}

export function guardarOperaciones(operaciones: OperacionFavorita[]): void {
	try {
		localStorage.setItem(KEY, JSON.stringify(operaciones));
	} catch {
	}
}

export function esFavorita(id: string): boolean {
	return leerOperaciones().some((operacion) => operacion.id === id);
}

export function alternarOperacion(operacion: Omit<OperacionFavorita, 'guardado'>): boolean {
	const operaciones = leerOperaciones();
	const existe = operaciones.some((item) => item.id === operacion.id);
	const siguientes = existe
		? operaciones.filter((item) => item.id !== operacion.id)
		: [{ ...operacion, guardado: new Date().toISOString() }, ...operaciones];
	guardarOperaciones(siguientes);
	return !existe;
}

export function quitarOperacion(id: string): void {
	guardarOperaciones(leerOperaciones().filter((operacion) => operacion.id !== id));
}
