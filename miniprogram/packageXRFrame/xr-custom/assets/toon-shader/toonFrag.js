import common from './common'

const toonInfo = `
uniform highp vec4 u_baseColorFactor;

uniform sampler2D u_baseColorMap;

uniform sampler2D u_gradientMap;

struct ToonMaterial {
	vec3 diffuseColor;
};

vec3 diffuse = vec3( 1.0 );
float opacity = 1.0;

vec3 BRDF_Lambert( const in vec3 diffuseColor ) {

	return RECIPROCAL_PI * diffuseColor;

} // validated

vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	// dotNL will be from -1.0 to 1.0
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );

	return vec3( texture2D( u_gradientMap, coord ).r );
}

void Direct_Toon( const in IncidentLight directLight, const in GeometricContext geometry, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {

    vec3 irradiance = getGradientIrradiance( geometry.normal, directLight.direction ) * directLight.color;

	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}

void IndirectDiffuse_Toon( const in vec3 irradiance, const in GeometricContext geometry, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {

	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );

}
`

export default
/* glsl */
`#version 100

precision highp float;
precision highp int;

uniform float u_gameTime;
uniform highp mat4 u_world;
uniform highp mat4 u_view;
uniform highp mat4 u_projection;
uniform highp mat4 u_viewInverse;

varying highp vec2 v_UV;
varying highp vec2 v_UV1;
varying highp vec3 v_ViewPosition;

#ifdef WX_USE_NORMAL
  varying highp vec3 v_Normal;
#endif

${common}

${toonInfo}

void main()
{
    vec4 diffuseColor = vec4( diffuse, opacity );

    // ReflectedLight
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
    
    // Emissive
    vec3 totalEmissiveRadiance = vec3(0.0);

#ifdef WX_USE_BASECOLORMAP
    #ifdef WX_BASECOLORMAP_USE_UV1
      vec2 uvBaseColor = v_UV1;
    #elif defined(WX_BASECOLORMAP_USE_UV2)
      vec2 uvBaseColor = v_UV2;
    #elif defined(WX_BASECOLORMAP_USE_UV3)
      vec2 uvBaseColor = v_UV3;
    #else
      vec2 uvBaseColor = v_UV;
    #endif

    vec4 baseColor = texture2D(u_baseColorMap, uvBaseColor) * u_baseColorFactor;
#else
    vec4 baseColor = u_baseColorFactor;
#endif

// Normal
#ifdef WX_USE_NORMAL
    vec3 normal = normalize(v_Normal);
#else
    vec3 normal = vec3(0.0, 0.0, 1.0);
#endif

    // Accumulation
    ToonMaterial material;
    material.diffuseColor = diffuseColor.rgb;

    GeometricContext geometry;

    geometry.position = v_ViewPosition;
    geometry.normal = normal;
    geometry.viewDir = normalize( vec3(0.0) - v_ViewPosition );

    // AddLights
#ifdef WX_USE_ADD_LIGHTS
    for(int i = 0; i < WX_ADD_LIGHTS_COUNT; ++i)
    {
    }
#endif

    vec3 color = baseColor.rgb;

    
    // color = (v_Normal + vec3(1.0, 1.0, 1.0)) / 2.0;

    gl_FragData[0] = vec4(color, 1.0);
}
`
