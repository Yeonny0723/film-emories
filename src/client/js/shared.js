// variables
var menuBtn = document.querySelector('#menu-btn');
var nav = document.querySelector('.nav-links');
var main = document.querySelector('main');
const header = document.querySelector('header');
const goBackBtn = document.querySelector(".goBack")

/**
 * Showing menu on click func
 */
const showMenu = () => {
    nav.classList.add('fade-in');
    main.classList.add('inactive');   
}
/**
 * Hiding menu on click func
 */
const hideMenu = () => {
    nav.classList.remove('fade-in');
    main.classList.remove('inactive'); 
}

if(menuBtn){
    menuBtn.addEventListener("click", showMenu);
}
if(main){
    main.addEventListener("click", hideMenu);
}

/** Hide and show header on scroll */
var prevScrollpos = window.pageYOffset;
const scrollHeader = () => {
    var currentScrollPos = window.pageYOffset;
    // scroll down
    if (prevScrollpos > currentScrollPos) {
        document.querySelector("header").style.top = "0px";
    // scroll up
    } else {
        document.querySelector("header").style.top = "-100px";
    }
    prevScrollpos = currentScrollPos;
}
window.addEventListener("scroll", scrollHeader)


/**
 * Go back to previous page on click func
 */
if (window.location.pathname === "/"){
    goBackBtn.classList.add("hide");
}