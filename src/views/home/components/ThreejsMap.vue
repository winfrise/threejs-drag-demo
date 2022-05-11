<template>
    <div class="threejs-container" ref="threejsContainer"></div>
</template>

<script>
import ThreejsEngine from '@/plugins/threejs-engine-class'
import { defineComponent, ref, onMounted, nextTick } from 'vue';
export default defineComponent({
  setup() {
    const threejsIns = ref(null)
    const threejsContainer = ref(null)
    onMounted(() => {
      nextTick(() => {
        threejsIns.value = new ThreejsEngine({
            container: threejsContainer.value,
            modelFile: '/models/city.fbx'
        })
      })
    })
    return {
        threejsContainer
    };
  },
});
</script>

<style  scoped>
  .threejs-container {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>

