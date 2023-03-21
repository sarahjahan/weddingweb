const nameInput = document.getElementById('name');
const suggestions = document.getElementById('suggestions');
let names = [];

// Fetch names from the text file
fetch('names.txt')
  .then(response => response.text())
  .then(text => {
    names = text.split('\n').map(name => name.trim());
  })
  .catch(error => {
    console.error('Error fetching names:', error);
  });


nameInput.addEventListener('input', (e) => {
    const input = e.target.value.trim().toLowerCase();
    suggestions.innerHTML = '';
    if (input.length > 0) {
        const matches = names.filter(name => name.toLowerCase().startsWith(input));
        if (matches.length > 0) {
            suggestions.classList.add('visible');
            matches.forEach(match => {
                const li = document.createElement('li');
                li.textContent = match;
                li.addEventListener('click', () => {
                    nameInput.value = match;
                    suggestions.classList.remove('visible');
                });
                suggestions.appendChild(li);
            });
        } else {
            suggestions.classList.remove('visible');
        }
    } else {
        suggestions.classList.remove('visible');
    }
});

