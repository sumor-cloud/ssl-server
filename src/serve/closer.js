export default server => {
  const sockets = []
  server.on('connection', socket => {
    sockets.push(socket)
    socket.once('close', () => {
      sockets.splice(sockets.indexOf(socket), 1)
    })
  })
  return () =>
    new Promise(resolve => {
      sockets.forEach(socket => {
        socket.destroy()
      })
      server.close(() => {
        resolve()
      })
    })
}
