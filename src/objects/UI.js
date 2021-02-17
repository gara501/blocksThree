import Observer, { EVENTS } from "../Observer";

class UI {
	constructor() {
		this.points = document.getElementById('points');
		this.buttonStart = document.getElementById('button-start');
		this.gameOver = document.getElementById('gameover');
		this.events();
	}

	events() {

		this.buttonStart.addEventListener('click', (e) => {
			Observer.emit(EVENTS.START);
		});

		Observer.on(EVENTS.NEW_GAME, () => {
			this.buttonStart.style.top = '30%';
			this.buttonStart.classList.add('animate__fadeInDown');
		});

		Observer.on(EVENTS.START, () => {
			this.buttonStart.classList.add('animate__fadeOutUp');
			this.points.style.top = '30%';
			this.points.classList.add('animate__fadeInDown');

			this.gameOver.classList.add('animate__fadeOutDown');
		});

		Observer.on(EVENTS.UPDATE_POINTS, (points) => {
			this.points.innerHTML = points;
		});

		Observer.on(EVENTS.GAME_OVER, () => {
			this.points.style.top = '25%';
			this.gameOver.style.top = '35%';
			this.gameOver.classList.remove('animate__fadeOutDown');
			this.gameOver.classList.add('animate__fadeInUp');

		});
	}
}

export default UI;