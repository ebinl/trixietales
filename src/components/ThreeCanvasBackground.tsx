import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * ThreeCanvasBackground renders the 3D rotating Trixietales camera logo PNG
 * in the background with interactive 3D rotation, metallic gold reflections,
 * orbiting halo rings, and ambient particles.
 */
export const ThreeCanvasBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 8.0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Ambient & Directional Lights for Golden 3D Glint
    const ambientLight = new THREE.AmbientLight(0xfff3d6, 1.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xe6b76c, 3.2);
    dirLight1.position.set(6, 6, 6);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight2.position.set(-6, -4, 4);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xe6b76c, 2.0, 15);
    pointLight.position.set(0, 0, 5);
    scene.add(pointLight);

    // Group for rotating 3D logo
    const logoGroup = new THREE.Group();
    scene.add(logoGroup);

    // Load User's Gold PNG Logo Texture
    const textureLoader = new THREE.TextureLoader();
    const logoTexture = textureLoader.load("/logo.png");
    logoTexture.colorSpace = THREE.SRGBColorSpace;
    logoTexture.minFilter = THREE.LinearFilter;
    logoTexture.magFilter = THREE.LinearFilter;

    // Aspect ratio of the gold camera logo: ~559 x 447 = 1.25
    const logoWidth = 4.8;
    const logoHeight = 3.84;
    const logoGeo = new THREE.PlaneGeometry(logoWidth, logoHeight);

    // Front Face with high-quality metallic finish (25% reduced opacity: 0.42 -> 0.315)
    const logoMatFront = new THREE.MeshStandardMaterial({
      map: logoTexture,
      transparent: true,
      opacity: 0.315,
      roughness: 0.2,
      metalness: 0.7,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const logoMeshFront = new THREE.Mesh(logoGeo, logoMatFront);
    logoGroup.add(logoMeshFront);

    // Subtle back reflection offset for depth
    const logoMeshBack = new THREE.Mesh(logoGeo, logoMatFront);
    logoMeshBack.rotation.y = Math.PI;
    logoMeshBack.position.z = -0.04;
    logoGroup.add(logoMeshBack);

    // Orbiting 3D Gold Rings (25% reduced opacity: 0.35 -> 0.26)
    const ringGeo1 = new THREE.TorusGeometry(3.2, 0.025, 16, 120);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xe6b76c,
      metalness: 0.95,
      roughness: 0.15,
      transparent: true,
      opacity: 0.26,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat);
    logoGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(3.6, 0.018, 16, 120);
    const ring2 = new THREE.Mesh(ringGeo2, ringMat);
    logoGroup.add(ring2);

    // Ambient floating golden dust particles (25% reduced opacity: 0.35 -> 0.26)
    const particleCount = 50;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 14;
      particlePositions[i + 1] = (Math.random() - 0.5) * 12;
      particlePositions[i + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );
    const particleMat = new THREE.PointsMaterial({
      color: 0xe6b76c,
      size: 0.07,
      transparent: true,
      opacity: 0.26,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Mouse parallax tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Animation Loop
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Continuous majestic 3D rotation (moderated speed for calm luxury feel)
      logoGroup.rotation.y += 0.0055;
      ring1.rotation.z += 0.0032;
      ring2.rotation.z -= 0.0026;
      ring2.rotation.x = Math.sin(elapsedTime * 0.4) * 0.3;

      // Subtle float motion
      logoGroup.position.y = Math.sin(elapsedTime * 0.9) * 0.2;

      // Mouse Parallax in 3D
      targetX += (mouseX * 0.35 - targetX) * 0.05;
      targetY += (mouseY * 0.35 - targetY) * 0.05;
      logoGroup.rotation.x = 0.12 + targetY;
      logoGroup.position.x = targetX * 1.6;

      particleSystem.rotation.y = elapsedTime * 0.025;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      logoGeo.dispose();
      logoMatFront.dispose();
      ringGeo1.dispose();
      ringGeo2.dispose();
      ringMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      logoTexture.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    />
  );
};

export default ThreeCanvasBackground;
