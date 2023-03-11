const express = require('express')
const app = express()

//PUERTO A UTILIZAR PARA SERVER
const port = 3000

//EJS
let ejs = require('ejs');
app.use(express.static('./'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.set('views',__dirname+'/');



// Require library
var xl = require('excel4node');
 






var router = express.Router();

var root="/home/tomas/Documentos/GitHub/negrito/Datos2/"
var root2="/home/tomas/Documentos/GitHub/negrito/"


//ruta y Json , funcion que media entre las peticiones y el servidor 

var bodyParser = require('body-parser');


var urlencodedParser = bodyParser.urlencoded({extended:true});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
const {spawn} = require('child_process');



app.use(express.static('2'));

var path = __dirname + '/';

var customers = [];


var cron = require('node-cron');

// ...
cron.schedule("08 0-23 * * *", function () {
  console.log("---------------------");
  console.log("running a task every 15 seconds");



for (let step = 0; step < centrales.length; step++) {
respaldar(centrales[step])
}




});

var mqtt = require('mqtt')
var client2  = mqtt.connect('mqtt://192.168.69.36:1884')
 



client2.on('connect', function () {


  client2.subscribe('nodo1', function (err) {
    if (!err) {
     // client2.publish('nodo1', 'Hello mqtt')
    }
  })

client2.subscribe('nodo2', function (err) {
    if (!err) {
      //client2.publish('nodo2', 'Hello mqtt')
    }
  })

client2.subscribe('nodo3', function (err) {
    if (!err) {
      //client2.publish('nodo2', 'Hello mqtt')
    }
  })
client2.subscribe('nodo1evento', function (err) {
    if (!err) {
      //client2.publish('nodo2', 'Hello mqtt')
    }
  })

})

function respaldar(nodo)
{



cantidad=1000;


var dateTime = require('node-datetime');
var dt = dateTime.create();
var formatted = dt.format('Y-m-d H:M:S');
console.log(formatted);


const mongodb = require("mongodb").MongoClient;
const fastcsv = require("fast-csv");
const fs = require("fs");


//const ws = fs.createWriteStream("/home/tom/cloud/Datos2/"+req.body.central+"/"+formatted+".csv");
const ws = fs.createWriteStream(root+nodo+"/"+formatted.substring(0,10)+".csv");
 let url = "mongodb://localhost:27017/";
 



//MONGO DB
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');




const url2 = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myproject';

// Create a new MongoClient
const client = new MongoClient(url2);

// Use connect method to connect to the Server
client.connect(function(err) {

 assert.equal(null, err);
  console.log("Connected successfully to server");

//console.log(req.body.central)
// Node.js program to demonstrate 
// the fsPromises.mkdir() Method 
    
// Include fs and path module 
var inicio="";
var final="";
mongodb.connect(
  url,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    if (err) throw err;

    client
      .db("myproject")
      .collection(nodo)
      //.find({"fecha":formatted.substring(0,10)})
      .find({"fecha":formatted.substring(0,10)})
      .toArray((err, data) => {
        if (err) throw err;
        //mandar(cantidad,req.body.central)
        fastcsv
          .write(data, { headers: true})
          .on("finish", function() {
            console.log("Exportación lista");
          })
          .pipe(ws);

      });




  }
);

});












}

app.get("/",function(req,res){
  res.sendFile(path + "cover.html");
});



//Jquery



//ESCUCHA PUERTO
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

 

//MONGO DB
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');




const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myproject';

// Create a new MongoClient
const client = new MongoClient(url);

// Use connect method to connect to the Server
client.connect(function(err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);
 /*

 
 insertDocuments(db, function() {
 
 });
*/
 findDocuments(db, function() {
  });
});




//FUNCION INSERTAR DOCUMENTO
const insertDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}

 let centrales = []
//FUNCION RECOLECTAR DATOS



const findDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('nodos');
  // Find some documents

 

  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  for (let i = 0; i < docs.length; i++) {
console.log(i);
centrales[i]=docs[i].id;
console.log(centrales[i]);
}
  });

 

}



app.post("/registro",function(req,res)

{
console.log(req.body);

 const db = client.db(dbName);
const collection = db.collection('documents');
  // Insert some documents
  collection.insertOne(req.body)
res.status(200).send("usuario registrado")



collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)

  });

}

  );



app.post("/login",function(req,res)

{


console.log(req.body)


 const db = client.db(dbName);
const collection = db.collection('documents');


collection.find(req.body).toArray(function(err, docs) {
    assert.equal(err, null);


    console.log("Found the following records");
    console.log(docs)
     console.log(docs.length)

if(docs.length==0)
{
res.send("False")
  console.log("usuario no registrado");

}
else
{

res.send("True")

}



  });

}

  );



