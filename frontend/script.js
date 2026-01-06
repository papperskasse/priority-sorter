// State management
let currentEditingTaskId = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    setupEventListeners();
    updateTaskCount();
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

// Load all tasks from localStorage
function loadTasks() {
    const tasks = StorageManager.loadTasks();
    
    // Clear all quadrants
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`quadrant-${i}`).innerHTML = '';
    }
    
    // Add tasks to their respective quadrants
    tasks.forEach(task => {
        addTaskToDOM(task);
    });
    
    updateTaskCount();
}

// Add a new task
function addTask() {
    const title = document.getElementById('taskTitle').value.trim();
    const urgent = document.getElementById('taskUrgent').checked;
    const important = document.getElementById('taskImportant').checked;
    
    if (!title) {
        showNotification('Please enter a task title', 'warning');
        return;
    }
    
    // Calculate quadrant
    let quadrant;
    if (urgent && important) {
        quadrant = 1;  // Do First
    } else if (urgent && !important) {
        quadrant = 2;  // Schedule
    } else if (!urgent && important) {
        quadrant = 3;  // Delegate
    } else {
        quadrant = 4;  // Eliminate
    }
    
    const task = {
        id: generateId(),
        title: title,
        urgent: urgent,
        important: important,
        notes: {
            why: '',
            how: '',
            when: '',
            with_whom: '',
            additional: ''
        },
        created_at: new Date().toISOString(),
        quadrant: quadrant
    };
    
    StorageManager.addTask(task);
    addTaskToDOM(task);
    
    // Clear form
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskUrgent').checked = false;
    document.getElementById('taskImportant').checked = false;
    
    updateTaskCount();
    showNotification('Task added successfully!', 'success');
}

