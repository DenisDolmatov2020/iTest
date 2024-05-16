<template>
  <Suspense>
    <component :is="AsyncModal" />

    <template #fallback>
      <Loading />
    </template>
  </Suspense>
</template>

<script setup>
import { defineComponent, h, defineAsyncComponent, reactive, toRefs } from 'vue';
import Loading from '@/Loading.vue';
import DefaultComponent from '@/DefaultComponent.vue';
import loadData from '@/useDataLoader.js';

const AsyncModal = defineAsyncComponent({
  loader: () =>
      new Promise(async (resolve, reject) => {
        try {
          await new Promise(r => setTimeout(r, 2000));
          const templateResponse = await fetch(`/api/component-settings`);
          if (!templateResponse.ok) throw new Error('Failed to fetch settings');
          const { template, styles } = await templateResponse.json();

          const state = reactive({
            title: '',
            imageUrl: '',
            text: ''
          });

          const updateReactiveState = (state) => (key, value) => {
            state[key] = value;
          };
          await loadData(updateReactiveState(state));

          let styleElement = document.getElementById('dynamic-styles');
          if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'dynamic-styles';
            document.head.appendChild(styleElement);
          }
          styleElement.textContent = styles;

          resolve({
            template: `<div>${template}</div>`,
            setup() {
              const handleClick = () => {
                state.title += '+';
              };

              return { ...toRefs(state), handleClick };
            }
          });
        } catch (error) {
          console.error('Failed to load component:', error);
          reject(error);
        }
      }),
  errorComponent: defineComponent({
    data() {
      return {
        title: '',
        text: '',
        imageUrl: '',
      };
    },
    methods: {
      updateData(key, value) {
        this[key] = value;
      }
    },
    mounted() {
      loadData(this.updateData.bind(this)).catch(error => {
        console.error('Error loading data in error component:', error);
      });
    },
    render() {
      return h(DefaultComponent, {
        title: this.title,
        imageUrl: this.imageUrl,
        text: this.text
      });
    }
  })
});
</script>

<style scoped>
main {
  display: flex;
}
</style>
