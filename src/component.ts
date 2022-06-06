import { customComponent, elementLike, intrinsicElement } from "./util/types";

export type FC<P = {}> = (props: P) => elementLike;
/* @internal */
export class Component {
	static rendering: customComponent | undefined;
	static init(element: FC) {
		const component = new Component();
		component.element = element;
		return component;
	}

	static renderingDone() {
		Component.rendering = undefined;
	}
	static renderingStarted(node: customComponent) {
		Component.rendering = node;
	}
	static render(node: customComponent): elementLike {
		Component.renderingStarted(node);
		const rendered = node.component.element(node.props);
		Component.renderingDone();
		node.component.hookID = 0;
		if (node.component.updateScheduled) {
			node.component.updateScheduled = false;
			return Component.render(node);
		}
		return rendered;
	}
	private constructor() {}

	public hookID = 0;
	public state = new Map();

	// todo
	public updateScheduled = false;

	public hookRunning = false;
	public element!: FC;
}
type cell = {};
