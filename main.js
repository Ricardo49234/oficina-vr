import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.159.0/build/three.module.min.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.159.0/examples/jsm/loaders/GLTFLoader.js';

// Configuración de la escena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Luz ambiental
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);

// Suelo
const floorGeometry = new THREE.PlaneGeometry(10, 10);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Cámara en posición inicial
camera.position.set(0, 2, 5);

// Variables para el personaje
let personaje;
const loader = new GLTFLoader();
loader.load('modelo.glb', (gltf) => {
    personaje = gltf.scene;
    personaje.position.set(0, 0, 0);
    scene.add(personaje);
}, undefined, (error) => {
    console.error('Error al cargar el modelo:', error);
});

// Movimiento del personaje con W, A, S, D
const velocidad = 0.05;
const teclas = { W: false, A: false, S: false, D: false };

window.addEventListener('keydown', (event) => {
    if (event.key.toUpperCase() in teclas) {
        teclas[event.key.toUpperCase()] = true;
    }
});

window.addEventListener('keyup', (event) => {
    if (event.key.toUpperCase() in teclas) {
        teclas[event.key.toUpperCase()] = false;
    }
});

// Función para hablar
function hablar(texto) {
    const speech = new SpeechSynthesisUtterance(texto);
    speech.lang = 'es-ES';
    window.speechSynthesis.speak(speech);
}

// Evento para que el personaje hable al presionar el botón
document.getElementById('btnHablar').addEventListener('click', () => {
    hablar("Hola, bienvenido a la oficina virtual.");
});

// Animación
function animate() {
    requestAnimationFrame(animate);

    if (personaje) {
        if (teclas.W) personaje.position.z -= velocidad;
        if (teclas.S) personaje.position.z += velocidad;
        if (teclas.A) personaje.position.x -= velocidad;
        if (teclas.D) personaje.position.x += velocidad;
    }

    renderer.render(scene, camera);
}
animate();

// Ajustar tamaño al cambiar la ventana
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});