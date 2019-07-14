/**
 * テスト: hメソッド
 * => DOM定義JSONから仮想DOMツリー構築
 */

const { diff, detailedDiff } = require('deep-object-diff');
import { VNode, h } from './view';

// ViewのState, Actionを定義
const state = {
    count: 0
};

const actions = {
    increment: (state) => {
        state.count++;
    }
};

// Test: 仮想DOM作成
// 下記hメソッドによりtargetのようなDOMツリーが生成されることを確認する
const dom = h(
    'div', {id: 'app'},
    h('p', {id: 'counter'}, state.count),
    h('button', {
        type: 'button',
        id: 'increment',
        onclick: actions.increment
    }, '+1')
);

// Answer: 上記で生成されたDOMツリーは以下のような構造になっていることを求める
const target = {
    nodeName: "div",
    attributes: { id: "app" },
    children: [
        {
            nodeName: "p",
            attributes: { "id": "counter" },
            children: [ 0 ]
        },
        {
            nodeName: "button",
            attributes: {
                type: "button",
                id: "increment",
                onclick : actions.increment
            },
            children: [ '+1' ]
        }
    ]
} as VNode;

// Judge: 2つの仮想DOMが同一か判定
const isSameVNode = (dom1: VNode, dom2: VNode): boolean => {
    const differ = detailedDiff(dom1, dom2);
    return Object.keys(differ.added).length === 0 && Object.keys(differ.deleted).length === 0 && Object.keys(differ.updated).length === 0;
};

console.log(dom);
console.log(target);
document.getElementById('root').innerHTML = `
<div>
    <h3>仮想DOM構築</h3>
    <div>
        <h4>ソース</h4>
<pre><code>h(
    'div', {id: 'app'},
    h('p', {id: 'counter'}, state.count),
    h('button', {
        type: 'button',
        id: 'increment',
        onclick: () => {actions.increment(state);},
    }, '+1')
)</code></pre>
    </div>
    <div>
        <h4>仮想DOM</h4>
        <pre><code>${JSON.stringify(dom, null, '\t')}</code></pre>
        <hr>
        <pre><code>${JSON.stringify(target, null, '\t')}</code></pre>
    </div>
</div>
<hr>
<div>
    <h3>仮想DOM構築テスト</h3>
    <div>
        <h4>Test run</h4>
        <p>想定したDOMとの差分: ${JSON.stringify(diff(dom, target), null, '\t')}</p>
        <p>想定通りのDOMが構築されたか: ${isSameVNode(dom, target)}</p>
    </div>
</div>
`;
