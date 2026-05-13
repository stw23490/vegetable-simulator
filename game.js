// Vegetable Simulator
// You are a vegetable. You just exist.

const VEGETABLES = [
  { id: 'potato', name: 'potato', emoji: '🥔', unlocked: true, color: '#d4a953', shape: '45% 48% 50% 47% / 50% 52% 48% 45%' },
  { id: 'carrot', name: 'carrot', emoji: '🥕', unlocked: true, color: '#e86a17', shape: '20% 20% 45% 45% / 50% 50% 50% 50%' },
  { id: 'onion', name: 'onion', emoji: '🧅', unlocked: true, color: '#c8a951', shape: '50% 50% 45% 45% / 55% 55% 45% 45%' },
  { id: 'tomato', name: 'tomato', emoji: '🍅', unlocked: true, color: '#e53935', shape: '50% 50% 50% 50% / 50% 50% 50% 50%' },
  { id: 'broccoli', name: 'broccoli', emoji: '🥦', unlocked: true, color: '#388e3c', shape: '50% 50% 40% 40% / 60% 60% 40% 40%' },
  { id: 'eggplant', name: 'eggplant', emoji: '🍆', unlocked: true, color: '#5e35b1', shape: '30% 30% 50% 50% / 50% 50% 50% 50%' },
  { id: 'golden_carrot', name: 'golden carrot', emoji: '✨🥕', unlocked: false, color: '#ffd700', shape: '20% 20% 45% 45% / 50% 50% 50% 50%' },
  { id: 'diamond_onion', name: 'diamond onion', emoji: '💎🧅', unlocked: false, color: '#81d4fa', shape: '50% 50% 45% 45% / 55% 55% 45% 45%' },
  { id: 'void_potato', name: 'void potato', emoji: '🖤🥔', unlocked: false, color: '#1a1a1a', shape: '45% 48% 50% 47% / 50% 52% 48% 45%' },
];

const AMBIENT_THOUGHTS = [
  "you exist.",
  "the dirt is warm.",
  "a breeze passes.",
  "nothing happens.",
  "you are here.",
  "time moves around you.",
  "the soil holds you.",
  "somewhere, a bird sings.",
  "you feel the earth breathe.",
  "clouds drift by.",
  "this is fine.",
  "you have no appointments.",
  "the sun is kind today.",
  "a worm passes below.",
  "you are perfectly still.",
  "there is nowhere to be.",
  "you are enough.",
  "the world turns.",
  "rain would be nice.",
  "or not. either way.",
  "you've been here a while.",
  "that's okay.",
  "a leaf lands nearby.",
  "you don't need to do anything.",
  "just exist.",
  "the sky is pretty today.",
  "you are a vegetable.",
  "that's all there is to it.",
];

const MINDFUL_QUOTES = [
  "the present moment is the only moment available to us, and it is the door to all moments. — thich nhat hanh",
  "almost everything will work again if you unplug it for a few minutes. including you. — anne lamott",
  "nature does not hurry, yet everything is accomplished. — lao tzu",
  "in today's rush, we all think too much, seek too much, want too much, and forget about the joy of just being. — eckhart tolle",
  "the quieter you become, the more you can hear. — ram dass",
  "smile, breathe, and go slowly. — thich nhat hanh",
  "be where you are, not where you think you should be.",
  "nothing is worth more than this day. — goethe",
  "the best time to plant a tree was 20 years ago. the second best time is now.",
  "you do not have to be good. you do not have to walk on your knees. — mary oliver",
  "life is available only in the present moment. — thich nhat hanh",
  "feelings come and go like clouds in a windy sky. conscious breathing is my anchor. — thich nhat hanh",
  "the earth has music for those who listen. — shakespeare",
  "in the middle of difficulty lies opportunity. — albert einstein",
  "be still. stillness reveals the secrets of eternity. — lao tzu",
  "do not dwell in the past, do not dream of the future. concentrate the mind on the present moment. — buddha",
  "when you realize nothing is lacking, the whole world belongs to you. — lao tzu",
  "rest is not idleness. — john lubbock",
  "the soul always knows what to do to heal itself. the challenge is to silence the mind. — caroline myss",
  "peace comes from within. do not seek it without. — buddha",
  "we are not going anywhere. we are just here. and that is enough.",
  "to a mind that is still, the whole universe surrenders. — lao tzu",
  "breathe in. breathe out. you are alive. that is enough.",
  "every moment is a fresh beginning. — t.s. eliot",
];

const NIGHT_THOUGHTS = [
  "the stars are out.",
  "everything is quiet.",
  "the moon watches.",
  "the world sleeps. you don't.",
  "nighttime is peaceful.",
  "darkness wraps around you.",
  "you can't see much. that's fine.",
  "a cricket chirps somewhere.",
];

const RAIN_THOUGHTS = [
  "it's raining.",
  "the water feels nice.",
  "drip. drip. drip.",
  "you're getting wet. you don't mind.",
  "the rain doesn't judge you.",
  "puddles form nearby.",
  "everything smells like earth.",
];

