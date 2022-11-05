// variables
const copyBtn = document.querySelector('.copy-btn');

/**
 * Click profile(currnet) link on click func
 */
if(copyBtn){
    copyBtn.addEventListener("click",()=>{
        window.navigator.clipboard.writeText(window.location.href);
        copyBtn.innerHTML = "<h4>Copied!</h4>"
    }
    )
}