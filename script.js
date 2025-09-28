const petList = document.getElementById("petList");
const petForm = document.getElementById("petForm");
const searchInput = document.getElementById("searchInput");
const API_URL = "http://localhost:3000/pets";

// Fetch and render all pets
function fetchPets() {
  fetch(API_URL)
    .then(res => res.json())
    .then(pets => renderPets(pets));
}

// Render pets to the DOM
function renderPets(pets) {
  petList.innerHTML = ""; // clear before re-render
  pets.forEach(pet => {
    const card = document.createElement("div");
    card.className = "pet-card";
    card.innerHTML = `
      <h3>${pet.name}</h3>
      <img src="${pet.image}" alt="${pet.name}">
      <p>Likes: <span>${pet.likes}</span></p>
      <button class="like-btn">Like</button>
    `;

    // Like button event
    const likeBtn = card.querySelector(".like-btn");
    likeBtn.addEventListener("click", () => {
      pet.likes += 1;
      updateLikes(pet);
    });

    petList.appendChild(card);
  });
}

// Update likes in server
function updateLikes(pet) {
  fetch(`${API_URL}/${pet.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ likes: pet.likes })
  }).then(() => fetchPets());
}

// Add new pet
petForm.addEventListener("submit", e => {
  e.preventDefault();
  const newPet = {
    name: document.getElementById("petName").value,
    image: document.getElementById("petImage").value,
    likes: 0
  };
  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newPet)
  }).then(() => {
    petForm.reset();
    fetchPets();
  });
});

// Search pets
searchInput.addEventListener("input", e => {
  const searchTerm = e.target.value.toLowerCase();
  fetch(API_URL)
    .then(res => res.json())
    .then(pets => {
      const filtered = pets.filter(pet =>
        pet.name.toLowerCase().includes(searchTerm)
      );
      renderPets(filtered);
    });
});

// Initialize
fetchPets();
