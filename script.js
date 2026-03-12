document.addEventListener('DOMContentLoaded', () => {
    const content = document.querySelector('.hero-content');
    
    // تأثير ظهور ناعم للمحتوى
    content.style.opacity = '0';
    content.style.transform = 'translateY(30px)';
    content.style.transition = 'all 1s ease-out';

    setTimeout(() => {
        content.style.opacity = '1';
        content.style.transform = 'translateY(0)';
    }, 300);

    // تفاعل الزر
    const orderBtn = document.getElementById('orderBtn');
    orderBtn.addEventListener('click', () => {
         location.href = './Pages/custom-drink.html';
    });

     const menuBtn = document.getElementById('menuBtn');
    menuBtn.addEventListener('click', () => {
         location.href = './Pages/menu.html';
    });
});

import * as THREE from 'three';

// إعداد المشهد
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

document.getElementById('canvas-container').appendChild(renderer.domElement);

// الإضاءة
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xe67e22, 2);
pointLight.position.set(5,5,5);
scene.add(pointLight);


// --------- دالة إنشاء حبة قهوة ---------

function createCoffeeBean(){

    const group = new THREE.Group();

    // جسم الحبة
    const beanGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const beanMaterial = new THREE.MeshStandardMaterial({
        color: 0x4b2c20,
        roughness: 0.8,
        metalness: 0.1
    });

    const bean = new THREE.Mesh(beanGeometry, beanMaterial);

    // جعلها بيضاوية
    bean.scale.set(1.2, 0.8, 0.6);

    // شق الحبة
    const crackGeometry = new THREE.TorusGeometry(0.25, 0.03, 16, 100);
    const crackMaterial = new THREE.MeshStandardMaterial({ color: 0x2b1a12 });

    const crack = new THREE.Mesh(crackGeometry, crackMaterial);
    crack.rotation.z = Math.PI / 2;

    group.add(bean);
    group.add(crack);

    return group;
}


// --------- إنشاء الحبات ---------

const particles = [];
const particlesCount = 60;

for(let i=0;i<particlesCount;i++){

    const bean = createCoffeeBean();

    bean.position.set(
        (Math.random()-0.5)*15,
        (Math.random()-0.5)*15,
        (Math.random()-0.5)*15
    );

    const scale = Math.random()*1;
    bean.scale.multiplyScalar(scale);

    scene.add(bean);
    particles.push(bean);
}

camera.position.z = 5;


// حركة الماوس
let mouseX = 0;
let mouseY = 0;

window.addEventListener("mousemove",(e)=>{
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
});


// الانميشن
function animate(){

    requestAnimationFrame(animate);

    particles.forEach((p,i)=>{
        p.rotation.x += 0.01;
        p.rotation.y += 0.005;

        p.position.y += Math.sin(Date.now()*0.001 + i) * 0.005;
    });

    camera.position.x += (mouseX*5 - camera.position.x)*0.05;
    camera.position.y += (-mouseY*5 - camera.position.y)*0.05;

    camera.lookAt(scene.position);

    renderer.render(scene,camera);
}

animate();


// resize
window.addEventListener("resize",()=>{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
});