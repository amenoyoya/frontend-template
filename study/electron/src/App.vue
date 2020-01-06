<template>
  <section>
    <b-collapse :open="false">
      <button class="button is-primary" slot="trigger">Click me!</button>
      <div class="notification">
        <div class="content">
          <h3>Subtitle</h3>
          <p>Hello, world</p>
        </div>
      </div>
    </b-collapse>

    <!-- Draggable -->
    <tree :data="animals" draggable="draggable" crossTree="crossTree">
      <div slot-scope="{data, store, vm}" class="list-item">
        <template v-if="!data.isDragPlaceHolder">
          <b v-if="data.children && data.children.length" @click="store.toggleOpen(data)">
            {{data.open ? '-' : '+'}}&nbsp;
          </b>
        </template>
        <span>{{data.emoji}} {{data.name}}</span>
      </div>
    </tree>
  </section>
</template>

<script>
const animals = [
  { emoji: '🐄', name: 'うし' },
  { emoji: '🐕', name: 'いぬ' },
  { emoji: '🐈', name: 'ねこ' },
  { emoji: '🐓', name: 'にわとり', children: [
    { emoji: '🐤', name: 'ひよこ兄' },
    { emoji: '🐤', name: 'ひよこ弟' },
  ]},
  { emoji:'🐖', name: 'ぶた' }
]

export default {
  data() {
    return {
      animals: animals
    }
  },
}
</script>