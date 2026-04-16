import { NextRequest } from 'next/server';
import { createConversation, listConversations } from '@/lib/db';
import type { Subject } from '@/lib/prompts/subjects';
import { SUBJECTS } from '@/lib/prompts/subjects';

// GET /api/conversations — list all conversations (metadata only, ordered by updated_at desc)
export async function GET() {
  const conversations = listConversations();
  return Response.json(conversations);
}

// POST /api/conversations — create new conversation
export async function POST(req: NextRequest) {
  let subject: Subject;
  let model: string;

  try {
    const body = await req.json() as { subject: Subject; model: string };
    subject = body.subject;
    model = body.model;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!SUBJECTS.includes(subject)) {
    return new Response(
      JSON.stringify({ error: `Invalid subject. Must be one of: ${SUBJECTS.join(', ')}` }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!model || typeof model !== 'string') {
    return new Response(JSON.stringify({ error: 'model is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const conversation = createConversation(subject, model);
  return Response.json(conversation, { status: 201 });
}
