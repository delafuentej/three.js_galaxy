import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

/**
 * Base
 */
// Debug
const gui = new GUI({width: 300});

gui.close();
gui.hide()

window.addEventListener('keydown', event => {
    if(event.key === 'h') gui.show(gui._hidden)
})
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();



/**
 * Galaxy
 */
const parameters = {};
parameters.count = 100000;
parameters.size =  0.02;
// radius of the galaxy
parameters.radius = 5; 
parameters.branches = 3;
parameters.spin = 1;
parameters.randomness = 0.2;
parameters.randomnessPower = 3;
parameters.insideColor = '#ff6030';
parameters.outsideColor = '#5706d0';//'#1b3964'

let particlesGeometry;
let particlesMaterial;
let particles;

const generateGalaxy = () => {
    // to destroy the old galaxy
    if(particles) {
        // dispose() method to destroy the geometry and the material properly
        // to remove the BufferGeometry while the application is running
        particlesGeometry.dispose();
        particlesMaterial.dispose();
        scene.remove(particles);
    }
    /**
     * Geometry
     */
     particlesGeometry = new THREE.BufferGeometry();

    const positions = new Float32Array(parameters.count * 3);

    const colors = new Float32Array(parameters.count * 3);

    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);
    
    
    

    for(let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;


        const radius = Math.random() * parameters.radius;

        // create random particles based on that count parameter starting from
        // the center
        // positions[i3] = radius;//x
        // positions[i3 + 1] = 0;//y
        // positions[i3 + 2] = 0;//z
       
        // to position the partickes on those branches
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;
        // if(i< 20){
        //     console.log(i, branchAngle);
        // }
        // positions[i3] = Math.cos(branchAngle) * radius;
        // positions[i3 + 1] = 0;//y
        // positions[i3 + 2] = Math.sin(branchAngle) * radius;
        // positions[i3] = (Math.random() - 0.5) * 3; // -3 <= value <= 3
        // positions[i3 + 1] = (Math.random() - 0.5) * 3;
        // positions[i3 + 2] = (Math.random() - 0.5) * 3;

        //SPIN EFFECT
        const spinAngle = radius * parameters.spin;
        // particles to spreed more on the outside =>
        //create a random value for each axis and multiply it be the radius
        // and randomness parameters, then apply them to the position
        //then apply the power with Math.pow and multiply it by -1 randomly to 
        // have nevative values too
        const randomX =  Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);//(Math.random() - 0.5) * parameters.randomness;
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);//(Math.random() - 0.5) * parameters.randomness;
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);// (Math.random() - 0.5) * parameters.randomness;

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY;//y
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        //colors
        //create a third color: mixedColor; by cloning the colorInside and use
        // the lerp() method to mix it with the colorOutside
        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside,  radius / parameters.radius);

        colors[i3] = mixedColor.r;//Math.cos(branchAngle + spinAngle) * radius + randomX;
        colors[i3 + 1] = mixedColor.g;//randomY;//y
        colors[i3 + 2] = mixedColor.b;//Math.sin(branchAngle + spinAngle) * radius + randomZ;
    }

    //console.log(positions)
    //3 = how many values per vertex is there: x,y,z
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    /**
     * Material
     */
      particlesMaterial = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true, // to specify if distant particles should be smaller than close particles
        depthWrite: false, // it does not write particles in that depth buffer with depthTest
        blending: THREE.AdditiveBlending, // blending => to add the color of the pixel to the color of the pixel already drawn
        //color: '#ff5588'
        // to activate the vertexColors on the material:
        vertexColors: true,
    })

    /**
     * Particles
     */
     particles = new THREE.Points(particlesGeometry, particlesMaterial);

    scene.add(particles)
};

generateGalaxy()

// Tweaks
gui.add(parameters, 'count')
    .min(100)
    .max(100000)
    .step(1000)
    .onFinishChange(generateGalaxy)

gui.add(parameters, 'size')
    .min(0.001)
    .max(0.1)
    .step(0.001)
    .onFinishChange(generateGalaxy)

gui.add(parameters, 'radius')
    .min(0.01)
    .max(20)
    .step(0.01)
    .onFinishChange(generateGalaxy)

gui.add(parameters, 'branches')
    .min(2)
    .max(20)
    .step(1)
    .onFinishChange(generateGalaxy);

gui.add(parameters, 'spin')
    .min(-5)
    .max(5)
    .step(0.001)
    .onFinishChange(generateGalaxy);

gui.add(parameters, 'randomness')
    .min(0)
    .max(2)
    .step(0.001)
    .onFinishChange(generateGalaxy);

gui.add(parameters, 'randomnessPower')
    .min(1)
    .max(10)
    .step(0.001)
    .onFinishChange(generateGalaxy);

gui.addColor(parameters, 'insideColor')
    .onFinishChange(generateGalaxy);

gui.addColor(parameters, 'outsideColor')
    .onFinishChange(generateGalaxy);


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

tick();