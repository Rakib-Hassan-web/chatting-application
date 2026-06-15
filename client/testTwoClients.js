const io = require('socket.io-client');

const s1 = io('http://localhost:8000', { withCredentials: true });
const s2 = io('http://localhost:8000', { withCredentials: true });

s1.on('connect', () => {
  console.log('s1 connected', s1.id);
  s1.emit('join', { room: 'room-42' });
  setTimeout(() => {
    s1.emit('message', { conversation: 'room-42', text: 'hello from s1' });
  }, 500);
});

s2.on('connect', () => {
  console.log('s2 connected', s2.id);
  s2.emit('join', { room: 'room-42' });
});

s1.on('message', (m) => console.log('s1 recv', m));
s2.on('message', (m) => console.log('s2 recv', m));

setTimeout(() => {
  s1.close();
  s2.close();
}, 2000);
