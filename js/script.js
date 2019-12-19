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
        let vars = Scene.vars;
        vars.camera.aspect = window.innerWidth / window.innerHeight;
        vars.camera.updateProjectionMatrix();
        vars.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    onMouseMove: (event) => {
        Scene.vars.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        Scene.vars.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    },
    loadFBX: (file, scale, position, rotation, namespace, callback) => {
        let vars = Scene.vars;
        let loader = new FBXLoader();

        if (file === undefined) {
            return;
        }

        loader.load('./fbx/' + file, (object) => {

            object.traverse((child) => {
                if (child.isMesh) {

                    child.castShadow = true;
                    child.receiveShadow = true;

                }
            });

            object.position.x = position[0];
            object.position.y = position[1];
            object.position.z = position[2];

            object.rotation.x = rotation[0];
            object.rotation.y = rotation[1];
            object.rotation.z = rotation[2];

            object.scale.x = object.scale.y = object.scale.z = scale;
            Scene.vars[namespace] = object;

            callback();
        });

    },
    init: () => {
        let vars = Scene.vars;

        // Préparer le container pour la scène
        vars.container = document.createElement('div');
        vars.container.classList.add('fullscreen');
        document.body.appendChild(vars.container);

        // ajout de la scène
        vars.scene = new THREE.Scene();
        vars.scene.background = new THREE.Color(0xa0a0a0);
        vars.scene.fog = new THREE.Fog(vars.scene.background, 100000, 100000);

        // paramétrage du moteur de rendu
        vars.renderer = new THREE.WebGLRenderer({ antialias: true });
        vars.renderer.setPixelRatio(window.devicePixelRatio);
        vars.renderer.setSize(window.innerWidth, window.innerHeight);

        vars.renderer.shadowMap.enabled = true;
        vars.renderer.shadowMapSoft = true;

        vars.container.appendChild(vars.renderer.domElement);

        // ajout de la caméra
        vars.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 30000);
        vars.camera.position.set(0, 1400, 4000);

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





        let mixer;

        const loader = new GLTFLoader();
        const fbxloader = new FBXLoader();

        /*fbxloader.load('./fbx/Letter/A.fbx', function(model) {
            model.position.set(0, 0, 1500);
            model.scale.set(3, 3, 3);
            //console.log(gltf)
            vars.scene.add(model);
        });*/



        loader.load('./fbx/Zelda/scene.gltf', function(gltf) {
            const model = gltf.scene;
            model.position.set(-1300, -10, 0);
            model.scale.set(3, 3, 3);
            model.name = "Zelda";
            Scene.vars[model.name] = gltf;
            //console.log(gltf)
            vars.scene.add(model);
        });

        loader.load('./fbx/Junkrat/scene.gltf', function(gltf) {
            const model = gltf.scene;
            model.position.set(-700, 0, 600);
            model.name = "Junkrat";
            Scene.vars[model.name] = gltf;
            //console.log(gltf)
            vars.scene.add(model);
        });

        loader.load('./fbx/zebrus/scene.gltf', function(gltf) {
            const model = gltf.scene;
            model.position.set(0, 1000, 0);
            model.scale.set(250, 250, 250);
            model.name = "Zebrus";
            Scene.vars[model.name] = gltf;
            //console.log(gltf)
            vars.scene.add(model);
        });

        loader.load('./fbx/BlackDragon/scene.gltf', function(gltf) {
            const model = gltf.scene;
            model.scale.set(0.5, 0.5, 0.5);
            model.name = "BlackDragon";
            Scene.vars[model.name] = gltf;
            //console.log(gltf)
            vars.scene.add(model);
        });

        loader.load('./fbx/Crab/scene.gltf', function(gltf) {
            const model = gltf.scene;
            model.position.set(0, 200, 1000);
            model.rotation.y = Math.PI;
            model.scale.set(50, 50, 50);
            model.name = "Crab";
            Scene.vars[model.name] = gltf;
            //console.log(gltf)
            vars.scene.add(model);
        });


        loader.load('./fbx/Phoenix/scene.gltf', function(gltf) {
            const model = gltf.scene;
            model.position.set(800, 450, 200);
            model.rotation.y = -Math.PI / 2;
            model.scale.set(1, 1, 1);
            model.name = "Phoenix";
            Scene.vars[model.name] = gltf;
            //console.log(gltf)
            vars.scene.add(model);
        });

        /* loader.load('./fbx/LetterA.glb', function(gltf) {
             const model = gltf.scene;
             model.position.set(-300, 200, 1500);
             model.scale.set(1, 1, 1);
             Scene.vars[model.name] = gltf;
             //console.log(gltf)
             vars.scene.add(model);
         });*/


        Scene.loadFBX("PersonnagePaille.fbx", 500, [0, 0, 0], [0, 0, 0], 'PersonnagePaille', () => {
            Scene.loadFBX("Finger.fbx", 2, [0, 0, 0], [0, 0, 0], 'Finger', () => {

                let vars = Scene.vars;

                let PersonnagePaille = new THREE.Group();
                PersonnagePaille.add(vars.PersonnagePaille);
                PersonnagePaille.position.set(1100, 0, 400);
                PersonnagePaille.rotation.y = Math.PI;
                PersonnagePaille.name = "PersonnagePaille"
                    //console.log(PersonnagePaille)
                vars.scene.add(PersonnagePaille);

                let Finger = new THREE.Group();
                Finger.add(vars.Finger);
                Finger.position.set(700, 0, 600);
                Finger.name = "Finger";
                //console.log(Finger)
                vars.scene.add(Finger);

            });
        });
        console.log(Scene.vars)


        // ajout des controles
        vars.controls = new OrbitControls(vars.camera, vars.renderer.domElement);
        // vars.controls.minDistance = 300;
        //vars.controls.maxDistance = 600;
        //vars.controls.minPolarAngle = Math.PI / 4;
        //vars.controls.maxPolarAngle = Math.PI / 2;
        //vars.controls.minAzimuthAngle = -Math.PI / 4;
        //vars.controls.maxAzimuthAngle = Math.PI / 4;
        vars.controls.target.set(0, 100, 0);
        vars.controls.update();

        window.addEventListener('resize', Scene.onWindowResize, false);
        window.addEventListener('mousemove', Scene.onMouseMove, false);

        vars.stats = new Stats();
        vars.container.appendChild(vars.stats.dom);

        Scene.animate();
    }
};

Scene.init();