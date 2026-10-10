
type BrowserLocalStorage = {
	setItem: (key: string, value: string) => void,
	getItem: (key: string) => string | null
};

export { BrowserLocalStorage };
