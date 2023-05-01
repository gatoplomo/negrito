const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

app.get('/datos', (req, res) => {
  const datos = {
    nombre: 'Juan',
    edad: 25,
    ocupacion: 'Desarrollador'
  };

  res.json(datos);
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});