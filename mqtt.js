











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


const host = 'ws://192.168.80.104:9001' 


console.log('Connecting mqtt client')
const client = mqtt.connect(host, options)

client.on('error', (err) => {
  console.log('Connection error: ', err)
  //client.end()
})

client.on('reconnect', () => {
  console.log('Reconnecting...')
})



client.on('connect', () => {
  console.log('Client connected:' + clientId)
  // Subscribe

  
})







client.on('message', (topic, message, packet) => {
  //console.log('Received Message: ' + message.toString() + '\nOn topic: ' + topic)
  
var msn=message.toString();
console.log(msn);
console.log(topic);
console.log(respuesta2[0].id+"reporte");
console.log(msn.length)



console.log(respuesta2);
console.log(respuesta2.length)


for (let i = 0; i < respuesta2.length; i++) {
if(respuesta2[i].id+"reporte"==topic)

{
console.log("match");
console.log(i);


if(message.toString()=="BoffAoff")
{


  console.log(respuesta2[i].id+"/B");
  var delayInMilliseconds = 500; //1 second


setTimeout(function() {
  //your code to be executed after 1 second
 //alert("**Mensaje desde la Central**: Actualizando Estados")
}, delayInMilliseconds);

// Check
document.getElementById(":"+respuesta2[i].id+"/Accionador0").checked = false;
document.getElementById(":"+respuesta2[i].id+"/Accionador1").checked = false;

}
else if (message.toString()=="BonAoff")
{


  console.log(respuesta2[i].id+"/B");
  var delayInMilliseconds = 500; //1 second

setTimeout(function() {
  //your code to be executed after 1 second
  //alert("**Mensaje desde la Central**: Actualizando Estados")
}, delayInMilliseconds);

// Check
document.getElementById(":"+respuesta2[i].id+"/Accionador0").checked = false;
document.getElementById(":"+respuesta2[i].id+"/Accionador1").checked = true;
}

else if (message.toString()=="BoffAon")
{


  console.log(":"+respuesta2[i].id+"/Accionador0");
  var delayInMilliseconds = 500; //1 second

setTimeout(function() {
  //your code to be executed after 1 second
  //alert("**Mensaje desde la Central**: Actualizando Estados")
}, delayInMilliseconds);

// Check
document.getElementById(":"+respuesta2[i].id+"/Accionador0").checked = true;
document.getElementById(":"+respuesta2[i].id+"/Accionador1").checked = false;
}
else if (message.toString()=="BonAon")
{


  console.log(respuesta2[i].id+"/B");
  var delayInMilliseconds = 500; //1 second

setTimeout(function() {
  //your code to be executed after 1 second
  //alert("**Mensaje desde la Central**: Actualizando Estados")
}, delayInMilliseconds);

// Check
document.getElementById(":"+respuesta2[i].id+"/Accionador0").checked = true;
document.getElementById(":"+respuesta2[i].id+"/Accionador1").checked = true;
}
}}})





function comu(canales,numero)
{
  let canales2=[];
canales2=canales;

var gauges=[];

for ( var item = 0; item < numero ; item++) {

 client.subscribe(canales[item], { qos: 0 })
 client.subscribe(canales[item]+"reporte", { qos: 0 })
          
gauges[item] = new RadialGauge({ renderTo: item.toString() ,width: 200,
    height: 210, id:item}).draw()


        }

client.on('message', (topic, message, packet) => {
  //console.log('Received Message: ' + message.toString() + '\nOn topic: ' + topic)
  
var msn=message.toString();
console.log(msn);
console.log(msn.length)

//console.log(canales[0])
if(message.length<6)
{
for ( var item = 0; item < numero ; item++) {

 if(topic.toString()==canales[item])

 	gauges[item].value = parseInt(msn)
 //console.log(canales[item]);

        }
}



})


}






function comu2(canales,numero)
{
  let canales3=[];
canales3=canales;


for ( var item = 0; item < numero ; item++) {

 client.publish(canales3[item],"80")


        }


}



function comu3(canales,numero)
{

   let canales4=[];
canales4=canales;


for ( var item = 0; item < numero ; item++) {

 client.publish(canales4[item],"0")


        }




}



 
function doalert(checkboxElem,canales,numero) {


let canales2=[];
canales2=canales;




for ( var item = 0; item < numero ; item++) {

 client.subscribe(canales[item], { qos: 0 })
client.subscribe(canales[item]+"reporte", { qos: 0 })

        }








client.on('message', (topic, message, packet) => {
  //console.log('Received Message: ' + message.toString() + '\nOn topic: ' + topic)



})


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
  
    alert(strong2+"#ON;")
    client.publish(mySubString,strong2+"#ON;")
    //console.log(mySubString,checkboxElem.id+"#ON;")
   
  } else {
    alert(strong2+"#OFF");

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


var kabur=0;






var select = document.getElementById('monitor2');


var chartconteiner= document.createElement("div")
chartconteiner.setAttribute("class","chart-container")


var chart = document.createElement("canvas")
chart.setAttribute("id","myChart")


chart.setAttribute("height","200")
chart.setAttribute("width","auto")
chartconteiner.appendChild(chart)



select.appendChild(chartconteiner)

const plugin = {
  id: 'custom_canvas_background_color',
  beforeDraw: (chart) => {
    const {ctx} = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  }
};

var lecturas=[];
var fechas=[];
var seleccion=" "


var ctx = document.getElementById('myChart');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: fechas,
        datasets: [{
            label: 'Real Time',
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
    },plugins: [plugin],
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});




