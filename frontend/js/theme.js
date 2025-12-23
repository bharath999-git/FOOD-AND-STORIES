// Load saved theme from localStorage
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
}

// Create theme toggle button
const themeToggle = document.createElement('button');
themeToggle.className = 'theme-toggle';
themeToggle.id = 'toggleTheme';
themeToggle.innerHTML = document.body.classList.contains('dark') ? '☀️' : '🌙';
document.body.appendChild(themeToggle);

// Toggle theme on click
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  
  // Update button icon
  themeToggle.innerHTML = isDark ? '☀️' : '🌙';
  
  // Save preference
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  
  // Smooth transition effect
  document.body.style.transition = 'all 0.4s ease';
});