import { Component, FC } from "../component";
export type elementLike = intrinsicElement | customComponent;
export type PropertyKey = string | symbol | number;
export type propertyLike = unknown | (() => unknown);
export type childrenLike = Array<elementLike | undefined>;
export type intrinsicElement = {
	component: string;
	props: { [key: PropertyKey]: propertyLike } & {
		children: childrenLike;
	};
};

export type customComponent = {
	component: Component;
	props: { [key: PropertyKey]: propertyLike } & {
		children: childrenLike;
	};
};
