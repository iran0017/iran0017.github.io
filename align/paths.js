document.addEventListener('DOMContentLoaded', (ev) => {
  let main = document.querySelector('main');
  let p = document.createElement('p');
  p.classList.add('notice');
  p.textContent = 'The script has successfully run!'.toUpperCase();
  main.insertAdjacentElement('afterbegin', p);
});