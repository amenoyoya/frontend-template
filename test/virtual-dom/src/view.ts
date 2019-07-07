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
 * h: 仮想DOMを作成する関数
 * @param nodeName: タグ名
 * @param attributes: { 属性名: 文字列｜関数 }
 * @param [children]: 子ノード（仮想DOMのNode配列）
 * @return 仮想DOM { nodeName, attributes, children }
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
