# Yaruil
*Yet Another Roblox UI Library*
Yaruil is fairly simple, it's similar to reactjs and solidjs. <br/>
If you want JSX, then you will have to install the [transformer](https://github.com/greenbobux/rbxts-transformer-yaruil),
## Props and children

Creating an element looks like this: `Yaruil.createElement("ScreenGui, {/* props */}, [/* children */])`. <br/>
Yaruil "assigns" the children to the props, and those props get passed to a component. <br/>
Under the hood, this is what a props object would look like. 
```ts
{ children: [] /* ... the rest of your props */}
```

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