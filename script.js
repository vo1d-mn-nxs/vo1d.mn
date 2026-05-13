// ============================================
// 1. LOAD MOCK DATA
// ============================================

let reviewsData = [];
let notificationsData = [];
let notificationQueue = [];
let isNotificationActive = false;

async function loadMockData() {
    try {
        const reviewsResponse = await fetch('mock-data/reviews.json');
        reviewsData = await reviewsResponse.json();

        const notificationsResponse = await fetch('mock-data/notifications.json');
        notificationsData = await notificationsResponse.json();

        // Shuffle notifications for random display
        notificationsData = notificationsData.sort(() => Math.random() - 0.5);

        console.log('Mock data loaded successfully');
        console.log(`Loaded ${reviewsData.length} reviews`);
        console.log(`Loaded ${notificationsData.length} notifications`);

        displayReviews();
        startNotificationLoop();
    } catch (error) {
        console.error('Error loading mock data:', error);
        document.getElementById('reviews-container').innerHTML = 
            '<p class="loading">Error loading reviews. Please refresh the page.</p>';
    }
}

// ============================================
// 2. REVIEWS SECTION
// ============================================

function displayReviews() {
    const container = document.getElementById('reviews-container');
    
    if (reviewsData.length === 0) {
        container.innerHTML = '<p class="loading">No reviews available.</p>';
        return;
    }

    const reviewsHTML = reviewsData.map(review => `
        <div class="review-card">
            <div class="review-header">
                <span class="review-username">@${review.username}</span>
                <span class="review-rating">
                    ${'⭐'.repeat(review.rating)}
                </span>
            </div>
            <p class="review-comment">"${review.comment}"</p>
            <p class="review-date">${formatDate(review.timestamp)}</p>
        </div>
    `).join('');

    container.innerHTML = reviewsHTML;
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('en-US', options);
}

// ============================================
// 3. NOTIFICATION SYSTEM
// ============================================

function startNotificationLoop() {
    // Display notifications every 20 seconds
    let notificationIndex = 0;

    setInterval(() => {
        if (notificationIndex < notificationsData.length) {
            const notification = notificationsData[notificationIndex];
            displayNotification(notification);
            notificationIndex++;
        } else {
            // Reset and loop through again
            notificationIndex = 0;
        }
    }, 20000); // 20 seconds

    // Also display one immediately
    if (notificationsData.length > 0) {
        displayNotification(notificationsData[0]);
    }
}

function displayNotification(notification) {
    const container = document.getElementById('notification-container');
    
    const notifElement = document.createElement('div');
    notifElement.className = 'notification purchase';
    notifElement.innerHTML = `<strong>${notification.username}</strong> just bought <strong>${notification.item}</strong> successfully.`;
    
    container.appendChild(notifElement);

    // Auto-remove after 6 seconds
    setTimeout(() => {
        notifElement.classList.add('slide-out');
        setTimeout(() => {
            notifElement.remove();
        }, 500);
    }, 6000);
}

// ============================================
// 4. ROBLOX PURCHASE FORM
// ============================================

let selectedRobloxAmount = null;

function selectRobloxAmount(amount) {
    selectedRobloxAmount = amount;
    document.getElementById('roblox-amount').value = amount;
    console.log(`Selected Robux amount: ${amount}`);
}

function handleRobloxPurchase(event) {
    event.preventDefault();
    
    const username = document.getElementById('roblox-username').value.trim();
    const amount = document.getElementById('roblox-amount').value;

    if (!username) {
        alert('Please enter your Roblox username');
        return;
    }

    if (!amount) {
        alert('Please select a Robux amount');
        return;
    }

    // Simulate purchase
    const message = `Purchase successful! ${amount} Robux will be sent to ${username}`;
    showSuccessMessage(message);
    
    // Reset form
    document.querySelector('.product-form').reset();
    selectedRobloxAmount = null;
}

function showSuccessMessage(message) {
    const container = document.getElementById('notification-container');
    const notifElement = document.createElement('div');
    notifElement.className = 'notification success';
    notifElement.innerHTML = `✅ ${message}`;
    
    container.appendChild(notifElement);

    setTimeout(() => {
        notifElement.classList.add('slide-out');
        setTimeout(() => {
            notifElement.remove();
        }, 500);
    }, 6000);
}

// ============================================
// 5. SHOPPING CART
// ============================================

function addToCart(item) {
    showSuccessMessage(`${item} added to cart!`);
    console.log(`Item added: ${item}`);
}

// ============================================
// 6. AUTHENTICATION CHECK
// ============================================

function checkUserAuth() {
    // Mock authentication - always false for demo
    return false;
}

function updateAuthStatus() {
    const isAuthenticated = checkUserAuth();
    const authCheck = document.getElementById('auth-check');

    if (!isAuthenticated) {
        authCheck.style.display = 'block';
    } else {
        authCheck.style.display = 'none';
    }
}

// ============================================
// 7. INITIALIZE ON PAGE LOAD
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded. Initializing application...');
    updateAuthStatus();
    loadMockData();
});

// ============================================
// 8. SMOOTH SCROLL FOR NAVIGATION
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});
