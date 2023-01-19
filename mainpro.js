

$( document ).ready(function() {
  $.ajax({
    url:'/nodos',
    method:'POST',
    datatype:"JSON",
    contentType: "application/json",
    beforeSend: function(data){
      console.log('Enviando...',data)
    },
  }).done(function(respuesta){
    const numero = respuesta.length;
    let nombres = respuesta;
    const canales=[];
    console.log('Respuesta recibida:',respuesta)
    console.log(respuesta)
    console.log(respuesta.length)

    //ORDENAR

for ( var item = 0; item < numero ; item++) {
copia(respuesta[item]);
            var canv = document.createElement("canvas");
            var division= document.createElement("div");
            division.setAttribute("class","align-center")
            division.setAttribute("style" , "display:inline-block") 
            var salto= document.createElement("br")
            var porte= document.createElement("h1")
            var newContent3 = document.createTextNode(respuesta[item].id);
            porte.appendChild(newContent3)
            document.getElementById("monitor").appendChild(division);
            canv.setAttribute('width', 400);
            canv.setAttribute('height', 400);
            canv.setAttribute('id', item);
            canales.push(nombres[item].id)     

                 
var body = document.getElementsByTagName("body")[0];
var tabla   = document.createElement("table");
tabla.setAttribute("id","tabla"+respuesta[item].id)
var tblBody = document.createElement("tbody");
var hilera1 = document.createElement("tr");
var textoCelda = document.createTextNode(respuesta[item].id);  
var celda = document.createElement("td");



led=document.createElement("div")
led.setAttribute("class","green led")




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
var textoCelda3= document.createTextNode(respuesta[item].info);
celda3.appendChild(textoCelda3);
hilera3.appendChild(celda3)
var hilera4 = document.createElement("tr");
var celda4= document.createElement("td");
 var ul = document.createElement("ul");
 var li = document.createElement("li");
 var a1 = document.createElement("a");
 a1.setAttribute("id",item);
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
 celda4.appendChild(ul)
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




comu(canales,numero);

(function($) {
    $.fn.selected = function(fn) {
        return this.each(function() {
            var clicknum = 0;
            $(this).click(function() {
                clicknum++;
                if (clicknum == 1) {
                    clicknum = 0;
                    fn(this);
                }
            });
        });
    }
})(jQuery);


$('#test').selected(function() {
    console.log("prueba")
    comu2(canales,numero);
});



$('#test2').selected(function() {
    console.log("prueba")
    comu3(canales,numero);
});

}).fail(function(err){
    console.log(err)
    

  }

    )

 alert("Bienvenido a la sala de monitoreo")



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
    field: 'id',
    title: 'Nodo'
  }

  , {
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


















});





//FUNCION PARA GENERAR CSV POR NODO MEDIANTE BOTÖN
function generar()
{9

$( document ).ready(function() {

  $.ajax({
    url:'/generar',
    method:'POST',
    data: {'central':localStorage.getItem("nodo")},
    beforeSend: function(data){
      console.log('Enviando...',data)
    },


  }).done(function(respuesta){

    const numero = respuesta.length;
    let nombres = respuesta;
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




