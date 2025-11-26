import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// This endpoint should be called by a cron job (e.g., Vercel Cron, or external service)
// to process pending reminders
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    // Simple auth check for cron jobs
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const now = new Date()
    
    // Find all pending reminders that should be sent
    const reminders = await prisma.reminder.findMany({
      where: {
        status: 'pending',
        reminderDate: {
          lte: now,
        },
      },
      include: {
        quote: {
          include: {
            client: true,
            user: true,
          },
        },
      },
    })

    const results = []

    for (const reminder of reminders) {
      try {
        // Update reminder status
        await prisma.reminder.update({
          where: { id: reminder.id },
          data: { status: 'done' },
        })

        // Update quote status if needed
        if (reminder.quote.status === 'viewed' || reminder.quote.status === 'sent') {
          await prisma.quote.update({
            where: { id: reminder.quoteId },
            data: { status: 'reminded' },
          })
        }

        // In production, send email/SMS here
        // For now, we just mark it as done
        // Example:
        // await sendReminderEmail(reminder.quote, reminder.reminderType)

        results.push({
          reminderId: reminder.id,
          quoteId: reminder.quoteId,
          status: 'sent',
        })
      } catch (error) {
        console.error(`Error processing reminder ${reminder.id}:`, error)
        results.push({
          reminderId: reminder.id,
          status: 'error',
        })
      }
    }

    return NextResponse.json({
      processed: results.length,
      results,
    })
  } catch (error) {
    console.error('Process reminders error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// Helper function to send reminder email (to be implemented)
async function sendReminderEmail(quote: any, type: string) {
  // TODO: Implement email sending using nodemailer or similar
  // This would send a reminder email to the client
  console.log(`Would send ${type} reminder for quote ${quote.id}`)
}

