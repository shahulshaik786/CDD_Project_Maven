const form = document.getElementById('todoForm');
const input = document.getElementById('newTask');
const list = document.getElementById('taskList');
const itemsLeft = document.getElementById('itemsLeft');
const filterButtons = document.querySelectorAll('.filters button');

let tasks = JSON.parse(localStorage.getItem("todos")) || [];

function updateItemsLeft() {
    const count = tasks.filter(t => !t.completed).length;
    itemsLeft.textContent = `${count} item${count !== 1 ? 's' : ''} left`;
}

function renderTasks(filter = "all") {
    list.innerHTML = '';
    tasks.forEach((task, index) => {
        if (
            filter === "all" ||
            (filter === "active" && !task.completed) ||
            (filter === "completed" && task.completed)
        ) {
            const li = document.createElement('li');
            li.textContent = task.text;
            li.className = task.completed ? 'completed' : '';
            li.addEventListener('click', () => {
                tasks[index].completed = !tasks[index].completed;
                saveTasks();
                renderTasks(currentFilter);
            });

            const del = document.createElement('span');
            del.textContent = '✖';
            del.className = 'delete';
            del.addEventListener('click', (e) => {
                e.stopPropagation();
                tasks.splice(index, 1);
                saveTasks();
                renderTasks(currentFilter);
            });

            li.appendChild(del);
            list.appendChild(li);
        }
    });
    updateItemsLeft();
}

function saveTasks() {
    localStorage.setItem("todos", JSON.stringify(tasks));
}

form.addEventListener('submit', e => {
    e.preventDefault();
    const taskText = input.value.trim();
    if (taskText) {
        tasks.push({ text: taskText, completed: false });
        saveTasks();
        renderTasks(currentFilter);
        input.value = '';
    }
});

let currentFilter = "all";
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks(currentFilter);
    });
});
const toggleAllBtn = document.getElementById('toggleAll');
toggleAllBtn.addEventListener('click', () => {
    const allCompleted = tasks.every(task => task.completed);
    tasks = tasks.map(task => ({ ...task, completed: !allCompleted }));
    saveTasks();
    renderTasks(currentFilter);
});
renderTasks();
