import * as THREE from 'three'
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import Animations from './utils/animations'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";

export default class ThreejsEngine {
  constructor(options) {
    this._options = options
    this.scene = null;
    this.renderer = null;
    this.labelRenderer = null;
    this.camera = null

    this._events = []

    this._installPlugins()

    this._init()
    this._animate()
  }
  
  _installPlugins() {
    const plugins = ThreejsEngine._installedPlugins
    plugins.forEach(([fn, args]) => {
      fn.call(this, this, ...args)
    })
  }
  static _installedPlugins = []
  // 添加插件的方法
  static use(plugin, ...args) {
    const installedPlugins = ThreejsEngine._installedPlugins

    installedPlugins.push([plugin, args])
    return this
  }
  _init() {
    // 场景
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x582424);
    if (this._options.fog) {
      this.scene.fog = new THREE.Fog(0xeeeeee, 0, 100);
    }

    // WebGLRenderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;

    this.container = typeof this._options.container === 'string' ? document.querySelector(this._options.container) : this._options.container
    this.container.appendChild(this.renderer.domElement);

    // 添加2d渲染图层
    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0px';
    this.labelRenderer.domElement.style.pointerEvents = 'none';
    document.body.appendChild(this.labelRenderer.domElement);

    // 透视相机：视场、长宽比、近面、远面
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(120, 100, 100);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    // threejs中采用的是右手坐标系，红线是X轴，绿线是Y轴，蓝线是Z轴
    // const axes = new THREE.AxisHelper(30);
    // scene.add(axes);

    // 半球光源：创建室外效果更加自然的光源
    const cubeGeometry = new THREE.BoxGeometry(0.001, 0.001, 0.001);
    const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    this.directionLight = new THREE.DirectionalLight(0xb5b1c1, 1);
    this.directionLight.intensity = 1.2;
    this.directionLight.position.set(20, 20, 5);
    this.directionLight.castShadow = true;
    this.directionLight.target = cube;
    this.directionLight.shadow.mapSize.width = 512 * 12;
    this.directionLight.shadow.mapSize.height = 512 * 12;
    this.directionLight.shadow.camera.top = 130;
    this.directionLight.shadow.camera.bottom = - 80;
    this.directionLight.shadow.camera.left = - 70;
    this.directionLight.shadow.camera.right = 80;
    this.scene.add(this.directionLight);

    // const lightHelper = new THREE.DirectionalLightHelper(directionLight, 1, 'red');
    // scene.add(lightHelper);
    // const lightCameraHelper = new THREE.CameraHelper(directionLight.shadow.camera);
    // scene.add(lightCameraHelper);

    // 环境光
    this.ambientLight = new THREE.AmbientLight(0x605a64);
    this.scene.add(this.ambientLight);

    // 网格
    // const grid = new THREE.GridHelper(50, 100, 0x000000, 0x000000);
    // grid.position.set(0, 0, 0)
    // grid.material.opacity = 0.2;
    // grid.material.transparent = true;
    // this.scene.add(grid);



    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0, 0);
    this.controls.enableDamping = true;


    const stats = new Stats();
    document.documentElement.appendChild(stats.dom);

    if (this._options.modelFile) {
      this._loadModel()
    }
   
    this.emit('loaded')
  }
  _loadModel() {
    // 加载模型
    const modelFile = this._options.modelFile
    var loader 
    if (modelFile.endsWith('.fbx')) {
      loader = new FBXLoader();
    } else {
      loader = new THREE.ObjectLoader()
    }

    loader.load(
        modelFile,
        mesh => {
            mesh.rotation.y = Math.PI / 2;
            mesh.position.set(0, 0, 0);
            mesh.scale.set(1, 1, 1);
            this.scene.add(mesh);
            this.emit('modelLoaded')
        }, 
        res => {
            if (Number((res.loaded / res.total * 100).toFixed(0)) === 100) {
                Animations.animateCamera(
                this.camera,
                this.controls,
                { x: 0, y: 10, z: 20 }, { x: 0, y: 0, z: 0 }, 4000, () => { }
                );
            }
        }, 
        err => {
            console.log(err);
        }
    );
  }
  _animate() {
    requestAnimationFrame(this._animate.bind(this));
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
    this.stats && this.stats.update();
    TWEEN && TWEEN.update();
    this.controls && this.controls.update();
  }
  on(type, handler) {
    const events = (this._events[type] || (this._events[type] = []))
    events.push(handler)
  }
  emit(type, ...args) {
    const events = this._events[type] || []
    events.forEach(fn => fn(...args))
  }
}
