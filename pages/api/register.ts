// pages/api/register.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { kv } from '@vercel/kv'

interface ApiRequest extends NextApiRequest {
  body: {
    email: string
    name?: string
    frequency: string
    building?: string
    apartment?: number
  }
}

interface ApiResponseData {
  message: string
  result?: any
  error?: any
}

export default async function handler(
  req: ApiRequest,
  res: NextApiResponse<ApiResponseData>,
) {
  if (req.method === 'POST') {
    const { email, name, frequency, building, apartment } = req.body
    if (!email) {
      res.status(500).json({ message: 'Email is required' })
      return
    }
    try {
      const result = await saveSubscription({
        email,
        name,
        frequency,
        building,
        apartment,
      })
      res.status(200).json({ message: 'Registration successful', result })
    } catch (error) {
      res.status(500).json({ message: 'Failed to register', error })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

type AddToGoogleSheetsProps = {
  email: string
  name: string
  frequency: string
  building: string
  apartment: number
}

async function saveSubscription({
  email,
  name,
  frequency,
  building,
  apartment,
}: AddToGoogleSheetsProps) {
  console.log(
    `saveSubscription: ${email} ${name} ${frequency} ${building} ${apartment}`,
  )

  kv.hset(`subscriber:${email}`, {
    email,
    name,
    frequency,
    building,
    apartment,
    updatedOn: new Date(),
    modified: true,
  })
}

async function saveSubscriptionRequest({
  email,
  name,
  frequency,
  building,
  apartment,
}: AddToGoogleSheetsProps) {
  console.log(
    `saveSubscriptionRequest: ${email} ${name} ${frequency} ${building} ${apartment}`,
  )

  kv.hset(`subrequest:${email}`, {
    email,
    name,
    frequency,
    building,
    apartment,
    updatedOn: new Date(),
    modified: true,
  })
}
