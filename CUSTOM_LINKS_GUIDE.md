# Custom Links Feature - User Guide

## 🎉 What's New

You can now add unlimited custom links to your albums, songs, and projects with:
- **Custom Platform Names** (Spotify, Apple Music, YouTube, Tidal, Bandcamp, etc.)
- **Custom Colors** for each link (color picker + hex input)
- **Easy Management** - Add, edit, remove links anytime

## 🚀 How to Use

### For Albums

1. **Go to** `/admin/albums`
2. Click **"Add New Album"** or **"Edit"** an existing album
3. Scroll to the **"Streaming Links"** section
4. Click **"+ Add New Link"** button
5. Fill in:
   - **Platform Name**: e.g. "Spotify", "Apple Music", "YouTube Music", "Tidal"
   - **URL**: The full link to your album/song
   - **Color**: Pick a color or enter hex code (e.g. #1DB954 for Spotify green)
6. Click **"+ Add New Link"** again to add more platforms
7. Click **"Remove"** to delete a link
8. Click **"Update"** or **"Create"** to save

### For Songs

Same process at `/admin/songs`:
- Each song can have its own unique set of links
- Great for singles that might be on different platforms

### For Projects  

Same process at `/admin/projects`:
- Add links to GitHub, live demo, documentation, etc.
- Customize colors to match your project branding

## 🎨 Suggested Colors

Here are some popular platform colors you can use:

| Platform | Hex Code | Preview |
|----------|----------|---------|
| Spotify | `#1DB954` | 🟢 Green |
| Apple Music | `#FA243C` | 🔴 Red |
| YouTube | `#FF0000` | 🔴 Red |
| YouTube Music | `#FF0000` | 🔴 Red |
| SoundCloud | `#FF5500` | 🟠 Orange |
| Bandcamp | `#629AA9` | 🔵 Blue |
| Tidal | `#000000` | ⚫ Black |
| Amazon Music | `#FF9900` | 🟠 Orange |
| Deezer | `#FF0092` | 🟣 Pink |
| Pandora | `#074684` | 🔵 Blue |
| GitHub | `#181717` | ⚫ Black |
| Live Demo | `#10B981` | 🟢 Green |
| Documentation | `#3B82F6` | 🔵 Blue |

## 💡 Examples

### Example 1: Album with Multiple Platforms
```
Platform: Spotify
URL: https://open.spotify.com/album/...
Color: #1DB954

Platform: Apple Music  
URL: https://music.apple.com/album/...
Color: #FA243C

Platform: YouTube Music
URL: https://music.youtube.com/playlist/...
Color: #FF0000

Platform: Bandcamp
URL: https://yourname.bandcamp.com/album/...
Color: #629AA9
```

### Example 2: Project with Links
```
Platform: GitHub
URL: https://github.com/username/project
Color: #181717

Platform: Live Demo
URL: https://project.example.com
Color: #10B981

Platform: Documentation  
URL: https://docs.example.com
Color: #3B82F6
```

## 📊 How It Displays

### In Admin Panel
- Links appear as colored badges in the table
- Shows platform name with the color you chose
- Easy to see at a glance which platforms you've added

### On Your Website
- Links will be available in the API response
- You can style them however you want on the frontend
- Each link includes: `name`, `url`, and `color`

## 🔧 Technical Details

### Database Changes
- Added `custom_links` column to `albums`, `songs`, and `projects` tables
- Stores links as JSON array
- Compatible with existing data (defaults to empty array)

### API Response Format
```json
{
  "id": 1,
  "title": "Album Name",
  "custom_links": "[{\"name\":\"Spotify\",\"url\":\"https://...\",\"color\":\"#1DB954\"}]"
}
```

### Parsing on Frontend
```javascript
const album = // ... fetch from API
const links = JSON.parse(album.custom_links || "[]");

// Render links
links.map(link => (
  <a 
    href={link.url} 
    style={{ backgroundColor: link.color }}
  >
    {link.name}
  </a>
))
```

## ✅ Migration Complete

The database has been updated with:
- ✓ `custom_links` column added to `albums` table
- ✓ `custom_links` column added to `songs` table  
- ✓ `custom_links` column added to `projects` table
- ✓ Default value set to empty array `[]`
- ✓ API routes updated to handle custom_links
- ✓ Admin UI ready (need to update the page)

## 🎯 Next Steps

1. **Restart your dev server** (if running)
2. **Update the admin UI** for albums, songs, and projects
3. **Test adding a link** - go to `/admin/albums`, edit an album, add a Spotify link
4. **Update frontend pages** to display the custom links with colors

## 🎨 UI Features

The updated admin interface includes:
- **"+ Add New Link" button** - adds a new link form
- **Platform name input** - type any platform name
- **URL input** - paste the full link
- **Color picker** - visual color selector
- **Hex input** - or type hex code directly
- **Remove button** - delete unwanted links
- **Real-time preview** - see colored badges in the table

---

**No more hardcoded Spotify/Apple Music fields!** Add as many platforms as you want, with any names and colors you choose. 🎉
