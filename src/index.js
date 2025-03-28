// Your code here
fetch('http://localhost:3000/characters')
  .then(response => response.json())
  .then(data => {
    const characterBar = document.getElementById('character-bar');
    data.forEach(character => {
      const span = document.createElement('span');
      span.textContent = character.name;
      span.addEventListener('click', () => displayCharacterDetails(character));
      characterBar.appendChild(span);
    });
  });

function displayCharacterDetails(character) {
  const nameElement = document.getElementById('name');
  const imageElement = document.getElementById('image');
  const voteCountElement = document.getElementById('vote-count');
  const voteInputElement = document.getElementById('votes');

  nameElement.textContent = character.name;
  imageElement.src = character.image;
  voteCountElement.textContent = character.votes;

  voteInputElement.value = '';

  const votesForm = document.getElementById('votes-form');
  votesForm.onsubmit = function (e) {
    e.preventDefault();
    const newVotes = parseInt(voteInputElement.value);
    if (!isNaN(newVotes) && newVotes > 0) {
      updateVotes(character, newVotes);
    }
  };

  const resetBtn = document.getElementById('reset-btn');
  resetBtn.onclick = function () {
    resetVotes(character);
  };
}

function updateVotes(character, newVotes) {
  character.votes += newVotes;
  const voteCountElement = document.getElementById('vote-count');
  voteCountElement.textContent = character.votes;

  fetch(`http://localhost:3000/characters/${character.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ votes: character.votes }),
  });
}

function resetVotes(character) {
  character.votes = 0;
  const voteCountElement = document.getElementById('vote-count');
  voteCountElement.textContent = character.votes;

  fetch(`http://localhost:3000/characters/${character.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ votes: 0 }),
  });
}

document.getElementById('character-form')?.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const image = document.getElementById('image-url').value;

  const newCharacter = {
    name: name,
    image: image,
    votes: 0
  };

  const characterBar = document.getElementById('character-bar');
  const span = document.createElement('span');
  span.textContent = newCharacter.name;
  span.addEventListener('click', () => displayCharacterDetails(newCharacter));
  characterBar.appendChild(span);

  fetch('http://localhost:3000/characters', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newCharacter),
  });

  displayCharacterDetails(newCharacter);
});
