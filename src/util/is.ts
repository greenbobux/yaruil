import { customComponent, elementLike } from "./types";
import { $terrify } from "rbxts-transformer-t";
import { Component } from "../component";

export const isElement = $terrify<{
	component: string;
}>();
export function isComponent(component: elementLike): component is customComponent {
	return "component" in component ? component.component instanceof Component : false;
}
