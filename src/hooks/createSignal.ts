import { scheduleRender } from ".";
import { Component } from "../component";
import { Renderer } from "../renderer";
import { evalulate } from "../util/evalulate";
import { customComponent } from "../util/types";
import { init } from "./util";
import { resolve } from "./util/resolve";

/*@internal*/

function internalSignal<T>(initialValue: T) {
	const [id, resolvedComponent] = init();
	const { component } = resolvedComponent;
	const value: T = (component.state.get(id) as T) || initialValue;
	component.state.set(id, value);
	function dispatch(newValue: T) {
		assert(resolvedComponent !== undefined, "No component is currently rendering");
		const oldValue = component.state.get(id);
		component.state.set(id, newValue);
		Renderer.updateNode(resolvedComponent);
	}
	return [
		() => {
			return component.state.get(id) as T;
		},
		dispatch,
	] as returnedSignal<T>;
}
export function externalSignal<T>(initialValue: T) {
	print("is external");
	let _value: T = initialValue;
	const dependencies: customComponent[] = [];
	return [
		/** @description Gets the value, if its used inside of a component,
		 * and that component isn't in the depdencies array, it will be added to it */
		() => {
			const resolvedComponent = resolve();
			if (resolvedComponent) {
				if (!dependencies.includes(resolvedComponent)) {
					dependencies.push(resolvedComponent);
					Renderer.updateNode(resolvedComponent);
				}
			}
			return _value;
		},
		/** @description sets the value and updates any dependencies */
		(value: T) => {
			dependencies.forEach((component) => {
				Renderer.updateNode(component);
			});
			return (_value = value);
		},
		/** @description Registers a dependency */
		(component?: customComponent) => {
			const resolvedComponent = resolve() || component;
			if (resolvedComponent) {
				dependencies.push(resolvedComponent);
			}
		},
	] as const;
}
export function createSignal<T>(initialValue: T) {
	const dispatcher = resolve();
	assert(dispatcher, "Signal is used outside of a component");

	return internalSignal(initialValue);
}
export type returnedSignal<T> = [() => T, (value: T) => T];
