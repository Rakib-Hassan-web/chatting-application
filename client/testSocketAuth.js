const axios = require('axios')
const io = require('socket.io-client')

const SERVER = 'http://localhost:8000'

async function run() {
  try {
    const login = await axios.post(`${SERVER}/auth/login`, { email: 'test@example.com', password: 'password123' })
    const token = login.data?.data?.accessToken || login.data?.accessToken
    console.log('got token', !!token)
    if (!token) return console.error('No token from login')

    const s1 = io(SERVER, { auth: { token }, transports: ['websocket', 'polling'] })
    const s2 = io(SERVER, { auth: { token }, transports: ['websocket', 'polling'] })

    s1.on('connect', () => {
      console.log('s1 connected', s1.id)
      s1.emit('join', { room: 'auth-room' })
      setTimeout(() => s1.emit('message', { conversation: 'auth-room', text: 'hello from s1-auth' }), 300)
    })

    s2.on('connect', () => {
      console.log('s2 connected', s2.id)
      s2.emit('join', { room: 'auth-room' })
    })

    s1.on('message', (m) => console.log('s1 recv', m))
    s2.on('message', (m) => console.log('s2 recv', m))

    setTimeout(() => {
      s1.close()
      s2.close()
    }, 2000)
  } catch (err) {
    console.error(err?.response?.data || err.message)
  }
}

run()
