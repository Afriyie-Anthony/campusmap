// -----------------------------
// Mobile Menu Functionality
// -----------------------------
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const menuOverlay = document.getElementById("menu-overlay");
const menuIcon = document.getElementById("menu-icon");
const closeIcon = document.getElementById("close-icon");

function toggleMenu() {
    mobileMenu.classList.toggle("active");
    menuOverlay.classList.toggle("active");
    // Optionally swap icons if needed:
    menuIcon.classList.toggle("hidden");
    closeIcon.classList.toggle("hidden");
    document.body.classList.toggle("overflow-hidden");
}

menuToggle.addEventListener("click", toggleMenu);
menuOverlay.addEventListener("click", toggleMenu);

// Close mobile menu on window resize if open
window.addEventListener("resize", () => {
    if (window.innerWidth >= 768 && mobileMenu.classList.contains("active")) {
        toggleMenu();
    }
});

// -----------------------------
// Initialize Leaflet Map
// -----------------------------
function initMap() {
    // Center the map over AAMUSTED, Kumasi, Ghana (or your desired location)
    const aamusted = [6.6973, -1.6816];

    // Create the Leaflet map instance
    const map = L.map("map").setView(aamusted, 17);

    // Add OpenStreetMap tiles (free resource)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Sample data for markers
    const locations = [
        {
            position: [6.6885, -1.6244],
            type: "faculty",
            title: "Faculty of Technical Education",
            icon: "./public/icons/faculties.png"
        },
        {
            position: [6.688, -1.624],
            type: "hostel",
            title: "Student Hostel",
            icon: "./public/icons/hostels.png"
        },
        {
            position: [6.689, -1.625],
            type: "eateries",
            title: "Campus Restaurant",
            icon: "./public/icons/eatries.png"
        },
        {
            position: [6.6875, -1.6235],
            type: "atm",
            title: "Campus ATM",
            icon: "./public/icons/atm.png"
        }
    ];

    // Create markers with custom icons and bind popups
    const markers = locations.map((location) => {
        const customIcon = L.icon({
            iconUrl: location.icon,
            iconSize: [32, 32]
        });

        const marker = L.marker(location.position, {
            icon: customIcon,
            title: location.title // For search purposes
        }).addTo(map);

        marker.bindPopup(`
      <div class="p-2">
        <h3 class="font-medium">${location.title}</h3>
        <p class="text-gray-600">${location.type}</p>
        <button onclick="routeTo(${location.position[0]}, ${location.position[1]})">
          Route Here
        </button>
      </div>
    `);

        return { marker, type: location.type };
    });

    // -----------------------------
    // Search Functionality Using Leaflet-Control-Search (if available)
    // -----------------------------
    if (L.Control.Search) {
        const searchControl = new L.Control.Search({
            layer: L.layerGroup(markers.map(({ marker }) => marker)),
            propertyName: "title",
            initial: false,
            zoom: 18,
        });
        map.addControl(searchControl);
    }

    // -----------------------------
    // Filter Buttons Functionality (Adjusts marker opacity rather than removing)
    // -----------------------------
    const filterButtons = document.querySelectorAll("button[data-filter]");
    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            // Update button styles
            filterButtons.forEach((btn) => {
                if (btn === button) {
                    btn.classList.remove("bg-white", "text-gray-700", "hover:bg-gray-50");
                    btn.classList.add("bg-[#6B001F]", "text-white");
                } else {
                    btn.classList.remove("bg-[#6B001F]", "text-white");
                    btn.classList.add("bg-white", "text-gray-700", "hover:bg-gray-50");
                }
            });

            const filterType = button.dataset.filter;
            markers.forEach(({ marker, type }) => {
                // Instead of adding/removing from map, adjust opacity and pointer events.
                if (filterType === "more" || type === filterType) {
                    marker.setOpacity(1);
                    // If marker element is available, enable pointer events.
                    if (marker.getElement()) {
                        marker.getElement().style.pointerEvents = "auto";
                    }
                } else {
                    marker.setOpacity(0); // Hide non-matching markers
                    if (marker.getElement()) {
                        marker.getElement().style.pointerEvents = "none";
                    }
                }
            });
        });
    });
}

// -----------------------------
// Route Functionality
// -----------------------------
// This function retrieves the user's current location and alerts the route.
// Replace this with your routing logic when integrating a routing plugin like Leaflet Routing Machine.
function routeTo(lat, lng) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const start = L.latLng(position.coords.latitude, position.coords.longitude);
            const end = L.latLng(lat, lng);
            alert("Routing from " + start.toString() + " to " + end.toString());
        }, () => {
            alert("Geolocation failed or denied.");
        });
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

// -----------------------------
// Add Location Modal Functionality
// -----------------------------
const addLocationModal = document.getElementById("add-location-modal");
const addLocationForm = document.getElementById("add-location-form");
const addLocationBtn = document.getElementById("add-location-btn"); // if present in the UI

if (addLocationBtn) {
    addLocationBtn.addEventListener("click", () => {
        addLocationModal.classList.remove("hidden");
    });
}

// Hide Add Location Modal on Cancel
document.getElementById("cancel-add").addEventListener("click", () => {
    addLocationModal.classList.add("hidden");
    addLocationForm.reset();
});

// Handle Add Location Form Submit
addLocationForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("location-name").value;
    const category = document.getElementById("location-category").value;
    const wing = document.getElementById("location-wing").value;
    const openTime = document.getElementById("opening-time").value;
    const closeTime = document.getElementById("closing-time").value;

    // Create a new location element for demonstration (this data might also be sent to a backend)
    const newLocation = document.createElement("div");
    newLocation.className = "location-item bg-white rounded-lg shadow-sm border mb-3 hover:shadow transition-shadow relative";
    newLocation.innerHTML = `
    <div class="flex items-start gap-3 p-3">
      <img src="./public/icons/default-location.png" alt="${name}" class="w-20 h-20 object-cover rounded-lg"/>
      <div class="flex-1">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-base font-medium">${name}</h3>
            <p class="text-sm text-gray-500">${category} • ${wing}</p>
          </div>
          <div class="flex items-center">
            <div class="flex">
              <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <span class="ml-1 text-xs font-medium">New</span>
            </div>
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-1">Opens from ${formatTime(openTime)} - ${formatTime(closeTime)}</p>
      </div>
    </div>
  `;

    const locationsList = document.querySelector(".location-list");
    if (locationsList) {
        locationsList.insertBefore(newLocation, locationsList.firstChild);
    }

    addLocationForm.reset();
    addLocationModal.classList.add("hidden");
});

// Helper function to format time into a readable format
function formatTime(time) {
    return new Date(`2000-01-01T${time}`)
        .toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true })
        .toLowerCase();
}

// -----------------------------
// Load Map on Page Load
// -----------------------------
window.addEventListener("load", initMap);
