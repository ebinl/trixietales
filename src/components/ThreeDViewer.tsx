import { useRef, useEffect } from "react";
import * as THREE from 'three';

const ThreeDViewer = ({ productType, userImage }: { productType: string, userImage: string | null }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const frameRef = useRef<THREE.Group | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf5f5f5);
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(
            45,
            containerRef.current.clientWidth / containerRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.set(0, 0, 5);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0xffffff, 0.4);
        pointLight.position.set(-5, 3, -5);
        scene.add(pointLight);

        const productGroup = new THREE.Group();
        frameRef.current = productGroup;

        if (productType === 'frame') {
            createFrame(productGroup, userImage);
        } else if (productType === 'magazine') {
            createMagazine(productGroup, userImage);
        } else if (productType === 'calendar') {
            createCalendar(productGroup, userImage);
        } else if (productType === 'album') {
            createAlbum(productGroup, userImage);
        }

        scene.add(productGroup);

        let animationId: number;
        const animate = () => {
            animationId = requestAnimationFrame(animate);

            if (frameRef.current) {
                frameRef.current.rotation.y += 0.005;
            }

            renderer.render(scene, camera);
        };
        animate();

        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        const onMouseDown = (e: MouseEvent) => {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging || !frameRef.current) return;

            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;

            frameRef.current.rotation.y += deltaX * 0.01;
            frameRef.current.rotation.x += deltaY * 0.01;

            previousMousePosition = { x: e.clientX, y: e.clientY };
        };

        const onMouseUp = () => {
            isDragging = false;
        };

        renderer.domElement.addEventListener('mousedown', onMouseDown);
        renderer.domElement.addEventListener('mousemove', onMouseMove);
        renderer.domElement.addEventListener('mouseup', onMouseUp);

        const handleResize = () => {
            if (!containerRef.current || !camera || !renderer) return;
            camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationId);
            renderer.domElement.removeEventListener('mousedown', onMouseDown);
            renderer.domElement.removeEventListener('mousemove', onMouseMove);
            renderer.domElement.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('resize', handleResize);
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, [productType, userImage]);

    const createFrame = (group: THREE.Group, userImage: string | null) => {
        const frameWidth = 3.0;
        const frameHeight = 4.0;
        const frameDepth = 0.16;
        const mouldingWidth = 0.24;

        const frameMat = new THREE.MeshStandardMaterial({
            color: 0x8c532b, // Handcrafted Natural Wood
            roughness: 0.65,
            metalness: 0.05
        });

        // 4-Sided Moulding
        const topRail = new THREE.Mesh(new THREE.BoxGeometry(frameWidth, mouldingWidth, frameDepth), frameMat);
        topRail.position.set(0, frameHeight / 2 - mouldingWidth / 2, 0);
        group.add(topRail);

        const botRail = new THREE.Mesh(new THREE.BoxGeometry(frameWidth, mouldingWidth, frameDepth), frameMat);
        botRail.position.set(0, -frameHeight / 2 + mouldingWidth / 2, 0);
        group.add(botRail);

        const leftRail = new THREE.Mesh(new THREE.BoxGeometry(mouldingWidth, frameHeight - mouldingWidth * 2, frameDepth), frameMat);
        leftRail.position.set(-frameWidth / 2 + mouldingWidth / 2, 0, 0);
        group.add(leftRail);

        const rightRail = new THREE.Mesh(new THREE.BoxGeometry(mouldingWidth, frameHeight - mouldingWidth * 2, frameDepth), frameMat);
        rightRail.position.set(frameWidth / 2 - mouldingWidth / 2, 0, 0);
        group.add(rightRail);

        // Passe-partout matte
        const matteWidth = frameWidth - mouldingWidth * 2 + 0.02;
        const matteHeight = frameHeight - mouldingWidth * 2 + 0.02;
        const matteMesh = new THREE.Mesh(
            new THREE.BoxGeometry(matteWidth, matteHeight, 0.025),
            new THREE.MeshStandardMaterial({ color: 0xfcfaf6, roughness: 0.9 })
        );
        matteMesh.position.z = 0.02;
        group.add(matteMesh);

        // Photo
        const photoWidth = matteWidth - 0.45;
        const photoHeight = matteHeight - 0.55;
        let photoMaterial: THREE.Material;
        if (userImage) {
            const textureLoader = new THREE.TextureLoader();
            const texture = textureLoader.load(userImage, (tex) => {
                tex.colorSpace = THREE.SRGBColorSpace;
                if (tex.image && tex.image.width && tex.image.height) {
                    const imgAspect = tex.image.width / tex.image.height;
                    const planeAspect = photoWidth / photoHeight;
                    if (imgAspect > planeAspect) {
                        tex.repeat.set(planeAspect / imgAspect, 1);
                        tex.offset.set((1 - planeAspect / imgAspect) / 2, 0);
                    } else {
                        tex.repeat.set(1, imgAspect / planeAspect);
                        tex.offset.set(0, (1 - imgAspect / planeAspect) / 2);
                    }
                    tex.needsUpdate = true;
                }
            });
            texture.colorSpace = THREE.SRGBColorSpace;
            photoMaterial = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.32 });
        } else {
            photoMaterial = new THREE.MeshStandardMaterial({ color: 0x222226, roughness: 0.5 });
        }
        const photoMesh = new THREE.Mesh(new THREE.PlaneGeometry(photoWidth, photoHeight), photoMaterial);
        photoMesh.position.z = 0.035;
        group.add(photoMesh);

        // Museum Glass
        const glassMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(matteWidth, matteHeight),
            new THREE.MeshPhysicalMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.2,
                roughness: 0.04,
                clearcoat: 1.0,
                transmission: 0.88,
            })
        );
        glassMesh.position.z = frameDepth / 2 + 0.005;
        group.add(glassMesh);
    };

    const createMagazine = (group: THREE.Group, userImage: string | null) => {
        const magWidth = 2.6;
        const magHeight = 3.6;
        const magDepth = 0.09;

        // Dynamic Magazine Canvas
        const canvas = document.createElement('canvas');
        canvas.width = 1000;
        canvas.height = 1400;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = '#11141f';
            ctx.fillRect(0, 0, 1000, 1400);

            // Vogue Style Masthead
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 84px Georgia, serif';
            ctx.textAlign = 'center';
            ctx.fillText('T R I X I E T A L E S', 500, 130);

            ctx.fillStyle = '#e6b76c';
            ctx.font = 'bold 18px sans-serif';
            ctx.fillText('THE LUXURY WEDDING & EDITORIAL ISSUE', 500, 172);

            ctx.fillStyle = '#cbd5e1';
            ctx.font = '14px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('WINTER 2026 • ISSUE 24', 55, 215);
            ctx.textAlign = 'right';
            ctx.fillText("COLLECTOR'S EDITION", 945, 215);

            ctx.fillStyle = '#e6b76c';
            ctx.font = 'bold 22px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('EXCLUSIVE COVER STORY', 60, 1050);

            ctx.fillStyle = '#ffffff';
            ctx.font = '900 48px Georgia, serif';
            ctx.fillText('ROYAL VOWS', 60, 1105);

            ctx.fillStyle = '#f1f5f9';
            ctx.font = '300 22px sans-serif';
            ctx.fillText('Timeless Elegance & Cinema • Markhandeya', 60, 1145);
        }

        const magTexture = new THREE.CanvasTexture(canvas);
        magTexture.colorSpace = THREE.SRGBColorSpace;

        const coverGeo = new THREE.BoxGeometry(magWidth, magHeight, 0.02);
        const coverMat = new THREE.MeshPhysicalMaterial({
            map: userImage ? new THREE.TextureLoader().load(userImage) : magTexture,
            roughness: 0.15,
            clearcoat: 1.0,
            clearcoatRoughness: 0.06
        });
        const coverMesh = new THREE.Mesh(coverGeo, coverMat);
        coverMesh.position.z = magDepth / 2;
        group.add(coverMesh);

        // Page Block
        const pageBlockMesh = new THREE.Mesh(
            new THREE.BoxGeometry(magWidth - 0.04, magHeight - 0.04, magDepth - 0.02),
            new THREE.MeshStandardMaterial({ color: 0xf6f4ed, roughness: 0.8 })
        );
        pageBlockMesh.position.set(0.015, 0, 0);
        group.add(pageBlockMesh);

        // Spine
        const spineMesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.06, magHeight, magDepth),
            new THREE.MeshStandardMaterial({ color: 0x161822, roughness: 0.4 })
        );
        spineMesh.position.set(-magWidth / 2 + 0.03, 0, 0);
        group.add(spineMesh);
    };

    const createCalendar = (group: THREE.Group, userImage: string | null) => {
        const calWidth = 3.2;
        const calHeight = 2.4;
        const calDepth = 0.04;

        // Dynamic 2026 Calendar Texture
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = '#faf8f5';
            ctx.fillRect(0, 0, 1024, 1024);

            ctx.strokeStyle = '#e8e0d4';
            ctx.lineWidth = 3;
            ctx.strokeRect(20, 20, 984, 984);

            // Punch holes
            ctx.fillStyle = '#d5cbba';
            for (let i = 0; i < 14; i++) {
                ctx.beginPath();
                ctx.arc(90 + i * 64, 42, 8, 0, Math.PI * 2);
                ctx.fill();
            }

            // Header
            ctx.fillStyle = '#9c7c4c';
            ctx.font = "bold 20px Georgia, serif";
            ctx.textAlign = 'center';
            ctx.fillText('T R I X I E T A L E S   S T U D I O', 512, 92);

            // Photo area background
            ctx.fillStyle = '#1e2230';
            ctx.beginPath();
            ctx.roundRect(80, 115, 864, 520, 12);
            ctx.fill();

            // Month
            ctx.fillStyle = '#161821';
            ctx.font = 'bold 38px Georgia, serif';
            ctx.fillText('DECEMBER 2026', 512, 695);

            ctx.fillStyle = '#8a7550';
            ctx.font = '13px sans-serif';
            ctx.fillText('BESPOKE WEDDING & FINE-ART PRINTS • WHITEFIELD, BENGALURU', 512, 725);

            // Day Headers
            const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
            const startX = 145;
            const colGap = 122;
            const dayY = 765;

            ctx.font = 'bold 17px sans-serif';
            days.forEach((d, idx) => {
                ctx.fillStyle = idx >= 5 ? '#d48b3b' : '#555b6e';
                ctx.fillText(d, startX + idx * colGap, dayY);
            });

            // Date Grid
            ctx.font = '500 20px sans-serif';
            let dayNum = 1;
            for (let r = 0; r < 5; r++) {
                for (let c = 0; c < 7; c++) {
                    const slot = r * 7 + c;
                    if (slot >= 1 && dayNum <= 31) {
                        ctx.fillStyle = c >= 5 ? '#c2782b' : '#222634';
                        ctx.fillText(dayNum.toString(), startX + c * colGap, 810 + r * 36);
                        dayNum++;
                    }
                }
            }
        }

        const calTexture = new THREE.CanvasTexture(canvas);
        calTexture.colorSpace = THREE.SRGBColorSpace;

        // Tent/Easel Group
        const tentGroup = new THREE.Group();
        group.add(tentGroup);

        const apexY = 1.1;

        // 1. Front Panel Pivot (hinged at top apex)
        const frontPivot = new THREE.Group();
        frontPivot.position.set(0, apexY, 0);
        frontPivot.rotation.x = -0.16;

        const frontBoard = new THREE.Mesh(
            new THREE.BoxGeometry(calWidth, calHeight, calDepth),
            new THREE.MeshStandardMaterial({ color: 0xf5f3ee, roughness: 0.85 })
        );
        frontBoard.position.set(0, -calHeight / 2, 0);
        frontPivot.add(frontBoard);

        const faceMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(calWidth - 0.02, calHeight - 0.02),
            new THREE.MeshStandardMaterial({ map: calTexture, roughness: 0.75 })
        );
        faceMesh.position.set(0, -calHeight / 2, calDepth / 2 + 0.005);
        frontPivot.add(faceMesh);

        // If userImage, map onto photo area with aspect ratio preservation
        if (userImage) {
            const textureLoader = new THREE.TextureLoader();
            const userTex = textureLoader.load(userImage, (tex) => {
                tex.colorSpace = THREE.SRGBColorSpace;
                if (tex.image && tex.image.width && tex.image.height) {
                    const imgAspect = tex.image.width / tex.image.height;
                    const planeAspect = 2.7 / 1.3;
                    if (imgAspect > planeAspect) {
                        tex.repeat.set(planeAspect / imgAspect, 1);
                        tex.offset.set((1 - planeAspect / imgAspect) / 2, 0);
                    } else {
                        tex.repeat.set(1, imgAspect / planeAspect);
                        tex.offset.set(0, (1 - imgAspect / planeAspect) / 2);
                    }
                    tex.needsUpdate = true;
                }
            });
            userTex.colorSpace = THREE.SRGBColorSpace;
            const userPhotoMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(2.7, 1.3),
                new THREE.MeshStandardMaterial({ map: userTex, roughness: 0.35 })
            );
            userPhotoMesh.position.set(0, -calHeight / 2 + 0.32, calDepth / 2 + 0.008);
            frontPivot.add(userPhotoMesh);

            // Subtle gold border around photo
            const borderGeo = new THREE.BoxGeometry(2.74, 1.34, 0.005);
            const borderMat = new THREE.MeshStandardMaterial({ color: 0xe6b76c, metalness: 0.8, roughness: 0.2 });
            const borderMesh = new THREE.Mesh(borderGeo, borderMat);
            borderMesh.position.set(0, -calHeight / 2 + 0.32, calDepth / 2 + 0.006);
            frontPivot.add(borderMesh);
        }

        tentGroup.add(frontPivot);

        // 2. Back Easel Strut Pivot (hinged at SAME apex, slopes backward into negative Z)
        const backPivot = new THREE.Group();
        backPivot.position.set(0, apexY, 0);
        backPivot.rotation.x = 0.22;

        const backBoard = new THREE.Mesh(
            new THREE.BoxGeometry(calWidth, calHeight, calDepth),
            new THREE.MeshStandardMaterial({ color: 0x22201d, roughness: 0.8 })
        );
        backBoard.position.set(0, -calHeight / 2, -calDepth / 2);
        backPivot.add(backBoard);
        tentGroup.add(backPivot);

        // 3. Bottom connecting base flap
        const baseFlap = new THREE.Mesh(
            new THREE.BoxGeometry(calWidth - 0.08, 0.02, 0.88),
            new THREE.MeshStandardMaterial({ color: 0x2e2b26, roughness: 0.85 })
        );
        baseFlap.position.set(0, apexY - calHeight * Math.cos(0.18) + 0.02, -0.06);
        tentGroup.add(baseFlap);

        // 4. 14 Twin-Wire Rings at top apex
        const ringGeo = new THREE.TorusGeometry(0.065, 0.013, 16, 24);
        const ringMat = new THREE.MeshStandardMaterial({ color: 0xe6b76c, metalness: 0.95, roughness: 0.15 });
        const ringCount = 14;
        const startX = -1.25;
        const stepX = 2.5 / (ringCount - 1);
        for (let i = 0; i < ringCount; i++) {
            const ringMesh = new THREE.Mesh(ringGeo, ringMat);
            ringMesh.rotation.y = Math.PI / 2;
            ringMesh.position.set(startX + i * stepX, apexY, 0);
            tentGroup.add(ringMesh);
        }
    };

    const createAlbum = (group: THREE.Group, userImage: string | null) => {
        const albumWidth = 3.6;
        const albumHeight = 2.7;
        const albumDepth = 0.28;

        // Dynamic Album Cover Canvas
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 900;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = '#1c1916';
            ctx.fillRect(0, 0, 1200, 900);

            // Stitched perimeter
            ctx.strokeStyle = 'rgba(230, 183, 108, 0.4)';
            ctx.lineWidth = 2.5;
            ctx.setLineDash([8, 6]);
            ctx.strokeRect(32, 32, 1136, 836);
            ctx.setLineDash([]);

            // Spine Hinge
            ctx.strokeStyle = 'rgba(0,0,0,0.7)';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(92, 32);
            ctx.lineTo(92, 868);
            ctx.stroke();

            // Cameo Window
            const cameoX = 290;
            const cameoY = 110;
            const cameoW = 680;
            const cameoH = 480;

            ctx.fillStyle = '#080706';
            ctx.fillRect(cameoX - 8, cameoY - 8, cameoW + 16, cameoH + 16);

            ctx.fillStyle = '#1e2230';
            ctx.fillRect(cameoX, cameoY, cameoW, cameoH);

            ctx.strokeStyle = '#e6b76c';
            ctx.lineWidth = 4;
            ctx.strokeRect(cameoX, cameoY, cameoW, cameoH);

            // Gold Foil Typography
            ctx.textAlign = 'center';
            ctx.fillStyle = '#e6b76c';
            ctx.font = "bold 32px Georgia, serif";
            ctx.fillText('T R I X I E T A L E S', 630, 680);

            ctx.fillStyle = '#f5d799';
            ctx.font = "500 16px Georgia, serif";
            ctx.fillText('ROYAL HEIRLOOM WEDDING ALBUM', 630, 720);

            ctx.fillStyle = '#8a7d68';
            ctx.font = '12px sans-serif';
            ctx.fillText('LAY-FLAT ARCHIVAL LEATHER • BENGALURU', 630, 755);
        }

        const albumCoverTex = new THREE.CanvasTexture(canvas);
        albumCoverTex.colorSpace = THREE.SRGBColorSpace;

        const coverMesh = new THREE.Mesh(
            new THREE.BoxGeometry(albumWidth, albumHeight, 0.035),
            new THREE.MeshPhysicalMaterial({
                map: albumCoverTex,
                roughness: 0.48,
                clearcoat: 0.2
            })
        );
        coverMesh.position.z = albumDepth / 2;
        group.add(coverMesh);

        // Gold Gilded Leaf Pages
        const pagesMesh = new THREE.Mesh(
            new THREE.BoxGeometry(albumWidth - 0.14, albumHeight - 0.1, albumDepth - 0.06),
            new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.92, roughness: 0.2 })
        );
        pagesMesh.position.set(0.045, 0, 0);
        group.add(pagesMesh);

        // Spine
        const spineMesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.12, albumHeight, albumDepth),
            new THREE.MeshStandardMaterial({ color: 0x161412, roughness: 0.6 })
        );
        spineMesh.position.set(-albumWidth / 2 + 0.04, 0, 0);
        group.add(spineMesh);

        // Back
        const backMesh = new THREE.Mesh(
            new THREE.BoxGeometry(albumWidth, albumHeight, 0.035),
            new THREE.MeshStandardMaterial({ color: 0x191714, roughness: 0.6 })
        );
        backMesh.position.z = -albumDepth / 2;
        group.add(backMesh);

        // User Photo Inside Cameo
        if (userImage) {
            const textureLoader = new THREE.TextureLoader();
            const texture = textureLoader.load(userImage, (tex) => {
                tex.colorSpace = THREE.SRGBColorSpace;
                if (tex.image && tex.image.width && tex.image.height) {
                    const imgAspect = tex.image.width / tex.image.height;
                    const planeAspect = 2.1 / 1.5;
                    if (imgAspect > planeAspect) {
                        tex.repeat.set(planeAspect / imgAspect, 1);
                        tex.offset.set((1 - planeAspect / imgAspect) / 2, 0);
                    } else {
                        tex.repeat.set(1, imgAspect / planeAspect);
                        tex.offset.set(0, (1 - imgAspect / planeAspect) / 2);
                    }
                    tex.needsUpdate = true;
                }
            });
            texture.colorSpace = THREE.SRGBColorSpace;
            const photoMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(2.1, 1.5),
                new THREE.MeshStandardMaterial({ map: texture, roughness: 0.32 })
            );
            photoMesh.position.set(0.24, 0.23, albumDepth / 2 + 0.02);
            group.add(photoMesh);
        }
    };

    return (
        <div ref={containerRef} className="w-full h-[500px] rounded-xl bg-gradient-to-br from-primary/5 to-accent/5" />
    );
};

export default ThreeDViewer;
