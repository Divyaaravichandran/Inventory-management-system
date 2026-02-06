# MongoDB Atlas Migration Guide

This guide will help you migrate from local MongoDB to MongoDB Atlas.

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account (or log in if you already have one)
3. The free tier (M0) is perfect for development and testing

## Step 2: Create a Cluster

1. Click **"Build a Database"** or **"Create"** → **"Database"**
2. Choose **FREE** (M0 Sandbox) tier
3. Select your preferred cloud provider and region (choose closest to you)
4. Click **"Create"** (cluster name is auto-generated, you can change it)

## Step 3: Create Database User

1. Go to **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication method
4. Enter a username and generate a secure password (save this!)
5. Set user privileges to **"Atlas admin"** (or custom role if preferred)
6. Click **"Add User"**

## Step 4: Whitelist IP Address

1. Go to **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. For development, click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ **Note**: For production, only whitelist specific IPs
4. Click **"Confirm"**

## Step 5: Get Connection String

1. Go to **"Database"** → Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Select **"Node.js"** as driver and **"3.6 or later"** as version
4. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Configure Your Application

1. Navigate to `backend` directory
2. Create `.env` file (if it doesn't exist):
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` file and update `MONGODB_URI`:
   ```env
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/kongu_rice_industries?retryWrites=true&w=majority
   ```
   
   **Important**: 
   - Replace `<username>` and `<password>` with your database user credentials
   - Replace `cluster0.xxxxx` with your actual cluster address
   - Add `/kongu_rice_industries` before the `?` to specify the database name
   - Keep `?retryWrites=true&w=majority` at the end

4. Save the `.env` file

## Step 7: Test Connection

1. Start your backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. You should see:
   ```
   ✅ MongoDB Connected Successfully
   📊 Database: kongu_rice_industries
   🌐 Host: Atlas Cluster
   ```

3. If you see connection errors:
   - Verify your username/password are correct
   - Check that your IP is whitelisted
   - Ensure the connection string format is correct
   - Check Atlas cluster status (should be running)

## Step 8: Migrate Existing Data (Optional)

If you have existing data in local MongoDB:

### Option A: Using MongoDB Compass

1. Connect Compass to your local MongoDB: `mongodb://localhost:27017`
2. Export collections:
   - Select database → Right-click collection → "Export Collection"
   - Save as JSON files

3. Connect Compass to Atlas:
   - Use your Atlas connection string
   - Import collections:
     - Right-click database → "Import Data" → Select JSON files

### Option B: Using mongodump/mongorestore

```bash
# Export from local MongoDB
mongodump --uri="mongodb://localhost:27017/kongu_rice_industries" --out=./backup

# Import to Atlas
mongorestore --uri="mongodb+srv://username:password@cluster.mongodb.net/kongu_rice_industries" ./backup/kongu_rice_industries
```

## Troubleshooting

### Connection Timeout
- Check your internet connection
- Verify IP whitelist includes your current IP
- Try allowing access from anywhere (0.0.0.0/0) temporarily

### Authentication Failed
- Double-check username and password in connection string
- Ensure special characters in password are URL-encoded
- Verify database user exists in Atlas

### Database Not Found
- Atlas will create the database automatically on first write
- Or create it manually in Atlas UI: "Browse Collections" → "Create Database"

### SSL/TLS Errors
- Atlas requires SSL connections
- Ensure your connection string uses `mongodb+srv://` (not `mongodb://`)
- Node.js driver handles SSL automatically

## Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use strong passwords** for database users
3. **Restrict IP access** in production (don't use 0.0.0.0/0)
4. **Rotate passwords** regularly
5. **Use environment-specific connection strings** (dev/staging/prod)

## Production Checklist

- [ ] Use dedicated cluster (not free tier)
- [ ] Enable backup/restore
- [ ] Set up monitoring and alerts
- [ ] Restrict IP whitelist to known IPs
- [ ] Use strong, unique passwords
- [ ] Enable MongoDB Atlas encryption at rest
- [ ] Set up database user with least privileges
- [ ] Configure connection pooling
- [ ] Set up automated backups

## Support

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Community Forums](https://developer.mongodb.com/community/forums/)
- [Atlas Status Page](https://status.mongodb.com/)
