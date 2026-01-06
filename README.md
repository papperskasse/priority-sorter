# 📊 Priority Sorter - Eisenhower Matrix App

A modern, full-stack web application for organizing tasks using the Eisenhower Matrix methodology. Drag and drop tasks between quadrants, add detailed notes, and prioritize effectively!

## 🌟 Features

- **Eisenhower Matrix Layout**: Four quadrants for task prioritization
  - 🔴 **Do First**: Urgent & Important
  - 🟠 **Delegate**: Urgent but Not Important
  - 🔵 **Schedule**: Not Urgent but Important
  - ⚪ **Eliminate**: Not Urgent & Not Important

- **Drag & Drop**: Seamlessly move tasks between quadrants
- **Expandable Notes**: Add detailed information for each task
  - Why (Purpose)
  - How (Method)
  - When (Timing)
  - With Whom (People involved)
  - Additional notes
- **🔒 100% Private**: All data stored locally in your browser
- **Export/Import**: 
  - Export as JSON (for backup and sharing)
  - Export as CSV (human-readable, opens in Excel)
  - Import from JSON to restore or transfer tasks
- **Beautiful UI**: Modern design with Tailwind CSS
- **No Login Required**: Start using immediately

## 🛠️ Tech Stack

### Frontend (Primary)
- **Vanilla JavaScript (ES6+)**: Clean, lightweight frontend
- **Browser localStorage**: 100% private, client-side storage
- **Tailwind CSS**: Utility-first CSS framework
- **HTML5**: Modern markup

### Backend (Optional - For Development/API Testing)
- **FastAPI**: High-performance Python web framework
- **Uvicorn**: Lightning-fast ASGI server
- **Pydantic**: Data validation and settings management

**Note**: The app runs entirely in the browser. The backend is optional and only needed for development/testing.

## 🚀 Getting Started

### Quick Start - Run Locally

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Want to Deploy Online? 🌐
See **[DEPLOYMENT.md](DEPLOYMENT.md)** for step-by-step instructions to deploy to **free hosting** (Render + Vercel/Netlify) and share your app with anyone!

### Installation

1. **Clone or navigate to the project directory**
```bash
cd todosorter
```

2. **Create a Python virtual environment**
```bash
python -m venv venv
```

3. **Activate the virtual environment**
   - **Windows (PowerShell)**:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - **Windows (Command Prompt)**:
     ```cmd
     venv\Scripts\activate.bat
     ```
   - **Mac/Linux**:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies**
```bash
pip install -r requirements.txt
```

### Running the Application

1. **Start the Backend Server**
```bash
cd backend
python main.py
```
The API will be running at `http://localhost:8000`

- API Documentation: `http://localhost:8000/docs` (Swagger UI)
- Alternative Docs: `http://localhost:8000/redoc` (ReDoc)

2. **Start the Frontend** (in a new terminal)
   - Simply open `frontend/index.html` in your web browser, or
   - Use a local web server:
   
   **Option 1 - Python HTTP Server**:
   ```bash
   cd frontend
   python -m http.server 8080
   ```
   Then visit `http://localhost:8080`
   
   **Option 2 - Live Server (if using VS Code/Cursor)**:
   - Right-click on `index.html` and select "Open with Live Server"

## 📖 How to Use

### Adding Tasks
1. Enter a task title in the input field
2. Check "Urgent" and/or "Important" as needed
3. Click "Add Task" or press Enter
4. The task will automatically appear in the correct quadrant

### Managing Tasks
- **Edit**: Click the ✏️ icon to edit task details and add notes
- **Delete**: Click the 🗑️ icon to remove a task
- **Move**: Drag and drop tasks between quadrants to reclassify them
- **View Notes**: Click "View Notes" to expand and see detailed information

### Task Notes
When editing a task, you can add detailed information:
- **Why**: The purpose or reason for the task
- **How**: The method or approach to complete it
- **When**: Timing or deadlines
- **With Whom**: People involved or responsible
- **Additional**: Any other relevant details

### Export & Import
- **💾 Export JSON**: Download your tasks as a JSON file (for backup or transferring to another device)
- **📊 Export CSV**: Download as CSV to open in Excel/Google Sheets (human-readable)
- **📥 Import Tasks**: Upload a previously exported JSON file to restore your tasks
- **🗑️ Clear All**: Delete all tasks (with confirmation)

### Privacy & Data
- **100% Private**: All your tasks are stored locally in your browser
- **No Account Needed**: Start using immediately
- **No Server Storage**: Your data never leaves your device
- **Multiple Devices**: Export from one device, import on another

## 🏗️ Project Structure

```
todosorter/
├── backend/
│   └── main.py           # FastAPI application
├── frontend/
│   ├── index.html        # Main HTML file
│   └── script.js         # JavaScript logic
├── requirements.txt      # Python dependencies
└── README.md            # This file
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Root endpoint with API info |
| GET | `/tasks` | Get all tasks |
| GET | `/tasks/{task_id}` | Get a specific task |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks/{task_id}` | Update a task |
| DELETE | `/tasks/{task_id}` | Delete a task |
| GET | `/quadrants/{quadrant_id}` | Get tasks by quadrant (1-4) |

## 🎯 The Eisenhower Matrix

The Eisenhower Matrix, also known as the Urgent-Important Matrix, is a time management tool that helps you prioritize tasks:

1. **Urgent & Important (Do First)**: Critical tasks requiring immediate attention
2. **Urgent & Not Important (Schedule)**: Tasks that seem urgent but don't contribute to long-term goals
3. **Not Urgent & Important (Delegate)**: Strategic tasks for long-term success
4. **Not Urgent & Not Important (Eliminate)**: Distractions and time-wasters

## 🌐 Deployment

Want to share your app online? This project is ready to deploy to free hosting!

**See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment instructions.**

Quick summary:
- **Backend**: Deploy to Render.com (Free tier)
- **Frontend**: Deploy to Vercel or Netlify (Free tier)
- **Total cost**: $0/month
- **Deployment time**: ~10 minutes

The deployment guide includes:
- Step-by-step instructions with screenshots
- GitHub setup
- Automatic deployment on push
- Troubleshooting tips
- Custom domain setup

## 🔮 Future Enhancements

- [ ] Persistent database (SQLite/PostgreSQL)
- [ ] User authentication and multiple users
- [ ] Task deadlines and reminders
- [ ] Task completion tracking
- [ ] Export tasks to CSV/PDF
- [ ] Dark mode
- [ ] Mobile responsive improvements
- [ ] Keyboard shortcuts
- [ ] Offline support with PWA
- [ ] Email notifications

## 🐛 Troubleshooting

### Backend won't start
- Make sure you've activated the virtual environment
- Check that all dependencies are installed: `pip install -r requirements.txt`
- Ensure port 8000 is not already in use

### Frontend can't connect to backend
- Verify the backend is running at `http://localhost:8000`
- Check browser console for error messages
- Ensure CORS is properly configured (already set in the code)

### Tasks not appearing
- Check that the backend server is running
- Open browser developer tools (F12) and check the Console tab for errors
- Verify API is accessible by visiting `http://localhost:8000/docs`

## 📝 License

This project is open source and available for personal and educational use.

## 🙏 Credits

Built with modern web technologies and the power of AI-assisted development.

---

**Happy Prioritizing! 🎯**
