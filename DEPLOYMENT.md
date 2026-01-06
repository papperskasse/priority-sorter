# 🚀 Deployment Guide - Priority Sorter

This guide will help you deploy your Eisenhower Matrix app to free hosting platforms so you can share it with anyone!

## 📋 Overview

We'll deploy:
- **Backend (FastAPI)** → Render.com (Free tier)
- **Frontend (HTML/JS)** → Vercel or Netlify (Free tier)

Both platforms offer generous free tiers perfect for this app!

---

## 🔧 Step 1: Prepare Your Code

### 1.1 Create a GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it something like `priority-sorter` or `eisenhower-matrix`
3. Make it **Public** (required for free hosting)

### 1.2 Push Your Code to GitHub

Open PowerShell in your project directory and run:

```powershell
git init
git add .
git commit -m "Initial commit - Priority Sorter app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name.

---

## 🖥️ Step 2: Deploy Backend to Render

### 2.1 Create Render Account

1. Go to [Render.com](https://render.com)
2. Sign up with your GitHub account (recommended)
3. Authorize Render to access your repositories

### 2.2 Deploy the Backend

1. **Click "New +"** → **"Web Service"**

2. **Connect Your Repository**
   - Select your `priority-sorter` repository
   - Click "Connect"

3. **Configure the Service**
   - **Name**: `priority-sorter-api` (or your choice)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: **Free** (select this!)

4. **Click "Create Web Service"**

5. **Wait for Deployment** (2-3 minutes)
   - You'll see build logs
   - When it says "Live", your API is ready!

6. **Copy Your API URL**
   - It will look like: `https://priority-sorter-api-xxxx.onrender.com`
   - **Save this URL** - you'll need it next!

### 2.3 Test Your Backend

Visit your API URL + `/docs` to see the API documentation:
```
https://priority-sorter-api-xxxx.onrender.com/docs
```

If you see the Swagger UI, your backend is working! 🎉

---

## 🌐 Step 3: Deploy Frontend (Choose One)

### Option A: Deploy to Vercel (Recommended)

#### 3.1 Create Vercel Account

