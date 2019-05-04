import { json2excel } from 'js2excel';

export default {
  downloadAsExcel(jsonData, filename) {
    json2excel({
      data: jsonData,
      name: filename,
    });
  },
};
