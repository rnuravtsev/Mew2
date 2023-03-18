import { VNode } from "../types";
import { createDOMNode, createVNode, patch, renderDOM } from "../dom";
import { createVButton } from "../utils";

export const DEFAULT_TEST_ID = 'testid'

type RenderOptions = {
    testId: string
}
export const withTestId = (vNode: VNode | string, testId: string = DEFAULT_TEST_ID) => {
    if (typeof vNode !== "string" && vNode?.type) {
        return {
            ...vNode,
            props: {
                ...vNode.props,
                ['data-testid']: testId
            }
        }
    }

    return vNode
}
export const renderBaseDOM = (vNode: VNode | string, options?: RenderOptions) => {
    const testId = options?.testId

    renderAppElement()

    const domNode = createDOMNode(withTestId(vNode, testId))

    return renderDOM(domNode)
}

export const renderAppElement = () => {
    document.body.innerHTML = '<div id="app"></div>'
}

export const createVApp = (count: number | string, listeners?: Record<string, unknown>) => {
    const {
        increase = () => {
        },
        decrease = () => {
        }
    } = listeners || {}

    return createVNode('div', { class: 'wrapper' }, [
        withTestId(createVNode('div', {}, [`${count}`]), 'count'),
        withTestId(createVButton({ text: 'plus', onclick: increase }), 'increase-btn'),
        withTestId(createVButton({ text: 'minus', onclick: decrease }), 'decrease-btn')
    ])
}
export const getStore = () => {
    return {
        state: {
            count: 0,
        },
        onStateChanged: () => {
        },
        setState(nextState: unknown) {
            this.state = nextState
            this.onStateChanged()
        }
    }
}

export const createCounterApp = () => {
    const store = getStore()

    const listeners = {
        increase: jest.fn().mockImplementation(
            () => store.setState({ count: store.state.count + 4 })
        ),

        decrease: jest.fn().mockImplementation(
            () => store.setState({ count: store.state.count - 4 })
        )
    }

    let vApp = createVApp(store.state.count, listeners)

    renderAppElement()
    const container = document.body.childNodes[0]

    let app = patch(vApp, container)

    store.onStateChanged = () => {
        patch(createVApp(store.state.count, listeners), app)
    }

    return app
}
