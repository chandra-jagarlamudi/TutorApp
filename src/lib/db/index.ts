import Database from 'better-sqlite3';
import { CREATE_CONVERSATIONS, CREATE_MESSAGES, CREATE_INDEXES } from './schema';
import type { Subject } from '../prompts/subjects';

let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!_db) {
    const dbPath = process.env.DB_PATH ?? './tutor.db';
    _db = new Database(dbPath);
    _db.pragma('journal_mode = WAL');
    _db.pragma('foreign_keys = ON');
    _db.exec(CREATE_CONVERSATIONS);
    _db.exec(CREATE_MESSAGES);
    for (const idx of CREATE_INDEXES) {
      _db.exec(idx);
    }
  }
  return _db;
}

export interface DbMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: number;
}

export interface DbConversation {
  id: string;
  subject: Subject;
  model: string;
  title: string;
  created_at: number;
  updated_at: number;
}

export function addMessage(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string
): DbMessage {
  const db = getDb();
  const id = crypto.randomUUID();
  const now = Date.now();

  const insertMsg = db.prepare(
    'INSERT INTO messages (id, conversation_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)'
  );
  const updateConv = db.prepare(
    'UPDATE conversations SET updated_at = ? WHERE id = ?'
  );

  const run = db.transaction(() => {
    insertMsg.run(id, conversationId, role, content, now);
    updateConv.run(now, conversationId);
  });

  run();

  return { id, conversation_id: conversationId, role, content, created_at: now };
}

export function createConversation(subject: Subject, model: string): DbConversation {
  const db = getDb();
  const id = crypto.randomUUID();
  const now = Date.now();
  db.prepare(
    'INSERT INTO conversations (id, subject, model, title, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(id, subject, model, 'New Conversation', now, now);
  return { id, subject, model, title: 'New Conversation', created_at: now, updated_at: now };
}

export function getConversation(id: string): DbConversation | null {
  const db = getDb();
  return (db.prepare('SELECT * FROM conversations WHERE id = ?').get(id) as DbConversation) ?? null;
}

export function listConversations(): DbConversation[] {
  const db = getDb();
  return db.prepare('SELECT * FROM conversations ORDER BY updated_at DESC').all() as DbConversation[];
}

export function getMessages(conversationId: string): DbMessage[] {
  const db = getDb();
  return db.prepare('SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC').all(conversationId) as DbMessage[];
}

export function deleteConversation(id: string): void {
  const db = getDb();
  db.prepare('DELETE FROM conversations WHERE id = ?').run(id);
}

export function updateConversationTitle(id: string, title: string): void {
  const db = getDb();
  db.prepare('UPDATE conversations SET title = ? WHERE id = ?').run(title, id);
}

export { getDb };
