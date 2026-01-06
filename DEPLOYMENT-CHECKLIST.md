# 🎯 Quick Deployment Checklist

Use this checklist to deploy your Priority Sorter app in ~10 minutes!

## ☑️ Before You Start

- [ ] App works locally (tested on `localhost`)
- [ ] Have a GitHub account
- [ ] Have Render.com account (sign up with GitHub)
- [ ] Have Vercel.com or Netlify.com account (sign up with GitHub)

---

## 📦 Step 1: Push to GitHub

- [ ] Create new repository on GitHub (make it **Public**)
- [ ] Run these commands in your project folder:
  ```powershell
  git init
  git add .
  git commit -m "Initial commit"
  git branch -M main
  git remote add origin https://github.com/USERNAME/REPO.git
  git push -u origin main
  ```
- [ ] Verify files are on GitHub

---

## 🖥️ Step 2: Deploy Backend (Render)

- [ ] Go to [render.com](https://render.com)
- [ ] Click **"New +" → "Web Service"**
- [ ] Connect your GitHub repository
- [ ] Configure:
  - **Build Command**: `pip install -r requirements.txt`
  - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
  - **Plan**: Free
- [ ] Click **"Create Web Service"**
- [ ] Wait for deployment (2-3 minutes)
- [ ] **Copy your API URL**: `https://your-app-xxxx.onrender.com`
- [ ] Test it: Visit `your-url/docs` - should see API docs

---

## 🌐 Step 3: Deploy Frontend (Vercel)

- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Click **"Add New..." → "Project"**
- [ ] Import your GitHub repository
- [ ] Configure:
  - **Root Directory**: `frontend`
  - **Build Command**: (leave empty)
  - **Output Directory**: `.`
- [ ] Click **"Deploy"**
- [ ] Wait for deployment (30 seconds)
- [ ] **Copy your frontend URL**: `https://your-app.vercel.app`

---

## 🔗 Step 4: Connect Frontend to Backend

- [ ] Open your deployed frontend URL
- [ ] Open browser console (Press **F12**)
- [ ] Run this command (replace with your actual Render URL):
  ```javascript
  setApiUrl('your-app-xxxx.onrender.com')
  ```
  ⚠️ **Note**: Don't include `https://` or `http://`
- [ ] Page will reload

---

## ✅ Step 5: Test Everything

- [ ] Add a test task
- [ ] Task appears in correct quadrant
- [ ] Drag task to another quadrant - should move
- [ ] Edit task and add notes
- [ ] Delete task
- [ ] Refresh page - should work (may take 30s if backend was asleep)

---

## 🎉 Done!

Your app is now live and shareable!

### Share Your App
Give people your Vercel URL: `https://your-app.vercel.app`

### Update Your App
Whenever you make changes:
```powershell
git add .
git commit -m "Your changes"
git push
```
Both platforms will auto-deploy the updates!

---

## ⚠️ Common Issues

### Backend is slow on first load
- **Normal**: Free tier sleeps after 15 min inactivity
- **Solution**: Wait 30-50 seconds for it to wake up

### "Failed to load tasks" error
- **Check**: Backend is running (check Render dashboard)
- **Check**: API URL is set correctly (console: `console.log(API_BASE_URL)`)
- **Fix**: Run `setApiUrl('correct-url.onrender.com')` again

### Tasks disappear after refresh
- **Expected**: Currently using in-memory storage
- **Solution**: Backend restarted. Tasks will persist during a session
- **Future**: Add a database for permanent storage

---

## 📚 Need More Help?

See the full [DEPLOYMENT.md](DEPLOYMENT.md) guide for:
- Detailed instructions with explanations
- Alternative hosting options (Netlify, Railway, etc.)
- Troubleshooting guide
- Custom domain setup
- Database integration

---

**🚀 Happy Deploying!**
