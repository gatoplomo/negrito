


$(document).ready(function() {
  // Datos a enviar en la solicitud POST
  var postData = {
    // Agrega aquí los datos que deseas enviar
  };


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


const host = 'ws://192.168.51.90:9001'
console.log('Connecting mqtt client')




const client = mqtt.connect(host, options)
client.on('error', (err) => {
  console.log('Connection error: ', err)
  //client.end()
})

client.on('reconnect', () => {
  console.log('Reconnecting...')
})


// SUBCRIBCIÖN CANALES POR GRUPO_ID
client.on('connect', () => {
  console.log('Client connected:' + clientId)
client.subscribe("grupo_001", { qos: 0 })

  
})

var variableIDs = []; // Arreglo para almacenar los IDs de las variables

let buttonStatusArray = [];

let array_lecturas_graf= [];

const chartInstances = {};




  $.ajax({
  url: '/main_monitor',
  method: 'POST',
  dataType: 'json',
  contentType: 'application/json',
  data: JSON.stringify(postData), // Convertir los datos a JSON
  beforeSend: function() {
    console.log('Enviando datos al servidor...');
  },
  success: function(response) {
    console.log('Respuesta del servidor:', JSON.stringify(response));

    // Obtener la cantidad de grupos encontrados
    var cantidadGrupos = response.length;
    console.log('Cantidad de grupos encontrados:', cantidadGrupos);

    // Mostrar la cantidad de grupos en el front
    $("#cantidad_grupos_valor").text(cantidadGrupos);

   // Contar la cantidad de nodos, sensores y accionadores
var cantidadNodos = 0;
var cantidadSensores = 0;
var cantidadAccionadores = 0;
var cantidadVariables = 0;

for (var i = 0; i < response.length; i++) {
  var nodosGrupo = response[i].nodos_grupo;
  cantidadNodos += nodosGrupo.length;

  for (var j = 0; j < nodosGrupo.length; j++) {
    var sensoresNodo = nodosGrupo[j].sensores;
    cantidadSensores += sensoresNodo.length;

    for (var k = 0; k < sensoresNodo.length; k++) {
      var variablesSensor = sensoresNodo[k].variables_sensor;
      cantidadVariables += Object.keys(variablesSensor).length; // Obtener la cantidad de variables del sensor

      // Generar el ID para cada variable y almacenarlo en el arreglo
      Object.keys(variablesSensor).forEach(function(variable) {
        var id = response[i].id_grupo + '/' + nodosGrupo[j].id_nodo + '/' + sensoresNodo[k].id_sensor + '/' + sensoresNodo[k].modelo_sensor + '/' + variable;
        variableIDs.push(id);
      });

      // También puedes mostrar las variables encontradas para cada sensor
      console.log('Variables del sensor:', Object.keys(variablesSensor));
    }

    var accionadoresNodo = nodosGrupo[j].accionadores;
    cantidadAccionadores += accionadoresNodo.length;
  }
}

console.log('Cantidad de nodos encontrados:', cantidadNodos);
console.log('Cantidad de sensores encontrados:', cantidadSensores);
console.log('Cantidad de accionadores encontrados:', cantidadAccionadores);
console.log('Cantidad de variables encontradas:', cantidadVariables);

// Mostrar la cantidad de nodos, sensores, accionadores y variables en el front
$("#cantidad_nodos_valor").text(cantidadNodos);
$("#cantidad_sensores_valor").text(cantidadSensores);
$("#cantidad_accionadores_valor").text(cantidadAccionadores);
$("#cantidad_variables_valor").text(cantidadVariables);


    
    console.log(variableIDs)

    creargauges(variableIDs);



// Supongo que tienes la variable 'chartInstances' que contiene todas las instancias de gráficos

client.on('message', (topic, message, packet) => {
  const now = new Date();
  console.log(now); // Muestra la fecha y hora actuales en formato de cadena

  // Para obtener solo la hora actual en formato de cadena
  const horaActual = now.toLocaleTimeString();
  console.log(horaActual);
  let mensaje;
  console.log(array_lecturas_graf[0]);

  try {
    mensaje = JSON.parse(message);
    console.log("SUCESS")
    console.log(mensaje);

    // Generar las IDs buscadas
    const data = JSON.parse(message);
    const grupo = data.grupo;
    const nodos = data.nodos;
    const ids_generadas = [];

    for (const nodo of nodos) {
      const id_nodo = nodo.id_nodo;
      const sensores = nodo.sensores;

      for (const sensor of sensores) {
        const id_sensor = sensor.id_sensor;
        const modelo = sensor.modelo;
        const lecturas = sensor.lecturas;

        for (const variable in lecturas) {
          const id_variable = `${grupo}/${id_nodo}/${id_sensor}/${modelo}/${variable}`;
          const objeto_id_valor = {
            id_lectura: id_variable,
            lecturas: lecturas[variable]
          };

          ids_generadas.push(objeto_id_valor);
        }
      }
    }
    console.log("AAAAAAAAAAAAAAAAAAAAA");
    console.log(ids_generadas);

    for (let l = 0; l < variableIDs.length; l++) {
      const graficoID = gauges[l].id;
      // Actualizar el valor del gauge
            gauges[l].value = ids_generadas[l].lecturas;

      // Buscar el objeto que corresponde a este gráfico en el arreglo buttonStatusArray
      const botonStatus = buttonStatusArray.find(obj => obj.id_btn === graficoID);

      if (botonStatus) {
        // El gráfico tiene un estado definido en el arreglo buttonStatusArray
        const estado = botonStatus.status;

        switch (estado) {
          case "playing":
            // Tu nuevo dato
            const nuevoDato = {
              "hora": "01:13",
              "dato": ids_generadas[l].lecturas
            };

            // Supongo que chartInstances contiene todas las instancias de gráficos
            const rutaGrafico = ids_generadas[l].id_lectura + "graf";
            const instanciaGrafico = chartInstances[rutaGrafico];

            if (instanciaGrafico) {
              // Agregar el nuevo dato solo a la colección de lecturas del gráfico que hace match
              array_lecturas_graf[l].lecturas.push(nuevoDato);

              // Actualizar los datos y etiquetas solo para la instancia de gráfico correspondiente
              instanciaGrafico.data.datasets[0].data.push(nuevoDato.dato);
              instanciaGrafico.data.labels.push(nuevoDato.hora);

              // Actualizar el gráfico
              instanciaGrafico.update();

              console.log("MATCH");
            } else {
              console.log("No se encontró la instancia del gráfico en la ruta especificada:", rutaGrafico);
            }

      
            break;

          case "stopped":
            console.log("El gráfico está en estado stopped, no se actualizará:", graficoID);
            break;

          default:
            console.log("Estado inválido:", estado);
            break;
        }
      } else {
        console.log("El gráfico no tiene un estado definido en el arreglo buttonStatusArray:", graficoID);
      }
    }

  } catch (error) {
    console.error('Error en el parseo del mensaje:', error);
    console.log('Objeto JSON dañado:', message); // Impresión del objeto JSON dañado

    // Aquí puedes realizar alguna acción para manejar el error, como enviar una notificación o registrar en un archivo de log.
    // También puedes definir un valor por defecto para la variable 'mensaje', en caso de que el parseo falle.
    mensaje = { error: 'No se pudo parsear el mensaje' };
  }
});



    // Realizar acciones con la respuesta del servidor
  },
  error: function(xhr, status, error) {
    console.log('Error en la solicitud:', error);
    // Realizar acciones en caso de error
  }
});

function createChart(canvasId, data) {

  // Obtener el canvas con el ID especificado
  var canvas = document.getElementById(canvasId);

  // Crear el contexto 2D del canvas
  var ctx = canvas.getContext('2d');

  // Crear el gráfico utilizando Chart.js
  const myChart = new Chart(ctx, {
    type: 'line', // Tipo de gráfico (puede ser 'bar', 'line', 'pie', etc.)
    data: data, // Datos del gráfico
    options: {
      // Opciones del gráfico (puedes personalizar el estilo, las etiquetas, etc.)
    }
  });
}





//FUNCION CREAR TABLAS+CANVAS+GAUGES
function creargauges(variableIDs)
{

//alert("holaa"+variables_sensor)
var arreglo_variables = localStorage.getItem("variables").split(",");
var numero = variableIDs.length
arreglo_variables = arreglo_variables.map(function(elemento) {
  return elemento.trim();
});

//alert(numero)

const parentElement = document.getElementById('main_monitor');
    while (parentElement.firstChild) {
      parentElement.removeChild(parentElement.firstChild);
    }

var tags=[];

for ( var item = 0; item < numero ; item++) {
tags.push(variableIDs[item])
}
//alert(tags)

let tags2=arreglo_variables

    let tags3=["nodo1","nodo2","nodo3"]
    let sensores=tags2


    const canales=[];
    //console.log('Respuesta recibida:',respuesta)
//console.log(respuesta)
//console.log(respuesta.length)

for ( var item = 0; item < numero; item++) {
 var canv = document.createElement("canvas");
  var canv2 = document.createElement("canvas");

  var division = document.createElement("div");
  division.setAttribute("class", "align-center")
  division.setAttribute("style", "display:inline-block")
  var salto = document.createElement("br")
  var porte = document.createElement("h1")
  var newContent3 = document.createTextNode(tags[item]);
  porte.appendChild(newContent3)
  document.getElementById("main_monitor").appendChild(division);
  canv.setAttribute('width', 400);
  canv.setAttribute('height', 400);
  canv.setAttribute('id', variableIDs[item]);
  canv2.setAttribute('id', variableIDs[item]+"graf");
  canv2.setAttribute('width', 360);
  canv2.setAttribute('height', 200);
  canales.push("nodo1")
  buttonStatusArray.push({ id_btn: variableIDs[item], status: "stopped" });
  var body = document.getElementsByTagName("body")[0];

  var tabla = document.createElement("table");
  tabla.addEventListener("click", function (event) {
    console.log("Tabla clickeada: " + event.currentTarget.id);

  });

  var tblBody = document.createElement("tbody");
  var hilera1 = document.createElement("tr");

  // Crea una sola celda que ocupe dos columnas
  var textoCelda = document.createTextNode(tags[item]);
  var celda = document.createElement("td");
  celda.style.border = "1px solid black"; // Agrega borde a la celda original
  celda.setAttribute("colspan", "2"); // Indica que la celda debe ocupar dos columnas

  var led = document.createElement("div");
  led.setAttribute("class", "red led");
  led.setAttribute("id", "indicadornodo1");

  celda.appendChild(textoCelda);
  celda.appendChild(led);
  hilera1.appendChild(celda);

  var container = document.createElement("div");
  container.setAttribute("class", "container");

  var row = document.createElement("div");
  row.setAttribute("class", "row");

  var col1 = document.createElement("div");
  col1.setAttribute("class", "col-sm");
  col1.setAttribute("align", "right");
  col1.appendChild(textoCelda);


  row.appendChild(col1);


  container.appendChild(row);

  celda.appendChild(container);

  var hilera2 = document.createElement("tr");
  var celda2 = document.createElement("td");
  var textoCelda2 = document.createTextNode("");
  celda2.appendChild(textoCelda2);
  celda2.appendChild(canv);
  celda2.appendChild(textoCelda2);
  hilera2.appendChild(celda2);

  var hilera3 = document.createElement("tr");
  var celda3 = document.createElement("td");
  var textoCelda3 = document.createTextNode(tags2[item]);
 
var celdaDerecha2 = document.createElement("td");
celdaDerecha2.style.border = "1px solid black"; // Agrega borde a la celda derecha
celdaDerecha2.appendChild(canv2)


let isPlaying = false;


let trash = document.createElement("i");
trash.classList.add("fa", "fa-trash");
trash.setAttribute("aria-hidden", "true")
trash.style.float = "right";
trash.setAttribute("id", variableIDs[item] + "/trashbtn");

;
trash.onclick = function() {
    alert("Haz hecho clic en el icono de trash!");
    //alert(this.id);

    let cadena = this.id; // Asumiendo que 'cadena' contiene el valor del id del elemento que contiene el ícono de papelera
    let resultado = cadena.substring(0, cadena.lastIndexOf('/'))+"graf";
    alert(resultado);

    // Supongamos que tienes la ID del gráfico que deseas limpiar
    // Supongo que chartInstances contiene todas las instancias de gráficos
    const rutaGrafico = resultado;
    const instanciaGrafico = chartInstances[rutaGrafico];

    if (instanciaGrafico) {
        alert("grafico encontrado");

        // Borrar los datos y etiquetas del gráfico
        instanciaGrafico.data.datasets[0].data = [];
        instanciaGrafico.data.labels = [];

        // Actualizar el gráfico
        instanciaGrafico.update();
    } else {
        console.log("No se encontró la instancia del gráfico en la ruta especificada:", rutaGrafico);
    }
};


let eye = document.createElement("i");
eye.classList.add("fa", "fa-eye");
eye.setAttribute("aria-hidden", "true");
eye.onclick = function() {
  // Obtener los datos necesarios del objeto 'row'
    var idAccionador = "asdad";
    var accionAccionador = "asdad";
    var status = "asdad";
    
    // Crear el contenido dinámico de la ventana modal
    var modalContent = '<div class="modal-header">' +
      '<h5 class="modal-title">Detalles</h5>' +
      '<button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>' +
      '</div>' +
      '<div class="modal-body">' +
      '<p>ID: ' + idAccionador + '</p>' +
      '<p>Acción: ' + accionAccionador + '</p>' +
      '</div>' +
      '<div class="modal-footer">' +
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
    
};

$(document).on('click', '.btn-close', function() {
  $('#myModal').modal('hide');
})
let download = document.createElement("i");
download.classList.add("fa", "fa-download");
download.setAttribute("aria-hidden", "true");
download.onclick = function() {
  alert("Haz hecho clic en el icono de trash!");
};


let stop = document.createElement("i");
stop.classList.add("fa", "fa-stop");
stop.setAttribute("aria-hidden", "true");
stop.setAttribute("id", variableIDs[item] + "/btnstop");
stop.style.display = "none"; 

let play = document.createElement("i");
play.classList.add("fa", "fa-play");
play.setAttribute("aria-hidden", "true");
play.setAttribute("id", variableIDs[item] + "/btnplay");

play.onclick = function(event) {
  togglePlayStop(event);
};

stop.onclick = function(event) {
  togglePlayStop(event);
};


function togglePlayStop(event) {
  // Obtener el ID del elemento clicado (play o stop)
  const clickedElement = event.target;
  const elementID = clickedElement.id;

  // Extraer la información desde el inicio hasta el último "/"
  const lastSlashIndex = elementID.lastIndexOf("/");
  const extractedID = elementID.substring(0, lastSlashIndex);

  // Verificar si el objeto con la ID ya existe en el array
  let existingItemIndex = -1;
  buttonStatusArray.forEach((item, index) => {
    if (item.id_btn === extractedID) {
      existingItemIndex = index;
    }
  });

  // Cambiar el estado de reproducción
  isPlaying = !isPlaying;
  if (isPlaying) {
    play.style.display = "none";
    stop.style.display = "inline";
    if (existingItemIndex === -1) {
      // Si el ID no existe en el array, agregar un nuevo objeto
      buttonStatusArray.push({ id_btn: extractedID, status: "playing" });
    } else {
      // Si el ID ya existe en el array, actualizar solo el estado
      buttonStatusArray[existingItemIndex].status = "playing";
    }
  } else {
    stop.style.display = "none";
    play.style.display = "inline";
    if (existingItemIndex === -1) {
      // Si el ID no existe en el array, agregar un nuevo objeto
      buttonStatusArray.push({ id_btn: extractedID, status: "stopped" });
    } else {
      // Si el ID ya existe en el array, actualizar solo el estado
      buttonStatusArray[existingItemIndex].status = "stopped";
    }
  }

  // Mostrar el contenido del array buttonStatusArray en un alert
  alert(JSON.stringify(buttonStatusArray));
}



// Asignar el evento onclick a los botones play y stop
play.onclick = togglePlayStop;
stop.onclick = togglePlayStop;


celdaDerecha2.appendChild(play);
celdaDerecha2.appendChild(stop);
celdaDerecha2.appendChild(document.createTextNode('\u00A0')); // Agregar espacio en blanco
celdaDerecha2.appendChild(document.createTextNode('\u00A0')); // Agregar espacio en blanco
celdaDerecha2.appendChild(document.createTextNode('\u00A0')); // Agregar espacio en blanco
celdaDerecha2.appendChild(eye);
celdaDerecha2.appendChild(document.createTextNode('\u00A0')); // Agregar espacio en blanco
celdaDerecha2.appendChild(document.createTextNode('\u00A0')); // Agregar espacio en blanco
celdaDerecha2.appendChild(document.createTextNode('\u00A0')); // Agregar espacio en blanco

celdaDerecha2.appendChild(download);

celdaDerecha2.appendChild(trash);





hilera2.appendChild(celdaDerecha2);

var celdaDerecha3 = document.createElement("td");
celdaDerecha3.style.border = "1px solid black"; // Agrega borde a la celda derecha
hilera3.appendChild(celdaDerecha3);

tblBody.appendChild(hilera1);
tblBody.appendChild(hilera2);

tabla.appendChild(tblBody);
body.appendChild(tabla);
tabla.style.border = "2px solid black"; // Agrega borde a la tabla
division.appendChild(tabla);


const resultado = variableIDs[item].split('/').pop();


var chartData = {
  labels: [], // Etiquetas para el eje x
  datasets: [{
    label:resultado, // Etiqueta para la leyenda
    data: [], // Datos para el eje y
    backgroundColor: 'rgba(75, 192, 192, 0.5)', // Color de fondo de las barras
    borderColor: 'rgba(75, 192, 192, 1)', // Color del borde de las barras
    borderWidth: 1 // Ancho del borde de las barras
  }]
};

createChart(variableIDs[item]+"graf", chartData);

}
 let canales2=[];
canales2=canales;
for ( var item = 0; item < numero; item++) {
  var segments = variableIDs[item].split("/");
var lastSegment = segments.pop();
gauges[item] = new RadialGauge({ 
  renderTo: variableIDs[item],
  width: 180,
  height: 210, 
  units: lastSegment,
  id: "gauge-" + item // Agrega un ID único usando el valor de "item"
}).draw();

//plomo
gauges[item].id = variableIDs[item]; // Establecer el ID después de crear el objeto

        }
for ( var item = 0; item < gauges.length ; item++) {
//alert("identificador "+ gauges[item].id)
}



}

$.ajax({
  url: '/filtrar',
  method: 'POST',
  dataType: 'json',
  contentType: 'application/json',
  beforeSend: function() {
    console.log('Enviando solicitud al servidor...');
  },
  success: function(response) {
    console.log('Respuesta del servidor:', response);
    array_lecturas_graf=response;

    // Actualizar los gráficos utilizando los datos recibidos
    array_lecturas_graf.forEach(function(item) {
      var id = item.id_variable; // Obtener el ID del gráfico
      var lecturas = item.lecturas; // Obtener las lecturas del gráfico
      
      // Obtener el contexto del gráfico utilizando el ID
      var ctx = document.getElementById(id+"graf").getContext('2d');
      
      // Crear un array para almacenar las etiquetas (horas) y los datos
      var labels = [];
      var data = [];
      
      // Recorrer las lecturas y añadir las etiquetas y los datos al array
      lecturas.forEach(function(lectura) {
        labels.push(lectura.hora);
        data.push(lectura.dato);
      });
      
      // Crear una instancia del gráfico utilizando Chart.js
      var chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Datos',
            data: data,
            borderColor: 'blue',
            borderWidth: 1,
             backgroundColor: 'rgba(0, 191, 255, 0.5)'
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });

chartInstances[id+"graf"] = chart;


    });
  },
  error: function(xhr, status, error) {
    console.log('Error en la solicitud:', error);
    // Realizar acciones en caso de error
  }
});

});


