export default function CalcularTarifa({ tarifa, minutos }) {
  const horas = minutos / 60;
  return Math.round(horas * tarifa.precioPorHora * 100) / 100;
}