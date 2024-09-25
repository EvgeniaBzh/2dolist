let sourceArray;
let sourceKey;

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

    if (!localStorage.getItem(importantTaskList.id)) {
        localStorage.setItem(importantTaskList.id, JSON.stringify([]));
    }
    if (!localStorage.getItem(mediumTaskList.id)) {
        localStorage.setItem(mediumTaskList.id, JSON.stringify([]));
    }
    if (!localStorage.getItem(optionalTaskList.id)) {
        localStorage.setItem(optionalTaskList.id, JSON.stringify([]));
    }

    const importantTaskArray = JSON.parse(localStorage.getItem('importantTaskList')) || [];
    const mediumTaskArray = JSON.parse(localStorage.getItem('mediumTaskList')) || [];
    const optionalTaskArray = JSON.parse(localStorage.getItem('optionalTaskList')) || [];

    importantTaskArray.forEach(task => addTaskToDOM(task, importantTaskList, importantTaskArray, importantTaskList.id));
    mediumTaskArray.forEach(task => addTaskToDOM(task, mediumTaskList, mediumTaskArray, mediumTaskList.id));
    optionalTaskArray.forEach(task => addTaskToDOM(task, optionalTaskList, optionalTaskArray, optionalTaskList.id));

    addImportantTaskButton.addEventListener('click', () => addTask(importantTaskInput, importantTaskList, importantTaskList.id));
    addMediumTaskButton.addEventListener('click', () => addTask(mediumTaskInput, mediumTaskList, mediumTaskList.id));
    addOptionalTaskButton.addEventListener('click', () => addTask(optionalTaskInput, optionalTaskList, optionalTaskList.id));

    addImportantTaskButton.addEventListener('click', () => addTask(importantTaskInput, importantTaskList, importantTaskList.id));
    addMediumTaskButton.addEventListener('click', () => addTask(mediumTaskInput, mediumTaskList, mediumTaskList.id));
    addOptionalTaskButton.addEventListener('click', () => addTask(optionalTaskInput, optionalTaskList, optionalTaskList.id));

    // New function to handle input length
    function checkInputLength(inputElement, taskList, storageKey) {
        let taskText = inputElement.value.trim();
        if (taskText.length > 25) {
            const tasks = splitLongTask(taskText);
            tasks.forEach(task => {
                if (task) {
                    const taskObject = { id: Date.now(), text: task, done: false };
                    addTaskToDOM(taskObject, taskList);
                    let currentTaskArray = JSON.parse(localStorage.getItem(storageKey)) || [];
                    currentTaskArray.push(taskObject);
                    localStorage.setItem(storageKey, JSON.stringify(currentTaskArray));
                }
            });
            inputElement.value = '';
        } else if (taskText) {
            const taskObject = { id: Date.now(), text: taskText, done: false };
            addTaskToDOM(taskObject, taskList);
            let currentTaskArray = JSON.parse(localStorage.getItem(storageKey)) || [];
            currentTaskArray.push(taskObject);
            localStorage.setItem(storageKey, JSON.stringify(currentTaskArray));
            inputElement.value = '';
        }
    }

    function splitLongTask(taskText) {
        const splitTasks = [];
        while (taskText.length > 0) {
            splitTasks.push(taskText.substring(0, 25));
            taskText = taskText.substring(25);
        }
        return splitTasks;
    }

    function addTask(inputElement, taskList, storageKey) {
        checkInputLength(inputElement, taskList, storageKey);
    }


    function addTaskToDOM(task, taskList) {
        const li = document.createElement('li');
        li.draggable = true;
        li.dataset.id = task.id;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.done;
        checkbox.addEventListener('change', () => {
            task.done = checkbox.checked;
            updateTaskStyle(li, task.done);

            const currentTaskArray = getCurTaskArray(li);
            const taskIndex = currentTaskArray.findIndex(item => item.id == task.id);
            if (taskIndex !== -1) {
                currentTaskArray[taskIndex].done = checkbox.checked;

            }

            localStorage.setItem(getSourceKey(li), JSON.stringify(currentTaskArray)); // Оновлюємо локальне сховище поточної категорії
        });

        const span = document.createElement('span');
        span.textContent = task.text;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', () => {
            deleteTask(li, getCurTaskArray(li), getSourceKey(li));
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteButton);
        taskList.appendChild(li);

        updateTaskStyle(li, task.done);

        li.addEventListener('dragstart', () => {
            li.classList.add('dragging');
            sourceArray = getCurTaskArray(li);
            sourceKey = getSourceKey(li);
        });

        li.addEventListener('dragend', () => {
            li.classList.remove('dragging');
            saveOrder(getCurTaskList(li), getSourceKey(li));
        });

        taskList.addEventListener('dragover', (event) => {
            event.preventDefault();
            const draggingTask = document.querySelector('.dragging');
            const afterElement = getDragAfterElement(taskList, event.clientY);
            if (afterElement == null) {
                taskList.appendChild(draggingTask);
            } else {
                taskList.insertBefore(draggingTask, afterElement);
            }
        });

        taskList.addEventListener('drop', () => {
            const draggingTask = document.querySelector('.dragging');
            const newTaskArray = updateTaskArray(draggingTask, getCurTaskArray(draggingTask), getSourceKey(draggingTask));

            localStorage.setItem(getSourceKey(draggingTask), JSON.stringify(newTaskArray));

            deleteTaskFromArray(draggingTask, sourceArray, sourceKey);
        });

    }

    function addTask(inputElement, taskList, storageKey) {
        const taskText = inputElement.value.trim();
        let taskArray = JSON.parse(localStorage.getItem(storageKey)) || [];;
        if (taskText) {
            const task = { id: Date.now(), text: taskText, done: false };
            addTaskToDOM(task, taskList, taskArray, storageKey);
            taskArray.push(task);
            localStorage.setItem(storageKey, JSON.stringify(taskArray));
            inputElement.value = '';
            
        }
    }

    function updateTaskArray(draggingTask, taskArray) {
        const taskId = draggingTask.dataset.id;
        const taskText = draggingTask.querySelector('span').textContent;
        const doneStatus = draggingTask.querySelector('input[type="checkbox"]').checked;
        const newTask = { id: taskId, text: taskText, done: doneStatus };
        const existingIndex = taskArray.findIndex(task => task.id === taskId);
        if (existingIndex === -1) {
            taskArray.push(newTask);
        } else {
            taskArray[existingIndex].done = doneStatus;
        }
        return taskArray;
    }

    function getCurTaskList(listItem) {
        return listItem.closest('ul');
    }

    function getCurTaskArray(listItem) {
        const storageKey = getSourceKey(listItem);
        return JSON.parse(localStorage.getItem(storageKey)) || [];
    }

    function getSourceKey(listItem) {
        return listItem.closest('ul').id;
    }

    function updateTaskStyle(li, isDone) {
        if (isDone) {
            li.querySelector('span').classList.add('completed');
        } else {
            li.querySelector('span').classList.remove('completed');
        }
    }

    function getDragAfterElement(taskList, y) {
        const draggableElements = [...taskList.querySelectorAll('li:not(.dragging)')];
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

    function saveOrder(taskList, storageKey) {
        const updatedTasks = [];
        taskList.querySelectorAll('li').forEach((li) => {
            const text = li.querySelector('span').textContent;
            const done = li.querySelector('input[type="checkbox"]').checked;
            const id = li.dataset.id;
            updatedTasks.push({ id: id, text: text, done: done });
        });
        localStorage.setItem(storageKey, JSON.stringify(updatedTasks));
    }

    function deleteTaskFromArray(li, taskArray, storageKey) {
        const taskId = li.dataset.id;
        const index = taskArray.findIndex(task => task.id == taskId);
        if (index !== -1) {
            taskArray.splice(index, 1);
            localStorage.setItem(storageKey, JSON.stringify(taskArray));
        }
    }

    function deleteTask(li, taskArray, storageKey) {
        
        deleteTaskFromArray(li, taskArray, storageKey);
        li.remove();
    }
});
