
const enum Key {
	A, B, C, D, E, F, G, H, I, J, K, L, M,
	N, O, P, Q, R, S, T, U, V, W, X, Y, Z,
	Zero, One, Two, Three, Four, Five, Six, Seven, Eight, Nine,
	UpArrow, DownArrow, LeftArrow, RightArrow,
	Delete, Backspace, Enter, Shift, Space,
	Esc
}

const KeyMapping: { [index: string]: Key } = {};
KeyMapping["a"] = Key.A;
KeyMapping["b"] = Key.B;
KeyMapping["c"] = Key.C;
KeyMapping["d"] = Key.D;
KeyMapping["e"] = Key.E;
KeyMapping["f"] = Key.F;
KeyMapping["g"] = Key.G;
KeyMapping["h"] = Key.H;
KeyMapping["i"] = Key.I;
KeyMapping["j"] = Key.J;
KeyMapping["k"] = Key.K;
KeyMapping["l"] = Key.L;
KeyMapping["m"] = Key.M;
KeyMapping["n"] = Key.N;
KeyMapping["o"] = Key.O;
KeyMapping["p"] = Key.P;
KeyMapping["q"] = Key.Q;
KeyMapping["r"] = Key.R;
KeyMapping["s"] = Key.S;
KeyMapping["t"] = Key.T;
KeyMapping["u"] = Key.U;
KeyMapping["v"] = Key.V;
KeyMapping["w"] = Key.W;
KeyMapping["x"] = Key.X;
KeyMapping["y"] = Key.Y;
KeyMapping["z"] = Key.Z;
KeyMapping["0"] = Key.Zero;
KeyMapping["1"] = Key.One;
KeyMapping["2"] = Key.Two;
KeyMapping["3"] = Key.Three;
KeyMapping["4"] = Key.Four;
KeyMapping["5"] = Key.Five;
KeyMapping["6"] = Key.Six;
KeyMapping["7"] = Key.Seven;
KeyMapping["8"] = Key.Eight;
KeyMapping["9"] = Key.Nine;
KeyMapping["ArrowUp"] = Key.UpArrow;
KeyMapping["ArrowDown"] = Key.DownArrow;
KeyMapping["ArrowLeft"] = Key.LeftArrow;
KeyMapping["ArrowRight"] = Key.RightArrow;
KeyMapping["Delete"] = Key.Delete;
KeyMapping["Backspace"] = Key.Backspace;
KeyMapping["Enter"] = Key.Enter;
KeyMapping["Shift"] = Key.Shift;
KeyMapping[" "] = Key.Space;
KeyMapping["Escape"] = Key.Esc;

type IKeyboard = {
	isPressed: (key: Key) => boolean
};

export { Key, KeyMapping, IKeyboard };
