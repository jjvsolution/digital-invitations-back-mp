const http = require('http');
const url = require('url');
const { google } = require('googleapis');
require('dotenv').config();

const clientId = process.env.GOOGLE_CLIENT_ID || process.argv[2];
const clientSecret = process.env.GOOGLE_CLIENT_SECRET || process.argv[3];

if (!clientId || !clientSecret) {
  console.error(
    '\n❌ Debes configurar GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET en .env o pasarlos como argumentos:',
  );
  console.error('   node scripts/get-refresh-token.js <CLIENT_ID> <CLIENT_SECRET>\n');
  process.exit(1);
}

const PORT = 3456;
const redirectUri = `http://localhost:${PORT}/oauth2callback`;

const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: ['https://www.googleapis.com/auth/drive'],
});

const server = http.createServer(async (req, res) => {
  try {
    const queryObject = url.parse(req.url, true).query;
    if (queryObject.code) {
      const { tokens } = await oauth2Client.getToken(queryObject.code);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h2>¡Autenticacion exitosa! Puedes cerrar esta pestana y volver a la terminal.</h2>');
      server.close();
      console.log('\n✅ ¡Tokens obtenidos correctamente!\n');
      console.log('Agrega esta variable a tu .env (en local y en el servidor):\n');
      console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}\n`);
      process.exit(0);
    }
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Error al obtener tokens: ' + error.message);
    console.error('Error:', error);
    process.exit(1);
  }
});

server.listen(PORT, () => {
  console.log('\n======================================================');
  console.log('  OBTENCION DE REFRESH TOKEN PARA GOOGLE DRIVE');
  console.log('======================================================');
  console.log('\n1. Asegurate de tener configurada esta URI en "URIs de redireccionamiento autorizados" de tu credencial OAuth en Google Cloud:');
  console.log(`   👉 ${redirectUri}\n`);
  console.log('2. Abre el siguiente enlace en tu navegador:');
  console.log(`   👉 ${authUrl}\n`);
  console.log('Esperando autorizacion...');
});
