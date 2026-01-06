from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid

app = FastAPI(title="Priority Sorter - Eisenhower Matrix")

# CORS middleware to allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Models
class TaskNotes(BaseModel):
    """Expandable notes for a task"""
    why: Optional[str] = ""
    how: Optional[str] = ""
    when: Optional[str] = ""
    with_whom: Optional[str] = ""
    additional: Optional[str] = ""

class Task(BaseModel):
    """Task model with Eisenhower Matrix classification"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    urgent: bool = False
    important: bool = False
    notes: TaskNotes = Field(default_factory=TaskNotes)
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())
    quadrant: int  # 1: Urgent+Important, 2: Urgent+Not Important, 3: Not Urgent+Important, 4: Not Urgent+Not Important

    def calculate_quadrant(self):
        """Calculate which quadrant the task belongs to"""
        if self.urgent and self.important:
            return 1  # Do First
        elif self.urgent and not self.important:
            return 2  # Schedule
        elif not self.urgent and self.important:
            return 3  # Delegate
        else:
            return 4  # Eliminate

class TaskCreate(BaseModel):
    """Model for creating a new task"""
    title: str
    urgent: bool = False
    important: bool = False
    notes: Optional[TaskNotes] = None

class TaskUpdate(BaseModel):
    """Model for updating a task"""
    title: Optional[str] = None
    urgent: Optional[bool] = None
    important: Optional[bool] = None
    notes: Optional[TaskNotes] = None
    quadrant: Optional[int] = None

# In-memory database (replace with a real database in production)
tasks_db: List[Task] = []

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Priority Sorter API - Eisenhower Matrix",
        "endpoints": {
            "tasks": "/tasks",
            "docs": "/docs"
        }
    }

@app.get("/tasks", response_model=List[Task])
async def get_tasks():
    """Get all tasks sorted by quadrant"""
    return sorted(tasks_db, key=lambda t: t.quadrant)

@app.get("/tasks/{task_id}", response_model=Task)
async def get_task(task_id: str):
    """Get a specific task by ID"""
    task = next((t for t in tasks_db if t.id == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@app.post("/tasks", response_model=Task)
async def create_task(task_data: TaskCreate):
    """Create a new task"""
    task = Task(
        title=task_data.title,
        urgent=task_data.urgent,
        important=task_data.important,
        notes=task_data.notes or TaskNotes(),
        quadrant=0  # Temporary, will be calculated
    )
    task.quadrant = task.calculate_quadrant()
    tasks_db.append(task)
    return task

@app.put("/tasks/{task_id}", response_model=Task)
async def update_task(task_id: str, task_update: TaskUpdate):
    """Update an existing task"""
    task = next((t for t in tasks_db if t.id == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Update fields if provided
    if task_update.title is not None:
        task.title = task_update.title
    if task_update.urgent is not None:
        task.urgent = task_update.urgent
    if task_update.important is not None:
        task.important = task_update.important
    if task_update.notes is not None:
        task.notes = task_update.notes
    
    # If quadrant is explicitly set (for drag-and-drop), update urgent/important accordingly
    if task_update.quadrant is not None:
        task.quadrant = task_update.quadrant
        if task_update.quadrant == 1:
            task.urgent = True
            task.important = True
        elif task_update.quadrant == 2:
            task.urgent = True
            task.important = False
        elif task_update.quadrant == 3:
            task.urgent = False
            task.important = True
        elif task_update.quadrant == 4:
            task.urgent = False
            task.important = False
    else:
        # Recalculate quadrant based on urgent/important
        task.quadrant = task.calculate_quadrant()
    
    return task

@app.delete("/tasks/{task_id}")
async def delete_task(task_id: str):
    """Delete a task"""
    global tasks_db
    task = next((t for t in tasks_db if t.id == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    tasks_db = [t for t in tasks_db if t.id != task_id]
    return {"message": "Task deleted successfully", "id": task_id}

@app.get("/quadrants/{quadrant_id}", response_model=List[Task])
async def get_tasks_by_quadrant(quadrant_id: int):
    """Get all tasks in a specific quadrant"""
    if quadrant_id not in [1, 2, 3, 4]:
        raise HTTPException(status_code=400, detail="Invalid quadrant ID. Must be 1-4.")
    
    return [t for t in tasks_db if t.quadrant == quadrant_id]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
