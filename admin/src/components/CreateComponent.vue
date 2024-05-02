<template>
  <h1>Админский интерфейс</h1>
  <div class="admin-interface">
    <div>
      <div class="editor">
        <div>
          <h2>Vue code</h2>

          <VAceEditor
              v-model:value="vueCode"
              lang="javascript"
              placeholder="Введите Vue.js код..."
              :options="{
                fontSize: 14,
                tabSize: 2,
                showPrintMargin: true,
                highlightActiveLine: true,
              }"
              theme="monokai"
              class="editor-box"
              @init="editorInit"
          />
        </div>
        <div class="my-28">
          <h2>CSS code</h2>

          <VAceEditor
              v-model:value="cssCode"
              lang="javascript"
              placeholder="Введите CSS код..."
              :options="{
                fontSize: 14,
                tabSize: 2,
                showPrintMargin: true,
                highlightActiveLine: true,
              }"
              theme="monokai"
              class="editor-box"
              @init="editorInit"
          />
        </div>
        <button @click="saveSettings">Save</button>
      </div>
      <!-- Предпросмотр компонента будет здесь -->
    </div>

    <div>
      <h2>Preview</h2>
      <component
          :is="dynamicComponent"
          v-bind="data"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent, shallowRef } from 'vue';
import { VAceEditor } from 'vue3-ace-editor';


const vueCode = ref('');
const cssCode = ref('');

const editorInit = () => {};

onMounted(() => {
  loadCurrentSettings();
  loadData();
});

// Реактивные данные для компонента
const data = ref({
  title: 'Initial Title',
  imageUrl: 'https://example.com/initial-image.jpg',
  text: 'Initial text description'
});


// Асинхронный компонент загруженный с сервера
const dynamicComponent = shallowRef(null);

const updateComponent = async () => {
  // Добавляем стили перед созданием компонента
  addStyles();

  dynamicComponent.value = await defineAsyncComponent(() =>
      Promise.resolve({
        template: vueCode.value,
        methods: {
          handleClick() {
            updateTitle()
          }
        },
        props: ['title', 'imageUrl', 'text']
      })
  );
}

// Функция для добавления стилей в <head>
const addStyles = () => {
  const style = document.createElement('style');
  style.textContent = cssCode.value;
  document.head.appendChild(style);
};

const loadData = async () => {
  try {
    const dataResponse = await fetch('http://localhost:3000/api/component-data');

    if (!dataResponse.ok) throw new Error("Failed to fetch data");

    const dynamicData = await dataResponse.json();
    Object.assign(data.value, dynamicData);

    updateComponent()
  } catch (error) {
    console.error("Failed to load component data or settings", error);
  }
}

const loadCurrentSettings = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/component-settings');
    const data = await response.json();
    vueCode.value = data.template;
    cssCode.value = data.styles;
  } catch (error) {
    console.error('Ошибка загрузки текущих настроек:', error);
  }
};

const saveSettings = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/component-settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        template: vueCode.value,
        styles: cssCode.value
      })
    });
    if (response.ok) {
      alert('Настройки сохранены!');
      updateComponent()
    } else {
      throw new Error('Ошибка сохранения настроек');
    }
  } catch (error) {
    console.error('Ошибка сохранения настроек:', error);
  }
};

// Функция для обновления данных
function updateTitle() {
  data.value.title += ' +';
}
</script>

<style scoped>
.admin-interface {
  /* Стили для админской страницы */
  width: 800px;
  display: flex;
  justify-content: space-around;
}
.editor .editor-box {
  height: 200px;
  width: 400px
}

.my-28 {
  margin: 28px 0
}
</style>
