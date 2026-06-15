const io = require('socket.io-client');

const s = io('http://localhost:8000', { withCredentials: true });

s.on('connect', () => {
  console.log('connected', s.id);
  s.emit('join', { room: 'test-room' });
  s.emit('message', { conversation: 'test-room', text: 'hello from test' });
  setTimeout(() => s.close(), 1000);
});

s.on('message', (m) => console.log('recv', m));

s.on('connect_error', (err) => console.error('connect_error', err));
