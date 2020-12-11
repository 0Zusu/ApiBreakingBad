if(navigator.serviceWorker){
    if(window.location.href.includes("localhost")){
        navigator.serviceWorker.register("/sw.js");
    } else{
        navigator.serviceWorker.register("/ApiRestBreakingBad/sw.js");
    }
}

window.mostrarPersonaje=function(){
    let mold= document.querySelector('.molde-personaje-sa').cloneNode(true);
    let persona=this.persona;
    mold.querySelector('.nombre-per').innerText=persona.name;
    mold.querySelector('.actor').innerText=persona.portrayed;
    mold.querySelector('.Estatus').innerText=persona.status;
    mold.querySelector('.imagen-actor').src=persona.img;
    Swal.fire({
        title: persona.name,
        html: mold.innerHTML
    });
};
window.mostrar=(personas)=>{
    const molde=document.querySelector(".molde-personaje");
    const contenedor=document.querySelector(".contenedor");
    for(let i=0;i<personas.length;i++){
        
        let c=personas[i];
        let ctrlc=molde.cloneNode(true);
        ctrlc.querySelector('.nombre-titulo').innerText=c.name;
        ctrlc.querySelector('.image-personaje').src=c.img;
        ctrlc.querySelector('.boton-personaje').persona=c;
        ctrlc.querySelector('.boton-personaje').addEventListener('click',window.mostrarPersonaje);
        contenedor.appendChild(ctrlc);
        
    }
};
window.addEventListener('DOMContentLoaded', async ()=>{
    let peticion = await axios.get("https://www.breakingbadapi.com/api/characters");
    let personas = peticion.data;
    window.mostrar(personas)
});