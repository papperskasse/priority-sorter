// Local Storage Manager for Priority Sorter
// All data is stored in the user's browser - nothing is sent to servers

const STORAGE_KEY = 'priority-sorter-tasks';

// Storage Manager
const StorageManager = {
    // Load all tasks from localStorage
    loadTasks: function() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading tasks:', error);
            return [];
        }
    },

    // Save all tasks to localStorage
    saveTasks: function(tasks) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
            return true;
        } catch (error) {
            console.error('Error saving tasks:', error);
            showNotification('Error saving tasks', 'error');
            return false;
        }
    },

    // Get a single task by ID
    getTask: function(taskId) {
        const tasks = this.loadTasks();
        return tasks.find(t => t.id === taskId);
    },

    // Add a new task
    addTask: function(task) {
        const tasks = this.loadTasks();
        tasks.push(task);
        return this.saveTasks(tasks);
    },

    // Update a task
    updateTask: function(taskId, updates) {
        const tasks = this.loadTasks();
        const index = tasks.findIndex(t => t.id === taskId);
        
        if (index !== -1) {
            tasks[index] = { ...tasks[index], ...updates };
            return this.saveTasks(tasks);
        }
        return false;
    },

    // Delete a task
    deleteTask: function(taskId) {
        const tasks = this.loadTasks();
        const filtered = tasks.filter(t => t.id !== taskId);
        return this.saveTasks(filtered);
    },

    // Export tasks to JSON file
    exportTasks: function() {
        const tasks = this.loadTasks();
        const dataStr = JSON.stringify(tasks, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `priority-sorter-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showNotification(`Exported ${tasks.length} tasks successfully!`, 'success');
    },

    // Export tasks to CSV (human-readable)
    exportToCSV: function() {
        const tasks = this.loadTasks();
        
        if (tasks.length === 0) {
            showNotification('No tasks to export', 'warning');
            return;
        }

        // CSV Header
        let csv = 'Quadrant,Title,Urgent,Important,Why,How,When,With Whom,Additional Notes,Created Date\n';
        
        // Add each task
        tasks.forEach(task => {
            const quadrantNames = {
                1: 'Urgent & Important (Focus & Execute)',
                2: 'Urgent & Not Important (Minimal Effective Effort or Hand Off)',
                3: 'Not Urgent & Important (Strategize & Schedule)',
                4: 'Not Urgent & Not Important (Put on Ice / Limit)'
            };
            
            const row = [
                quadrantNames[task.quadrant] || 'Unknown',
                `"${(task.title || '').replace(/"/g, '""')}"`,
                task.urgent ? 'Yes' : 'No',
                task.important ? 'Yes' : 'No',
                `"${(task.notes?.why || '').replace(/"/g, '""')}"`,
                `"${(task.notes?.how || '').replace(/"/g, '""')}"`,
                `"${(task.notes?.when || '').replace(/"/g, '""')}"`,
                `"${(task.notes?.with_whom || '').replace(/"/g, '""')}"`,
                `"${(task.notes?.additional || '').replace(/"/g, '""')}"`,
                new Date(task.created_at).toLocaleString()
            ];
            
            csv += row.join(',') + '\n';
        });
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `priority-sorter-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showNotification(`Exported ${tasks.length} tasks to CSV!`, 'success');
    },

    // Import tasks from JSON file
    importTasks: function(file, merge = false) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const importedTasks = JSON.parse(e.target.result);
                
                if (!Array.isArray(importedTasks)) {
                    showNotification('Invalid file format', 'error');
                    return;
                }
                
                let finalTasks;
                
                // Add current context to imported tasks that don't have one
                const currentCtx = localStorage.getItem('currentContext') || 'personal';
                importedTasks.forEach(t => {
                    if (!t.context) t.context = currentCtx;
                });

                if (merge) {
                    // Merge with existing tasks
                    const existingTasks = StorageManager.loadTasks();
                    const existingIds = new Set(existingTasks.map(t => t.id));
                    
                    // Add imported tasks that don't already exist
                    const newTasks = importedTasks.filter(t => !existingIds.has(t.id));
                    finalTasks = [...existingTasks, ...newTasks];
                    
                    showNotification(`Imported ${newTasks.length} new tasks (${importedTasks.length - newTasks.length} duplicates skipped)`, 'success');
                } else {
                    // Replace all tasks
                    finalTasks = importedTasks;
                    showNotification(`Imported ${importedTasks.length} tasks (replaced all existing)`, 'success');
                }
                
                StorageManager.saveTasks(finalTasks);
                loadTasks(); // Reload the UI
            } catch (error) {
                console.error('Import error:', error);
                showNotification('Error importing file. Please check the format.', 'error');
            }
        };
        
        reader.readAsText(file);
    },

    // Import tasks from CSV file
    importFromCSV: function(file, merge = false) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const csvText = e.target.result;
                const lines = csvText.split('\n');
                
                if (lines.length < 2) {
                    showNotification('CSV file is empty or invalid', 'error');
                    return;
                }
                
                // Skip header line
                const importedTasks = [];
                
                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;
                    
                    // Parse CSV line (handle quoted fields)
                    const fields = parseCSVLine(line);
                    
                    if (fields.length < 4) continue; // Need at least quadrant, title, urgent, important
                    
                    // Extract quadrant number from text like "Do First (Urgent & Important)"
                    let quadrant = 1;
                    if (fields[0].includes('Delegate')) quadrant = 2;
                    else if (fields[0].includes('Schedule')) quadrant = 3;
                    else if (fields[0].includes('Eliminate')) quadrant = 4;
                    
                    const currentCtx = localStorage.getItem('currentContext') || 'personal';
                    const task = {
                        id: 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
                        title: fields[1] || 'Untitled Task',
                        urgent: fields[2] === 'Yes',
                        important: fields[3] === 'Yes',
                        context: currentCtx, // Add context to CSV imports
                        notes: {
                            why: fields[4] || '',
                            how: fields[5] || '',
                            when: fields[6] || '',
                            with_whom: fields[7] || '',
                            additional: fields[8] || ''
                        },
                        created_at: new Date().toISOString(),
                        quadrant: quadrant
                    };
                    
                    importedTasks.push(task);
                }
                
                if (importedTasks.length === 0) {
                    showNotification('No valid tasks found in CSV', 'warning');
                    return;
                }
                
                let finalTasks;
                if (merge) {
                    const existingTasks = StorageManager.loadTasks();
                    finalTasks = [...existingTasks, ...importedTasks];
                    showNotification(`Imported ${importedTasks.length} tasks from CSV (merged)`, 'success');
                } else {
                    finalTasks = importedTasks;
                    showNotification(`Imported ${importedTasks.length} tasks from CSV (replaced all)`, 'success');
                }
                
                StorageManager.saveTasks(finalTasks);
                loadTasks();
            } catch (error) {
                console.error('CSV Import error:', error);
                showNotification('Error importing CSV file. Please check the format.', 'error');
            }
        };
        
        reader.readAsText(file);
    },

    // Clear all tasks (with confirmation)
    clearAll: function() {
        if (confirm('⚠️ Are you sure you want to delete ALL tasks? This cannot be undone!\n\nTip: Export your tasks first as a backup.')) {
            localStorage.removeItem(STORAGE_KEY);
            showNotification('All tasks cleared', 'success');
            loadTasks(); // Reload the UI
        }
    },

    // Mark a task as completed/uncompleted
    toggleComplete: function(taskId) {
        const tasks = this.loadTasks();
        const index = tasks.findIndex(t => t.id === taskId);
        
        if (index !== -1) {
            tasks[index].completed = !tasks[index].completed;
            tasks[index].completed_at = tasks[index].completed ? new Date().toISOString() : null;
            return this.saveTasks(tasks);
        }
        return false;
    },

    // Get only completed tasks
    getCompletedTasks: function() {
        return this.loadTasks().filter(t => t.completed);
    },

    // Get only active (non-completed) tasks
    getActiveTasks: function() {
        return this.loadTasks().filter(t => !t.completed);
    },

    // Get task count
    getTaskCount: function() {
        return this.getActiveTasks().length;
    },

    // Reorder tasks (for drag and drop within quadrant)
    reorderTasks: function(taskIds) {
        const tasks = this.loadTasks();
        
        // Create a map of current tasks
        const taskMap = {};
        tasks.forEach(task => {
            taskMap[task.id] = task;
        });
        
        // Create new ordered array
        const orderedTasks = taskIds.map(id => taskMap[id]).filter(Boolean);
        
        // Add any tasks that weren't in the order (shouldn't happen, but safety)
        tasks.forEach(task => {
            if (!taskIds.includes(task.id)) {
                orderedTasks.push(task);
            }
        });
        
        return this.saveTasks(orderedTasks);
    }
};
