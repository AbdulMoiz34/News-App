// Animation code removed



// -----------------



const API_KEY = "cdbe0365d06a4a0f91f9f6ae0e018036";
const categories = [
    { type: "world", desc: "Get the latest updated from around the globe.", img: "./assets/world.png" },
    { type: "politics", desc: "Stay informed about political changes and decisions", img: "./assets/news.png" },
    { type: "Technology", desc: "Discover the latest trends and innovations in tech.", img: "./assets/technology.jpg" },
    { type: "Sports", desc: "Catch up with the latest sports events and scores.", img: "./assets/sports.jpg" },
    { type: "Entertainment", desc: "Find out what's trending in movies, music, and more..", img: "./assets/entertainment.jpeg" },
    { type: "Science", desc: "Explore the latest scientific discoveries and research.", img: "./assets/science.avif" },
]

const displayNews = (news) => {
    const newsBoxEl = document.querySelector(".news-list");
    newsBoxEl.innerHTML = ''; // Clear existing content

    // Add news items
    news.forEach(newsObj => {
        newsBoxEl.innerHTML += `
        <div class="col-md-6 col-lg-4 mt-4">
            <div class="card">
                <img src="${newsObj.urlToImage || 'https://via.placeholder.com/300x200?text=News'}" class="card-img-top" alt="News">
                <div class="card-body">
                    <h4 class="card-title">${newsObj.title || 'News Title'}</h4>
                    <p class="card-text">${newsObj.description || 'No description available'}</p>
                    <a href="${newsObj.url}" target="blank" class="btn btn-dark">Read More</a>
                </div>
            </div>
        </div>`;
    });
}

const getNewsFromCategory = async (cetegory) => {
    const res = await fetch(`https://newsapi.org/v2/top-headlines?q=${cetegory}&apiKey=${API_KEY}`);
    return await res.json();
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

    // Add featured stories
    stories.forEach(story => {
        el.innerHTML += `
        <div class="row align-items-center mb-4">
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
}

const displayCategoryCards = () => {
    displayCatgories();
};

const main = async () => {
    try {
        // Display categories first (no need to wait for API)
        displayCategoryCards();

        // Show loading message
        const newsBoxEl = document.querySelector(".news-list");
        newsBoxEl.innerHTML = `<div class="col-12 text-center"><h3>Loading latest news...</h3></div>`;

        // Fetch data
        const worldNews = await getNewsFromCategory("world");
        if (worldNews.message) {
            throw new Error(worldNews.message);
        }
        const stories = await getNewsFromCategory("business");

        // Display content with animations
        displayNews(worldNews.articles);
        displayFeaturedStories(stories.articles);

    } catch (err) {
        console.log(err);
        // Show error message to user
        const newsBoxEl = document.querySelector(".news-list");
        if (newsBoxEl) {
            newsBoxEl.innerHTML = `<div class="col-12 text-center"><h3>Sorry, we couldn't load the news. Please try again later.</h3></div>`;
        }
    }
}

main();