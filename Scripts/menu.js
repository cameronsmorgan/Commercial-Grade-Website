console.log('loaded');

const root = "/Commercial-Grade-Website"; // Ensure this matches the folder name

const menuItems = [
    {name: "Home", href: root + "/index.html"},
    {name: "Design", href:`${root}/Design/index.html`},
    {name: "Theory", href:`${root}/Theory/index.html`},
    {name: "DataViz", href:`${root}/DataViz/index.html`},
    {name: "Memories", href:`${root}/Memories/memories.html`},
];

export function initialise(currentPage) {
    console.log("worked");

    const nav = document.querySelector("header > nav"); // Ensure there's a <nav> inside <header> in the HTML
    const ul = document.createElement("ul");

    for (let menuItem of menuItems) {
        const li = document.createElement("li");

        const a = document.createElement("a");
        a.innerText = menuItem.name;
        a.setAttribute("href", menuItem.href);

        if (currentPage === menuItem.name) {
            // Add 'active' class if it's the current page
            li.classList.add("active");
            a.classList.add("active");
        }

        li.appendChild(a); // Append the link to the list item
        ul.appendChild(li); // Append the list item to the <ul>
    }

    nav.appendChild(ul); // Append the generated <ul> to the <nav>
}

window.addEventListener("scroll", function(){
    let header = document.querySelector("header");
    header.classList.toggle("sticky", window.scrollY > 0);
});

