// * Scroll * //
const textElement = document.getElementById('TextReveal');
const textContent = textElement.innerText;

textElement.innerHTML = textContent.split(' ').map(Word => {
  	return `<span class="Word">${Word}</span>`;
}).join(' ');

const Words = document.querySelectorAll('.Word');
const Scroll = document.getElementById('Scroll');

function handleScroll() {
  	if (!Scroll) return;

  	const ScrollTop = Scroll.getBoundingClientRect().top;
  	const windowHeight = window.innerHeight;
  	const scrollableHeight = Scroll.offsetHeight - windowHeight;

  	let percentage = -ScrollTop / scrollableHeight; percentage = Math.max(0, Math.min(1, percentage));

  	const WordsToReveal = Math.floor(percentage * Words.length);
  	Words.forEach((Word, index) => {
	    if (index < WordsToReveal) {Word.classList.add('Revealed');}
		else {Word.classList.remove('Revealed');}
  	});
}

window.addEventListener('scroll', handleScroll);
handleScroll();