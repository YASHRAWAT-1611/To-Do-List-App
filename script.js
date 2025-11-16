// --- 1. DOM Element Selection ---
// Get references to the HTML elements we need to interact with
const taskInput = document.getElementById('task-input');
const addButton = document.getElementById('add-button');
const taskList = document.getElementById('task-list');
const themeToggleButton = document.getElementById('theme-toggle');

// --- 2. Initial Data Loading ---
// Load tasks from Local Storage when the page first loads
document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
    loadTheme(); // Load theme preference after page loads
});

// --- 3. Event Listeners ---
// Add a task when the button is clicked
addButton.addEventListener('click', addTask);
themeToggleButton.addEventListener('click', toggleTheme);

// Add a task when the 'Enter' key is pressed in the input field
taskInput.addEventListener('keypress', function(e) {
    // Check if the key pressed is the 'Enter' key (key code 13)
    if (e.key === 'Enter') {
        addTask();
    }
});

// Use event delegation on the task list for completion and deletion
taskList.addEventListener('click', handleTaskActions);

// --- 4. Core Functions ---

/**
 * Creates and adds a new task item to the list.
 * It also handles saving the new task to Local Storage.
 * @param {string} [taskText] - Optional text for loading tasks from storage.
 * @param {boolean} [isCompleted=false] - Optional state for loading completed tasks.
 */
function addTask(taskText = taskInput.value.trim(), isCompleted = false) {
    // 1. Validation: Don't add empty tasks
    if (taskText === "") {
        alert("Please write down a task before adding it!");
        return;
    }

    // 2. Create the list item (<li>) and its contents
    const li = document.createElement('li');
    
    // Set the completion status based on the input parameter
    if (isCompleted) {
        li.classList.add('completed');
    }

    // Create a container for the visible task text
    const taskTextSpan = document.createElement('span');
    taskTextSpan.className = 'task-text';
    taskTextSpan.textContent = taskText;

    // Create the delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '×'; // Unicode 'multiplication sign' often used for 'close'
    deleteButton.className = 'delete-button';

    // Append the elements to the list item
    li.appendChild(taskTextSpan);
    li.appendChild(deleteButton);

    // 3. Add the new item to the main list (<ul>)
    taskList.appendChild(li);

    // 4. Reset the input field only if this is a newly created task (not one being loaded)
    if (!isCompleted && taskInput.value.trim() !== '') {
        taskInput.value = '';
    }

    // 5. Save the updated list to Local Storage
    saveTasks();
}

/**
 * Handles toggling completion status and deleting tasks using event delegation.
 * @param {Event} e - The click event object.
 */
function handleTaskActions(e) {
    const clickedElement = e.target;
    const listItem = clickedElement.closest('li'); // Find the parent <li> element

    if (!listItem) return; // If the click wasn't inside an li, do nothing.

    // If the delete button was clicked
    if (clickedElement.classList.contains('delete-button')) {
        // Remove the task from the DOM
        listItem.remove();
        // Update Local Storage
        saveTasks();
        return;
    }

    // If the user clicked the task text (or the <li> itself)
    // We check if the clicked element is not the delete button
    if (!clickedElement.classList.contains('delete-button')) {
        // Toggle the 'completed' class on the list item
        listItem.classList.toggle('completed');
        // Update Local Storage
        saveTasks();
    }
}

/**
 * Saves all current tasks in the task list to Local Storage.
 */
function saveTasks() {
    // Get all list items from the current list
    const tasks = [];
    taskList.querySelectorAll('li').forEach(li => {
        // Create an object for each task with its text and completion status
        tasks.push({
            text: li.querySelector('.task-text').textContent,
            completed: li.classList.contains('completed')
        });
    });

    // Convert the JavaScript array of task objects into a JSON string
    // and save it under the key 'tasks'
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

/**
 * Loads tasks from Local Storage and displays them on the page.
 */
function loadTasks() {
    // Get the JSON string from Local Storage
    const savedTasks = localStorage.getItem('tasks');

    // If there is saved data
    if (savedTasks) {
        // Convert the JSON string back into a JavaScript array of task objects
        const tasks = JSON.parse(savedTasks);
        
        // Loop through the array and call addTask for each one
        tasks.forEach(task => {
            // We pass the stored text and completion status
            addTask(task.text, task.completed);
        });
    }
}

/**
 * Toggles the 'dark-theme' class on the body and saves the preference.
 */
function toggleTheme() {
    // 1. Toggle the class on the body element
    document.body.classList.toggle('dark-theme');

    // 2. Determine the current theme state
    const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';

    // 3. Save the preference to Local Storage
    localStorage.setItem('themePreference', currentTheme);
}

/**
 * Loads the user's saved theme preference from Local Storage.
 */
function loadTheme() {
    const savedTheme = localStorage.getItem('themePreference');

    // If a theme preference exists
    if (savedTheme) {
        // Apply the 'dark-theme' class if the saved preference is 'dark'
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }
    // If no preference is saved, the default (light) theme remains active.
}