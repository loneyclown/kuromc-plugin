import _ from "lodash";

export default class MyMap<T = any> {
	map: Map<string, T> = new Map();
	key: string = "";

	constructor(list: T[] = [], key = "id") {
		this.map = new Map(list.map((item: any) => [item[key], item]));
		this.key = key;
	}

	get size() {
		return this.map.size;
	}

	get array() {
		const arr: T[] = [];
		for (const iterator of this.map.values()) {
			arr.push(iterator);
		}
		return arr;
	}

	get first() {
		return [...this.map][0]?.[1];
	}

	set(key: string, value: T) {
		this.map.set(key, value);
	}

	get(key: string) {
		return this.map.get(key);
	}

	values() {
		return this.map.values();
	}

	concat(map: MyMap) {
		for (const iterator of map.values()) {
			this.map.set((iterator as any)[this.key], iterator);
		}
		return this;
	}

	delete(key: string) {
		this.map.delete(key);
		return this;
	}

	根据某个属性值统计(field: string, value: any) {
		let count = 0;
		for (const iterator of this.map.values()) {
			const v = (iterator as any)[field];
			if (v && v == value) {
				count++;
			}
		}
		return count;
	}
}
