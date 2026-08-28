
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

const description = document.getElementById("lightboxDescription");

images.forEach((image, index) => {

    image.addEventListener("click", () => {

        currentIndex = index;

        showImage(currentIndex);

        lightbox.classList.add("active");

    });

});


nextButton.addEventListener("click", () => {

    currentIndex++;

    if (currentIndex >= images.length) {
        currentIndex = 0;
    }

    showImage(currentIndex);
});


prevButton.addEventListener("click", () => {

    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = images.length - 1;
    }

    showImage(currentIndex);
});


// zavření

closeButton.addEventListener("click", () => {

    setZoom(1);
    lightbox.classList.remove("active");

});


// zavření kliknutím na tmavé pozadí

// lightbox.addEventListener("click", (event) => {

//     if (event.target === lightbox) {

//         setZoom(1);
//         lightbox.classList.remove("active");

//     }

// });


// ovládání klávesnicí

document.addEventListener("keydown", (event) => {

    if (!lightbox.classList.contains("active")) {
        return;
    }

    if (event.key === "Escape") 
    {
        setZoom(1);
        lightbox.classList.remove("active");
    }

    if (event.key === "ArrowRight") {
        nextButton.click();
    }

    if (event.key === "ArrowLeft") {
        prevButton.click();
    }

});

function showImage(index) 
{
    lightboxImage.src = images[index].src;
    description.textContent = images[index].dataset.description;

    setZoom(1);
}

/* Zoom instrukce*/


const zoomInButton = document.getElementById("zoomIn");
const zoomOutButton = document.getElementById("zoomOut");
const zoomResetButton = document.getElementById("zoomReset");

let zoom = 1;

let posX = 0;
let posY = 0;

function updateImageTransform()
{
    lightboxImage.style.transform =
        `translate(${posX}px, ${posY}px) scale(${zoom})`;
}

function setZoom(value)
{
    zoom = Math.min(Math.max(value, 0.5), 4);

    if (zoom <= 1)
    {
        posX = 0;
        posY = 0;

        lightboxImage.style.cursor = "default";
    }
    else
    {
        lightboxImage.style.cursor = "grab";
    }

    updateImageTransform();

    zoomResetButton.textContent = `${Math.round(zoom * 100)} %`;
}

zoomInButton.addEventListener("click", () => {
    setZoom(zoom + 0.25);
});

zoomOutButton.addEventListener("click", () => {
    setZoom(zoom - 0.25);
});

zoomResetButton.addEventListener("click", () => {
    setZoom(1);
});

lightboxImage.addEventListener("wheel", (event) => {

    event.preventDefault();

    if (event.deltaY < 0) {
        setZoom(zoom + 0.1);
    } else {
        setZoom(zoom - 0.1);
    }

});

let isDragging = false;

let startX = 0;
let startY = 0;

let startPosX = 0;
let startPosY = 0;


lightboxImage.addEventListener("mousedown", (event) =>
{
    if (zoom <= 1)
    {
        return;
    }

    isDragging = true;

    startX = event.clientX;
    startY = event.clientY;

    startPosX = posX;
    startPosY = posY;

    lightboxImage.style.cursor = "grabbing";

    event.preventDefault();
});


document.addEventListener("mousemove", (event) =>
{
    if (!isDragging)
    {
        return;
    }

    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    posX = startPosX + deltaX;
    posY = startPosY + deltaY;

    updateImageTransform();
});


document.addEventListener("mouseup", () =>
{
    if (!isDragging)
    {
        return;
    }

    isDragging = false;

    lightboxImage.style.cursor =
        zoom > 1 ? "grab" : "default";
});

/*  Formular */

const guestbookOpen = document.getElementById("guestbookOpen");
const guestbookModal = document.getElementById("guestbookModal");
const guestbookClose = document.getElementById("guestbookClose");
const guestbookForm = document.getElementById("guestbookForm");

guestbookOpen.addEventListener("click", () => {
    guestbookModal.classList.add("active");
});

guestbookClose.addEventListener("click", () => {
    guestbookModal.classList.remove("active");
});

guestbookForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const name = document.getElementById("guestName").value.trim();
    const email = document.getElementById("guestEmail").value.trim();
    const message = document.getElementById("guestMessage").value.trim();

    const { error } = await supabaseClient
        .from("guestbook")
        .insert([
            {
                name: name,
                email: email,
                message: message
            }
        ]);

    if (error) {
        console.error("Chyba při ukládání:", error);
        return;
    }

    guestbookForm.reset();
    guestbookModal.classList.remove("active");

    loadGuestbook();

});


/* Výpis příspěvků */


async function loadGuestbook() 
{

    const { data, error } = await supabaseClient .from("guestbook").select("id, name, message, created_at").order("created_at", { ascending: false });

    if (error) 
    {
        console.error("Chyba při načítání knihy návštěv:", error);
        return;
    }


    const container = document.getElementById("guestbookEntries");

    container.innerHTML = "";

    data.forEach(entry => {

        const card = document.createElement("div");
        card.classList.add("guestbookEntry");

        const name = document.createElement("h3");
        name.textContent = entry.name;

        const message = document.createElement("p");
        message.textContent = entry.message;

        const date = document.createElement("span");

        const formattedDate = new Date(entry.created_at)
            .toLocaleDateString("cs-CZ");

        date.textContent = formattedDate;

        card.appendChild(name);
        card.appendChild(date);
        card.appendChild(message);

        container.appendChild(card);
    });
}

loadGuestbook();