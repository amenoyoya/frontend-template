import { h, createElement } from './view';

// HTML文字列からHTMLElement生成
const createElementFromHTML = (html: string): HTMLElement => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.firstElementChild as HTMLElement;
};

// ViewのState, Actionを定義
const state = {
    count: 0
};

const actions = {
    increment: (state) => {
        state.count++;
    }
};

// 仮想DOM準備
const vdom = h(
    'div', {id: 'app'},
    h('p', {id: 'counter'}, state.count),
    h('button', {
        type: 'button',
        id: 'increment',
        onclick: actions.increment
    }, '+1')
);

// Test: 仮想DOM => リアルDOM 構築
// 下記createElementメソッドにより生成されたリアルDOMがtargetのようなHTMLElementになっていることを確認
const dom = createElement(vdom);

// Answer: 上記で生成されたリアルDOMは、以下のようなHTMLElemtになっていることを求める
const target = createElementFromHTML(`
<div id="app"><p id="counter">${state.count}</p><button type="button" id="increment">+1</button></div>
`);

// Judge: 二つのHTMLElementが同一か判定する
const isSameHTML = (dom1: HTMLElement, dom2: HTMLElement): boolean => (
    dom1.outerHTML === dom2.outerHTML
);

console.log(dom);
console.log(target);

document.getElementById('root').innerHTML = `
<div>
    <h3>仮想DOMからリアルDOM構築</h3>
    <div>
        <h4>ソース</h4>
<pre><code>createElement(
    h(
        'div', {id: 'app'},
        h('p', {id: 'counter'}, state.count),
        h('button', {
            type: 'button',
            id: 'increment',
            onclick: () => {actions.increment(state);},
        }, '+1')
    )
)</code></pre>
    </div>
    <div>
        <h4>リアルDOM</h4>
        <textarea rows="5" cols="50">${(dom as HTMLElement).outerHTML}</textarea>
        <hr>
        <textarea rows="5" cols="50">${target.outerHTML}</textarea>
    </div>
</div>
<hr>
<div>
    <h3>仮想DOM => リアルDOM 構築テスト</h3>
    <div>
        <h4>Test run</h4>
        <p>想定通りのDOMが構築されたか: ${isSameHTML(dom as HTMLElement, target)}</p>
    </div>
</div>
`;
