import * as THREE from 'three';
import { EffectComposer } from 'postprocessing';
import { RenderPass, EffectPass, BloomEffect, SMAAEffect, ToneMappingEffect, VignetteEffect, SSAOEffect, NormalPass } from 'postprocessing';

export class PostProcessingManager {
    constructor(renderer, scene, camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.enabled = true;
        this.quality = 'high';

        this.init();
    }

    init() {
        // Create composer
        this.composer = new EffectComposer(this.renderer);

        // Add render pass
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        // Bloom effect for glowing elements
        this.bloomEffect = new BloomEffect({
            intensity: 1.2,
            luminanceThreshold: 0.8,
            luminanceSmoothing: 0.3,
            mipmapBlur: true,
            radius: 0.85
        });

        // SMAA anti-aliasing
        this.smaaEffect = new SMAAEffect();

        // Tone mapping for better color
        this.toneMappingEffect = new ToneMappingEffect({
            mode: 2, // Uncharted2ToneMapping
            resolution: 256,
            whitePoint: 4.0,
            middleGrey: 0.6,
            minLuminance: 0.01,
            averageLuminance: 1.0,
            adaptationRate: 1.0
        });

        // Vignette for focus
        this.vignetteEffect = new VignetteEffect({
            offset: 0.35,
            darkness: 0.5
        });

        // Create effect pass with all effects
        this.effectPass = new EffectPass(
            this.camera,
            this.bloomEffect,
            this.toneMappingEffect,
            this.vignetteEffect,
            this.smaaEffect
        );

        this.composer.addPass(this.effectPass);

        console.log('Post-processing initialized');
    }

    setQuality(quality) {
        this.quality = quality;

        switch (quality) {
            case 'low':
                this.bloomEffect.intensity = 0.5;
                this.bloomEffect.radius = 0.5;
                break;
            case 'medium':
                this.bloomEffect.intensity = 0.8;
                this.bloomEffect.radius = 0.7;
                break;
            case 'high':
                this.bloomEffect.intensity = 1.2;
                this.bloomEffect.radius = 0.85;
                break;
            case 'ultra':
                this.bloomEffect.intensity = 1.5;
                this.bloomEffect.radius = 1.0;
                break;
        }
    }

    setEnabled(enabled) {
        this.enabled = enabled;
    }

    render(deltaTime) {
        if (this.enabled) {
            this.composer.render(deltaTime);
        } else {
            this.renderer.render(this.scene, this.camera);
        }
    }

    setSize(width, height) {
        this.composer.setSize(width, height);
    }

    dispose() {
        this.composer.dispose();
    }
}
