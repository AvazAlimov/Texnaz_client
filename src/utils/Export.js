import xlsx from 'xlsx';
import FileSaver from 'file-saver';

function toOctet(file) {
  const buffer = new ArrayBuffer(file.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < file.length; i += 1) {
    // eslint-disable-next-line no-bitwise
    view[i] = file.charCodeAt(i) & 0xff;
  }
  return buffer;
}

export default {
  priceToExcel(jsonData, filename) {
    const workbook = xlsx.utils.book_new();
    const rows = [
      ['Наименование', 'Фасовка', 'Перечисление', 'Комби', 'Комби', 'Наличными'],
      ['', '', '', 'Цена 1', 'Цена 2'],
    ];
    jsonData.forEach((element) => {
      const columns = [
        element.name,
        element.packing,
        element.firstPrice,
        element.mixPriceNonCash,
        element.mixPriceCash,
        element.secondPrice,
      ];
      rows.push(columns);
    });
    const sheet = xlsx.utils.aoa_to_sheet(rows);
    sheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } },
      { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } },
      { s: { r: 0, c: 2 }, e: { r: 1, c: 2 } },
      { s: { r: 0, c: 3 }, e: { r: 0, c: 4 } },
      { s: { r: 0, c: 5 }, e: { r: 1, c: 5 } },
    ];
    xlsx.utils.book_append_sheet(workbook, sheet, filename);
    const file = xlsx.write(workbook, { bookType: 'xlsx', bookSST: true, type: 'binary' });
    FileSaver.saveAs(new Blob([toOctet(file)], { type: 'application/octet-stream' }), `${filename}.xlsx`);
  },
  statisticsPDZToExcel(jsonData, filename) {
    const workbook = xlsx.utils.book_new();
    const rows = [
      ['Территория', 'Область', 'Имя менеджера',
        'Имя клиентa', '<30', '<60', '<90', '<180', '180+'],
    ];
    jsonData.filter(({ clientName }) => clientName !== '-').forEach((element) => {
      const columns = [
        element.territory,
        element.province,
        element.managerName,
        element.clientName,
        element.lessThirty,
        element.lessSixth,
        element.lessNinety,
        element.lessHundreds,
        element.moreHundreds,
      ];
      rows.push(columns);
    });
    const sheet = xlsx.utils.aoa_to_sheet(rows);
    xlsx.utils.book_append_sheet(workbook, sheet, filename);
    const file = xlsx.write(workbook, { bookType: 'xlsx', bookSST: true, type: 'binary' });
    FileSaver.saveAs(new Blob([toOctet(file)], { type: 'application/octet-stream' }), `${filename}.xlsx`);
  },
  statisticsTotalToExcel(jsonData, headers, filename) {
    const workbook = xlsx.utils.book_new();
    const rows = [headers];
    jsonData.forEach((element) => {
      const columns = [
        element.province,
        element.ceo,
        element.controller,
        element.manager,
        element.clients,
      ];
      headers.forEach((header) => {
        const found = Object.keys(element).find(key => key === header);
        if (found) {
          columns.push(element[header]);
        }
      });
      rows.push(columns);
    });
    const sheet = xlsx.utils.aoa_to_sheet(rows);
    xlsx.utils.book_append_sheet(workbook, sheet, filename);
    const file = xlsx.write(workbook, { bookType: 'xlsx', bookSST: true, type: 'binary' });
    FileSaver.saveAs(new Blob([toOctet(file)], { type: 'application/octet-stream' }), `${filename}.xlsx`);
  },
  statisticsIncomeToExcel(jsonData, headers, filename) {
    const workbook = xlsx.utils.book_new();
    const rows = [headers];
    jsonData.forEach((element) => {
      const columns = [
        element.province,
        element.ceo,
        element.numSupervisors,
        element.numManagers,
        element.numClients,
        element.numActiveClients,
        element.totalAmount,
      ];
      rows.push(columns);
    });
    const sheet = xlsx.utils.aoa_to_sheet(rows);
    xlsx.utils.book_append_sheet(workbook, sheet, filename);
    const file = xlsx.write(workbook, { bookType: 'xlsx', bookSST: true, type: 'binary' });
    FileSaver.saveAs(new Blob([toOctet(file)], { type: 'application/octet-stream' }), `${filename}.xlsx`);
  },
  statisticsManyToExcel(jsonData, headers, filename) {
    const workbook = xlsx.utils.book_new();
    const rows = [headers];
    jsonData.forEach((element) => {
      const columns = [
        element.territory,
        element.province,
        element.name,
        element.role,
        element.sum,
      ];
      rows.push(columns);
    });
    const sheet = xlsx.utils.aoa_to_sheet(rows);
    xlsx.utils.book_append_sheet(workbook, sheet, filename);
    const file = xlsx.write(workbook, { bookType: 'xlsx', bookSST: true, type: 'binary' });
    FileSaver.saveAs(new Blob([toOctet(file)], { type: 'application/octet-stream' }), `${filename}.xlsx`);
  },
};
