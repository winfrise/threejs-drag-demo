<template>
  <div class="threejs-container" ref="threejsContainer"></div>
</template>

<script>
import { defineComponent, ref, onMounted, nextTick } from 'vue';
import ThreejsEngine from '@/plugins/threejs-engine-class'
import EdgeFloorGeoPlugin from './edgeFloorGeoPlugin'
import EdgeTowerGeoPlugin from './edgeTowerGeoPlugin'
export default defineComponent({
  setup() {
    const threejsIns = ref(null)
    const threejsContainer = ref(null)


    if (false) {
      const floorJsonFile = './models2/floor.json'
      ThreejsEngine.use(EdgeFloorGeoPlugin, {geoFile: floorJsonFile})
    } else {
      const towerJsonFile = './models2/tower.json'
      ThreejsEngine.use(EdgeTowerGeoPlugin, {geoFile: towerJsonFile})
    }

    onMounted(() => {
      nextTick(() => {
        threejsIns.value = new ThreejsEngine({
          container: threejsContainer.value
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

