console.log('loaded');

const root = "/Commercial-Grade-Website"; // folder name

const menuItems = [
    { name: "Home", href: `${root}/index.html` },
    {
        name: "Design", 
        href: `${root}/Design/index.html`,
        subItems: [
            { name: "Wireframes", href: `${root}/Design/wireframe.html` },
            { name: "UI/UX Theory", href: `${root}/Design/ui-ux-theory.html` },
            { name: "Style Guide", href: `${root}/Design/style-guide.html` }

        ]
    },
    {
        name: "Theory", 
        href: `${root}/Theory/index.html`,
        subItems: [
            { name: "Essay 1", href: `${root}/Theory/essay.html` },
            { name: "Essay 2", href: `${root}/Theory/essay2.html` },
            { name: "Theory", href: `${root}/Theory/theory.html` }

        ]
    },
    {   name: "DataViz", 
        href: `${root}/DataViz/index.html`,
        subItems:[
            {name: "Bubble Chart", href: `${root}/DataViz/data-viz1.html`},
            {name: "Color Chart", href: `${root}/DataViz/data-viz2.html`},
            {name: "Radar Chart", href: `${root}/DataViz/data-viz3.html`}

        ]
    },
    { name: "Memories", href: `${root}/Memories/memories.html` },
    { name: "Sign Up", href: `${root}/form.html` }
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

        /*-->Dropdown functionality
        --> if a menu item has subitems: a new ul element and adds dropdown class
        --> iterates over each subitem and creates a li and a tag for each
        --> subitems are added to dropdown ul*/
        if (menuItem.subItems) {
            const dropdown = document.createElement("ul");
            dropdown.classList.add("dropdown");

            menuItem.subItems.forEach(subItem => {
                const subLi = document.createElement("li");
                const subA = document.createElement("a");
                subA.innerText = subItem.name;
                subA.setAttribute("href", subItem.href);
                subLi.appendChild(subA);
                dropdown.appendChild(subLi);
            });

            li.classList.add("has-dropdown");
            li.appendChild(dropdown);
        }
        ul.appendChild(li); 
    }

    nav.appendChild(ul); 
}

window.addEventListener("scroll", function(){
    let header = document.querySelector("header");
    header.classList.toggle("sticky", window.scrollY > 0);  //window.scrollY checks if scrolled down
});