function abrir2(id)
{

/*
for (var i = lecturas.length; i > 0; i--) {
 lecturas.pop();
  fechas.pop();
  myChart.update()
}
*/
console.log(respuesta2[id].id)
seleccion=respuesta2[id].id
$.ajax({
    url:'/dataget',
    method:'POST',
    data: {'central':respuesta2[id].id},

    beforeSend: function(data){
      console.log('Enviando...',data)
    },
  }).done(function(respuesta){

   const numero = respuesta.length;
   let nombres = respuesta;


for ( var item = 0; item < numero ; item++) {


lecturas.push(respuesta[item].lectura)
fechas.push(respuesta[item].hora)
myChart.update();

        }





}).fail(function(err){
    console.log(err)
    

  }

    )



 alert("Base de datos descargada")







//modal.style.display = "block";



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

  }

    )

for (var i = lecturas.length; i > 0; i--) {
 lecturas.pop();
  fechas.pop();
  myChart.update()
}

}

}


client.on('message', (topic, message, packet) => {
  //console.log('Received Message: ' + message.toString() + '\nOn topic: ' + topic)


var today = new Date();
var time = today.getHours() + ":" + today.getMinutes();

if(topic==seleccion)
{
var msn=message.toString();
console.log("seleccion"+seleccion)
lecturas.push(msn)
fechas.push(time)

}
myChart.update();
})









function abrir4(id)
{



var select = document.getElementById('ventana');

while (select.firstChild) {
  select.removeChild(select.firstChild);
}

var titulo=document.createTextNode("Accionador A")
//select.appendChild(titulo)
//select.appendChild(label)


// Crea un elemento <table> y un elemento <tbody>
  var tabla   = document.createElement("table");
  var tblBody = document.createElement("tbody");
 // Crea las celdas+
//


for (var x = 0; x < 2; x++) {
//botón 1
var newContent1 = document.createTextNode("ON");
var newContent2 = document.createTextNode("OFF");

 var check= document.createElement("input");
            check.setAttribute('type', "checkbox")
            check.setAttribute('id',":"+respuesta2[id].id+"/"+"Accionador"+x)
             check.setAttribute('onchange', "doalert(this)")

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


  for (var i = 0; i < 4; i++) {
    
    // Crea las hileras de la tabla
    var hilera = document.createElement("tr");

    for (var j = 0; j < 1; j++) {
      // Crea un elemento <td> y un nodo de texto, haz que el nodo de
      // texto sea el contenido de <td>, ubica el elemento <td> al final
      // de la hilera de la tabla
      var celda = document.createElement("td");
     // var textoCelda = document.createTextNode("celda en la hilera "+i+", columna "+j);
      //celda.appendChild(textoCelda);
      hilera.appendChild(celda);


     if(i==0)
     {

     var textoCelda = document.createTextNode("Accionador"+x+": Luz de emergencia");
     celda.appendChild(textoCelda);
     
     }


if(i==1)
     {

     celda.appendChild(label);

     }


if(i==2)
     {

    
   var textoCelda = document.createTextNode("12:00");
     celda.appendChild(textoCelda);

     

     }


if(i==3)
     {

      
    var textoCelda = document.createTextNode("MAX:MIN:LLAMADA");
     celda.appendChild(textoCelda);

     }




    }

    // agrega la hilera al final de la tabla (al final del elemento tblbody)
    tblBody.appendChild(hilera);
  }
tabla.appendChild(tblBody)
 select.appendChild(tabla)
 

  }

 var detalles3 = document.createElement("button");
detalles3.setAttribute("class","button button1")
detalles3.setAttribute("id","hola22")
detalles3.setAttribute("onclick","location.href=Configurar_Centrales.html")

 

var textoCelda5 = document.createTextNode("Configurar");
detalles3.appendChild(textoCelda5)
select.appendChild(detalles3)
document.getElementById("hola22").onclick = function () {
        location.href = "Configuracion_Centrales.html";
    };
  modal.style.display = "block";


// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];


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









  function abrir3(id)
{

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];


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

var select = document.getElementById('ventana');



while (select.firstChild) {
  select.removeChild(select.firstChild);
}

var evento=document.createElement("input");
evento.setAttribute("type","button");
evento.setAttribute("value","Añadir Evento de Tiempo");
evento.setAttribute("onclick","simplepicker.open();")

var trigger=document.createElement("input");


trigger.setAttribute("type","button");
trigger.setAttribute("value","Añadir Evento de Sensor");
trigger.setAttribute("onclick","insertar2();")


var guardar=document.createElement("input");


guardar.setAttribute("type","button");
guardar.setAttribute("value","Guardar");
guardar.setAttribute("onclick","obtener(this.id);")
guardar.setAttribute("id",id);

var dov= document.createElement("div");
dov.setAttribute("id","eventos");



select.appendChild(dov);

let table = document.createElement('table');
let thead = document.createElement('thead');
let tbody = document.createElement('tbody');

table.appendChild(thead);
table.appendChild(tbody);

document.getElementById('ventana').appendChild(table);

modal.style.display = "block";

genera();

select.appendChild(evento)
genera_tabla2()
select.appendChild(trigger)
select.appendChild(guardar)

}







