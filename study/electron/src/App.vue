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
    <tree :data="animals" draggable="draggable" crossTree="crossTree" class="tree">
      <div slot-scope="{data, store, vm}" :class="data.draggable? 'draggable': ''">
        <template v-if="!data.isDragPlaceHolder">
          <b v-if="data.children && data.children.length" @click="store.toggleOpen(data)">
            <a><i :class="'far ' + (data.open ? 'fa-minus-square' : 'fa-plus-square')"></i>&nbsp;</a>
          </b>
        </template>
        <span>
          <i v-if="data.droppable" class="fas fa-folder"></i>
          <i v-else class="fas fa-file"></i>
          {{data.emoji}} {{data.name}}
        </span>
      </div>
    </tree>
  </section>
</template>

<script>
const animals = [
  { name: '/', draggable: false, droppable: true, children: [
    { emoji: '🐄', name: 'うし', draggable: true, droppable: false },
    { emoji: '🐕', name: 'いぬ', draggable: true, droppable: false },
    { emoji: '🐈', name: 'ねこ', draggable: true, droppable: false },
    { emoji: '🐓', name: 'にわとり', draggable: true, droppable: true, children: [
      { emoji: '🐤', name: 'ひよこ兄', draggable: true, droppable: false },
      { emoji: '🐤', name: 'ひよこ弟', draggable: true, droppable: false },
    ]},
    { emoji:'🐖', name: 'ぶた', draggable: true, droppable: false }
  ]}
]

export default {
  data() {
    return {
      animals: animals
    }
  },
}
</script>

<style scope>
.draggable {
  cursor: move;
}
.tree {
  display: inline-block;
}
</style>