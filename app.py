from flask import Flask, render_template, jsonify
import os

app = Flask(__name__)

# Mock Database
blog_posts = [
    {
        "id": 1,
        "title": "The Rise of Glassmorphism in 2026",
        "category": "Design",
        "date": "October 12, 2026",
        "image": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "excerpt": "Why the frosted glass effect is dominating modern UI design and how to implement it correctly.",
        "content": "<p>Glassmorphism has taken the design world by storm...</p>"
    },
    {
        "id": 2,
        "title": "Optimizing JavaScript for Performance",
        "category": "Technology",
        "date": "October 08, 2026",
        "image": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "excerpt": "A deep dive into V8 engine mechanics and how to write non-blocking code for smoother experiences.",
        "content": "<p>Performance is key...</p>"
    },
    {
        "id": 3,
        "title": "A Digital Nomad's Guide to Tokyo",
        "category": "Lifestyle",
        "date": "September 25, 2026",
        "image": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "excerpt": "Best cafes for working, finding affordable stays, and navigating the tech scene in Japan's capital.",
        "content": "<p>Tokyo offers a unique blend...</p>"
    },
    {
        "id": 4,
        "title": "AI in Creative Arts",
        "category": "Innovation",
        "date": "September 15, 2026",
        "image": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "excerpt": "Can machines truly bear a creative soul? Exploring the boundaries of generative art and music.",
        "content": "<p>The debate continues...</p>"
    },
    {
        "id": 5,
        "title": "Sustainable Web Design",
        "category": "Eco-Tech",
        "date": "September 02, 2026",
        "image": "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "excerpt": "How reducing payload sizes and optimizing server requests can help save the planet.",
        "content": "<p>Every byte of data requires energy...</p>"
    },
    {
        "id": 6,
        "title": "The Minimalist Workspace",
        "category": "Productivity",
        "date": "August 28, 2026",
        "image": "https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "excerpt": "Declutter your desk, declutter your mind. Setting up the perfect environment for deep work.",
        "content": "<p>A cluttered space often leads to a cluttered mind...</p>"
    },
    {
        "id": 7,
        "title": "The Future of Quantum Computing",
        "category": "Technology",
        "date": "August 15, 2026",
        "image": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "excerpt": "How quantum supremacy will revolutionize cryptography and complex problem solving.",
        "content": "<p>Quantum computing is no longer science fiction...</p>"
    },
    {
        "id": 8,
        "title": "Minimalist Living: A Guide",
        "category": "Lifestyle",
        "date": "August 10, 2026",
        "image": "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "excerpt": "Decluttering your life to focus on what truly matters.",
        "content": "<p>Minimalism is about intentionality...</p>"
    },
    {
        "id": 9,
        "title": "VR Fitness: The New Gym",
        "category": "Technology",
        "date": "August 05, 2026",
        "image": "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "excerpt": "Working out in the metaverse: Is it effective?",
        "content": "<p>Virtual Reality fitness apps are gaining traction...</p>"
    },
    {
        "id": 10,
        "title": "Urban Gardening for Beginners",
        "category": "Lifestyle",
        "date": "July 28, 2026",
        "image": "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "excerpt": "Growing your own food in small city apartments.",
        "content": "<p>You don't need a backyard to garden...</p>"
    },
    {
        "id": 11,
        "title": "The Art of Slow Coffee",
        "category": "Lifestyle",
        "date": "July 20, 2026",
        "image": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "excerpt": "Why manual brewing methods are making a comeback in 2026.",
        "content": "<p>Pour-over, AeroPress, French Press. The ritual is just as important as the caffeine.</p>"
    },
    {
        "id": 12,
        "title": "Digital Detox Weekends",
        "category": "Lifestyle",
        "date": "July 15, 2026",
        "image": "https://images.unsplash.com/photo-1501556466850-7c96197c3699?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "excerpt": "Reclaiming your attention span by unplugging for 48 hours.",
        "content": "<p>Constant notifications are destroying our focus. Here is how to successfully disconnect.</p>"
    },
    {
        "id": 13,
        "title": "Sustainable Fashion Choices",
        "category": "Lifestyle",
        "date": "July 10, 2026",
        "image": "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "excerpt": "Building a capsule wardrobe that looks good and respects the planet.",
        "content": "<p>Fast fashion is out. Quality pieces are in.</p>"
    }
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/api/posts')
def get_posts():
    return jsonify(blogPosts=blog_posts)

if __name__ == '__main__':
    app.run(debug=True)
