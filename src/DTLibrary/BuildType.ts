
const enum BuildType {
	/*
		A standalone web build (i.e. not embedded within a larger web page)

		e.g. the game is published on its own page using GitLab Pages
	*/
	WebStandalone,

	/*
		The game is embedded within a larger web page

		e.g. the game is embedded in an iframe running on itch.io
	*/
	WebEmbedded,

	/*
		The game is published as a desktop application using Electron
	*/
	Electron
}

export { BuildType };
