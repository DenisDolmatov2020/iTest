<script setup>
import {defineAsyncComponent, onMounted, shallowRef } from 'vue';
import DefaultComponent from '@/DefaultComponent.vue';

const apiUrl = 'http://localhost:3000/api';

const dynamicComponent = shallowRef(null);

const initComponent = async () => {
  try {
    const templateResponse = await fetch(`${apiUrl}/component-settings`);

    if (templateResponse.ok) {
      const templateData = await templateResponse.json();

      dynamicComponent.value = await defineAsyncComponent(() =>
          Promise.resolve({
            template: templateData.template,
            data() {
              return {
                title: 'Initial Title',
                imageUrl: 'https://example.com/initial-image.jpg',
                text: 'Initial text description'
              };
            },
            methods: {
              async fetchData() {
                const dataResponse = await fetch(`${apiUrl}/component-data`);
                if (dataResponse.ok) {
                  const dynamicData = await dataResponse.json();
                  Object.assign(this.$data, dynamicData);
                }
              },

              // Функция для добавления или обновления стилей в <head>
              addStyles(style) {
                let styleElement = document.getElementById('dynamic-styles');
                if (!styleElement) {
                  styleElement = document.createElement('style');
                  styleElement.id = 'dynamic-styles';  // Установка ID для элемента style
                  document.head.appendChild(styleElement);
                }
                styleElement.textContent = style;  // Обновляем или устанавливаем содержимое
              },

              handleClick() {
                this.title += ' +';
              }
            },
            mounted() {
              // Добавляем стили перед созданием компонента
              this.addStyles(templateData.styles);
              this.fetchData();
            }
          })
      );
    }
  } catch (error) {
    dynamicComponent.value = DefaultComponent
    console.error("Failed to load component data or settings", error);
  }
};

// Функция для загрузки шаблона и данных с сервера и их обработки
onMounted(() => {
  initComponent()
});
</script>

<template>
  <component :is="dynamicComponent" />
</template>

<style scoped>
main {
  display: flex;
}
</style>



