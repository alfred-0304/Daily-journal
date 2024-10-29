document.addEventListener('DOMContentLoaded', function() {
    const goalForm = document.getElementById('goalForm');
    const goalsList = document.getElementById('goalsList');
    let goals = JSON.parse(localStorage.getItem('journalGoals')) || [];

    goalForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('goalTitle').value;
        const description = document.getElementById('goalDescription').value;
        const dueDate = document.getElementById('goalDueDate').value;
        const newGoal = { title, description, dueDate, completed: false };
        goals.push(newGoal);
        localStorage.setItem('journalGoals', JSON.stringify(goals));
        renderGoals();
        goalForm.reset();
    });

    function renderGoals() {
        goalsList.innerHTML = '';
        goals.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).forEach((goal, index) => {
            const goalElement = document.createElement('div');
            goalElement.classList.add('card');
            goalElement.innerHTML = `
                <h3>${goal.title}</h3>
                <p>${goal.description}</p>
                <p>Due: ${new Date(goal.dueDate).toLocaleDateString()}</p>
                <label>
                    <input type="checkbox" ${goal.completed ? 'checked' : ''} onchange="toggleGoal(${index})">
                    Completed
                </label>
                <button class="button button-outline" onclick="deleteGoal(${index})">Delete</button>
            `;
            goalsList.appendChild(goalElement);
        });
    }

    window.toggleGoal = function(index) {
        goals[index].completed = !goals[index].completed;
        localStorage.setItem('journalGoals', JSON.stringify(goals));
        renderGoals();
    };

    window.deleteGoal = function(index) {
        if (confirm('Are you sure you want to delete this goal?')) {
            goals.splice(index, 1);
            localStorage.setItem('journalGoals', JSON.stringify(goals));
            renderGoals();
        }
    };

    renderGoals();
});