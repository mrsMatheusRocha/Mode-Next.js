import { hash } from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../db'
import { issues, users } from '../db/schema'

async function main() {
  console.log('Starting database seeding...')

  // Clean up existing data
  await db.delete(issues)
  await db.delete(users)

  // Create demo users
  const demoPassword = await hash('password123', 10)

  const adminUserId = uuidv4()
  const memberUserId = uuidv4()

  const adminUser = await db
    .insert(users)
    .values({
      id: adminUserId,
      email: 'admin@example.com',
      password: demoPassword,
    })
    .returning()
    .then((rows) => rows[0])

  const memberUser = await db
    .insert(users)
    .values({
      id: memberUserId,
      email: 'user@example.com',
      password: demoPassword,
    })
    .returning()
    .then((rows) => rows[0])

  console.log('Created demo users:')
  console.log(`- Admin: ${adminUser.email} (password: password123)`)
  console.log(`- User: ${memberUser.email} (password: password123)`)

  // Create demo issues
  const demoIssues = [
    {
      title: 'Implement user authentication',
      description:
        'Set up NextAuth.js for user authentication and create signin/signup pages.',
      priority: 'high',
      status: 'done',
      userId: adminUserId,
    },
    {
      title: 'Design landing page',
      description:
        'Create a modern landing page with Tailwind CSS that explains the app features.',
      priority: 'medium',
      status: 'in_progress',
      userId: adminUserId,
    },
    {
      title: 'Add dark mode support',
      description:
        'Implement dark mode toggle and ensure UI looks good in both themes.',
      priority: 'low',
      status: 'todo',
      userId: memberUserId,
    },
    {
      title: 'Create issue management API',
      description:
        'Build RESTful API endpoints for creating, updating and deleting issues.',
      priority: 'high',
      status: 'done',
      userId: memberUserId,
    },
    {
      title: 'Implement drag and drop for issues',
      description:
        'Add drag and drop functionality to move issues between status columns.',
      priority: 'medium',
      status: 'todo',
      userId: adminUserId,
    },
  ]

  for (const issue of demoIssues) {
    // Explicitly cast string values to enum types to fix type issues
    await db.insert(issues).values({
      title: issue.title,
      description: issue.description,
      priority: issue.priority as 'low' | 'medium' | 'high',
      status: issue.status as 'backlog' | 'todo' | 'in_progress' | 'done',
      userId: issue.userId,
    })
  }

  console.log(`Created ${demoIssues.length} demo issues`)
  console.log('Database seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    console.log('Seed script finished')
  })
