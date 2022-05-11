<template>
  <div>
      <ThreejsMap></ThreejsMap>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import ThreejsMap from './components/ThreejsMap'
export default defineComponent({
  components: {
    ThreejsMap
  },
  setup() {
    const message = ref('Home Page')

    return {
        message
    };
  },
});
</script>

<style  scoped>

</style>

