import { DOMNode, Props } from "./types";
import { createVNode } from "./dom";

export const TEXT_NODE_TYPE = 3;
export const isHTMLElement = (element: DOMNode): element is HTMLElement => {
    return (
        element instanceof HTMLElement ||
        (typeof element === 'object' &&
            element.nodeType === Node.ELEMENT_NODE
        )
    )
}
export const createVButton = (props: Props) => {
    const { text, onclick } = props;

    return createVNode('button', { ...props, onclick }, [text]);
};

export const sleep = (latency: number = 1000) => {
    return new Promise(res => {
        setTimeout(res, latency)
    })
}
