
const socket = io('wss://le-18262636.bitzonte.com', {
    path: '/stocks'
});

function desconectar() {
    //socket.disconnect()
    socket.emit("manual-disconnection", socket.id);
    socket.close();

};
function conectar() {
    socket.emit("manual-connection", socket.id);
    socket.open();
};

socket.on('EXCHANGES', (data) => {
  //console.log(data);
  x = document.getElementById('stocks');
  x.innerHTML = data.ticker;

} );


dict = {"AAPL": [], "FB": [], "SNAP": [], "IBM": [], "TWTR": []};

socket.on('UPDATE', (data) => {
  //console.log(data);
  x = document.getElementById('ticker');
  x.innerHTML = data.ticker;
  y = document.getElementById('value');
  y.innerHTML = data.value;
  z = document.getElementById('time');
  z.innerHTML = data.time;

  dict[data.ticker].push([data.time, data.value]);
  if(data.ticker == "FB"){
    drawChart(dict[data.ticker]);
  };


  //drawChart(dict[data.ticker]);



  //para desconectar socket.disconnect()
  //para conectar socket.connect()
} );

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
