const btns = document.querySelectorAll('.nav-btn');
const slides = document.querySelectorAll('.video-slider');
const contents = document.querySelectorAll('.content');

//function controls the slide nav by removing and adding the active class 

let sliderNav = function(manual){
    btns.forEach((btn)=>{
        btn.classList.remove('active')
    })

    slides.forEach((slide)=>{
        slide.classList.remove('active')
    })

    contents.forEach((content)=>{
        content.classList.remove('active')
    })

    btns[manual].classList.add('active');   //adds active class to the index specified
    slides[manual].classList.add('active');
    contents[manual].classList.add('active');

}

/* loops through each btn in the list and passes the current btn and index */
btns.forEach((btn, i) =>{
    btn.addEventListener('click', () =>{
        sliderNav(i)
    });
});