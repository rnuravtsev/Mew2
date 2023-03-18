import { createVNode, patch } from "./dom";
import { createVButton } from "./utils";
import './styles/index.css'

const store = {
    state: { count: 0 },
    onStateChanged: () => {
    },
    setState(nextState: unknown) {
        this.state = nextState
        this.onStateChanged()
    }
}

const createVApp = (store: any) => {
    const { count } = store.state;

    return createVNode("div", { class: "container" }, [
        createVNode("h1", {}, ["Hello, Virtual DOM"]),
        createVNode("div", {}, [`Count: ${count}`]),
        "Text node without tags",
        createVNode("img", { src: "https://i.ibb.co/M6LdN5m/2.png", width: 200, style: 'display:block; margin: 20px 0' }),
        createVNode("div", {}, [
            createVButton({
                text: "-1",
                onclick: () => store.setState({ count: store.state.count - 1 })
            }),
            " ",
            createVButton({
                text: "+1",
                onclick: () => store.setState({ count: store.state.count + 1 })
            })
        ])

    ]);
};

let app = patch(createVApp(store), document.querySelector('#app'))

store.onStateChanged = () => {
    app = patch(createVApp(store), app)
}
