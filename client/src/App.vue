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
import DefaultComponent from './DefaultComponent.vue';


const apiUrl = 'http://localhost:3000/api'
// Реактивные данные для компонента
const data = ref({
  title: 'Initial Title',
  imageUrl: 'https://example.com/initial-image.jpg',
  text: 'Initial text description'
});

// Функция для добавления или обновления стилей в <head>
const addStyles = (style) => {
  let styleElement = document.getElementById('dynamic-styles');
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = 'dynamic-styles';  // Установка ID для элемента style
    document.head.appendChild(styleElement);
  }
  styleElement.textContent = style;  // Обновляем или устанавливаем содержимое
};

// Асинхронный компонент загруженный с сервера
const dynamicComponent = shallowRef(null);

// Функция для загрузки шаблона и данных с сервера и их обработки
onMounted(async () => {
  try {
    const [dataResponse, templateResponse] = await Promise.all([
      fetch(`${apiUrl}/component-data`),
      fetch(`${apiUrl}/component-settings`)
    ]);

    if (dataResponse.ok) {
      const dynamicData = await dataResponse.json();
      Object.assign(data.value, dynamicData);
    }

    if (templateResponse.ok) {
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
    }
  } catch (error) {
    dynamicComponent.value = DefaultComponent
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


