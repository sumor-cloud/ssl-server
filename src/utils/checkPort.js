// check port is available or not

import net from 'net'

export default function checkPort (port) {
  return new Promise((resolve) => {
    const server = net.createServer()
    server.once('error', () => {
      // if (err.code === 'EADDRINUSE') {
      //   resolve(false)
      // }
      resolve(false)
    })
    server.once('listening', () => {
      server.close()
      resolve(true)
    })
    server.listen(port)
  })
};
