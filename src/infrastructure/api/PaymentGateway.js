export default class PaymentGateway {
  async charge({ amount, method }) {
    return { status: 'ok', amount, method };
  }
}