1. Go to [Vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Authorize Vercel

#### 3.2 Deploy the Frontend

1. **Click "Add New..."** → **"Project"**

2. **Import Your Repository**
   - Find your `priority-sorter` repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Other
   - **Root Directory**: Click "Edit" → Select `frontend`
   - **Build Command**: Leave empty or `echo 'No build needed'`
   - **Output Directory**: `.` (just a dot)
   - Click "Deploy"

4. **Wait for Deployment** (30 seconds)

5. **Your App is Live!** 🎉
   - You'll get a URL like: `https://priority-sorter-xxxx.vercel.app`

#### 3.3 Configure API URL

1. After deployment, visit your Vercel app
2. Open browser console (F12)
3. Run this command with your Render backend URL:
   ```javascript
   setApiUrl('priority-sorter-api-xxxx.onrender.com')
   ```
   (without `https://` or `http://`)
4. The page will reload and connect to your backend!

---

### Option B: Deploy to Netlify

#### 3.1 Create Netlify Account

1. Go to [Netlify.com](https://netlify.com)
2. Sign up with your GitHub account
3. Authorize Netlify

#### 3.2 Deploy the Frontend

1. **Click "Add new site"** → **"Import an existing project"**

2. **Connect to GitHub**
   - Authorize Netlify
   - Select your repository

3. **Configure Build Settings**
   - **Base directory**: `frontend`
   - **Build command**: Leave empty
   - **Publish directory**: `.` (just a dot)
   - Click "Deploy site"

4. **Wait for Deployment** (30 seconds)

5. **Your App is Live!** 🎉
   - You'll get a URL like: `https://amazing-name-xxxxx.netlify.app`

#### 3.3 Configure API URL

1. After deployment, visit your Netlify app
2. Open browser console (F12)
3. Run this command with your Render backend URL:
   ```javascript
   setApiUrl('priority-sorter-api-xxxx.onrender.com')
   ```
   (without `https://` or `http://`)
4. The page will reload and connect to your backend!

---

## 🎨 Step 4: Customize Your URLs (Optional)

### Customize Vercel URL
1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add a custom domain or edit the Vercel subdomain

### Customize Netlify URL
1. Go to "Site settings" → "Domain management"
2. Click "Options" → "Edit site name"
3. Choose a better name like `my-priority-sorter`

### Customize Render URL
1. Go to your web service settings
2. You can't change the free tier URL, but you can add a custom domain

---

## ✅ Step 5: Test Everything

1. **Open your frontend URL**
2. **Add a test task**
   - Title: "Test task"
   - Mark as Urgent and Important
   - Click "Add Task"
3. **The task should appear in the red "Do First" quadrant**
4. **Try dragging it to another quadrant**
5. **Edit the task and add notes**
6. **Refresh the page** - your tasks should persist!

If everything works, congratulations! Your app is live! 🎊

---

## 🔄 Updating Your Deployed App

Whenever you make changes:

1. **Commit and push to GitHub**:
   ```powershell
   git add .
   git commit -m "Description of changes"
   git push
   ```

2. **Automatic Deployment**:
   - Both Render and Vercel/Netlify will automatically detect the changes
   - They'll rebuild and redeploy your app (usually within 1-2 minutes)
   - No manual steps needed!

---

## ⚠️ Important Notes

### Render Free Tier Limitations
- **Sleep after inactivity**: Your backend will "sleep" after 15 minutes of inactivity
- **First request after sleep**: Takes 30-50 seconds to wake up
- **Monthly limits**: 750 hours/month (enough for 24/7 operation)
- **Solution**: The app will work fine, just be patient on first load after inactivity

### Data Persistence
- **Current setup**: Tasks are stored in memory
- **What this means**: Tasks will reset when the backend restarts
- **For production**: Consider adding a database (PostgreSQL, MongoDB, etc.)

### CORS Configuration
- The backend is already configured to accept requests from any origin
- This is fine for a personal project
- For production, update the CORS settings in `backend/main.py` to only allow your frontend domain

---

## 🐛 Troubleshooting

### "Failed to load tasks" Error

**Problem**: Frontend can't connect to backend

**Solutions**:
1. Make sure your backend is deployed and running (check Render dashboard)
2. Verify the API URL in browser console: `console.log(API_BASE_URL)`
3. Set the correct API URL: `setApiUrl('your-api-url.onrender.com')`
4. Check Render logs for errors

### Backend is Slow

**Problem**: First request takes 30+ seconds

**Cause**: Free tier "sleeps" after inactivity

**Solutions**:
- This is normal behavior for Render's free tier
- Consider upgrading to paid tier ($7/month) for always-on service
- Or use a "pinger" service to keep it awake (but check Render's ToS)

### Tasks Disappear After Refresh

**Problem**: Tasks don't persist

**Possible Causes**:
1. API URL not configured correctly
2. Backend restarted (normal on free tier)
3. Using different API endpoint

**Solution**:
- For now, this is expected behavior (in-memory storage)
- To persist data, add a database in future updates

### Can't Push to GitHub

**Problem**: Authentication failed

**Solutions**:
1. Use GitHub Personal Access Token instead of password
2. Or use GitHub Desktop app
3. Or use SSH keys

---

## 🌟 Sharing Your App

Once deployed, share your app with anyone:

1. **Share your frontend URL**:
   - `https://your-app.vercel.app` or
   - `https://your-app.netlify.app`

2. **They can use it immediately** - no setup required!

3. **Each user will have their own tasks** (not shared between users)
   - Because we're using in-memory storage
   - To add multi-user support, you'd need authentication and a database

---

## 📚 Next Steps

Want to enhance your deployed app? Consider:

1. **Add a Database** (PostgreSQL on Render - also free tier available)
2. **Add User Authentication** (Auth0, Clerk, or custom)
3. **Enable Task Sharing** (share quadrants with team members)
4. **Add Custom Domain** (for a professional look)
5. **Set Up Monitoring** (UptimeRobot for backend health checks)

---

## 💡 Free Hosting Alternatives

If you want to try other platforms:

### Backend Alternatives
- **Railway**: Similar to Render, $5 free credit/month
- **Fly.io**: Free tier with 3 VMs
- **PythonAnywhere**: Free tier but more limited

### Frontend Alternatives
- **GitHub Pages**: Free, but static only
- **Cloudflare Pages**: Free, unlimited bandwidth
- **Surge.sh**: Simple, free tier available

---

## 🆘 Need Help?

If you run into issues:

1. Check the logs in Render/Vercel/Netlify dashboard
2. Open browser console (F12) to see frontend errors
3. Test API directly at `your-api-url/docs`
4. Make sure your GitHub repository is up to date

---

**Happy Deploying! 🚀**

Now go share your Priority Sorter with the world!
