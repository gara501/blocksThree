import { Scene, Color, DirectionalLight, HemisphereLight, Group, AxesHelper } from 'three';
import * as TWEEN from '@tweenjs/tween.js/dist/tween.umd';
import Box from '../objects/Box';
import BoxCreator from '../objects/BoxCreator';
import SlicesBox from '../objects/SlicesBox';
import UI from '../objects/UI';
import Observer, { EVENTS } from '../Observer';


class Scene1 extends Scene {
	constructor() {
		super();
		const userInterface = new UI();
		this.background = new Color('skyblue').convertSRGBToLinear();
		this.stackPoints = 0;
		this.gameOver = true;
		this.create();
		this.events();
	}

	create() {
		
		this.baseCube = new BoxCreator({
			width: 200,
			height: 200,
			alt: 200,
			color: 0x2c3e50
		});
		this.add(this.baseCube);

		//Groups
		this.boxesGroup = new Group();
		this.add(this.boxesGroup);

		// Lights
		const ambientLight = new HemisphereLight(0xffffbb, 0x080820, .5);
		const light = new DirectionalLight(0xffffff, 1.0);
		this.add(light, ambientLight);
	}

	newBox({width, height, last}) {
		console.log(last)
		const currentBox = new Box({
			width,
			height,
			last
		});

		this.boxesGroup.add(currentBox);
	}

	resetGroup() {
		this.boxesGroup.children.map((box, i) => {
			const tweenDestroy = new TWEEN.Tween(box.scale)
				.to({
					x: .5,
					y: .5,
					z: .5
				}, 80 * i)
				.easing(TWEEN.Easing.Quadratic.Out)
				.onComplete(() => {
					this.boxesGroup.remove(box);
				});
			tweenDestroy.start();
		})
	}

	events() {
		Observer.emit(EVENTS.NEW_GAME);
		Observer.on(EVENTS.CLICK, () => {
			if (this.gameOver) {
				Observer.emit(EVENTS.START);
			} else {
				this.getLastBox().place();
			}
			
		});

		Observer.on(EVENTS.START, () => {
			this.resetGroup();
			Observer.emit(EVENTS.UPDATE_POINTS, this.stackPoints);
			this.newBox({
				width: 200,
				height: 200,
				last: this.baseCube
			});
			this.gameOver = false;
			
		});

		Observer.on(EVENTS.STACK, (newBox) => {
			this.stackPoints++;
			Observer.emit(EVENTS.UPDATE_POINTS, this.stackPoints);
			// remove principal block
			this.boxesGroup.remove(this.getLastBox());

			// Space to cut the block
			const currentBaseCut = new SlicesBox(newBox);
			this.boxesGroup.add(currentBaseCut.getBase());
			this.add(currentBaseCut.getCut());

			// Effect cuted block
			const tweenCut = new TWEEN.Tween(currentBaseCut.getCut().position)
				.to({
					[newBox.axis]: currentBaseCut.getCut().position[newBox.axis] + (200 * newBox.direction)
				}, 500)
				.easing(TWEEN.Easing.Quadratic.Out);
			tweenCut.start();
			
			currentBaseCut.getCut().material.transparent = true;
			const tweenCutAlpha = new TWEEN.Tween(currentBaseCut.getCut().material)
				.to({
					opacity: 0,
				}, 600)
				.easing(TWEEN.Easing.Quadratic.Out)
				.onComplete(()=> {
					this.remove(currentBaseCut.getCut());
				});
			tweenCutAlpha.start();

			this.newBox({
				width: newBox.base.width,
				height: newBox.base.height,
				last: this.getLastBox()
			})
			

		});

		Observer.on(EVENTS.GAME_OVER, () => {
			if (!this.gameOver) {
				this.stackPoints = 0;
				const tweenGameOver = new TWEEN.Tween(this.getLastBox().position)
					.to({
						y: this.getLastBox().position.y + 300
					}, 1000)
					.easing(TWEEN.Easing.Bounce.Out);
				tweenGameOver.start();
			}
			this.gameOver = true;
		});
	}

	getLastBox() {
		return this.boxesGroup.children[this.boxesGroup.children.length-1];
	}

	update() {
		TWEEN.update();
		if (!this.gameOver) {
			this.getLastBox().update();
		}
		
	}
}

export default Scene1;
