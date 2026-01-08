// State management
let currentEditingTaskId = null;
let selectedTaskId = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    setupEventListeners();
    updateTaskCount();
    
    // Check if user has dismissed tips banner
    if (localStorage.getItem('hideTips') === 'true') {
        const tipsBanner = document.getElementById('tipsBanner');
        if (tipsBanner) tipsBanner.style.display = 'none';
    }
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
    const tasks = StorageManager.getActiveTasks(); // Only non-completed
    
    // Clear all quadrants
    for (let i = 1; i <= 4; i++) {
        const quad = document.getElementById(`quadrant-${i}`);
        if (quad) {
            const list = quad.querySelector('.quadrant-tasks');
            if (list) list.innerHTML = '';
        }
    }
    
    // Add tasks to their respective quadrants
    tasks.forEach(task => {
        addTaskToDOM(task);
    });
    
    // Re-select task if it still exists
    if (selectedTaskId) {
        const task = StorageManager.getTask(selectedTaskId);
        if (task && !task.completed) {
            highlightSelectedTask(selectedTaskId);
            updateDetailPane(task);
        } else {
            selectedTaskId = null;
        }
    }
    
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
        quadrant = 2;  // Delegate
    } else if (!urgent && important) {
        quadrant = 3;  // Schedule
    } else {
        quadrant = 4;  // Eliminate
    }
    
    const task = {
        id: generateId(),
        title: title,
        urgent: urgent,
        important: important,
        completed: false,
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
    if (!quadrant) return;
    
    const list = quadrant.querySelector('.quadrant-tasks');
    if (!list) return;
    
    const taskCard = document.createElement('div');
    taskCard.className = `task-card bg-white border border-gray-200 rounded p-1.5 cursor-move shadow-sm ${selectedTaskId === task.id ? 'selected' : ''}`;
    taskCard.draggable = true;
    taskCard.dataset.taskId = task.id;
    
    // Check if task has any notes
    const hasNotes = task.notes && (
        task.notes.why || task.notes.how || task.notes.when || 
        task.notes.with_whom || task.notes.additional
    );
    
    taskCard.innerHTML = `
        <div class="flex justify-between items-center gap-1">
            <div class="flex items-center gap-1.5 flex-1 min-w-0">
                <input 
                    type="checkbox" 
                    ${task.completed ? 'checked' : ''} 
                    onclick="event.stopPropagation(); toggleTaskComplete('${task.id}')"
                    class="w-3.5 h-3.5 text-green-600 rounded cursor-pointer"
                >
                <div class="flex-1 min-w-0 cursor-pointer hover:text-blue-600" onclick="selectTask('${task.id}')">
                    <h4 class="text-xs font-medium text-gray-800 truncate leading-tight">${escapeHtml(task.title)}</h4>
                </div>
            </div>
            <div class="flex gap-0.5 flex-shrink-0 text-[11px]">
                ${hasNotes ? `<span class="text-[10px] mr-0.5" title="Has details">📝</span>` : ''}
                <a 
                    href="edit-task.html?id=${task.id}" 
                    class="text-blue-600 hover:text-blue-800 px-0.5"
                    title="Edit task"
                    onclick="event.stopPropagation()"
                >
                    ✏️
                </a>
                <button 
                    onclick="event.stopPropagation(); deleteTask('${task.id}')" 
                    class="text-red-600 hover:text-red-800 px-0.5"
                    title="Delete task"
                >
                    🗑️
                </button>
            </div>
        </div>
    `;
    
    // Add drag event listeners
    taskCard.addEventListener('dragstart', dragStart);
    taskCard.addEventListener('dragend', dragEnd);
    
    list.appendChild(taskCard);
}

// Select a task to show details in side pane
function selectTask(taskId) {
    const task = StorageManager.getTask(taskId);
    if (!task) return;
    
    selectedTaskId = taskId;
    highlightSelectedTask(taskId);
    updateDetailPane(task);
}

