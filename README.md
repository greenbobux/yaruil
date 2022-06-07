# Yaruil
*Yet Another Roblox UI Library*
Yaruil is fairly simple, it's similar to reactjs and solidjs. <br/>
If you want JSX, then you will have to install the [transformer](https://github.com/greenbobux/rbxts-transformer-yaruil). <br/>
With JSX, you'll always want to have the Yauril module imported, `import * as Yaruil from "@rbxts/yaruil"`
## Props and children

Creating an element looks like this: `Yaruil.createElement("ScreenGui, {/* props */}, [/* children */])`. 
## Prop values
The value of a prop can be a function or a literal. <br/>
```() => (`count: ${count()}`)``` or just simply  `` `count: ${count()}` ``
## Examples
Here is an example of a basic component.
```ts
import { Players } from "@rbxts/services";
import * as Yaruil from "@rbxts/yaruil";
import { createSignal, render } from "@rbxts/yaruil";
import { childrenLike } from "@rbxts/yaruil/out/util/types";

function Button({ children }: { children?: childrenLike }) {
	const [count, setCount] = createSignal(0);

	return (
		<screengui>
			<textbutton
				on:MouseButton1Click={() => {
					setCount(count() + 1);
				}}
				Size={new UDim2(0, 100, 0, 100)}
				Text={`count: ${count()}`}
			>
                // we dont know if children is defined
				{...children || []}
			</textbutton>
		</screengui>
	);
}
render(
	<Button>
		<uicorner />
	</Button>,
	Players.LocalPlayer.WaitForChild("PlayerGui"),
);
```
It's relatively easy to communicate state. 

```ts
import { Players } from "@rbxts/services";
import * as Yaruil from "@rbxts/yaruil";
import { createDependency, render } from "@rbxts/yaruil";
import { externalSignal } from "@rbxts/yaruil/out/hooks/externalSignal";
import { childrenLike } from "@rbxts/yaruil/out/util/types";

export const countSignal = externalSignal(1);
// some event happens...
Event.connect((newValue) => countSignal.set(999))
function Button({ children }: { children?: childrenLike }) {
	const [count, setCount] = createDependency(countSignal);

	return (
		<screengui>
			<textbutton
				on:MouseButton1Click={() => {
					setCount(count() + 1);
				}}
				Size={new UDim2(0, 100, 0, 100)}
				Text={() => `count: ${count()}`}
			>
				{...children || []}
			</textbutton>
		</screengui>
	);
}
```