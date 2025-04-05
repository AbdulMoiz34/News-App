const API_KEY = "cdbe0365d06a4a0f91f9f6ae0e018036";

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

    categoryList.innerHTML = '';
    if (!categories || categories.length === 0) {
        categoryList.innerHTML = `<div class="col-12 text-center"><h3>No news available for ${type}</h3></div>`;
        return;
    }

    categories.forEach(category => {
        if (!category) return;
        categoryList.innerHTML += `
        <a target="_blank" href="${category.url}" class="col-md-4 mb-4 text-decoration-none text-black">
            <div class="card">
                <img src="${category.urlToImage || 'https://via.placeholder.com/300x200?text=News'}" alt="image">
                <div class="card-body">
                    <h4 class="card-title">${category.title || 'News Title'}</h4>
                    <p class="card-text">${category.description || 'No description available'}</p>
                </div>
            </div>
        </a>`;
    });
}

const main = async () => {
    const query = getQuaryParams();

    try {
        const categoryList = document.querySelector(".news-list");
        categoryList.innerHTML = `
        <div class="col-12 text-center">
            <h3>Loading ${query} news...</h3>
        </div>`;
        const news = await getNewsFromCategory(query);
        if (!news.articles || news.articles.length === 0) {
            categoryList.innerHTML = `
            <div class="col-12 text-center">
                <h3>No news found for "${query}"</h3>
                <p>Try searching for a different category</p>
            </div>`;
            return;
        }
        displayCatgories(query, news.articles);
    } catch (err) {
        console.log(err);
        const categoryList = document.querySelector(".news-list");
        categoryList.innerHTML = `
        <div class="col-12 text-center">
            <h3>Sorry, we couldn't load the news</h3>
            <p>Please try again later</p>
        </div>`;
    }
}

main();