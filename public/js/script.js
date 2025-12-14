const taskForm = document.getElementById('task-form');
        const taskInput = document.getElementById('task-input');
        const taskList = document.getElementById('tasks');
        const taskCount = document.getElementById('task-stats');
        const tasksContainer = document.getElementById('tasks-container');

        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

        function saveTasks() {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }

        function updateTaskCount() {
            const total = tasks.length;
            const completed = tasks.filter(t => t.done).length;
            if (total === 0) {
                taskCount.textContent = 'No tasks yet';
            } else {
                taskCount.textContent = `${completed} of ${total} completed`;
            }
        }

        function renderTasks() {
            taskList.innerHTML = '';
            
            if (tasks.length === 0) {
                tasksContainer.innerHTML = `
                    <div class="empty-state">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                        <p>No tasks yet. Add one to get started!</p>
                    </div>
                `;
                return;
            }

            tasksContainer.innerHTML = '<ul id="tasks"></ul>';
            const newTaskList = document.getElementById('tasks');

            tasks.forEach((task, index) => {
                const li = document.createElement('li');
                li.className = `task ${task.done ? 'done' : ''}`;
                li.innerHTML = `
                    <input type="checkbox" class="checkbox" ${task.done ? 'checked' : ''}>
                    <span class="task-text">${escapeHtml(task.text)}</span>
                    <button type="button" class="delete-btn">Delete</button>
                `;

                const checkbox = li.querySelector('.checkbox');
                const deleteBtn = li.querySelector('.delete-btn');

                checkbox.addEventListener('change', () => {
                    tasks[index].done = checkbox.checked;
                    saveTasks();
                    renderTasks();
                });

                deleteBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    tasks.splice(index, 1);
                    saveTasks();
                    renderTasks();
                });

                newTaskList.appendChild(li);
            });

            updateTaskCount();
        }

        function escapeHtml(text) {
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return text.replace(/[&<>"']/g, m => map[m]);
        }

        taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = taskInput.value.trim();

            if (text === '') {
                taskInput.focus();
                return;
            }

            tasks.push({ text, done: false });
            saveTasks();
            renderTasks();
            taskInput.value = '';
            taskInput.focus();
        });

        renderTasks();