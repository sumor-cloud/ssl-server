import fse from 'fs-extra'
export default async () => {
  const sslPath = `${process.cwd()}/ssl`
  await fse.remove(`${sslPath}/domain.key`)
  await fse.remove(`${sslPath}/domain.crt`)
  await fse.remove(`${sslPath}/domain.cer`)
  await fse.remove(`${sslPath}/ca.crt`)
  await fse.remove(`${sslPath}/ca.cer`)
  await fse.remove(`${sslPath}/selfsigned.key`)
  await fse.remove(`${sslPath}/selfsigned.crt`)
}
