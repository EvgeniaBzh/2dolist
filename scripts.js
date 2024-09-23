document.addEventListener('DOMContentLoaded', () => {
    const importantTaskInput = document.getElementById('importantTaskInput');
    const addImportantTaskButton = document.getElementById('addImportantTaskButton');
    const importantTaskList = document.getElementById('importantTaskList');

    const mediumTaskInput = document.getElementById('mediumTaskInput');
    const addMediumTaskButton = document.getElementById('addMediumTaskButton');
    const mediumTaskList = document.getElementById('mediumTaskList');

    const optionalTaskInput = document.getElementById('optionalTaskInput');
    const addOptionalTaskButton = document.getElementById('addOptionalTaskButton');
    const optionalTaskList = document.getElementById('optionalTaskList');

    const importantTasks = JSON.parse(localStorage.getItem('importantTasks')) || [];
    const mediumTasks = JSON.parse(localStorage.getItem('mediumTasks')) || [];
    const optionalTasks = JSON.parse(localStorage.getItem('optionalTasks')) || [];

    importantTasks.forEach(task => addTaskToDOM(task, importantTaskList, importantTasks, 'importantTasks'));
    mediumTasks.forEach(task => addTaskToDOM(task, mediumTaskList, mediumTasks, 'mediumTasks'));
    optionalTasks.forEach(task => addTaskToDOM(task, optionalTaskList, optionalTasks, 'optionalTasks'));

    addImportantTaskButton.addEventListener('click', () => addTask(importantTaskInput, importantTaskList, importantTasks, 'importantTasks'));
    addMediumTaskButton.addEventListener('click', () => addTask(mediumTaskInput, mediumTaskList, mediumTasks, 'mediumTasks'));
    addOptionalTaskButton.addEventListener('click', () => addTask(optionalTaskInput, optionalTaskList, optionalTasks, 'optionalTasks'));

    function addTaskToDOM(task, listElement, taskArray, storageKey) {
        const li = document.createElement('li');
        li.draggable = true; 

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.done;
        checkbox.addEventListener('change', () => {
    task.done = checkbox.checked;
    updateTaskStyle(li, task.done);

    const currentKey = getSourceKey(li); // Визначаємо поточну категорію
    localStorage.setItem(currentKey, JSON.stringify(taskArray)); // Оновлюємо локальне сховище поточної категорії
});


        const span = document.createElement('span');
        span.textContent = task.text;

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

        li.addEventListener('dragstart', () => {
            li.classList.add('dragging');
        });

        li.addEventListener('dragend', () => {
            li.classList.remove('dragging');
            saveOrder(listElement, taskArray, storageKey);
        });

        listElement.addEventListener('dragend', () => {
    li.classList.remove('dragging');
    // Видалити завдання з попередньої категорії
    const sourceKey = getSourceKey(li); // Отримуємо категорію, з якої взято завдання
    const sourceArray = JSON.parse(localStorage.getItem(sourceKey)) || [];
    deleteTaskFromArray(li, sourceArray, sourceKey);
    
    // Зберегти новий порядок у цільовій категорії
    saveOrder(listElement, taskArray, storageKey);
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

        listElement.addEventListener('drop', (e) => {
    const draggingTask = document.querySelector('.dragging');
    const newTaskArray = updateTaskArray(draggingTask, taskArray, storageKey);

    // Видаляємо завдання з попередньої категорії
    const sourceKey = getSourceKey(draggingTask);
    const sourceArray = JSON.parse(localStorage.getItem(sourceKey)) || [];
    deleteTaskFromArray(draggingTask, sourceArray, sourceKey);

    // Оновлюємо нову категорію
    localStorage.setItem(storageKey, JSON.stringify(newTaskArray));
});

    }

    function addTask(inputElement, listElement, taskArray, storageKey) {
        const taskText = inputElement.value.trim();
        if (taskText) {
            const task = { text: taskText, done: false };
            addTaskToDOM(task, listElement, taskArray, storageKey);
            taskArray.push(task);
            localStorage.setItem(storageKey, JSON.stringify(taskArray));
            inputElement.value = '';
        }
    }

    function getSourceKey(taskElement) {
    // Наприклад, можна отримати ключ зі списку (listElement) батьківського елемента
    return taskElement.closest('ul').dataset.key; // наприклад, data-key="middle" або "optional"
}


function updateTaskArray(draggingTask, targetArray, targetKey) {
    const taskText = draggingTask.querySelector('span').textContent;
    const sourceKey = getSourceKey(draggingTask);

    const sourceArray = JSON.parse(localStorage.getItem(sourceKey)) || [];
    const index = sourceArray.findIndex(task => task.text === taskText);
    if (index !== -1) {
        sourceArray.splice(index, 1); 
        localStorage.setItem(sourceKey, JSON.stringify(sourceArray));
    }

    const doneStatus = draggingTask.querySelector('input[type="checkbox"]').checked;
    const newTask = { text: taskText, done: doneStatus };

    const existingIndex = targetArray.findIndex(task => task.text === taskText);
    if (existingIndex === -1) {
        targetArray.push(newTask);
    } else {
        targetArray[existingIndex].done = doneStatus;
    }

    return targetArray;
}


    function getSourceKey(draggingTask) {
        if (importantTaskList.contains(draggingTask)) {
            return 'importantTasks';
        } else if (mediumTaskList.contains(draggingTask)) {
            return 'mediumTasks';
        } else if (optionalTaskList.contains(draggingTask)) {
            return 'optionalTasks';
        }
    }

    function updateTaskStyle(li, isDone) {
        if (isDone) {
            li.classList.add('completed');
        } else {
            li.classList.remove('completed');
        }
    }

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

    function saveOrder(listElement, taskArray, storageKey) {
        const updatedTasks = [];
        listElement.querySelectorAll('li').forEach((li) => {
            const text = li.querySelector('span').textContent;
            const done = li.querySelector('input[type="checkbox"]').checked;
            updatedTasks.push({ text: text, done: done });
        });
        localStorage.setItem(storageKey, JSON.stringify(updatedTasks));
    }

    function deleteTaskFromArray(li, taskArray, storageKey) {
    const taskText = li.querySelector('span').textContent;
    const index = taskArray.findIndex(task => task.text === taskText);
    if (index !== -1) {
        taskArray.splice(index, 1); 
        localStorage.setItem(storageKey, JSON.stringify(taskArray)); 
    }
}

    function deleteTask(li, taskArray, storageKey) {
        const taskText = li.querySelector('span').textContent;
        const index = taskArray.findIndex(task => task.text === taskText);
        if (index !== -1) {
            taskArray.splice(index, 1); 
            localStorage.setItem(storageKey, JSON.stringify(taskArray)); 
            li.remove(); 
        }
    }
});
