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
                1: 'Do First (Urgent & Important)',
                2: 'Delegate (Urgent but Not Important)',
                3: 'Schedule (Not Urgent but Important)',
                4: 'Eliminate (Not Urgent & Not Important)'
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

    // Clear all tasks (with confirmation)
    clearAll: function() {
        if (confirm('⚠️ Are you sure you want to delete ALL tasks? This cannot be undone!\n\nTip: Export your tasks first as a backup.')) {
            localStorage.removeItem(STORAGE_KEY);
            showNotification('All tasks cleared', 'success');
            loadTasks(); // Reload the UI
        }
    },

    // Get task count
    getTaskCount: function() {
        return this.loadTasks().length;
    }
};
