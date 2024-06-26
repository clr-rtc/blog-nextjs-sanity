import { NextApiRequest, NextApiResponse } from 'next'

const DEBUG = true
function parseBool(val: string) {
  if (!val) {
    return false
  }

  if (val === '1' || val.toLowerCase()[0] === 't') {
    return true
  }
  return false
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { id } = request.query

  if (id) {
    const actualId = id?.split('=')[1]
    DEBUG && console.log(`file id:"${actualId}"`)
    await retrieveFile(response, actualId)
    return
  }
}

async function retrieveFile(res, id) {
  // Construct the Google Drive direct download URL

  const fileUrl = `https://drive.google.com/uc?export=download&id=${id}`

  DEBUG && console.log(`final url: ${fileUrl}`)
  try {
    //res.send(buffer)
    const response = await fetch(fileUrl)
    DEBUG && console.debug(response)

    if (!response.ok) {
      throw new Error('Failed to fetch the file')
    }

    // Get the image content type
    const contentType = response.headers.get('content-type')

    // Get the image buffer
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    DEBUG &&
      console.log(`file: ${buffer.length} bytes, Content-Type: ${contentType}`)

    // Set the appropriate headers and return the image
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Content-Disposition', 'inline')
    res.setHeader('Content-Length', buffer.length)

    if (DEBUG) {
      // Prevent caching at the client side
      res.setHeader(
        'Cache-Control',
        'no-store, no-cache, must-revalidate, proxy-revalidate',
      )
      res.setHeader('Pragma', 'no-cache')
      res.setHeader('Expires', '0')
      res.setHeader('Surrogate-Control', 'no-store')
    }

    res.status(200).send(buffer)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
