import Object from "@rbxts/object-utils";
import { Component, FC } from "./component";
import { childrenLike, elementLike, PropertyKey, propertyLike } from "./util/types";

export const createElement = <T extends string | FC>(
	component: T,
	props: { [key: PropertyKey]: propertyLike },
	children: childrenLike,
): elementLike => {
	assert(component !== undefined, "`component` is required");
	const propsWithChildren = Object.assign(
		{
			children,
		},
		props,
	) as elementLike["props"];
	return {
		component: (typeIs(component, "function") ? Component.init(component) : component) as never,
		props: propsWithChildren,
	};
};
