import { NextRequest } from 'next/server';
import { getGatewayManager, isGatewayError } from '@/lib/gateway/manager';
import type { GatewayMessage } from '@/lib/gateway/types';
import { getSystemPrompt, SUBJECTS } from '@/lib/prompts/subjects';
import type { Subject } from '@/lib/prompts/subjects';

// Unified SSE streaming format: "data: <token>\n\n", terminal: "data: [DONE]\n\n"
// API key never leaves server — injected by adapter from environment
// System prompt (with guardrails) derived server-side from subject — never trusted from client

export async function POST(req: NextRequest) {
  let messages: GatewayMessage[];
  let model: string;
  let subject: Subject | undefined;

  try {
    const body = await req.json() as {
      messages: GatewayMessage[];
      model: string;
      subject?: Subject;
    };
    messages = body.messages;
    model = body.model;
    subject = body.subject;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Derive system prompt server-side from subject — guardrails always applied
  const systemPrompt = subject && SUBJECTS.includes(subject)
    ? getSystemPrompt(subject)
    : getSystemPrompt('general');

  const manager = getGatewayManager();

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const token of manager.stream({ messages, model, systemPrompt })) {
          // Unified SSE format — same regardless of provider
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token })}\n\n`));
        }
        // Terminal signal
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } catch (err) {
        if (isGatewayError(err)) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: err.message, code: err.code })}\n\n`)
          );
        } else {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: 'Unknown error' })}\n\n`)
          );
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