// Game state
let state = {
  currentVeggie: null,
  timeOfDay: 0, // 0-24 (hours)
  weather: 'clear', // clear, cloudy, rain
  season: 'summer', // spring, summer, autumn, winter
  gameTime: 0,
  started: false,
  lastThought: 0,
  stars: [],
  raindrops: [],
};

// Time acceleration: 1 real second = 1 game minute
const TIME_SCALE = 60; // 1 real second = 1 game minute, full day in 24 minutes

function init() {
  showVeggiePicker();
  requestAnimationFrame(gameLoop);
}

function showVeggiePicker() {
  const picker = document.getElementById('veggie-picker');
  const options = document.getElementById('veggie-options');
  picker.classList.remove('hidden');
  
  options.innerHTML = '';
  VEGETABLES.forEach(veg => {
    const el = document.createElement('div');
    el.className = 'veggie-option' + (veg.unlocked ? '' : ' locked');
    el.innerHTML = `<span class="emoji">${veg.emoji}</span><span class="name">${veg.name}</span>`;
    if (veg.unlocked) {
      el.addEventListener('click', () => selectVeggie(veg));
      el.addEventListener('touchend', (e) => { e.preventDefault(); selectVeggie(veg); });
    }
    options.appendChild(el);
  });
}

function selectVeggie(veg) {
  state.currentVeggie = veg;
  state.started = true;
  state.timeOfDay = 8; // Start at 8am
  
  // Apply veggie appearance
  const vegEl = document.getElementById('vegetable');
  vegEl.style.background = `radial-gradient(ellipse at 40% 35%, ${lighten(veg.color, 20)}, ${veg.color}, ${darken(veg.color, 20)}, ${darken(veg.color, 40)})`;
  vegEl.style.borderRadius = veg.shape;
  
  // Hide picker
  document.getElementById('veggie-picker').classList.add('hidden');
  
  // Start ambient systems
  setTimeout(() => showThought(), 3000);
  spawnClouds();
  updateSky();
}

