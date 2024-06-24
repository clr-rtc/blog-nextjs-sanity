import sharp from 'sharp'

const DEBUG = false

export const config = {
  api: {
    bodyParser: false,
  },
}

const API_KEY = process.env.APP_RGD_API_KEY

export default async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' })
    return
  }

  if (!API_KEY) {
    console.error('APP_RGD_API_KEY not defined')
    return res.status(500).json('Internal error')
  }

  const auth = req.headers.authorization
  if (!auth) {
    console.error('Authorization not defined')
    return res.status(500).json('Internal error')
  }

  if (API_KEY && auth) {
    const token = auth.split(' ')[1]
    if (token !== API_KEY) {
      console.error('Authorization invalid')
      return res.status(500).json('Internal error')
    }
  }

  const buffers = []
  DEBUG && console.log('hearders', req.headers)

  const contentType = req.headers?.['content-type']
  const fileType = contentType?.split('/')?.[0] || 'image'

  const boundary = req.boundary

  await new Promise<void>((resolve, reject) => {
    req.on('error', (err) => {
      reject(err)
    })

    req.on('data', (chunk) => {
      buffers.push(chunk)
    })

    req.on('end', async () => {
      const buffer = Buffer.concat(buffers)
      let fileBuffer = undefined

      if (boundary) {
        const parts = buffer.split(Buffer.from(`--${boundary}`))

        // Filter out preamble and epilogue
        const fileParts = parts.filter(
          (part) =>
            part.includes(Buffer.from('Content-Disposition')) &&
            part.includes(Buffer.from('filename')),
        )
        if (fileParts.length > 0) {
          // Extract the file buffer
          fileBuffer = fileParts[0]
            .split(Buffer.from('\r\n\r\n'))[1]
            .split(Buffer.from('\r\n--'))[0]
        }
      }

      if (!fileBuffer) {
        fileBuffer = buffer
      }

      DEBUG && console.log('File buffer size:', fileBuffer?.length)

      if (!(fileBuffer?.length > 0)) {
        res.status(400).json({ message: 'No file uploaded' })
        reject()
        return
      }

      let resizedBuffer = fileBuffer

      try {
        if (fileType === 'image') {
          resizedBuffer = await sharp(buffer)
            .rotate() // Automatically rotate the image based on EXIF data
            .resize({
              width: 1920, // Example width, adjust as needed
              height: 1080, // Example height, adjust as needed
              fit: sharp.fit.inside,
              withoutEnlargement: true,
            })
            .toBuffer()

          DEBUG && console.log(`resized buffer length: ${resizedBuffer.length}`)
          // Set the appropriate headers and return the image
          res.setHeader('Content-Type', contentType)
          res.setHeader('Content-Disposition', 'inline')
          res.setHeader('Content-Length', resizedBuffer.length)

          res.send(resizedBuffer)
          resolve()
        } else {
          res.status(400).json({
            message: `Image compression failed: Unknown file type: ${fileType}`,
          })
          reject()
        }
      } catch (e) {
        console.log('video compression failed: ', e)
        res
          .status(400)
          .json({ message: 'Image compression failed: ' + e.message })
        reject()
      }
    })
  })
}

// Utility function to split buffer
Buffer.prototype.split = function (delimiter) {
  let start = 0
  let parts = []
  let index

  while ((index = this.indexOf(delimiter, start)) !== -1) {
    parts.push(this.slice(start, index))
    start = index + delimiter.length
  }

  parts.push(this.slice(start))
  return parts
}
