import * as THREE from 'three'

export default function edgeTowerGeoPlugin (ctx, {geoFile}) {
    this.on('loaded', () => {
        const  loader = new THREE.ObjectLoader()
        loader.load(
            geoFile,
            mesh => {
                debugger
                console.log(mesh)
                const floorGroup = mesh.children[1]
                const floorMeshs = floorGroup.children

                floorMeshs.forEach((floorMesh) => {
                    const geo = floorMesh.geometry
                    const edges = new THREE.EdgesGeometry( geo );
                    const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 'green', linewidth: 4 } ) ); // linewidth 不生效
    
                    // buildingGroup.add(buildingLine) // 添加到父结点
                    floorMesh.add(line) // 添加到子结点
                })
                this.scene.add(mesh)
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
