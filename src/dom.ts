import { Children, DOMNode, DOMNodeWithVDOM, Props, VNode } from "./types";
import { isHTMLElement, TEXT_NODE_TYPE } from "./utils";

export const createVNode = (type: string, props: any = {}, children: any[] = []): VNode => {
    return {
        type,
        props,
        children
    }
}

export const createDOMNode = (vNode: VNode | string): DOMNode => {
    const { type, props, children } = vNode as VNode || {}

    if (typeof vNode === 'string') {
        return document.createTextNode(vNode)
    }

    const node = document.createElement(type)

    patchProps(node, {}, props)

    if (children) {
        children.forEach((child: VNode) => {
            node.appendChild(createDOMNode(child))
        })
    }

    return node
}

export const renderDOM = (block: DOMNode, container = document.querySelector('#app')) => {
    container.appendChild(block)
    return container
}

export const reconcile = (node: DOMNode | DOMNodeWithVDOM, vNode: VNode | string, nextVNode: VNode): DOMNode => {
    if (!vNode) {
        throw new Error('reconcile: should contains vNode')
    }

    if (!nextVNode) {
        node.remove()
        return
    }

    if (typeof vNode === 'string' || typeof nextVNode === 'string') {
        if (vNode !== nextVNode) {
            const nextNode = createDOMNode(nextVNode)

            node.replaceWith(nextNode)

            return nextNode
        }

        return node
    }

    if (vNode.type !== nextVNode.type) {
        const nextNode = createDOMNode(nextVNode)

        node.replaceWith(nextNode)

        return nextNode
    }

    patchProps(node, vNode.props, nextVNode.props)
    patchChildren(node, vNode.children, nextVNode.children)

    return node
}

function listener(event: Event) {
    return this[event.type](event);
}

const patchProp = (node: DOMNode, key: string, value: unknown, nextValue: unknown) => {
    if (isHTMLElement(node)) {
        if (key.startsWith("on")) {
            const eventName = key.slice(2);

            // @ts-ignore
            node[eventName] = nextValue;

            if (!nextValue) {
                node.removeEventListener(eventName, listener);
            } else if (!value) {
                node.addEventListener(eventName, listener);
            }
            return;
        }

        if (!nextValue && nextValue !== 0) {
            node.removeAttribute(key)
            return
        }

        node.setAttribute(key, nextValue as string)
    }
}

const patchProps = (node: DOMNode, props: Props, nextProps: Props) => {
    const mergedProps = { ...props, ...nextProps }

    Object.keys(mergedProps).forEach(key => {
        // if (JSON.stringify(props[key]) !== JSON.stringify(nextProps[key])) {
        if (props[key] !== nextProps[key]) {
            patchProp(node, key, props[key], nextProps[key])
        }
    })
}

const patchChildren = (parentNode: DOMNode, vChildren: Children, nextVChildren: Children) => {
    parentNode.childNodes.forEach((child, i) => reconcile(child, vChildren[i], nextVChildren[i]))

    nextVChildren.slice(vChildren.length).forEach(child => {
        parentNode.appendChild(createDOMNode(child))
    })
}

export const patch = (nextVNode: VNode, node: DOMNodeWithVDOM) => {
    if (!nextVNode) {
        throw new Error('patch: should contains nextVNode')
    }

    const vNode = node?.v || recycleNode(node)

    node = reconcile(node, vNode, nextVNode)

    node.v = nextVNode

    return node
}

const recycleNode = (node: DOMNode) => {
    if (!node) {
        return
    }

    if (node.nodeType === TEXT_NODE_TYPE) {
        return node.nodeValue;
    }

    const type = node.nodeName.toLowerCase();

    const children = [].map.call(node.childNodes, recycleNode);

    return createVNode(type, {}, children);
};