// Add task to DOM
function addTaskToDOM(task) {
    const quadrant = document.getElementById(`quadrant-${task.quadrant}`);
    
    const taskCard = document.createElement('div');
    taskCard.className = 'task-card bg-white border border-gray-200 rounded-md p-2 cursor-move shadow-sm';
    taskCard.draggable = true;
    taskCard.dataset.taskId = task.id;
    
    // Check if task has any notes
    const hasNotes = task.notes && (
        task.notes.why || task.notes.how || task.notes.when || 
        task.notes.with_whom || task.notes.additional
    );
    
    taskCard.innerHTML = `
        <div class="flex justify-between items-center gap-2">
            <h4 class="text-sm font-medium text-gray-800 flex-1 truncate">${escapeHtml(task.title)}</h4>
            <div class="flex gap-1 flex-shrink-0">
                <a 
                    href="edit-task.html?id=${task.id}" 
                    class="text-blue-600 hover:text-blue-800 text-xs"
                    title="Edit task"
                >
                    ✏️
                </a>
                <button 
                    onclick="deleteTask('${task.id}')" 
                    class="text-red-600 hover:text-red-800 text-xs"
                    title="Delete task"
                >
                    🗑️
                </button>
            </div>
        </div>
        ${hasNotes ? `<div class="text-xs text-gray-500 mt-1">📝 Has notes</div>` : ''}
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
function editTask(taskId) {
    const task = StorageManager.getTask(taskId);
    
    if (!task) {
        showNotification('Task not found', 'error');
        return;
    }
    
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
}

// Save edited task
function saveEdit() {
    if (!currentEditingTaskId) return;
    
    const title = document.getElementById('editTitle').value.trim();
    const urgent = document.getElementById('editUrgent').checked;
    const important = document.getElementById('editImportant').checked;
    
    if (!title) {
        showNotification('Task title cannot be empty', 'warning');
        return;
    }
    
    // Calculate new quadrant
    let quadrant;
    if (urgent && important) {
        quadrant = 1;
    } else if (urgent && !important) {
        quadrant = 2;
    } else if (!urgent && important) {
        quadrant = 3;
    } else {
        quadrant = 4;
    }
    
    const updates = {
        title: title,
        urgent: urgent,
        important: important,
        quadrant: quadrant,
        notes: {
            why: document.getElementById('editWhy').value.trim(),
            how: document.getElementById('editHow').value.trim(),
            when: document.getElementById('editWhen').value.trim(),
            with_whom: document.getElementById('editWithWhom').value.trim(),
            additional: document.getElementById('editAdditional').value.trim()
        }
    };
    
    StorageManager.updateTask(currentEditingTaskId, updates);
    closeEditModal();
    loadTasks();
    showNotification('Task updated successfully!', 'success');
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editModal').classList.add('hidden');
    currentEditingTaskId = null;
}

// Delete task
function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    StorageManager.deleteTask(taskId);
    
    // Remove from DOM
    const taskCard = document.querySelector(`[data-task-id="${taskId}"]`);
    if (taskCard) {
        taskCard.remove();
    }
    
    updateTaskCount();
    showNotification('Task deleted successfully!', 'success');
}

// Drag and Drop Functions
let draggedElement = null;
let sourceQuadrant = null;

function dragStart(e) {
    draggedElement = e.target;
    sourceQuadrant = e.target.closest('.quadrant');
    
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
    e.dataTransfer.setData('taskId', e.target.dataset.taskId);
}

function dragEnd(e) {
    e.target.classList.remove('dragging');
    draggedElement = null;
    sourceQuadrant = null;
    
    // Remove all drag-over classes
    document.querySelectorAll('.drag-over').forEach(el => {
        el.classList.remove('drag-over');
    });
}

function allowDrop(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    const quadrant = e.currentTarget;
    const afterElement = getDragAfterElement(quadrant, e.clientY);
    const dragging = document.querySelector('.dragging');
    
    if (afterElement == null) {
        quadrant.appendChild(dragging);
    } else {
        quadrant.insertBefore(dragging, afterElement);
    }
}

function dragLeave(e) {
    if (e.target.classList.contains('quadrant')) {
        e.target.classList.remove('drag-over');
    }
}

function drop(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const quadrant = e.currentTarget;
    quadrant.classList.remove('drag-over');
    
    const taskId = e.dataTransfer.getData('taskId');
    const newQuadrant = parseInt(quadrant.dataset.quadrant);
    
    if (!taskId || !newQuadrant) return;
    
    const task = StorageManager.getTask(taskId);
    if (!task) return;
    
    const oldQuadrant = task.quadrant;
    
    // Check if we moved to a different quadrant
    if (oldQuadrant !== newQuadrant) {
        // Update urgent/important based on quadrant
        let updates = { quadrant: newQuadrant };
        
        if (newQuadrant === 1) {
            updates.urgent = true;
            updates.important = true;
        } else if (newQuadrant === 2) {
            updates.urgent = true;
            updates.important = false;
        } else if (newQuadrant === 3) {
            updates.urgent = false;
            updates.important = true;
        } else if (newQuadrant === 4) {
            updates.urgent = false;
            updates.important = false;
        }
        
        StorageManager.updateTask(taskId, updates);
        showNotification('Task moved to different quadrant!', 'success');
    }
    
    // Save the new order of tasks
    saveTaskOrder();
}

function getDragAfterElement(quadrant, y) {
    const draggableElements = [...quadrant.querySelectorAll('.task-card:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function saveTaskOrder() {
    const allTasks = StorageManager.loadTasks();
    const taskMap = {};
    allTasks.forEach(task => {
        taskMap[task.id] = task;
    });
    
    const orderedTaskIds = [];
    
    // Go through each quadrant in order and collect task IDs
    for (let i = 1; i <= 4; i++) {
        const quadrant = document.getElementById(`quadrant-${i}`);
        const taskCards = quadrant.querySelectorAll('.task-card');
        
        taskCards.forEach(card => {
            orderedTaskIds.push(card.dataset.taskId);
        });
    }
    
    // Reorder tasks array based on DOM order
    const orderedTasks = orderedTaskIds.map(id => taskMap[id]).filter(Boolean);
    StorageManager.saveTasks(orderedTasks);
}

// Export/Import Functions
function exportJSON() {
    StorageManager.exportTasks();
}

function exportCSV() {
    StorageManager.exportToCSV();
}

function importTasks() {
    document.getElementById('importFile').click();
}

function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const merge = confirm('Do you want to MERGE with existing tasks?\n\nClick OK to merge, or Cancel to REPLACE all tasks.');
    
    // Check file type
    if (file.name.endsWith('.csv')) {
        StorageManager.importFromCSV(file, merge);
    } else {
        StorageManager.importTasks(file, merge);
    }
    
    // Reset file input
    event.target.value = '';
}

function clearAllTasks() {
    StorageManager.clearAll();
}

// Update task count display
function updateTaskCount() {
    const count = StorageManager.getTaskCount();
    const countElement = document.getElementById('taskCount');
    if (countElement) {
        countElement.textContent = count;
    }
}

// Utility Functions
function generateId() {
    return 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

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

// Parse CSV line handling quoted fields
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current);
    return result;
}

// Toggle info panel
function toggleInfo() {
    const infoPanel = document.getElementById('infoPanel');
    infoPanel.classList.toggle('hidden');
}

// Log storage info
console.log('🎯 Priority Sorter - Browser Storage Mode');
console.log('📦 All data is stored locally in your browser');
console.log('🔒 Your tasks are completely private');
console.log(`📊 Current tasks: ${StorageManager.getTaskCount()}`);
