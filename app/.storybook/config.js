import { configure } from '@storybook/react';

function loadStories() {
    // コンポーネントカタログを`app/stories/index.js`に定義
    require('../stories/index.js');
}

configure(loadStories, module);
