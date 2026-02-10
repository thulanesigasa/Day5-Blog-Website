// DOM Elements
const blogGrid = document.getElementById('blog-grid');
const modal = document.getElementById('post-modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.querySelector('.close-modal');

let blogPosts = [];

// Fetch Posts from Flask API
async function fetchPosts() {
    if (!blogGrid) return; // Don't fetch if no grid to render to

    try {
        const response = await fetch('/api/posts');
        const data = await response.json();

        // Filter by Category if present in URL
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');

        if (category) {
            blogPosts = data.blogPosts.filter(post => post.category === category);
            // Update Section Title
            const sectionTitle = document.querySelector('.section-title');
            if (sectionTitle) sectionTitle.textContent = `${category} Articles`;
        } else {
            // If no category (Home Page), show only latest 3
            blogPosts = data.blogPosts.slice(0, 3);
        }

        renderPosts();
    } catch (error) {
        console.error('Error fetching posts:', error);
        blogGrid.innerHTML = '<p style="text-align:center; color:white;">Failed to load posts. Please try again later.</p>';
    }
}

// Render Posts
function renderPosts() {
    if (!blogGrid) return;
    blogGrid.innerHTML = '';
    blogPosts.forEach(post => {
        const card = document.createElement('div');
        card.className = 'blog-card';
        card.innerHTML = `
            <div class="card-image" style="background-image: url('${post.image}')">
                <span class="category-tag">${post.category}</span>
            </div>
            <div class="card-content">
                <p class="card-date">${post.date}</p>
                <h3 class="card-title">${post.title}</h3>
                <p class="card-excerpt">${post.excerpt}</p>
                <div class="read-more" onclick="openPost(${post.id})">
                    Read Article <i class="fas fa-arrow-right"></i>
                </div>
            </div>
        `;
        blogGrid.appendChild(card);
    });
}

// Open Modal
window.openPost = function (id) {
    if (!modal || !modalBody) return;

    const post = blogPosts.find(p => p.id === id);
    if (!post) return;

    modalBody.innerHTML = `
        <img src="${post.image}" alt="${post.title}" style="width:100%; height: 300px; object-fit: cover; border-radius: 12px; margin-bottom: 20px;">
        <span style="color: var(--primary-color); font-size: 0.9rem;">${post.category} &bull; ${post.date}</span>
        <h2 style="font-size: 2.5rem; margin: 10px 0 20px;">${post.title}</h2>
        <div style="font-size: 1.1rem; line-height: 1.8; color: rgba(255,255,255,0.9);">
            ${post.content}
        </div>
    `;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Close Modal logic
if (closeModal && modal) {
    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// Back to Top Logic
const backToTopBtn = document.getElementById('back-to-top');

if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Highlight Active Nav Link
function highlightActiveNav() {
    const navLinks = document.querySelectorAll('nav ul li a');
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;

    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');

        // Check for About Page
        if (currentPath === '/about' && linkHref === '/about') {
            link.classList.add('active');
        }
        // Check for Categories
        else if (currentSearch.includes('category=Technology') && linkHref.includes('category=Technology')) {
            link.classList.add('active');
        }
        else if (currentSearch.includes('category=Lifestyle') && linkHref.includes('category=Lifestyle')) {
            link.classList.add('active');
        }
        // Check for Home (No active search params, or explicit home path)
        else if ((currentPath === '/' || currentPath === '/index.html') && !currentSearch && (linkHref === '/' || linkHref === '/index.html')) {
            link.classList.add('active');
        }
    });
}

// Initial Render and Fade In
document.addEventListener('DOMContentLoaded', () => {
    // Force fade-in even if other things fail
    document.body.classList.add('fade-in');

    // Highlight Active Link
    highlightActiveNav();

    // Only fetch posts if we are on a page that needs them (has blogGrid)
    if (blogGrid) {
        fetchPosts();
    }
});

// Smooth Page Transitions & Home Scroll
document.querySelectorAll('a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Check if internal link
        if (this.href.includes(window.location.host)) {
            // Check if clicking "Home" ("/" or "/index.html") while on Home
            // We need to check if the pathname corresponds to home
            const currentPath = window.location.pathname;
            const targetPath = new URL(this.href).pathname;

            const isHome = (path) => path === '/' || path === '/index.html';

            if (isHome(currentPath) && isHome(targetPath)) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });

                // If we also had search params (categories), clear them to return to "Home" state
                if (window.location.search) {
                    window.history.pushState({}, '', '/');
                    fetchPosts(); // Reload to show default (top 3) posts
                }
                return;
            }

            // Normal transition for other links
            if (!this.href.includes('#') && this.target !== '_blank') {
                e.preventDefault();
                const target = this.href;
                document.body.style.opacity = '0';
                setTimeout(() => {
                    window.location.href = target;
                }, 500);
            }
        }
    });
});
