// Your code here
document.addEventListener("DOMContentLoaded", () => {
    const baseURL = "http://localhost:3000/characters";
    const characterBar = document.getElementById("character-bar");
    const nameDisplay = document.getElementById("name");
    const imageDisplay = document.getElementById("image");
    const voteCount = document.getElementById("vote-count");
    const votesForm = document.getElementById("votes-form");
    const resetBtn = document.getElementById("reset-btn");
    const newCharacterForm = document.getElementById("character-form");
    let currentCharacter = null;

    function fetchCharacters() {
        fetch(baseURL)
            .then(res => res.json())
            .then(characters => {
                characterBar.innerHTML = "";
                characters.forEach(addCharacterToBar);
            });
    }

    function addCharacterToBar(character) {
        const span = document.createElement("span");
        span.textContent = character.name;
        span.addEventListener("click", () => displayCharacter(character));
        characterBar.appendChild(span);
    }

    function displayCharacter(character) {
        currentCharacter = character;
        nameDisplay.textContent = character.name;
        imageDisplay.src = character.image;
        voteCount.textContent = character.votes;
    }

    votesForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!currentCharacter) return;

        const votesToAdd = parseInt(event.target.votes.value) || 0;
        currentCharacter.votes += votesToAdd;
        voteCount.textContent = currentCharacter.votes;

        fetch(`${baseURL}/${currentCharacter.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ votes: currentCharacter.votes })
        });

        event.target.reset();
    });

    resetBtn.addEventListener("click", () => {
        if (!currentCharacter) return;
        currentCharacter.votes = 0;
        voteCount.textContent = 0;

        fetch(`${baseURL}/${currentCharacter.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ votes: 0 })
        });
    });

    if (newCharacterForm) {
        newCharacterForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const newName = event.target.name.value;
            const newImage = event.target["image-url"].value;
            
            const newCharacter = {
                name: newName,
                image: newImage,
                votes: 0
            };
            
            fetch(baseURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCharacter)
            })
            .then(res => res.json())
            .then(character => {
                addCharacterToBar(character);
                displayCharacter(character);
            });

            event.target.reset();
        });
    }

    fetchCharacters();
});
