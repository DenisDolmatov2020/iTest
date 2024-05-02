<script setup>
defineProps(['title', 'imageUrl', 'text'])
</script>

<template>
  <div class="main-container">

    <h1>
      I AM DEFAULT COMPONENT
    </h1>

    <div>
      <h2>
        {{ title }}
      </h2>
      <h4>
        URL ::: {{ imageUrl }}
      </h4>

      <div>
        {{ text }}
      </div>
    </div>
  </div>

</template>

<style scoped>
.main-container {
  margin: 0 auto;
  border: 1px solid black;
  padding: 20px;
  width: 300px;
  height: 350px;
}
</style>