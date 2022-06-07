import { customComponent, elementLike } from "./types";
import { t } from "@rbxts/t";
import { Component } from "../component";

export const isElement = t.interface({
	component: t.string,
});
export function isComponent(component: elementLike): component is customComponent {
	return "component" in component ? component.component instanceof Component : false;
}