function lighten(hex, percent) {
  const num = parseInt(hex.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
  const B = Math.min(255, (num & 0x0000FF) + amt);
  return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
}

function darken(hex, percent) {
  const num = parseInt(hex.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
  const B = Math.max(0, (num & 0x0000FF) - amt);
  return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
}

// Sky and time
function updateSky() {
  if (!state.started) return;
  
  const sky = document.getElementById('sky');
  const sunMoon = document.getElementById('sun-moon');
  const hour = state.timeOfDay;
  
  // Remove all sky classes
  sky.classList.remove('sunset', 'night', 'dawn');
  sunMoon.classList.remove('moon');
  
  if (hour >= 5 && hour < 7) {
    sky.classList.add('dawn');
  } else if (hour >= 7 && hour < 18) {
    // Day - default sky
  } else if (hour >= 18 && hour < 20) {
    sky.classList.add('sunset');
  } else {
    sky.classList.add('night');
    sunMoon.classList.add('moon');
    showStars();
  }
  
  // Move sun/moon in arc
  const progress = (hour % 12) / 12;
  const arcX = 10 + progress * 80; // 10% to 90% of screen
  const arcY = 50 - Math.sin(progress * Math.PI) * 40; // Arc up and down
  sunMoon.style.left = arcX + '%';
  sunMoon.style.top = arcY + '%';
  
  // Remove stars during day
  if (hour >= 6 && hour < 19) {
    clearStars();
  }
}

function showStars() {
  if (state.stars.length > 0) return;
  const sky = document.getElementById('sky');
  for (let i = 0; i < 30; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 50 + '%';
    star.style.animationDelay = Math.random() * 2 + 's';
    star.style.width = (Math.random() * 2 + 1) + 'px';
    star.style.height = star.style.width;
    sky.appendChild(star);
    state.stars.push(star);
  }
}

function clearStars() {
  state.stars.forEach(s => s.remove());
  state.stars = [];
}

// Clouds
function spawnClouds() {
  const container = document.getElementById('clouds');
  container.innerHTML = '';
  
  const numClouds = 3 + Math.floor(Math.random() * 3);
  for (let i = 0; i < numClouds; i++) {
    const cloud = document.createElement('div');
    cloud.className = 'cloud';
    const size = 60 + Math.random() * 80;
    cloud.style.width = size + 'px';
    cloud.style.height = (size * 0.4) + 'px';
    cloud.style.top = (5 + Math.random() * 35) + '%';
    cloud.style.animationDuration = (30 + Math.random() * 40) + 's';
    cloud.style.animationDelay = (-Math.random() * 40) + 's';
    cloud.style.opacity = 0.6 + Math.random() * 0.3;
    container.appendChild(cloud);
  }
}

// Weather
function updateWeather() {
  const world = document.getElementById('world');
  
  // Random weather changes
  if (Math.random() < 0.001) { // ~every 16 minutes of real time
    const roll = Math.random();
    if (roll < 0.3) {
      startRain();
    } else if (state.weather === 'rain') {
      stopRain();
    }
  }
}

function startRain() {
  if (state.weather === 'rain') return;
  state.weather = 'rain';
  document.getElementById('world').classList.add('raining');
  
  const particles = document.getElementById('particles');
  for (let i = 0; i < 60; i++) {
    const drop = document.createElement('div');
    drop.className = 'raindrop';
    drop.style.left = Math.random() * 100 + '%';
    drop.style.animationDuration = (0.5 + Math.random() * 0.5) + 's';
    drop.style.animationDelay = (-Math.random() * 2) + 's';
    drop.style.opacity = 0.3 + Math.random() * 0.4;
    particles.appendChild(drop);
    state.raindrops.push(drop);
  }
}

function stopRain() {
  state.weather = 'clear';
  document.getElementById('world').classList.remove('raining');
  state.raindrops.forEach(d => d.remove());
  state.raindrops = [];
}

// Ambient thoughts
function showThought() {
  if (!state.started) return;
  
  const textEl = document.getElementById('ambient-text');
  let pool = AMBIENT_THOUGHTS;
  let displayTime = 4000;
  
  // 20% chance of a mindful quote
  if (Math.random() < 0.2) {
    pool = MINDFUL_QUOTES;
    displayTime = 7000; // quotes stay longer
  } else {
    const hour = state.timeOfDay;
    if (hour >= 20 || hour < 6) {
      pool = [...AMBIENT_THOUGHTS, ...NIGHT_THOUGHTS, ...NIGHT_THOUGHTS];
    }
    if (state.weather === 'rain') {
      pool = [...pool, ...RAIN_THOUGHTS, ...RAIN_THOUGHTS];
    }
  }
  
  const thought = pool[Math.floor(Math.random() * pool.length)];
  textEl.textContent = thought;
  textEl.classList.add('show');
  
  setTimeout(() => {
    textEl.classList.remove('show');
  }, displayTime);
  
  // Next thought in 10-25 seconds
  const nextDelay = 10000 + Math.random() * 15000;
  setTimeout(() => showThought(), nextDelay);
}

// Face visibility (shows briefly sometimes)
function maybeShowFace() {
  if (Math.random() < 0.002) {
    const face = document.getElementById('vegetable-face');
    face.classList.add('visible');
    setTimeout(() => face.classList.remove('visible'), 3000 + Math.random() * 4000);
  }
}

// Tap interaction - does nothing meaningful, maybe a tiny wiggle
document.addEventListener('DOMContentLoaded', () => {
  const vegContainer = document.getElementById('vegetable-container');
  vegContainer.addEventListener('click', onTapVeggie);
  vegContainer.addEventListener('touchstart', (e) => {
    e.preventDefault();
    onTapVeggie();
  });
});

function onTapVeggie() {
  if (!state.started) return;
  const veg = document.getElementById('vegetable');
  veg.style.transition = 'transform 0.1s';
  veg.style.transform = 'scale(0.97)';
  setTimeout(() => {
    veg.style.transform = 'scale(1)';
    setTimeout(() => { veg.style.transition = ''; }, 200);
  }, 100);
  
  // Show face briefly
  const face = document.getElementById('vegetable-face');
  face.classList.add('visible');
  setTimeout(() => face.classList.remove('visible'), 2000);
}

// Season management
function updateSeason() {
  // Change season every 6 game-hours (6 real minutes)
  const world = document.getElementById('world');
  const seasons = ['spring', 'summer', 'autumn', 'winter'];
  const seasonIndex = Math.floor(state.gameTime / (6 * 60)) % 4; // Every 6 game-hours
  const newSeason = seasons[seasonIndex];
  
  if (newSeason !== state.season) {
    state.season = newSeason;
    world.classList.remove('spring', 'summer', 'autumn', 'winter');
    world.classList.add(newSeason);
    
    // Add/remove grass for spring
    const existing = document.querySelectorAll('.grass-tuft');
    existing.forEach(g => g.remove());
    
    if (newSeason === 'spring') {
      for (let i = 0; i < 8; i++) {
        const grass = document.createElement('div');
        grass.className = 'grass-tuft';
        grass.style.left = (10 + Math.random() * 80) + '%';
        grass.style.animationDelay = (Math.random() * 2) + 's';
        world.appendChild(grass);
      }
    }
  }
}

// Main game loop
let lastTime = 0;
function gameLoop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const delta = (timestamp - lastTime) / 1000; // seconds
  lastTime = timestamp;
  
  if (state.started) {
    // Advance game time
    const gameMinutes = delta * (TIME_SCALE / 60);
    state.timeOfDay += gameMinutes / 60;
    state.gameTime += gameMinutes;
    
    if (state.timeOfDay >= 24) state.timeOfDay -= 24;
    
    updateSky();
    updateWeather();
    updateSeason();
    maybeShowFace();
  }
  
  requestAnimationFrame(gameLoop);
}

// Double-tap to reopen veggie picker
let lastTapTime = 0;
document.addEventListener('dblclick', (e) => {
  if (!state.started) return;
  if (e.target.closest('#vegetable-container')) return;
  showVeggiePicker();
});

init();
