document.addEventListener('DOMContentLoaded', function() {
    const entryForm = document.getElementById('entryForm');
    const entriesList = document.getElementById('entriesList');
    let entries = JSON.parse(localStorage.getItem('journalEntries')) || {};

    entryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const date = document.getElementById('entryDate').value;
        const content = document.getElementById('entryContent').value;
        entries[date] = content;
        localStorage.setItem('journalEntries', JSON.stringify(entries));
        renderEntries();
        entryForm.reset();
    });

    function renderEntries() {
        entriesList.innerHTML = '';
        Object.entries(entries).sort((a, b) => new Date(b[0]) - new Date(a[0])).forEach(([date, content]) => {
            const entryElement = document.createElement('div');
            entryElement.classList.add('card');
            entryElement.innerHTML = `
                <h3>${new Date(date).toLocaleDateString()}</h3>
                <p>${content}</p>
                <button class="button button-outline" onclick="deleteEntry('${date}')">Delete</button>
            `;
            entriesList.appendChild(entryElement);
        });
    }

    window.deleteEntry = function(date) {
        if (confirm('Are you sure you want to delete this entry?')) {
            delete entries[date];
            localStorage.setItem('journalEntries', JSON.stringify(entries));
            renderEntries();
        }
    };

    renderEntries();
});