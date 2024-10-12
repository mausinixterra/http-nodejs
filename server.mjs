import { createServer } from 'http';
import pkg from 'pg'; // Cambia la importación a la importación por defecto
import dotenv from 'dotenv';

// Cargar las variables de entorno
dotenv.config();

// Obtener el Pool del paquete pg
const { Pool } = pkg;

// Configuración del pool de conexiones
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Función para conectarse a la base de datos y hacer una consulta
async function fetchFromDatabase() {
  try {
    const result = await pool.query('SELECT NOW()'); // Consulta para obtener la hora actual
    return result.rows[0]; // Retornar el resultado de la consulta
  } catch (err) {
    console.error('Error en la consulta a la base de datos:', err);
    return { error: 'Error en la base de datos' };
  }
}

// Crear servidor HTTP
createServer(async (req, res) => {
  const dbResponse = await fetchFromDatabase();

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
