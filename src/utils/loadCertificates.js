import fse from 'fs-extra'
import chokidar from 'chokidar'
import delay from './delay.js'

export default async (callback) => {
  const sslPath = `${process.cwd()}/ssl`
  await fse.ensureDir(sslPath)

  const reload = async () => {
    const certificates = {
      cert: '',
      key: ''
    }

    if (await fse.exists(`${sslPath}/domain.key`)) {
      certificates.key = await fse.readFile(`${sslPath}/domain.key`, 'utf-8')
    } else {
      certificates.key = await fse.readFile(`${sslPath}/selfsigned.key`, 'utf-8')
    }
    if (await fse.exists(`${sslPath}/domain.crt`)) {
      certificates.cert = await fse.readFile(`${sslPath}/domain.crt`, 'utf-8')
    } else if (await fse.exists(`${sslPath}/domain.cer`)) {
      certificates.cert = await fse.readFile(`${sslPath}/domain.cer`, 'utf-8')
    } else {
      certificates.cert = await fse.readFile(`${sslPath}/selfsigned.crt`, 'utf-8')
    }

    if (await fse.exists(`${sslPath}/ca.crt`)) {
      certificates.cert = certificates.cert + '\n' + await fse.readFile(`${sslPath}/ca.crt`, 'utf-8')
    } else if (await fse.exists(`${sslPath}/ca.cer`)) {
      certificates.cert = certificates.cert + '\n' + await fse.readFile(`${sslPath}/ca.cer`, 'utf-8')
    }

    if (certificates.cert !== '' && certificates.key !== '') {
      callback(certificates)
    }
  }
  await reload()
  let closed = false
  const watcher = chokidar.watch(sslPath).on('all', async (event, path) => {
    await delay(100)
    if (!closed) {
      await reload()
    }
  })

  return async function () {
    closed = true
    await watcher.close()
  }
}
