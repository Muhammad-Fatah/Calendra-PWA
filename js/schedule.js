document.addEventListener('DOMContentLoaded', () => {
    const scheduleList = document.getElementById('schedule-list');
    const modalElement = document.getElementById('scheduleModal');
    const modalForm = document.getElementById('schedule-form');
    const modalTitle = document.getElementById('modalTitle');
    const scheduleIdInput = document.getElementById('schedule-id');
    const scheduleModal = new bootstrap.Modal(modalElement);
    let db;

    function initDB() {
        const request = indexedDB.open('CalendraDB_v3', 1);
        request.onsuccess = e => { db = e.target.result; renderSchedules(); };
        request.onerror = e => console.error("DB error:", e.target.errorCode);
    }

    function renderSchedules() {
        const tx = db.transaction('schedules', 'readonly');
        tx.objectStore('schedules').getAll().onsuccess = e => {
            const items = e.target.result;
            scheduleList.innerHTML = items.length ? '' : `<p class="text-secondary text-center py-5">Belum ada jadwal. Klik "Tambah Jadwal" untuk memulai.</p>`;
            items.forEach(item => {
                const el = document.createElement('div');
                el.className = 'card bg-light';
                el.innerHTML = `
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <div>
                            <h5 class="card-title fw-bold">${item.title}</h5>
                            <p class="card-text text-secondary mb-0">${item.day}, ${item.time}</p>
                        </div>
                        <div>
                            <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${item.id}"><i class="bi bi-pencil"></i></button>
                            <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${item.id}"><i class="bi bi-trash3"></i></button>
                        </div>
                    </div>`;
                scheduleList.appendChild(el);
            });
        };
    }

    function openModalForEdit(id) {
        const tx = db.transaction('schedules', 'readonly');
        tx.objectStore('schedules').get(id).onsuccess = e => {
            const item = e.target.result;
            modalTitle.textContent = 'Edit Jadwal';
            scheduleIdInput.value = item.id;
            document.getElementById('schedule-title').value = item.title;
            document.getElementById('schedule-day').value = item.day;
            document.getElementById('schedule-time').value = item.time;
            scheduleModal.show();
        };
    }

    modalElement.addEventListener('hidden.bs.modal', () => {
        modalForm.reset();
        scheduleIdInput.value = '';
        modalTitle.textContent = 'Tambah Jadwal Baru';
    });

    modalForm.addEventListener('submit', e => {
        e.preventDefault();
        const id = Number(scheduleIdInput.value);
        const newItem = {
            title: document.getElementById('schedule-title').value,
            day: document.getElementById('schedule-day').value,
            time: document.getElementById('schedule-time').value,
        };
        const tx = db.transaction('schedules', 'readwrite');
        const store = tx.objectStore('schedules');
        if (id) {
            newItem.id = id;
            store.put(newItem);
        } else {
            store.add(newItem);
        }
        tx.oncomplete = renderSchedules;
        scheduleModal.hide();
    });

    scheduleList.addEventListener('click', e => {
        const editBtn = e.target.closest('.edit-btn');
        const deleteBtn = e.target.closest('.delete-btn');
        if (editBtn) {
            const id = Number(editBtn.dataset.id);
            openModalForEdit(id);
        }
        if (deleteBtn) {
            const id = Number(deleteBtn.dataset.id);
            if (confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
                const tx = db.transaction('schedules', 'readwrite');
                tx.objectStore('schedules').delete(id);
                tx.oncomplete = renderSchedules;
            }
        }
    });

    initDB();
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker: Terdaftar', reg))
            .catch(err => console.error('Service Worker: Gagal', err));
    });
}