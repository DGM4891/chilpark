export default class Transaccion {
  constructor({ id, placa, espacioId, inicio, fin, total }) {
    this.id = id;
    this.placa = placa;
    this.espacioId = espacioId;
    this.inicio = inicio;
    this.fin = fin;
    this.total = total;
  }
}