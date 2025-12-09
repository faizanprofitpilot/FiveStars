import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export type ReplyTone = 'professional' | 'friendly' | 'apology' | 'short'

export interface GenerateReplyOptions {
  reviewText: string
  businessContext: string
  tone: ReplyTone
}

export async function generateReviewReply({
  reviewText,
  businessContext,
  tone,
}: GenerateReplyOptions): Promise<{
  success: boolean
  reply?: string
  error?: string
}> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured')
    }

    // Determine tone instructions
    const toneInstructions: Record<ReplyTone, string> = {
      professional:
        'Write a professional, polished response that maintains a formal yet warm tone.',
      friendly:
        'Write a warm, personable response that feels genuine and approachable.',
      apology:
        'Write a sincere apology-focused response that acknowledges concerns and shows commitment to improvement.',
      short: 'Write a brief, concise response (2-3 sentences maximum).',
    }

    const systemPrompt = `You are an expert at writing business review responses. Use the following business context to inform your response:

${businessContext}

Guidelines:
- ${toneInstructions[tone]}
- Be authentic and specific to the business
- Address the reviewer's specific points when possible
- Thank them for their feedback
- Keep responses appropriate in length based on the tone selected
- Maintain a positive, helpful tone even when addressing negative feedback`

    const userPrompt = `Review to respond to:
"${reviewText}"

Generate an appropriate ${tone} reply to this review:`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const reply = completion.choices[0]?.message?.content

    if (!reply) {
      throw new Error('Failed to generate reply')
    }

    return {
      success: true,
      reply: reply.trim(),
    }
  } catch (error: any) {
    console.error('OpenAI error:', error)
    return {
      success: false,
      error: error.message || 'Failed to generate review reply',
    }
  }
}

