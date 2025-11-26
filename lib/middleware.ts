import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './auth'

export async function getAuthUser(request: NextRequest): Promise<string | null> {
  try {
    const token = request.cookies.get('token')?.value

    if (!token) {
      return null
    }

    const decoded = verifyToken(token)
    if (!decoded || !decoded.userId) {
      return null
    }

    return decoded.userId
  } catch (error) {
    console.error('Error in getAuthUser:', error)
    return null
  }
}

export function requireAuth(handler: (req: NextRequest, userId: string) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    try {
      const userId = await getAuthUser(req)

      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      return handler(req, userId)
    } catch (error) {
      console.error('Error in requireAuth:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }
}
