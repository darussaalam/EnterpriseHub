/**
 * EA FC 27 Web Edition - Multi-Input Controller System
 * Ultra-Responsive Keyboard, Gamepad API (Xbox / PS / Generic), and Mobile Touch Joystick
 */

export class ControlsManager {
    constructor() {
        this.keys = {};
        this.moveVector = { x: 0, z: 0 };
        this.isSprinting = false;

        // Action Buttons State
        this.shootCharging = false;
        this.shootPower = 0; // 0.0 to 1.0
        this.lobCharging = false;
        this.lobPower = 0;

        // Gamepad tracking
        this.gamepadIndex = null;
        this.gpButtonsPrev = {};

        // Virtual Touch Joystick
        this.touchJoystick = {
            active: false,
            originX: 0,
            originY: 0,
            currentX: 0,
            currentY: 0,
            deltaX: 0,
            deltaY: 0
        };

        this.callbacks = {
            onPass: () => {},
            onThroughBall: () => {},
            onShoot: (power) => {},
            onLobPass: (power) => {},
            onTackle: () => {},
            onSwitchPlayer: () => {},
            onSkillMove: () => {}
        };

        this.init();
    }

    init() {
        // 1. Keyboard Listeners
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));

        // 2. Gamepad API Listeners
        window.addEventListener('gamepadconnected', (e) => {
            console.log('🎮 Gamepad connected:', e.gamepad.id, 'Index:', e.gamepad.index);
            this.gamepadIndex = e.gamepad.index;
        });
        window.addEventListener('gamepaddisconnected', (e) => {
            if (this.gamepadIndex === e.gamepad.index) this.gamepadIndex = null;
        });

        // 3. Virtual Mobile Touch Setup
        this.initTouchControls();
    }

    isShootKey(code) {
        return code === 'KeyK' || code === 'KeyC' || code === 'KeyF' || code === 'Numpad3' || code === 'Numpad0';
    }

    isPassKey(code) {
        return code === 'KeyJ' || code === 'KeyX' || code === 'Numpad1';
    }

    isThroughKey(code) {
        return code === 'KeyI' || code === 'KeyV' || code === 'Numpad4';
    }

    isLobKey(code) {
        return code === 'KeyL' || code === 'KeyZ' || code === 'Numpad2';
    }

    onKeyDown(e) {
        if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
            e.preventDefault();
        }

        this.keys[e.code] = true;

        // Shoot Charging Start
        if (this.isShootKey(e.code) && !this.shootCharging) {
            this.shootCharging = true;
            this.shootPower = 0.25; // initial tap power
        }

        // Lob Charging Start
        if (this.isLobKey(e.code) && !this.lobCharging) {
            this.lobCharging = true;
            this.lobPower = 0.3;
        }
    }

    onKeyUp(e) {
        this.keys[e.code] = false;

        // Ground Pass
        if (this.isPassKey(e.code)) {
            this.callbacks.onPass();
        }

        // Through Ball
        if (this.isThroughKey(e.code)) {
            this.callbacks.onThroughBall();
        }

        // Shoot Release
        if (this.isShootKey(e.code)) {
            const finalPower = Math.max(0.35, this.shootPower);
            this.shootCharging = false;
            this.shootPower = 0;
            this.callbacks.onShoot(finalPower);
        }

        // Lob Pass Release
        if (this.isLobKey(e.code)) {
            const finalPower = Math.max(0.4, this.lobPower);
            this.lobCharging = false;
            this.lobPower = 0;
            this.callbacks.onLobPass(finalPower);
        }

        // Standing / Slide Tackle
        if (e.code === 'KeyE' || e.code === 'Semicolon') {
            this.callbacks.onTackle();
        }

        // Switch Player
        if (e.code === 'KeyQ' || e.code === 'KeyU') {
            this.callbacks.onSwitchPlayer();
        }

        // Skill Move
        if (e.code === 'KeyR' || e.code === 'KeyO') {
            this.callbacks.onSkillMove();
        }
    }

    initTouchControls() {
        const joyBase = document.getElementById('touch-joystick-base');
        const joyThumb = document.getElementById('touch-joystick-thumb');
        if (!joyBase || !joyThumb) return;

        const maxRadius = 45;

        joyBase.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            const rect = joyBase.getBoundingClientRect();
            this.touchJoystick.active = true;
            this.touchJoystick.originX = rect.left + rect.width / 2;
            this.touchJoystick.originY = rect.top + rect.height / 2;
        }, { passive: false });

        window.addEventListener('touchmove', (e) => {
            if (!this.touchJoystick.active) return;
            for (let i = 0; i < e.touches.length; i++) {
                const touch = e.touches[i];
                const dx = touch.clientX - this.touchJoystick.originX;
                const dy = touch.clientY - this.touchJoystick.originY;
                const dist = Math.hypot(dx, dy);

                if (dist < 140) {
                    const clampedDist = Math.min(maxRadius, dist);
                    const angle = Math.atan2(dy, dx);
                    const thumbX = Math.cos(angle) * clampedDist;
                    const thumbY = Math.sin(angle) * clampedDist;

                    joyThumb.style.transform = `translate(${thumbX}px, ${thumbY}px)`;
                    this.touchJoystick.deltaX = thumbX / maxRadius;
                    this.touchJoystick.deltaY = thumbY / maxRadius;
                    break;
                }
            }
        }, { passive: false });

        const resetTouch = () => {
            this.touchJoystick.active = false;
            this.touchJoystick.deltaX = 0;
            this.touchJoystick.deltaY = 0;
            joyThumb.style.transform = 'translate(0px, 0px)';
        };

        window.addEventListener('touchend', resetTouch);
        window.addEventListener('touchcancel', resetTouch);

        // Bind touch action buttons
        const bindBtn = (id, onDown, onUp) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (onDown) onDown();
            }, { passive: false });
            el.addEventListener('touchend', (e) => {
                e.preventDefault();
                if (onUp) onUp();
            }, { passive: false });
        };

        bindBtn('btn-touch-pass', null, () => this.callbacks.onPass());
        bindBtn('btn-touch-through', null, () => this.callbacks.onThroughBall());
        bindBtn('btn-touch-shoot', 
            () => { this.shootCharging = true; this.shootPower = 0.3; },
            () => {
                const finalPower = Math.max(0.35, this.shootPower);
                this.shootCharging = false;
                this.shootPower = 0;
                this.callbacks.onShoot(finalPower);
            }
        );
        bindBtn('btn-touch-lob', 
            () => { this.lobCharging = true; this.lobPower = 0.3; },
            () => {
                const finalPower = Math.max(0.4, this.lobPower);
                this.lobCharging = false;
                this.lobPower = 0;
                this.callbacks.onLobPass(finalPower);
            }
        );
        bindBtn('btn-touch-tackle', null, () => this.callbacks.onTackle());
        bindBtn('btn-touch-switch', null, () => this.callbacks.onSwitchPlayer());
        bindBtn('btn-touch-skill', null, () => this.callbacks.onSkillMove());
    }

    pollGamepad() {
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        let gp = null;

        // Auto-detect connected gamepad
        if (this.gamepadIndex !== null && gamepads[this.gamepadIndex]) {
            gp = gamepads[this.gamepadIndex];
        } else {
            for (let i = 0; i < gamepads.length; i++) {
                if (gamepads[i]) {
                    gp = gamepads[i];
                    this.gamepadIndex = i;
                    break;
                }
            }
        }

        if (!gp) return;

        // 1. Left Analog Stick & D-Pad for Movement
        let stickX = gp.axes[0] || 0;
        let stickY = gp.axes[1] || 0;
        const deadzone = 0.15;

        // D-Pad override (Buttons 12=Up, 13=Down, 14=Left, 15=Right)
        if (gp.buttons[14]?.pressed) stickX = -1;
        if (gp.buttons[15]?.pressed) stickX = 1;
        if (gp.buttons[12]?.pressed) stickY = -1;
        if (gp.buttons[13]?.pressed) stickY = 1;

        if (Math.hypot(stickX, stickY) > deadzone) {
            this.moveVector.x = stickX;
            this.moveVector.z = stickY;
        }

        // 2. Sprint button (RT / R2: Button 7, RB / R1: Button 5, LT / L2: Button 6)
        if (gp.buttons[7]?.pressed || gp.buttons[5]?.pressed || (gp.buttons[7]?.value > 0.3)) {
            this.isSprinting = true;
        }

        // Helper for button down edge
        const btnPressed = (idx) => gp.buttons[idx]?.pressed || (gp.buttons[idx]?.value > 0.5);

        // 3. Button A / Cross (Button 0): Ground Pass
        if (btnPressed(0) && !this.gpButtonsPrev[0]) {
            this.callbacks.onPass();
        }
        this.gpButtonsPrev[0] = btnPressed(0);

        // 4. Button B / Circle (Button 1) OR Button X (Button 2): Shoot
        const isShootingPressed = btnPressed(1) || (btnPressed(2) && !this.isLobKeyActive);
        if (isShootingPressed) {
            if (!this.shootCharging) {
                this.shootCharging = true;
                this.shootPower = 0.3; // initial burst
            }
        } else if (this.shootCharging && !this.isKeyboardShooting) {
            const finalPower = Math.max(0.4, this.shootPower);
            this.shootCharging = false;
            this.shootPower = 0;
            this.callbacks.onShoot(finalPower);
        }

        // 5. Button Y / Triangle (Button 3): Through Ball
        if (btnPressed(3) && !this.gpButtonsPrev[3]) {
            this.callbacks.onThroughBall();
        }
        this.gpButtonsPrev[3] = btnPressed(3);

        // 6. LB / L1 (Button 4): Switch Player
        if (btnPressed(4) && !this.gpButtonsPrev[4]) {
            this.callbacks.onSwitchPlayer();
        }
        this.gpButtonsPrev[4] = btnPressed(4);

        // 7. RS Click (Button 11) or LT (Button 6): Skill Move
        if ((btnPressed(11) || btnPressed(6)) && !this.gpButtonsPrev[11]) {
            this.callbacks.onSkillMove();
        }
        this.gpButtonsPrev[11] = btnPressed(11) || btnPressed(6);
    }

    update(dt) {
        // Reset vector
        this.moveVector.x = 0;
        this.moveVector.z = 0;

        // Keyboard Movement (WASD / Arrows)
        let dirX = 0;
        let dirZ = 0;
        if (this.keys['KeyW'] || this.keys['ArrowUp']) dirZ -= 1;
        if (this.keys['KeyS'] || this.keys['ArrowDown']) dirZ += 1;
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) dirX -= 1;
        if (this.keys['KeyD'] || this.keys['ArrowRight']) dirX += 1;

        if (dirX !== 0 || dirZ !== 0) {
            const len = Math.hypot(dirX, dirZ);
            this.moveVector.x = dirX / len;
            this.moveVector.z = dirZ / len;
        }

        // Mobile Touch Joystick Override
        if (this.touchJoystick.active) {
            this.moveVector.x = this.touchJoystick.deltaX;
            this.moveVector.z = this.touchJoystick.deltaY;
        }

        // Sprint state
        this.isSprinting = !!(this.keys['ShiftLeft'] || this.keys['ShiftRight'] || this.keys['Space']);

        // Gamepad inputs poll
        this.pollGamepad();

        // Charge power meters
        if (this.shootCharging) {
            this.shootPower = Math.min(1.0, this.shootPower + dt * 2.0);
        }
        if (this.lobCharging) {
            this.lobPower = Math.min(1.0, this.lobPower + dt * 1.8);
        }
    }
}
