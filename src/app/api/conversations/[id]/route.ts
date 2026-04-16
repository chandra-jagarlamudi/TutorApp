import { NextRequest } from 'next/server';
import { getConversation, getMessages, deleteConversation } from '@/lib/db';

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/conversations/[id] — get conversation with full message history
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const conversation = getConversation(id);

  if (!conversation) {
    return new Response(JSON.stringify({ error: 'Conversation not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const messages = getMessages(id);
  return Response.json({ ...conversation, messages });
}

// DELETE /api/conversations/[id] — delete conversation and all messages
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const conversation = getConversation(id);

  if (!conversation) {
    return new Response(JSON.stringify({ error: 'Conversation not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  deleteConversation(id);
  return new Response(null, { status: 204 });
}
