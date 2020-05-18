
const socket = io('wss://le-18262636.bitzonte.com', {
    path: '/stocks'
});


//dict = {"AAPL": [], "FB": [], "SNAP": [], "IBM": [], "TWTR": []};
var dict_acciones = {};
var dict_empresas = {};
var dict_vol_stock = {};
var datos_tabla_stocks = [];



socket.emit('STOCKS');
socket.on("STOCKS", (data) => {
  for (var i = 0; i < data.length; i++) {
    dict_acciones[data[i].ticker] = [];
    dict_vol_stock[data[i].ticker] = 0;
    var grafico = document.createElement('div');
    console.log(`${data[i].ticker}`);
    grafico.setAttribute("id", `${data[i].ticker}`);
    content.appendChild(grafico);
	}
  socket.on('UPDATE', (data) => {
    //console.log(data);
    x = document.getElementById('ticker');
    x.innerHTML = data.ticker;
    y = document.getElementById('value');
    y.innerHTML = data.value;
    z = document.getElementById('time');
    z.innerHTML = data.time;
    dict_acciones[data.ticker].push([data.time, data.value]);
    for (var key in dict_acciones) {
      if(data.ticker == key){
        drawChart2(dict_acciones[data.ticker], key);
      };
    };
  } );
  for (var key in dict_acciones) {
    datos_tabla_stocks.push({"name": key, "volume": dict_vol_stock[key]});
  };
  socket.on('BUY', (data) => {
    dict_vol_stock[data.ticker] += data.volume;
  } );
  socket.on('SELL', (data) => {
    dict_vol_stock[data.ticker] += data.volume;
    console.log(dict_vol_stock[data.ticker]);
    console.log(dict_vol_stock[data.ticker]);
  });
  console.log(datos_tabla_stocks);
  var tbody = document.getElementById('tbody');
  var tr = "<tr>";
  let suma = 0;
  for (var i = 0; i < datos_tabla_stocks.length; i++) {
    console.log("volumen", datos_tabla_stocks[i].volume);
    suma += datos_tabla_stocks[i].volume;
    console.log("suma", suma);
    tr += "<td>" + datos_tabla_stocks[i].name + "</td>" + "<td>$" + datos_tabla_stocks[i].volume + "</td></tr>";
    tbody.innerHTML = tr;
  };
  //console.log(datos_tabla_stocks);
  // let table = document.querySelector("table");
  // let dataa = Object.keys(datos_tabla_stocks[0]);
  // generateTableHead(table, dataa);
  // generateTable(table, datos_tabla_stocks);



});

console.log(dict_acciones);



function desconectar() {
  socket.emit("manual-disconnection", socket.id);
  socket.close();
  console.log("Socket Closed ");
}


function conectar() {
  socket.emit("manual-connection", socket.id);
  socket.open();
  console.log("Socket open ");
}


google.charts.load('current', {'packages':['line']});
      //google.charts.setOnLoadCallback(drawChart);

function drawChart(datos) {

      var data = new google.visualization.DataTable();
      data.addColumn('number', 'time');
      data.addColumn('number', 'Value');
      data.addRows(
        datos
      );
      var options = {
        chart: {
          title: 'Grafico'
        },
        width: 900,
        height: 500
      };
      var chart = new google.charts.Line(document.getElementById('linechart_material'));
      chart.draw(data, google.charts.Line.convertOptions(options));
}

function drawChart2(datos, etiqueta) {

      var data = new google.visualization.DataTable();
      data.addColumn('number', 'time');
      data.addColumn('number', 'Value');
      data.addRows(
        datos
      );
      var options = {
        chart: {
          title: etiqueta
        },
        width: 400,
        height: 300
      };
      var chart = new google.charts.Line(document.getElementById(etiqueta));
      chart.draw(data, google.charts.Line.convertOptions(options));
}

function generateTableHead(table, data) {
  let thead = table.createTHead();
  let row = thead.insertRow();
  for (let key of data) {
    let th = document.createElement("th");
    let text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
}

function generateTable(table, data, id) {
  for (let element of data) {
    let row = table.insertRow();
    for (key in element) {
      let cell = row.insertCell();
      let text = document.createTextNode(element[key]);
      text.setAttribute("id", `${id}`);
      cell.appendChild(text);
    }
  }
}
