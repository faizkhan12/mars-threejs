import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import "./style.css";
import vertexShader from "./shader/vertex.glsl";
import fragmentShader from "./shader/fragment.glsl";
import AtmosphereVertexShader from "./shader/atmosphereVertex.glsl";
import AtmosphereFragmentShader from "./shader/atmosphereFragment.glsl";
import gsap from "gsap";

const canvas = document.querySelector("canvas.webgl");

let scene, camera, renderer;

// loader
const textureLoader = new THREE.TextureLoader();

// scene
scene = new THREE.Scene();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// renderer
renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

window.addEventListener("resize", () => {
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

// camera
camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 15;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);

// Sphere
const sphereGeometry = new THREE.SphereGeometry(5, 50, 50);
const sphereMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: {
    globeTexture: {
      value: textureLoader.load("./image/texture/2k_mars.jpeg"),
    },
  },
});

const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

// create atmosphere
const atmosphereGeometry = new THREE.SphereGeometry(5, 50, 50);
const atmosphereMaterial = new THREE.ShaderMaterial({
  vertexShader: AtmosphereVertexShader,
  fragmentShader: AtmosphereFragmentShader,
  side: THREE.BackSide,
  blending: THREE.AdditiveBlending,
});

const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
atmosphereMesh.scale.set(1.1, 1.1, 1.1);

scene.add(atmosphereMesh);

const group = new THREE.Group();
group.add(sphereMesh);
scene.add(group);

// Star Mesh
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.5,
});

const starVerices = [];
for (let i = 0; i < 10000; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = -Math.random() * 1000;
  starVerices.push(x, y, z);
}

starGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(starVerices, 3)
);

const starMesh = new THREE.Points(starGeometry, starMaterial);
scene.add(starMesh);

const mouse = {
  x: undefined,
  y: undefined,
};
addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / sizes.width) * 2 - 1;
  mouse.y = -(e.clientY / sizes.height) * 2 + 1;
});

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // update controls
  controls.update();

  // Renderer
  renderer.render(scene, camera);

  // sphereMesh.rotation.x += 0.003;
  sphereMesh.rotation.y += 0.003;

  gsap.to(group.rotation, {
    x: -mouse.y * 0.5,
    y: mouse.x * 0.5,
    duration: 2,
  });

  window.requestAnimationFrame(tick);
};

tick();
