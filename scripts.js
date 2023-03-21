const nameInput = document.getElementById('name');
const suggestions = document.getElementById('suggestions');
const names = [
    'Safwan Chowdhury',
    'Seyon Vakeesan',
    'Gerosshanth Satkunam',
    'Nadeem Imani']

    ;

nameInput.addEventListener('input', (e) => {
    const input = e.target.value.trim().toLowerCase();
    suggestions.innerHTML = '';
    if (input.length > 0) {
        const matches = names.filter(name => name.toLowerCase().startsWith(input));
        if (matches.length > 0) {
            suggestions.classList.remove('hidden');
            matches.forEach(match => {
                const li = document.createElement('li');
                li.textContent = match;
                li.addEventListener('click', () => {
                    nameInput.value = match;
                    suggestions.classList.add('hidden');
                });
                suggestions.appendChild(li);
            });
        } else {
            suggestions.classList.add('hidden');
        }
    } else {
        suggestions.classList.add('hidden');
    }
});

