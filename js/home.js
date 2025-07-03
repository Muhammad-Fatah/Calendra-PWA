document.addEventListener('DOMContentLoaded', () => {
    const scheduleList = document.getElementById('schedule-summary-list');
    const todoList = document.getElementById('todo-summary-list');
    const calendarGrid = document.getElementById('calendar-grid');
    const currentMonthYearEl = document.getElementById('currentMonthYear');
    let db;

    function renderCalendar() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        currentMonthYearEl.textContent = `${monthNames[month]}, ${year}`;
        calendarGrid.innerHTML = '';
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        for (let i = 0; i < firstDayOfMonth; i++) calendarGrid.innerHTML += `<div></div>`;
        for (let i = 1; i <= daysInMonth; i++) {
            let classes = 'calendar-day';
            if (i === now.getDate()) classes += ' current-day';
            calendarGrid.innerHTML += `<div class="${classes}">${i}</div>`;
        }
    }

    function initDB() {
        const request = indexedDB.open('CalendraDB_v3', 1);
        request.onupgradeneeded = e => {
            db = e.target.result;
            if (!db.objectStoreNames.contains('schedules')) db.createObjectStore('schedules', { keyPath: 'id', autoIncrement: true });
            if (!db.objectStoreNames.contains('tasks')) db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });
        };
        request.onsuccess = e => { db = e.target.result; renderAll(); };
        request.onerror = e => console.error("DB error:", e.target.errorCode);
    }

    function renderAll() {
        renderCalendar();
        renderSchedulesSummary();
        renderTasksSummary();
    }

    function renderSchedulesSummary() {
        const tx = db.transaction('schedules', 'readonly');
        tx.objectStore('schedules').getAll().onsuccess = e => {
            const items = e.target.result;
            scheduleList.innerHTML = items.length ? '' : `<p class="text-secondary small text-center">Belum ada jadwal.</p>`;
            items.slice(0, 3).forEach(item => {
                const el = document.createElement('a');
                el.href = 'schedule.html';
                el.className = 'p-3 bg-light rounded-2 border d-flex justify-content-between align-items-center text-decoration-none text-dark';
                el.innerHTML = `<div><p class="fw-medium text-primary-emphasis mb-0">${item.title}</p><p class="small text-secondary mb-0">${item.day}, ${item.time}</p></div><i class="bi bi-chevron-right text-secondary"></i>`;
                scheduleList.appendChild(el);
            });
        };
    }

    function renderTasksSummary() {
        const tx = db.transaction('tasks', 'readonly');
        tx.objectStore('tasks').getAll().onsuccess = e => {
            const items = e.target.result.filter(item => !item.done);
            todoList.innerHTML = items.length ? '' : `<p class="text-secondary text-center">Hore, tidak ada tugas!</p>`;
            items.sort((a,b) => new Date(a.deadline) - new Date(b.deadline)).slice(0, 3).forEach(item => {
                const el = document.createElement('a');
                el.href = 'tasks.html';
                el.className = 'p-3 bg-light rounded-2 border text-decoration-none text-dark';
                el.innerHTML = `<div class="d-flex justify-content-between align-items-center"><div><p class="fw-medium mb-0">${item.title}</p><p class="small text-secondary mb-0">Deadline: ${new Date(item.deadline).toLocaleString('id-ID', {dateStyle:'medium', timeStyle:'short'})}</p></div><i class="bi bi-chevron-right text-secondary"></i></div>`;
                todoList.appendChild(el);
            });
        };
    }

    initDB();
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js') // Path '/sw.js' sudah benar
            .then(reg => console.log('Service Worker: Terdaftar', reg))
            .catch(err => console.error('Service Worker: Gagal', err));
    });
}