import { resolve } from "./resolve";
export function init() {
	const resolvedComponent = resolve();
	const component = resolvedComponent!.component;
	assert(resolvedComponent, "No component is currently rendering");
	assert(!component.hookRunning, "Hooks cannot be ran within a hook");

	const id = component.hookID++;

	return [id, resolvedComponent] as const;
}
