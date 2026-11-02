import type { IconName } from './icons';

export type Perfil = 'personas' | 'empresas' | 'aduanas';

export interface Tramite {
	titulo: string;
	/** Qué es y para qué sirve, en lenguaje sencillo. Se muestra en el tooltip. */
	ayuda: string;
	/** Cuándo te conviene usarlo. */
	cuando: string;
	icon: IconName;
	perfiles: Perfil[];
}

export const perfiles: { id: Perfil; label: string; descripcion: string; icon: IconName }[] = [
	{
		id: 'personas',
		label: 'Personas',
		descripcion: 'Trabajadores independientes, dependientes y personas con RUC.',
		icon: 'user',
	},
	{
		id: 'empresas',
		label: 'Empresas',
		descripcion: 'Negocios que venden, facturan, contratan personal o declaran IGV.',
		icon: 'building',
	},
	{
		id: 'aduanas',
		label: 'Comercio exterior',
		descripcion: 'Si importas, exportas o eres operador de comercio exterior.',
		icon: 'ship',
	},
];

const P: Perfil = 'personas';
const E: Perfil = 'empresas';
const A: Perfil = 'aduanas';

export const tramites = {
	'ficha-ruc': {
		titulo: 'Ficha RUC',
		ayuda: 'Documento oficial con todos tus datos registrados: nombre, domicilio fiscal, actividad y tributos.',
		cuando: 'Te la piden bancos, proveedores o entidades públicas para comprobar tus datos.',
		icon: 'id-card',
		perfiles: [P, E],
	},
	'modificar-ruc': {
		titulo: 'Modificar datos del RUC',
		ayuda: 'Actualiza tu domicilio, teléfono, correo, actividad económica o suspende y reinicia actividades.',
		cuando: 'Cuando te mudas, cambias de giro de negocio o dejas de trabajar por un tiempo.',
		icon: 'edit',
		perfiles: [P, E],
	},
	'abrir-negocio': {
		titulo: 'Quiero abrir un negocio',
		ayuda: 'Guía paso a paso para agregar una actividad de negocio a tu RUC y elegir tu régimen tributario.',
		cuando: 'Si vas a vender productos o servicios con tu propio negocio.',
		icon: 'briefcase',
		perfiles: [P, E],
	},
	'iniciar-independiente': {
		titulo: 'Iniciar actividades como independiente',
		ayuda: 'Activa tu RUC para emitir recibos por honorarios por los servicios que prestas.',
		cuando: 'Antes de cobrar tu primer trabajo como profesional independiente.',
		icon: 'user',
		perfiles: [P],
	},
	'reporte-terceros': {
		titulo: 'Reporte Tributario para Terceros',
		ayuda: 'Genera un documento que muestra tu situación tributaria (deudas, declaraciones) a quien tú autorices.',
		cuando: 'Para pedir un préstamo o participar en una licitación.',
		icon: 'file-text',
		perfiles: [P, E],
	},
	'trabajador-hogar': {
		titulo: 'Registro de trabajadores del hogar',
		ayuda: 'Inscribe a la persona que trabaja en tu casa para que tenga seguro de EsSalud.',
		cuando: 'Si contratas a alguien para labores domésticas.',
		icon: 'home',
		perfiles: [P],
	},
	't-registro': {
		titulo: 'T-Registro de trabajadores',
		ayuda: 'Da de alta, modifica o da de baja a los trabajadores de tu empresa en planilla.',
		cuando: 'Cada vez que contratas o cesas a un trabajador.',
		icon: 'users',
		perfiles: [E],
	},
	'emitir-rhe': {
		titulo: 'Emitir recibo por honorarios',
		ayuda: 'Crea el recibo electrónico que entregas a tu cliente por un servicio que prestaste como independiente.',
		cuando: 'Cada vez que cobras por un trabajo independiente (renta de cuarta categoría).',
		icon: 'receipt',
		perfiles: [P],
	},
	'consultar-rhe': {
		titulo: 'Consultar mis recibos por honorarios',
		ayuda: 'Revisa, descarga o reimprime los recibos que emitiste o que te emitieron.',
		cuando: 'Para llevar el control de tus ingresos o reenviar un recibo a tu cliente.',
		icon: 'search',
		perfiles: [P],
	},
	'emitir-factura': {
		titulo: 'Emitir factura electrónica',
		ayuda: 'Crea la factura que respalda una venta a otra empresa y le permite usar el IGV como crédito.',
		cuando: 'Cuando vendes a un cliente que tiene RUC y te pide factura.',
		icon: 'receipt',
		perfiles: [E],
	},
	'emitir-boleta': {
		titulo: 'Emitir boleta de venta electrónica',
		ayuda: 'Crea la boleta que entregas a consumidores finales cuando les vendes.',
		cuando: 'Cuando tu cliente es una persona que no necesita factura.',
		icon: 'receipt',
		perfiles: [E],
	},
	'consultar-facturas': {
		titulo: 'Consultar facturas y notas',
		ayuda: 'Busca las facturas, notas de crédito y débito que emitiste o recibiste.',
		cuando: 'Para revisar ventas, compras o descargar el XML y PDF de un comprobante.',
		icon: 'search',
		perfiles: [E],
	},
	'validez-cpe': {
		titulo: 'Consultar la validez de un comprobante de pago',
		ayuda: 'Confirma si una factura, boleta, recibo por honorarios, liquidación de compra o nota de crédito o débito existe y fue informada a SUNAT.',
		cuando: 'Antes de pagar o declarar ese comprobante, para asegurarte de que es válido.',
		icon: 'shield-check',
		perfiles: [P, E],
	},
	'declara-paga': {
		titulo: 'Declarar y pagar impuestos',
		ayuda: 'Presenta tu declaración mensual (IGV, Renta) y paga en línea con tarjeta o banca por internet.',
		cuando: 'Cada mes, según el cronograma del último dígito de tu RUC.',
		icon: 'credit-card',
		perfiles: [P, E],
	},
	'consulta-dj': {
		titulo: 'Consultar declaraciones y pagos',
		ayuda: 'Revisa todas las declaraciones que presentaste y los pagos que hiciste, con su constancia.',
		cuando: 'Para comprobar que tu pago se registró o descargar una constancia.',
		icon: 'history',
		perfiles: [P, E],
	},
	'consulta-nps': {
		titulo: 'Consultar Número de Pago SUNAT (NPS)',
		ayuda: 'Revisa los códigos de pago que generaste para pagar en un banco o agente.',
		cuando: 'Si generaste un NPS y quieres saber si ya se pagó o sigue vigente.',
		icon: 'credit-card',
		perfiles: [P, E],
	},
	'plame': {
		titulo: 'PLAME - Planilla electrónica',
		ayuda: 'Declara las remuneraciones de tus trabajadores y los aportes a EsSalud y ONP.',
		cuando: 'Cada mes, si tienes trabajadores en planilla.',
		icon: 'users',
		perfiles: [E],
	},
	'calculadora': {
		titulo: 'Calculadora tributaria',
		ayuda: 'Calcula cuánto debes hoy si pagas tarde, con intereses y multas actualizados.',
		cuando: 'Antes de pagar una deuda vencida, para saber el monto exacto.',
		icon: 'calculator',
		perfiles: [P, E],
	},
	'consulta-devoluciones': {
		titulo: 'Consultar mis devoluciones',
		ayuda: 'Revisa si SUNAT te devolvió dinero (por ejemplo, de Renta) y cómo cobrarlo.',
		cuando: 'Si pagaste de más o te retuvieron más impuesto del que correspondía.',
		icon: 'refund',
		perfiles: [P, E],
	},
	'solicitud-devolucion': {
		titulo: 'Solicitar una devolución',
		ayuda: 'Pide que te devuelvan un pago indebido o en exceso (Formulario 1649).',
		cuando: 'Si pagaste dos veces o un monto mayor al que debías.',
		icon: 'refund',
		perfiles: [P, E],
	},
	'compensacion': {
		titulo: 'Solicitar compensación',
		ayuda: 'Usa un saldo a tu favor para pagar otra deuda tributaria (Formulario 1648).',
		cuando: 'Si tienes dinero a favor en SUNAT y a la vez una deuda pendiente.',
		icon: 'refund',
		perfiles: [P, E],
	},
	'suspension-4ta': {
		titulo: 'Suspender retenciones de 4ta categoría',
		ayuda: 'Evita que te descuenten el 8 % de tus recibos si no superarás el límite anual de ingresos.',
		cuando: 'A inicio de año, si estimas que ganarás menos del monto fijado por SUNAT.',
		icon: 'shield-check',
		perfiles: [P],
	},
	'valores-pendientes': {
		titulo: 'Consultar deudas pendientes',
		ayuda: 'Revisa órdenes de pago, multas y resoluciones que tienes pendientes de pagar.',
		cuando: 'Antes de pedir un préstamo o si recibiste una notificación de cobranza.',
		icon: 'alert-triangle',
		perfiles: [P, E],
	},
	'fraccionamiento': {
		titulo: 'Fraccionar una deuda',
		ayuda: 'Divide tu deuda tributaria en cuotas mensuales para pagarla poco a poco.',
		cuando: 'Si no puedes pagar toda tu deuda de una sola vez.',
		icon: 'calendar',
		perfiles: [P, E],
	},
	'embargos': {
		titulo: 'Consultar embargos',
		ayuda: 'Revisa si SUNAT ordenó un embargo sobre tus cuentas o bienes y los montos retenidos.',
		cuando: 'Si notas un bloqueo en tu cuenta bancaria.',
		icon: 'lock',
		perfiles: [P, E],
	},
	'consulta-detracciones': {
		titulo: 'Consultar detracciones',
		ayuda: 'Revisa los depósitos de detracción (SPOT) hechos a tu cuenta en el Banco de la Nación.',
		cuando: 'Para cuadrar tus cobros cuando vendes bienes o servicios sujetos a detracción.',
		icon: 'landmark',
		perfiles: [P, E],
	},
	'liberacion-fondos': {
		titulo: 'Liberar fondos de detracciones',
		ayuda: 'Pide que el saldo de tu cuenta de detracciones pase a tu cuenta libre (Formulario 1697).',
		cuando: 'Si ya pagaste tus impuestos y te sobra dinero en la cuenta de detracciones.',
		icon: 'landmark',
		perfiles: [E],
	},
	'sire-ventas': {
		titulo: 'Registro de Ventas electrónico (SIRE)',
		ayuda: 'Revisa y acepta la propuesta de tus ventas del mes que SUNAT prepara con tus comprobantes.',
		cuando: 'Cada mes, antes de declarar el IGV.',
		icon: 'book-open',
		perfiles: [P, E],
	},
	'sire-compras': {
		titulo: 'Registro de Compras electrónico (SIRE)',
		ayuda: 'Revisa y acepta la propuesta de tus compras del mes para usar el crédito fiscal del IGV.',
		cuando: 'Cada mes, antes de declarar el IGV.',
		icon: 'book-open',
		perfiles: [P, E],
	},
	'buzon': {
		titulo: 'Buzón electrónico',
		ayuda: 'Lee las notificaciones oficiales que SUNAT te envía. Tienen el mismo valor que una carta física.',
		cuando: 'Revísalo con frecuencia: los plazos corren desde que te llega el mensaje.',
		icon: 'inbox',
		perfiles: [P, E, A],
	},
	'escritos': {
		titulo: 'Presentar escritos electrónicos',
		ayuda: 'Responde a un requerimiento de SUNAT o adjunta documentos a un expediente sin ir a una oficina.',
		cuando: 'Cuando SUNAT te pide información o sustento.',
		icon: 'file-text',
		perfiles: [P, E],
	},
	'expedientes': {
		titulo: 'Consultar mis expedientes',
		ayuda: 'Revisa en qué estado está un trámite o expediente que tienes con SUNAT.',
		cuando: 'Para hacer seguimiento a una solicitud, reclamo o fiscalización.',
		icon: 'history',
		perfiles: [P, E],
	},
	'recursos-impugnatorios': {
		titulo: 'Presentar un reclamo o apelación',
		ayuda: 'Presenta un recurso impugnatorio si no estás de acuerdo con una multa o resolución.',
		cuando: 'Dentro del plazo indicado en la resolución que te notificaron.',
		icon: 'message',
		perfiles: [P, E],
	},
	'quejas': {
		titulo: 'Libro de reclamaciones',
		ayuda: 'Registra una queja o sugerencia sobre la atención que recibiste de SUNAT.',
		cuando: 'Si tuviste un mal servicio o quieres proponer una mejora.',
		icon: 'message',
		perfiles: [P, E, A],
	},
	'emitir-gre': {
		titulo: 'Emitir guía de remisión electrónica',
		ayuda: 'Documento que acompaña el traslado de tus mercaderías de un lugar a otro.',
		cuando: 'Antes de transportar productos, por venta o entre tus almacenes.',
		icon: 'truck',
		perfiles: [E],
	},
	'consultar-gre': {
		titulo: 'Consultar guías de remisión',
		ayuda: 'Busca y descarga las guías de remisión que emitiste o recibiste.',
		cuando: 'Para comprobar un traslado o entregar la guía al transportista.',
		icon: 'search',
		perfiles: [E],
	},
	'exporta-facil': {
		titulo: 'Exporta Fácil',
		ayuda: 'Exporta por correo postal (Serpost) hasta US$ 7,500 por envío con trámites mínimos.',
		cuando: 'Si eres pequeño exportador y envías mercadería por correo.',
		icon: 'package',
		perfiles: [P, E, A],
	},
	'importa-facil': {
		titulo: 'Importa Fácil',
		ayuda: 'Consulta el estado de los paquetes que compraste en el extranjero y llegaron por correo.',
		cuando: 'Si hiciste una compra internacional y quieres saber si debes pagar impuestos.',
		icon: 'package',
		perfiles: [P, E, A],
	},
	'servicio-receptor': {
		titulo: 'Servicio web receptor',
		ayuda: 'Canal para que los sistemas de tu empresa envíen archivos de declaraciones aduaneras a SUNAT.',
		cuando: 'Si eres agente de aduanas o operador que transmite información masiva.',
		icon: 'network',
		perfiles: [A],
	},
	'designacion-almacen': {
		titulo: 'Designar almacén o terminal',
		ayuda: 'Elige el depósito temporal o terminal portuario donde llegará tu carga importada.',
		cuando: 'Antes de que llegue tu mercancía al país.',
		icon: 'building',
		perfiles: [A],
	},
	'drawback': {
		titulo: 'Solicitud de Drawback',
		ayuda: 'Pide la devolución de parte de los aranceles que pagaste por insumos usados en productos exportados.',
		cuando: 'Después de exportar productos fabricados con insumos importados.',
		icon: 'refund',
		perfiles: [A],
	},
	'registro-oea': {
		titulo: 'Certificación OEA',
		ayuda: 'Solicita ser Operador Económico Autorizado: un sello de confianza que agiliza tus despachos.',
		cuando: 'Si tu empresa opera con frecuencia en comercio exterior.',
		icon: 'shield-check',
		perfiles: [A],
	},
	'despacho-garantizado': {
		titulo: 'Cuenta corriente - Despacho garantizado',
		ayuda: 'Revisa el saldo de las garantías que respaldan tus despachos aduaneros.',
		cuando: 'Antes de numerar una declaración con despacho garantizado.',
		icon: 'credit-card',
		perfiles: [A],
	},
	'exportacion-simplificada': {
		titulo: 'Exportación simplificada',
		ayuda: 'Numera y consulta declaraciones de exportaciones de bajo valor (hasta US$ 5,000).',
		cuando: 'Si exportas montos pequeños sin necesidad de agente de aduanas.',
		icon: 'ship',
		perfiles: [A],
	},
	'transito-can': {
		titulo: 'Tránsito internacional CAN-ALADI',
		ayuda: 'Registra el paso de mercancías por Perú hacia otro país de la Comunidad Andina o ALADI.',
		cuando: 'Si transportas carga que cruza el territorio peruano sin quedarse.',
		icon: 'truck',
		perfiles: [A],
	},
	'mandato-electronico': {
		titulo: 'Mandato electrónico',
		ayuda: 'Autoriza a un agente de aduanas para que realice el despacho de tu mercancía.',
		cuando: 'Antes de que el agente numere la declaración a tu nombre.',
		icon: 'key',
		perfiles: [A],
	},
} satisfies Record<string, Tramite>;

