const net = require('net');

const LOCAL_PORT = 3000;
const TARGET_PORT = parseInt(process.argv[2], 10);

if (!TARGET_PORT) {
  console.error('Usage: node proxy.js <target_port>');
  process.exit(1);
}

const server = net.createServer((clientSocket) => {
  const targetSocket = net.connect(TARGET_PORT, 'localhost', () => {
    clientSocket.pipe(targetSocket);
    targetSocket.pipe(clientSocket);
  });

  targetSocket.on('error', (err) => {
    console.error('Target socket error:', err.message);
    clientSocket.end();
  });

  clientSocket.on('error', (err) => {
    console.error('Client socket error:', err.message);
    targetSocket.end();
  });
});

server.listen(LOCAL_PORT, () => {
  console.log(`TCP proxy listening on port ${LOCAL_PORT} and forwarding to ${TARGET_PORT}`);
});
