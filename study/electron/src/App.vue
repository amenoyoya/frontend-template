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
  </section>
</template>