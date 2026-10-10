
let getByteListBuilder = function () {

	let byteList: number[] = [];

	let toByteList = function (): number[] {
		return [...byteList];
	};

	let addBool = function (b: boolean) {
		byteList.push(b ? 1 : 0);
	};

	let addNullableBool = function (b: boolean | null) {
		if (b === null)
			byteList.push(2);
		else
			byteList.push(b ? 1 : 0);
	};

	let addByte = function (b: number) {
		byteList.push(b);
	};

	let addInt = function (i: number) {
		byteList.push(i & 0xff);
		byteList.push((i >> 8) & 0xff);
		byteList.push((i >> 16) & 0xff);
		byteList.push((i >> 24) & 0xff);
	};

	let addNullableInt = function (i: number | null) {
		if (i === null) {
			byteList.push(0);
		} else {
			byteList.push(1);
			addInt(i);
		}
	};

	let addString = function (s: string) {
		addInt(s.length);
		for (let i = 0; i < s.length; i++)
			addInt(s.charCodeAt(i));
	};

	let addBoolList = function (list: boolean[]) {
		addInt(list.length);

		for (let b of list) {
			addBool(b);
		}
	};

	let addNullableBoolList = function (list: (boolean | null)[]) {
		addInt(list.length);

		for (let b of list) {
			addNullableBool(b);
		}
	};

	let addByteList = function (list: number[]) {
		addInt(list.length);

		for (let b of list) {
			addByte(b);
		}
	};

	let addIntList = function (list: number[]) {
		addInt(list.length);

		for (let i of list) {
			addInt(i);
		}
	};

	let addNullableIntList = function (list: (number | null)[]) {
		addInt(list.length);

		for (let i of list) {
			addNullableInt(i);
		}
	};

	return {
		toByteList,
		addBool,
		addNullableBool,
		addByte,
		addInt,
		addNullableInt,
		addString,
		addBoolList,
		addNullableBoolList,
		addByteList,
		addIntList,
		addNullableIntList
	};
};

let getByteListIterator = function (bytes: number[]) {

	let byteList = [...bytes];
	let index = 0;

	let hasNextByte = function () {
		return index < byteList.length;
	};

	let popBool = function (): boolean {
		let value = byteList[index++];

		if (value === 0)
			return false;

		if (value === 1)
			return true;

		throw new Error("Unrecognized value");
	};

	let popNullableBool = function (): boolean | null {
		let value = byteList[index++];

		if (value === 0)
			return false;

		if (value === 1)
			return true;

		if (value === 2)
			return null;

		throw new Error("Unrecognized value");
	};

	let popByte = function (): number {
		let b = byteList[index++]!;

		return b;
	};

	let popInt = function (): number {
		let x1 = byteList[index++]!;
		let x2 = byteList[index++]!;
		let x3 = byteList[index++]!;
		let x4 = byteList[index++]!;

		return x1 | (x2 << 8) | (x3 << 16) | (x4 << 24);
	};

	let popNullableInt = function (): number | null {
		let value = byteList[index++];

		if (value === 0)
			return null;

		if (value !== 1)
			throw new Error("Unrecognized value");

		return popInt();
	};

	let popString = function (): string {
		let length = popInt();
		let str = "";
		for (let i = 0; i < length; i++) {
			str += String.fromCharCode(popInt());
		}

		return str;
	};

	let popBoolList = function (): boolean[] {
		let length = popInt();

		let array = [];

		for (let i = 0; i < length; i++) {
			array.push(popBool());
		}

		return array;
	};

	let popNullableBoolList = function (): (boolean | null)[] {
		let length = popInt();

		let array = [];

		for (let i = 0; i < length; i++) {
			array.push(popNullableBool());
		}

		return array;
	};

	let popByteList = function (): number[] {
		let length = popInt();

		let array = [];

		for (let i = 0; i < length; i++) {
			array.push(popByte());
		}

		return array;
	};

	let popIntList = function (): number[] {
		let length = popInt();

		let array = [];

		for (let i = 0; i < length; i++) {
			array.push(popInt());
		}

		return array;
	};

	let popNullableIntList = function (): (number | null)[] {
		let length = popInt();

		let array = [];

		for (let i = 0; i < length; i++) {
			array.push(popNullableInt());
		}

		return array;
	};

	return {
		hasNextByte,
		popBool,
		popNullableBool,
		popByte,
		popInt,
		popNullableInt,
		popString,
		popBoolList,
		popNullableBoolList,
		popByteList,
		popIntList,
		popNullableIntList
	};
};

export {
	getByteListBuilder,
	getByteListIterator
};
