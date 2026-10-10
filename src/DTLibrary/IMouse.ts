
type IMouse = {
	isLeftMouseButtonPressed: () => boolean,
	isRightMouseButtonPressed: () => boolean,
	getX: () => number,
	getY: () => number
};

export { IMouse };
