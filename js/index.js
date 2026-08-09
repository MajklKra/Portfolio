
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