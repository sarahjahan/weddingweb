const nameInput = document.getElementById('name');
const suggestions = document.getElementById('suggestions');
const tableNumberValue = document.getElementById('table-number-value');
let namesAndTables = {};

function capitalizeWords(str) {
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTcqgeG8RB_X6aGehomJnhDLDW3_93fCKZlfskIBd8_JrcCjzuIwuWsRTqpQrhdCnb4kH0lMGR6cE6u/pubhtml')
  .then(response => response.text())
  .then(text => {
    text.split('\n').forEach(line => {
      const [name, tableNumber] = line.split(',').map(value => value.trim());
      namesAndTables[name.toLowerCase()] = tableNumber;
    });
  })
  .catch(error => {
    console.error('Error fetching names and table numbers:', error);
  });

nameInput.addEventListener('input', (e) => {
  const input = e.target.value.trim().toLowerCase();
  suggestions.innerHTML = '';
  if (input.length > 0) {
    const matches = Object.keys(namesAndTables).filter(name => name.includes(input));
    if (matches.length > 0) {
      suggestions.classList.add('visible');
      matches.forEach(match => {
        const li = document.createElement('li');
        li.textContent = match;
        li.addEventListener('click', () => {
          nameInput.value = match;
          tableNumberValue.textContent = namesAndTables[match] || 'No table assigned';
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
