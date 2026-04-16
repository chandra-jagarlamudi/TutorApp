import { NextRequest } from 'next/server';
import { getConversation, addMessage, updateConversationTitle } from '@/lib/db';

type RouteParams = { params: Promise<{ id: string }> };

// POST /api/conversations/[id]/messages — add message to conversation
export async function POST(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const conversation = getConversation(id);

  if (!conversation) {
    return new Response(JSON.stringify({ error: 'Conversation not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let role: 'user' | 'assistant';
  let content: string;

  try {
    const body = await req.json() as { role: 'user' | 'assistant'; content: string };
    role = body.role;
    content = body.content;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!['user', 'assistant'].includes(role)) {
    return new Response(JSON.stringify({ error: 'role must be user or assistant' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const message = addMessage(id, role, content);

  // Auto-title from first user message (T-032 handled here)
  if (role === 'user' && conversation.title === 'New Conversation') {
    const title = content.length > 60 ? content.slice(0, 57) + '...' : content;
    updateConversationTitle(id, title);
  }

  return Response.json(message, { status: 201 });
}
