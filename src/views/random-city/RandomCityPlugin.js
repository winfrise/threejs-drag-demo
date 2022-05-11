import * as THREE from 'three'

function rangeRandom(minNum, maxNum, float = 3) {
    return  + (Math.random() * (maxNum - minNum)).toFixed(float) + minNum
}

function createBuildingMesh () {
    const buildingHeight = rangeRandom(4, 10)
    const buildingGeometry = new THREE.BoxGeometry( rangeRandom(1, 2), buildingHeight, rangeRandom(1, 2) );
    const buildingMesh= new THREE.Mesh( buildingGeometry );
    buildingMesh.position.x =  (Math.random() > 0.5 ? -1 : 1) * rangeRandom(0, 20)
    buildingMesh.position.z =  (Math.random() > 0.5 ? -1 : 1) * rangeRandom(0, 20)
    buildingMesh.position.y = buildingHeight / 2
    // put a random rotation
    buildingMesh.rotation.y   = 0
    // put a random scale
    buildingMesh.scale.x  = 1
    buildingMesh.scale.y  = 1
    buildingMesh.scale.z  = 1
    return buildingMesh
}


export default function RandomCityPlugin () {
    this.on('loaded', () => {
        const { scene } = this

        // 网格
        const grid = new THREE.GridHelper(50, 100, 0x000000, 0x000000);
        grid.position.set(0, 0, 0)
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        scene.add(grid);



        var cityGroup = new THREE.Group();
        for( var i = 0; i < 20; i ++ ){
            // buildMesh
            const buildingMesh = createBuildingMesh()
            cityGroup.add(buildingMesh)
        }

        scene.add(cityGroup)
    })

}
