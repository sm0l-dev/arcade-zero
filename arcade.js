// Function to create a console card with click handler for modal
function createConsoleCard(gameConsole, index) {
  const card = document.createElement("div");
  card.className =
    "bg-[#EEEEEE] dark:bg-[#1f2937] rounded-lg sm:rounded-2xl overflow-hidden shadow-lg border-2 border-[#BF3131] dark:border-[#f87171] transition-transform hover:scale-105 cursor-pointer";
  card.setAttribute("data-index", index);

  card.innerHTML = `
          <div class="aspect-[4/3] dark:bg-[#b91c1c] bg-[#7D0A0A] bg-opacity-10 p-2">
            <div class="bg-[#BF3131] dark:bg-transparent py-2 px-4 border-b-4 border-[#7D0A0A]">
                    <h3 class="font-['Press_Start_2P'] text-[#EAD196] dark:text-[#7d0a0a] text-center text-lg">${gameConsole.name}</h3>
                  </div>
            <img
              src="${gameConsole.imageUrl}"
              alt="${gameConsole.name}"
              class="w-full h-full object-contain"
            >
          </div>
          <div class="p-4">
            <p class="dark:text-[#f87171] text-[#bf3131] text-sm">${gameConsole.releaseYear
    }</p>
            <p class="dark:text-[#f87171] text-[#bf3131] text-sm mt-1">Gen ${gameConsole.generation || "?"
    }</p>
          </div>
        `;

  // Add click event to open modal
  card.addEventListener("click", () => openModal(index));

  return card;
}

// Sort consoles by release year
const sortedConsoles = consoleData.sort(
  (a, b) => a.releaseYear - b.releaseYear
);

// Modal functionality
let currentConsoleIndex = 0;
let modalOverlay, modalClose, modalPrev, modalNext;

// Function to initialize the console grid
function initConsoleGrid() {
  // Clear existing cards
  const grid = document.getElementById("console-container");
  if (!grid) return; // Safety check

  grid.innerHTML = "";

  // Insert console cards into the grid
  sortedConsoles.forEach((gameConsole, index) => {
    grid.appendChild(createConsoleCard(gameConsole, index));
  });
}

// Function to open modal with console details
function openModal(index) {
  currentConsoleIndex = index;
  updateModalContent(index);
  modalOverlay.classList.remove("hidden");
  document.body.style.overflow = "hidden"; // Prevent scrolling
}

// Function to close modal
function closeModal() {
  modalOverlay.classList.add("hidden");
  document.body.style.overflow = "auto"; // Re-enable scrolling
}

// Function to update modal content
function updateModalContent(index) {
  const console = sortedConsoles[index];
  const isDarkMode = document.documentElement.classList.contains("dark");

  // Update modal title and images
  // document.getElementById("modal-title").textContent = console.name;
  // document.getElementById("modal-image").src = console.imageUrl || getPlaceholderImage(console.name);
  // document.getElementById("modal-image").alt = console.name;
  document.getElementById("modal-card-image").src =
    console.imageUrl || getPlaceholderImage(console.name);
  document.getElementById("modal-card-image").alt = console.name;

  // Update card details
  document.getElementById("modal-name").textContent = console.name;
  document.getElementById("modal-generation").textContent = console.generation
    ? `Gen ${console.generation}`
    : "Unknown";
  document.getElementById("modal-year").textContent = console.releaseYear;

  // Format price with dollar sign if available
  const price = console.originalPrice ? `$${console.originalPrice}` : "Unknown";
  document.getElementById("modal-price").textContent = price;

  // Format sales with abbreviation if available
  let salesText = "Unknown";
  if (console.globalSales) {
    if (console.globalSales >= 1000000) {
      salesText = (console.globalSales / 1000000).toFixed(0) + "M UNITS";
    } else if (console.globalSales >= 1000) {
      salesText = (console.globalSales / 1000).toFixed(0) + "K UNITS";
    } else {
      salesText = console.globalSales.toString();
    }
  }
  document.getElementById("modal-sales").textContent = salesText;

  // Update description
  document.getElementById("modal-description").textContent =
    console.description || "No description available.";

  // Update games list
  const gamesList = document.getElementById("modal-games");
  gamesList.innerHTML = "";
  if (console.notableGames && console.notableGames.length > 0) {
    console.notableGames.forEach((game) => {
      const li = document.createElement("li");
      li.textContent = game;
      gamesList.appendChild(li);
    });
  } else {
    const li = document.createElement("li");
    li.textContent = "Information not available";
    gamesList.appendChild(li);
  }

  // Update facts list
  const factsList = document.getElementById("modal-facts");
  factsList.innerHTML = "";
  if (console.funFacts && console.funFacts.length > 0) {
    console.funFacts.forEach((fact) => {
      const li = document.createElement("li");
      li.textContent = fact;
      factsList.appendChild(li);
    });
  } else {
    const li = document.createElement("li");
    li.textContent = "Information not available";
    factsList.appendChild(li);
  }
}

// Navigate to previous console
function prevConsole() {
  currentConsoleIndex =
    (currentConsoleIndex - 1 + sortedConsoles.length) % sortedConsoles.length;
  updateModalContent(currentConsoleIndex);
}

// Navigate to next console
function nextConsole() {
  currentConsoleIndex = (currentConsoleIndex + 1) % sortedConsoles.length;
  updateModalContent(currentConsoleIndex);
}

// Initialize everything when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Get modal elements
  modalOverlay = document.getElementById("modal-overlay");
  modalClose = document.getElementById("modal-close");
  modalPrev = document.getElementById("modal-prev");
  modalNext = document.getElementById("modal-next");

  // Initialize console grid
  initConsoleGrid();

  // Add event listeners for modal
  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modalPrev) modalPrev.addEventListener("click", prevConsole);
  if (modalNext) modalNext.addEventListener("click", nextConsole);

  // Close modal when clicking outside
  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (modalOverlay && !modalOverlay.classList.contains("hidden")) {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") prevConsole();
      if (e.key === "ArrowRight") nextConsole();
    }
  });

  // Watch for theme changes and update placeholder images
  const htmlElement = document.documentElement;
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === "class") {
        // Refresh the console grid when theme changes
        initConsoleGrid();
        // If modal is open, update its content too
        if (modalOverlay && !modalOverlay.classList.contains("hidden")) {
          updateModalContent(currentConsoleIndex);
        }
      }
    });
  });

  observer.observe(htmlElement, { attributes: true });
});