var nodo1;
var nodo1b;




app.post("/crearcentral",function(req,res)

{

console.log(req.body.id.toString())

const db = client.db(dbName);
    const collection = db.collection('nodos');

  collection.insertOne({id:req.body.id.toString(),info:req.body.info.toString(),act1:req.body.act1.toString(),act2:req.body.act2.toString()});
//const fsPromises = fs.promises;
  
/*  
fsPromises.mkdir('C:/Users/idcla/Documents/GitHub/propal/Datos/'+req.body.id.toString()).then(function() {
    console.log('Directory created successfully');
}).catch(function() {
    console.log('failed to create directory');
});
*/
}

  );



app.post("/eventosensor",function(req,res)

{

//console.log(req.body.Variable.toString())

const db = client.db(dbName);
const collection = db.collection('eventosensor');

collection.insertOne({Variable:req.body.Variable.toString(),Condicion:req.body.Condicion.toString(),Valor:req.body.Valor.toString(),Accionador:req.body.Accionador.toString(),Estado:req.body.Estado.toString()});




//const fsPromises = fs.promises;
  
/*  
fsPromises.mkdir('C:/Users/idcla/Documents/GitHub/propal/Datos/'+req.body.id.toString()).then(function() {
    console.log('Directory created successfully');
}).catch(function() {
    console.log('failed to create directory');
});
*/

res.send("Evento Registrado")


}

  );




app.post("/eliminarcentral",function(req,res)

{

console.log(req.body.id.toString())

const db = client.db(dbName);
    const collection = db.collection('nodos');

  collection.deleteOne({id:req.body.id.toString(),});
//const fsPromises = fs.promises;
  
/*  
fsPromises.mkdir('C:/Users/idcla/Documents/GitHub/propal/Datos/'+req.body.id.toString()).then(function() {
    console.log('Directory created successfully');
}).catch(function() {
    console.log('failed to create directory');
});
*/
  res.send("Nodo Borrado")
}

  );


app.post("/nodos",function(req,res)

{

const db = client.db(dbName);


const collection = db.collection('nodos');

collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
res.send(docs)
  });

console.log("peticion recibida")
}

  );


app.post("/eventos",function(req,res)

{

const db = client.db(dbName);


const collection = db.collection('nodo1eventos');

collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
res.send(docs)
  });

console.log("peticion recibida")
}

  );





app.post("/dataget",function(req,res)

{

const db = client.db(dbName);
console.log(req.body.central);
console.log(req.body.fecha);
const collection = db.collection(req.body.central);
fecha=req.body.fecha
console.log(fecha)
collection.find({"fecha":fecha}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    //console.log(docs)
res.send(docs)
  });

console.log("peticion recibida")
}

  );





app.post("/timers",function(req,res)

{

/*
const db = client.db(dbName);


const collection = db.collection('nodos');

collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
res.send(docs)
  });

*/
const db = client.db(dbName);
    const collection = db.collection('timernodo1a');

collection.insertOne(req.body);


res.send("hola");
console.log(req.body)

console.log("peticion recibida")
 

}

  );



app.post("/tomers",function(req,res)

{

const db = client.db(dbName);


const collection = db.collection('eventosensor');

collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)

     res.setHeader('Content-Type', 'application/json');
   res.json(docs);


//res.send(docs)
  });

console.log("peticion recibida")
}

  );







app.post("/actualizar",function(req,res)

{

//const db = client.db(dbName);

console.log(req.body)
//const collection = db.collection('timernodo1a');

//collection.find({}).toArray(function(err, docs) {
    //assert.equal(err, null);
    //console.log("Found the following records");
    //console.log(docs)

     //res.setHeader('Content-Type', 'application/json');
   //res.send("Respondiendo desde server");

   console.log("Nodo respondiendo")
const db = client.db(dbName);


const collection = db.collection('eventosensor');

collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)

     res.setHeader('Content-Type', 'application/json');
   res.json(docs);


//res.send(docs)
  });



  //});
}

  );





app.post("/limpiar",function(req,res)

{

console.log("limpiaar");
console.log(req.body)
const db = client.db(dbName);
console.log(req.body.central);
const collection = db.collection(req.body.central);
collection.deleteMany({});

console.log("peticion recibida")

}

  );




app.post("/single",function(req,res)

{
console.log("hola");

res.download(req.body.id);
console.log(req.body.id)
}

  );

