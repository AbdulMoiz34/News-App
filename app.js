// Reusable GSAP Animation Function
function animateElement(selector, options) {
    gsap.from(selector, {
        duration: 1,
        opacity: 0,
        ease: "power2.out",
        ...options
    });
}

// ScrollTrigger options for reusability
const scrollTriggerOptions = (trigger, start) => ({
    trigger: trigger,
    start: start,
    toggleActions: "play none none none"
});

// Applying animations
animateElement(".navbar", { y: -50 });
animateElement(".nav-item", { y: -20, stagger: 0.2 });
animateElement(".hero-content h1", { y: 30, delay: 0.5 });
animateElement(".hero-content p", { y: 20, delay: 0.7 });
animateElement(".hero-content a", { y: 20, delay: 0.9 });

animateElement(".latest-news h2", {
    y: 30,
    scrollTrigger: scrollTriggerOptions(".latest-news", "top 80%")
});

animateElement(".card", {
    y: 50,
    stagger: 0.3,
    scrollTrigger: scrollTriggerOptions(".latest-news", "top 50%")
});

animateElement(".featured-stories h2", {
    y: 30,
    scrollTrigger: scrollTriggerOptions(".featured-stories", "top 80%")
});

animateElement(".featured-stories .row", {
    x: -50,
    stagger: 0.3,
    scrollTrigger: scrollTriggerOptions(".featured-stories", "top 85%")
});

animateElement(".categories h2", {
    y: 30,
    scrollTrigger: scrollTriggerOptions(".categories", "top 80%")
});

animateElement(".category-card", {
    scale: 0.8,
    stagger: 0.2,
    scrollTrigger: scrollTriggerOptions(".categories", "top 85%")
});

animateElement(".newsletter-subscription h2", {
    y: 30,
    scrollTrigger: scrollTriggerOptions(".newsletter-subscription", "top 80%")
});

animateElement(".newsletter-subscription .subscription-form", {
    y: 50,
    scrollTrigger: scrollTriggerOptions(".newsletter-subscription", "top 85%")
});

animateElement(".footer h5", {
    y: 30,
    scrollTrigger: scrollTriggerOptions(".footer", "top 80%")
});

animateElement(".footer .list-unstyled li", {
    x: -50,
    stagger: 0.2,
    scrollTrigger: scrollTriggerOptions(".footer", "top 85%")
});



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
    for (let newsObj of news) {
        newsBoxEl.innerHTML += `
         <div class="col-md-6 col-lg-4 mt-4">
                    <div class="card">
                        <img src="${newsObj.urlToImage}" class="card-img-top" alt="News">
                        <div class="card-body">
                            <h4 class="card-title">${newsObj.title}</h4>
                            <p class="card-text">${newsObj.description}</p>
                            <a href="${newsObj.url}" target="blank" class="btn btn-dark">Read More</a>
                        </div>
                    </div>
                </div>`;
    }
    console.log(news);
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
    for (let story of stories) {
        console.log(story);
        el.innerHTML += `<div class="row align-items-center mb-4">
                <div class="col-md-6">
                    <img src="${story.urlToImage}" class="img-fluid rounded"
                        alt="Featured Story">
                </div>
                <div class="col-md-6">
                    <h3>${story.title}</h3>
                    <p>${story.description.length > 50 ? story.description.slice(0, 50) + "..." : story.description}</p>
                    <a href="${story.url}" class="btn btn-dark">Read More</a>
                </div>
            </div>`
    }
    el.innerHTML += ``;
}

const main = async () => {
    const loaderBox = document.querySelector(".loader-box");
    try {
        displayCatgories();
        loaderBox.style.display = "flex";
        const worldNews = await getNewsFromCategory("world");
        if (worldNews.message) {
            throw new Error(worldNews.message);
        }
        const stories = await getNewsFromCategory("business");
        displayNews(worldNews.articles);
        displayFeaturedStories(stories.articles);
    } catch (err) {
        console.log(err);
    } finally {
        loaderBox.style.display = "none";
        console.log(loaderBox)
    }
}

main();