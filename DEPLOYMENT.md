# Production Deployment Guide

This guide will help you deploy your nheek website with SQLite database to production.

## Prerequisites

- A production server (VPS, cloud instance, etc.)
- Node.js 18+ installed
- Git installed
- Access to your production environment via SSH

## Step 1: Generate Session Secret

On your **local machine**, generate a secure session secret:

```bash
# Generate a random 32-byte hex string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output - you'll need this for your `.env.local` file.

## Step 2: Prepare Production Environment Variables

On your **production server**, create `.env.local` file:

```bash
cd /path/to/your/nheek/project
nano .env.local
```

Add the following content (replace `your_generated_secret_here` with the secret from Step 1):

```env
SESSION_SECRET=your_generated_secret_here
```

Save and exit (Ctrl+X, then Y, then Enter).

## Step 3: Clone/Pull Latest Code

If first deployment:
```bash
git clone https://github.com/YOUR_USERNAME/nheek.git
cd nheek
```

If updating existing deployment:
```bash
cd nheek
git pull origin main
```

## Step 4: Install Dependencies

```bash
npm install
```

## Step 5: Setup Database Directory

Create the data directory if it doesn't exist:

```bash
mkdir -p data
```

**Important:** Make sure the `data/` directory is writable by the Node.js process.

## Step 6: Run Database Migrations

You have two options for running migrations:

### Option A: Using Admin Dashboard (Recommended)

1. Start the application (see Step 9)
2. Visit `https://your-domain.com/admin/login`
3. Login with default credentials (username: `admin`, password: `change_me_123`)
4. Go to the "Data Migration" page
5. Click "Migrate All Data" button
6. Wait for the migration to complete
7. Verify data in the admin pages

### Option B: Using Command Line Scripts

Run the migrations in order:

#### 6.1 Initial Migration (Albums, Songs, Categories)
```bash
npm run migrate
```

This will:
- Create all database tables
- Import albums and songs from `public/featured-music/albums.json`
- Create default admin user (username: `admin`, password: `change_me_123`)

#### 6.2 Add Custom Links Column
```bash
npm run add-custom-links
```

This adds the `custom_links` column to albums, songs, and projects tables.

#### 6.3 Migrate Old Links
```bash
npm run migrate-old-links
```

This converts existing `spotify_link` and `apple_music_link` fields to the new `custom_links` format.

#### 6.4 Update Projects Schema
```bash
npm run update-projects-schema
```

This adds missing columns to the projects table (mobile_image_url, status, date_added, tech_stack, deployed_with).

#### 6.5 Import Projects
```bash
npm run migrate-projects
```

This imports all projects from `public/featured-projects/json/projects.json`.

## Step 7: Verify Database

Check that everything was imported correctly:

```bash
# Check albums count
sqlite3 data/nheek.db "SELECT COUNT(*) FROM albums;"

# Check songs count
sqlite3 data/nheek.db "SELECT COUNT(*) FROM songs;"

# Check projects count
sqlite3 data/nheek.db "SELECT COUNT(*) FROM projects;"

# Check categories
sqlite3 data/nheek.db "SELECT * FROM project_categories;"
```

## Step 8: Build Production Assets

```bash
npm run build
```

This will create optimized production builds in `.next/` directory.

## Step 9: Start Production Server

### Option A: Using PM2 (Recommended)

Install PM2 globally:
```bash
npm install -g pm2
```

Start the application:
```bash
pm2 start npm --name "nheek" -- start
```

Save PM2 configuration:
```bash
pm2 save
pm2 startup
```

Monitor logs:
```bash
pm2 logs nheek
```

### Option B: Using Docker

If you're using Docker (you have a `Dockerfile` in the project):

```bash
docker build -t nheek:latest .
docker run -d -p 3000:3000 --name nheek -v $(pwd)/data:/app/data --env-file .env.local nheek:latest
```

### Option C: Direct Node

```bash
npm run start-app
```

**Note:** For production, use a process manager like PM2 or systemd to keep the app running.

## Step 10: Configure Reverse Proxy (Nginx)

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/nheek
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/nheek /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 11: Setup SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Step 12: Change Default Admin Password

1. Visit `https://your-domain.com/admin/login`
2. Login with:
   - Username: `admin`
   - Password: `change_me_123`
3. Go to admin settings and change the password immediately!

## Step 13: Setup Database Backups

Create a backup script:

```bash
nano ~/backup-nheek-db.sh
```

Add this content:

```bash
#!/bin/bash
BACKUP_DIR="/path/to/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_PATH="/path/to/nheek/data/nheek.db"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Create backup
sqlite3 "$DB_PATH" ".backup '$BACKUP_DIR/nheek_$TIMESTAMP.db'"

# Keep only last 30 days of backups
find "$BACKUP_DIR" -name "nheek_*.db" -mtime +30 -delete

echo "Backup completed: nheek_$TIMESTAMP.db"
```

Make it executable:
```bash
chmod +x ~/backup-nheek-db.sh
```

Setup cron job for daily backups:
```bash
crontab -e
```

Add this line (runs daily at 2 AM):
```
0 2 * * * /home/YOUR_USERNAME/backup-nheek-db.sh
```

## Updating the Application

When you need to deploy updates:

```bash
cd /path/to/nheek

# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Rebuild
npm run build

# Restart the application
pm2 restart nheek

# Or if using Docker:
docker build -t nheek:latest .
docker stop nheek
docker rm nheek
docker run -d -p 3000:3000 --name nheek -v $(pwd)/data:/app/data --env-file .env.local nheek:latest
```

## Database Migrations on Production

If you add new migrations later:

```bash
# Run the new migration script
npm run your-new-migration-script

# No restart needed for data-only changes
# If schema changes affect API, restart:
pm2 restart nheek
```

## Troubleshooting

### Projects page showing nothing
- Check database: `sqlite3 data/nheek.db "SELECT COUNT(*) FROM projects;"`
- If 0, run: `npm run migrate-projects`

### Permission errors with database
```bash
chmod 664 data/nheek.db
chmod 775 data/
```

### Can't login to admin
- Verify .env.local exists and has SESSION_SECRET
- Check admin user exists: `sqlite3 data/nheek.db "SELECT * FROM admin_users;"`

### Application won't start
- Check logs: `pm2 logs nheek`
- Verify Node version: `node --version` (should be 18+)
- Check if port 3000 is already in use: `lsof -i :3000`

## Security Checklist

- [x] `.env.local` is not committed to git (check `.gitignore`)
- [x] `data/` directory is not committed to git
- [x] SESSION_SECRET is unique and random (32+ bytes)
- [ ] Changed default admin password from `change_me_123`
- [ ] SSL/HTTPS is configured
- [ ] Database backups are automated
- [ ] Server firewall is configured (only ports 80, 443, SSH open)
- [ ] SSH key authentication is enabled (password login disabled)
- [ ] Regular security updates are applied

## Useful Commands

```bash
# View all albums
sqlite3 data/nheek.db "SELECT title, release_date FROM albums;"

# View all projects by category
sqlite3 data/nheek.db "SELECT p.title, c.name FROM projects p JOIN project_categories c ON p.category_id = c.id;"

# View custom links for a song
sqlite3 data/nheek.db "SELECT title, custom_links FROM songs WHERE title LIKE '%wingless%';"

# Clear all projects (if you need to re-import)
sqlite3 data/nheek.db "DELETE FROM projects;"

# Database file size
ls -lh data/nheek.db
```

## Support

If you encounter issues during deployment:
1. Check the application logs
2. Verify all migration scripts ran successfully
3. Check database integrity
4. Review the Security Checklist above

For local development, see the main README.md file.
