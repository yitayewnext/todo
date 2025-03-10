// Get references to HTML elements
const todoInput = document.getElementById('todo-input');
const todoDate = document.getElementById('todo-date');
const addButton = document.getElementById('add-button');
const todoList = document.getElementById('todo-list');

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Load tasks when the page loads
document.addEventListener('DOMContentLoaded', loadTasks);

// Allow pressing Enter to add a task
todoInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addTask();
  }
});

// Function to load tasks from local storage
function loadTasks() {
  todoList.innerHTML = ''; // Clear existing list
  tasks.forEach(addTaskToDOM);
}

// Function to add a task to the DOM
function addTaskToDOM(task) {
  const li = document.createElement('li');
  li.className = 'flex justify-between items-center bg-gray-200 p-3 rounded-md shadow-sm';
  li.dataset.taskId = task.id; // Assign unique ID

  li.innerHTML = `
    <span class="text-gray-800">${task.text} <span class="text-sm text-gray-600">(Due: ${task.date})</span></span>
    <div class="space-x-2">
      <button class="bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600 transition" onclick="editTask(this)">Edit</button>
      <button class="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition" onclick="removeTask(this)">Delete</button>
    </div>
  `;
  todoList.appendChild(li);
}

// Function to add a new task
function addTask() {
  const taskText = todoInput.value.trim();
  const taskDate = todoDate.value;

  if (taskText === '' || taskDate === '') {
    alert('Please enter a task and a due date!');
    return;
  }

  const task = { id: Date.now(), text: taskText, date: taskDate };
  tasks.push(task);
  addTaskToDOM(task);
  saveTasksToLocalStorage();
  todoInput.value = '';
  todoDate.value = '';
}

// Function to save tasks to local storage
function saveTasksToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to remove a task
function removeTask(button) {
  const li = button.parentElement.parentElement;
  const taskId = Number(li.dataset.taskId); // Retrieve unique ID

  tasks = tasks.filter(task => task.id !== taskId);
  li.remove();
  saveTasksToLocalStorage();
}

// Function to edit a task
function editTask(button) {
  const li = button.parentElement.parentElement;
  const taskId = Number(li.dataset.taskId);
  const task = tasks.find(t => t.id === taskId);

  if (!task) return;

  li.innerHTML = `
    <div class="flex items-center gap-2 w-full">
      <input type="text" class="border p-2 rounded-md w-3/4" value="${task.text}">
      <input type="datetime-local" class="border p-2 rounded-md w-1/4" value="${task.date}">
    </div>
    <div class="flex space-x-2 mt-2">
      <button class="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition" onclick="saveEdit(this)">Save</button>
      <button class="bg-gray-400 text-white px-3 py-1 rounded-md hover:bg-gray-500 transition" onclick="cancelEdit(this)">Cancel</button>
    </div>
  `;
}


// Function to save an edited task
function saveEdit(button) {
  const li = button.parentElement.parentElement;
  const taskId = Number(li.dataset.taskId);
  const inputText = li.querySelector('input[type="text"]').value.trim();
  const inputDate = li.querySelector('input[type="datetime-local"]').value;

  if (inputText === '' || inputDate === '') {
    alert('Please enter a task and a due date!');
    return;
  }

  // Find and update the task in the global array
  tasks = tasks.map(task =>
    task.id === taskId ? { ...task, text: inputText, date: inputDate } : task
  );

  saveTasksToLocalStorage();
  loadTasks(); // Reload tasks to reflect the changes
}

// Function to cancel editing a task
function cancelEdit(button) {
  loadTasks(); // Reload tasks from storage
}

// Event listener for the "Add" button
addButton.addEventListener('click', addTask);
