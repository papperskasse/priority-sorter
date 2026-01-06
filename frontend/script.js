// State management
let currentEditingTaskId = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Enter key to add task
    document.getElementById('taskTitle').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
}

// Load all tasks from the API
async function loadTasks() {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks`);
        if (!response.ok) throw new Error('Failed to load tasks');
        
        const tasks = await response.json();
        
        // Clear all quadrants
        for (let i = 1; i <= 4; i++) {
            document.getElementById(`quadrant-${i}`).innerHTML = '';
        }
        
        // Add tasks to their respective quadrants
        tasks.forEach(task => {
            addTaskToDOM(task);
        });
    } catch (error) {
        console.error('Error loading tasks:', error);
        showNotification('Error loading tasks. Make sure the backend is running.', 'error');
    }
}

// Add a new task
async function addTask() {
    const title = document.getElementById('taskTitle').value.trim();
    const urgent = document.getElementById('taskUrgent').checked;
    const important = document.getElementById('taskImportant').checked;
    
    if (!title) {
        showNotification('Please enter a task title', 'warning');
        return;
    }
    
    const taskData = {
        title,
        urgent,
        important,
        notes: {
            why: '',
            how: '',
            when: '',
            with_whom: '',
            additional: ''
        }
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData)
        });
        
        if (!response.ok) throw new Error('Failed to create task');
        
        const task = await response.json();
        addTaskToDOM(task);
        
        // Clear form
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskUrgent').checked = false;
        document.getElementById('taskImportant').checked = false;
        
        showNotification('Task added successfully!', 'success');
    } catch (error) {
        console.error('Error adding task:', error);
        showNotification('Error adding task', 'error');
    }
}

// Add task to DOM
function addTaskToDOM(task) {
    const quadrant = document.getElementById(`quadrant-${task.quadrant}`);
    
    const taskCard = document.createElement('div');
    taskCard.className = 'task-card bg-white border-2 border-gray-200 rounded-lg p-4 cursor-move shadow-sm';
    taskCard.draggable = true;
    taskCard.dataset.taskId = task.id;
    
    // Check if task has any notes
    const hasNotes = task.notes && (
        task.notes.why || task.notes.how || task.notes.when || 
        task.notes.with_whom || task.notes.additional
    );
    
    taskCard.innerHTML = `
        <div class="flex justify-between items-start mb-2">
            <h4 class="font-semibold text-gray-800 flex-1">${escapeHtml(task.title)}</h4>
            <div class="flex gap-1 ml-2">
                <button 
                    onclick="editTask('${task.id}')" 
                    class="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                    title="Edit task"
                >
                    ✏️
                </button>
                <button 
                    onclick="deleteTask('${task.id}')" 
                    class="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                    title="Delete task"
                >
                    🗑️
                </button>
            </div>
        </div>
        <div class="flex gap-2 text-xs mb-2">
            ${task.urgent ? '<span class="bg-red-100 text-red-800 px-2 py-1 rounded">🔥 Urgent</span>' : ''}
            ${task.important ? '<span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">⭐ Important</span>' : ''}
        </div>
        <div class="text-xs text-gray-500">
            Created: ${new Date(task.created_at).toLocaleDateString()}
        </div>
        ${hasNotes ? `
            <button 
                onclick="toggleNotes('${task.id}')" 
                class="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
                📝 View Notes ▼
            </button>
            <div id="notes-${task.id}" class="notes-section mt-2 space-y-2 text-sm">
                ${task.notes.why ? `<div><strong class="text-gray-700">❓ Why:</strong> <p class="text-gray-600 mt-1">${escapeHtml(task.notes.why)}</p></div>` : ''}
                ${task.notes.how ? `<div><strong class="text-gray-700">🔧 How:</strong> <p class="text-gray-600 mt-1">${escapeHtml(task.notes.how)}</p></div>` : ''}
                ${task.notes.when ? `<div><strong class="text-gray-700">📅 When:</strong> <p class="text-gray-600 mt-1">${escapeHtml(task.notes.when)}</p></div>` : ''}
                ${task.notes.with_whom ? `<div><strong class="text-gray-700">👥 With Whom:</strong> <p class="text-gray-600 mt-1">${escapeHtml(task.notes.with_whom)}</p></div>` : ''}
                ${task.notes.additional ? `<div><strong class="text-gray-700">💭 Additional:</strong> <p class="text-gray-600 mt-1">${escapeHtml(task.notes.additional)}</p></div>` : ''}
            </div>
        ` : ''}
    `;
    
    // Add drag event listeners
    taskCard.addEventListener('dragstart', dragStart);
    taskCard.addEventListener('dragend', dragEnd);
    
    quadrant.appendChild(taskCard);
}

// Toggle notes visibility
function toggleNotes(taskId) {
    const notesSection = document.getElementById(`notes-${taskId}`);
    notesSection.classList.toggle('expanded');
    
    const button = notesSection.previousElementSibling;
    if (notesSection.classList.contains('expanded')) {
        button.textContent = '📝 Hide Notes ▲';
    } else {
        button.textContent = '📝 View Notes ▼';
    }
}

// Edit task
async function editTask(taskId) {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`);
        if (!response.ok) throw new Error('Failed to load task');
        
        const task = await response.json();
        
        // Populate modal
        document.getElementById('editTitle').value = task.title;
        document.getElementById('editUrgent').checked = task.urgent;
        document.getElementById('editImportant').checked = task.important;
        document.getElementById('editWhy').value = task.notes.why || '';
        document.getElementById('editHow').value = task.notes.how || '';
        document.getElementById('editWhen').value = task.notes.when || '';
        document.getElementById('editWithWhom').value = task.notes.with_whom || '';
        document.getElementById('editAdditional').value = task.notes.additional || '';
        
        currentEditingTaskId = taskId;
        
        // Show modal
        document.getElementById('editModal').classList.remove('hidden');
    } catch (error) {
        console.error('Error loading task for edit:', error);
        showNotification('Error loading task', 'error');
    }
}

