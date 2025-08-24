document.addEventListener('DOMContentLoaded', function() {
  // 初始化场景、相机、渲染器
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance" // 强调性能
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 控制像素比以提高性能
  document.getElementById('particle-canvas').appendChild(renderer.domElement);

  // 创建粒子群组，以便整体控制
  const particleGroup = new THREE.Group();
  scene.add(particleGroup);

  // 创建多种粒子类型，增加宇宙的丰富度
  const particleTypes = 3;
  const particlesCount = 5000; // 增加粒子数量

  for (let t = 0; t < particleTypes; t++) {
      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCountType = Math.floor(particlesCount / particleTypes);
      
      const posArray = new Float32Array(particlesCountType * 3);
      const colorArray = new Float32Array(particlesCountType * 3);
      
      // 为每种粒子类型设置不同的颜色和分布
      const baseHue = t / particleTypes;
      
      for (let i = 0; i < particlesCountType * 3; i += 3) {
          // 创建球形分布
          const radius = 10 + Math.random() * 20;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos((Math.random() * 2) - 1);
          
          posArray[i] = radius * Math.sin(phi) * Math.cos(theta);
          posArray[i+1] = radius * Math.sin(phi) * Math.sin(theta);
          posArray[i+2] = radius * Math.cos(phi);
          
          // 设置颜色 - 基于类型略有变化
          const hueVariation = baseHue + (Math.random() * 0.1 - 0.05);
          colorArray[i] = hueVariation; // R
          colorArray[i+1] = hueVariation + 0.2; // G
          colorArray[i+2] = hueVariation + 0.4; // B
      }
      
      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
      
      // 不同大小的粒子
      const size = 0.05 + (Math.random() * 0.05);
      
      const particlesMaterial = new THREE.PointsMaterial({
          size: size,
          vertexColors: true,
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true
      });
      
      const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
      
      // 为每种粒子设置不同的初始位置和旋转速度
      particlesMesh.userData = {
          speedX: (Math.random() - 0.5) * 0.001,
          speedY: (Math.random() - 0.5) * 0.001,
          speedZ: (Math.random() - 0.5) * 0.001,
          pulseSpeed: Math.random() * 0.01
      };
      
      particleGroup.add(particlesMesh);
  }

  camera.position.z = 25;

  // 动画循环 - 自主运行，不受鼠标影响
  const clock = new THREE.Clock();
  
  function animate() {
      requestAnimationFrame(animate);
      
      const elapsedTime = clock.getElapsedTime();
      
      // 整体旋转
      particleGroup.rotation.x = elapsedTime * 0.05;
      particleGroup.rotation.y = elapsedTime * 0.03;
      particleGroup.rotation.z = elapsedTime * 0.02;
      
      // 单个粒子系统运动
      particleGroup.children.forEach((particlesMesh, index) => {
          const { speedX, speedY, speedZ, pulseSpeed } = particlesMesh.userData;
          
          // 每个粒子系统有自己的微小运动
          particlesMesh.rotation.x += speedX;
          particlesMesh.rotation.y += speedY;
          particlesMesh.rotation.z += speedZ;
          
          // 粒子大小脉冲效果
          const scale = 0.9 + Math.sin(elapsedTime * pulseSpeed) * 0.1;
          particlesMesh.scale.set(scale, scale, scale);
      });
      
      // 渲染场景
      renderer.render(scene, camera);
  }
  
  animate();

  // 响应窗口大小变化
  window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
  });
});