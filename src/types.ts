export type VNode = {
    type: string,
    props: Props,
    children: Children
}
export type Props = Record<string, unknown>
export type Children = VNode[]
export type DOMNode = HTMLElement | ChildNode | Text
export type DOMNodeWithVDOM = DOMNode & {
    v?: VNode
}
