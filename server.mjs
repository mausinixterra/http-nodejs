import { createServer } from 'http';
import pkg from 'pg';
import dotenv from 'dotenv';

// Cargar las variables de entorno
dotenv.config();

const { Client } = pkg;

// Función para conectarse a la base de datos y hacer una consulta
async function fetchFromDatabase() {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  try {
    await client.connect(); // Conexión a la base de datos
    const result = await client.query('SELECT NOW()'); // Ejemplo de consulta
    return result.rows[0]; // Retornar el resultado de la consulta
  } catch (err) {
    console.error('Error en la consulta a la base de datos:', err);
    return { error: 'Error en la base de datos' };
  } finally {
    await client.end(); // Cerrar conexión
  }
}

// Crear servidor HTTP
createServer(async (req, res) => {
  // Obtener la respuesta desde la base de datos
  const dbResponse = await fetchFromDatabase();

  // Configurar la respuesta HTTP
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  if (dbResponse.error) {
    res.write(`Error: ${dbResponse.error}`);
  } else {
    res.write(`Hello World! Fecha y hora de la base de datos: ${dbResponse.now}`);
  }
  res.end();
}).listen(process.env.PORT || 3000, () => {
  console.log(`Servidor ejecutándose en el puerto ${process.env.DB_PORT || 3000}`);
});
