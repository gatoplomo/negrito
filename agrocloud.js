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
var bodyParser = require('body-parser');
const moment = require('moment');


var urlencodedParser = bodyParser.urlencoded({extended:true});
const mysql = require('mysql');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Configurar el middleware para analizar el cuerpo de las solicitudes
app.use(bodyParser.urlencoded({ extended: true }));
const cors = require('cors');

app.use(cors());

app.get('/datos', (req, res) => {
const db = client.db(dbName);


const collection = db.collection("grupo");

collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
 res.json(docs);
  });
});



// Crear un pool de conexiones
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'plomo1994',
  database: 'WatchDog'
});

// Función para manejar los errores de conexión y realizar la reconexión
function handleConnectionError(err) {
  console.error('Error en la conexión a la base de datos:', err);
  console.log('Intentando reconectar...');

  // Establecer un tiempo de espera antes de intentar reconectar
  setTimeout(connectToDatabase, 5000);
}

// Función para realizar consultas a la base de datos
function queryDatabase(sql, values, callback) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error al obtener la conexión:', err);
      handleConnectionError(err);
      return;
    }

    connection.query(sql, values, (err, results) => {
      connection.release();

      if (err) {
        console.error('Error en la consulta:', err);
        callback(err, null);
        return;
      }

      callback(null, results);
    });
  });
}

let connection;

// Función para establecer la conexión inicial a la base de datos
function connectToDatabase() {
  pool.getConnection((err, conn) => {
    if (err) {
      console.error('Error al conectar a la base de datos:', err);
      handleConnectionError(err);
      return;
    }

    console.log('Conectado a la base de datos MySQL');

    // Configura el manejo de errores en la conexión
    conn.on('error', handleConnectionError);
    connection = conn; // Asignar la conexión a la variable externa 'connection'
    connection.release();
  });
}

// Establecer la conexión a la base de datos
connectToDatabase();

// Configurar las rutas
app.post('/login', (req, res) => {
  console.log(req.body)
  const username = req.body.username;
  const password = req.body.password;

  console.log(username)
  console.log(password)
  
  const query = 'SELECT * FROM usuarios WHERE nombre = ? AND contraseña = ?';

  connection.query(query, [username, password], (err, result) => {
    if (err) throw err;

    if (result.length === 1) {
      res.send('OK');
      /*
      req.session.username = username
      req.session.password = password;
      req.session.save((err) => {
        if (err) throw err;
        console.log('Datos de sesión guardados en la tabla sessions');
      });*/
    } else {
      res.send('Nombre de usuario o contraseña incorrectos');
    }
  });
});



















var router = express.Router();

var root="/home/tomas/Documentos/GitHub/negrito/Reportes/"
var root2="/home/tomas/Documentos/GitHub/negrito/"


//ruta y Json , funcion que media entre las peticiones y el servidor 


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
const {spawn} = require('child_process');


const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

/*
const options = {                 // setting connection options
    host: 'localhost',
    user: 'root',
    password: 'plomo1994',
    database: 'WatchDog',
    clearExpired: true,
    checkExpirationInterval: 60000, // 1 minuto en milisegundos
    expiration: 60000,             // 1 minuto en milisegundos
};

const sessionStore = new MySQLStore(options);

app.use(
    session({
        secret: 'cookie_secret',
        resave: false,
        saveUninitialized: false,
        store: sessionStore,      // assigning sessionStore to the session
        cookie: {
            maxAge: 60000,       // 1 minuto en milisegundos
        },
    })
);
*/
app.use(express.static('2'));

var path = __dirname + '/';

var customers = [];

/*
var cron = require('node-cron');

// ...
cron.schedule("08 0-23 * * *", function () {
  console.log("---------------------");
  console.log("running a task every 15 seconds");



for (let step = 0; step < centrales.length; step++) {
respaldar(centrales[step])
}

});
*/
var mqtt = require('mqtt')
var client2 = mqtt.connect('mqtt://192.168.239.36:1884', {
  clientId: 'ServerNode'
});
client2.on('connect', function () {
  client2.subscribe('grupo_001', function (err) {
    if (!err) {
     // client2.publish('nodo1', 'Hello mqtt')
    }
  })
})




