import { t } from "@rbxts/t";
import { Renderer } from "../renderer";
import { customComponent } from "../util/types";
import { resolve } from "./util/resolve";
export type externalSignal<T> = {
	readonly dependencies: customComponent[];
	readonly set: (this: externalSignal<T>, newValue: T) => void;
	readonly get: (this: externalSignal<T>) => T;
	readonly register: (this: externalSignal<T>, component: customComponent) => number | undefined;
};
export const checkExternalSignal = t.interface({
	dependencies: t.array(t.any),
	set: t.callback,
	get: t.callback,
	register: t.callback,
}) as <T>(value: unknown) => value is externalSignal<T>;
export function externalSignal<T = never>(initialValue: T): externalSignal<T> {
	let value: T = initialValue;
	return {
		dependencies: [] as customComponent[],
		set(newValue: T) {
			value = newValue;

			this.dependencies.forEach((component) => {
				Renderer.updateNode(component);
			});
		},
		get() {
			return value;
		},
		register(component: customComponent) {
			if (!this.dependencies.includes(component)) {
				return this.dependencies.push(component);
			}
		},
	};
}
