// Theme Toggle Functionality
document.getElementById("theme-toggle").addEventListener("click", () => {
    const themeStyle = document.getElementById("theme-style");
    const themeIcon = document.getElementById("theme-icon");
  
    if (themeStyle.getAttribute("href") === "light-theme.css") {
      themeStyle.setAttribute("href", "dark-theme.css");
      themeIcon.classList.replace("fa-moon", "fa-sun");
    } else {
      themeStyle.setAttribute("href", "light-theme.css");
      themeIcon.classList.replace("fa-sun", "fa-moon");
    }
  });

// Detect User Location
document.getElementById("detect-location").addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        document.getElementById("location-input").value = `${lat}, ${lon}`;
      }, () => {
        alert("Unable to retrieve location. Please enter manually.");
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  });
  
  // Search for Veterinary Clinics using Google Places API
  document.getElementById("search-vets").addEventListener("click", () => {
    const locationInput = document.getElementById("location-input").value;
    if (!locationInput) {
      alert("Please enter your location or use 'Use My Location'");
      return;
    }
  
    // Expecting location as "lat, lon"
    const parts = locationInput.split(",");
    if (parts.length < 2) {
      alert("Invalid location format. Please use 'lat, lon'");
      return;
    }
    const lat = parseFloat(parts[0].trim());
    const lon = parseFloat(parts[1].trim());
    if (isNaN(lat) || isNaN(lon)) {
      alert("Invalid coordinates. Please try again.");
      return;
    }
  
    const location = new google.maps.LatLng(lat, lon);
    // Create a dummy map object for the PlacesService
    const map = new google.maps.Map(document.createElement("div"));
    const service = new google.maps.places.PlacesService(map);
  
    const request = {
      location: location,
      radius: 5000, // 5 km radius
      type: ["veterinary_care"]
    };
  
    service.nearbySearch(request, (results, status) => {
      const vetList = document.getElementById("vet-list");
      vetList.innerHTML = ""; // Clear previous results
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        results.forEach(place => {
          const li = document.createElement("li");
          li.textContent = `${place.name} - ${place.vicinity || ""}`;
          vetList.appendChild(li);
        });
      } else {
        vetList.innerHTML = "<li>No veterinary clinics found nearby.</li>";
      }
    });
  });
  
  // Handle Vet Submission Form
  document.getElementById("vet-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("vet-name").value;
    const address = document.getElementById("vet-address").value;
    const contact = document.getElementById("vet-contact").value;
    const services = document.getElementById("vet-services").value;
    alert(`Vet Submitted:\nName: ${name}\nAddress: ${address}\nContact: ${contact}\nServices: ${services}`);
    document.getElementById("vet-form").reset();
  });
  
  // Login Modal Functionality
  const loginBtn = document.getElementById("login-btn");
  const loginModal = document.getElementById("login-modal");
  const closeModal = document.querySelector(".modal .close");
  
  loginBtn.addEventListener("click", () => {
    loginModal.style.display = "block";
  });
  
  closeModal.addEventListener("click", () => {
    loginModal.style.display = "none";
  });
  
  window.addEventListener("click", (event) => {
    if (event.target === loginModal) {
      loginModal.style.display = "none";
    }
  });
  
  // Handle Login Form Submission (dummy authentication)
  document.getElementById("login-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    alert(`Logged in as: ${email}`);
    loginModal.style.display = "none";
  });

//backend
document.getElementById("vet-form").addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent default form submission

  // Get input values
  const name = document.getElementById("vet-name").value.trim();
  const address = document.getElementById("vet-address").value.trim();
  const contact = document.getElementById("vet-contact").value.trim();
  const services = document.getElementById("vet-services").value.trim();

  // Debugging: Log values to the console
  console.log(document.getElementById("vet-name").value);
  console.log(document.getElementById("vet-address").value);
  console.log(document.getElementById("vet-contact").value);
  console.log(document.getElementById("vet-services").value);


  // Validate that all fields are filled
  if (!name || !address || !contact || !services) {
      alert("Please fill in all fields before submitting.");
      return;
  }

  // Data object to send
  const vetData = { name, address, contact, services };

  try {
      const response = await fetch("http://127.0.0.1:5000/submit-vet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(vetData),
      });

      const result = await response.json();
      alert(result.message); // Show success or error message

      if (response.ok) {
          document.getElementById("vet-form").reset(); // Clear form after successful submission
      }
  } catch (error) {
      console.error("Error submitting vet data:", error);
      alert("Failed to submit. Please try again.");
  }
});
