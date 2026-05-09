// Odyssey - Adventure Travel Simulated Backend
document.addEventListener('DOMContentLoaded', () => {
    
    // Sticky Header
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Simulated Backend Logic ---

    // 1. Authentication
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;

            const users = JSON.parse(localStorage.getItem('odyssey_users') || '[]');
            users.push({ name, email, password });
            localStorage.setItem('odyssey_users', JSON.stringify(users));

            alert('Account created successfully! Please login.');
            window.location.href = 'login.html';
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            // Admin Login Check
            if (email === 'admin@odyssey.com' && password === 'admin123') {
                localStorage.setItem('odyssey_logged_in', 'admin');
                window.location.href = 'admin.html';
                return;
            }

            const users = JSON.parse(localStorage.getItem('odyssey_users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                localStorage.setItem('odyssey_logged_in', user.name);
                window.location.href = 'index.html';
            } else {
                alert('Invalid credentials. (Hint: admin@odyssey.com / admin123)');
            }
        });
    }

    // 2. Booking Logic
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const adventure = document.getElementById('book-adventure').value;
            const date = document.getElementById('book-date').value;
            const guests = document.getElementById('book-guests').value;
            const name = document.getElementById('book-name').value;

            const bookings = JSON.parse(localStorage.getItem('odyssey_bookings') || '[]');
            bookings.push({
                id: Date.now(),
                adventure,
                date,
                guests,
                name,
                status: 'Confirmed'
            });
            localStorage.setItem('odyssey_bookings', JSON.stringify(bookings));

            alert('Adventure Booked! See you at the edge.');
            window.location.href = 'index.html';
        });
    }

    // 3. Admin Dashboard
    const bookingsTable = document.getElementById('bookings-list');
    if (bookingsTable) {
        // Simple Auth Check
        if (localStorage.getItem('odyssey_logged_in') !== 'admin') {
            document.body.innerHTML = '<div style="height: 100vh; display: flex; align-items: center; justify-content: center; background: #111827; color: white; font-family: sans-serif;"><h1>Unauthorized Access</h1></div>';
            setTimeout(() => window.location.href = 'login.html', 2000);
            return;
        }

        const bookings = JSON.parse(localStorage.getItem('odyssey_bookings') || '[]');
        const totalBookings = document.getElementById('total-bookings');
        const totalGuests = document.getElementById('total-guests');

        if (totalBookings) totalBookings.innerText = bookings.length;
        if (totalGuests) {
            const count = bookings.reduce((sum, b) => sum + parseInt(b.guests), 0);
            totalGuests.innerText = count;
        }

        bookingsTable.innerHTML = bookings.map(b => `
            <tr>
                <td>#${b.id.toString().slice(-5)}</td>
                <td><strong>${b.name}</strong></td>
                <td>${b.adventure}</td>
                <td>${b.date}</td>
                <td>${b.guests}</td>
                <td><span style="color: #059669; font-weight: 700;">${b.status}</span></td>
            </tr>
        `).join('');
    }

    // 4. Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('odyssey_logged_in');
            window.location.href = 'index.html';
        });
    }

    // Update Nav based on Auth State
    const authAction = document.getElementById('auth-action');
    const loggedUser = localStorage.getItem('odyssey_logged_in');
    if (authAction && loggedUser) {
        authAction.innerHTML = `
            <span style="color: var(--primary); font-weight: 700;">Hello, ${loggedUser}</span>
            <a href="#" id="logout-btn" class="login-link">Logout</a>
        `;
        // Re-attach logout listener
        document.getElementById('logout-btn').addEventListener('click', () => {
            localStorage.removeItem('odyssey_logged_in');
            window.location.reload();
        });
    }

    // Active Link
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});
