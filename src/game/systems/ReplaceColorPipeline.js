export default class ReplaceColorPipeline extends Phaser.Renderer.WebGL.Pipelines.SinglePipeline {
    constructor(game) {
        super({
            game,
            fragShader: `
precision mediump float;

uniform sampler2D uMainSampler;
uniform vec3 targetColor;

varying vec2 outTexCoord;

void main()
{
    vec4 color = texture2D(uMainSampler, outTexCoord);

    float diff = distance(color.rgb, targetColor);

    if (diff < 0.1)
    {
        gl_FragColor = vec4(1.0, 1.0, 1.0, color.a);
    }
    else
    {
        gl_FragColor = color;
    }
}
`
        });
    }
}