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
            })
            .catch(err => console.error("Error fetching characters:", err));
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
        imageDisplay.alt = character.name || "Character Image";
        voteCount.textContent = character.votes;
    }

    votesForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!currentCharacter) return;

        const votesToAdd = parseInt(event.target.votes.value) || 0;
        const updatedVotes = currentCharacter.votes + votesToAdd;

        fetch(`${baseURL}/${currentCharacter.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ votes: updatedVotes })
        })
        .then(res => res.json())
        .then(updatedCharacter => {

            displayCharacter(updatedCharacter);
        })
        .catch(err => console.error("Error updating votes:", err));

        event.target.reset();
    });

    resetBtn.addEventListener("click", () => {
        if (!currentCharacter) return;

        fetch(`${baseURL}/${currentCharacter.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ votes: 0 })
        })
        .then(res => res.json())
        .then(updatedCharacter => {

            displayCharacter(updatedCharacter);
        })
        .catch(err => console.error("Error resetting votes:", err));
    });

    if (newCharacterForm) {
        newCharacterForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const newName = event.target.name.value.trim();
            const newImage = event.target["image-url"].value.trim();

            if (!newName || !newImage) {
                alert("Please provide both a name and an image URL.");
                return;
            }

            const newCharacter = { name: newName, image: newImage, votes: 0 };

            fetch(baseURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCharacter)
            })
            .then(res => res.json())
            .then(character => {
                addCharacterToBar(character);
                displayCharacter(character);
            })
            .catch(err => console.error("Error adding new character:", err));

            event.target.reset();
        });
    }

    fetchCharacters();
});
