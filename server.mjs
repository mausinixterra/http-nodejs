// Importar las librerías necesarias
import { createServer } from 'http';
import pkg from 'pg';
import dotenv from 'dotenv';

// Cargar las variables de entorno
dotenv.config();

const { Client } = pkg;

// Configuración del cliente de PostgreSQL
const client = new Client({
  user: 'postgres.cxpwmwmnmzgketvxrogb',          // Usuario de la base de datos
  host: 'aws-0-us-west-1.pooler.supabase.com',           // Dirección del servidor PostgreSQL
  database: 'postgres', // Nombre de la base de datos
  password: '@Dvrspt_112233*',     // Contraseña del usuario
  port: process.env.PORT,                  // Puerto por defecto de PostgreSQL
});

// Función para conectarse a la base de datos y hacer una consulta
async function fetchFromDatabase() {
  try {
    await client.connect(); // Conexión a la base de datos
    const result = await client.query('SELECT NOW()'); // Ejemplo de consulta
    await client.end(); // Cerrar conexión
    return result.rows[0]; // Retornar el resultado de la consulta
  } catch (err) {
    console.error('Error en la consulta a la base de datos:', err);
    return { error: 'Error en la base de datos' };
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
  console.log(`Servidor ejecutándose en el puerto ${process.env.PORT || 3000}`);
});
