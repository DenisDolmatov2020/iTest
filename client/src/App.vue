<script setup>
import {defineAsyncComponent, reactive, onMounted, toRefs, shallowRef} from 'vue';
import DefaultComponent from '@/DefaultComponent.vue';

const apiUrl = 'http://localhost:3000/api';
const dynamicComponent = shallowRef(null);

const initComponent = async () => {
  try {
    const templateResponse = await fetch(`${apiUrl}/component-settings`);

    if (templateResponse.ok) {
      const { template, styles } = await templateResponse.json();

      dynamicComponent.value = defineAsyncComponent(() => {
        return Promise.resolve({
          template: `<div>${template}</div>`, // Вставьте template как HTML
          setup() {
            const state = reactive({
              title: 'Initial Title',
              imageUrl: 'https://example.com/initial-image.jpg',
              text: 'Initial text description'
            });

            const fetchData = async () => {
              try {
                const dataResponse = await fetch(`${apiUrl}/component-data`);
                if (dataResponse.ok) {
                  const newData = await dataResponse.json();
                  // Обновляем состояние
                  state.title = newData.title;
                  state.imageUrl = newData.imageUrl;
                  state.text = newData.text;
                }
              } catch (error) {
                console.error("Failed to fetch component data", error);
              }
            };

            const addStyles = (style) => {
              let styleElement = document.getElementById('dynamic-styles');
              if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = 'dynamic-styles';
                document.head.appendChild(styleElement);
              }
              styleElement.textContent = style;
            };

            const handleClick = () => {
              state.title += '+';
            }

            onMounted(() => {
              addStyles(styles);
              fetchData();
            });

            return { ...toRefs(state), handleClick };
          }
        });
      });
    }
  } catch (error) {
    dynamicComponent.value = DefaultComponent;
    console.error("Failed to load component settings", error);
  }
};

initComponent()
</script>

<template>
  <component :is="dynamicComponent" />
</template>

<style scoped>
main {
  display: flex;
}
</style>




