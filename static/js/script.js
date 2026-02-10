// DOM Elements
const blogGrid = document.getElementById('blog-grid');
const modal = document.getElementById('post-modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.querySelector('.close-modal');

let blogPosts = [];

// Fetch Posts from Flask API
async function fetchPosts() {
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
            blogPosts = data.blogPosts;
        }

        renderPosts();
    } catch (error) {
        console.error('Error fetching posts:', error);
        blogGrid.innerHTML = '<p style="text-align:center; color:white;">Failed to load posts. Please try again later.</p>';
    }
}

// Render Posts
function renderPosts() {
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

// Close Modal
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

// Back to Top Logic
const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initial Render
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('fade-in');
    fetchPosts();
});

// Smooth Page Transitions
document.querySelectorAll('a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.href.includes(window.location.origin) && !this.href.includes('#')) {
            e.preventDefault();
            const target = this.href;
            document.body.style.opacity = '0';
            setTimeout(() => {
                window.location.href = target;
            }, 500);
        }
    });
});
