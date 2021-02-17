import { Mesh, MeshStandardMaterial, Color, BoxBufferGeometry } from 'three';

class BoxCreator extends Mesh {
	constructor({width, height, alt= 40, color}) {
		super();

		this.geometry = new BoxBufferGeometry(width, alt, height);
		this.material = new MeshStandardMaterial({
			color,
			flatShading: true,
			roughness: .15
		});
		this.material.color.convertSRGBToLinear();
		this.color = color;
		this.dimension = {width, height};
	}
}

export default BoxCreator;