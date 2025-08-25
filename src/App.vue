<template>
  <div id="app">
    <Vue3Marquee :gradientLength="'30%'">
      <h1>欢迎你来了</h1>
    </Vue3Marquee>
  </div>
</template>

<script setup lang="ts">
import { Vue3Marquee } from 'vue3-marquee'
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  width: 100%;
}
</style>
