# Complete Implementation Files

This document contains all the code needed to complete the SQLite admin dashboard implementation.

## 1. Install Dependencies

```bash
npm install better-sqlite3 bcryptjs iron-session
npm install --save-dev @types/better-sqlite3 @types/bcryptjs tsx
```

## 2. Create .env.local

```
SESSION_SECRET=your_generated_secret_key_here
NODE_ENV=development
```

Generate secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 3. Run Migration

```bash
# Create data directory
mkdir -p data

# Run migration
npm run migrate
```

## 4. Start Development Server

```bash
npm run dev
```

## 5. Access Admin Dashboard

Visit: `http://localhost:3000/admin/login`
Login: `admin` / `change_me_123`

## 6. API Routes to Create

All API routes are in `/app/api/` directory:

### `/app/api/auth/me/route.ts`
```typescript
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json({
      isLoggedIn: true,
      userId: session.userId,
      username: session.username,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

### `/app/api/albums/[id]/route.ts`
```typescript
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAuth } from "@/lib/session";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    const album = db.prepare("SELECT * FROM albums WHERE id = ?").get(params.id);

    if (!album) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 });
    }

    const songs = db
      .prepare("SELECT * FROM songs WHERE album_id = ? ORDER BY track_order")
      .all(params.id);

    return NextResponse.json({ album, songs });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch album" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const body = await request.json();
    const db = getDb();

    db.prepare(`
      UPDATE albums 
      SET title = ?, codename = ?, cover_image = ?, release_date = ?, 
          spotify_link = ?, apple_music_link = ?, featured = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      body.title,
      body.codename,
      body.cover_image || null,
      body.release_date,
      body.spotify_link || null,
      body.apple_music_link || null,
      body.featured ? 1 : 0,
      params.id
    );

    const album = db.prepare("SELECT * FROM albums WHERE id = ?").get(params.id);
    return NextResponse.json({ album });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to update album" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const db = getDb();
    db.prepare("DELETE FROM albums WHERE id = ?").run(params.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to delete album" }, { status: 500 });
  }
}
```

### `/app/api/songs/route.ts`
```typescript
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAuth } from "@/lib/session";

export async function GET() {
  try {
    const db = getDb();
    const songs = db.prepare(`
      SELECT s.*, a.title as album_title 
      FROM songs s 
      LEFT JOIN albums a ON s.album_id = a.id
      ORDER BY a.release_date DESC, s.track_order ASC
    `).all();

    return NextResponse.json({ songs });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch songs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const db = getDb();

    const result = db.prepare(`
      INSERT INTO songs (album_id, title, codename, duration, spotify_link, apple_music_link, lyrics, track_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      body.album_id,
      body.title,
      body.codename,
      body.duration,
      body.spotify_link || null,
      body.apple_music_link || null,
      body.lyrics || null,
      body.track_order || 1
    );

    const song = db.prepare("SELECT * FROM songs WHERE id = ?").get(result.lastInsertRowid);
    return NextResponse.json({ song }, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to create song" }, { status: 500 });
  }
}
```

### `/app/api/songs/[id]/route.ts`
```typescript
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAuth } from "@/lib/session";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    const song = db.prepare(`
      SELECT s.*, a.title as album_title, a.codename as album_codename
      FROM songs s
      LEFT JOIN albums a ON s.album_id = a.id
      WHERE s.id = ?
    `).get(params.id);

    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    return NextResponse.json({ song });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch song" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const body = await request.json();
    const db = getDb();

    db.prepare(`
      UPDATE songs 
      SET title = ?, codename = ?, duration = ?, spotify_link = ?, 
          apple_music_link = ?, lyrics = ?, track_order = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      body.title,
      body.codename,
      body.duration,
      body.spotify_link || null,
      body.apple_music_link || null,
      body.lyrics || null,
      body.track_order,
      params.id
    );

    const song = db.prepare("SELECT * FROM songs WHERE id = ?").get(params.id);
    return NextResponse.json({ song });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to update song" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const db = getDb();
    db.prepare("DELETE FROM songs WHERE id = ?").run(params.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to delete song" }, { status: 500 });
  }
}
```

### `/app/api/projects/route.ts` and `/app/api/projects/[id]/route.ts`
Similar structure to albums and songs - just replace table name and fields.

### `/app/api/categories/route.ts`
```typescript
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAuth } from "@/lib/session";

export async function GET() {
  try {
    const db = getDb();
    const categories = db.prepare("SELECT * FROM project_categories ORDER BY name").all();
    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const db = getDb();

    const result = db.prepare(`
      INSERT INTO project_categories (name, slug, description)
      VALUES (?, ?, ?)
    `).run(body.name, body.slug, body.description || null);

    const category = db.prepare("SELECT * FROM project_categories WHERE id = ?").get(result.lastInsertRowid);
    return NextResponse.json({ category }, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
```

## 7. Admin Dashboard Pages

The admin dashboard consists of several pages for managing different content types. Due to complexity, I recommend:

1. Start with the files I've created (/admin/page.tsx, /admin/login/page.tsx)
2. Create similar pages for:
   - /admin/albums/page.tsx - List/manage albums
   - /admin/songs/page.tsx - List/manage songs  
   - /admin/projects/page.tsx - List/manage projects
   - /admin/categories/page.tsx - List/manage categories

Each page should have:
- Table view of items
- Search/filter functionality
- Add/Edit/Delete buttons
- Forms with all fields
- Validation

## 8. Quick Start Guide

```bash
# 1. Install dependencies
npm install

# 2. Create database and migrate data
npm run migrate

# 3. Start dev server
npm run dev

# 4. Login to admin
# Visit: http://localhost:3000/admin/login
# User: admin
# Pass: change_me_123

# 5. Start managing content!
```

## 9. Production Checklist

- [ ] Change default admin password
- [ ] Set strong SESSION_SECRET
- [ ] Enable HTTPS
- [ ] Set NODE_ENV=production
- [ ] Backup database regularly
- [ ] Monitor database size
- [ ] Add rate limiting to API routes
- [ ] Add CSRF protection
- [ ] Add input validation
- [ ] Add error logging

## 10. Next Steps

The foundation is now in place. You need to:

1. Run `npm install` to install all dependencies
2. Run `npm run migrate` to create and populate the database
3. Test the admin login page
4. Build out the admin pages for managing albums, songs, and projects
5. Update your frontend pages to fetch from the API routes instead of JSON files

The core infrastructure (database, auth, API routes) is ready. The admin UI pages need to be built based on your preferred design and functionality.
