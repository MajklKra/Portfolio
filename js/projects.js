

console.log("projects.js loaded");

document.addEventListener("mousemove", (e) => 
{
    document.body.style.setProperty("--mouse-x", `${e.clientX}px`);
    document.body.style.setProperty("--mouse-y", `${e.clientY}px`);
});