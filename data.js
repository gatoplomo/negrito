$(document).ready(function() {
  $.ajax({
    url: '/collections',
    method: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    beforeSend: function() {
      console.log('Enviando datos al servidor...');
    }
  }).done(function(respuesta) {
    console.log('Respuesta del servidor:', respuesta);

    // Crear un arreglo de objetos para los datos de la tabla
    var directorios = respuesta.map(function(nombre) {
      return { collection: nombre };
    });

    // Inicializar la tabla con los datos obtenidos
    $('#tabla_collections').bootstrapTable({
      pagination: true, // Activar paginación
      pageSize: 4, // Número de elementos por página
      search: false,
      columns: [
        {
          field: 'collection',
          title: 'Colecciones',
          events: {
            'click .row-click': function(e, value, row, index) {
              // Crear el objeto JSON con la clave "collection" y el contenido de la fila seleccionada
              var jsonData = {
                collection: row.collection
              };

              // Enviar la información del elemento clickeado al servidor
              $.ajax({
                url: '/abrir_collection',
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(jsonData),  // Enviar el objeto JSON en los datos
                beforeSend: function() {
                  console.log('Enviando datos al servidor...');
                }
              }).done(function(respuesta) {
                console.log('Respuesta del servidor:', respuesta);

                // Generar la tabla dinámicamente con los datos recibidos del servidor
                var tablaColumns = [];
                var tablaData = [];

                // Obtener las claves del primer objeto en la respuesta como encabezados de columna
                var keys = Object.keys(respuesta[0]);
                keys.forEach(function(key) {
                  tablaColumns.push({ field: key, title: key });
                });

// Convertir los objetos de la respuesta en objetos con las claves y valores correspondientes para los datos de la tabla
respuesta.forEach(function(objeto) {
  var rowData = {};
  keys.forEach(function(key) {
    if (key === 'rtc_nodo' || key === 'rtc_server' || key === 'nodos' || key === 'nodos_grupo') {
      rowData[key] = JSON.stringify(objeto[key]); // Aplicar JSON.stringify() para convertir el objeto a cadena
    } else {
      rowData[key] = objeto[key];
    }
  });
  tablaData.push(rowData);
});

                // Inicializar la tabla dinámica con paginación
                $('#tabla_resultado').bootstrapTable('destroy').bootstrapTable({
                  columns: tablaColumns,
                  data: tablaData,
                  pagination: true, // Activar paginación
                  pageSize: 4 // Número de elementos por página
                });
              });
            }
          },
          formatter: function(value, row, index) {
            // Agregar una clase CSS a la fila para el estilo de cursor
            return '<div class="row-click">' + value + '</div>';
          }
        }
      ],
      data: directorios
    });
  });

  var $tabla_collections = $('#tabla_collections');
});
