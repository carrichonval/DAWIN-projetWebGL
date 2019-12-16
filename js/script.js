import * as THREE from '../vendor/three.js-master/build/three.module.js';
import Stats from '../vendor/three.js-master/examples/jsm/libs/stats.module.js';
import { OrbitControls } from '../vendor/three.js-master/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from '../vendor/three.js-master/examples/jsm/loaders/FBXLoader.js';

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
        text: "DAWIN"
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
        vars.scene.fog = new THREE.Fog(vars.scene.background, 20000, 20000);

        // paramétrage du moteur de rendu
        vars.renderer = new THREE.WebGLRenderer({ antialias: true });
        vars.renderer.setPixelRatio(window.devicePixelRatio);
        vars.renderer.setSize(window.innerWidth, window.innerHeight);

        vars.renderer.shadowMap.enabled = true;
        vars.renderer.shadowMapSoft = true;

        vars.container.appendChild(vars.renderer.domElement);

        // ajout de la caméra
        vars.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 30000);
        vars.camera.position.set(2000, 1000, 2000);

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

        // ajout du sol
        let mesh = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(6000, 6000),
            new THREE.MeshLambertMaterial({ color: new THREE.Color(0x888888) })
        );
        mesh.traverse((child) => {
            child.material = new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load('./texture/marbre.jpg')
            });
        });
        mesh.rotation.x = -Math.PI / 2;
        mesh.receiveShadow = false;
        vars.scene.add(mesh);

        let planeMaterial = new THREE.ShadowMaterial();
        planeMaterial.opacity = 0.07;
        let shadowPlane = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(2000, 2000),
            planeMaterial);
        shadowPlane.rotation.x = -Math.PI / 2;
        shadowPlane.receiveShadow = true;

        vars.scene.add(shadowPlane);


        let hash = document.location.hash.substr(1);
        if (hash.length !== 0) {
            let text = hash.substring();
            Scene.vars.text = decodeURI(text);
        }

        /*
                var loader = new FBXLoader();
                var textureLoader = new THREE.TextureLoader();
                var map = textureLoader.load('./texture/f_med_scarecrow_backpack.png');
                var map1 = textureLoader.load('./texture/f_med_scarecrow_head.png');
                var map2 = textureLoader.load('./texture/f_med_scarecrow.png');
                var materials = [new THREE.MeshPhongMaterial({ map: map }),
                    new THREE.MeshPhongMaterial({ map: map1 }),
                    new THREE.MeshPhongMaterial({ map: map2 })
                ];

                
                        loader.load('./fbx/chala.fbx', function(object3d) {
                            // For any meshes in the model, add our material.
                            object3d.traverse(function(node) {

                                if (node.isMesh) node.material = materials;

                            });
                            object3d.position.set(0, 0, 0);
                            object3d.scale.set(500, 500, 500)
                            console.log(object3d)
                            vars.scene.add(object3d);
                        });*/



        Scene.loadFBX("PersonnagePaille.fbx", 500, [0, 0, 0], [0, 0, 0], 'PersonnagePaille', () => {
            let vars = Scene.vars;
            let PersonnagePaille = new THREE.Group();
            PersonnagePaille.add(vars.PersonnagePaille);
            PersonnagePaille.position.set(0, 0, 0);
            PersonnagePaille.rotation.y = Math.PI;
            vars.scene.add(PersonnagePaille);
        });


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

        vars.stats = new Stats();
        vars.container.appendChild(vars.stats.dom);

        Scene.animate();
    }
};

Scene.init();