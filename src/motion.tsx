import React, { useRef } from "@rbxts/react";
import useAnimation from "./useAnimation";
import { WithAnimationProps } from ".";


function withAnimation<T extends keyof JSX.IntrinsicElements>(
  elementType: T
): (
  props: JSX.IntrinsicElements[T] & WithAnimationProps<GuiObject & Record<string, unknown>>
) => React.Element {
  return (props) => {
    const { initial, animate, transition, variants, ref: refProp } = props;
    const ref = refProp || useRef<GuiObject & Record<string, unknown>>(undefined);
    const [, setVariant] = useAnimation<GuiObject & Record<string, unknown>>(
      variants ?? {},
      ref as React.RefObject<GuiObject & Record<string, unknown>>,
      initial,
      animate,
      transition
    );

    
    const newReturn: {[key: string]: unknown} = {ref};

    // Loop through props
    for (const [key, value] of pairs(props)) {
      if (key === "initial" || key === "animate" || key === "transition" || key === "variants" || key === "ref") continue;
      newReturn[key as never] = value;
    }
    
    print(props, newReturn, { Text:"asdsadsad" }) 
    return React.createElement(elementType, newReturn);
  };
}

export const motion = {
  frame: withAnimation("Frame" as "frame"),
  textlabel: withAnimation("TextLabel" as "textlabel"),
  textbutton: withAnimation("TextButton" as "textbutton"),
  imagebutton: withAnimation("ImageButton" as "imagebutton"),
  scrollingframe: withAnimation("ScrollingFrame" as "scrollingframe"),
  uilistlayout: withAnimation("UIListLayout" as "uilistlayout"),
  uigridlayout: withAnimation("UIGridLayout" as "uigridlayout"),
  uipadding: withAnimation("UIPadding" as "uipadding"),
  uisizeconstraint: withAnimation("UISizeConstraint" as "uisizeconstraint"),
  uicorner: withAnimation("UICorner" as "uicorner"),
  uistroke: withAnimation("UIStroke" as "uistroke"),
  textbox: withAnimation("TextBox" as "textbox"),
  imagelabel: withAnimation("ImageLabel" as "imagelabel"),
}