function highlightSelectedTask(taskId) {
    // Remove selected class from all cards
    document.querySelectorAll('.task-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add to specific card
    const card = document.querySelector(`[data-task-id="${taskId}"]`);
    if (card) card.classList.add('selected');
}

function updateDetailPane(task) {
    const detailPane = document.getElementById(`detail-${task.quadrant}`);
    if (!detailPane) return;
    
    // Clear other detail panes
    for (let i = 1; i <= 4; i++) {
        if (i !== task.quadrant) {
            const dp = document.getElementById(`detail-${i}`);
            if (dp) dp.innerHTML = '<p class="text-xs text-gray-400 italic text-center mt-4">Select a task to see breakdown</p>';
        }
    }
    
    // Build content
    let html = `
        <div class="h-full flex flex-col">
            <div class="flex justify-between items-start mb-2 pb-2 border-b border-gray-100">
                <h5 class="text-sm font-bold text-gray-800 leading-tight pr-4">${escapeHtml(task.title)}</h5>
                <button onclick="closeDetailPane(${task.quadrant})" class="text-gray-400 hover:text-gray-600 text-lg leading-none">&times;</button>
            </div>
            <div class="flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar">
    `;
    
    if (task.notes.why) {
        html += `<div class="detail-section">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">❓ Why</span>
            <p class="text-xs text-gray-700 mt-0.5">${escapeHtml(task.notes.why)}</p>
        </div>`;
    }
    
    if (task.notes.how) {
        html += `<div class="detail-section">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">🔧 How</span>
            <p class="text-xs text-gray-700 mt-0.5">${escapeHtml(task.notes.how)}</p>
        </div>`;
    }
    
    if (task.notes.when) {
        html += `<div class="detail-section">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">📅 When</span>
            <p class="text-xs text-gray-700 mt-0.5">${escapeHtml(task.notes.when)}</p>
        </div>`;
    }
    
    if (task.notes.with_whom) {
        html += `<div class="detail-section">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">👥 Who</span>
            <p class="text-xs text-gray-700 mt-0.5">${escapeHtml(task.notes.with_whom)}</p>
        </div>`;
    }
    
    if (task.notes.additional) {
        html += `<div class="detail-section">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">📦 Breakdown</span>
            <div class="text-xs text-gray-700 mt-1 bg-gray-50 p-2 rounded border border-gray-100 whitespace-pre-wrap leading-relaxed">${escapeHtml(task.notes.additional)}</div>
        </div>`;
    }
    
    if (!task.notes.why && !task.notes.how && !task.notes.when && !task.notes.with_whom && !task.notes.additional) {
        html += `<p class="text-xs text-gray-400 italic text-center py-4">No breakdown added yet. <br><a href="edit-task.html?id=${task.id}" class="text-blue-500 hover:underline">Add planning</a></p>`;
    }
    
    html += `
            </div>
            <div class="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400">
                <span>Created: ${new Date(task.created_at).toLocaleDateString()}</span>
                <a href="edit-task.html?id=${task.id}" class="text-blue-500 font-semibold hover:underline">Full Edit</a>
            </div>
        </div>
    `;
    
    detailPane.innerHTML = html;
}

function closeDetailPane(quadrantId) {
    const detailPane = document.getElementById(`detail-${quadrantId}`);
    if (detailPane) {
        detailPane.innerHTML = '<p class="text-xs text-gray-400 italic text-center mt-4">Select a task to see breakdown</p>';
    }
    selectedTaskId = null;
    document.querySelectorAll('.task-card').forEach(card => card.classList.remove('selected'));
}

async function toggleTaskComplete(taskId) {
    StorageManager.toggleComplete(taskId);
    showNotification('Task marked as completed! Moving to Finished Tasks.', 'success');
    
    // If it was selected, clear detail pane
    if (selectedTaskId === taskId) {
        selectedTaskId = null;
    }
    
    // Remove from UI
    const card = document.querySelector(`[data-task-id="${taskId}"]`);
    if (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateX(20px)';
        card.style.transition = 'all 0.3s ease';
        setTimeout(() => loadTasks(), 300);
    } else {
        loadTasks();
    }
}

// Toggle notes visibility - (Deprecated by new selectTask function)
function toggleNotes(taskId) {
    selectTask(taskId);
}

// Edit task
function editTask(taskId) {
    window.location.href = `edit-task.html?id=${taskId}`;
}

// Save edited task - (Handled by edit-task.html)
function saveEdit() {}

// Close edit modal - (Handled by edit-task.html)
function closeEditModal() {}

// Delete task
function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    StorageManager.deleteTask(taskId);
    
    // If it was selected, clear detail pane
    if (selectedTaskId === taskId) {
        selectedTaskId = null;
    }
    
    // Remove from DOM
    const taskCard = document.querySelector(`[data-task-id="${taskId}"]`);
    if (taskCard) {
        taskCard.remove();
    }
    
    updateTaskCount();
    showNotification('Task deleted successfully!', 'success');
    loadTasks();
}