function respaldar(id_grupo)
{

cantidad=1000;
var dateTime = require('node-datetime');
var dt = dateTime.create();
var formatted = dt.format('Y-m-d H:M:S');
console.log(formatted);
const mongodb = require("mongodb").MongoClient;
const fastcsv = require("fast-csv");
const fs = require("fs");
const ws = fs.createWriteStream(root+id_grupo+"/"+formatted.substring(0,10)+".csv");
 let url = "mongodb://localhost:27017/";
 

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url2 = 'mongodb://localhost:27017';
const dbName = 'myproject';

const client = new MongoClient(url2);

client.connect(function(err) {

 assert.equal(null, err);
  console.log("Connected successfully to server");






mongodb.connect(
  url,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    if (err) throw err;

    client
      .db("myproject")
      .collection("lecturas_grupo_001")
      .find({"rtc_server.fecha":formatted.substring(0,10)})
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
  res.sendFile(path + "login.html");
});

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
    //console.log(docs)
    callback(docs);
  for (let i = 0; i < docs.length; i++) {
//console.log(i);
centrales[i]=docs[i].id;
//console.log(centrales[i]);
}
  });

 

}



var username;
var password;

app.post('/loginapp', async (req, res) => {

  try {
 

    const query = 'SELECT * FROM usuarios WHERE nombre = ? AND contraseña = ?';

    const result = await new Promise((resolve, reject) => {
      connection.query(query, [username, password], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });

    if (result.length === 1) {
      const datos = { 
        status: 'success',
        nombre: username, 
      };
      res.json(datos);
    } else {
      const datos = { status: 'fail' };
      res.json(datos);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});
  
app.post('/grupoapp', (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection("grupo");
  const id_grupo = req.body.id_grupo; // Supongamos que el id_grupo se envía en el cuerpo de la solicitud
  
  collection.find({id_grupo: id_grupo}).toArray(function(err, docs) {
    if (err) throw err;
    console.log(`Found ${docs.length} record(s)`);
    console.log(docs);
    res.json(docs);
   
  });
});
  
  app.post('/gruposapp', (req, res) => {
const db = client.db(dbName);


const collection = db.collection("grupo");

collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
res.json(docs)

  });
console.log("peticion recibida")
});





app.post("/registro",function(req,res)

{
//console.log(req.body);

 const db = client.db(dbName);
const collection = db.collection('documents');
  // Insert some documents
  collection.insertOne(req.body)
res.status(200).send("usuario registrado")



collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    //console.log(docs)

  });

}

  );

var nodo1;
var nodo1b;



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



app.post("/crear_grupo", function(req, res) {
  console.log("Insertando Grupo")
  const db = client.db(dbName);
  const collection = db.collection("grupo");

 const grupo = {
  id_grupo: "grupo_001",
  nodos_grupo: [
    {
      id_nodo: "nodo_001",
      sensores: [
        {
          id_sensor:"sensor_001",
          modelo_sensor: "DTH11",
          variables_sensor: {
            temperatura: true,
            humedad: true
          }
        }
      ],
      accionadores: [
        {
          id_accionador: "accionador_001",
          accion_accionador: "Alarma"
        },
        {
          id_accionador: "accionador_002",
          accion_accionador: "Ventilador"
        }
      ]
    },{
      id_nodo: "nodo_002",
      sensores: [
        {
          id_sensor:"sensor_001",
          modelo_sensor: "DTH11",
          variables_sensor: {
            temperatura: true,
            humedad: true
          }
        }, {
          id_sensor:"sensor_002",
          modelo_sensor: "MQ2",
          variables_sensor: {
            ppm: true
          }
        }
      ], sensores_estado: [
        {
          id_sensor_estado:"sensor_estado_001",
          modelo_sensor_estado: "CONTACT"
        }, {
          id_sensor_estado:"sensor_estado_002",
          modelo_sensor_estado: "PIR"
        }
      ],
      accionadores: [
        {
          id_accionador: "accionador_001",
          accion_accionador: "encender"
        },
        {
          id_accionador: "accionador_002",
          accion_accionador: "apagar"
        }
      ]
    }
  ]
};


  collection.insertOne(grupo, (err, result) => {
    if (err) throw err;
    
    console.log('El objeto "Grupo" ha sido insertado exitosamente en la colección "grupo"');
  });
});




app.post("/grupos",function(req,res)

{

const db = client.db(dbName);


const collection = db.collection("grupo");

collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
res.send(docs)
  });

