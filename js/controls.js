/**
 * EA FC 27 Web Edition - Multi-Input Controller System
 * Keyboard, Gamepad API, and Mobile Virtual Touch Joystick
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

        // Gamepad state
        this.gamepadIndex = null;

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
            console.log('🎮 Gamepad connected:', e.gamepad.id);
            this.gamepadIndex = e.gamepad.index;
        });
        window.addEventListener('gamepaddisconnected', (e) => {
            if (this.gamepadIndex === e.gamepad.index) this.gamepadIndex = null;
        });

        // 3. Virtual Mobile Touch Setup
        this.initTouchControls();
    }

    onKeyDown(e) {
        if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
            e.preventDefault(); // prevent window scrolling
        }

        this.keys[e.code] = true;

        // Shoot charging start (D / K)
        if ((e.code === 'KeyD' || e.code === 'KeyK') && !this.shootCharging) {
            this.shootCharging = true;
            this.shootPower = 0;
        }

        // Lob pass charging start (A / L)
        if ((e.code === 'KeyA' || e.code === 'KeyL') && !this.lobCharging) {
            this.lobCharging = true;
            this.lobPower = 0;
        }
    }

    onKeyUp(e) {
        this.keys[e.code] = false;

        // Ground Pass (X / J)
        if (e.code === 'KeyX' || e.code === 'KeyJ') {
            this.callbacks.onPass();
        }

        // Through Ball (W / I)
        if (e.code === 'KeyW' || e.code === 'KeyI') {
            this.callbacks.onThroughBall();
        }

        // Shoot Release (D / K)
        if ((e.code === 'KeyD' || e.code === 'KeyK') && this.shootCharging) {
            this.shootCharging = false;
            this.callbacks.onShoot(Math.max(0.2, this.shootPower));
            this.shootPower = 0;
        }

        // Lob Pass Release (A / L)
        if ((e.code === 'KeyA' || e.code === 'KeyL') && this.lobCharging) {
            this.lobCharging = false;
            this.callbacks.onLobPass(Math.max(0.3, this.lobPower));
            this.lobPower = 0;
        }

        // Standing / Slide Tackle (C / Semicolon)
        if (e.code === 'KeyC' || e.code === 'Semicolon') {
            this.callbacks.onTackle();
        }

        // Switch Player (Q / U)
        if (e.code === 'KeyQ' || e.code === 'KeyU') {
            this.callbacks.onSwitchPlayer();
        }

        // Skill Move (E / O)
        if (e.code === 'KeyE' || e.code === 'KeyO') {
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

                if (dist < 120) {
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
            () => { this.shootCharging = true; this.shootPower = 0; },
            () => {
                if (this.shootCharging) {
                    this.shootCharging = false;
                    this.callbacks.onShoot(Math.max(0.2, this.shootPower));
                    this.shootPower = 0;
                }
            }
        );
        bindBtn('btn-touch-lob', 
            () => { this.lobCharging = true; this.lobPower = 0; },
            () => {
                if (this.lobCharging) {
                    this.lobCharging = false;
                    this.callbacks.onLobPass(Math.max(0.3, this.lobPower));
                    this.lobPower = 0;
                }
            }
        );
        bindBtn('btn-touch-tackle', null, () => this.callbacks.onTackle());
        bindBtn('btn-touch-switch', null, () => this.callbacks.onSwitchPlayer());
        bindBtn('btn-touch-skill', null, () => this.callbacks.onSkillMove());
    }

    pollGamepad() {
        if (this.gamepadIndex === null) return;
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        const gp = gamepads[this.gamepadIndex];
        if (!gp) return;

        // Left Analog Stick for Movement
        const axisX = gp.axes[0] || 0;
        const axisY = gp.axes[1] || 0;
        const deadzone = 0.18;

        if (Math.hypot(axisX, axisY) > deadzone) {
            this.moveVector.x = axisX;
            this.moveVector.z = axisY;
        }

        // Sprint button (RT / R2 or RB / R1)
        this.isSprinting = gp.buttons[7]?.pressed || gp.buttons[5]?.pressed || this.isSprinting;

        // Button A / Cross: Pass
        if (gp.buttons[0]?.pressed && !this.gpButtonAState) {
            this.callbacks.onPass();
        }
        this.gpButtonAState = gp.buttons[0]?.pressed;

        // Button B / Circle: Shoot
        if (gp.buttons[1]?.pressed) {
            if (!this.shootCharging) {
                this.shootCharging = true;
                this.shootPower = 0;
            }
        } else if (this.shootCharging) {
            this.shootCharging = false;
            this.callbacks.onShoot(Math.max(0.2, this.shootPower));
            this.shootPower = 0;
        }

        // Button Y / Triangle: Through Ball
        if (gp.buttons[3]?.pressed && !this.gpButtonYState) {
            this.callbacks.onThroughBall();
        }
        this.gpButtonYState = gp.buttons[3]?.pressed;

        // Button X / Square: Lob / Tackle
        if (gp.buttons[2]?.pressed) {
            if (!this.lobCharging) {
                this.lobCharging = true;
                this.lobPower = 0;
            }
        } else if (this.lobCharging) {
            this.lobCharging = false;
            this.callbacks.onLobPass(Math.max(0.3, this.lobPower));
            this.lobPower = 0;
        }

        // LB / L1: Switch player
        if (gp.buttons[4]?.pressed && !this.gpButtonLBState) {
            this.callbacks.onSwitchPlayer();
        }
        this.gpButtonLBState = gp.buttons[4]?.pressed;

        // RS Click: Skill Move
        if (gp.buttons[11]?.pressed && !this.gpButtonRSState) {
            this.callbacks.onSkillMove();
        }
        this.gpButtonRSState = gp.buttons[11]?.pressed;
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
            this.shootPower = Math.min(1.0, this.shootPower + dt * 1.6);
        }
        if (this.lobCharging) {
            this.lobPower = Math.min(1.0, this.lobPower + dt * 1.5);
        }
    }
}
