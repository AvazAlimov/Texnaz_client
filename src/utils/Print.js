import vue from 'vue';

export default ({
  client, manager, warehouse, number, createdAt, items,
}, price) => {
  const print = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
  print.document.write(`
    <!DOCTYPE html>
      <html>
        <head>
          <style>
            body{
              padding: 10px;
            }
            table {
              margin: 2%;
            }
            table, th, td {
              border: 1px solid black;
              border-collapse: collapse;
            }
            th, td {
              padding: 5px;
              text-align: left;
            }
            .Container {
              display: flex;
              flex-direction: column;
            }
            .title {
              width: 100%;
              text-align: center;
            }
            span {
              margin: 1%;
            }
            .hand {
              margin-top: 2%;
              display: flex;
              justify-content: space-between;
            }
            @page { size: auto;  margin: 0mm; }
          </style>
        </head>
        <body>
          <span>${vue.moment(createdAt).format('DD-MM-YYYY')}</span>
          <div class='Container'>
            <span class='title'>Реализация товарной номенклатуры № ${number}</span>
            <span>Склад: ${warehouse.name}</span>
            <span>Менеджер: ${manager.name}</span>
            <span>Клиент: ${client.icc} - ${client.name}</span>
            <table>
              <tr>
                <th>№</th>
                <th>Инфо</th>
                <th>Наименование товара</th>
                <th>Фасовка</th>
                <th>Ед.изм</th>
                <th>Количество</th>
                <th>Цена</th>
                <th>Скидка</th>
                <th>Сумма с учетом скидки</th>
              </tr>
              ${items.map(item => `
              <tr>
                <td>${item.stock.product.code}</td>
                <td>${item.stock.product.tags[0].name}</td>
                <td>${item.stock.product.name}</td>
                <td>${item.stock.product.packing}</td>
                <td>${item.stock.product.typeUnit.name}</td>
                <td>${item.quantity}</td>
                <td>${price(item)[0]}</td>
                <td>${item.discount}%</td>
                <td>${price(item)[1]}</td>
              </tr>
              `).join('\n')}
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>${items.map(item => price(item)[1]).reduce((a, b) => a + b, 0)}</td>
            </table>
            <div class='hand'>
              <span>Отпустил ______________________</span>
              <span>Принял ______________________</span>
            <div>
          </div>
        </body>
      </html>`);
  print.document.close();
  print.focus();
  print.print();
  print.close();
};