// Drag and Drop Functions
let draggedElement = null;
let sourceQuadrant = null;

function dragStart(e) {
    draggedElement = e.target;
    sourceQuadrant = e.target.closest('.quadrant');
    
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    
    // Safari Fix: Standardize data type
    try {
        e.dataTransfer.setData('text/plain', e.target.dataset.taskId);
    } catch (err) {
        e.dataTransfer.setData('taskId', e.target.dataset.taskId);
    }
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
    // Safari Fix: dragover and dragenter both need preventDefault
    if (e.type === 'dragenter') return;
    
    e.dataTransfer.dropEffect = 'move';
    
    const quadrantTasks = e.currentTarget;
    const quadrantContainer = quadrantTasks.closest('.quadrant');
    quadrantTasks.classList.add('drag-over');
    
    const afterElement = getDragAfterElement(quadrantTasks, e.clientY);
    const dragging = document.querySelector('.dragging');
    
    if (dragging) {
        if (afterElement == null) {
            quadrantTasks.appendChild(dragging);
        } else {
            quadrantTasks.insertBefore(dragging, afterElement);
        }
    }
}

function dragLeave(e) {
    if (e.target.classList.contains('quadrant-tasks')) {
        e.target.classList.remove('drag-over');
    }
}

function drop(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const list = e.currentTarget;
    const quadrantContainer = list.closest('.quadrant');
    list.classList.remove('drag-over');
    
    // Safari Fix: Try getting data from multiple possible keys
    const taskId = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('taskId');
    const newQuadrant = parseInt(quadrantContainer.dataset.quadrant);
    
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
        
        // If it was selected, update detail pane to show correct quadrant info
        if (selectedTaskId === taskId) {
            setTimeout(() => selectTask(taskId), 10);
        }
        
        showNotification('Task moved to different quadrant!', 'success');
    }
    
    // Save the new order of tasks
    saveTaskOrder();
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-card:not(.dragging)')];
    
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
        if (!quadrant) continue;
        const list = quadrant.querySelector('.quadrant-tasks');
        const taskCards = list.querySelectorAll('.task-card');
        
        taskCards.forEach(card => {
            orderedTaskIds.push(card.dataset.taskId);
        });
    }
    
    // Include completed tasks that aren't in the matrix
    const completedTasks = allTasks.filter(t => t.completed);
    
    // Reorder active tasks array based on DOM order
    const orderedActiveTasks = orderedTaskIds.map(id => taskMap[id]).filter(Boolean);
    
    // Save both
    StorageManager.saveTasks([...orderedActiveTasks, ...completedTasks]);
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
    if (!text) return '';
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

// Toggle info panel
function toggleInfo() {
    const infoPanel = document.getElementById('infoPanel');
    infoPanel.classList.toggle('hidden');
}

// Log storage info
console.log('🎯 Priority Sorter - Browser Storage Mode');
console.log('📦 All data is stored locally in your browser');
console.log('🔒 Your tasks are completely private');
console.log(`📊 Active tasks: ${StorageManager.getTaskCount()}`);
