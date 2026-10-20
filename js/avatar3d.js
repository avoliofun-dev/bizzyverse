/**
 * BizVerse Roblox-Style 3D Avatar & Character Controller
 * Procedural blocky humanoid character with pivot joints, walk/run/jump animations,
 * third-person follow camera, keyboard controls (WASD/Arrows/Space/Shift), and chat bubbles.
 */

class BizAvatar3D {
    constructor(scene, camera, domElement) {
        this.scene = scene;
        this.camera = camera;
        this.domElement = domElement;

        this.group = new THREE.Group();
        this.position = new THREE.Vector3(0, 0, 0);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.moveSpeed = 14;
        this.sprintSpeed = 24;
        this.jumpForce = 15;
        this.gravity = -38;
        this.isGrounded = true;
        this.rotationY = 0;

        // Limbs for animation
        this.limbs = {};
        this.animTimer = 0;
        this.isMoving = false;

        // Customization colors
        this.skinColor = '#ffdbac';
        this.torsoColor = '#00d2ff';
        this.legsColor = '#1e293b';
        this.hatType = 'cap'; // 'cap', 'fedora', 'crown', 'none'

        // Keyboard state
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            jump: false,
            sprint: false
        };

        // Third-person camera offsets
        this.camDistance = 14;
        this.camHeight = 7;
        this.camAngleX = 0.35;
        this.camAngleY = 0;
        this.isMouseDragging = false;
        this.prevMousePos = { x: 0, y: 0 };

