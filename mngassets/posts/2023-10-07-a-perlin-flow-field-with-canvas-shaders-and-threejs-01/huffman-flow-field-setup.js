let paramsFigure = {
	rendererFunc: ()=>{return new THREE.WebGLRenderer({ alpha: true })},
	container: null,
	baseCanvas: null,
	baseContext: null,
	perlinCanvas: null,
	perlinContext: null,
	perlinImageData: null,
	width: 10,
	height: 200,
	circle: {
		x: null,
		y: null,
		r: null
	},

	startTime : new Date().getTime(),
	hairs: []
}
	

class Hair {
	constructor(){
		let r = 2 * Math.PI * Math.random(),
			d = Math.sqrt(Math.random())

		this.position = {
			x: Math.floor(paramsFigure.circle.x + Math.cos(r) * d * paramsFigure.circle.r),
			y: Math.floor(paramsFigure.circle.y + Math.sin(r) * d * paramsFigure.circle.r)
		}
		
		this.length = Math.floor(Math.random() * 10) + 10;
		paramsFigure.hairs.push(this);
	}
	
	draw(){
			let { position, length } = this,
			{ x, y } = position,
			i = (y * paramsFigure.width + x) * 4,
			d = paramsFigure.perlinImgData.data,
			noise = d[i],
			angle = (noise / 255) * Math.PI
			//console.log(position, length);
			//console.log(i, d, noise, angle);
			//console.log(paramsFigure.baseContext)
		paramsFigure.baseContext.moveTo(x, y);
		paramsFigure.baseContext.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
	}
}

export {paramsFigure}
export {Hair}