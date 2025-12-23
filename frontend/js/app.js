const API = "http://localhost:5000/api/posts";
let currentCountry = "india";
let allPosts = [];

const main = document.querySelector(".main");
const header = document.querySelector(".header");
const sidebar = document.querySelector(".sidebar");
const postsEl = document.querySelector(".posts");
const allPostsEl = document.querySelector(".all-posts");

// ============================================
// RENDER SIDEBAR
// ============================================

function renderSidebar() {
  sidebar.innerHTML = `
    <div class="sidebar-header">
      <h2>🍽️ Food & Stories</h2>
      <p>Explore Global Cuisines</p>
    </div>
  `;

  Object.keys(COUNTRIES).forEach(key => {
    const c = COUNTRIES[key];
    const div = document.createElement("div");
    div.className = "country";
    div.innerHTML = `${c.emoji} ${c.name}`;
    div.style.color = c.color;
    div.style.borderColor = c.color;
    
    if (key === currentCountry) {
      div.classList.add('active');
    }
    
    div.onclick = () => selectCountry(key);
    sidebar.appendChild(div);
  });
}

// ============================================
// SELECT COUNTRY
// ============================================

function selectCountry(key) {
  currentCountry = key;
  const c = COUNTRIES[key];
  
  // Update active state in sidebar
  document.querySelectorAll('.country').forEach(el => el.classList.remove('active'));
  event.target.classList.add('active');
  
  // Update main background and color
  main.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)), url(${c.overlay})`;
  main.style.setProperty('color', c.color);
  sidebar.style.backgroundColor = c.color + '15'; // 15 is opacity in hex
  
  // Update header with greeting
  header.innerHTML = `
    <h1>${c.greeting} ${c.emoji}</h1>
    <p>Welcome to the food culture of ${c.name}</p>
  `;
  
  // Set form button color
  const formBtn = document.querySelector('.post-form button');
  if (formBtn) {
    formBtn.style.background = `linear-gradient(135deg, ${c.color}, ${c.color}dd)`;
  }
  
  // Load posts for this country
  loadPosts();
}

// ============================================
// LOAD POSTS
// ============================================

async function loadPosts() {
  try {
    const res = await fetch(API);
    allPosts = await res.json();
    
    // Filter posts for current country
    const countryPosts = allPosts.filter(p => p.region === currentCountry);
    
    // Render country-specific posts
    postsEl.innerHTML = "";
    if (countryPosts.length === 0) {
      postsEl.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px; color: white;">
          <h3 style="font-size: 32px; margin-bottom: 15px;">No posts yet from ${COUNTRIES[currentCountry].name}</h3>
          <p style="font-size: 18px; opacity: 0.8;">Be the first to share a food story!</p>
        </div>
      `;
    } else {
      countryPosts.forEach(p => {
        postsEl.innerHTML += createPostCard(p);
      });
    }
    
    // Render all posts in bottom section
    renderAllPosts();
    
  } catch (err) {
    console.error("Error loading posts:", err);
    postsEl.innerHTML = `<p style="color: white; text-align: center;">Error loading posts. Make sure backend is running!</p>`;
  }
}

// ============================================
// CREATE POST CARD HTML
// ============================================

function createPostCard(post) {
  const country = COUNTRIES[post.region];
  const cardColor = country ? country.color : '#667eea';
  
  return `
    <div class="card" style="border-top: 4px solid ${cardColor};">
      ${post.media ? `<img src="http://localhost:5000${post.media}" alt="${post.title}">` : `<div style="height: 250px; background: linear-gradient(135deg, ${cardColor}40, ${cardColor}20);"></div>`}
      <div class="content">
        <h3>${post.title}</h3>
        <div class="author">By ${post.author} • ${country ? country.emoji + ' ' + country.name : post.region}</div>
        <p>${post.content}</p>
        <a href="post.html?id=${post._id}" style="background: ${cardColor};">Read Full Story →</a>
      </div>
    </div>
  `;
}

// ============================================
// RENDER ALL POSTS SECTION
// ============================================

function renderAllPosts() {
  if (!allPostsEl) return;
  
  allPostsEl.innerHTML = "";
  
  if (allPosts.length === 0) {
    allPostsEl.innerHTML = `
      <div style="text-align: center; padding: 60px; color: var(--text-secondary);">
        <h3 style="font-size: 28px; margin-bottom: 10px;">No posts yet</h3>
        <p>Start sharing your food stories!</p>
      </div>
    `;
    return;
  }
  
  allPosts.forEach(p => {
    allPostsEl.innerHTML += createPostCard(p);
  });
}

// ============================================
// POST FORM SUBMISSION
// ============================================

const postForm = document.getElementById("postForm");
if (postForm) {
  postForm.onsubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    formData.append("region", currentCountry);
    
    // Show loading state
    const submitBtn = e.target.querySelector('button');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Posting...";
    submitBtn.disabled = true;
    
    try {
      const response = await fetch(API, { 
        method: "POST", 
        body: formData 
      });
      
      if (response.ok) {
        e.target.reset();
        await loadPosts();
        alert(`✅ Your post has been published to ${COUNTRIES[currentCountry].name}!`);
      } else {
        alert("❌ Error posting. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting post:", err);
      alert("❌ Error posting. Make sure backend is running!");
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  };
}

// ============================================
// INITIALIZE APP
// ============================================

renderSidebar();
selectCountry("india");

// Update form button color on country change
setInterval(() => {
  const formBtn = document.querySelector('.post-form button');
  if (formBtn && COUNTRIES[currentCountry]) {
    formBtn.style.background = `linear-gradient(135deg, ${COUNTRIES[currentCountry].color}, ${COUNTRIES[currentCountry].color}dd)`;
  }
}, 100);
