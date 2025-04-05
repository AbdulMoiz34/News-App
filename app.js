const API_KEY = "cdbe0365d06a4a0f91f9f6ae0e018036";

// Animation functions
function animateElement(selector, delay = 0, duration = 0.6) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element, index) => {
        gsap.fromTo(element,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: duration,
                delay: delay + (index * 0.1),
                ease: "power2.out"
            }
        );
    });
}

// Staggered animation for cards
function animateCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        gsap.fromTo(card,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                delay: 0.1 + (index * 0.1),
                ease: "power2.out"
            }
        );
    });
}
const categories = [
    { type: "world", desc: "Get the latest updated from around the globe.", img: "./assets/world.png" },
    { type: "politics", desc: "Stay informed about political changes and decisions", img: "./assets/news.png" },
    { type: "Technology", desc: "Discover the latest trends and innovations in tech.", img: "./assets/technology.jpg" },
    { type: "Sports", desc: "Catch up with the latest sports events and scores.", img: "./assets/sports.jpg" },
    { type: "Entertainment", desc: "Find out what's trending in movies, music, and more..", img: "./assets/entertainment.jpeg" },
    { type: "Science", desc: "Explore the latest scientific discoveries and research.", img: "./assets/science.avif" },
]

const calculateReadingTime = (text) => {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
}

const displayNews = (news) => {
    const newsBoxEl = document.querySelector(".news-list");
    newsBoxEl.innerHTML = ''; // Clear existing content

    if (!news || news.length === 0) {
        newsBoxEl.innerHTML = `<div class="col-12 text-center"><h3>No news available at the moment</h3></div>`;
        return;
    }

    // First show skeleton loaders
    for (let i = 0; i < Math.min(news.length, 9); i++) {
        newsBoxEl.innerHTML += `
        <div class="col-md-6 col-lg-4 mt-4">
            <div class="card">
                <div class="skeleton-loader" style="height: 200px;"></div>
                <div class="card-body">
                    <div class="skeleton-loader" style="height: 24px; margin-bottom: 15px;"></div>
                    <div class="skeleton-loader" style="height: 80px; margin-bottom: 15px;"></div>
                    <div class="skeleton-loader" style="height: 20px; width: 100px;"></div>
                </div>
            </div>
        </div>`;
    }

    // After a short delay, replace with actual content
    setTimeout(() => {
        newsBoxEl.innerHTML = ''; // Clear skeleton loaders

        // Add news items
        news.forEach(newsObj => {
            if (!newsObj) return; // Skip if newsObj is undefined

            const description = newsObj.description || 'No description available';

            newsBoxEl.innerHTML += `
            <div class="col-md-6 col-lg-4 mt-4">
                <div class="card">
                    <img src="${newsObj.urlToImage || 'https://via.placeholder.com/300x200?text=News'}" class="card-img-top" alt="News">
                    <div class="card-body">
                        <h4 class="card-title">${newsObj.title || 'News Title'}</h4>
                        <p class="card-text">${description}</p>
                        <small class="text-muted">
                            ${calculateReadingTime(description)} min read
                        </small>
                        <a href="${newsObj.url}" target="blank" class="btn btn-dark">Read More</a>
                    </div>
                </div>
            </div>`;
        });

        // Animate the cards
        animateCards();
    }, 800);
}

const getNewsFromCategory = async (category) => {
    const res = await fetch(`https://newsapi.org/v2/top-headlines?q=${category}&apiKey=${API_KEY}`);
    return await res.json();
}

