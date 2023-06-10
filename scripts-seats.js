const nameInput = document.getElementById('name');
const suggestions = document.getElementById('suggestions');
let names = [];
let maxQuantities = {};
let submittedNames = [];

function capitalizeWords(str) {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

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

fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vQxIo5cPZffEUpclFdDS_Whdr47iQKanqBg_tgFAHrgMerLgfyc_kqTvkT96zNl0Q497PAL1t00Tjsz/pub?gid=0&single=true&output=csv')
  .then(response => response.text())
  .then(text => {
    text.split('\n').forEach(line => {
      const [name] = line.split(',').map(value => value.trim());
      submittedNames.push(name.toLowerCase());
    });
  })
  .catch(error => {
    console.error('Error fetching submitted names:', error);
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

window.addEventListener("load", function () {
  const form = document.getElementById('my-form');
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const data = new FormData(form);
    const action = e.target.action;
    const name = form.name.value.trim().toLowerCase();
    const capitalizedName = capitalizeWords(name);
    const numberOfGuests = form.quantity.value;

    if (submittedNames.includes(name)) {
      if (numberOfGuests == 1) {
        alert(`Looks like we’ve already received a submission for your group for ${numberOfGuests} guest. If there’s a mistake, please call or text one of us.`);
      } else {
        alert(`Looks like we’ve already received a submission for your group for ${numberOfGuests} guests. If there’s a mistake, please call or text one of us.`);
      }
    } else {
      if (name === "" || numberOfGuests === "") {
        alert("Please fill out both name and number of guests.");
      } else {
        fetch(action, {
          method: 'POST',
          body: data,
        })
        .then(() => {
          if (numberOfGuests == 1) {
            alert(`Thank you ${capitalizedName} for RSVPing ${numberOfGuests} guest. See you soon!`);
          } else {
            alert(`Thank you ${capitalizedName} for RSVPing ${numberOfGuests} guests. See you soon!`);
          }
          const submitButton = document.querySelector('.rsvpformbutton');
          if (submitButton) {
            submitButton.disabled = true;
            submitButton.classList.remove('rsvpformbutton');
            submitButton.classList.add('rsvpformclicked');
          }
        });
      }
    }
  });
});

