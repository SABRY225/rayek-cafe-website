document.addEventListener('DOMContentLoaded', () => {
    const content = document.querySelector('.hero-content');
    if (content) {
        content.style.opacity = '0';
        content.style.transform = 'translateY(30px)';
        content.style.transition = 'all 1s ease-out';

        setTimeout(() => {
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
        }, 300);
    }

    const orderBtn = document.getElementById('orderBtn');
    if (orderBtn) {
        orderBtn.addEventListener('click', () => {
            location.href = './Pages/custom-drink.html';
        });
    }

    const menuBtn = document.getElementById('menuBtn');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            location.href = './Pages/menu.html';
        });
    }

    initThreeJS();
});
import * as THREE from 'three';

function initThreeJS() {
    const scene = new THREE.Scene();
    
    scene.background = new THREE.Color(0x0a0a0a);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    const container = document.getElementById('canvas-container');
    if (!container) return;
    container.appendChild(renderer.domElement);

    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const frontLight = new THREE.DirectionalLight(0xfff5e6, 2.0);
    frontLight.position.set(3, 5, 8);
    frontLight.castShadow = true;

    frontLight.shadow.mapSize.width = 1024;
    frontLight.shadow.mapSize.height = 1024;
    scene.add(frontLight);

    const backLight = new THREE.DirectionalLight(0xc47e5a, 1.5);
    backLight.position.set(-3, 1, -8);
    scene.add(backLight);

    const fillLight = new THREE.PointLight(0x8b6b4d, 1.0);
    fillLight.position.set(-6, 2, 4);
    scene.add(fillLight);

    const topLight = new THREE.PointLight(0xffaa66, 0.8);
    topLight.position.set(0, 10, 0);
    scene.add(topLight);

    const gridHelper = new THREE.GridHelper(30, 30, 0x4b2c20, 0x2b1a12);
    gridHelper.position.y = -4;
    scene.add(gridHelper);

    function createDetailedCoffeeBean() {
        const group = new THREE.Group();

        const colors = {
            main: 0x5d3a1a,      
            darkCrack: 0x24140e, 
            lightInside: 0xc9a06f
        };

        const bodyGeo = new THREE.SphereGeometry(0.5, 64, 64);
        const bodyMat = new THREE.MeshStandardMaterial({
            color: colors.main,
            roughness: 0.45, 
            metalness: 0.05,
            emissive: 0x110800,
            emissiveIntensity: 0.05
        });

        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.castShadow = true;
        body.receiveShadow = true;
        body.scale.set(1.5, 0.85, 0.7); 
        group.add(body);

        return group;
    }

    const beans = [];
    const beansCount = 50;

    for (let i = 0; i < beansCount; i++) {
        const bean = createDetailedCoffeeBean();

        const radius = 7;
        const angle = (i / beansCount) * Math.PI * 2;
        
        bean.position.set(
            Math.cos(angle) * radius * (0.6 + Math.random() * 0.4),
            Math.sin(i * 3) * 2.5 + Math.random() * 2 - 1,
            Math.sin(angle) * radius * (0.6 + Math.random() * 0.4)
        );

        bean.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        const scale = Math.random() * 0.9 + 0.7;
        bean.scale.set(scale, scale, scale);

        scene.add(bean);
        beans.push(bean);
    }

    for (let i = 0; i < 8; i++) {
        const bean = createDetailedCoffeeBean();
        bean.position.set(
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 5,
            Math.random() * 4 + 3 
        );
        bean.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        const scale = Math.random() * 0.5 + 0.9; 
        bean.scale.set(scale, scale, scale);
        scene.add(bean);
        beans.push(bean);
    }

    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener("mousemove", (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
    });

    let cameraX = 0;
    let cameraY = 0;
    let cameraZ = 12;

    function animate() {
        requestAnimationFrame(animate);

        beans.forEach((bean, index) => {
            bean.rotation.x += 0.003; 
            bean.rotation.y += 0.004;
            
            bean.position.y += Math.sin(Date.now() * 0.001 + index) * 0.003;
        });

        cameraX += (mouseX * 4 - cameraX) * 0.06;
        cameraY += (-mouseY * 3 - cameraY) * 0.06;
        
        camera.position.x = cameraX;
        camera.position.y = 1 + cameraY;
        camera.position.z = cameraZ;

        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

}