import generateColor from '../helpers/generateColors.js';
import Observer, { EVENTS } from '../Observer.js';
import BoxCreator from './BoxCreator.js';

class Box extends BoxCreator {
	constructor({width, height, last}) {
		super({width, height, color: generateColor()});

		this.last = last;
		const lastHeight = last.geometry.parameters.height / 2;
		const thisHeight = this.geometry.parameters.height / 2;
		this.position.y = last.position.y + lastHeight + thisHeight;
		
		this.maxPosition = 360;
		this.isStopped = false;
		this.direction = 1;
		this.velocity = 4;
		this.currentAxis = (Math.random() >= 0.5) ? 'x' : 'z';
		this.invertedAxis = (this.currentAxis === 'x') ? 'z': 'x';
		this.position[this.currentAxis] -= this.maxPosition * this.direction;
		this.position[this.invertedAxis] = last.position[this.invertedAxis];

	}

	place() {
		const plane = (this.currentAxis ==='x') ? 'width' : 'height';
		const distanceCenter = this.position[this.currentAxis] - this.last.position[this.currentAxis];
		const overlay = this.last.dimension[plane] - Math.abs(distanceCenter);
		
		if (overlay > 0) {
			const cut = this.last.dimension[plane] - overlay;
			const newBox = {
				base: {
					width: (plane === 'width') ? overlay: this.dimension.width,
					height: (plane === 'height') ? overlay: this.dimension.height,
				},
				cut: {
					width: (plane === 'width') ? cut: this.dimension.width,
					height: (plane === 'height') ? cut: this.dimension.height,
				},
				color: this.color,
				axis: this.currentAxis,
				lastPosition: this.position,
				direction: distanceCenter / Math.abs(distanceCenter) | 1
			}
			Observer.emit(EVENTS.STACK, newBox);
		} else {
			Observer.emit(EVENTS.GAME_OVER);
		}
	}

	update() {
		if(!this.isStopped) {
			this.position[this.currentAxis] += this.direction * this.velocity;
			if (Math.abs(this.position[this.currentAxis]) >= this.maxPosition) {
				this.direction *= -1;
			}
		}
	}
}

export default Box;