        this.buildHumanoid();
        this.setupControls();
        this.setupNametag();
    }

    buildHumanoid() {
        // Clear previous meshes if any
        while (this.group.children.length > 0) {
            this.group.remove(this.group.children[0]);
        }

        const skinMat = new THREE.MeshStandardMaterial({ color: this.skinColor, roughness: 0.6 });
        const torsoMat = new THREE.MeshStandardMaterial({ color: this.torsoColor, roughness: 0.4, metalness: 0.2 });
        const legsMat = new THREE.MeshStandardMaterial({ color: this.legsColor, roughness: 0.5 });
        const shoeMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });

        // Head (Blocky Roblox aesthetic: 1.2 x 1.2 x 1.2)
        const headGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
        this.head = new THREE.Mesh(headGeo, skinMat);
        this.head.position.y = 3.6;
        this.head.castShadow = true;
        this.group.add(this.head);

        // Face decals/eyes
        const eyeGeo = new THREE.BoxGeometry(0.2, 0.2, 0.05);
        const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
        const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
        leftEye.position.set(-0.3, 0.1, 0.61);
        this.head.add(leftEye);

        const rightEye = leftEye.clone();
        rightEye.position.set(0.3, 0.1, 0.61);
        this.head.add(rightEye);

        // Smile
        const smileGeo = new THREE.BoxGeometry(0.4, 0.08, 0.05);
        const smile = new THREE.Mesh(smileGeo, eyeMat);
        smile.position.set(0, -0.25, 0.61);
        this.head.add(smile);

        // Hat
        if (this.hatType === 'cap') {
            const hatGeo = new THREE.BoxGeometry(1.3, 0.35, 1.3);
            const hatMat = new THREE.MeshStandardMaterial({ color: 0x00f5a0 });
            const hat = new THREE.Mesh(hatGeo, hatMat);
            hat.position.y = 0.65;
            const visorGeo = new THREE.BoxGeometry(1.3, 0.1, 0.6);
            const visor = new THREE.Mesh(visorGeo, hatMat);
            visor.position.set(0, -0.1, 0.8);
            hat.add(visor);
            this.head.add(hat);
        } else if (this.hatType === 'crown') {
            const crownGeo = new THREE.CylinderGeometry(0.7, 0.6, 0.5, 6);
            const crownMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.2 });
            const crown = new THREE.Mesh(crownGeo, crownMat);
            crown.position.y = 0.8;
            this.head.add(crown);
        }

        // Torso (2.0 x 2.0 x 1.0)
        const torsoGeo = new THREE.BoxGeometry(2.0, 2.0, 1.0);
        this.torso = new THREE.Mesh(torsoGeo, torsoMat);
        this.torso.position.y = 2.0;
        this.torso.castShadow = true;
        this.group.add(this.torso);

        // Tie on torso
        const tieGeo = new THREE.BoxGeometry(0.3, 1.2, 0.05);
        const tieMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
        const tie = new THREE.Mesh(tieGeo, tieMat);
        tie.position.set(0, 0.1, 0.53);
        this.torso.add(tie);

        // Arms (Joint at shoulder for realistic Roblox swinging)
        const armGeo = new THREE.BoxGeometry(0.9, 1.9, 0.9);
        
        // Left Arm Pivot
        this.leftArmPivot = new THREE.Group();
        this.leftArmPivot.position.set(-1.45, 2.9, 0);
        const leftArm = new THREE.Mesh(armGeo, torsoMat);
        leftArm.position.y = -0.95;
        leftArm.castShadow = true;
        this.leftArmPivot.add(leftArm);
        this.group.add(this.leftArmPivot);

        // Right Arm Pivot
        this.rightArmPivot = new THREE.Group();
        this.rightArmPivot.position.set(1.45, 2.9, 0);
        const rightArm = new THREE.Mesh(armGeo, torsoMat);
        rightArm.position.y = -0.95;
        rightArm.castShadow = true;
        this.rightArmPivot.add(rightArm);
        this.group.add(this.rightArmPivot);

        // Legs (Joint at hip)
        const legGeo = new THREE.BoxGeometry(0.95, 1.9, 0.95);

        // Left Leg Pivot
        this.leftLegPivot = new THREE.Group();
        this.leftLegPivot.position.set(-0.52, 1.0, 0);
        const leftLeg = new THREE.Mesh(legGeo, legsMat);
        leftLeg.position.y = -0.95;
        leftLeg.castShadow = true;
        this.leftLegPivot.add(leftLeg);
        this.group.add(this.leftLegPivot);

        // Right Leg Pivot
        this.rightLegPivot = new THREE.Group();
        this.rightLegPivot.position.set(0.52, 1.0, 0);
        const rightLeg = new THREE.Mesh(legGeo, legsMat);
        rightLeg.position.y = -0.95;
        rightLeg.castShadow = true;
        this.rightLegPivot.add(rightLeg);
        this.group.add(this.rightLegPivot);

        this.scene.add(this.group);
    }

    setupNametag() {
        // 3D Canvas-rendered floating nametag
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.roundRect(10, 10, 236, 44, 10);
        ctx.fill();
        ctx.strokeStyle = '#00d2ff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Alex Mercer [Direktur Utama]', 128, 38);

        const tex = new THREE.CanvasTexture(canvas);
        const spriteMat = new THREE.SpriteMaterial({ map: tex });
        this.nametagSprite = new THREE.Sprite(spriteMat);
        this.nametagSprite.position.set(0, 4.8, 0);
        this.nametagSprite.scale.set(3.2, 0.8, 1);
        this.group.add(this.nametagSprite);
    }

    updateNametagText(name, title) {
        if (!this.nametagSprite) return;
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.beginPath();
        ctx.roundRect(10, 10, 236, 44, 10);
        ctx.fill();
        ctx.strokeStyle = '#00d2ff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${name} [${title}]`, 128, 38);

        this.nametagSprite.material.map = new THREE.CanvasTexture(canvas);
        this.nametagSprite.material.needsUpdate = true;
    }

    setColors(skin, torso, legs, hat) {
        this.skinColor = skin || this.skinColor;
        this.torsoColor = torso || this.torsoColor;
        this.legsColor = legs || this.legsColor;
        this.hatType = hat || this.hatType;
        this.buildHumanoid();
    }

    setupControls() {
        window.addEventListener('keydown', (e) => {
            // Ignore if typing in chat input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            switch (e.code) {
                case 'KeyW': case 'ArrowUp': this.keys.forward = true; break;
                case 'KeyS': case 'ArrowDown': this.keys.backward = true; break;
                case 'KeyA': case 'ArrowLeft': this.keys.left = true; break;
                case 'KeyD': case 'ArrowRight': this.keys.right = true; break;
                case 'Space':
                    if (this.isGrounded) {
                        this.velocity.y = this.jumpForce;
                        this.isGrounded = false;
                        if (window.bizAudio) window.bizAudio.playClick();
                    }
                    break;
                case 'ShiftLeft': case 'ShiftRight':
                    this.keys.sprint = true;
                    break;
            }
        });

        window.addEventListener('keyup', (e) => {
            switch (e.code) {
                case 'KeyW': case 'ArrowUp': this.keys.forward = false; break;
                case 'KeyS': case 'ArrowDown': this.keys.backward = false; break;
                case 'KeyA': case 'ArrowLeft': this.keys.left = false; break;
                case 'KeyD': case 'ArrowRight': this.keys.right = false; break;
                case 'ShiftLeft': case 'ShiftRight': this.keys.sprint = false; break;
            }
        });

        // Mouse look orbiting around avatar
        this.domElement.addEventListener('mousedown', (e) => {
            if (e.button === 0 || e.button === 2) {
                this.isMouseDragging = true;
                this.prevMousePos = { x: e.clientX, y: e.clientY };
            }
        });

        window.addEventListener('mouseup', () => {
            this.isMouseDragging = false;
        });

        window.addEventListener('mousemove', (e) => {
            if (!this.isMouseDragging) return;
            const deltaX = e.clientX - this.prevMousePos.x;
            const deltaY = e.clientY - this.prevMousePos.y;
            this.prevMousePos = { x: e.clientX, y: e.clientY };

            this.camAngleY -= deltaX * 0.006;
            this.camAngleX = Math.max(0.1, Math.min(1.2, this.camAngleX + deltaY * 0.005));
        });

        // Scroll zoom
        this.domElement.addEventListener('wheel', (e) => {
            this.camDistance = Math.max(6, Math.min(30, this.camDistance + e.deltaY * 0.02));
        });
    }

    update(deltaSec) {
        // Movement direction relative to camera angle
        const moveDir = new THREE.Vector3();
        if (this.keys.forward) moveDir.z -= 1;
        if (this.keys.backward) moveDir.z += 1;
        if (this.keys.left) moveDir.x -= 1;
        if (this.keys.right) moveDir.x += 1;

        this.isMoving = moveDir.lengthSq() > 0;

        if (this.isMoving) {
            moveDir.normalize();

            // Rotate move direction according to camera Y angle
            moveDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.camAngleY);

            const speed = this.keys.sprint ? this.sprintSpeed : this.moveSpeed;
            this.position.x += moveDir.x * speed * deltaSec;
            this.position.z += moveDir.z * speed * deltaSec;

            // Face direction of movement smoothly
            const targetRotation = Math.atan2(moveDir.x, moveDir.z);
            let diff = targetRotation - this.rotationY;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;
            this.rotationY += diff * 0.2;
        }

        // Apply Gravity and Ground Collision
        this.velocity.y += this.gravity * deltaSec;
        this.position.y += this.velocity.y * deltaSec;

        if (this.position.y <= 0) {
            this.position.y = 0;
            this.velocity.y = 0;
            this.isGrounded = true;
        }

        // Apply transform to avatar group
        this.group.position.copy(this.position);
        this.group.rotation.y = this.rotationY;

        // Animate Limbs (Roblox Walk Cycle)
        if (this.isMoving && this.isGrounded) {
            const animSpeed = this.keys.sprint ? 16 : 10;
            this.animTimer += deltaSec * animSpeed;
            const swing = Math.sin(this.animTimer) * 0.75;

            this.leftArmPivot.rotation.x = -swing;
            this.rightArmPivot.rotation.x = swing;
            this.leftLegPivot.rotation.x = swing;
            this.rightLegPivot.rotation.x = -swing;
        } else if (!this.isGrounded) {
            // Jump pose
            this.leftArmPivot.rotation.x = -1.2;
            this.rightArmPivot.rotation.x = -1.2;
            this.leftLegPivot.rotation.x = 0.4;
            this.rightLegPivot.rotation.x = -0.4;
        } else {
            // Idle breathing
            this.animTimer += deltaSec * 2;
            const breathe = Math.sin(this.animTimer) * 0.05;
            this.leftArmPivot.rotation.x = breathe;
            this.rightArmPivot.rotation.x = -breathe;
            this.leftLegPivot.rotation.x = 0;
            this.rightLegPivot.rotation.x = 0;
        }

        // Update 3rd Person Follow Camera
        const camOffsetX = Math.sin(this.camAngleY) * Math.cos(this.camAngleX) * this.camDistance;
        const camOffsetZ = Math.cos(this.camAngleY) * Math.cos(this.camAngleX) * this.camDistance;
        const camOffsetY = Math.sin(this.camAngleX) * this.camDistance;

        this.camera.position.set(
            this.position.x + camOffsetX,
            this.position.y + camOffsetY + 2,
            this.position.z + camOffsetZ
        );

        this.camera.lookAt(
            this.position.x,
            this.position.y + 2.5,
            this.position.z
        );
    }

    showChatBubble(text) {
        // Floating comic chat bubble above avatar
        if (this.chatBubbleMesh) {
            this.group.remove(this.chatBubbleMesh);
        }

        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
        ctx.roundRect(10, 10, 492, 108, 16);
        ctx.fill();
        ctx.strokeStyle = '#00f5a0';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(text, 256, 70);

        const tex = new THREE.CanvasTexture(canvas);
        const spriteMat = new THREE.SpriteMaterial({ map: tex });
        this.chatBubbleMesh = new THREE.Sprite(spriteMat);
        this.chatBubbleMesh.position.set(0, 6.2, 0);
        this.chatBubbleMesh.scale.set(6, 1.5, 1);
        this.group.add(this.chatBubbleMesh);

        setTimeout(() => {
            if (this.chatBubbleMesh) {
                this.group.remove(this.chatBubbleMesh);
                this.chatBubbleMesh = null;
            }
        }, 4500);
    }
}

window.BizAvatar3D = BizAvatar3D;
