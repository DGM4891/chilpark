export default async function ProcesarPago({ total, metodo }) {
  return { total, metodo, estado: 'pendiente' };
}