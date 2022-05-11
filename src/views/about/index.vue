<template>
  <div>
      Hello {{message}} !!!
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    const message = ref('About Page')

    return {
        message
    };
  },
});
</script>

<style  scoped>

</style>

