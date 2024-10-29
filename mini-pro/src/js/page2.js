document.addEventListener('DOMContentLoaded', function() {
    const reflectionForm = document.getElementById('reflectionForm');
    const reflectionsList = document.getElementById('reflectionsList');
    let reflections = JSON.parse(localStorage.getItem('journalReflections')) || {};

    reflectionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const month = document.getElementById('reflectionMonth').value;
        const content = document.getElementById('reflectionContent').value;
        reflections[month] = content;
        localStorage.setItem('journalReflections', JSON.stringify(reflections));
        renderReflections();
        reflectionForm.reset();
    });

    function renderReflections() {
        reflectionsList.innerHTML = '';
        Object.entries(reflections).sort((a, b) => b[0].localeCompare(a[0])).forEach(([month, content]) => {
            const reflectionElement = document.createElement('div');
            reflectionElement.classList.add('card');
            reflectionElement.innerHTML = `
                <h3>${new Date(month).toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                <p>${content}</p>
                <button class="button button-outline" onclick="deleteReflection('${month}')">Delete</button>
            `;
            reflectionsList.appendChild(reflectionElement);
        });
    }

    window.deleteReflection = function(month) {
        if (confirm('Are you sure you want to delete this reflection?')) {
            delete reflections[month];
            localStorage.setItem('journalReflections', JSON.stringify(reflections));
            renderReflections();
        }
    };

    renderReflections();
});