app.post('/filtrar', (req, res) => {
 var cantidad=300;
 var dataToSend;
console.log(req.body)
 // spawn new child process to call the python script
var python = spawn('python3', [root2+"filtrar.py",req.body.archivo,req.body.central,cantidad.toString()]);
 // collect data from script
 
 var result = '';
 python.stdout.on('data', function (data) {
  console.log('Pipe data from python script ...');
result += data.toString();
console.log(result)
x=JSON.parse(result)
console.log(x.length)

dataToSend=x

 });
 // in close event we are sure that stream from child process is closed
 python.on('close', (code) => {
 console.log(`child process close all stdio with code ${code}`);
 // send data to browser
 res.send(dataToSend)
 });
 
})



app.post("/basededatos",function(req,res)

{
  var fecha= new Date();
 var hora_actual = Date.now();


var dateTime = require('node-datetime');
var dt = dateTime.create();
var formatted = dt.format('Y-m-d H:M:S');


const fastcsv = require("fast-csv");
const fs = require("fs");

const dir = root+"/nodo2";

//requiring path and fs modules
const path = require('path');

//joining path of directory 
const directoryPath = path.join(__dirname, "/Datos2/"+req.body.central);
//passsing directoryPath and callback function

 
const db = client.db(dbName);
//const collection = db.collection('directorios'+req.body.central);
const collection = db.collection('directorios'+req.body.central);


fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    console.log(files)


for (let i = 0; i <files.length; i++) {

console.log(files[i])

const query = { name: files[i]};
const update = { $set: {id:req.body.central,date:files[i].substring(0,files[i].indexOf(".")),dir:root+req.body.central+"/"+files[i]}};
const options = { upsert: true };
collection.updateOne(query, update, options);

}
//collection.insertOne({id:req.body.central,date:formatted,dir:"/home/tom/cloud/Datos/"+req.body.central+"/"+formatted+"f"+".xlsx"});
//collection.insertOne({id:req.body.central,date:formatted.substring(0,10),time:formatted.substring(11,19),h1:inicio,h2:final,dir:root+req.body.central+"/"+formatted.substring(0,10)+".csv"});



});








//const db = client.db(dbName);
console.log("directorios"+req.body.central);

collection.find({}).toArray(function(err, docs) {
    //assert.equal(err, null);
    //console.log("Found the following records");
    console.log(docs)
    //console.log("GATOQL")
res.send(docs)
  });

console.log("peticion recibida")



}

  );



app.post("/geteventsensor",function(req,res)

{

 const db = client.db(dbName);
//const collection = db.collection('directorios'+req.body.central);
const collection = db.collection("eventosensor");


collection.find({}).toArray(function(err, docs) {
    //assert.equal(err, null);
    //console.log("Found the following records");
    console.log(docs)
    //console.log("GATOQL")
res.send(docs)
  });
console.log(req.body.central);
console.log("peticion recibida")



}

  );















client2.on('message', function (topic, message , nodo1 , nodo1b) {
  // message is Buffer



for (let i = 0; i <centrales.length; i++) {

   if(topic==centrales[i])
  {
  //console.log(message.toString())
const db = client.db(dbName);
  const collection = db.collection(centrales[i]);
  // Insert some documents

  var fecha= new Date();
 var hora_actual = Date.now();


var dateTime = require('node-datetime');
var dt = dateTime.create();
var formatted = dt.format('Y-m-d H:M:S');

const obj = JSON.parse(message);
console.log(obj)
console.log(obj.Lectura)
//console.log(topic+" "+"Fecha:"+" "+formatted+" "+"Lectura:"+" "+message.toString());

collection.insertOne({lectura:obj.Lectura,date: formatted,fecha:obj.Fecha,hora:obj.Hora});


}
else if (topic==centrales[i]+"evento")
{


  var fecha= new Date();
 var hora_actual = Date.now();


var dateTime = require('node-datetime');
var dt = dateTime.create();
var formatted = dt.format('Y-m-d H:M:S');

const db = client.db(dbName);
const collection2 = db.collection(centrales[i]+"eventos");
const obj = JSON.parse(message);
console.log(obj)

collection2.insertOne({Evento:obj.Evento,Generado_por:obj.Generado_por,Date: formatted,Fecha:obj.Fecha,Hora:obj.Hora,Accionador:obj.Accionador,Funcion:obj.Funcion,Funcion:obj.Funcion,Estado:obj.Estado,Info:obj.Info});
}


}


})




app.post("/generar",function(req,res)

{

respaldar(req.body.central)

 
}

  );




