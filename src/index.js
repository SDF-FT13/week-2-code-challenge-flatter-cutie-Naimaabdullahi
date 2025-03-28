// Your code here
document.addEventListener("DOMContentLoaded", () => {
    const baseURL = "http://localhost:3000/characters";
    const characterBar = document.getElementById("character-bar");
    const nameDisplay = document.getElementById("name");
    const imageDisplay = document.getElementById("image");
    const voteCount = document.getElementById("vote-count");
    const votesForm = document.getElementById("votes-form");
    const votesInput = document.getElementById("votes");
    const resetBtn = document.getElementById("reset-btn");
    const characterForm = document.getElementById("character-form");
  
    let currentCharacter = null; 
  
    function fetchCharacters() {
      fetch(baseURL)
        .then(response => response.json())
        .then(characters => {
          characters.forEach(displayCharacterInBar);
        })
        .catch(error => console.error("Error fetching characters:", error));
    }
  
    function displayCharacterInBar(character) {
      const span = document.createElement("span");
      span.textContent = character.name;
      span.style.cursor = "pointer";
      span.addEventListener("click", () => displayCharacterDetails(character));
      characterBar.appendChild(span);
    }
  
    function displayCharacterDetails(character) {
      currentCharacter = character;
      nameDisplay.textContent = character.name;
      imageDisplay.src = character.image;
      voteCount.textContent = character.votes;
    }
  
    votesForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (currentCharacter) {
        let newVotes = parseInt(votesInput.value) || 0;
        currentCharacter.votes += newVotes;
        voteCount.textContent = currentCharacter.votes;
  
        updateCharacterVotes(currentCharacter);
        
        votesInput.value = ""; 
      }
    });
  
    resetBtn.addEventListener("click", () => {
      if (currentCharacter) {
        currentCharacter.votes = 0;
        voteCount.textContent = 0;
  
        updateCharacterVotes(currentCharacter);
      }
    });
  
    function updateCharacterVotes(character) {
      fetch(`${baseURL}/${character.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ votes: character.votes })
      })
      .then(response => response.json())
      .then(updatedCharacter => console.log("Votes updated:", updatedCharacter))
      .catch(error => console.error("Error updating votes:", error));
    }
  
    if (characterForm) {
      characterForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const newCharacter = {
          name: event.target.name.value,
          image: event.target["image-url"].value,
          votes: 0
        };
  
        fetch(baseURL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCharacter)
        })
        .then(response => response.json())
        .then(savedCharacter => {
          displayCharacterInBar(savedCharacter);
          displayCharacterDetails(savedCharacter);
          event.target.reset();
        })
        .catch(error => console.error("Error adding character:", error));
      });
    }
  
    fetchCharacters();
  });
  