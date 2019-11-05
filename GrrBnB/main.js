
const updatePrice = (ev) => {
    ev.target.classList.remove('price');
    let p = ev.target.value;
    ev.target.setAttribute('data-price', p); 
    setTimeout( (e)=>{
        e.target.classList.add('price');
        console.log(e.target.value);
        console.log(ev.target.getAttribute('data-price'));
    }, 10, ev);
}
let min = document.getElementById('min');
let max = document.getElementById('max');
min.addEventListener('change', updatePrice);
max.addEventListener('change', updatePrice);
