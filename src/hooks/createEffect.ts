import { resolve } from "./util/resolve";
import { init } from "./util";
import { runHook } from ".";
interface Effect {
	dep: unknown;
}
export function createEffect(effect: () => unknown, currentDependency: unknown = 0) {
	const [id, { component }] = init();
	component.state.set(id, component.state.get(id));
	const dep = component.state.get(id) as Effect;

	// eslint-disable-next-line roblox-ts/lua-truthiness
	if (dep !== currentDependency) {
		runHook(effect);
		component.state.set(id, currentDependency);
	}
}
