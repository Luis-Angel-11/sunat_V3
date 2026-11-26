import Anthropic from '@anthropic-ai/sdk';

/** Modelo usado por los asistentes con IA del prototipo. */
export const MODELO = 'claude-opus-5-5';

/** Si el modelo rechaza una consulta por política, la API la reintenta sola con otro modelo. */
export const FALLBACK = {
	betas: ['server-side-fallback-2026-07-01'],
	fallbacks: 'default',
} as const;

let cliente: Anthropic | null = null;

/**
 * Devuelve el cliente de Anthropic. La API key se lee SOLO en el servidor
 * desde el archivo .env (ANTHROPIC_API_KEY); nunca se envía al navegador.
 */
export const claude = (): Anthropic => {
	const apiKey = import.meta.env.ANTHROPIC_API_KEY ?? process.env.ANTHROPIC_API_KEY;
	if (!apiKey) throw new Error('FALTA_API_KEY');
	cliente ??= new Anthropic({ apiKey });
	return cliente;
};

export const json = (data: unknown, status = 200) =>
	new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } });

/** Traduce los errores de la API a mensajes entendibles para el usuario. */
export const mensajeError = (error: unknown): { mensaje: string; status: number } => {
	if (error instanceof Error && error.message === 'FALTA_API_KEY')
		return { mensaje: 'Falta configurar la API key de Anthropic en el archivo .env del proyecto.', status: 500 };
	if (error instanceof Anthropic.AuthenticationError)
		return { mensaje: 'La API key de Anthropic no es válida. Revisa el archivo .env.', status: 500 };
	if (error instanceof Anthropic.RateLimitError)
		return { mensaje: 'El asistente está recibiendo muchas consultas. Intenta de nuevo en un minuto.', status: 429 };
	if (error instanceof Anthropic.BadRequestError) {
		console.error('[claude] solicitud inválida:', error.message);
		const sinCreditos = /credit balance/i.test(error.message);
		return {
			mensaje: sinCreditos
				? 'Tu cuenta de Anthropic no tiene créditos suficientes.'
				: 'No pudimos procesar la consulta (solicitud inválida). Revisa la terminal para ver el detalle.',
			status: 500,
		};
	}
	if (error instanceof Anthropic.APIError) {
		console.error(`[claude] error ${error.status}:`, error.message);
		return { mensaje: 'El servicio de IA no respondió. Intenta de nuevo en unos segundos.', status: 502 };
	}
	console.error('[claude] error inesperado:', error);
	return { mensaje: 'Ocurrió un error inesperado con el asistente.', status: 500 };
};

/** Fecha de hoy en Perú (YYYY-MM-DD). */
export const hoyLima = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima' }).format(new Date());
