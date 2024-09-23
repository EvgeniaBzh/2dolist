document.addEventListener('DOMContentLoaded', () => {
    // Отримуємо елементи для обов'язкових завдань
    const importantTaskInput = document.getElementById('importantTaskInput');
    const addImportantTaskButton = document.getElementById('addImportantTaskButton');
    const importantTaskList = document.getElementById('importantTaskList');

    // Отримуємо елементи для середніх завдань
    const mediumTaskInput = document.getElementById('mediumTaskInput');
    const addMediumTaskButton = document.getElementById('addMediumTaskButton');
    const mediumTaskList = document.getElementById('mediumTaskList');

    // Отримуємо елементи для необов'язкових завдань
    const optionalTaskInput = document.getElementById('optionalTaskInput');
    const addOptionalTaskButton = document.getElementById('addOptionalTaskButton');
    const optionalTaskList = document.getElementById('optionalTaskList');

    // Відновлення задач з LocalStorage для кожної категорії
    const importantTasks = JSON.parse(localStorage.getItem('importantTasks')) || [];
    const mediumTasks = JSON.parse(localStorage.getItem('mediumTasks')) || [];
    const optionalTasks = JSON.parse(localStorage.getItem('optionalTasks')) || [];

    importantTasks.forEach(task => addTaskToDOM(task, importantTaskList, importantTasks, 'importantTasks'));
    mediumTasks.forEach(task => addTaskToDOM(task, mediumTaskList, mediumTasks, 'mediumTasks'));
    optionalTasks.forEach(task => addTaskToDOM(task, optionalTaskList, optionalTasks, 'optionalTasks'));

    // Додавання обов'язкового завдання
    addImportantTaskButton.addEventListener('click', () => {
        const taskText = importantTaskInput.value.trim();
        if (taskText) {
            const task = { text: taskText, done: false };
            addTaskToDOM(task, importantTaskList, importantTasks, 'importantTasks');
            importantTasks.push(task);
            localStorage.setItem('importantTasks', JSON.stringify(importantTasks));
            importantTaskInput.value = '';
        }
    });

    // Додавання середнього завдання
    addMediumTaskButton.addEventListener('click', () => {
        const taskText = mediumTaskInput.value.trim();
        if (taskText) {
            const task = { text: taskText, done: false };
            addTaskToDOM(task, mediumTaskList, mediumTasks, 'mediumTasks');
            mediumTasks.push(task);
            localStorage.setItem('mediumTasks', JSON.stringify(mediumTasks));
            mediumTaskInput.value = '';
        }
    });

    // Додавання необов'язкового завдання
    addOptionalTaskButton.addEventListener('click', () => {
        const taskText = optionalTaskInput.value.trim();
        if (taskText) {
            const task = { text: taskText, done: false };
            addTaskToDOM(task, optionalTaskList, optionalTasks, 'optionalTasks');
            optionalTasks.push(task);
            localStorage.setItem('optionalTasks', JSON.stringify(optionalTasks));
            optionalTaskInput.value = '';
        }
    });

    // Функція для додавання задачі в DOM
    function addTaskToDOM(task, listElement, taskArray, storageKey) {
        const li = document.createElement('li');
        li.draggable = true; // Додаємо властивість draggable

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.done;
        checkbox.addEventListener('change', () => {
            task.done = checkbox.checked;
            updateTaskStyle(li, task.done);
            localStorage.setItem(storageKey, JSON.stringify(taskArray));
        });

        const span = document.createElement('span');
        span.textContent = task.text;

        // Додаємо кнопку видалення
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', () => {
            deleteTask(li, taskArray, storageKey);
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteButton);
        listElement.appendChild(li);

        updateTaskStyle(li, task.done);

        // Додаємо обробку подій для перетягування
        li.addEventListener('dragstart', () => {
            li.classList.add('dragging');
        });

        li.addEventListener('dragend', () => {
            li.classList.remove('dragging');
            saveOrder(listElement, taskArray, storageKey); // Зберігаємо порядок після перетягування
        });

        listElement.addEventListener('dragover', (e) => {
            e.preventDefault();
            const draggingTask = document.querySelector('.dragging');
            const afterElement = getDragAfterElement(listElement, e.clientY);
            if (afterElement == null) {
                listElement.appendChild(draggingTask);
            } else {
                listElement.insertBefore(draggingTask, afterElement);
            }
        });
    }

    // Функція для зміни стилю виконаного завдання
    function updateTaskStyle(li, isDone) {
        if (isDone) {
            li.classList.add('completed');
        } else {
            li.classList.remove('completed');
        }
    }

    // Функція для отримання елемента після якого відбудеться вставка
    function getDragAfterElement(listElement, y) {
        const draggableElements = [...listElement.querySelectorAll('li:not(.dragging)')];

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

    // Функція для збереження порядку завдань у LocalStorage
    function saveOrder(listElement, taskArray, storageKey) {
        const updatedTasks = [];
        listElement.querySelectorAll('li').forEach((li) => {
            const text = li.querySelector('span').textContent;
            const done = li.querySelector('input[type="checkbox"]').checked;
            updatedTasks.push({ text: text, done: done });
        });
        localStorage.setItem(storageKey, JSON.stringify(updatedTasks));
    }

    // Функція для видалення завдання
    function deleteTask(li, taskArray, storageKey) {
        const taskText = li.querySelector('span').textContent;
        const index = taskArray.findIndex(task => task.text === taskText);
        if (index !== -1) {
            taskArray.splice(index, 1); // Видаляємо завдання з масиву
            localStorage.setItem(storageKey, JSON.stringify(taskArray)); // Оновлюємо LocalStorage
            li.remove(); // Видаляємо елемент зі списку
        }
    }
});
