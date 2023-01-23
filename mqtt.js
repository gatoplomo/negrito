
var lecturas=[];
var fechas=[];
var seleccion=" "
var directorios=[];


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


const host = 'ws://192.168.0.170:9001' 


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
          
gauges[item] = new RadialGauge({ renderTo: item.toString() ,width: 180,
    height: 210, id:item}).draw()


        }

client.on('message', (topic, message, packet) => {
  //console.log('Received Message: ' + message.toString() + '\nOn topic: ' + topic)
  
var msn=message.toString();
console.log(msn);
//console.log(msn.length)

//console.log(canales[0])
if(message.length<6)
{
for ( var item = 0; item < numero ; item++) {

 if(topic.toString()==canales[item])

 	gauges[item].value = parseFloat(msn)
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


function actualizar()
{
alert("Reset")
client.publish("nodo1control","reset")
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



var select = document.getElementById('monitor2');
var chartconteiner= document.createElement("div")
chartconteiner.setAttribute("class","chart-container")
var chart = document.createElement("canvas")
chart.setAttribute("id","myChart")
chart.setAttribute("height","200")
chart.setAttribute("width","auto")
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
    labels: fechas,
    datasets: [{
      label: "Temperatura nodo 1",
      backgroundColor: window.chartColors.red,
      borderColor: window.chartColors.red,
      data: lecturas,  backgroundColor: [
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



var lecturas3=[]
var fechas3=[]

var nodoanterior="";







function ver(id)
{

localStorage.setItem('nodo', respuesta2[id].id);

console.log("PICHULAAAA")



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




$.ajax({
    url:'/basededatos',
    method:'POST',
    data: {'central':respuesta2[id].id},

    beforeSend: function(data){
      console.log('Enviando...',data)
    },


  }).done(function(respuesta){
console.log(respuesta.reverse())
var $table = $('#table')
var $table2 = $('#table2')
var $table3 = $('#table3')


$table.bootstrapTable('load', respuesta.reverse())
//$table2.bootstrapTable('load', respuesta.reverse())
//$table3.bootstrapTable('load', respuesta.reverse())
}).fail(function(err){
    console.log(err)
    

  }



    )



$.ajax({
    url:'/geteventsensor',
    method:'POST',
    data: {'central':respuesta2[id].id},

    beforeSend: function(data){
      console.log('Enviando...',data)
    },


  }).done(function(respuesta){
console.log(respuesta.reverse())
var $table3 = $('#table3')


$table3.bootstrapTable('load', respuesta.reverse())
//$table2.bootstrapTable('load', respuesta.reverse())
//$table3.bootstrapTable('load', respuesta.reverse())
}).fail(function(err){
    console.log(err)
    

  }
    )




alert("Abriendo.."+respuesta2[id].id)
for (var i = lecturas.length; i > 0; i--) {
 lecturas.pop();
  fechas.pop();
 
}

 myChart.update()

console.log(respuesta2[id].id)

seleccion=respuesta2[id].id



$.ajax({
    url:'/dataget',
    method:'POST',
    data: {'central':respuesta2[id].id,'fecha':today},

    beforeSend: function(data){
      console.log('Enviando...',data)
    },
  }).done(function(respuesta){

   const numero = respuesta.length;
   let nombres = respuesta;


for ( var item = 0; item < numero ; item++) {


lecturas.push(respuesta[item].lectura)
fechas.push(respuesta[item].date.substring(10,20))


        }
console.log(numero)
console.log(lecturas)
console.log(fechas)


var newArray = [];
var newArray2=[];

    function identical(array,array2){

        
        newArray.push(array[0]);
        newArray2.push(array2[0]);
        for(var i = 0; i < array.length -1; i++) {
            if(array2[i].substring(0,3) != array2[i + 1].substring(0,3)) {
                newArray.push(array[i + 1]);
                newArray2.push(array2[i+1]);


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


    identical(lecturas,fechas);

myChart.update();




myChart.update();




}).fail(function(err){
    console.log(err)
    

  }

    )



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

  }

    )

for (var i = lecturas.length; i > 0; i--) {
 lecturas.pop();
  fechas.pop();
  
}
myChart.update()
}

}








client.on('message', (topic, message, packet) => {
  //console.log('Received Message: ' + message.toString() + '\nOn topic: ' + topic)


var today = new Date();
var time = today.getHours() + ":" + today.getMinutes();

if(topic==seleccion && flag==1)
{
var msn=message.toString();
console.log("seleccion"+seleccion)
lecturas.push(msn)
fechas.push(time)
myChart.update();
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


  for (var i = 0; i < 2; i++) {
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
     celda.appendChild(label);
     }
    }
    tblBody.appendChild(hilera);
  }
tabla.appendChild(tblBody)
 select.appendChild(tabla)
  }

 var eliminar = document.createElement("button");
eliminar.setAttribute("class","button button1")
eliminar.setAttribute("id",id)
eliminar.setAttribute("onclick","borrar(this.id)")
var textoCelda6 = document.createTextNode("Eliminar Nodo");
eliminar.appendChild(textoCelda6)

select.appendChild(eliminar)

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