// Function to search for news
const searchNews = async (query) => {
    try {
        const res = await fetch(`https://newsapi.org/v2/everything?q=${query}&apiKey=${API_KEY}&pageSize=20`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error searching news:', error);
        return { articles: [] };
    }
}

const displayCatgories = () => {
    const categoryList = document.querySelector(".news-by-catergories");
    for (let category of categories) {
        categoryList.innerHTML += `<a href="/category/index.html?q=${category.type}" class="col-md-4 mb-4 text-decoration-none text-black">
                    <div class="category-card p-4 shadow rounded">
                        <img src="${category.img}" alt="${category.type} News">
                        <h4 class="mt-3">${category.type}</h4>
                        <p>${category.desc}</p>
                    </div>
                </a>`;
    }
}

const displayFeaturedStories = (stories) => {
    const el = document.querySelector(".featured-list");
    el.innerHTML = ''; // Clear existing content

    if (!stories || stories.length === 0) {
        el.innerHTML = `<div class="row"><div class="col-12 text-center"><h3>No featured stories available</h3></div></div>`;
        return;
    }

    // First show skeleton loaders
    for (let i = 0; i < Math.min(stories.length, 3); i++) {
        el.innerHTML += `
        <div class="row align-items-center mb-4">
            <div class="col-md-6">
                <div class="skeleton-loader" style="height: 250px; border-radius: 8px;"></div>
            </div>
            <div class="col-md-6">
                <div class="skeleton-loader" style="height: 32px; margin-bottom: 15px;"></div>
                <div class="skeleton-loader" style="height: 60px; margin-bottom: 15px;"></div>
                <div class="skeleton-loader" style="height: 40px; width: 120px;"></div>
            </div>
        </div>`;
    }

    // After a short delay, replace with actual content
    setTimeout(() => {
        el.innerHTML = ''; // Clear skeleton loaders

        // Add featured stories
        stories.forEach(story => {
            if (!story) return; // Skip if story is undefined

            el.innerHTML += `
            <div class="row align-items-center mb-4 featured-story">
                <div class="col-md-6">
                    <img src="${story.urlToImage || 'https://via.placeholder.com/600x400?text=Featured+Story'}" class="img-fluid rounded"
                        alt="Featured Story">
                </div>
                <div class="col-md-6">
                    <h3>${story.title || 'Featured Story'}</h3>
                    <p>${story.description ? (story.description.length > 100 ? story.description.slice(0, 100) + "..." : story.description) : 'No description available'}</p>
                    <a href="${story.url}" class="btn btn-dark">Read More</a>
                </div>
            </div>`;
        });

        // Animate the featured stories
        gsap.fromTo('.featured-story',
            { opacity: 0, x: -30 },
            {
                opacity: 1,
                x: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out"
            }
        );
    }, 1000);
}

const displayCategoryCards = () => {
    displayCatgories();
};

// Handle search form submission
const handleSearch = async (event) => {
    event.preventDefault();
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();

    if (!query) return; // Don't search if query is empty

    // Show loading animation
    const newsBoxEl = document.querySelector(".news-list");
    newsBoxEl.innerHTML = `
    <div class="col-12 text-center">
        <div style="margin: 50px auto; text-align: center;">
            <div style="display: inline-block; position: relative;">
                <div style="width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid var(--primary-color); border-radius: 50%; animation: spin 1s linear infinite;"></div>
            </div>
            <h3 class="mt-4" style="animation: fadeIn 1s ease;">Searching for "${query}"...</h3>
        </div>
    </div>`;

    try {
        // Search for news
        const searchResults = await searchNews(query);

        // Clear featured stories section
        const featuredList = document.querySelector(".featured-list");
        featuredList.innerHTML = '';

        // Update section title
        const latestNewsTitle = document.querySelector(".latest-news h2");
        latestNewsTitle.innerHTML = `Search Results for "${query}"`;

        // Display search results
        if (searchResults.articles && searchResults.articles.length > 0) {
            displayNews(searchResults.articles);
        } else {
            newsBoxEl.innerHTML = `
            <div class="col-12 text-center">
                <h3>No results found for "${query}"</h3>
                <p>Try different keywords or browse categories</p>
            </div>`;
        }
    } catch (error) {
        console.error('Error during search:', error);
        newsBoxEl.innerHTML = `<div class="col-12 text-center"><h3>Sorry, we couldn't complete your search. Please try again later.</h3></div>`;
    }
};

const main = async () => {
    try {
        // Set up search form event listener
        const searchForm = document.getElementById('searchForm');
        if (searchForm) {
            searchForm.addEventListener('submit', handleSearch);
        }

        // Animate navbar items on page load
        animateElement('.nav-item', 0.2, 0.5);

        // Animate hero content
        gsap.fromTo('.hero-content h1',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "power2.out" }
        );

        gsap.fromTo('.hero-content p',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, delay: 0.5, ease: "power2.out" }
        );

        gsap.fromTo('.hero-content .btn',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, delay: 0.7, ease: "power2.out" }
        );

        // Display categories first
        displayCategoryCards();

        // Show modern loading animation
        const newsBoxEl = document.querySelector(".news-list");
        newsBoxEl.innerHTML = `
        <div class="col-12 text-center">
            <div style="margin: 50px auto; text-align: center;">
                <div style="display: inline-block; position: relative;">
                    <div style="width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid var(--primary-color); border-radius: 50%; animation: spin 1s linear infinite;"></div>
                </div>
                <h3 class="mt-4" style="animation: fadeIn 1s ease;">Loading latest news...</h3>
            </div>
        </div>`;

        // Add spin animation
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        // Fetch data
        const worldNews = await getNewsFromCategory("world");
        if (worldNews.message) {
            throw new Error(worldNews.message);
        }
        const stories = await getNewsFromCategory("business");

        // Display content with animations
        displayNews(worldNews.articles);
        displayFeaturedStories(stories.articles);

        // Animate section headings when they come into view
        gsap.utils.toArray('section h2').forEach(heading => {
            gsap.fromTo(heading,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: heading,
                        start: "top 80%"
                    }
                }
            );
        });

    } catch (err) {
        console.log(err);
        // Show error message to user
        const newsBoxEl = document.querySelector(".news-list");
        if (newsBoxEl) {
            newsBoxEl.innerHTML = `<div class="col-12 text-center"><h3 class="animate__animated animate__fadeIn">Sorry, we couldn't load the news. Please try again later.</h3></div>`;
        }
    }
}

main();