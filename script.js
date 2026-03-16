document.addEventListener('DOMContentLoaded', () => {
    // --- منطق واجهة المستخدم (UI Logic) ---
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

    // --- محرك Three.js لحبات القهوة ---
    initThreeJS();
});
import * as THREE from 'three';

function initThreeJS() {
    const scene = new THREE.Scene();
    
    // جعل لون الخلفية غامقاً جداً لتبدو الحبات أوضح وأكثر بروزاً
    scene.background = new THREE.Color(0x0a0a0a);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false }); // alpha: false
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    const container = document.getElementById('canvas-container');
    if (!container) return;
    container.appendChild(renderer.domElement);

    // --- إضاءة محسنة لإبراز تفاصيل الـ 3D والعمق ---
    
    // إضاءة محيطة خفيفة للحفاظ على الظلال
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // إضاءة اتجاهية رئيسية من الأمام والأعلى (مثل استوديو تصوير)
    const frontLight = new THREE.DirectionalLight(0xfff5e6, 2.0);
    frontLight.position.set(3, 5, 8);
    frontLight.castShadow = true;
    // تحسين الظلال
    frontLight.shadow.mapSize.width = 1024;
    frontLight.shadow.mapSize.height = 1024;
    scene.add(frontLight);

    // إضاءة خلفية دافئة لإبراز الحواف
    const backLight = new THREE.DirectionalLight(0xc47e5a, 1.5);
    backLight.position.set(-3, 1, -8);
    scene.add(backLight);

    // إضاءة جانبية ناعمة لملء الظلال
    const fillLight = new THREE.PointLight(0x8b6b4d, 1.0);
    fillLight.position.set(-6, 2, 4);
    scene.add(fillLight);

    // إضاءة من الأعلى لإبراز الأسطح
    const topLight = new THREE.PointLight(0xffaa66, 0.8);
    topLight.position.set(0, 10, 0);
    scene.add(topLight);

    // --- شبكة أرضية دقيقة (اختياري) ---
    const gridHelper = new THREE.GridHelper(30, 30, 0x4b2c20, 0x2b1a12);
    gridHelper.position.y = -4;
    scene.add(gridHelper);

    // --- دالة إنشاء حبة قهوة واقعية ومفصلة ---
    function createDetailedCoffeeBean() {
        const group = new THREE.Group();

        // ألوان مشتقة من الصورة
        const colors = {
            main: 0x5d3a1a,      // لون البني الرئيسي الغني
            darkCrack: 0x24140e, // لون الشق الداكن جداً
            lightInside: 0xc9a06f // اللون الفاتح داخل الشق
        };

        // 1. الجسم الرئيسي للحبة (Mesh 1)
        const bodyGeo = new THREE.SphereGeometry(0.5, 64, 64); // دقة أعلى لنعومة الشكل
        const bodyMat = new THREE.MeshStandardMaterial({
            color: colors.main,
            roughness: 0.45, // لمسة نهائية غير لامعة تماماً
            metalness: 0.05,
            emissive: 0x110800,
            emissiveIntensity: 0.05
        });

        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.castShadow = true;
        body.receiveShadow = true;
        body.scale.set(1.5, 0.85, 0.7); // شكل بيضاوي دقيق
        group.add(body);

        return group;
    }

    // --- إنشاء الحبات مع ضمان ظهورها في نطاق الكاميرا وتوزيعها بشكل أفضل ---
    const beans = [];
    const beansCount = 50; // زدت العدد قليلاً لزيادة الكثافة

    for (let i = 0; i < beansCount; i++) {
        const bean = createDetailedCoffeeBean();

        // توزيع الحبات في نطاق مرئي ومحدود
        const radius = 7;
        const angle = (i / beansCount) * Math.PI * 2;
        
        // توزيع بشكل دائري مع اختلاف في الارتفاع والعمق
        bean.position.set(
            Math.cos(angle) * radius * (0.6 + Math.random() * 0.4),
            Math.sin(i * 3) * 2.5 + Math.random() * 2 - 1,
            Math.sin(angle) * radius * (0.6 + Math.random() * 0.4)
        );

        // دوران عشوائي
        bean.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        // أحجام متناسبة
        const scale = Math.random() * 0.9 + 0.7;
        bean.scale.set(scale, scale, scale);

        scene.add(bean);
        beans.push(bean);
    }

    // --- إضافة بعض الحبات القريبة جداً للكاميرا لإعطاء عمق ---
    for (let i = 0; i < 8; i++) {
        const bean = createDetailedCoffeeBean();
        bean.position.set(
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 5,
            Math.random() * 4 + 3 // قريبة جداً من الكاميرا
        );
        bean.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        const scale = Math.random() * 0.5 + 0.9; // أحجام أكبر للقريبة
        bean.scale.set(scale, scale, scale);
        scene.add(bean);
        beans.push(bean);
    }

    // --- تفاعل الماوس ---
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener("mousemove", (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
    });

    // --- متغيرات للتحكم في الكاميرا ---
    let cameraX = 0;
    let cameraY = 0;
    let cameraZ = 12;

    // --- حلقة الأنميشن ---
    function animate() {
        requestAnimationFrame(animate);

        // دوران الحبات
        beans.forEach((bean, index) => {
            bean.rotation.x += 0.003; // حركة أسرع قليلاً
            bean.rotation.y += 0.004;
            
            // حركة خفيفة تموجية
            bean.position.y += Math.sin(Date.now() * 0.001 + index) * 0.003;
        });

        // تحريك الكاميرا بناءً على الماوس بشكل أكثر سلاسة
        cameraX += (mouseX * 4 - cameraX) * 0.06;
        cameraY += (-mouseY * 3 - cameraY) * 0.06;
        
        camera.position.x = cameraX;
        camera.position.y = 1 + cameraY;
        camera.position.z = cameraZ;

        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }

    animate();

    // --- استجابة حجم الشاشة ---
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // --- للتأكد من ظهور الحبات، طباعة عددها في الكونسول ---
    console.log(`تم إنشاء ${beans.length} حبة قهوة مفصلة`);
}