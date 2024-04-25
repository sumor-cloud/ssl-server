import axios from 'axios'
import https from 'https'

export default async (url) => {
  const result = await axios.get(url, {
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    })
  })
  return result.data
}
