export default function scoreMenu(btn, tablero){
    
    const d = document;
    
    d.addEventListener("click", (e)=>{
        if(e.target.matches(btn) || e.target.matches(`${btn} *`)){
            document.querySelector(tablero).classList.toggle("is-active")
            document.querySelector(btn).classList.toggle("is-active")
        }
    })
}