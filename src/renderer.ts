import Object from "@rbxts/object-utils";
import { Component } from "./component";

import { evalulate } from "./util/evalulate";
import { isComponent, isElement } from "./util/is";
import { childrenLike, customComponent, intrinsicElement, elementLike, PropertyKey } from "./util/types.d";

type schema = {
	instance: string;
	children: schema[];
	props: { [key: PropertyKey]: unknown };
};
export namespace SchematicRenderer {
	export function toSchematic(element: intrinsicElement): schema {
		const { component, props } = element;
		const { children: elementChildren } = props;
		const children: schema["children"] = [];
		Object.entries(elementChildren).forEach(([key, child]) => {
			const rendered = Renderer.renderNode(child);
			children[key] = toSchematic(rendered);
		});
		const newProps: schema["props"] = {};
		Object.entries(props).forEach(([key, value]) => {
			if (key !== "children") {
				newProps[key] = value;
			}
		});
		return {
			instance: component,
			props: newProps,
			children,
		};
	}
	export function toInstance(schematic: schema) {
		const parent = new Instance(schematic.instance as keyof CreatableInstances);

		fillMissing(schematic, parent);
		return parent;
	}
	export function fillMissing(schematic: schema, parent: Instance) {
		applyProps(schematic, parent);
		children(schematic, parent);
	}
	export const connectionsOnInstance = new Map<Instance, RBXScriptConnection[]>();
	export function children(schematic: schema, instance: Instance) {
		Object.entries(schematic.children).forEach(([key, child]) => {
			const childInstance = instance.FindFirstChild(`${key}`);

			if (childInstance) {
				if (childInstance.ClassName !== child.instance) {
					toInstance(child).Parent = instance;
					childInstance.Destroy();
				} else {
					fillMissing(child, childInstance);
				}
			} else {
				const childInstance = toInstance(child);
				childInstance.Name = tostring(`${key}`);
				childInstance.Parent = instance;
			}
		});
	}
	export function applyProps(schematic: schema, instance: Instance) {
		const connections = connectionsOnInstance.get(instance) || [];

		connections.forEach((connection, i) => {
			connection.Disconnect();
			connections[i] = undefined as never;
		});

		const props = schematic.props;
		Object.entries(props).forEach(([key, value]) => {
			assert(key in instance, `${tostring(key)} is not a property of ${instance.Name}`);
			const prop = instance[key as never] as unknown;
			if (typeIs(prop, "RBXScriptSignal")) {
				assert(typeIs(value, "function"), `Property for ${tostring(key)} is not a function`);
				const connection = prop.Connect((...args: unknown[]) => {
					value(...args);
				});
				return connections.push(connection);
			}

			instance[key as never] = evalulate(value) as never;
		});

		connectionsOnInstance.set(instance, connections);
	}
}
export class Renderer {
	static componentIDs = 0;
	static componentsByID = new Map<number, customComponent>();
	static instances = new Map<elementLike, Instance>();
	static rootElementLike = new Array<elementLike>();
	// render methods
	static renderComponent(node: customComponent): intrinsicElement {
		const rendered = Renderer.renderNode(Component.render(node));
		if (isComponent(rendered)) {
			return Renderer.renderComponent(rendered);
		}
		return rendered;
	}
	static renderElement(node: intrinsicElement) {
		return node;
	}
	static renderNode(node: elementLike): intrinsicElement {
		const rendered = isComponent(node) ? Renderer.renderComponent(node) : Renderer.renderElement(node);
		return rendered;
	}

	// mounting methods
	static mountComponent(node: customComponent) {
		const componentID = Renderer.componentIDs++;
		Renderer.componentsByID.set(componentID, node);
		const rendered = Renderer.renderComponent(node);
		const instance = SchematicRenderer.toInstance(SchematicRenderer.toSchematic(rendered));

		return instance;
	}

	static mountElement(node: intrinsicElement) {
		const rendered = Renderer.renderElement(node);
		const instance = SchematicRenderer.toInstance(SchematicRenderer.toSchematic(rendered));
		return instance;
	}
	static mountNode(node: elementLike, into: Instance) {
		const instance = isComponent(node) ? Renderer.mountComponent(node) : Renderer.mountElement(node);
		const thisIndex = Renderer.rootElementLike.push(node) - 1;
		Renderer.instances.set(node, instance);
		instance.Parent = into;

		return () => {
			instance.Destroy();
			Renderer.rootElementLike.remove(thisIndex);
			Renderer.instances.delete(node);
		};
	}
	// updating methods
	static updateNode(node: elementLike) {
		const updated = isComponent(node) ? Renderer.updateComponent(node) : Renderer.updateElement(node);
		const instance = Renderer.instances.get(node);
		if (Renderer.rootElementLike.includes(node) && instance) {
			const schematic = SchematicRenderer.toSchematic(updated);
			SchematicRenderer.fillMissing(schematic, instance);
		}
	}
	static updateComponent(node: customComponent) {
		const rendered = Renderer.renderNode(node);
		return rendered;
	}
	static updateElement(node: intrinsicElement) {
		const rendered = Renderer.renderNode(node);
		return rendered;
	}
}

// mounts, transforms schema into instance
export function render(node: elementLike, into: Instance) {
	const mounted = Renderer.mountNode(node, into);
	return {
		unmount() {
			mounted();
		},
	};
}
