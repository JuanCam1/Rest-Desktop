import { toZonedTime } from "date-fns-tz";

export const fechaActual = () => {
	const timeZone = "America/Bogota";
	const now = toZonedTime(new Date(), timeZone);
	return now;
};

export const obtenerFechaYHoraActual = (nowDate: Date) => {
	const año = nowDate.getFullYear();
	const mes = String(nowDate.getMonth() + 1).padStart(2, "0");
	const dia = String(nowDate.getDate()).padStart(2, "0");

	const fecha = `${año}-${mes}-${dia}`;

	const horas = String(nowDate.getHours()).padStart(2, "0");
	const minutos = String(nowDate.getMinutes()).padStart(2, "0");

	const hora = `${horas}:${minutos}`;

	return { fecha, hora };
};
