import * as THREE from '../vendor/three.js-master/build/three.module.js';
import Stats from '../vendor/three.js-master/examples/jsm/libs/stats.module.js';
import { OrbitControls } from '../vendor/three.js-master/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from '../vendor/three.js-master/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from '../vendor/three.js-master/examples/jsm/loaders/GLTFLoader.js';

const Scene = {
    vars: {
        container: null,
        scene: null,
        renderer: null,
        camera: null,
        stats: null,
        controls: null,
        texture: null,
        mouse: new THREE.Vector2(),
        raycaster: new THREE.Raycaster(),
        animSpeed: null,
        animPercent: 0.00,
        loaderFBX: new FBXLoader(),
        loaderGLTF:new GLTFLoader(),
        mixer:null
    },
    animate: () => {
        requestAnimationFrame(Scene.animate);
        Scene.vars.raycaster.setFromCamera(Scene.vars.mouse, Scene.vars.camera);

        if (Scene.vars.goldGroup !== undefined) {
            let intersects = Scene.vars.raycaster.intersectObjects(Scene.vars.goldGroup.children, true);

            if (intersects.length > 0) {
                Scene.vars.animSpeed = 0.05;
            } else {
                Scene.vars.animSpeed = -0.05;
            }

        }

        Scene.render();
    },
    render: () => {
        Scene.vars.renderer.render(Scene.vars.scene, Scene.vars.camera);
        Scene.vars.stats.update();
    },
    onWindowResize: () => {
        Scene.vars.camera.aspect = window.innerWidth / window.innerHeight;
        Scene.vars.camera.updateProjectionMatrix();
        Scene.vars.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    onMouseMove: (event) => {
        Scene.vars.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        Scene.vars.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    },
    loadObject:()=>{
        let vars = Scene.vars;

        /*fbxloader.load('./fbx/Letter/A.fbx', function(model) {
            model.position.set(0, 0, 1500);
            model.scale.set(3, 3, 3);
            //console.log(gltf)
            vars.scene.add(model);
        });*/

        vars.loaderGLTF.load('./fbx/Zelda/scene.gltf', function(gltf) {
            const model = gltf.scene;
            model.position.set(-1300, -10, 0);
            model.scale.set(3, 3, 3);
            model.name = "Zelda";
            vars[model.name] = gltf;
            vars.scene.add(model);
        });

        vars.loaderGLTF.load('./fbx/Junkrat/scene.gltf', function(gltf) {
            const model = gltf.scene;
            model.position.set(-700, 0, 600);
            model.name = "Junkrat";
            vars[model.name] = gltf;
            vars.scene.add(model);
        });

        vars.loaderGLTF.load('./fbx/zebrus/scene.gltf', function(gltf) {
            const model = gltf.scene;
            model.position.set(0, 1000, 0);
            model.scale.set(250, 250, 250);
            model.name = "Zebrus";
            vars[model.name] = gltf;
            vars.scene.add(model);
        });

        vars.loaderGLTF.load('./fbx/BlackDragon/scene.gltf', function(gltf) {
            const model = gltf.scene;
            model.scale.set(0.5, 0.5, 0.5);
            model.name = "BlackDragon";
            vars[model.name] = gltf;
            vars.scene.add(model);
        });

        vars.loaderGLTF.load('./fbx/Crab/scene.gltf', function(gltf) {
            const model = gltf.scene;
            model.position.set(0, 200, 1000);
            model.rotation.y = Math.PI;
            model.scale.set(50, 50, 50);
            model.name = "Crab";
            vars[model.name] = gltf;
            vars.scene.add(model);
        });

        vars.loaderGLTF.load('./fbx/Phoenix/scene.gltf', function(gltf) {
            const model = gltf.scene;
            model.position.set(800, 450, 200);
            model.rotation.y = -Math.PI / 2;
            model.scale.set(1, 1, 1);
            model.name = "Phoenix";
            vars[model.name] = gltf;
            vars.scene.add(model);
        });

        /* vars.loaderGLTF.load('./fbx/LetterA.glb', function(gltf) {
             const model = gltf.scene;
             model.position.set(-300, 200, 1500);
             model.scale.set(1, 1, 1);
             Scene.vars[model.name] = gltf;
             //console.log(gltf)
             vars.scene.add(model);
         });*/

          vars.loaderFBX.load('./fbx/PersonnagePaille.fbx', function(object) {
            object.position.set(1100, 0, 400);
            object.scale.set(500,500,500);
            object.rotation.y=Math.PI;
            object.name="PersonnagePaille";
            vars.scene.add(object);
         });

         vars.loaderFBX.load('./fbx/Finger.fbx', function(object) {
            object.position.set(700, 0, 600);
            object.scale.set(2,2,2);
            object.name="Finger";
            vars.scene.add(object);
         });
    },
    addLights:()=>{
        let vars = Scene.vars;

        // ajout de la lumière
        const lightIntensityHemisphere = .5;
        let light = new THREE.HemisphereLight(0xFFFFFF, 0x444444, lightIntensityHemisphere);
        light.position.set(0, 700, 0);
        vars.scene.add(light);

        // ajout des directionelles
        const lightIntensity = .8;
        const d = 1000;
        let light1 = new THREE.DirectionalLight(0xFFFFFF, lightIntensity);
        light1.position.set(0, 700, 0);
        light1.castShadow = true;
        light1.shadow.camera.left = -d;
        light1.shadow.camera.right = d;
        light1.shadow.camera.top = d;
        light1.shadow.camera.bottom = -d;
        light1.shadow.camera.far = 2000;
        light1.shadow.mapSize.width = 4096;
        light1.shadow.mapSize.height = 4096;
        vars.scene.add(light1);
        // let helper = new THREE.DirectionalLightHelper(light1, 5);
        // vars.scene.add(helper);

        let light2 = new THREE.DirectionalLight(0xFFFFFF, lightIntensity);
        light2.position.set(-400, 200, 400);
        light2.castShadow = true;
        light2.shadow.camera.left = -d;
        light2.shadow.camera.right = d;
        light2.shadow.camera.top = d;
        light2.shadow.camera.bottom = -d;
        light2.shadow.camera.far = 2000;
        light2.shadow.mapSize.width = 4096;
        light2.shadow.mapSize.height = 4096;
        vars.scene.add(light2);
        // let helper2 = new THREE.DirectionalLightHelper(light2, 5);
        // vars.scene.add(helper2);

        let light3 = new THREE.DirectionalLight(0xFFFFFF, lightIntensity);
        light3.position.set(400, 200, 400);
        light3.castShadow = true;
        light3.shadow.camera.left = -d;
        light3.shadow.camera.right = d;
        light3.shadow.camera.top = d;
        light3.shadow.camera.bottom = -d;
        light3.shadow.camera.far = 2000;
        light3.shadow.mapSize.width = 4096;
        light3.shadow.mapSize.height = 4096;
        vars.scene.add(light3);
        // let helper3 = new THREE.DirectionalLightHelper(light3, 5);
        // vars.scene.add(helper3);
    },
    addControls:()=>{
        // ajout des controles
        Scene.vars.controls = new OrbitControls(Scene.vars.camera, Scene.vars.renderer.domElement);
        //vars.controls.minDistance = 300;
        //vars.controls.maxDistance = 600;
        //vars.controls.minPolarAngle = Math.PI / 2;
        Scene.vars.controls.maxPolarAngle = Math.PI / 2;
        Scene.vars.controls.minAzimuthAngle = -Math.PI / 2;
        Scene.vars.controls.maxAzimuthAngle = Math.PI / 2;
        Scene.vars.controls.target.set(0, 100, 0);
        Scene.vars.controls.update();
    },
    addScene:()=>{
        // Préparer le container pour la scène
        Scene.vars.container = document.createElement('div');
        Scene.vars.container.classList.add('fullscreen');
        document.body.appendChild(Scene.vars.container);

        // ajout de la scène
        Scene.vars.scene = new THREE.Scene();
        Scene.vars.scene.background = new THREE.Color(0xad1818);
    },
    moteurRendu:()=>{
        // paramétrage du moteur de rendu
        Scene.vars.renderer = new THREE.WebGLRenderer({ antialias: true });
        Scene.vars.renderer.setPixelRatio(window.devicePixelRatio);
        Scene.vars.renderer.setSize(window.innerWidth, window.innerHeight);

        Scene.vars.renderer.shadowMap.enabled = true;
        Scene.vars.renderer.shadowMapSoft = true;

        Scene.vars.container.appendChild(Scene.vars.renderer.domElement);
    },
    addCamera:()=>{
        // ajout de la caméra
        Scene.vars.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 30000);
        Scene.vars.camera.position.set(0, 1400, 4000);
    },
    addStats:()=>{
        Scene.vars.stats = new Stats();
        Scene.vars.container.appendChild(Scene.vars.stats.dom);
    },
    init: () => {
        Scene.addScene();
        Scene.moteurRendu();
        Scene.addCamera();
        Scene.addLights();
        Scene.addControls();
        Scene.loadObject();
        Scene.addStats();
        
        console.log(Scene.vars)

        window.addEventListener('resize', Scene.onWindowResize, false);
        window.addEventListener('mousemove', Scene.onMouseMove, false);

        Scene.animate();
    }
};

Scene.init();