const API = "http://localhost:5000/api/posts";
const postsEl = document.getElementById("posts");
const countryList = document.getElementById("countryList");
let selectedRegion = null;

// distinct colors per country
const countryColors = {
  "USA": "#1E90FF",
  "India": "#FF8C00",
  "Italy": "#32CD32",
  "France": "#8A2BE2",
  "Japan": "#FF1493",
  "China": "#DC143C",
  "Mexico": "#228B22",
  "Brazil": "#FFD700",
  "Germany": "#FF4500",
  "Spain": "#FF6347",
  "Thailand": "#00CED1",
  "Turkey": "#FF69B4",
  "UK": "#7B68EE",
  "Canada": "#FF0000",
  "Australia": "#20B2AA"
};

// Load posts
async function loadPosts() {
  const res = await fetch(API);
  let posts = await res.json();
  if (selectedRegion) posts = posts.filter(p => p.region === selectedRegion);
  postsEl.innerHTML = "";
  posts.forEach(p => {
    postsEl.innerHTML += `
      <div class="card">
        ${p.media ? `<img src="http://localhost:5000${p.media}">` : ""}
        <h3>${p.title}</h3>
        <p class="region">${p.region}</p>
        <p class="content">${p.content}</p>
        <div class="actions">
          <button class="edit" onclick="editPost('${p._id}', '${p.title}', \`${p.content}\`, '${p.region}')">Edit</button>
          <button class="delete" onclick="deletePost('${p._id}')">Delete</button>
        </div>
      </div>
    `;
  });
}

// Submit post
document.getElementById("postForm").addEventListener("submit", async e => {
  e.preventDefault();
  const formData = new FormData(e.target);
  formData.append("content", formData.get("body"));
  formData.append("region", selectedRegion || "General");
  await fetch(API, { method:"POST", body: formData });
  e.target.reset();
  loadPosts();
});

// Edit post
async function editPost(id, oldTitle, oldContent, oldRegion) {
  const newTitle = prompt("Edit title:", oldTitle);
  const newContent = prompt("Edit content:", oldContent);
  const newRegion = prompt("Edit region:", oldRegion);
  if(!newTitle || !newContent || !newRegion) return;
  await fetch(`${API}/${id}`, {
    method:"PUT",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({title:newTitle, content:newContent, region:newRegion})
  });
  loadPosts();
}

// Delete post
async function deletePost(id) {
  if(!confirm("Are you sure you want to delete this post?")) return;
  await fetch(`${API}/${id}`, { method:"DELETE" });
  loadPosts();
}

const sidebar = document.querySelector(".sidebar");

countryList.querySelectorAll("li").forEach(li => {
  li.addEventListener("click", () => {
    selectedRegion = li.getAttribute("data-region");
    const color = countryColors[selectedRegion] || "#ff6b3c";

    // Change main content and sidebar color
    document.querySelector(".main-content").style.backgroundColor = color;
    sidebar.style.backgroundColor = color;

    loadPosts();
  });
});


// Butterflies
function createButterfly() {
  const butterfly = document.createElement("div");
  butterfly.className = "butterfly";
  butterfly.style.left = Math.random()*window.innerWidth + "px";
  butterfly.style.backgroundColor = `hsl(${Math.random()*360}, 80%, 60%)`;
  butterfly.style.animation = `floatButterfly ${5 + Math.random()*5}s linear infinite`;
  document.getElementById("butterflies").appendChild(butterfly);
  setTimeout(()=>{ butterfly.remove(); }, 10000);
}
setInterval(createButterfly, 500);

// Initial load
loadPosts();
