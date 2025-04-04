<template>
  <div>
    <app-header></app-header>
    <app-navbar></app-navbar>
    <app-main></app-main>
  </div>
</template>
<script setup lang="ts">
import AppHeader from '@/components/AppHeader/index.vue'
import AppNavbar from '@/components/AppNavbar/index.vue'
import AppMain from '@/components/AppMain/index.vue'
</script>

<style scoped>
.header {
  position: absolute;
  line-height: 50px;
  top: 0;
  left: 0;
  right: 0;
  background-color: #2d3a4b;
}
.navbar {
  position: absolute;
  width: 230px;
  top: 50px;
  left: 0;
  bottom: 0;
  overflow-y: auto;
  background-color: #545c64;
}
.main {
  position: absolute;
  top: 50px;
  left: 230px;
  bottom: 0;
  right: 0;
  overflow-y: auto;
  padding: 20px;
}
</style>
