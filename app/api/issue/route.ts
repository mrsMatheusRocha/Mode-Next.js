import { NextResponse } from 'next/server'
import { db } from '@/db'
import { issues } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { verifyJwt } from '@/lib/auth' 
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token found' }, { status: 401 })
    }
    const userId = await verifyJwt(token) 

    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const userIssues = await db.query.issues.findMany({
      where: eq(issues.userId, userId),
    })

    return NextResponse.json(userIssues)
  } catch (error) {
    console.error('Error fetching issues:', error)
    return NextResponse.json(
      { error: 'Failed to fetch issues' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization')
    const userId = await extractUserIdFromAuthHeader(authHeader)

    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 },
      )
    }

    // Create the issue with userId from token
    const newIssue = await db
      .insert(issues)
      .values({
        title: data.title,
        description: data.description || null,
        status: data.status || 'backlog',
        priority: data.priority || 'medium',
        userId: userId,
      })
      .returning()

    return NextResponse.json(
      { message: 'Issue created successfully', issue: newIssue[0] },
      { status: 201 },
    )
  } catch (error) {
    console.error('Error creating issue:', error)
    return NextResponse.json(
      { error: 'Failed to create issue' },
      { status: 500 },
    )
  }
}
