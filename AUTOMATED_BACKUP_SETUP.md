# Automated Backup Setup Guide

This guide explains how to set up automated database backups for your nheek website.

## Overview

The automated backup system allows you to:

- Schedule automatic database backups at configurable intervals (hourly, daily, weekly)
- Automatically clean up old backups based on retention policy
- Configure settings through the admin dashboard

## Setup Instructions

### 1. Configure Backup Settings in Admin Dashboard

1. Log in to your admin dashboard at `/admin`
2. Scroll to the "💾 Database Backup & Restore" section
3. Find the "⏰ Automated Backup Schedule" settings
4. Configure:
   - **Enable Auto Backup**: Toggle to enable/disable automated backups
   - **Backup Every (hours)**: Set interval between backups (1-168 hours)
   - **Max Backups to Keep**: Number of automatic backups to retain (1-100)
5. Click "Save Schedule"

### 2. Set Up Cron Secret

Add a secret key to your environment variables for secure cron job authentication:

```bash
# In your .env.local or production environment
CRON_SECRET=your_secure_random_secret_here
```

Generate a secure random secret:

```bash
openssl rand -base64 32
```

### 3. Set Up Cron Job

#### Option A: Using System Crontab (Linux/macOS Server)

1. Open crontab editor:

```bash
crontab -e
```

2. Add one of these entries based on your backup frequency:

**Every hour:**

```cron
0 * * * * curl -X POST https://yourdomain.com/api/backup/auto -H "x-cron-secret: your_secure_random_secret_here" >> /var/log/nheek-backup.log 2>&1
```

**Every 6 hours:**

```cron
0 */6 * * * curl -X POST https://yourdomain.com/api/backup/auto -H "x-cron-secret: your_secure_random_secret_here" >> /var/log/nheek-backup.log 2>&1
```

**Daily at 2 AM:**

```cron
0 2 * * * curl -X POST https://yourdomain.com/api/backup/auto -H "x-cron-secret: your_secure_random_secret_here" >> /var/log/nheek-backup.log 2>&1
```

**Weekly (Sunday at 3 AM):**

```cron
0 3 * * 0 curl -X POST https://yourdomain.com/api/backup/auto -H "x-cron-secret: your_secure_random_secret_here" >> /var/log/nheek-backup.log 2>&1
```

#### Option B: Using External Cron Service

Services like [cron-job.org](https://cron-job.org) or [EasyCron](https://www.easycron.com/) can call your endpoint:

1. Create a new cron job
2. Set URL: `https://yourdomain.com/api/backup/auto`
3. Method: `POST`
4. Add header: `x-cron-secret: your_secure_random_secret_here`
5. Set schedule frequency

#### Option C: Using Vercel Cron (if deployed on Vercel)

1. Create `vercel.json` in your project root:

```json
{
  "crons": [
    {
      "path": "/api/backup/auto",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

2. Update the API route to check for Vercel's authentication:

```typescript
// In app/api/backup/auto/route.ts
// Add this check before the existing auth check:
const authorizationHeader = request.headers.get("authorization");
const isVercelCron =
  authorizationHeader === `Bearer ${process.env.CRON_SECRET}`;
```

### 4. Test the Setup

Test the automated backup manually:

```bash
curl -X POST http://localhost:3000/api/backup/auto \
  -H "x-cron-secret: your_secure_random_secret_here"
```

Expected response:

```json
{
  "message": "Auto backup created successfully",
  "backup": {
    "filename": "nheek-auto-backup-2025-11-11T12-00-00-000Z.db",
    "size": 12345,
    "created": "2025-11-11T12:00:00.000Z"
  }
}
```

If backups are disabled or interval not reached:

```json
{
  "message": "Auto backup is disabled",
  "skipped": true
}
```

## How It Works

1. **Cron Trigger**: The cron job calls `/api/backup/auto` at scheduled intervals
2. **Settings Check**: The API checks if auto-backup is enabled and interval has passed
3. **Backup Creation**: If conditions are met, a new backup is created with prefix `nheek-auto-backup-`
4. **Cleanup**: Old automatic backups are deleted, keeping only the most recent N backups (based on settings)
5. **Manual Backups Preserved**: Manual backups (created via dashboard) are never automatically deleted

## Backup File Naming

- **Manual backups**: `nheek-backup-YYYY-MM-DDTHH-MM-SS-MMMZ.db`
- **Auto backups**: `nheek-auto-backup-YYYY-MM-DDTHH-MM-SS-MMMZ.db`
- **Auto-backups before restore**: `nheek-auto-backup-before-restore-YYYY-MM-DDTHH-MM-SS-MMMZ.db`

## Monitoring

Check backup logs:

```bash
# If using cron with logging
tail -f /var/log/nheek-backup.log

# Check backup directory
ls -lah /path/to/nheek/data/backups/
```

View backups in admin dashboard at `/admin` > "💾 Database Backup & Restore" section.

## Troubleshooting

### Backups Not Running

1. **Check cron secret**: Ensure `CRON_SECRET` environment variable matches header value
2. **Verify cron syntax**: Test cron schedule at [crontab.guru](https://crontab.guru/)
3. **Check permissions**: Ensure write access to `data/backups/` directory
4. **View logs**: Check cron logs for errors
5. **Test manually**: Run the curl command manually to see error messages

### Too Many/Few Backups

- Adjust "Max Backups to Keep" in admin dashboard
- Automatic cleanup only affects files starting with `nheek-auto-backup-`
- Manual backups must be deleted manually

### Backup Interval Not Respected

- The system checks `last_auto_backup` timestamp in the database
- Ensure your cron runs more frequently than the backup interval
- Example: If backup interval is 6 hours, cron should run every 1-6 hours

## Security Notes

1. **Keep CRON_SECRET secure**: Never commit it to version control
2. **Use HTTPS**: Always use HTTPS in production to protect the secret in headers
3. **Rotate secrets**: Change CRON_SECRET periodically
4. **Monitor logs**: Regularly check for unauthorized access attempts

## Best Practices

1. **Set appropriate intervals**: Balance between freshness and storage
   - High-traffic sites: Every 1-6 hours
   - Low-traffic sites: Daily
   - Development: Weekly

2. **Retention policy**: Keep enough backups to recover from issues
   - Minimum: 7 backups
   - Recommended: 10-30 backups
   - Consider storage space

3. **Test restores**: Periodically test restoring from automatic backups

4. **Off-site backups**: Consider copying backups to external storage (S3, Dropbox, etc.)

## Example Production Setup

For a production site with daily updates:

```bash
# Environment
CRON_SECRET=a_very_secure_random_string_here

# Admin Settings
Auto Backup Enabled: ✅ Yes
Backup Interval: 6 hours
Max Backups to Keep: 28 (7 days worth at 6-hour intervals)

# Crontab (every hour, but only backs up every 6 hours due to interval check)
0 * * * * curl -X POST https://nheek.com/api/backup/auto -H "x-cron-secret: a_very_secure_random_string_here" >> /var/log/nheek-backup.log 2>&1
```

This ensures backups run 4 times per day, keeping the last week of backups.
