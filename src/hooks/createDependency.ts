import { checkExternalSignal } from "./externalSignal";
import { externalSignal } from "./externalSignal";
import { init } from "./util";
import { returnedSignal } from "./createSignal";
type withExternalSignal<T> = T extends externalSignal<infer U> ? returnedSignal<U> : never;
export function createDependency<T>(dependency: T): withExternalSignal<T> {
	const [id, resolvedComponent] = init();
	const { component } = resolvedComponent;

	if (checkExternalSignal(dependency)) {
		const isRegistered = component.state.get(id);
		if (!isRegistered) {
			component.state.set(id, dependency.register(resolvedComponent));
		}
		return [() => dependency.get(), (value: T) => dependency.set(value)] as never;
	}
	// bypass ending return statement
	return undefined as never;
}
