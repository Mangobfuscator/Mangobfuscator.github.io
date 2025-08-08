import fetch from 'node-fetch'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false })
  const { token } = req.body
  if (!token) return res.status(400).json({ success: false })
  const secret = '0x4AAAAAABphVQkP-y4LZtx1oYizi3Qm6XA'
  const params = new URLSearchParams()
  params.append('secret', secret)
  params.append('response', token)

  try {
    const cfRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: params
    })
    const data = await cfRes.json()
    res.status(200).json({ success: data.success })
  } catch {
    res.status(500).json({ success: false })
  }
}
