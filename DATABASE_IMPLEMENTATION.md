# SQLite Database Implementation Guide

This guide contains all the code needed to implement SQLite database with admin dashboard for your nheek website.

## 1. Installation

First, install the required dependencies:

```bash
npm install better-sqlite3 bcryptjs iron-session
npm install --save-dev @types/better-sqlite3 @types/bcryptjs tsx
```

## 2. Database Setup

The database schema is already created in `/lib/db.ts` with tables for:
- albums
- songs
- projects
- project_categories
- admin_users

## 3. Migration

Run the migration script to import your existing JSON data:

```bash
npm run migrate
```

This will:
- Create the SQLite database at `/data/nheek.db`
- Import all albums and songs from `albums.json`
- Import all projects from `projects.json`
- Create a default admin user (username: `admin`, password: `change_me_123`)

**IMPORTANT**: Change the default password immediately after first login!

## 4. Environment Variables

Create a `.env.local` file in the root directory:

```
SESSION_SECRET=your_very_long_random_secret_key_at_least_32_characters_long_please_change_this
NODE_ENV=development
```

Generate a secure SESSION_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 5. API Routes Created

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/me` - Get current session

### Albums
- `GET /api/albums` - Get all albums
- `POST /api/albums` - Create album (auth required)
- `GET /api/albums/[id]` - Get single album with songs
- `PUT /api/albums/[id]` - Update album (auth required)
- `DELETE /api/albums/[id]` - Delete album (auth required)

### Songs
- `GET /api/songs` - Get all songs
- `POST /api/songs` - Create song (auth required)
- `GET /api/songs/[id]` - Get single song
- `PUT /api/songs/[id]` - Update song (auth required)
- `DELETE /api/songs/[id]` - Delete song (auth required)

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project (auth required)
- `GET /api/projects/[id]` - Get single project
- `PUT /api/projects/[id]` - Update project (auth required)
- `DELETE /api/projects/[id]` - Delete project (auth required)

### Categories
- `GET /api/categories` - Get all project categories
- `POST /api/categories` - Create category (auth required)

## 6. Admin Dashboard Routes

Access the admin dashboard at:
- `/admin` - Dashboard home (redirects to /admin/login if not authenticated)
- `/admin/login` - Login page
- `/admin/albums` - Manage albums
- `/admin/songs` - Manage songs
- `/admin/projects` - Manage projects
- `/admin/categories` - Manage project categories

## 7. Frontend Updates Needed

Update your existing pages to fetch from API instead of JSON files:

### Example: Update music page

```typescript
// pages/music.tsx or app/music/page.tsx
async function getAlbums() {
  const res = await fetch('/api/albums', { cache: 'no-store' });
  const data = await res.json();
  return data.albums;
}

export default async function MusicPage() {
  const albums = await getAlbums();
  // ... render albums
}
```

## 8. Features

### Album Management
- Create, edit, delete albums
- Add Spotify and Apple Music links
- Set album as featured
- Upload cover images
- Manage release dates

### Song Management
- Create, edit, delete songs
- Add lyrics (with textarea editor)
- Add Spotify and Apple Music links
- Set track order within albums
- Bulk operations

### Project Management
- Create, edit, delete projects
- Categorize projects
- Add GitHub and live demo links
- Set project as featured
- Manage display order
- Upload project images

### Category Management
- Create project categories
- Edit category names and descriptions
- Delete categories (projects will be uncategorized)

## 9. Security Features

- Password hashing with bcrypt
- Session-based authentication with iron-session
- HTTP-only, secure cookies
- CSRF protection
- SQL injection protection (prepared statements)

## 10. Database Backup

To backup your database:
```bash
cp data/nheek.db data/nheek.db.backup
```

To restore:
```bash
cp data/nheek.db.backup data/nheek.db
```

## 11. Admin Dashboard Features

- **Dashboard Overview**: Statistics and quick actions
- **Rich Text Editor**: For lyrics and descriptions
- **Image Upload**: Drag and drop support
- **Search & Filter**: Find songs, albums, projects quickly
- **Bulk Actions**: Update multiple items at once
- **Responsive Design**: Works on mobile and desktop
- **Dark Mode**: Consistent with your site theme

## 12. Next Steps

1. Run `npm install` to install dependencies
2. Run `npm run migrate` to create database and import data
3. Update `.env.local` with SESSION_SECRET
4. Start dev server: `npm run dev`
5. Visit `http://localhost:3000/admin/login`
6. Login with admin/change_me_123
7. Change password immediately!
8. Start managing your content!

## 13. File Structure

```
/app
  /api
    /auth
      /login/route.ts
      /logout/route.ts
      /me/route.ts
    /albums
      /route.ts
      /[id]/route.ts
    /songs
      /route.ts
      /[id]/route.ts
    /projects
      /route.ts
      /[id]/route.ts
    /categories
      /route.ts
  /admin
    /page.tsx
    /login/page.tsx
    /albums/page.tsx
    /songs/page.tsx
    /projects/page.tsx
    /layout.tsx
/lib
  /db.ts
  /session.ts
/scripts
  /migrate.ts
/data
  /nheek.db (created after migration)
```

## 14. Troubleshooting

### Database locked error
- Close all connections to the database
- Restart the dev server

### Session not persisting
- Check SESSION_SECRET is set
- Clear browser cookies
- Check cookie settings in production

### Migration fails
- Ensure albums.json exists
- Check file permissions
- Review migration logs

## 15. Production Deployment

When deploying to production:

1. Set `NODE_ENV=production`
2. Use a strong SESSION_SECRET
3. Set `secure: true` for cookies (HTTPS only)
4. Regular database backups
5. Consider read replicas for high traffic
6. Monitor database size and performance

## Notes

- The SQLite database is stored in `/data/nheek.db`
- The database uses WAL mode for better concurrent access
- All timestamps are in UTC
- Indexes are created for common queries
- Foreign keys are enforced
- Cascade deletes are enabled (deleting album deletes its songs)

## Support

For issues or questions:
1. Check the error logs
2. Verify database connection
3. Check session configuration
4. Review API response codes
5. Test with curl or Postman
