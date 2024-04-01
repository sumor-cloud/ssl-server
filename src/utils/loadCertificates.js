import fse from 'fs-extra'
import chokidar from 'chokidar'

export default async (callback) => {
  const sslPath = `${process.cwd()}/ssl`

  const reload = async () => {
    const certificates = {
      cert: '',
      key: ''
    }

    if (await fse.exists(`${sslPath}/domain.key`)) {
      certificates.key = await fse.readFile(`${sslPath}/domain.key`, 'utf-8')
    } else if (await fse.exists(`${sslPath}/selfsigned.key`)) {
      certificates.key = await fse.readFile(`${sslPath}/selfsigned.key`, 'utf-8')
    } else {
      certificates.key = ''
    }
    if (await fse.exists(`${sslPath}/domain.crt`)) {
      certificates.cert = await fse.readFile(`${sslPath}/domain.crt`, 'utf-8')
    } else if (await fse.exists(`${sslPath}/selfsigned.crt`)) {
      certificates.cert = await fse.readFile(`${sslPath}/selfsigned.crt`, 'utf-8')
    } else {
      certificates.cert = ''
    }

    if (await fse.exists(`${sslPath}/ca.crt`)) {
      certificates.cert = certificates.cert + '\n' + await fse.readFile(`${sslPath}/ca.crt`, 'utf-8')
    }

    if (certificates.cert !== '' && certificates.key !== '') {
      callback(certificates)
    }
  }
  await reload()
  const watcher = chokidar.watch(sslPath).on('all', async (event, path) => {
    await reload()
  })

  return async function () {
    await watcher.close()
  }
}
