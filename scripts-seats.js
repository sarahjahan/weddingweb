const nameInput = document.getElementById('name');
const suggestions = document.getElementById('suggestions');
const tableNumberInput = document.getElementById('table-number');
let names = [];
let tableNumbers = {};

function capitalizeWords(str) {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

fetch('https://docs.google.com/spreadsheets/d/e/YOUR_NEW_SPREADSHEET_ID/pub?gid=YOUR_GID&single=true&output=csv')
  .then(response => response.text())
  .then(text => {
    text.split('\n').forEach(line => {
      const [name, , , tableNumber] = line.split(',').map(value => value.trim());
      names.push(name);
      tableNumbers[name.toLowerCase()] = tableNumber;
    });
  })
  .catch(error => {
    console.error('Error fetching names and table numbers:', error);
  });

nameInput.addEventListener('input', (e) => {
  const input = e.target.value.trim().toLowerCase();
  suggestions.innerHTML = '';
  if (input.length > 0) {
    const matches = names.filter(name => name.toLowerCase().includes(input));
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



