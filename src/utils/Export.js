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
};
