
$( document ).ready(function() {

var gauges=[];
var myChart

var lecturas_filtro = [];
var horas_filtro = [];
var tablaGenerada=false;


// CONECCIÓN MQTT
const clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8)


const options = {
  keepalive: 60,
  clientId: clientId,
  protocolId: 'MQTT',
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  will: {
    topic: 'WillMsg',
    payload: 'Connection Closed abnormally..!',
    qos: 0,
    retain: false
  },
}
const host = 'ws://192.168.97.36:9001' 
console.log('Connecting mqtt client')
const client = mqtt.connect(host, options)
client.on('error', (err) => {
  console.log('Connection error: ', err)
  //client.end()
})

client.on('reconnect', () => {
  console.log('Reconnecting...')
})



function publicar(topico, mensaje) {
  // Publicar el mensaje en el tópico especificado
  client.publish(topico, mensaje, function (error) {
    if (error) {
      console.error('Error al publicar mensaje:', error);
    } else {
      console.log('Mensaje publicado correctamente');
    }
  });
}







client.on('message', (topic, message, packet) => {
  const now = new Date();
  console.log(now); // muestra la fecha y hora actuales en formato de cadena


  // Para obtener solo la hora actual en formato de cadena
  const horaActual = now.toLocaleTimeString();
  console.log(horaActual);
  let mensaje;

 try {
  mensaje = JSON.parse(message);
} catch (error) {
  console.error('Error en el parseo del mensaje:', error);
  console.log('Objeto JSON dañado:', message); // Impresión del objeto JSON dañado
  // Aquí puedes realizar alguna acción para manejar el error, como enviar una notificación o registrar en un archivo de log.
  // También puedes definir un valor por defecto para la variable 'mensaje', en caso de que el parseo falle.
  mensaje = { error: 'No se pudo parsear el mensaje' };
  return;
}


if (tablaGenerada == true) {
  if (topic === localStorage.getItem('id_grupo')) {
    console.log(JSON.stringify(mensaje, null, 2));
    console.log(tablaGenerada);
    for (let i = 0; i < mensaje.nodos.length; i++) {
      if (mensaje.nodos[i].id_nodo === localStorage.getItem('id_nodo')) {
        console.log("Acciones del nodo:", mensaje.nodos[i].accionadores);


        for (let j = 0; j < mensaje.nodos[i].accionadores.length; j++) {
          const accionador = mensaje.nodos[i].accionadores[j];
          console.log("Estado del accionador", accionador.id_accionador, ":", accionador.status);

          // Obtener el índice de la fila correspondiente al accionador
          var rowIndex = j; // Índice de la fila, puedes ajustarlo según tus necesidades

          // Obtener el nuevo estado del accionador
          var nuevoStatus = accionador.status;

          // Actualizar la celda "status" de la tabla
          $('#tabla_accionadores').bootstrapTable('updateCell', {
            index: rowIndex,
            field: 'status',
            value: nuevoStatus
          });
        }
      }
    }
  }
}


 
if (tablaGenerada === true) {
  if (topic === localStorage.getItem('id_grupo')) {
    console.log(JSON.stringify(mensaje, null, 2));
    console.log(tablaGenerada);
    for (let i = 0; i < mensaje.nodos.length; i++) {
      if (mensaje.nodos[i].id_nodo === localStorage.getItem('id_nodo')) {
        console.log("Nodo:", mensaje.nodos[i].id_nodo);

        if (mensaje.nodos[i].sensores_estado) {
          console.log("El nodo tiene sensores_estado:", mensaje.nodos[i].sensores_estado);


          for (let j = 0; j < mensaje.nodos[i].sensores_estado.length; j++) {
            const sensorEstado = mensaje.nodos[i].sensores_estado[j];
            console.log("Estado del sensor", sensorEstado.id_sensor_estado, ":", sensorEstado.estado);
/*
            // Obtener el índice de la fila correspondiente al sensor_estado
            var rowIndex = j; // Índice de la fila, puedes ajustarlo según tus necesidades

            // Obtener el nuevo estado del sensor_estado
            var nuevoStatus = sensorEstado.estado;

            // Actualizar la celda "status" de la tabla
            $('#tabla_sensores_estado').bootstrapTable('updateCell', {
              index: rowIndex,
              field: 'status',
              value: nuevoStatus
            });
*/

          }

        } else {
          console.log("El nodo no tiene sensores_estado.");
        }
      }
    }
  }
}


  if (gauges.length > 0) {
    var arreglo_variables = localStorage.getItem("variables").split(",");
    var numero = arreglo_variables.length;
    arreglo_variables = arreglo_variables.map(function(elemento) {
      return elemento.trim();
    });

    if (topic == localStorage.getItem('id_grupo')) {
     // console.log(mensaje);

      for (let i = 0; i < mensaje.nodos.length; i++) {
        if (mensaje.nodos[i].id_nodo === localStorage.getItem('id_nodo')) {
          let sensores = mensaje.nodos[i].sensores;
          for (let j = 0; j < sensores.length; j++) {
            if (sensores[j].modelo === localStorage.getItem('modelo_sensor')) {
              let lecturas = sensores[j].lecturas;
              for (let k = 0; k < arreglo_variables.length; k++) {
                let variable = arreglo_variables[k];
                if (lecturas.hasOwnProperty(variable)) {
                  let gaugeId = "gauge" + localStorage.getItem('id_sensor') + localStorage.getItem('modelo_sensor') + variable;
                  for (let l = 0; l < gauges.length; l++) {
                    if (gauges[l].id === gaugeId) {
                      gauges[l].value = lecturas[variable];
                      if (isPlaying) {
                        if (myChart.config.options.scales.yAxes[0].scaleLabel.labelString === variable) {
                          lecturas_filtro.push(lecturas[variable]);
                          horas_filtro.push(horaActual);
                          myChart.update();
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }



});




var directorios=[];

let isPlaying = false; 



function crear_chart(conf){
lecturas_filtro = [];
horas_filtro = [];
 
// Obtener la fecha actual
var fechaActual = new Date();

// Obtener los componentes de la fecha
var dia = ("0" + fechaActual.getDate()).slice(-2); // Agrega un cero inicial si es necesario
var mes = ("0" + (fechaActual.getMonth() + 1)).slice(-2); // Agrega un cero inicial si es necesario
var año = fechaActual.getFullYear();

// Formatear la fecha como texto
var fechaFormateada = año+ '-' + mes + '-' + dia;

// Mostrar la fecha actual
console.log('La fecha actual es: ' + fechaFormateada);


var arr = conf.split("/");

var conf_object= {
  id_nodo: arr[0],
  modelo_sensor: arr[1],
  tipo_sensor: arr[2],
  variable: arr[3],
  fecha:fechaFormateada
};
var lecturasEncontradas = [];
var horasEncontradas = [];



$.ajax({ 
  url: '/lecturas_grupo',
  method: 'POST',
  dataType: 'json',
  contentType: 'application/json',
  data: JSON.stringify({ fecha: fechaFormateada}),
  beforeSend: function() {
    console.log('Enviando datos al servidor...');
  }
}).done(function(respuesta) {
  console.log('Respuesta del servidor:', respuesta);
  respuesta.forEach(buscarKey);



let trash = document.createElement("i");
trash.classList.add("fa", "fa-trash");
trash.setAttribute("aria-hidden", "true");
trash.onclick = function() {
  alert("Haz hecho clic en el icono!");
};

let play = document.createElement("i");
play.classList.add("fa", "fa-play");
play.setAttribute("aria-hidden", "true");

// Variable global para almacenar el estado del botón "play"

var select = document.getElementById('monitor2');
var chartconteiner= document.createElement("div")
chartconteiner.setAttribute("class","chart-container")
var chart = document.createElement("canvas")
chart.setAttribute("id","myChart")
chart.setAttribute("height","60")
chart.setAttribute("width","100")
chartconteiner.appendChild(chart)
chartconteiner.appendChild(trash)
chartconteiner.appendChild(document.createTextNode('\u00A0')); // Agregar espacio en blanco
chartconteiner.appendChild(play)

chartconteiner.onclick = function(event) {
  // Verificar si se hizo clic en el elemento "play"
  if (event.target === play) {
    // Obtener el padre del elemento "play"
    const parent = play.parentNode;

    // Crear el elemento "stop"
    const stop = document.createElement("i");
    stop.classList.add("fa", "fa-stop");
    stop.setAttribute("aria-hidden", "true");

    // Reemplazar "play" por "stop" en el padre
    parent.replaceChild(stop, play);

    // Cambiar el estado a "true"
    isPlaying = true;
    console.log(isPlaying) 
    // Agregar función onclick para el elemento "stop"
    stop.onclick = function() {
      // Obtener el padre del elemento "stop"
      const parent = stop.parentNode;

      // Crear el elemento "play"
      const newPlay = document.createElement("i");
      newPlay.classList.add("fa", "fa-play");
      newPlay.setAttribute("aria-hidden", "true");

      // Reemplazar "stop" por "play" en el padre
      parent.replaceChild(newPlay, stop);

      // Cambiar el estado a "false"
      isPlaying = false;
      console.log(isPlaying) 

      // Agregar evento onclick para el elemento "play"
      newPlay.onclick = function() {
        // Reemplazar "play" por "stop" en el padre
        parent.replaceChild(stop, newPlay);

        // Cambiar el estado a "true"
        isPlaying = true;
        console.log(isPlaying) 
      };
    };
  }
};

select.appendChild(chartconteiner);

$('#tabla_datos').bootstrapTable({
  pagination: false,
  search: false,
  pageSize: 4,
  columns: [
    {
      field: 'fecha_reporte',
      title: 'fecha_reporte'
    },
    {
      field: 'cantidad_datos',
      title: 'cantidad_datos'
    },{
      field: 'archivo_reporte',
      title: 'archivo_reporte'
    }
  ],
  data: directorios
});


//$tabla_sensores_estado.bootstrapTable('load', respuesta[0].nodos_grupo[index].sensores_estado)


var ctx = document.getElementById('myChart');
window.chartColors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(231,233,237)'
};

var config = {
  type: 'line',
  data: {
    labels: horas_filtro,
    datasets: [{
      label: conf,
      backgroundColor: window.chartColors.red,
      borderColor: window.chartColors.red,
      data: lecturas_filtro,  backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],  borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1,
      fill: true,
    }]
  },
  options: {
    responsive: true,
    title:{
      display:true,
      text:conf_object.fecha
    },
   hover: {
      mode: 'nearest',
      intersect: true
    },
    scales: {
      xAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Horas'
        }
      }],
      yAxes: [{
        display: true,
        scaleLabel: {
          display: true,
           labelString:conf_object.variable
        },
      }]
    }
  }
};

 myChart = new Chart(ctx, config);

horas_filtro.push(horasEncontradas[0]); // agregar la primera lectura filtrada al nuevo array
lecturas_filtro.push(lecturasEncontradas[0]); // agregar la primera lectura filtrada al nuevo array
let ultimaLectura = horasEncontradas[0].substring(0, 2); // obtener la primera lectura correctamente

for (let i = 1; i < horasEncontradas.length; i++) { // empezar en i=1 para no comparar la primera lectura
  let lecturaActual = horasEncontradas[i].substring(0, 2);
  if (lecturaActual !== ultimaLectura) { // si la lectura actual es diferente a la última filtrada
    if (lecturaActual > ultimaLectura) { // asegurarse de que la lectura actual sea más reciente que la última filtrada
      horas_filtro.push(horasEncontradas[i]); // agregar la lectura actual al array filtrado
      lecturas_filtro.push(lecturasEncontradas[i]);
      ultimaLectura = lecturaActual; // actualizar la última lectura filtrada
    }
  }
}

//console.log(horas_filtro);
//console.log(lecturas_filtro);
  myChart.update()

  // Aquí puedes hacer algo con la respuesta del servidor, como actualizar la página
}).fail(function(jqXHR, textStatus, errorThrown) {
  console.error('Error al enviar los datos:', textStatus, errorThrown);
});

function buscarKey(objeto) {
  const nodos = objeto.nodos;
  for (let i = 0; i < nodos.length; i++) {
    const nodo = nodos[i];
    if (nodo.id_nodo === conf_object.id_nodo) {
      const sensores = nodo.sensores;
      for (let j = 0; j < sensores.length; j++) {
        const lecturas = sensores[j].lecturas;
        if (lecturas.hasOwnProperty(conf_object.variable)) {
          lecturasEncontradas.push(lecturas[conf_object.variable]);
          horasEncontradas.push(objeto.rtc_server.hora); // Obtiene la hora de rtc_server
        }
      }
    }
  }
}
console.log(lecturasEncontradas)
console.log(horasEncontradas)
// Buscamos la key en cada objeto del array

console.log(conf_object);

}








// declara la variable global fuera de cualquier función



//FUNCION CREAR TABLAS+CANVAS+GAUGES
function creargauges()
{

//alert("holaa"+variables_sensor)
var arreglo_variables = localStorage.getItem("variables").split(",");
var numero = arreglo_variables.length;
arreglo_variables = arreglo_variables.map(function(elemento) {
  return elemento.trim();
});

//alert(numero)

const parentElement = document.getElementById('monitor');
    while (parentElement.firstChild) {
      parentElement.removeChild(parentElement.firstChild);
    }

var tags=[];

for ( var item = 0; item < numero ; item++) {
tags.push(name+"V"+item)
}
//alert(tags)

let tags2=arreglo_variables

    let tags3=["nodo1","nodo2","nodo3"]
    let sensores=tags2


    const canales=[];
    //console.log('Respuesta recibida:',respuesta)
//console.log(respuesta)
//console.log(respuesta.length)

for ( var item = 0; item < numero ; item++) {
//copia(respuesta[item]);
            var canv = document.createElement("canvas");
            var division= document.createElement("div");
            division.setAttribute("class","align-center")
            division.setAttribute("style" , "display:inline-block") 
            var salto= document.createElement("br")
            var porte= document.createElement("h1")
            var newContent3 = document.createTextNode(tags[item]);
            porte.appendChild(newContent3)
            document.getElementById("monitor").appendChild(division);
            canv.setAttribute('width', 400);
            canv.setAttribute('height', 400);
            canv.setAttribute('id', arreglo_variables[item]);
            canales.push("nodo1")     
          
var body = document.getElementsByTagName("body")[0];



var tabla   = document.createElement("table");
tabla.setAttribute("id",localStorage.getItem("id_nodo")+"/"+localStorage.getItem("id_sensor")+"/"+localStorage.getItem("modelo_sensor")+"/"+arreglo_variables[item])


 tabla.addEventListener("click", function(event) {
  console.log("Tabla clickeada: " + event.currentTarget.id);

  var select = document.getElementById('monitor2');

while (select.firstChild) {
  select.removeChild(select.firstChild);
}
  crear_chart(event.currentTarget.id)
});

var tblBody = document.createElement("tbody");
var hilera1 = document.createElement("tr");
var textoCelda = document.createTextNode(tags[item]);  
var celda = document.createElement("td");

led=document.createElement("div")
led.setAttribute("class","red led")
led.setAttribute("id","indicadornodo1")

celda.appendChild(textoCelda);
//celda.appendChild(led)
hilera1.appendChild(celda);


container=document.createElement("div")
container.setAttribute("class","container")

row=document.createElement("div")
row.setAttribute("class","row")

col1=document.createElement("div")
col1.setAttribute("class","col-sm")
col1.setAttribute("aling" ,"right")
col1.appendChild(textoCelda)


col2=document.createElement("div")
col2.setAttribute("class","col-sm")
col2.setAttribute("aling" ,"right")
col2.appendChild(led)

row.appendChild(col1)
row.appendChild(col2)

container.appendChild(row)

celda.appendChild(row)

var hilera2 = document.createElement("tr");
var celda2= document.createElement("td");
var textoCelda = document.createTextNode("");
celda2.appendChild(textoCelda);
celda2.appendChild(canv)
celda2.appendChild(textoCelda);
hilera2.appendChild(celda2)
var hilera3 = document.createElement("tr");
var celda3= document.createElement("td");
var textoCelda3= document.createTextNode(tags2[item]);
celda3.appendChild(textoCelda3);
hilera3.appendChild(celda3)

tblBody.appendChild(hilera1);
tblBody.appendChild(hilera2);
tblBody.appendChild(hilera3);
tabla.appendChild(tblBody);
body.appendChild(tabla);
tabla.setAttribute("border", "2");
division.appendChild(tabla)
// Crear el elemento button

}


 let canales2=[];
canales2=canales;

for ( var item = 0; item < numero; item++) {
      
//alert(arreglo_variables[item])

gauges[item] = new RadialGauge({ 
  renderTo: arreglo_variables[item],
  width: 180,
  height: 210, 
  units: arreglo_variables[item],
  id: "gauge-" + item // Agrega un ID único usando el valor de "item"
}).draw();

//plomo
gauges[item].id = "gauge"+localStorage.getItem("id_sensor")+localStorage.getItem("modelo_sensor")+arreglo_variables[item]; // Establecer el ID después de crear el objeto

        }
for ( var item = 0; item < gauges.length ; item++) {
//alert("identificador "+ gauges[item].id)
}
  //alert("Cantidad de Relojes "+gauges.length)     
function mqtt2(){
alert("hola")

}



}
//FIN DE LA FUNCION CREAR GAUGES



$.ajax({ 
    url:'/grupos',
    method:'POST',
    datatype:"JSON",
    contentType: "application/json",
    beforeSend: function(data){
      console.log('Enviando...',data)
    },
  }).done(function(respuesta){
console.log("Lista de grupos")
console.log(respuesta)
//let resJson=JSON.parse(respuesta);
let restring=JSON.stringify(respuesta)
console.log(restring)
//console.log(respuesta[0].nodos_grupo)


//alert(respuesta.length)

// SUBCRIBCIÖN CANALES POR GRUPO_ID
client.on('connect', () => {
  console.log('Client connected:' + clientId)

  for (let i = 0; i < respuesta.length; i++) {
   client.subscribe(respuesta[i].id_grupo, { qos: 0 })
  
}

  
})
//TABLAS
var $tabla_grupos = $('#tabla_grupos')
var $tabla_nodos = $('#tabla_nodos')
var $tabla_sensores = $('#tabla_sensores')
var $tabla_accionadores = $('#tabla_accionadores')
//var $tabla_sensores_estado = $('#tabla_sensores_estado')

  $('#tabla_grupos').bootstrapTable({ 

  onClickRow:function (row,$element) {
 
localStorage.setItem('id_grupo', row.id_grupo);
//alert(localStorage.getItem('id_grupo'))
localStorage.setItem('variables_sensor', row.variables_sensor);
//alert("holaa"+localStorage.getItem('variables_sensor'));
 $('#tabla_nodos').bootstrapTable({ 

  onClickRow:function (row,$element) {
localStorage.setItem('id_nodo', row.id_nodo);
//alert(localStorage.getItem('id_nodo'))
var index = $element.data('index');
    alert(index)
$('#tabla_sensores').bootstrapTable({
  onClickRow: function(row, $element) {

     localStorage.setItem('id_sensor', row.id_sensor);
   //  alert(localStorage.getItem('id_sensor'));
 localStorage.setItem('modelo_sensor', row.modelo_sensor);
     //alert(localStorage.getItem('modelo_sensor'));


    var variables = Object.keys(row.variables_sensor).join(', ');
   //alert(variables);
    localStorage.setItem("variables",variables)
   creargauges()
   
    // Aquí puedes hacer lo que necesites con las variables
  },
  pagination: false,
  search: false,
  pageSize: 4,
  columns: [{
      field: 'id_sensor',
      title: 'id_sensor'
    },{
      field: 'modelo_sensor',
      title: 'modelo_sensor'
    },
    {
      field: 'variables_sensor',
      title: 'variables_sensor',
      formatter: function(value) {
        var arreglo= Object.keys(value).join(', ');

var strWithoutSpaces = arreglo.replace(/ /g, "");



        return strWithoutSpaces;
      }
    }
  ],
  data: directorios
});


 tablaGenerada = true; // Establecer la bandera como verdadera
$('#tabla_accionadores').bootstrapTable({
  onClickRow: function(row, $element) {
    // Obtener los datos necesarios del objeto 'row'
    var idAccionador = row.id_accionador;
    var accionAccionador = row.accion_accionador;
    var status = row.status;
    
    // Crear el contenido dinámico de la ventana modal
    var modalContent = '<div class="modal-header">' +
      '<h5 class="modal-title">Detalles del Accionador</h5>' +
      '<button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>' +
      '</div>' +
      '<div class="modal-body">' +
      '<p>ID: ' + idAccionador + '</p>' +
      '<p>Acción: ' + accionAccionador + '</p>' +
      '</div>' +
      '<div class="modal-footer">' +
      '<button type="button" class="btn btn-success" id="encenderBtn">Encender</button>' +
      '<button type="button" class="btn btn-danger" id="apagarBtn">Apagar</button>' +
      '</div>';
    
    // Agregar la ventana modal al DOM
    $('#myModal').remove(); // Eliminar la modal previa si existe
    $('body').append('<div id="myModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
      '<div class="modal-dialog">' +
      '<div class="modal-content">' +
      modalContent +
      '</div>' +
      '</div>' +
      '</div>');
    
    // Mostrar la ventana modal
    $('#myModal').modal('show');
    
    // Agregar los eventos click a los botones
    $('#encenderBtn').click(function() {
     publicar(localStorage.getItem('id_grupo')+"control",localStorage.getItem('id_nodo')+row.id_accionador+"ON")
    });
    
    $('#apagarBtn').click(function() {
      // Lógica para el botón "Apagar"
     publicar(localStorage.getItem('id_grupo')+"control",localStorage.getItem('id_nodo')+row.id_accionador+"OFF")
    });
  },
  pagination: false,
  search: false,
  pageSize: 4,
  columns: [{
      field: 'id_accionador',
      title: 'id_accionador'
    }, {
      field: 'accion_accionador',
      title: 'accion_accionador'
    }, {
      field: 'status',
      title: 'status'
    }
  ],
  data: directorios
});



/*
$('#tabla_sensores_estado').bootstrapTable({
  pagination: false,
  search: false,
  pageSize: 4,
  columns: [
    {
      field: 'id_sensor_estado',
      title: 'id_sensor_estado'
    },
    {
      field: 'modelo_sensor_estado',
      title: 'modelo_sensor_estado'
    },
    {
      field: 'status',
      title: 'status'
    }
  ],
  data: directorios
});
*/

$tabla_sensores.bootstrapTable('load', respuesta[0].nodos_grupo[index].sensores)
$tabla_accionadores.bootstrapTable('load', respuesta[0].nodos_grupo[index].accionadores)
//$tabla_sensores_estado.bootstrapTable('load', respuesta[0].nodos_grupo[index].sensores_estado)


                }, 

  pagination: false,
  search: false,
   pageSize: 4,
  columns: [ {
    field: 'id_nodo',
    title: 'id_nodo'
  },{
     field: 'sensores',
      title: 'sensores_nodo',
 formatter: function(value) {
  let sensors = '';
  for (const key in value) {
    if (value.hasOwnProperty(key)) {
      if (typeof value[key] === 'object') {
        sensors += `${key}: ${JSON.stringify(value[key])}`;
      } else {
        sensors += `${key}: ${value[key]}`;
      }
    }
  }
  return sensors;
}
  },
  {
     field: 'accionadores',
      title: 'accionadores_nodo',
 formatter: function(value) {
  let accionadores = '';
  for (const key in value) {
    if (value.hasOwnProperty(key)) {
      if (typeof value[key] === 'object') {
        accionadores += `${key}: ${JSON.stringify(value[key])}<br>`;
      } else {
        accionadores += `${key}: ${value[key]}<br>`;
      }
    }
  }
  return accionadores;
}
  }

  ],data:directorios
  
})

$tabla_nodos.bootstrapTable('load', respuesta[0].nodos_grupo)

                }, 

  pagination: false,
  search: false,
   pageSize: 4,
  columns: [ {
    field: 'id_grupo',
    title: 'id_grupo'
  }
  ],data:directorios
  
})

$tabla_grupos.bootstrapTable('load', respuesta)

//$table2.bootstrapTable('load', respuesta.reverse())
//$table3.bootstrapTable('load', respuesta.reverse())
}).fail(function(err){
    console.log(err)})

});


$(document).on('click', '.btn-close', function() {
  $('#myModal').modal('hide');
})