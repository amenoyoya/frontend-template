# 仮想DOMフレームワーク制作

## Setup

仮想DOMツリーの差分を検出するために `deep-object-diff` モジュールをインストールする

```bash
$ yarn add -D deep-object-diff
```

***

## 仮想DOM実装

- **src/view.ts** (仮想DOMのインターフェイス定義)
    ```typescript
    /**
     * 仮想DOMの型: 仮想DOM｜文字列｜数値
     * 仮想DOMの属性: { 属性名: 文字列｜関数 }
     */
    type NodeType = VNode | string | number;
    type Attributes = { [key: string]: string | Function };

    /**
     * 仮想DOMインターフェイス
     * {
     *   nodeName: タグ名,
     *   attributes: { 属性名: 文字列｜関数 },
     *   children: 仮想DOMのNode配列
     * }
     */
    export interface VNode {
        nodeName: keyof ElementTagNameMap;
        attributes: Attributes;
        children: NodeType[];
    }

    /**
     * nodeが仮想DOMか判定する関数
     * => NodeTypeのうちstringでもnumberでもものがVNode
     */
    const isVNode = (node: NodeType): node is VNode => (
        typeof node !== 'string' && typeof node !== 'number'
    );

    /**
     * h: 仮想DOMを作成する関数
     * @param nodeName: タグ名
     * @param attributes: { 属性名: 文字列｜関数 }
     * @param [children]: 子ノード（仮想DOMのNode配列）
     */
    export const h =
        (
            nodeName: keyof ElementTagNameMap,
            attributes: Attributes,
            ...children: NodeType[]
        ): VNode => ({ nodeName, attributes, children });

    /**
     * Viewインターフェイス
     * Viewは State と Action から仮想DOMを構築する
     */
    export interface View<State, Actions> {
        (state: State, actions: Actions): VNode;
    }
    ```

### Test run
1. 上記で実装した`h`メソッドを用いて仮想DOM構築
2. 期待するDOMツリーとの差分をとる
3. 差分がなければテストは成功

- **src/main.ts**
    ```typescript
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
    ```

***

## 仮想DOMからリアルDOM構築

- **src/view.ts** (仮想DOM => リアルDOM メソッド定義)
    ```typescript
    /**
     * 仮想DOMからリアルDOMを生成する関数
     * @param node: 仮想DOM | 文字列 | 数値
     * @return リアルDOM: HTMLElement | Text
     */
    export const createElement = (node: NodeType): HTMLElement | Text => {
        if (!isVNode(node)) {
            // nodeが仮想DOMでないならTextNodeを生成
            return document.createTextNode(node.toString());
        }
        // 仮想DOMからリアルDOMを生成
        const el = document.createElement(node.nodeName);
        setAttributes(el, node.attributes);
        node.children.forEach(child => el.appendChild(createElement(child)));
        return el;
    };
    
    /**
     * nodeが仮想DOMか判定する関数
     * => NodeTypeのうちstringでもnumberでもものがVNode
     */
    const isVNode = (node: NodeType): node is VNode => (
        typeof node !== 'string' && typeof node !== 'number'
    );
    
    /**
     * リアルDOMのノードに属性を設定する関数
     * @param target: 対象ノード
     * @param attributes: 属性リスト
     */
    const setAttributes = (target: HTMLElement, attribues: Attributes): void => {
        for (let attr in attribues) {
            if (isEventAttr(attr)) {
                // イベント属性はイベントリスナーに登録
                const eventName = attr.slice(2); // 属性名の頭の「on」を削除したものをイベント名とする
                target.addEventListener(eventName, attribues[attr] as EventListener);
            } else {
                target.setAttribute(attr, attribues[attr] as string);
            }
        }
    };
    
    /**
     * 指定した属性名がイベントか判定する関数
     * => 'on'から属性名はイベントとして扱う
     */
    const isEventAttr = (attr: string): boolean => {
        return /^on/.test(attr);
    };
    ```

### Test run
1. 上記で実装した`createElement`メソッドに仮想DOMを渡し、リアルDOM構築
2. 期待するHTMLElement（リアルDOM）を構築する
3. 2つのリアルDOMを文字列にキャストして同一か判定する

- **src/main.ts**
    ```typescript
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
    ```
