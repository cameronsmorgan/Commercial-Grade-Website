let btns = document.querySelectorAll('.nav-btn');
let slides = document.querySelectorAll('.video-slider');
let contents = document.querySelectorAll('.content');



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

    btns[manual].classList.add('active');
    slides[manual].classList.add('active');
    contents[manual].classList.add('active');

}

btns.forEach((btn, i) =>{
    btn.addEventListener('click', () =>{
        sliderNav(i)
    });
});