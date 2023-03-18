import '@testing-library/jest-dom'
import { createVNode } from "../dom"
//@ts-ignore
import { getByTestId } from "@testing-library/dom"
import {
    createVApp,
    DEFAULT_TEST_ID,
    renderBaseDOM,
    createCounterApp
} from "./helpers";

describe('vDom', () => {
    afterEach(() => {
        document.body.innerHTML = ''
    })

    describe('render vNodes to the DOM', () => {

        it('the button should be  in the document', () => {
            const vButton = createVNode('button', {
                text: 'button',
            })

            const container = renderBaseDOM(vButton)
            expect(getByTestId(container, DEFAULT_TEST_ID)).toBeInTheDocument()
        })

        it('the button don`t should contains children', () => {
            const vButton = createVNode('button', {
                text: 'button',
            })

            const container = renderBaseDOM(vButton)
            const children = Array.from(getByTestId(container, DEFAULT_TEST_ID).childNodes).length

            expect(children).toBe(0)
        })

        it('the text node should be in container', () => {
            const app = createVNode("div", { class: "container" }, [
                createVNode("h1", {}, ["Hello, Virtual DOM"]),
                "Text node without tags",
            ])

            const container = renderBaseDOM(app)

            expect(container).toContainHTML('Text node without tags')
        })
    })

    describe('check handlers', () => {
        it('button handler should be called', () => {
            const fakeFn = jest.fn()

            const vButton = createVNode('button', { text: 'click me', onclick: fakeFn })
            const container = renderBaseDOM(vButton)

            const button = getByTestId(container, DEFAULT_TEST_ID)

            button.click()

            expect(fakeFn).toBeCalled()
        })
    })

    describe('integration test', () => {
        it('counter should be 0', () => {
            const store = {
                count: 0
            }

            const app = createVApp(store.count)
            const container = renderBaseDOM(app)

            const counter = getByTestId(container, 'count')

            expect(counter).toHaveTextContent('0')
        })

        it('counter should be increase by 4', async () => {

            const app = createCounterApp()

            const count = getByTestId(app, 'count')
            const increaseBtn = getByTestId(app, 'increase-btn')

            expect(count).toHaveTextContent('0')

            increaseBtn.click()

            expect(count).toHaveTextContent('4')
        })

        it('counter should be decrease by 4', async () => {

            const app = createCounterApp()

            const count = getByTestId(app, 'count')
            const decreaseBtn = getByTestId(app, 'decrease-btn')

            expect(count).toHaveTextContent('0')

            decreaseBtn.click()

            expect(count).toHaveTextContent('-4')
        })
    })
})
