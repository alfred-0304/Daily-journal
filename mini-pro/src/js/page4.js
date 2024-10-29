document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const searchResults = document.getElementById('searchResults');
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || {};
    const reflections = JSON.parse(localStorage.getItem('journalReflections')) || {};
    const goals = JSON.parse(localStorage.getItem('journalGoals')) || [];

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    function performSearch() {
        const query = searchInput.value.toLowerCase();
        searchResults.innerHTML = '';

        // Search entries
        Object.entries(entries).forEach(([date, content]) => {
            if (content.toLowerCase().includes(query)) {
                addSearchResult('Entry', 
                    new Date(date).toLocaleDateString(),
                    content.substring(0, 100) + '...');
            }
        });

        // Search reflections
        Object.entries(reflections).forEach(([month, content]) => {
            if (content.toLowerCase().includes(query)) {
                addSearchResult('Reflection',
                    new Date(month).toLocaleString('default', { month: 'long', year: 'numeric' }),
                    content.substring(0, 100) + '...');
            }
        });

        // Search goals
        goals.forEach(goal => {
            if (goal.title.toLowerCase().includes(query) || goal.description.toLowerCase().includes(query)) {
                addSearchResult('Goal',
                    goal.title,
                    goal.description.substring(0, 100) + '...');
            }
        });

        if (searchResults.innerHTML === '') {
            searchResults.innerHTML = '<p>No results found.</p>';
        }
    }

    function addSearchResult(type, title, snippet) {
        const resultElement = document.createElement('div');
        resultElement.classList.add('card');
        resultElement.innerHTML = `
            <h3>${type}: ${title}</h3>
            <p>${snippet}</p>
        `;
        searchResults.appendChild(resultElement);
    }
});