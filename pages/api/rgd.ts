import { kv } from '@vercel/kv'
import { NextApiRequest, NextApiResponse } from 'next'

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
  const { did, r } = request.query

  if (did) {
    await retrieveFile(response, did)
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
    const response = await fetch(fileUrl)
    if (!response.ok) {
      throw new Error('Failed to fetch the image')
    }

    // Get the image content type
    const contentType = response.headers.get('content-type')

    // Get the image buffer
    const buffer = Buffer.from(await response.arrayBuffer())

    // Set the appropriate headers and return the image
    res.setHeader('Content-Type', contentType)
    res.setHeader('Content-Disposition', 'inline')
    res.send(buffer)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
