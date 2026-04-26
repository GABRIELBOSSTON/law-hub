import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const ENCRYPTION_KEY = process.env.DB_SECRET_KEY || '12345678901234567890123456789012'; // Must be 32 chars
const IV_LENGTH = 16;
const DB_PATH = path.join(process.cwd(), 'articles.db.enc');

export type Article = {
  id: string;
  slug: string;
  category: string;
  author: string;
  title: string;
  lead: string;
  body: string;
  tags: string[];
  readTime: string;
  date: string;
  imageUrl: string;
  related?: string[];
  isFeatured?: boolean; // Tanda untuk artikel utama
  isDeepRead?: boolean; // Tanda untuk artikel Deep Read
};

export type DatabaseSchema = {
  articles: Article[];
};

const defaultData: DatabaseSchema = { articles: [] };

function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text: string): string {
  const textParts = text.split(':');
  const ivStr = textParts.shift();
  if (!ivStr) return '';
  const iv = Buffer.from(ivStr, 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

export function readDB(): DatabaseSchema {
  if (!fs.existsSync(DB_PATH)) {
    writeDB(defaultData);
    return defaultData;
  }

  try {
    const encryptedData = fs.readFileSync(DB_PATH, 'utf8');
    const decryptedData = decrypt(encryptedData);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error('Error reading/decrypting DB:', error);
    return defaultData;
  }
}

export function writeDB(data: DatabaseSchema): void {
  try {
    const jsonData = JSON.stringify(data);
    const encryptedData = encrypt(jsonData);
    fs.writeFileSync(DB_PATH, encryptedData, 'utf8');
  } catch (error) {
    console.error('Error encrypting/writing DB:', error);
  }
}