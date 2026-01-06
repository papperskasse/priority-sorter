# ⚡ Quick Start Guide

Choose your path:

## 🏠 Run Locally (5 minutes)

Perfect for testing and development.

### 1. Setup Environment
```powershell
# Create virtual environment
python -m venv venv

# Activate it
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

### 2. Start Backend
```powershell
# In terminal 1
cd backend
python main.py
```
Backend running at: `http://localhost:8000`

### 3. Start Frontend
```powershell
# In terminal 2 (new window)
cd frontend
python -m http.server 8080
```
Frontend running at: `http://localhost:8080`

### 4. Use the App
Open `http://localhost:8080` in your browser and start organizing tasks!

---

## 🌐 Deploy Online (10 minutes)

Share your app with the world for FREE!

### What You'll Need
- GitHub account
- Render.com account (free)
- Vercel.com account (free)

### Deployment Steps

**See [DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md)** for step-by-step checklist

**OR**

**See [DEPLOYMENT.md](DEPLOYMENT.md)** for detailed guide with explanations

### Result
- ✅ Live URL you can share with anyone
- ✅ Automatic updates when you push to GitHub
- ✅ 100% FREE hosting

---

## 📖 Full Documentation

- **[README.md](README.md)** - Complete project documentation
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Detailed deployment guide
- **[DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md)** - Quick deployment checklist

---

## 🆘 Need Help?

### Backend won't start?
- Make sure virtual environment is activated
- Check Python version: `python --version` (need 3.8+)
- Reinstall dependencies: `pip install -r requirements.txt`

### Frontend won't connect?
- Make sure backend is running at `http://localhost:8000`
- Check browser console (F12) for errors
- Try visiting `http://localhost:8000/docs` to verify API

### Can't access app?
- Frontend URL: `http://localhost:8080`
- Try a different port if 8080 is busy: `python -m http.server 3000`

---

**Happy Organizing! 📊**
