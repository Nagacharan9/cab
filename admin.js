const ADMIN_PASSWORD = "admin123";

function loadRides() {
  let rides = JSON.parse(localStorage.getItem('cabRides') || 'null');
  if (!rides) {
    rides = [
      { from: "Mumbai", to: "Pune", date: "2025-09-20", driver: "Amit", seats: 3 },
      { from: "Delhi", to: "Agra", date: "2025-09-21", driver: "Priya", seats: 2 },
      { from: "Bangalore", to: "Chennai", date: "2025-09-20", driver: "Salma", seats: 4 }
    ];
    localStorage.setItem('cabRides', JSON.stringify(rides));
  }
  return rides;
}
function saveRides(rides) {
  localStorage.setItem('cabRides', JSON.stringify(rides));
}

document.getElementById('admin-login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const pass = document.getElementById('admin-password').value;
  if (pass === ADMIN_PASSWORD) {
    document.getElementById('admin-lock').style.display = "none";
    document.getElementById('admin-panel').style.display = "block";
    showRides();
    showBookings();
  } else {
    document.getElementById('admin-error').innerText = "Incorrect password. Try again.";
  }
});

function showRides() {
  const rides = loadRides();
  const container = document.getElementById('ride-admin');
  container.innerHTML = '';
  rides.forEach((ride, i) => {
    const div = document.createElement('div');
    div.className = 'ride-card';
    div.innerHTML = `
      <div><strong>${ride.from}</strong> → <strong>${ride.to}</strong></div>
      <div>Date: <b>${ride.date}</b></div>
      <div>Driver: ${ride.driver}</div>
      <div>Seats Available: ${ride.seats}</div>
      <button class="edit-btn" data-index="${i}">Edit</button>
      <button class="delete-btn" data-index="${i}">Delete</button>
      <div class="edit-form" id="edit-form-${i}" style="display:none;">
        <form>
          <label>From: <input type="text" value="${ride.from}" id="edit-from-${i}" /></label><br>
          <label>To: <input type="text" value="${ride.to}" id="edit-to-${i}" /></label><br>
          <label>Date: <input type="date" value="${ride.date}" id="edit-date-${i}" /></label><br>
          <label>Driver: <input type="text" value="${ride.driver}" id="edit-driver-${i}" /></label><br>
          <label>Seats: <input type="number" min="1" value="${ride.seats}" id="edit-seats-${i}" /></label><br>
          <button type="submit">Save</button>
          <button type="button" class="cancel-btn" data-index="${i}">Cancel</button>
        </form>
      </div>
    `;
    container.appendChild(div);
  });

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.onclick = function() {
      const idx = btn.getAttribute('data-index');
      document.getElementById(`edit-form-${idx}`).style.display = 'block';
    };
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.onclick = function() {
      const idx = btn.getAttribute('data-index');
      rides.splice(idx, 1);
      saveRides(rides);
      showRides();
    };
  });

  document.querySelectorAll('.cancel-btn').forEach(btn => {
    btn.onclick = function() {
      const idx = btn.getAttribute('data-index');
      document.getElementById(`edit-form-${idx}`).style.display = 'none';
    };
  });

  container.querySelectorAll('.edit-form form').forEach((form, i) => {
    form.onsubmit = function(e) {
      e.preventDefault();
      rides[i] = {
        from: document.getElementById(`edit-from-${i}`).value,
        to: document.getElementById(`edit-to-${i}`).value,
        date: document.getElementById(`edit-date-${i}`).value,
        driver: document.getElementById(`edit-driver-${i}`).value,
        seats: parseInt(document.getElementById(`edit-seats-${i}`).value)
      };
      saveRides(rides);
      showRides();
    };
  });
}

function showBookings() {
  const bookings = JSON.parse(localStorage.getItem('cabBookings') || '[]');
  const adminDiv = document.getElementById('admin-bookings');
  if (!bookings.length) {
    adminDiv.innerHTML = "<p>No bookings yet.</p>";
    return;
  }
  adminDiv.innerHTML = '';
  bookings.forEach((b, i) => {
    const div = document.createElement('div');
    div.className = 'ride-card';
    div.innerHTML = `
      <div><strong>${b.ride.from}</strong> → <strong>${b.ride.to}</strong></div>
      <div>Date: <b>${b.ride.date}</b></div>
      <div>Driver: ${b.ride.driver}</div>
      <div>Seats Booked: ${b.seats}</div>
      <div>Name: ${b.name}</div>
      <div>Mobile: ${b.mobile}</div>
      <div>Time: ${b.time}</div>
    `;
    adminDiv.appendChild(div);
  });
}
