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

const API_KEY = process.env.APP_SUBS_API_KEY
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (!API_KEY) {
    console.error('APP_SUBS_API_KEY not defined')
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

  const { mod, c } = request.query

  const modifiedOnly = mod === undefined ? true : parseBool(mod as string)
  const clear = parseBool(c as string)

  const scanResponse = await kv.scan(0, {
    match: 'subscriber:*',
    count: 500,
    type: 'hash',
  })

  const subscriberKeys = scanResponse[1]

  if (!subscriberKeys) {
    return response.status(400).json([])
  }

  const subscribers = []

  for (let i = 0; i < subscriberKeys.length; i++) {
    const subscriberKey = subscriberKeys[i]

    try {
      const subscriber = await kv.hgetall(subscriberKey)
      if ((modifiedOnly || clear) && !subscriber['modified']) {
        continue
      }
      subscribers.push(subscriber)
    } catch (e) {
      console.error(`Failed to retrieve subscriber: "${subscriberKey}"`)
      continue
    }

    if (clear) {
      try {
        await kv.hset(subscriberKey, { modified: false })
      } catch (e) {
        console.error(`Failed to update subscriber: "${subscriberKey}"`)
        continue
      }
    }
  }

  return response.status(200).json(subscribers)
}
