# Admin UI Pages Complete - Quick Reference

## 🎉 What's Been Built

You now have a complete admin dashboard to manage your entire website through a user-friendly interface. No more manual JSON editing!

## 📍 Access Your Admin Dashboard

1. **Login Page**: http://localhost:3000/admin/login
   - Username: `admin`
   - Password: `change_me_123`
   - ⚠️ **IMPORTANT**: Change this password after first login!

2. **Dashboard**: http://localhost:3000/admin
   - Overview statistics
   - Quick links to all management pages

## 🎵 Albums Management
**URL**: `/admin/albums`

**Features**:
- View all albums in a table
- Search by album title
- Add new albums with modal form
- Edit existing albums (including featured status)
- Delete albums
- See song count per album

**Form Fields**:
- Title* (required)
- Codename* (required)
- Cover Image URL
- Release Date
- Spotify Link
- Apple Music Link
- Featured checkbox

## 🎤 Songs Management (Main Feature!)
**URL**: `/admin/songs`

**Features**:
- View all songs with album association
- Search by song title
- Filter by album
- Add new songs
- **Edit lyrics with 15-row textarea** (no more JSON formatting!)
- Delete songs
- Lyrics indicator badge

**Form Fields**:
- Album* (dropdown, required)
- Track Order
- Title* (required)
- Codename* (required)
- Duration
- Spotify Link
- Apple Music Link
- **Lyrics** (large textarea with monospace font)

## 💼 Projects Management
**URL**: `/admin/projects`

**Features**:
- View all projects in a table
- Search by project title
- Add new projects
- Edit existing projects
- Delete projects
- See category association
- Featured badge display

**Form Fields**:
- Title* (required)
- Codename* (required)
- Category (dropdown)
- Display Order (for sorting)
- Description (textarea)
- Image URL
- GitHub Link
- Live Demo Link
- Featured checkbox

## 📁 Categories Management
**URL**: `/admin/categories`

**Features**:
- View all categories in card layout
- Add new categories
- Edit existing categories
- Delete categories
- Auto-generate slug from name

**Form Fields**:
- Name* (required)
- Slug* (auto-generated, editable)
- Description (textarea)

## 🚀 Getting Started

### Step 1: Generate Session Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 2: Create .env.local
```bash
cp .env.local.example .env.local
```
Then paste the generated secret into `.env.local`:
```
SESSION_SECRET=your_generated_secret_here
```

### Step 3: Run Migration
This imports all your existing data from JSON files:
```bash
npm run migrate
```

### Step 4: Start the Server
```bash
npm run dev
```

### Step 5: Login
Visit http://localhost:3000/admin/login
- Username: `admin`
- Password: `change_me_123`

### Step 6: Start Managing!
- Click "Manage Songs" to add/edit lyrics
- Click "Manage Albums" to add streaming links
- Click "Manage Projects" to update portfolio
- Click "Manage Categories" to organize projects

## 💡 Common Use Cases

### Adding Lyrics to a Song
1. Go to `/admin/songs`
2. Find the song (use search if needed)
3. Click "Edit"
4. Scroll to the Lyrics field
5. Paste or type lyrics (newlines preserved automatically!)
6. Click "Update Song"

### Adding a New Album
1. Go to `/admin/albums`
2. Click "Add New Album"
3. Fill in title, codename, and cover image URL
4. Add Spotify/Apple Music links
5. Check "Featured" if you want it on homepage
6. Click "Create"

### Managing Projects
1. Go to `/admin/projects`
2. Click "Add New Project" or "Edit" existing
3. Fill in all fields (description, links, etc.)
4. Select a category (or leave uncategorized)
5. Set display order for sorting
6. Check "Featured" for homepage display

### Organizing Categories
1. Go to `/admin/categories`
2. Click "Add New Category"
3. Type category name (slug auto-generates)
4. Add optional description
5. Click "Create"

## 🔒 Security Notes

