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
    <div id="app">
      <draggable element="ul" class="list" v-model="animals">
        <li v-for="(animal, i) in animals" :key="'parent' + i" class="list-item">
          <span>{{ i }} : {{ animal.emoji }} {{ animal.name }}</span>
          <draggable element="ul" class="list" v-model="animal.children">
            <li v-for="(child, j) in animal.children" :key="'child' + i + '-' + j" class="list-item">
              <span>{{ i }} - {{ j }} : {{ child.emoji }} {{ child.name }}</span>
            </li>
          </draggable>
        </li>
      </draggable>
    </div>
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