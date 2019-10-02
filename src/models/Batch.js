/* eslint-disable camelcase */
export default class Batch {
  constructor({
    id, name, number, weight, date, transport_cash, transport_non_cash, warehouse, supply,
  }) {
    this.id = id;
    this.name = name;
    this.number = number;
    this.weight = weight;
    this.date = date;
    this.transport_cash = transport_cash;
    this.transport_non_cash = transport_non_cash;
    this.warehouse = warehouse;
    this.supply = supply;
  }
}
