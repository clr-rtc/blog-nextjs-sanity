import { NextApiRequest, NextApiResponse } from 'next'
import sharp from 'sharp'

function parseBool(val: string) {
  if (!val) {
    return false
  }

  if (val === '1' || val.toLowerCase()[0] === 't') {
    return true
  }
  return false
}

const API_KEY = process.env.APP_RGD_API_KEY
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { id, r } = request.query

  if (id) {
    const fakeFileName = id as string
    await retrieveFile(response, fakeFileName.split('.')[0])
    return
  }

  if (!API_KEY) {
    console.error('APP_RGD_API_KEY not defined')
    return response.status(500).json('Internal error')
  }

  const auth = request.headers.authorization
  if (!auth) {
    console.error('Authorization not defined')
    return response.status(500).json('Internal error')
  }

  const token = auth.split(' ')[1]
  if (token !== API_KEY) {
    console.error('Authorization invalid')
    return response.status(500).json('Internal error')
  }

  // TODO add registration
}

async function retrieveFile(res, id) {
  // Construct the Google Drive direct download URL
  const fileUrl = `https://drive.google.com/uc?export=download&id=${id}`

  try {
    //res.send(buffer)
    const response = await fetch(fileUrl)
    if (!response.ok) {
      throw new Error('Failed to fetch the image')
    }

    // Get the image content type
    const contentType = response.headers.get('content-type')

    // Ensure the content type is an image
    if (!contentType.startsWith('image/')) {
      throw new Error('The fetched file is not an image')
    }

    // Get the image buffer
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Resize the image if it exceeds 4MB
    const maxSize = 4 * 1024 * 1024 // 4MB
    let resizedBuffer = buffer

    if (buffer.length > maxSize) {
      resizedBuffer = await sharp(buffer)
        .rotate() // Automatically rotate the image based on EXIF data
        .resize({
          width: 1920, // Example width, adjust as needed
          height: 1080, // Example height, adjust as needed
          fit: sharp.fit.inside,
          withoutEnlargement: true,
        })
        .toBuffer()
    }

    // Set the appropriate headers and return the image
    res.setHeader('Content-Type', contentType)
    res.setHeader('Content-Disposition', 'inline')
    res.setHeader('Content-Length', resizedBuffer.length)

    res.send(resizedBuffer)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