1. **Change Default Password**: First thing after login!
2. **Session Secret**: Keep your SESSION_SECRET private (it's in .gitignore)
3. **Database Location**: `/data/nheek.db` (also in .gitignore)
4. **Auth Protection**: All mutations require authentication
5. **Session Duration**: 7 days (configurable in `lib/session.ts`)

## 📝 API Endpoints Reference

All endpoints automatically used by the admin UI:

### Authentication
- POST `/api/auth/login` - Login
- POST `/api/auth/logout` - Logout
- GET `/api/auth/me` - Check session

### Albums
- GET `/api/albums` - List all albums
- POST `/api/albums` - Create album (auth required)
- GET `/api/albums/[id]` - Get single album
- PUT `/api/albums/[id]` - Update album (auth required)
- DELETE `/api/albums/[id]` - Delete album (auth required)

### Songs
- GET `/api/songs` - List all songs
- POST `/api/songs` - Create song (auth required)
- GET `/api/songs/[id]` - Get single song
- PUT `/api/songs/[id]` - Update song (auth required)
- DELETE `/api/songs/[id]` - Delete song (auth required)

### Projects
- GET `/api/projects` - List all projects
- POST `/api/projects` - Create project (auth required)
- GET `/api/projects/[id]` - Get single project
- PUT `/api/projects/[id]` - Update project (auth required)
- DELETE `/api/projects/[id]` - Delete project (auth required)

### Categories
- GET `/api/categories` - List all categories
- POST `/api/categories` - Create category (auth required)
- GET `/api/categories/[id]` - Get single category
- PUT `/api/categories/[id]` - Update category (auth required)
- DELETE `/api/categories/[id]` - Delete category (auth required)

## 🎨 UI Features

- **Dark Mode Support**: All pages work in dark mode
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Modal Forms**: Edit without leaving the page
- **Search & Filter**: Find items quickly
- **Confirmation Dialogs**: Prevent accidental deletions
- **Loading States**: Visual feedback during operations
- **Error Handling**: User-friendly error messages

## 📂 File Structure

```
app/
├── admin/
│   ├── albums/page.tsx          # Albums management UI
│   ├── songs/page.tsx           # Songs management UI ⭐
│   ├── projects/page.tsx        # Projects management UI
│   ├── categories/page.tsx      # Categories management UI
│   ├── login/page.tsx           # Login page
│   └── page.tsx                 # Dashboard
├── api/
│   ├── auth/
│   │   ├── login/route.ts
│   │   ├── logout/route.ts
│   │   └── me/route.ts
│   ├── albums/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   ├── songs/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   ├── projects/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   └── categories/
│       ├── route.ts
│       └── [id]/route.ts
lib/
├── db.ts                        # Database connection
└── session.ts                   # Authentication
scripts/
└── migrate.ts                   # Data migration
```

## 🔧 Troubleshooting

### Can't Login?
- Make sure you ran `npm run migrate`
- Check that `.env.local` has SESSION_SECRET
- Try restarting the dev server

### Changes Not Saving?
- Check browser console for errors
- Verify authentication (session might have expired)
- Make sure database file exists at `/data/nheek.db`

### Lint Warnings?
- TypeScript path alias warnings are normal during dev
- useEffect dependency warnings are acceptable (mount-only effects)
- Run `npm run build` to see if there are any blocking errors

## 🎯 Next Steps

1. **Update Frontend**: Modify your public-facing pages to fetch from APIs instead of JSON files
   - Example: `const albums = await fetch('/api/albums').then(r => r.json())`

2. **Change Password**: Create a password change UI or use bcrypt CLI

3. **Add More Features**: 
   - Bulk operations
   - Image upload
   - Rich text editor for descriptions
   - Preview before save

4. **Production Deployment**:
   - Set secure SESSION_SECRET
   - Enable HTTPS
   - Configure database backups
   - Set up monitoring

## ✅ What This Solves

**Before**: 
- Manually editing JSON files
- Escaping newlines for lyrics
- Risk of JSON syntax errors
- No easy way to add links
- Tedious workflow for 224 songs

**After**:
- Click "Edit" on any song
- Type/paste lyrics in textarea
- Add Spotify/Apple links easily
- Search and filter
- Professional CMS interface
- All data in database
- Fast and efficient

---

**You're all set!** 🎉 Your admin dashboard is complete and ready to use. No more manual JSON editing - just login and start managing your content!
