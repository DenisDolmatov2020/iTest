<template>
  <div>
    <!-- Динамический компонент монтируется здесь -->

    <component
        :is="dynamicComponent"
        v-bind="data"
    />
    <button @click="updateTitle">
      Click to Update Title
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent, shallowRef } from 'vue';

const loading = ref(false);
// Реактивные данные для компонента
const data = ref({
  title: 'Initial Title',
  imageUrl: 'https://example.com/initial-image.jpg',
  text: 'Initial text description'
});

// Функция для добавления стилей в <head>
const addStyles = (styles) => {
  const style = document.createElement('style');
  style.textContent = styles;
  document.head.appendChild(style);
};

// Асинхронный компонент загруженный с сервера
const dynamicComponent = shallowRef(null);

// Функция для загрузки шаблона и данных с сервера и их обработки
onMounted(async () => {
  try {
    const [dataResponse, templateResponse] = await Promise.all([
      fetch('http://localhost:3000/api/component-data'),
      fetch('http://localhost:3000/api/component-settings')
    ]);

    if (!dataResponse.ok || !templateResponse.ok) throw new Error("Failed to fetch data");

    const dynamicData = await dataResponse.json();
    Object.assign(data.value, dynamicData);

    const templateData = await templateResponse.json();

    // Добавляем стили перед созданием компонента
    addStyles(templateData.styles);

    dynamicComponent.value = await defineAsyncComponent(() =>
        Promise.resolve({
          template: templateData.template,
          methods: {
            handleClick() {
              updateTitle()
            }
          },
          props: ['title', 'imageUrl', 'text']
        })
    );

    // loading.value = true
  } catch (error) {
    console.error("Failed to load component data or settings", error);
  }
});

// Функция для обновления данных
function updateTitle() {
  data.value.title += ' +';
}
</script>

<style scoped>
main {
  display: flex;
}
</style>


