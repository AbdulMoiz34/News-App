const API_KEY = "cdbe0365d06a4a0f91f9f6ae0e018036";

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
};

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
    const cards = document.querySelectorAll('.card-animate');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('animate');
        }, 100 + (index * 100));
    });
}

const getQuaryParams = () => {
    const params = new URLSearchParams(location.search);
    return params.get("q");
}

const getNewsFromCategory = async (cetegory) => {
    const res = await fetch(`https://newsapi.org/v2/top-headlines?q=${cetegory}&apiKey=${API_KEY}`);
    return res.json();
}

const displayCatgories = (type, categories) => {
    const categoryList = document.querySelector(".news-list");
    const categoryHeading = document.querySelector(".category-heading");
    categoryHeading.textContent = type;

    // Animate the heading
    gsap.fromTo(categoryHeading,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "elastic.out(1, 0.5)" }
    );

    categoryList.innerHTML = '';
    if (!categories || categories.length === 0) {
        categoryList.innerHTML = `<div class="col-12 text-center"><h3>No news available for ${type}</h3></div>`;
        return;
    }

    // First show skeleton loaders
    for (let i = 0; i < Math.min(categories.length, 9); i++) {
        categoryList.innerHTML += `
        <div class="col-md-4 mb-4">
            <div class="card">
                <div class="skeleton-loader" style="height: 200px;"></div>
                <div class="card-body">
                    <div class="skeleton-loader" style="height: 24px; margin-bottom: 15px;"></div>
                    <div class="skeleton-loader" style="height: 80px;"></div>
                </div>
            </div>
        </div>`;
    }

    // After a short delay, replace with actual content
    setTimeout(() => {
        categoryList.innerHTML = '';

        categories.forEach(category => {
            if (!category) return;

            categoryList.innerHTML += `
            <a target="_blank" href="${category.url}" class="col-md-4 mb-4 text-decoration-none text-black">
                <div class="card card-animate">
                    <img src="${category.urlToImage || 'https://via.placeholder.com/300x200?text=News'}" alt="image">
                    <div class="card-body">
                        <h4 class="card-title">${category.title || 'News Title'}</h4>
                        <p class="card-text">${category.description || 'No description available'}</p>
                    </div>
                </div>
            </a>`;
        });

        // Animate the cards
        animateCards();
    }, 800);
}

// Handle search form submission
const handleSearch = async (event) => {
    event.preventDefault();
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    const audio = document.getElementById("audioPlayer");
    if (!query) return;
    audio.play();
    // Show loading animation
    const categoryList = document.querySelector(".news-list");
    const categoryHeading = document.querySelector(".category-heading");
    categoryHeading.textContent = `Search: ${query}`;

    categoryList.innerHTML = `
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

        // Display search results
        if (searchResults.articles && searchResults.articles.length > 0) {
            displayCatgories(`Search: ${query}`, searchResults.articles);
        } else {
            categoryList.innerHTML = `
            <div class="col-12 text-center">
                <h3>No results found for "${query}"</h3>
                <p>Try different keywords or browse categories</p>
            </div>`;
        }
    } catch (error) {
        console.error('Error during search:', error);
        categoryList.innerHTML = `<div class="col-12 text-center"><h3>Sorry, we couldn't complete your search. Please try again later.</h3></div>`;
    }
};

const main = async () => {
    // Set up search form event listener
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }

    const query = getQuaryParams();

    try {
        // Animate navbar items on page load
        animateElement('.nav-item', 0.2, 0.5);

        const categoryList = document.querySelector(".news-list");
        categoryList.innerHTML = `
        <div class="col-12 text-center">
            <div style="margin: 50px auto; text-align: center;">
                <div style="display: inline-block; position: relative;">
                    <div style="width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid var(--primary-color); border-radius: 50%; animation: spin 1s linear infinite;"></div>
                </div>
                <h3 class="mt-4" style="animation: fadeIn 1s ease;">Loading ${query} news...</h3>
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

        const news = await getNewsFromCategory(query);
        if (!news.articles || news.articles.length === 0) {
            categoryList.innerHTML = `
            <div class="col-12 text-center">
                <h3 class="animate__animated animate__fadeIn">No news found for "${query}"</h3>
                <p class="animate__animated animate__fadeIn animate__delay-1s">Try searching for a different category</p>
            </div>`;
            return;
        }
        displayCatgories(query, news.articles);
    } catch (err) {
        console.log(err);
        const categoryList = document.querySelector(".news-list");
        categoryList.innerHTML = `
        <div class="col-12 text-center">
            <h3 class="animate__animated animate__fadeIn">Sorry, we couldn't load the news</h3>
            <p class="animate__animated animate__fadeIn animate__delay-1s">Please try again later</p>
        </div>`;
    }
}

main();