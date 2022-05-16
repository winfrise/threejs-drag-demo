import * as THREE from 'three'

export default function edgeFloorGeoPlugin (ctx, {geoFile}) {
    this.on('loaded', () => {
        const  loader = new THREE.ObjectLoader()
        loader.load(
            geoFile,
            mesh => {
                // const buildingGroup = mesh.children[0].children[1]
                const buildingGroup = mesh.getObjectByName('floor')
                const buildingMesh = buildingGroup.children[0]
                const buildingGeometry = buildingMesh.geometry
                const buildingEdges = new THREE.EdgesGeometry( buildingGeometry );
                const buildingLine = new THREE.LineSegments( buildingEdges, new THREE.LineBasicMaterial( { color: 'green', linewidth: 4 } ) ); // linewidth 不生效

                // buildingGroup.add(buildingLine) // 添加到父结点
                buildingMesh.add(buildingLine) // 添加到子结点
                // this.scene.add(buildingLine) // 添加根结点
                this.scene.add(mesh)
                console.log(mesh)
                // this.scene.add(customDirectionalLight)
                // this.scene.add(customAmbientLight)
                // this.scene.add(meshGroup)
            }, 
            res => {
                const { loaded, total} = res
                this.emit('modelProgress', {loaded, total})
            }, 
            err => {
                console.log(err);
            }
        );





    })

}
