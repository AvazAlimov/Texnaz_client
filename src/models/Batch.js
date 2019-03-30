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

    // Products
    // Currency Official
    // Currency 2
    // Currency 3
    // Conversion %
    // Bank Transfer %
    // Income tax
    /* Computed */
    // --- expanses_cash_per_unit
    // --- expanses_non_cash_per_unit
    // --- transport_cash_per_unit
    // --- transport_non_cash_per_unit

    // Products
    // --- Name
    // --- Supplier
    // --- Type
    // --- Packing
    // --- Color
    // --- Contract Price
    // --- Customs Price
    // --- Excise
    // --- Tax
    // --- VAT
    // --- Cleaning
    // --- Excise
    // --- Profitability %
    /* --- Computed */
    // --- --- Contract Price per Unit
    // --- --- Customs Price per Unit
    // --- --- Weight
    // --- --- Exsice value = Customs Price * Excise
    // --- --- Tax value = Customs Price * Tax
    // --- --- VAT value = VAT * (expanses_non_cash_per_unit + Customs Price + Excise value + Tax Value)
    // --- --- Cleaning value = Cleaning * (expanses_non_cash_per_unit + Customs Price + Excise value + Tax Value)
    // --- --- Cost Price Non Cash = expanses_non_cash_per_unit + Customs Price + Excise Value + Tax Value + Cleaning Value
    // --- --- Non cash Expanse = (Total: non-cash delivery price) / Currency Official
    // --- --- Profitability value = (Cost Price Non Cash + Non cash Expanse) * (Profitability %) * (1 + Period Expanses Rate)
    // --- --- Income Tax Value = Profitability value * Income Tax
  }
}
