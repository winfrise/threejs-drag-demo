import * as THREE from 'three'

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

// 生成渐变贴图材质
function generateLinearGradientTexture () {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 64
    
    const ctx = canvas.getContext('2d');
    
    const gradient = ctx.createLinearGradient(0,0, 0,64);

    // Add three color stops
    gradient.addColorStop(0, 'green');
    gradient.addColorStop(1, 'cyan');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return canvas
}


// 生成斑马纹理贴图材质
function generateZebraTexture() {
    // build a small canvas 32x64 and paint it in white
    var canvas1  = document.createElement( 'canvas' );
    canvas1.width = 32;
    canvas1.height    = 64;
    var context1 = canvas1.getContext( '2d' );
    // plain it in white
    context1.fillStyle    = '#ffffff';
    context1.fillRect( 0, 0, 32, 64 );
    // draw the window rows - with a small noise to simulate light variations in each room
    for( var y = 2; y < 64; y += 2 ){
        for( var x = 0; x < 32; x += 2 ){
            var value   = Math.floor( Math.random() * 64 );
            context1.fillStyle = 'rgb(' + [value, value, value].join( ',' )  + ')';
            context1.fillRect( x, y, 2, 1 );
        }
    }
  
    // build a bigger canvas and copy the small one in it
    // This is a trick to upscale the texture without filtering
    const canvas2 = document.createElement( 'canvas' );
    canvas2.width    = 512;
    canvas2.height   = 1024;
    const context2 = canvas2.getContext( '2d' );
    // disable smoothing
    context2.imageSmoothingEnabled        = false;
    context2.webkitImageSmoothingEnabled  = false;
    context2.mozImageSmoothingEnabled = false;
    // then draw the image
    context2.drawImage( canvas1, 0, 0, canvas2.width, canvas2.height );
    return canvas2;
}


// 创建建筑
function createBuildingMesh () {
    const rangeRandom = (minNum, maxNum, float = 3) => {
        return  + (Math.random() * (maxNum - minNum)).toFixed(float) + minNum
    }


    // 建筑几何体
    const buildingHeight = rangeRandom(4, 10)
    const buildingGeometry = new THREE.BoxGeometry( rangeRandom(1, 2), buildingHeight, rangeRandom(1, 2) );

    
    // 建筑几何边缘线
    const buildingEdges = new THREE.EdgesGeometry( buildingGeometry );
    const buildingLine = new THREE.LineSegments( buildingEdges, new THREE.LineBasicMaterial( { color: 'white', linewidth: 4 } ) ); // linewidth 不生效

    // 建筑材质
    const textureImage = Math.random() > 0.5 ? generateZebraTexture() : generateLinearGradientTexture()
    const texture       = new THREE.Texture(textureImage);
    texture.needsUpdate    = true;
    const material  = new THREE.MeshLambertMaterial({ map: texture });

    // 建筑网络
    const buildingMesh= new THREE.Mesh( buildingGeometry, material );


    const buildingGroup = new THREE.Group()
    // 位置信息
    buildingGroup.position.x =  (Math.random() > 0.5 ? -1 : 1) * rangeRandom(0, 20)
    buildingGroup.position.z =  (Math.random() > 0.5 ? -1 : 1) * rangeRandom(0, 20)
    buildingGroup.position.y = buildingHeight / 2
    
    // 旋转角度
    buildingGroup.rotation.y   = 0

    // 缩放
    buildingGroup.scale.x  = 1
    buildingGroup.scale.y  = 1
    buildingGroup.scale.z  = 1

    buildingGroup.add(buildingMesh)
    buildingGroup.add(buildingLine)
    return buildingGroup
}
