import { Component } from "../component";
import { customComponent } from "../util/types";
import { resolve } from "./util/resolve";
export function scheduleRender(node: customComponent) {
	node.component.updateScheduled = true;
}
export function runHook(hook: Callback) {
	const component = resolve()?.component;
	assert(component, "No component is currently rendering");
	component.hookRunning = true;
	hook();
	component.hookRunning = false;
}
