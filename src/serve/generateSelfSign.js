import selfsigned from 'selfsigned'
import fse from 'fs-extra'

export default async function generateSelfSign(domain, fileName) {
  fileName = fileName || 'domain'

  const sslPath = `${process.cwd()}/ssl`
  await fse.ensureDir(sslPath)

  if (await fse.exists(`${sslPath}/${fileName}.crt`)) return

  const attrs = [{ name: 'commonName', value: domain }]
  const pems = selfsigned.generate(attrs, { days: 36500 })

  await fse.writeFile(`${sslPath}/${fileName}.crt`, pems.cert)
  await fse.writeFile(`${sslPath}/${fileName}.key`, pems.private)
}
