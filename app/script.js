// Switch tabs
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.getElementById(tabId).style.display = 'block';

    if (tabId === 'myevents') {
        renderLikedEvents();
    }
}

// Mock event data (normally fetched from backend)
const events = [
    {
        id: 'event1',
        title: 'NBA Playoffs Watch',
        venue: 'Brooklyn Arena',
        time: '2025-05-07 20:00',
        image: 'images/nba.jpg',
    },
    {
        id: 'event2',
        title: 'Cricket IPL Finals',
        venue: 'Midtown Bar',
        time: '2025-05-10 19:00',
        image: 'images/ipl.jpg',
    },
    {
        id: 'event3',
        title: 'Premier League Matchday',
        venue: 'London Pub NYC',
        time: '2025-05-08 17:00',
        image: 'images/football.jpg',
    },
    {
        id: 'event4',
        title: 'French Open Tennis Meetup',
        venue: 'Queens Tennis Arena',
        time: '2025-05-09 15:00',
        image: 'images/tennis.jpg',
    },
    {
        id: 'event5',
        title: 'Champions League Watch Party',
        venue: 'Downtown Cafe',
        time: '2025-05-12 21:00',
        image: 'images/soccer.jpg',
    },
    {
        id: 'event6',
        title: 'Volleyball Finals Hangout',
        venue: 'Seaside Bar',
        time: '2025-05-13 18:30',
        image: 'images/volleyball.jpg',
    },
    {
        id: 'event7',
        title: 'NBA East Conference Final',
        venue: 'Brooklyn Arena',
        time: '2025-05-15 19:30',
        image: 'images/basketball.jpg',
    },
    {
        id: 'event8',
        title: 'India vs Australia Cricket Night',
        venue: 'Cricket Lounge NYC',
        time: '2025-05-16 20:00',
        image: 'images/cricket.jpg',
    }
];


// Store liked events
let liked = new Set();

// Render events on home tab
function renderEvents() {
    const list = document.getElementById('event-list');
    list.innerHTML = '';

    events.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
      <img src="${event.image}" alt="Event Image">
      <h3>${event.title}</h3>
      <p><strong>Venue:</strong> ${event.venue}</p>
      <p><strong>Time:</strong> ${event.time}</p>
      <button onclick="toggleLike('${event.id}')">
        ${liked.has(event.id) ? '💔 Remove' : '❤️ Like'}
      </button>
    `;
        list.appendChild(card);
    });
}

// Render liked events in My Events tab
function renderLikedEvents() {
    const likedList = document.getElementById('liked-events');
    likedList.innerHTML = '';

    const likedEvents = events.filter(e => liked.has(e.id));
    if (likedEvents.length === 0) {
        likedList.innerHTML = '<p>No liked or RSVPed events yet.</p>';
        return;
    }

    likedEvents.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
      <img src="${event.image}" alt="Event Image">
      <h3>${event.title}</h3>
      <p><strong>Venue:</strong> ${event.venue}</p>
      <p><strong>Time:</strong> ${event.time}</p>
      <button onclick="toggleLike('${event.id}')">💔 Remove</button>
    `;
        likedList.appendChild(card);
    });
}

// Like/unlike events
function toggleLike(id) {
    if (liked.has(id)) {
        liked.delete(id);
    } else {
        liked.add(id);
    }
    renderEvents();
    renderLikedEvents();
}

// Initial load
window.onload = () => {
    renderEvents();
};
