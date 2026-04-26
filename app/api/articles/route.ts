import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB, Article } from '../../../src/lib/db';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const db = readDB();
  return NextResponse.json(db.articles);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Cek apakah ini mode Edit (jika ada ID yang dikirim)
    const idToEdit = formData.get('id') as string | null;

    const title = formData.get('title') as string || '';
    const slug = formData.get('slug') as string || '';
    const category = formData.get('category') as string || '';
    const author = formData.get('author') as string || '';
    const lead = formData.get('lead') as string || '';
    const body = formData.get('body') as string || '';
    const tagsStr = formData.get('tags') as string || '';
    const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);

    const file = formData.get('image') as File | null;
    let imageUrl = formData.get('existingImageUrl') as string || ''; // Simpan URL lama jika tidak ada gambar baru

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), 'public', 'images', 'articles');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const timestamp = Date.now();
      const filename = `${timestamp}-${file.name.replace(/\s+/g, '-')}`;
      const filepath = path.join(uploadDir, filename);

      fs.writeFileSync(filepath, buffer);
      imageUrl = `/images/articles/${filename}`;
    }

    const wordCount = body.split(/\s+/).length;
    const readTimeMins = Math.ceil(wordCount / 200);
    const readTime = `${readTimeMins} min read`;

    const db = readDB();

    if (idToEdit) {
      // MODE EDIT
      const articleIndex = db.articles.findIndex(a => a.id === idToEdit);
      if (articleIndex !== -1) {
        db.articles[articleIndex] = {
          ...db.articles[articleIndex],
          slug: slug || db.articles[articleIndex].slug,
          category,
          author,
          title,
          lead,
          body,
          tags,
          readTime,
          imageUrl: imageUrl || db.articles[articleIndex].imageUrl // Gunakan URL baru atau pertahankan yang lama
        };
        writeDB(db);
        return NextResponse.json({ success: true, article: db.articles[articleIndex] });
      } else {
        return NextResponse.json({ success: false, error: 'Article to edit not found' }, { status: 404 });
      }
    } else {
      // MODE CREATE
      const dateOpts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
      const date = new Date().toLocaleDateString('en-GB', dateOpts);

      const newArticle: Article = {
        id: slug || `article-${Date.now()}`,
        slug: slug || `article-${Date.now()}`,
        category,
        author,
        title,
        lead,
        body,
        tags,
        readTime,
        date,
        imageUrl,
        isFeatured: false,
        isDeepRead: false
      };

      db.articles.push(newArticle);
      writeDB(db);
      return NextResponse.json({ success: true, article: newArticle });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    const db = readDB();
    const initialLength = db.articles.length;
    db.articles = db.articles.filter(article => article.id !== id);

    if (db.articles.length === initialLength) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    writeDB(db);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, isFeatured, isDeepRead } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    const db = readDB();
    const articleIndex = db.articles.findIndex(article => article.id === id);

    if (articleIndex === -1) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    if (isFeatured === true) {
      db.articles.forEach(a => a.isFeatured = false);
    }

    if (isFeatured !== undefined) db.articles[articleIndex].isFeatured = isFeatured;
    if (isDeepRead !== undefined) db.articles[articleIndex].isDeepRead = isDeepRead;

    writeDB(db);
    return NextResponse.json({ success: true, article: db.articles[articleIndex] });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}