export type TramiteId = keyof typeof tramites;

export const categorias: {
	id: string;
	titulo: string;
	descripcion: string;
	icon: IconName;
	tramites: TramiteId[];
}[] = [
	{
		id: 'ruc',
		titulo: 'Mi RUC y otros registros',
		descripcion: 'Tus datos registrados, trabajadores y reportes.',
		icon: 'id-card',
		tramites: ['ficha-ruc', 'modificar-ruc', 'abrir-negocio', 'iniciar-independiente', 'reporte-terceros', 'trabajador-hogar', 't-registro'],
	},
	{
		id: 'comprobantes',
		titulo: 'Comprobantes de pago',
		descripcion: 'Emite y consulta recibos, facturas y boletas.',
		icon: 'receipt',
		tramites: ['emitir-rhe', 'consultar-rhe', 'emitir-factura', 'emitir-boleta', 'consultar-facturas', 'validez-cpe'],
	},
	{
		id: 'declaraciones',
		titulo: 'Declaraciones y pagos',
		descripcion: 'Declara tus impuestos y revisa lo que pagaste.',
		icon: 'credit-card',
		tramites: ['declara-paga', 'consulta-dj', 'consulta-nps', 'plame', 'calculadora'],
	},
	{
		id: 'devoluciones',
		titulo: 'Devoluciones y compensaciones',
		descripcion: 'Recupera pagos en exceso o úsalos para otras deudas.',
		icon: 'refund',
		tramites: ['consulta-devoluciones', 'solicitud-devolucion', 'compensacion', 'suspension-4ta'],
	},
	{
		id: 'deudas',
		titulo: 'Deudas y fraccionamiento',
		descripcion: 'Revisa lo que debes y paga en cuotas.',
		icon: 'alert-triangle',
		tramites: ['valores-pendientes', 'fraccionamiento', 'embargos'],
	},
	{
		id: 'detracciones',
		titulo: 'Detracciones (SPOT)',
		descripcion: 'Tu cuenta de detracciones en el Banco de la Nación.',
		icon: 'landmark',
		tramites: ['consulta-detracciones', 'liberacion-fondos'],
	},
	{
		id: 'libros',
		titulo: 'Registros electrónicos (SIRE)',
		descripcion: 'Tus registros de ventas y compras del mes.',
		icon: 'book-open',
		tramites: ['sire-ventas', 'sire-compras'],
	},
	{
		id: 'guias',
		titulo: 'Guía de remisión electrónica',
		descripcion: 'Documentos para el traslado de mercadería.',
		icon: 'truck',
		tramites: ['emitir-gre', 'consultar-gre'],
	},
	{
		id: 'comunicaciones',
		titulo: 'Notificaciones, escritos y reclamos',
		descripcion: 'Tu comunicación oficial con SUNAT.',
		icon: 'inbox',
		tramites: ['buzon', 'escritos', 'expedientes', 'recursos-impugnatorios', 'quejas'],
	},
	{
		id: 'aduanas',
		titulo: 'Comercio exterior',
		descripcion: 'Importaciones, exportaciones y despachos.',
		icon: 'ship',
		tramites: [
			'exporta-facil',
			'importa-facil',
			'servicio-receptor',
			'designacion-almacen',
			'drawback',
			'registro-oea',
			'despacho-garantizado',
			'exportacion-simplificada',
			'transito-can',
			'mandato-electronico',
		],
	},
];

export const accesosDirectos: Record<Perfil, TramiteId[]> = {
	personas: [
		'emitir-rhe',
		'consultar-rhe',
		'validez-cpe',
		'declara-paga',
		'consulta-devoluciones',
		'suspension-4ta',
		'reporte-terceros',
		'modificar-ruc',
		'trabajador-hogar',
	],
	empresas: [
		'emitir-factura',
		'consultar-facturas',
		'declara-paga',
		'consulta-detracciones',
		't-registro',
		'ficha-ruc',
		'sire-ventas',
		'valores-pendientes',
	],
	aduanas: [
		'servicio-receptor',
		'designacion-almacen',
		'drawback',
		'registro-oea',
		'despacho-garantizado',
		'exporta-facil',
		'exportacion-simplificada',
		'transito-can',
	],
};
