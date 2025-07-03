document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const modalElement = document.getElementById('taskModal');
    const modalForm = document.getElementById('task-form');
    const modalTitle = document.getElementById('modalTitle');
    const taskIdInput = document.getElementById('task-id');
    const taskModal = new bootstrap.Modal(modalElement);
    let db;

    function initDB() {
        const request = indexedDB.open('CalendraDB_v3', 1);
        request.onsuccess = e => { db = e.target.result; renderTasks(); };
        request.onerror = e => console.error("DB error:", e.target.errorCode);
    }

    function renderTasks() {
        const tx = db.transaction('tasks', 'readonly');
        tx.objectStore('tasks').getAll().onsuccess = e => {
            const items = e.target.result;
            taskList.innerHTML = items.length ? '' : `<p class="text-secondary text-center py-5">Hore, tidak ada tugas! Klik "Tambah Tugas" untuk membuat baru.</p>`;
            items.sort((a,b) => new Date(a.deadline) - new Date(b.deadline)).forEach(item => {
                const el = document.createElement('div');
                el.className = 'card bg-light';
                const isDone = item.done ? 'text-decoration-line-through text-secondary' : '';
                el.innerHTML = `
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <div class="form-check">
                            <input class="form-check-input todo-check" type="checkbox" data-id="${item.id}" id="task-${item.id}" ${item.done ? 'checked' : ''}>
                            <label class="form-check-label ${isDone}" for="task-${item.id}">
                                <span class="fw-bold">${item.title}</span>
                                <br>
                                <small class="text-secondary">Deadline: ${new Date(item.deadline).toLocaleString('id-ID', {dateStyle:'full', timeStyle:'short'})}</small>
                            </label>
                        </div>
                        <div>
                            <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${item.id}"><i class="bi bi-pencil"></i></button>
                            <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${item.id}"><i class="bi bi-trash3"></i></button>
                        </div>
                    </div>`;
                taskList.appendChild(el);
            });
        };
    }
    
    function openModalForEdit(id) {
        const tx = db.transaction('tasks', 'readonly');
        tx.objectStore('tasks').get(id).onsuccess = e => {
            const item = e.target.result;
            modalTitle.textContent = 'Edit Tugas';
            taskIdInput.value = item.id;
            document.getElementById('task-title').value = item.title;
            document.getElementById('task-deadline').value = item.deadline;
            taskModal.show();
        };
    }

    modalElement.addEventListener('hidden.bs.modal', () => {
        modalForm.reset();
        taskIdInput.value = '';
        modalTitle.textContent = 'Tambah Tugas Baru';
    });

    modalForm.addEventListener('submit', e => {
        e.preventDefault();
        const id = Number(taskIdInput.value);
        const newItem = {
            title: document.getElementById('task-title').value,
            deadline: document.getElementById('task-deadline').value,
            done: false
        };
        const tx = db.transaction('tasks', 'readwrite');
        const store = tx.objectStore('tasks');
        if (id) {
            newItem.id = id;
            store.get(id).onsuccess = e => {
                newItem.done = e.target.result.done;
                store.put(newItem);
            }
        } else {
            store.add(newItem);
        }
        tx.oncomplete = renderTasks;
        taskModal.hide();
    });

    taskList.addEventListener('click', e => {
        const editBtn = e.target.closest('.edit-btn');
        const deleteBtn = e.target.closest('.delete-btn');
        const check = e.target.closest('.todo-check');

        if (editBtn) {
            const id = Number(editBtn.dataset.id);
            openModalForEdit(id);
        }
        if (deleteBtn) {
            const id = Number(deleteBtn.dataset.id);
            if (confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
                const tx = db.transaction('tasks', 'readwrite');
                tx.objectStore('tasks').delete(id);
                tx.oncomplete = renderTasks;
            }
        }
        if (check) {
            const id = Number(check.dataset.id);
            const isChecked = check.checked;
            const tx = db.transaction('tasks', 'readwrite');
            const store = tx.objectStore('tasks');
            store.get(id).onsuccess = e => {
                const task = e.target.result;
                task.done = isChecked;
                store.put(task);
            };
            tx.oncomplete = renderTasks;
        }
    });

    initDB();
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js') // Path '/sw.js' sudah benar
            .then(reg => console.log('Service Worker: Terdaftar', reg))
            .catch(err => console.error('Service Worker: Gagal', err));
    });
}