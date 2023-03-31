const nameInput = document.getElementById('name');
const suggestions = document.getElementById('suggestions');
let names = [];
let maxQuantities = {};

// Fetch names and max quantities from the text file
fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vQxIo5cPZffEUpclFdDS_Whdr47iQKanqBg_tgFAHrgMerLgfyc_kqTvkT96zNl0Q497PAL1t00Tjsz/pub?gid=1685786161&single=true&output=csv')
  .then(response => response.text())
  .then(text => {
    text.split('\n').forEach(line => {
      const [name, maxQuantity] = line.split(',').map(value => value.trim());
      names.push(name);
      maxQuantities[name.toLowerCase()] = parseInt(maxQuantity, 10);
    });
  })
  .catch(error => {
    console.error('Error fetching names and quantities:', error);
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
                    const quantityInput = document.querySelector('input[name="quantity"]');
                    quantityInput.setAttribute('data-max', maxQuantities[match.toLowerCase()] || 1);
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