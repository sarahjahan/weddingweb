const nameInput = document.getElementById('name');
const suggestions = document.getElementById('suggestions');
let guests = [];
let tableNumbers = {};
let submittedNames = [];

function capitalizeWords(str) {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// fetch guest names and table numbers from the new Google Spreadsheet
fetch('https://docs.google.com/spreadsheets/d/14jNNJbCssPZIagM_fFNyBBGE35sri5opT2BxjMSCe9c/edit#gid=0')
  .then(response => response.text())
  .then(text => {
    text.split('\n').forEach(line => {
      const [name, tableNumber] = line.split(',').map(value => value.trim());
      guests.push(name);
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
    const matches = guests.filter(name => name.toLowerCase().includes(input));
    if (matches.length > 0) {
      suggestions.classList.add('visible');
      matches.forEach(match => {
        const li = document.createElement('li');
        li.textContent = `${match} (Table Number: ${tableNumbers[match.toLowerCase()]})`;
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

