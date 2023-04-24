

$( document ).ready(function() {

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


const host = 'ws://192.168.116.36:9001' 


console.log('Connecting mqtt client')
const client = mqtt.connect(host, options)

client.on('error', (err) => {
  console.log('Connection error: ', err)
  //client.end()
})

client.on('reconnect', () => {
  console.log('Reconnecting...')
})




//FUNCION CREAR TABLAS+CANVAS+GAUGES
function creargauges(name,variables_sensor)
{
alert("holaa"+variables_sensor)
var arreglo_variables = variables_sensor.split(",");
var numero = arreglo_variables.length;
arreglo_variables = arreglo_variables.map(function(elemento) {
  return elemento.trim();
});


alert(numero)

const parentElement = document.getElementById('monitor');
    while (parentElement.firstChild) {
      parentElement.removeChild(parentElement.firstChild);
    }



var tags=[];


for ( var item = 0; item < numero ; item++) {
tags.push(name+"V"+item)
}
alert(tags)



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
tabla.setAttribute("id","tabla"+tags3[item])
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

var hilera4 = document.createElement("tr");
var celda4= document.createElement("td");

button4 =document.createElement("button")
button4.setAttribute("class","btn")
button4.setAttribute("id",sensores[item])
i2=document.createElement("i")
i2.setAttribute("class","fa fa-eye")
button4.setAttribute("onClick","ver(this.id)")
button4.appendChild(i2)
celda4.appendChild(button4)

button5 =document.createElement("button")
button5.setAttribute("class","btn")
button5.setAttribute("id",item)
i3=document.createElement("i")
i3.setAttribute("class","fa fa-toggle-on")
button5.setAttribute("onClick","acciones()")
button5.appendChild(i3)
celda4.appendChild(button5)

 var ul = document.createElement("ul");
 var li = document.createElement("li");
 var a1 = document.createElement("a");
 a1.setAttribute("id","pichula");
 a1.setAttribute("href","#");
  a1.setAttribute("onClick","ver(this.id)");
 var texto22 = document.createTextNode("Ver");
a1.appendChild(texto22);
 li.appendChild(a1)
var ul3 = document.createElement("ul");
 var li3 = document.createElement("li");
 var a13 = document.createElement("a");
 a13.setAttribute("id",item);
 a13.setAttribute("href","#");
  a13.setAttribute("onClick","acciones(this.id)");
 var texto223 = document.createTextNode("Acciones");
a13.appendChild(texto223);
 li3.appendChild(a13)
 ul.appendChild(li)
//ul.appendChild(li2)
ul.appendChild(li3)
 //celda4.appendChild(ul)
hilera4.appendChild(celda4)
tblBody.appendChild(hilera1);
tblBody.appendChild(hilera2);
tblBody.appendChild(hilera3);
tblBody.appendChild(hilera4);
tabla.appendChild(tblBody);
body.appendChild(tabla);
tabla.setAttribute("border", "2");
division.appendChild(tabla)


}

var gauges=[];

 let canales2=[];
canales2=canales;



for ( var item = 0; item < numero; item++) {
      
alert(arreglo_variables[item])

gauges[item] = new RadialGauge({ 
  renderTo: arreglo_variables[item],
  width: 180,
  height: 210, 
  id: "gauge-" + item // Agrega un ID único usando el valor de "item"
}).draw();

//plomo
gauges[item].id = "gauge"+localStorage.getItem("id_sensor")+localStorage.getItem("modelo_sensor")+arreglo_variables[item]; // Establecer el ID después de crear el objeto

        }
for ( var item = 0; item < gauges.length ; item++) {
alert("identificador "+ gauges[item].id)
}
  alert("Cantidad de Relojes "+gauges.length)     


client.on('message', (topic, message, packet) => {
  if(topic==localStorage.getItem('id_grupo')) {
    let mensaje = JSON.parse(message);
    console.log(mensaje);

    for(let i=0; i<mensaje.nodos.length; i++) {
      if(mensaje.nodos[i].id_nodo === localStorage.getItem('id_nodo')) {
        let sensores = mensaje.nodos[i].sensores;
        for(let j=0; j<sensores.length; j++) {
          if(sensores[j].modelo === localStorage.getItem('modelo_sensor')) {
            let lecturas = sensores[j].lecturas;
            for(let k=0; k<arreglo_variables.length; k++) {
              let variable = arreglo_variables[k];
              if(lecturas.hasOwnProperty(variable)) {
                let gaugeId = "gauge" + localStorage.getItem('id_sensor') + localStorage.getItem('modelo_sensor') + variable;
                for(let l=0; l<gauges.length; l++) {
                  if(gauges[l].id === gaugeId) {
                    gauges[l].value = lecturas[variable];
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
console.log(respuesta[0].nodos_grupo)


alert(respuesta.length)

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

  $('#tabla_grupos').bootstrapTable({ 

  onClickRow:function (row,$element) {
 
localStorage.setItem('id_grupo', row.id_grupo);
alert(localStorage.getItem('id_grupo'))
localStorage.setItem('variables_sensor', row.variables_sensor);
alert("holaa"+localStorage.getItem('variables_sensor'));
 $('#tabla_nodos').bootstrapTable({ 

  onClickRow:function (row,$element) {
localStorage.setItem('id_nodo', row.id_nodo);
alert(localStorage.getItem('id_nodo'))

$('#tabla_sensores').bootstrapTable({
  onClickRow: function(row, $element) {
     localStorage.setItem('id_sensor', row.id_sensor);
     alert(localStorage.getItem('id_sensor'));
 localStorage.setItem('modelo_sensor', row.modelo_sensor);
     alert(localStorage.getItem('modelo_sensor'));


    var variables = Object.keys(row.variables_sensor).join(', ');
   alert(variables);
   creargauges("DTH11",variables)
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



$tabla_sensores.bootstrapTable('load', respuesta[0].nodos_grupo[0].sensores)

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

































 //alert("Bienvenido a la sala de monitoreo")



$('#table').bootstrapTable({ 

  onClickRow:function (row,$element) {

  $.ajax({
    url:'/filtrar',
    method:'POST',
    data: {'central':localStorage.getItem("nodo"),'archivo':row.date.substring(0,10)},
    beforeSend: function(data){
      console.log('Enviando...',data)
    },


  }).done(function(res){



console.log(res)


   for (var i = lecturas.length; i > 0; i--) {
 lecturas.pop();
fechas.pop();

  
}


for ( var item = 0; item < res.length ; item++) {


lecturas.push(res[item].lectura)
fechas.push(res[item].date.substring(10,20))


        }
console.log(lecturas)
console.log(fechas)

 myChart.update()
   
}).fail(function(err){

    

  }

    )

                    $('.info').removeClass('info');
                    $($element).addClass('info');
                }, 

  pagination: true,
  search: true,
   pageSize: 4,
  columns: [{
    field: 'date',
    title: 'Fecha Creación '
  }, {
    field: 'time',
    title: 'Ultima Actualización'
  }, 
{
    field: 'h2',
    title: 'Ultimo Dato'
  }, 
{
    field: 'h1',
    title: 'Primer Dato'
  }, 

  {
    field: 'dir',
    title: 'Directorio'
  }],data: directorios
  
})

$('#table4').bootstrapTable({ 

  onClickRow:function (row,$element) {

                }, 

  pagination: true,
  search: true,
   pageSize: 4,
  columns: [{
    field: 'Evento',
    title: 'Evento'
  },{
    field: 'Generado_por',
    title: 'Generado_por'
  }

  , {
    field: 'Info',
    title: 'Info'
  }, {
    field: 'Hora',
    title: 'Hora'
  }, 
{
    field: 'Fecha',
    title: 'Fecha'
  }, 
{
    field: 'Accionador',
    title: 'Accionador'
  }, {
    field: 'Funcion',
    title: 'Funcion'
  },{
    field: 'Estado',
    title: 'Estado'
  }],data: directorios
  
})

$('#table5').bootstrapTable({ 

  onClickRow:function (row,$element) {

                }, 

  pagination: true,
  search: true,
   pageSize: 4,
  columns: [{
    field: 'lectura',
    title: 'temperatura c°'
  },{
    field: 'lectura2',
    title: 'Humedad %'
  },

{
    field: 'lectura3',
    title: 'Gases PPM'
  }

,
  {
    field: 'date',
    title: 'date'
  }

  , {
    field: 'fecha',
    title: 'fecha'
  }, {
    field: 'hora',
    title: 'hora'
  }],data: directorios
  
})

























$('#ejemplo').bootstrapTable({ 

  onClickRow:function (row,$element) {
    alert(row.id)
    
   



  const nodo1 = {
    Sector:row.sector1,
    Tipo:row.tipo1,
    Sensor1: row.s1,
    Sensor2: row.s2,
    Accionador1: "Madrid",
    Accionador2: "Madrid"
  };

  
  const nodo2 = {
    Sector:row.sector2,
    Tipo:row.tipo2,
    Sensor1: row.s1,
    Sensor2: row.s2,
    Accionador1: "Madrid",
    Accionador2: "Madrid"
  };

 

  const personaJSON1 = JSON.stringify(nodo1);
  const personaJSON2 = JSON.stringify(nodo2);
  

  const lista = [personaJSON1, personaJSON2];

  // Crear la tabla
  var tabla = document.createElement("table");
  tabla.setAttribute("id", "tabla-personas");
  tabla.setAttribute("class", "table table-striped");

  // Crear el encabezado de la tabla
  var encabezado = tabla.createTHead();
  var filaEncabezado = encabezado.insertRow();

  var celdaNombreEncabezado2 = filaEncabezado.insertCell();
  celdaNombreEncabezado2.innerHTML = "Sector";

    var tipo = filaEncabezado.insertCell();
  tipo.innerHTML = "Tipo";

  var celdaNombreEncabezado = filaEncabezado.insertCell();
  celdaNombreEncabezado.innerHTML = "Sensor1";

  var celdaApellidoEncabezado = filaEncabezado.insertCell();
  celdaApellidoEncabezado.innerHTML = "Sensor2";

  var celdaEdadEncabezado = filaEncabezado.insertCell();
  celdaEdadEncabezado.innerHTML = "Accionador1";

  var celdaEdad2Encabezado = filaEncabezado.insertCell();
  celdaEdad2Encabezado.innerHTML = "Accionador2";

  // Crear el cuerpo de la tabla
  var cuerpoTabla = tabla.createTBody();

  lista.forEach(function(personaJSON) {
    var persona = JSON.parse(personaJSON);
    var fila = cuerpoTabla.insertRow();




    var celdaNombre2 = fila.insertCell();
    celdaNombre2.innerHTML = persona.Sector;

     var celdaNombre2 = fila.insertCell();
    celdaNombre2.innerHTML = persona.Tipo;

    var celdaNombre = fila.insertCell();
    celdaNombre.innerHTML = persona.Sensor1;
    var celdaApellido = fila.insertCell();
    celdaApellido.innerHTML = persona.Sensor2;
    var celdaEdad = fila.insertCell();
    celdaEdad.innerHTML = persona.Accionador1;
     var celdaEdad2 = fila.insertCell();
    celdaEdad2.innerHTML = persona.Accionador2;
  });

  // Agregar la tabla al contenedor
  var contenedor = document.getElementById("tabla-container");
  contenedor.appendChild(tabla);

// Agregar evento de clic a las filas de la tabla
var filas = document.querySelectorAll("#tabla-personas tbody tr");
filas.forEach(function(fila) {
  fila.addEventListener("click", function() {
    var nombre = this.cells[0].textContent;
    var apellido = this.cells[1].textContent;
    var edad = this.cells[2].textContent;
    console.log("Clic en fila: " + nombre + " " + apellido + " (" + edad + " años)");
    alert(nombre)
    // Aquí puedes hacer lo que necesites con la fila seleccionada, por ejemplo redirigir a otra página


// Crear el elemento ul
var ul = document.createElement("ul");
ul.style.listStyle = "none";

// Crear el elemento li para el primer enlace
var li1 = document.createElement("li");
li1.style.display = "inline-block";
li1.style.marginRight = "10px";

// Crear el enlace para la función 1
var a1 = document.createElement("a");
a1.href = "#";
a1.onclick = function(event) {
  event.preventDefault(); // Prevenir el comportamiento predeterminado del enlace
  functs1(); // Llamar a la función functs1
};
a1.innerHTML = localStorage.getItem("s1");

// Agregar el enlace al elemento li1
li1.appendChild(a1);

// Crear el elemento li para el segundo enlace
var li2 = document.createElement("li");
li2.style.display = "inline-block";

// Crear el enlace para la función 2
var a2 = document.createElement("a");
a2.href = "#";
a2.onclick = function(event) {
  event.preventDefault(); // Prevenir el comportamiento predeterminado del enlace
  functs2(); // Llamar a la función functs2
};
a2.innerHTML = localStorage.getItem("s2");

// Agregar el enlace al elemento li2
li2.appendChild(a2);

// Agregar los elementos li1 y li2 al elemento ul
ul.appendChild(li1);
ul.appendChild(li2);

// Agregar el elemento ul al documento
document.getElementById("sensores").appendChild(ul)



let vars=["Temperatura","Humedad","PpmGas"]

function functs1() {


const name = localStorage.getItem("s1");
const myArray1 = name.split("-");
const myArray2 = myArray1[1].split("/");

const DTH11 = {
  variable1: myArray1[0],
  vars: [myArray2[0], myArray2[1]]
};

//alert(DTH11.variable1); // MQ2
//alert(DTH11.vars); // ["Temperatura", "Humedad"]

//console.log(myObject.variable1); // DTH11
//console.log(myObject.variable2); // Temperatura
//console.log(myObject.variable3); // Humedad


creargauges(DTH11,vars)


}

function functs2() {

const name = localStorage.getItem("s2");

const myArray = name.split("-");
const MQ2 = {
  variable1: myArray[0],
  vars: [myArray[1]]
};

}

  });
});

// Agregar evento de clic y mouseover a las filas de la tabla
var filas = document.querySelectorAll("#tabla-personas tbody tr");
filas.forEach(function(fila) {
  fila.addEventListener("click", function() {
    var nombre = this.cells[1].textContent;
    var apellido = this.cells[2].textContent;
    var edad = this.cells[3].textContent;
    console.log("Clic en fila: " + nombre + " " + apellido + " (" + edad + " años)");
    // Aquí puedes hacer lo que necesites con la fila seleccionada, por ejemplo redirigir a otra página

 localStorage.setItem('s1', nombre );
localStorage.setItem('s2', apellido);

  });


  fila.addEventListener("mouseover", function() {
    this.style.backgroundColor = "#ccc"; // Cambiar el color de fondo a gris claro
  });
  fila.addEventListener("mouseout", function() {
    this.style.backgroundColor = ""; // Restaurar el color de fondo original
  });
});






var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = yyyy + '-' + mm + '-' + dd;
console.log(today)

$.ajax({
    url:'/dataget',
    method:'POST',
    data: {'central':localStorage.getItem("nodo"),'fecha':today},
    beforeSend: function(data){
      console.log('Enviando...',data)
    },
  }).done(function(respuesta){
 console.log(respuesta)
 const numero = respuesta.length;
   let nombres = respuesta;
alert(respuesta.length)

for (var i = lecturas.length; i > 0; i--) {
 lecturas.pop();
 lecturas2.pop();
 lecturas3.pop();
fechas.pop(); 
}

for ( var item = 0; item < numero ; item++) {
lecturas.push(respuesta[item].lectura)
fechas.push(respuesta[item].date.substring(10,20))
lecturas2.push(respuesta[item].lectura2)
lecturas3.push(respuesta[item].lectura3)
        }
//console.log(numero)
//console.log(lecturas)
//console.log(fechas)
    })




/*
for (var i = 0; i < numero; i++) {
for (var i2 = 0; i2 <vars.length; i2++) {

}
 }   

 */
    //gauges[1].value = parseFloat(obj.Lectura[1].toString())
//alert(gauges[0].id)
   // document.getElementById("indicadornodo1").className = "green led";
        //document.getElementById("indicadornodo2").className = "green led";
//console.log(canales[0])

/*

        */











$.ajax({
    url:'/geteventsensor',
    method:'POST',
    data: {'central':localStorage.getItem("nodo")},

    beforeSend: function(data){
      console.log('Enviando...',data)
    },


  }).done(function(respuesta){
console.log(respuesta.reverse())



var $table3 = $('#table3')


$table3.bootstrapTable('load', respuesta.reverse())
$table4.bootstrapTable('load', respuesta.reverse())
//$table2.bootstrapTable('load', respuesta.reverse())
//$table3.bootstrapTable('load', respuesta.reverse())
}).fail(function(err){
    console.log(err)
    

  }
    )


$.ajax({
    url:'/eventos',
    method:'POST',
    data: {'central':localStorage.getItem("nodo")},

    beforeSend: function(data){
      console.log('Enviando...',data)
    },


  }).done(function(respuesta){
console.log(respuesta.reverse())

var $table4 = $('#table4')


$table4.bootstrapTable('load', respuesta)


//$table2.bootstrapTable('load', respuesta.reverse())
//$table3.bootstrapTable('load', respuesta.reverse())
}).fail(function(err){
    console.log(err)
    })


$.ajax({
    url:'/reportes',
    method:'POST',
    data: {'central':localStorage.getItem("nodo")},

    beforeSend: function(data){
      console.log('Enviando...',data)
    },


  }).done(function(respuesta){
console.log(respuesta.reverse())


var $table5 = $('#table5')


$table5.bootstrapTable('load', respuesta)

}).fail(function(err){
    console.log(err)
    })

$.ajax({
    url:'/basededatos',
    method:'POST',
    data: {'central':localStorage.getItem("nodo")},

    beforeSend: function(data){
      console.log('Enviando...',data)
    },


  }).done(function(respuesta){
console.log(respuesta.reverse())

var $table = $('#table')
var $table2 = $('#table2')
var $table3 = $('#table3')



$table.bootstrapTable('load', respuesta)

//$table2.bootstrapTable('load', respuesta.reverse())
//$table3.bootstrapTable('load', respuesta.reverse())
}).fail(function(err){
    console.log(err)
    

  }



    )
                }, 

  pagination: true,
  search: true,
   pageSize: 4,
  columns: [{
    field: 'id',
    title: 'Id'
  }
  ,{
    field: 'client',
    title: 'Cliente'
  },{
    field: 'ubi',
    title: 'Ubicación'
  },{
    field: 'contact',
    title: 'Contacto'
  }
],data: directorios
  
})



















eventostabla2=[]

$('#table2').bootstrapTable({ 

  onClickRow:function (row,$element) {
                }, 

  pagination: false,
  search: false,
   pageSize: 4,
  columns: [ {
    field: 'var',
    title: 'Variable'
  }, {
    field: 'condi',
    title: 'Condición'
  }, 
{
    field: 'value',
    title: 'Valor'},
 {   
      field: 'act',
    title: 'Accionador'
  },
 {   
      field: 'state',
    title: 'Estado'
  }
  ],data: eventostabla2
  



 

})




$('#table3').bootstrapTable({ 

  onClickRow:function (row,$element) {


                    $('.info').removeClass('info');
                    $($element).addClass('info');
                }, 

  pagination: false,
  search: false,
   pageSize: 4,
  columns: [{
    field: 'Variable',
    title: 'Variable'
  }, {
    field: 'Condicion',
    title: 'Condición'
  }, 
{
    field: 'Valor',
    title: 'Valor'
  },

  {
    field: 'Accionador',
    title: 'Accionador'
  },

{
    field: 'Estado',
    title: 'Estado'
  }





  ],data: eventostabla2
  
})

add1=document.createElement("button")
add1.setAttribute("class","btn")
i3=document.createElement("i")
i3.setAttribute("class","fa fa-plus")
add1.appendChild(i3)
add1.setAttribute("onclick","eventos()")

 document.getElementById("eventosensor").appendChild(add1);


 add2=document.createElement("button")
add2.setAttribute("class","btn")
i4=document.createElement("i")
i4.setAttribute("class","fa fa-plus")
add2.appendChild(i4);
add2.setAttribute("onclick","eventos2()")

 document.getElementById("eventotiempo").appendChild(add2);


 

});







//FUNCION PARA GENERAR CSV POR NODO MEDIANTE BOTÖN
function generar()
{

$( document ).ready(function() {

  $.ajax({
    url:'/generar',
    method:'POST',
    data: {'central':localStorage.getItem("nodo")},
    beforeSend: function(data){
      console.log('Enviando...',data)
    },


  }).done(function(respuesta){

    //const numero = respuesta.length;
    //let nombres = respuesta;
    const canales=[];

    console.log('Respuesta recibida:',respuesta)
    console.log(respuesta)
    console.log(respuesta.length)
 
   //console.log(numero);

   
}).fail(function(err){
    console.log(err)
    

  }

    )

 alert("Descargando información del usuario")


});
location.reload();
}


var grafico=[];
var fgraficos=[];

var lecturas=[];
var lecturas2=[];
var lecturas3=[];
var fechas=[];
var seleccion=" "
var directorios=[];








function checked()
{


client.on('message', (topic, message, packet) => {
  //console.log('Received Message: ' + message.toString() + '\nOn topic: ' + topic)
  

var msn=message.toString();
//console.log(msn);
//console.log(msn.length)

const obj = JSON.parse(message);
//console.log(obj)



//console.log(topic)


sele=localStorage.getItem('nodo');


if(sele==topic)

{
console.log("match");
console.log(i);

console.log(obj.Act1)
console.log(obj.Act2)


if(obj.Act2==1)
{

var select = document.getElementById('EstadoAccionador0nodo1');
select.removeChild(select.lastChild);

document.getElementById("EstadoAccionador0nodo1").appendChild(document.createTextNode("Encendido"));

}
else if(obj.Act2==0)
{

var select = document.getElementById('EstadoAccionador0nodo1');
select.removeChild(select.lastChild);
document.getElementById("EstadoAccionador0nodo1").appendChild(document.createTextNode("Apagado"));



}



if(obj.Act1==1)
{

var select22 = document.getElementById('EstadoAccionador1nodo1');
select22.removeChild(select22.lastChild);
document.getElementById("EstadoAccionador1nodo1").appendChild(document.createTextNode("Encendido"));



}
else if(obj.Act1==0)
{

var select22 = document.getElementById('EstadoAccionador1nodo1');
select22.removeChild(select22.lastChild);
document.getElementById("EstadoAccionador1nodo1").appendChild(document.createTextNode("Apagado"));



}


}

})
}











function comu(canales,numero)
{
 

}


 
function doalert(checkboxElem,canales,numero) {


  if (checkboxElem.checked) {

  var strong = checkboxElem.id.substring(
    checkboxElem.id.lastIndexOf(":") + 1, 
    checkboxElem.id.lastIndexOf("/")
);
 var strong2 = checkboxElem.id.substring(
    checkboxElem.id.lastIndexOf("/") + 1, 
    checkboxElem.id.length
);

mySubString=strong+"control";
    //alert(strong2+"#ON;")
    client.publish(mySubString,strong2+"#ON;")

    //console.log(mySubString,checkboxElem.id+"#ON;")
   
  } else {
   //alert(strong2+"#OFF");

  var strong = checkboxElem.id.substring(
    checkboxElem.id.lastIndexOf(":") + 1, 
    checkboxElem.id.lastIndexOf("/")
);
   var strong2 = checkboxElem.id.substring(
    checkboxElem.id.lastIndexOf("/") + 1, 
    checkboxElem.id.length
);
  mySubString=strong+"control";
  //alert(mySubString)
 client.publish(mySubString,strong2+"#OFF;")
 console.log(mySubString,strong2+"#OFF;") 
  }



}






function modo()
{
alert("modo")
client.publish("nodo1control","reset2")


}


var select = document.getElementById('monitor2');
var chartconteiner= document.createElement("div")
chartconteiner.setAttribute("class","chart-container")
var chart = document.createElement("canvas")
chart.setAttribute("id","myChart")
chart.setAttribute("height","60")
chart.setAttribute("width","100")
chartconteiner.appendChild(chart)
select.appendChild(chartconteiner)



labelo=document.createElement("label")
labelo.setAttribute("class","switch")
inputo=document.createElement("input")
inputo.setAttribute("type","checkbox")
inputo.setAttribute("id","realtime")
spano=document.createElement("span")
spano.setAttribute("class","slider round")
labelo.appendChild(inputo)
labelo.appendChild(spano)
chartconteiner.appendChild(labelo)


button3 =document.createElement("button")
button3.setAttribute("class","btn")
button3.setAttribute("onClick","limpiar2()")
i=document.createElement("i")
i.setAttribute("class","fa fa-trash")
button3.appendChild(i)
chartconteiner.appendChild(button3)

button4 =document.createElement("button")
button4.setAttribute("class","btn")
button4.setAttribute("onClick","generar()")
i5=document.createElement("i")
i5.setAttribute("class","fa fa-download")
button4.appendChild(i5)
chartconteiner.appendChild(button4)

var ctx = document.getElementById('myChart');
/*
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: fechas,
        datasets: [{
            label: '',
            data: lecturas,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    }   

});

*/
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
    labels: fgraficos,
    datasets: [{
      label: "Temperatura nodo 1",
      backgroundColor: window.chartColors.red,
      borderColor: window.chartColors.red,
      data: grafico,  backgroundColor: [
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
      text:'Gráfico'
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
           labelString: 'Temperatura'
        },
      }]
    }
  }
};

var myChart = new Chart(ctx, config);




var nodoanterior="";



function limpiar2()
{
for (var i = lecturas.length; i > 0; i--) {
 lecturas.pop();
  fechas.pop(); 
}
myChart.update();
}




var newArray = [];
var newArray2=[];
    

function ver(id)
{
    //alert(id)
newArray = [];
newArray2=[];


 function filtro(array,array2){
    //alert(array.length)
    //alert(array2.length)

newArray.push(array[0]);
       newArray2.push(array2[0]);
       for(var i = 0; i < array.length -1; i++) {
            if(array2[i].substring(0,3) != array2[i + 1].substring(0,3)) {
                newArray.push(array[i + 1]);
                newArray2.push(array2[i+1]);
    
        
            }
        }

//alert(newArray.length)
//alert(newArray2.length)


  for (var i = grafico.length; i > 0; i--) {
 grafico.pop();
fgraficos.pop(); 
}
myChart.update();
   for (var i = 0; i < newArray.length; i++) {
 grafico.push(newArray[i]);
fgraficos.push(newArray2[i]); 
}
myChart.update();
myChart.update();

    }


if (id=="Temperatura") {
 filtro(lecturas,fechas);
} else if (id=="Humedad") {
 filtro(lecturas2,fechas);
} else if (id=="gas") {
filtro(lecturas3,fechas);
} else {
  alert("hola")
}

/*

*/

myChart.update();


alert(localStorage.getItem("nodo"))



  var cuenta=0;

client.on('message', (topic, message, packet) => {
 
console.log(message)
var today = new Date();
var time = today.getHours() + ":" + today.getMinutes();

if(topic==localStorage.getItem("nodo") && flag==1)
{

console.log("seleccion"+seleccion)

const obj = JSON.parse(message);
console.log(obj)
console.log(obj.Lectura)
creartoast(cuenta,"Reporte"+" "+topic+" "+"Lectura"+" "+obj.Lectura[0]+" "+"Act1"+" "+obj.Act1+" "+"Act2"+" "+obj.Act2+" "+"Fecha"+" "+obj.Fecha+" Hora"+" "+obj.Hora);
grafico.push(obj.Lectura[0].toString())
fgraficos.push(time)
myChart.update();
cuenta=cuenta+1;
}


//document.getElementById(":nodo1/Accionador0").checked = false;



})


}
















/*
function ver()
{
alert(localStorage.getItem("nodo"))
alert("VER")
$.ajax({
    url:'/dataget',
    method:'POST',
    data: {'central':localStorage.getItem("nodo"),'fecha':today},
    beforeSend: function(data){
      console.log('Enviando...',data)
    },
  }).done(function(respuesta){
   const numero = respuesta.length;
   let nombres = respuesta;
console.log(respuesta)
for ( var item = 0; item < numero ; item++) {
lecturas.push(respuesta[item].lectura)
fechas.push(respuesta[item].date.substring(10,20))
lecturas2.push(respuesta[item].lectura2)
        }
//console.log(numero)
//console.log(lecturas)
//console.log(fechas)
var newArray = [];
var newArray2=[];

    function identical(array,array2,){
        newArray.push(array[0]);
        newArray2.push(array2[0]);
      
        for(var i = 0; i < array.length -1; i++) {
            if(array2[i].substring(0,3) != array2[i + 1].substring(0,3)) {
                newArray.push(array[i + 1]);
                newArray2.push(array2[i+1]);
                console.log(newArray)
                 console.log(newArray2)
        
            }
        }
        //console.log(array2[0].substring(3,4));
        //console.log(array2[0].substring(3,4))
    for (var i = lecturas.length; i > 0; i--) {
 lecturas.pop();
fechas.pop(); 
}
   for (var i = 0; i < newArray.length; i++) {
 lecturas.push(newArray[i]);
fechas.push(newArray2[i]); 
}
    }
identical(lecturas,fechas,lecturas2);
console.log("HOLIWISSSS")
console.log(newArray)
console.log(newArray2)
myChart.update();
myChart.update();
}).fail(function(err){
    console.log(err)
    
  }

    )


        for(var i = 0; i < respuesta2.length; i++) {
            if(respuesta2[id]==respuesta2[i]) {
              var x = document.getElementById("tabla"+respuesta2[i].id).getElementsByTagName("td");
x[0].style.backgroundColor = "#D5FAC2";   


            }
            else {


              var x = document.getElementById("tabla"+respuesta2[i].id).getElementsByTagName("td");
x[0].style.backgroundColor = "#FFFFFF";   


            }
        }

var x = document.getElementById("tabla"+respuesta2[id].id).getElementsByTagName("td");
x[0].style.backgroundColor = "#D5FAC2";   
   
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = yyyy + '-' + mm + '-' + dd;
console.log(today)




alert("Abriendo.."+localStorage.getItem("nodo"))
for (var i = lecturas.length; i > 0; i--) {
 lecturas.pop();
  fechas.pop();
 
}

 myChart.update()

console.log(respuesta2[id].id)

seleccion=respuesta2[id].id

console.log("PICHULA")
console.log(today)




 alert("Base de datos descargada")







//modal.style.display = "block";


var mem1=[];
var mem2=[];

this.ajustar=function()
{

var numero =parseInt(document.getElementById("ajustar").value);


console.log(numero)
console.log(lecturas)
console.log(fechas)
let extraida = fechas[0].substring(0,2);
console.log(extraida)
var opt1=0;
var opt2=0

switch (numero) {

case 20:
     opt1=6
     opt2=8
    break;
case 30:
    opt1=3
     opt2=5
    break;
case 40:
     opt1=0
     opt2=2
    break;
}

var newArray = [];
var newArray2=[];

    function filtro(array,array2){

        
        newArray.push(array[0]);
        newArray2.push(array2[0]);


        for(var i = 0; i < array.length -1; i++) {
            if(array2[i].substring(opt1,opt2) != array2[i + 1].substring(opt1,opt2)) {
                newArray.push(array[i + 1]);
                newArray2.push(array2[i+1]);


            }
        }


        console.log(newArray);
        console.log(newArray2)

    for (var i = lecturas.length; i > 0; i--) {
 lecturas.pop();
fechas.pop();

  
}

   for (var i = 0; i < newArray.length; i++) {
 lecturas.push(newArray[i]);
fechas.push(newArray2[i]);
  
}


    }
    filtro(lecturas,fechas);

myChart.update();

}


this.limpiar =function()
{
console.log(respuesta2[id].id);
$.ajax({
    url:'/limpiar',
    method:'POST',
    data: {'central':respuesta2[id].id},
    beforeSend: function(data){
        },
  }).done(function(){
}).fail(function(err){
    console.log(err)
  } )
for (var i = lecturas.length; i > 0; i--) {
 lecturas.pop();
  fechas.pop();
}
myChart.update()
}
}
*/















function creartoast(cuenta,contenido)

{


var dav=document.createElement("div")
dav.setAttribute("id","toast"+cuenta)
dav.setAttribute("class","toast align-items-center text-bg-primary border-0 ")
dav.setAttribute("role","alert")
dav.setAttribute("aria-live","assertive")
dav.setAttribute("aria-atomic","true")
dav.setAttribute("data-bs-autohide","false")


var dav2=document.createElement("div")
dav2.setAttribute("class","d-flex")


var dav3=document.createElement("div")
dav3.setAttribute("class","toast-body")


tosto=document.createTextNode(contenido)

var botoni=document.createElement("button");
botoni.setAttribute("type","button")
botoni.setAttribute("class","btn-close btn-close-white me-2 m-auto")
botoni.setAttribute("data-bs-dismiss","toast")
botoni.setAttribute("aria-label","Close")


dav3.appendChild(tosto);

dav2.appendChild(dav3)
dav2.appendChild(botoni)
dav.appendChild(dav2)

const pichula = document.getElementById('pichula')

pichula.appendChild(dav)
const toastLiveExample = document.getElementById("toast"+cuenta)
const toast = new bootstrap.Toast(toastLiveExample)
toast.show()


}




client.on('message', (topic, message, packet) => {
 console.log(topic)

if(topic=="nodo1evento")
{
    const obj = JSON.parse(message);
    console.log("HOLAAAAAAAA")
creartoast(cuenta,"Evento:"+" "+obj.Evento+" "+"Generado_por:"+" "+obj.Generado_por+" "+"Fecha"+" "+obj.Fecha+" "+"Hora"+" "+obj.Hora+" "+"Accionador:"+" "+obj.Accionador+" "+"Función:"+" "+obj.Funcion+" "+"Estado:"+" "+obj.Estado);
cuenta=cuenta+1;
}

})








function acciones(id)
{

id=0;
alert(id)

var select = document.getElementById('ventana');

while (select.firstChild) {
  select.removeChild(select.firstChild);
}




  var tabla   = document.createElement("table");
  var tblBody = document.createElement("tbody");


for (var x = 0; x < 2; x++) {
//botón 1
var newContent1 = document.createTextNode("ON");
var newContent2 = document.createTextNode("OFF");

 var check= document.createElement("input");
            check.setAttribute('type', "checkbox")
            check.setAttribute('id',":"+respuesta2[id].id+"/"+"Accionador"+x)
            check.setAttribute('onClick', "doalert(this)")

            var label=document.createElement("label")
            label.setAttribute('id' , "sliderLabel")


             var spa=document.createElement("span")
               var spa2=document.createElement("span")


               spa2.setAttribute('id',"sliderOn")
               spa2.appendChild(newContent1)


                 var spa3=document.createElement("span")
                 spa3.setAttribute('id',"sliderOff")
                 spa3.appendChild(newContent2)
                 var spa4=document.createElement("span")
                 spa4.setAttribute('id',"sliderBlock")


             spa.setAttribute('id',"slider")
             spa.appendChild(spa2)
             spa.appendChild(spa3)
             spa.appendChild(spa4)

             label.appendChild(check)
             label.appendChild(spa)

var on=document.createElement("button")
on.setAttribute("class","button button1")
var texton=document.createTextNode("encender");
on.setAttribute("onclick","accion(this.id)");
on.setAttribute('id',":"+respuesta2[id].id+"/"+"Accionador"+x+"#ON")
on.appendChild(texton);



var off=document.createElement("button")
off.setAttribute("class","button button2")
var textoff=document.createTextNode("apagar");
off.setAttribute("onclick","accion(this.id)");
off.setAttribute('id',":"+respuesta2[id].id+"/"+"Accionador"+x+"#OFF")
off.appendChild(textoff);


var estado=document.createTextNode("Estado:")




  for (var i = 0; i < 3; i++) {
    // Crea las hileras de la tabla
    var hilera = document.createElement("tr");
    for (var j = 0; j < 1; j++) {
      var celda = document.createElement("td");
      hilera.appendChild(celda);
     if(i==0)
     {
     var textoCelda = document.createTextNode("Accionador"+x+":" +respuesta2[id].act1);
     celda.appendChild(textoCelda);
     }
if(i==1)
     {
   //celda.appendChild(on);
      //celda.appendChild(off);
      //celda.appendChild(led)
    celda.appendChild(estado)
    celda.setAttribute("id","Estado"+"Accionador"+x+respuesta2[id].id)
    //celda.appendChild(estado2)
     }
     if(i==2)
     {
        celda.appendChild(on);
        celda.appendChild(off)
   //celda.appendChild(on);
      //celda.appendChild(off);

     }
    }
    tblBody.appendChild(hilera);
  }
tabla.appendChild(tblBody)
 select.appendChild(tabla)
  }



labelo2=document.createElement("label")
labelo2.setAttribute("class","switch")
inputo2=document.createElement("input")
inputo2.setAttribute("type","checkbox")
inputo2.setAttribute("id","realtime2")
spano2=document.createElement("span")
spano2.setAttribute("class","slider round")
labelo2.appendChild(inputo2)
labelo2.appendChild(spano2)
select.appendChild(labelo2)


 var modo = document.createElement("button");
modo.setAttribute("class","button button1")
modo.setAttribute("id","modo")
modo.setAttribute("onclick","modo()")
var textoCelda7 = document.createTextNode("Modo");
modo.appendChild(textoCelda7)

/*

 var eliminar = document.createElement("button");
eliminar.setAttribute("class","button button1")
eliminar.setAttribute("id",id)
eliminar.setAttribute("onclick","borrar(this.id)")
var textoCelda6 = document.createTextNode("Eliminar Nodo");
eliminar.appendChild(textoCelda6)
*/

//select.appendChild(modo)

//select.appendChild(eliminar)

modal.style.display = "block";


// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];





const checkbox2 = document.getElementById('realtime2')

checkbox2.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
client.publish("nodo1control","auto")
  } else {
client.publish("nodo1control","manual")
  }
})

checked();


// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
   
  }
}


  }



function accion(id)
{




  var strong = id.substring(
   id.lastIndexOf(":") + 1, 
    id.lastIndexOf("/")
);
 var strong2 = id.substring(
    id.lastIndexOf("/") + 1, 
    id.length
);



client.publish(strong+"control",strong2+";")



}



function eventos()
{

    /*
  var $table = $('#table3')

      $table.bootstrapTable('insertRow', {
        index: 1,
        row: {
          var: "T°",
          condi: "=",
          value: 20 ,
          act: "ac1:Ventilador",
          state: "ON"
        }
      })

      */
      // Get the table element in which you want to add row
      let table = document.getElementById("table3");
   
      // Create a row using the inserRow() method and
      // specify the index where you want to add the row
      let row = table.insertRow(-1); // We are adding at the end
      row.setAttribute("id","nuevoevento")
   
      // Create table cells
      let c1 = row.insertCell(0);
      let c2 = row.insertCell(1);
      let c3 = row.insertCell(2);
            let c4 = row.insertCell(3);
                  let c5 = row.insertCell(4);
   





   /*
   <select name="cars" id="cars">
  <option value="volvo">Volvo</option>
  <option value="saab">Saab</option>
  <option value="mercedes">Mercedes</option>
  <option value="audi">Audi</option>
</select>
*/
   
/*
   <input type="text" id="lname" name="lname">

   */



var texto3= document.createTextNode("T°");
c1.appendChild(texto3)



var  select=document.createElement("select")
select.setAttribute("id","condi")
var option1=document.createElement("option")
var option2=document.createElement("option")
var option3=document.createElement("option")
var texto1= document.createTextNode("igual a");
var texto2= document.createTextNode("menor que ");
var texto3= document.createTextNode("mayor que");

option1.appendChild(texto1)
option2.appendChild(texto2)
option3.appendChild(texto3)

select.appendChild(option1)
select.appendChild(option2)
select.appendChild(option3)

c2.appendChild(select)
   
var input=document.createElement("input")
input.setAttribute("type","text")
input.setAttribute("size","4")
input.setAttribute("id","value")
c3.appendChild(input)
/*

*/

var  select2=document.createElement("select")
var act1=document.createElement("option")
var act2=document.createElement("option")
select2.setAttribute("id","act")


var textoact1= document.createTextNode("ACT1");
var textoact2= document.createTextNode("ACT2");


act1.appendChild(textoact1)
act2.appendChild(textoact2)

select2.appendChild(act1)
select2.appendChild(act2)

c4.appendChild(select2)

var  select3=document.createElement("select")

var est1=document.createElement("option")
var est2=document.createElement("option")

select3.setAttribute("id","state")




var textoest1= document.createTextNode("ON");
var textoest2= document.createTextNode("OFF");


est1.appendChild(textoest1)
est2.appendChild(textoest2)

select3.appendChild(est1)
select3.appendChild(est2)

c5.appendChild(select3)


var select = document.getElementById('eventosensor');


select.removeChild(select.lastChild);

add1=document.createElement("button")
add1.setAttribute("class","btn btn-primary")
add1.setAttribute("id","ingresar")
add1.setAttribute("onclick","ingresar()")
 document.getElementById("eventosensor").appendChild(add1);

}



function eventos2()
{

    /*
  var $table = $('#table3')

      $table.bootstrapTable('insertRow', {
        index: 1,
        row: {
          var: "T°",
          condi: "=",
          value: 20 ,
          act: "ac1:Ventilador",
          state: "ON"
        }
      })

      */
      // Get the table element in which you want to add row
      let table = document.getElementById("table2");
   
      // Create a row using the inserRow() method and
      // specify the index where you want to add the row
      let row = table.insertRow(-1); // We are adding at the end
      row.setAttribute("id","nuevoevento")
   
      // Create table cells
      let c1 = row.insertCell(0);
      let c2 = row.insertCell(1);
      let c3 = row.insertCell(2);
            let c4 = row.insertCell(3);
                  let c5 = row.insertCell(4);
   
   /*
   <select name="cars" id="cars">
  <option value="volvo">Volvo</option>
  <option value="saab">Saab</option>
  <option value="mercedes">Mercedes</option>
  <option value="audi">Audi</option>
</select>
*/
   
/*
   <input type="text" id="lname" name="lname">

   */



var texto3= document.createTextNode("T°");
c1.appendChild(texto3)



var  select=document.createElement("select")
select.setAttribute("id","condi")
var option1=document.createElement("option")
var option2=document.createElement("option")
var option3=document.createElement("option")
var texto1= document.createTextNode("igual a");
var texto2= document.createTextNode("menor que ");
var texto3= document.createTextNode("mayor que");

option1.appendChild(texto1)
option2.appendChild(texto2)
option3.appendChild(texto3)

select.appendChild(option1)
select.appendChild(option2)
select.appendChild(option3)

c2.appendChild(select)
   
var input=document.createElement("input")
input.setAttribute("type","text")
input.setAttribute("size","4")
input.setAttribute("id","value")
c3.appendChild(input)
/*

*/

var  select2=document.createElement("select")
var act1=document.createElement("option")
var act2=document.createElement("option")
select2.setAttribute("id","act")


var textoact1= document.createTextNode("ACT1");
var textoact2= document.createTextNode("ACT2");


act1.appendChild(textoact1)
act2.appendChild(textoact2)

select2.appendChild(act1)
select2.appendChild(act2)

c4.appendChild(select2)

var  select3=document.createElement("select")

var est1=document.createElement("option")
var est2=document.createElement("option")

select3.setAttribute("id","state")




var textoest1= document.createTextNode("ON");
var textoest2= document.createTextNode("OFF");


est1.appendChild(textoest1)
est2.appendChild(textoest2)

select3.appendChild(est1)
select3.appendChild(est2)

c5.appendChild(select3)


var select = document.getElementById('eventotiempo');


select.removeChild(select.lastChild);

add1=document.createElement("button")
add1.setAttribute("class","btn btn-primary")
add1.setAttribute("id","ingresar")
add1.setAttribute("onclick","ingresar()")
 document.getElementById("eventotiempo").appendChild(add1);

}














































function ingresar()
{

t=document.getElementById("nuevoevento")


var condicion = document.getElementById("condi");
var value = condicion.value;
var text = condicion.options[condicion.selectedIndex].text;


var accionador = document.getElementById("act");
var value2 = accionador.value2;
var text2 = accionador.options[accionador.selectedIndex].text;


var valor = document.getElementById("value").value;



var state = document.getElementById("state");
var value3 = state.value3;
var text3 = state.options[state.selectedIndex].text;
//var input = getElementById("input")
alert(t.cells[0].innerHTML+text+valor+text2+text3)

  $.ajax({
    url:'/eventosensor',
    method:'POST',
    data: {
           Variable: t.cells[0].innerHTML,
           Condicion: text,
           Valor: valor,
           Accionador: text2,
           Estado: text3
         },

    beforeSend: function(data){
      console.log('Enviando...',data)
    },
  }).done(function(respuesta){
console.log('Respuesta recibida:',respuesta)
console.log(respuesta)
element=document.getElementById("nuevoevento")
element.remove()

var select = document.getElementById('eventosensor');


select.removeChild(select.lastChild);


add1=document.createElement("button")
add1.setAttribute("class","btn btn-success")
add1.setAttribute("onclick","eventos()")

 document.getElementById("eventosensor").appendChild(add1);

  var $table = $('#table3')

      $table.bootstrapTable('insertRow', {
        index: 0,
        row: {
          Variable: t.cells[0].innerHTML,
          Condicion: text,
          Valor: valor,
          Accionador: text2,
          Estado: text3
        }
      })


}).fail(function(err){
    console.log(err)})

}




function ingresar2()
{

t=document.getElementById("nuevoevento")


var condicion = document.getElementById("condi");
var value = condicion.value;
var text = condicion.options[condicion.selectedIndex].text;


var accionador = document.getElementById("act");
var value2 = accionador.value2;
var text2 = accionador.options[accionador.selectedIndex].text;


var valor = document.getElementById("value").value;



var state = document.getElementById("state");
var value3 = state.value3;
var text3 = state.options[state.selectedIndex].text;
//var input = getElementById("input")
alert(t.cells[0].innerHTML+text+valor+text2+text3)

  $.ajax({
    url:'/eventosensor',
    method:'POST',
    data: {
           Variable: t.cells[0].innerHTML,
           Condicion: text,
           Valor: valor,
           Accionador: text2,
           Estado: text3
         },

    beforeSend: function(data){
      console.log('Enviando...',data)
    },
  }).done(function(respuesta){
console.log('Respuesta recibida:',respuesta)
console.log(respuesta)
element=document.getElementById("nuevoevento")
element.remove()

var select = document.getElementById('eventosensor');


select.removeChild(select.lastChild);


add1=document.createElement("button")
add1.setAttribute("class","btn btn-success")
add1.setAttribute("onclick","eventos()")

 document.getElementById("eventosensor").appendChild(add1);

  var $table = $('#table3')

      $table.bootstrapTable('insertRow', {
        index: 0,
        row: {
          Variable: t.cells[0].innerHTML,
          Condicion: text,
          Valor: valor,
          Accionador: text2,
          Estado: text3
        }
      })


}).fail(function(err){
    console.log(err)})

}



function borrar(nodo)
{

 $.ajax({
    url:'/eliminarcentral',
    method:'POST',
    data: {
            id: respuesta2[nodo].id,
         },

    beforeSend: function(data){
      console.log('Enviando...',data)
    },
  }).done(function(respuesta){




    console.log('Respuesta recibida:',respuesta)
    console.log(respuesta)
window.location.reload()


}).fail(function(err){
    console.log(err)
    

  }

    )


}



   $( document ).ready(function() {
      


});



var flag=0;

const checkbox = document.getElementById('realtime')

checkbox.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
 flag=1;
  } else {
   flag=0;
  }
})





var modal = document.getElementById("myModal");

var respuesta2 = [];



function copia(respuesta)
{

respuesta2.push(respuesta)
console.log(respuesta2);

}


var select = document.getElementById('ventana');
var texto= document.createElement("h1");

var texto3= document.createTextNode("alsjdlkjsd");

texto.appendChild(texto3);

select.appendChild(texto);



var modal = document.getElementById("myModal");

var respuesta2 = [];

function copia(respuesta)
{

respuesta2.push(respuesta)
console.log(respuesta2);

}


var select = document.getElementById('ventana');
var texto= document.createElement("h1");

var texto3= document.createTextNode("alsjdlkjsd");

texto.appendChild(texto3);

select.appendChild(texto);
