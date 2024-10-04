console.log('loaded');

const root = "/Commercial-Grade-Website"; // folder name

const menuItems = [
    {name: "Home", href: root + "/index.html"},
    {name: "Design", href:`${root}/Design/index.html`},
    {name: "Theory", href:`${root}/Theory/index.html`},
    {name: "DataViz", href:`${root}/DataViz/index.html`},
    {name: "Memories", href:`${root}/Memories/memories.html`},
];

/*export function is used so that the function can be used or accessed in other files. 
    this function builds the nav menu and highlights the current page*/

export function initialise(currentPage) {
    console.log("worked");

    const nav = document.querySelector("header > nav"); 
    const ul = document.createElement("ul");


    /*-->iterates through each menu item in the array of objects
      --> for each menu item a list and anchor element is created
      --> text of the anchor is set to the name property
      --> gives it a href link*/

    for (let menuItem of menuItems) {
        const li = document.createElement("li");

        const a = document.createElement("a");
        a.innerText = menuItem.name;
        a.setAttribute("href", menuItem.href);

        if (currentPage === menuItem.name) {
            
            li.classList.add("active");         //active class is added to the current page
            a.classList.add("active");
        }

        li.appendChild(a); 
        ul.appendChild(li); 
    }

    nav.appendChild(ul); 
}

window.addEventListener("scroll", function(){
    let header = document.querySelector("header");
    header.classList.toggle("sticky", window.scrollY > 0);  //window.scrollY checks if scrolled down
});

