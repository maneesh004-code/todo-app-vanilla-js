// DOM Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const remainingTasksEl = document.getElementById('remainingTasks');

// Task data array
let tasks = [];
let taskIdCounter = 0;

// Event Listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Add Task Function
function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        // Add shake animation to input
        taskInput.style.animation = 'shake 0.5s';
        taskInput.focus();
        setTimeout(() => {
            taskInput.style.animation = '';
        }, 500);
        return;
    }

    // Create task object
    const task = {
        id: taskIdCounter++,
        text: taskText,
        completed: false,
        createdAt: new Date()
    };

    // Add to tasks array
    tasks.push(task);

    // Clear input
    taskInput.value = '';
    taskInput.focus();

    // Re-render tasks
    renderTasks();
    updateStats();
}

// Render Tasks Function
function renderTasks() {
    // Clear current list
    todoList.innerHTML = '';

    if (tasks.length === 0) {
        todoList.innerHTML = `
            <div class="empty-state">
                <h3>No tasks yet</h3>
                <p>Add your first task above to get started!</p>
            </div>
        `;
        return;
    }

    // Create list items for each task
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `todo-item ${task.completed ? 'completed' : ''}`;
        li.dataset.taskId = task.id;

        li.innerHTML = `
            <div class="todo-checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTask(${task.id})"></div>
            <span class="todo-text">${escapeHtml(task.text)}</span>
            <div class="todo-actions">
                <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;

        todoList.appendChild(li);
    });
}

// Toggle Task Completion
function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
        updateStats();
    }
}

// Delete Task Function
function deleteTask(taskId) {
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    
    // Add removing animation
    taskElement.classList.add('removing');
    
    setTimeout(() => {
        // Remove from tasks array
        tasks = tasks.filter(task => task.id !== taskId);
        renderTasks();
        updateStats();
    }, 300);
}

// Update Statistics
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const remaining = total - completed;

    // Animate number changes
    animateNumber(totalTasksEl, total);
    animateNumber(completedTasksEl, completed);
    animateNumber(remainingTasksEl, remaining);
}

// Animate number changes
function animateNumber(element, newValue) {
    const currentValue = parseInt(element.textContent) || 0;
    
    if (currentValue !== newValue) {
        element.style.transform = 'scale(1.2)';
        element.style.color = '#667eea';
        
        setTimeout(() => {
            element.textContent = newValue;
            element.style.transform = 'scale(1)';
            element.style.color = '#333';
        }, 150);
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    updateStats();
    taskInput.focus();
});

// Additional utility functions

// Clear all completed tasks
function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    renderTasks();
    updateStats();
}

// Clear all tasks
function clearAll() {
    if (tasks.length > 0 && confirm('Are you sure you want to delete all tasks?')) {
        tasks = [];
        renderTasks();
        updateStats();
    }
}

// Filter tasks by status
function filterTasks(status) {
    const allItems = document.querySelectorAll('.todo-item');
    
    allItems.forEach(item => {
        const isCompleted = item.classList.contains('completed');
        
        switch(status) {
            case 'all':
                item.style.display = 'flex';
                break;
            case 'active':
                item.style.display = isCompleted ? 'none' : 'flex';
                break;
            case 'completed':
                item.style.display = isCompleted ? 'flex' : 'none';
                break;
        }
    });
}

// Export functions for potential future use
window.todoApp = {
    addTask,
    toggleTask,
    deleteTask,
    clearCompleted,
    clearAll,
    filterTasks,
    getTasks: () => tasks,
    getStats: () => ({
        total: tasks.length,
        completed: tasks.filter(t => t.completed).length,
        remaining: tasks.filter(t => !t.completed).length
    })
};