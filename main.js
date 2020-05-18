
const socket = io('wss://le-18262636.bitzonte.com', {
    path: '/stocks'
});


//dict = {"AAPL": [], "FB": [], "SNAP": [], "IBM": [], "TWTR": []};
var dict_acciones = {};
dict_empresas = {};
var lista_stocks = [1,2,3,4,5];

socket.emit('STOCKS');
socket.on("STOCKS", (data) => {
  for (var i = 0; i < data.length; i++) {
    dict_acciones[data[i].ticker] = [];
    var grafico = document.createElement('div');
    console.log(`${data[i].ticker}`);
    grafico.setAttribute("id", `${data[i].ticker}`);
    content.appendChild(grafico);
	}
  socket.on('UPDATE', (data) => {
    console.log(data);
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
        width: 270,
        height: 150
      };
      var chart = new google.charts.Line(document.getElementById(etiqueta));
      chart.draw(data, google.charts.Line.convertOptions(options));
}