// Save edited task
async function saveEdit() {
    if (!currentEditingTaskId) return;
    
    const taskData = {
        title: document.getElementById('editTitle').value.trim(),
        urgent: document.getElementById('editUrgent').checked,
        important: document.getElementById('editImportant').checked,
        notes: {
            why: document.getElementById('editWhy').value.trim(),
            how: document.getElementById('editHow').value.trim(),
            when: document.getElementById('editWhen').value.trim(),
            with_whom: document.getElementById('editWithWhom').value.trim(),
            additional: document.getElementById('editAdditional').value.trim()
        }
    };
    
    if (!taskData.title) {
        showNotification('Task title cannot be empty', 'warning');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${currentEditingTaskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData)
        });
        
        if (!response.ok) throw new Error('Failed to update task');
        
        closeEditModal();
        loadTasks();
        showNotification('Task updated successfully!', 'success');
    } catch (error) {
        console.error('Error updating task:', error);
        showNotification('Error updating task', 'error');
    }
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editModal').classList.add('hidden');
    currentEditingTaskId = null;
}

// Delete task
async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete task');
        
        // Remove from DOM
        const taskCard = document.querySelector(`[data-task-id="${taskId}"]`);
        if (taskCard) {
            taskCard.remove();
        }
        
        showNotification('Task deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting task:', error);
        showNotification('Error deleting task', 'error');
    }
}

// Drag and Drop Functions
function dragStart(e) {
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
    e.dataTransfer.setData('taskId', e.target.dataset.taskId);
}

function dragEnd(e) {
    e.target.classList.remove('dragging');
}

function allowDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
    e.dataTransfer.dropEffect = 'move';
}

function dragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

async function drop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    const taskId = e.dataTransfer.getData('taskId');
    const newQuadrant = parseInt(e.currentTarget.dataset.quadrant);
    
    if (!taskId || !newQuadrant) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quadrant: newQuadrant })
        });
        
        if (!response.ok) throw new Error('Failed to update task quadrant');
        
        // Reload tasks to reflect the change
        loadTasks();
        showNotification('Task moved successfully!', 'success');
    } catch (error) {
        console.error('Error moving task:', error);
        showNotification('Error moving task', 'error');
    }
}

// Utility Functions
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function showNotification(message, type = 'info') {
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    };
    
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transition = 'opacity 0.5s';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Close modal when clicking outside
document.getElementById('editModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'editModal') {
        closeEditModal();
    }
});
