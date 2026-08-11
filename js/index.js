
console.log("Hello World Loser !");


function showCards(index)
{
    const track = document.querySelector("#cards-track");
    const dots = document.querySelectorAll(".card-dot");

    const cardWidth = 329; // 309px karta + 20px gap

    track.style.transform = `translateX(-${index * cardWidth}px)`;

    dots.forEach((dot, i) =>
    {
        dot.classList.toggle("active", i === index);
    });
}


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