console.log("peticion recibida")
}
  );







function performAction() {
  console.log('Realizando acción...');
  client2.publish('grupo_001control', 'Reportar');
}

// Ejecutar performAction() cada 3 segundos
setInterval(performAction, 1000);


let procesando = false; // Bandera de procesamiento



client2.on('message', (topic, message) => {
  console.log("mensaje recibido");
  
  if (procesando) {
    console.log('Ignorando mensaje, procesamiento en curso.');
    return;
  }

  console.log("Mensaje recibido en el tópico");
  const db = client.db(dbName);
  try {
    procesando = true; // Activar la bandera de procesamiento

    // Convertir el mensaje MQTT a objeto JavaScript
    const lectura = JSON.parse(message.toString());

    // Obtener la hora y fecha actual
    const fechaActual = moment().format('YYYY-MM-DD');
    const horaActual = moment().format('HH:mm:ss');

    lectura.rtc_server = {
      fecha: fechaActual,
      hora: horaActual
    };

    console.log(lectura.rtc_server.hora);
    console.log(lectura.rtc_server.fecha);

    // Insertar la lectura en MongoDB
    const collection = db.collection('lecturas_grupo_001');
    collection.insertOne(lectura, (err, result) => {
      if (err) {
        console.error(`Error al insertar lectura en MongoDB: ${err}`);
      } else {
        console.log(`Lectura insertada en MongoDB con éxito: ${result}`);
        //performAction();
      }

      procesando = false; // Desactivar la bandera de procesamiento
    });
  } catch (error) {
    console.error(`Error al analizar el JSON: ${error}`);
    procesando = false; // Desactivar la bandera de procesamiento
  }
});



app.post("/lecturas_grupo", function(req, res) {
  const db = client.db(dbName);
  const collection = db.collection("lecturas_grupo_001");

  const requestBody = req.body;
  const fechaBuscada = requestBody.fecha;
  console.log(fechaBuscada);

  // Construye el filtro para buscar la etiqueta "rtc_server" que contiene la etiqueta "fecha" con el valor específico
  const filter = { "rtc_server.fecha": fechaBuscada };

  collection.find(filter).toArray(function(err, docs) {
    assert.equal(err, null);
    //console.log("Found the following records");
    //console.log(docs);
    res.send(docs);
  });

  console.log("Petición recibida");
});






app.post("/actualizar",function(req,res)

{

//const db = client.db(dbName);

//console.log(req.body)
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
    //console.log(docs)

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
 var sensor="lectura1"
 var dataToSend;
console.log(req.body)
 // spawn new child process to call the python script
//var python = spawn('python3', [root2+"filtrar.py",req.body.archivo,req.body.central,cantidad.toString()]);
var python = spawn('python3', [root2+"filtrar.py",req.body.archivo,req.body.central,cantidad.toString()]);
 // collect data from script
 
 var result = '';
 python.stdout.on('data', function (data) {
  console.log('Pipe data from python script ...');
result += data.toString();
//console.log(result)
x=JSON.parse(result)
//console.log(x.length)

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
    //console.log(files)


for (let i = 0; i <files.length; i++) {

//console.log(files[i])

const query = { name: files[i]};
const update = { $set: {id:req.body.central,date:files[i].substring(0,files[i].indexOf(".")),dir:root+req.body.central+"/"+files[i]}};
const options = { upsert: true };
collection.updateOne(query, update, options);

}
//collection.insertOne({id:req.body.central,date:formatted,dir:"/home/tom/cloud/Datos/"+req.body.central+"/"+formatted+"f"+".xlsx"});
//collection.insertOne({id:req.body.central,date:formatted.substring(0,10),time:formatted.substring(11,19),h1:inicio,h2:final,dir:root+req.body.central+"/"+formatted.substring(0,10)+".csv"});



});








//const db = client.db(dbName);
//console.log("directorios"+req.body.central);

collection.find({}).toArray(function(err, docs) {
    //assert.equal(err, null);
    //console.log("Found the following records");
    //console.log(docs)
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
    //console.log(docs)
    //console.log("GATOQL")
res.send(docs)
  });
//console.log(req.body.central);
//console.log("peticion recibida")



}

  );





app.post("/generar",function(req,res)

{
console.log(req.body.id_grupo)
respaldar(req.body.id_grupo) 
}

  );




