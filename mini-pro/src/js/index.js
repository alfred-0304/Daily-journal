document.addEventListener('DOMContentLoaded', function() {
    const calendar = document.getElementById('calendar');
    const currentMonthElement = document.getElementById('currentMonth');
    const prevMonthButton = document.getElementById('prevMonth');
    const nextMonthButton = document.getElementById('nextMonth');
    const modal = document.getElementById('entryModal');
    const modalDate = document.getElementById('modalDate');
    const entryContent = document.getElementById('entryContent');
    const saveEntryButton = document.getElementById('saveEntry');
    const closeModalButton = document.getElementById('closeModal');
    const recentEntriesList = document.getElementById('recentEntriesList');
    const editModal = document.getElementById('editModal');
    const editModalDate = document.getElementById('editModalDate');
    const editEntryContent = document.getElementById('editEntryContent');
    const updateEntryButton = document.getElementById('updateEntry');
    const closeEditModalButton = document.getElementById('closeEditModal');

    let currentDate = new Date();
    let entries = JSON.parse(localStorage.getItem('journalEntries')) || {};
    let currentEditingDate = null;

    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        currentMonthElement.textContent = new Date(year, month, 1).toLocaleString('default', { month: 'long', year: 'numeric' });

        calendar.innerHTML = '';

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();

        for (let i = 0; i < firstDayOfMonth; i++) {
            calendar.appendChild(document.createElement('div'));
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day');
            dayElement.textContent = day;

            if (dateString === new Date().toISOString().split('T')[0]) {
                dayElement.classList.add('today');
            }

            if (entries[dateString]) {
                dayElement.classList.add('has-entry');
            }

            dayElement.addEventListener('click', () => openModal(dateString));
            calendar.appendChild(dayElement);
        }
    }

    function openModal(date) {
        modalDate.textContent = new Date(date).toLocaleDateString();
        entryContent.value = entries[date] || '';
        modal.style.display = 'block';

        saveEntryButton.onclick = function() {
            entries[date] = entryContent.value;
            localStorage.setItem('journalEntries', JSON.stringify(entries));
            modal.style.display = 'none';
            renderCalendar();
            renderRecentEntries();
        };
    }

    function renderRecentEntries() {
        recentEntriesList.innerHTML = '';
        const sortedEntries = Object.entries(entries).sort((a, b) => new Date(b[0]) - new Date(a[0]));
        sortedEntries.slice(0, 5).forEach(([date, content]) => {
            const entryElement = document.createElement('div');
            entryElement.classList.add('entry');
            entryElement.innerHTML = `
                <div class="entry-content">
                    <strong>${new Date(date).toLocaleDateString()}</strong>
                    <p>${content.substring(0, 100)}${content.length > 100 ? '...' : ''}</p>
                </div>
                <div class="entry-actions">
                    <button class="edit" data-date="${date}">Edit</button>
                    <button class="delete" data-date="${date}">Delete</button>
                </div>
            `;
            recentEntriesList.appendChild(entryElement);
        });

        // Add event listeners for edit and delete buttons
        document.querySelectorAll('.edit').forEach(button => {
            button.addEventListener('click', (e) => openEditModal(e.target.dataset.date));
        });

        document.querySelectorAll('.delete').forEach(button => {
            button.addEventListener('click', (e) => deleteEntry(e.target.dataset.date));
        });
    }

    function openEditModal(date) {
        currentEditingDate = date;
        editModalDate.textContent = new Date(date).toLocaleDateString();
        editEntryContent.value = entries[date] || '';
        editModal.style.display = 'block';
    }

    function deleteEntry(date) {
        if (confirm('Are you sure you want to delete this entry?')) {
            delete entries[date];
            localStorage.setItem('journalEntries', JSON.stringify(entries));
            renderCalendar();
            renderRecentEntries();
        }
    }

    prevMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    closeModalButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    closeEditModalButton.addEventListener('click', () => {
        editModal.style.display = 'none';
    });

    updateEntryButton.addEventListener('click', () => {
        if (currentEditingDate) {
            entries[currentEditingDate] = editEntryContent.value;
            localStorage.setItem('journalEntries', JSON.stringify(entries));
            editModal.style.display = 'none';
            renderCalendar();
            renderRecentEntries();
        }
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
        if (event.target === editModal) {
            editModal.style.display = 'none';
        }
    });

    renderCalendar();
    renderRecentEntries();
});