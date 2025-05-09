export const splatFragmentShader =
/* glsl */
`#version 300 es
precision mediump float;

in vec3 col;
in float scale_modif;
in float depth;
in vec4 con_o;
in vec2 xy;
in vec2 pixf;

out vec4 fragColor;


// Original CUDA implementation: https://github.com/graphdeco-inria/diff-gaussian-rasterization/blob/main/cuda_rasterizer/forward.cu#L263
void main() {

    // Resample using conic matrix (cf. "Surface 
    // Splatting" by Zwicker et al., 2001)
    vec2 d = xy - pixf;
    float power = -0.5 * (con_o.x * d.x * d.x + con_o.z * d.y * d.y) - con_o.y * d.x * d.y;

    if (power > 0.) {
        discard;
    }

    // (Custom) As the covariance matrix is calculated in a one-time operation on CPU in this implementation,
    // we need to apply the scale modifier differently to still allow for real-time scaling of the splats.
    power *= scale_modif;

    // Eq. (2) from 3D Gaussian splatting paper.
    float alpha = min(.99f, con_o.w * exp(power));
    
    // (Custom) Colorize with depth value instead of color (z-buffer visualization)
    vec3 color = col;

    if (alpha < 1./255.) {
        discard;
    }

    // Eq. (3) from 3D Gaussian splatting paper.
    fragColor = vec4(color * alpha, alpha);

    // fragColor = vec4(color , con_o.w);

    // fragColor = vec4(0.0, 0.0, 1.0, 1.0);
}
`
