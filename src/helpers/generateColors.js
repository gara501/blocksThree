let colorIndex = 0;
const generateColor = () => {
	const colors = [
		0x1abc9c,
		0x3a10b7,
		0xe5d474,
		0x27b9fd,
		0xbab96c,
		0x46e6bc,
		0xa9ce77,
		0x26c6ec,
		0x04319d,
		0xbe148e,
		0xd24c29,
		0xbaf5b0,
		0x39e895
	];
	colorIndex++;
	return colors[colorIndex%colors.length];
}

export default generateColor;