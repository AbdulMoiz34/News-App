const API_KEY = "cdbe0365d06a4a0f91f9f6ae0e018036";
function animateElement(selector, options) {
    gsap.from(selector, {
        duration: 1,
        opacity: 0,
        ease: "power2.out",
        ...options
    });
}

animateElement(".navbar", { y: -50 });
animateElement(".nav-item", { y: -20, stagger: 0.2 });

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
    for (let category of categories) {
        categoryList.innerHTML += `<a target="_blank" href="${category.url}" class="col-md-4 mb-4 text-decoration-none text-black">
                    <div class="card p-4 shadow rounded">  
                        <img src="${category.urlToImage}" alt="image">
                        <h4 class="mt-3">${category.title}</h4>
                        <p>${category.description}</p>
                    </div>
                </a>`;
    }
}

const main = async () => {
    const loader = document.getElementById("loader-box");
    loader.classList.remove("d-none");
    const query = getQuaryParams();
    try {
        const news = await getNewsFromCategory(query);
        displayCatgories(query, news.articles);
    } catch (err) {
        console.log(err);
    }
    loader.classList.add("d-none");
}

main();


