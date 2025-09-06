// ====================
// === Galaxy OS JS ===
// ====================
const canvas = document.getElementById('galaxy-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);

// Galaxy Background Stars
function addStars(num = 500) {
  const geometry = new THREE.BufferGeometry();
  const positions = [];
  for (let i = 0; i < num; i++) {
    positions.push(
      (Math.random()-0.5)*100,
      (Math.random()-0.5)*100,
      (Math.random()-0.5)*100
    );
  }
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({color: 0xffffff, size: 0.5});
  const stars = new THREE.Points(geometry, material);
  scene.add(stars);
}
addStars();

// Core Planets (Apps as planets)
const planets = [
  { name: 'Notes', color: 0xffea00, pos: [8,0,0] },
  { name: 'Music', color: 0x19a1f7, pos: [-12,4,2] },
  { name: 'Gallery', color: 0xdb28e2, pos: [0,14,-3] },
  { name: 'Terminal', color: 0x00ffde, pos: [5,-11,4] }
];

planets.forEach(p => {
  const geo = new THREE.SphereGeometry(2, 32, 32);
  const mat = new THREE.MeshStandardMaterial({ color: p.color, emissive: p.color, emissiveIntensity: 0.4 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(...p.pos);
  mesh.name = p.name;
  scene.add(mesh);
  p.mesh = mesh;
});

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const sun = new THREE.PointLight(0xf9d29c, 2, 100);
sun.position.set(0,0,0);
scene.add(sun);

// Controls (Mouse drag orbit + click)
let dragging = false, lastX=0, lastY=0, rotY = 0, rotX = 0;
canvas.addEventListener('mousedown', e => { dragging = true; lastX=e.clientX; lastY=e.clientY; });
window.addEventListener('mouseup', () => dragging = false);
window.addEventListener('mousemove', e => {
  if(dragging) {
    rotY += (e.clientX-lastX) * 0.01;
    rotX += (e.clientY-lastY) * 0.01;
    lastX = e.clientX; lastY = e.clientY;
  }
});
canvas.addEventListener('wheel', e => {
  camera.position.z += e.deltaY*0.003;
  camera.position.z = Math.max(8, Math.min(100, camera.position.z));
});

// Raycast (click planets)
canvas.addEventListener('click', e => {
  const mouse = new THREE.Vector2(
    (e.clientX/window.innerWidth)*2-1,
    -(e.clientY/window.innerHeight)*2+1
  );
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(planets.map(p=>p.mesh));
  if(intersects.length) {
    planetClicked(intersects[0].object.name);
  }
});
function planetClicked(name) {
  alert(`Launching ${name} app! (Replace alert with your app logic.)`);
  // Animate camera to the planet or open an overlay, then load the app interface!
}

function animate() {
  requestAnimationFrame(animate);
  camera.position.x = Math.sin(rotY) * 22;
  camera.position.y = Math.sin(rotX) * 22;
  camera.position.z = Math.cos(rotY) * 22 + Math.cos(rotX) * 5 + 30;
  camera.lookAt(0,0,0);
  renderer.render(scene, camera);
}
camera.position.set(0,0,50);
animate();

window.addEventListener('resize', ()=> {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
