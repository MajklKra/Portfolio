
console.log("Hello World Loser !");


// function showCards(index)
// {
//     const track = document.querySelector("#cards-track");
//     const dots = document.querySelectorAll(".card-dot");

//     const cardWidth = 329; // 309px karta + 20px gap

//     track.style.transform = `translateX(-${index * cardWidth}px)`;

//     dots.forEach((dot, i) =>
//     {
//         dot.classList.toggle("active", i === index);
//     });
// }


/* Supabase Configuration */ 


/* Supabase Configuration */

const SUPABASE_URL = "https://tprocedevoczqsqpouyt.supabase.co";

const SUPABASE_KEY = "sb_publishable_VRXNBw9P3ffpHWEissyqpw_YvKulR1n";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

async function loadCards()
{
    const { data, error } = await supabaseClient
        .from("cards")
        .select("id, likes");

    if (error)
    {
        console.error("Chyba při načítání:", error);
        return;
    }

    console.log("Data ze Supabase:", data);

    data.forEach(card =>
    {
        const likesElement = document.querySelector(
            `.card-likes[data-card-id="${card.id}"] .card-likescount`
        );

        if (likesElement)
        {
            likesElement.textContent = card.likes;
        }
    });
}

loadCards();

document.querySelectorAll(".card-likes").forEach(likeButton => {

    likeButton.addEventListener("click", async () => {

        const cardId = Number(likeButton.dataset.cardId);

        const { data, error } = await supabaseClient.rpc(
            "increment_card_like",
            {
                card_id: cardId
            }
        );

        if (error) {
            console.error("Chyba při přidávání lajku:", error);
            return;
        }

        const likesCount =
            likeButton.querySelector(".card-likescount");

        likesCount.textContent = data;

        console.log(`Karta ${cardId}: nový počet lajků = ${data}`);
    });

});

function showCards(index)
{
    const track = document.querySelector("#cards-track");
    const dots = document.querySelectorAll(".card-dot");
    const cards = document.querySelectorAll("#cards-track .card");

    const cardWidth = 329;

    track.style.transform = `translateX(-${index * cardWidth}px)`;

    dots.forEach((dot, i) =>
    {
        dot.classList.toggle("active", i === index);
    });

    // všem kartám nejdříve nastavíme výchozí směr doprava
    cards.forEach(card =>
    {
        card.classList.remove("details-left");
    });

    // 3. a 4. viditelná karta se otevřou doleva
    const thirdVisibleCard = index + 2;
    const fourthVisibleCard = index + 3;

    if (cards[thirdVisibleCard])
    {
        cards[thirdVisibleCard].classList.add("details-left");
    }

    if (cards[fourthVisibleCard])
    {
        cards[fourthVisibleCard].classList.add("details-left");
    }
}

showCards(0);

/* Galerie */


const images = document.querySelectorAll(".gallery img");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");

const closeButton = document.getElementById("lightboxClose");
const prevButton = document.getElementById("lightboxPrev");
const nextButton = document.getElementById("lightboxNext");

let currentIndex = 0;


// kliknutí na obrázek

images.forEach((image, index) => {

    image.addEventListener("click", () => {

        currentIndex = index;

        lightboxImage.src = image.src;

        lightbox.classList.add("active");

    });

});


// další obrázek

nextButton.addEventListener("click", () => {

    currentIndex++;

    if (currentIndex >= images.length) {
        currentIndex = 0;
    }

    lightboxImage.src = images[currentIndex].src;

});


// předchozí obrázek

prevButton.addEventListener("click", () => {

    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = images.length - 1;
    }

    lightboxImage.src = images[currentIndex].src;

});


// zavření

closeButton.addEventListener("click", () => {

    lightbox.classList.remove("active");

});


// zavření kliknutím na tmavé pozadí

lightbox.addEventListener("click", (event) => {

    if (event.target === lightbox) {
        lightbox.classList.remove("active");
    }

});


// ovládání klávesnicí

document.addEventListener("keydown", (event) => {

    if (!lightbox.classList.contains("active")) {
        return;
    }

    if (event.key === "Escape") {
        lightbox.classList.remove("active");
    }

    if (event.key === "ArrowRight") {
        nextButton.click();
    }

    if (event.key === "ArrowLeft") {
        prevButton.click();
    }

});