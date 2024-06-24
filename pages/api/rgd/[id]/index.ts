import { NextApiRequest, NextApiResponse } from 'next'
import sharp from 'sharp'

const DEBUG = false
function parseBool(val: string) {
  if (!val) {
    return false
  }

  if (val === '1' || val.toLowerCase()[0] === 't') {
    return true
  }
  return false
}

const MIGRATION = {
  '14SBcsffgBiGkPxlpfXIp9eqpErds7qln': '1-l2uGxtba-yZOxkcwijSUsT40RV4q2_R',
  '1IBgMl84D2b2CPlwcLXVq1uVGhx2El2QQ': '1odbaVuiMarVOqtc9f3hyreVr70Hmi4uE',
  '1YnzCCwHTIjVKdUIbwqfM1ZFjLEsK2pGB': '1MORykbhfbOQY2pc9SlVrTLHeS6lKX59z',
  '1uEYtb1x6UU3zbS2xiC8smKqOhcxzen3r': '198S9bvPhzIeXwLBDmtyGJcREcEdsDPM1',
  '1fHM0dwTuowsKiiuVha0ZJeiO2T4uPBOb': '1DM4m4Whsz4HLaAQnF_oGsHjuiNKRcSf9',
  '1sWLmda0-50HddytkfvabXvL1o26ylx_0': '1zC6t934aHST4TZyGG_k2IV6_qfOHdH_I',
  '1iSo3ysB1gwcQlMtgo9PMTmPMZ2lMLa9J': '14mUwXAb5mnwfCpEz7iLcAw1IsUc372jm',
  '1eWCJ_nT-YkImhwQKlEkyFs2haRlEtk1B': '1sjUJofDikqONiWPAlTudqm0LZv1Q9z2w',
  '1GvLv8TVcTKnT3mjQAYy_j5M_GpaNBpTa': '1GHVQ-Gb-NuhMoFYEEphY-Hacmjopux9_',
  '1Q0Nf4FmjHHAXOkbB0vJ41HpqS618B1De': '1GGMxBJDB44CY_aKyqaJAvNdFBVC8URVT',
  '1b8w4IKEEdUoJPG49pFPmqmuMElE3fi6L': '14hGI7dvkP2flFmHabFTAHFAb0VkiyOWR',
  '1jaoCj6-zkqdumL8Y81pz_9R1EpmdOeOa': '1c7IKk9n4A57diKIfAyLJofP-BAwtGDGS',
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { id, r } = request.query

  if (id) {
    const fakeFileName = id as string
    const fileId = fakeFileName.split('.')[0]
    DEBUG && console.log(`filename:"${fakeFileName}" id=${fileId}}`)
    await retrieveFile(response, fileId)
    return
  }
}

async function retrieveFile(res, id) {
  // Construct the Google Drive direct download URL
  const isV2 = id.endsWith('_v2')
  let actualId = isV2 ? id.substring(0, id.length - 3) : id

  if (!isV2) {
    DEBUG && console.log(`Not V2 - actual id = ${actualId}`)
    const replacement = MIGRATION[actualId]
    if (replacement) {
      actualId = replacement
    }
  }

  DEBUG && console.log(`id=${id} actualId: ${actualId}`)

  const fileUrl = `https://drive.google.com/uc?export=download&id=${actualId}`

  DEBUG && console.log(`final url: ${fileUrl}`)
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
    let resizedBuffer = buffer

    if (!isV2) {
      // Resize the image if it exceeds 4MB
      const maxSize = 4 * 1024 * 1024 // 4MB

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
