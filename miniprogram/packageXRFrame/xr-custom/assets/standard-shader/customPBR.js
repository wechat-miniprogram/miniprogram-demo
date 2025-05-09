import pbr from './pbr'
import bsdfs from './bsdfs'
import commonFrag from './commonFrag'
import commonVert from './commonVert'

const xrFrameSystem = wx.getXrFrameSystem()

xrFrameSystem.registerEffect('custom-pbr', scene => scene.createEffect({
  name: 'custom-pbr',
  defaultRenderQueue: 2000,
  passes: [{
    renderStates: {
      blendOn: false,
      depthWrite: true,
      cullOn: true,
      cullFace: xrFrameSystem.ECullMode.FRONT,
    },
    lightMode: 'ForwardBase',
    useMaterialRenderStates: true,
    shaders: [0, 1]
  }],
  properties: [
    { key: 'u_baseColorFactor', type: xrFrameSystem.EUniformType.FLOAT4, default: [1, 1, 1, 1] },
    { key: 'u_metallicRoughnessValues', type: xrFrameSystem.EUniformType.FLOAT2, default: [0, 1] },
    { key: 'u_normalScale', type: xrFrameSystem.EUniformType.FLOAT, default: [1] },
    { key: 'u_emissiveFactor', type: xrFrameSystem.EUniformType.FLOAT3, default: [0, 0, 0] },
    { key: 'u_occlusionStrength', type: xrFrameSystem.EUniformType.FLOAT, default: [1] },
    { key: 'u_specularFactor', type: xrFrameSystem.EUniformType.FLOAT3, default: [1, 1, 1] },
    { key: 'u_glossinessFactor', type: xrFrameSystem.EUniformType.FLOAT, default: [1] },
    { key: 'u_ior', type: xrFrameSystem.EUniformType.FLOAT, default: [1.5] },
    { key: 'u_clearcoatFactor', type: xrFrameSystem.EUniformType.FLOAT, default: [0] },
    { key: 'u_clearcoatRoughnessFactor', type: xrFrameSystem.EUniformType.FLOAT, default: [0] },
    { key: 'u_clearcoatNormalScale', type: xrFrameSystem.EUniformType.FLOAT, default: [1] },
    { key: 'u_alphaCutoff', type: xrFrameSystem.EUniformType.FLOAT, default: [0.5] },
    {
      key: 'u_diffuseSHMat', type: xrFrameSystem.EUniformType.FLOAT3, num: 9, default: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    { key: 'u_transmissionFactor', type: xrFrameSystem.EUniformType.FLOAT, default: [1] },
    { key: 'u_sheenColorFactor', type: xrFrameSystem.EUniformType.FLOAT3, default: [0.0, 0.0, 0.0] },
    { key: 'u_sheenRoughnessFactor', type: xrFrameSystem.EUniformType.FLOAT, default: [0.0] },
    /** uvTransform */
    { key: 'u_uvTransform', type: xrFrameSystem.EUniformType.MAT4, default: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
    { key: 'u_normalMapTransform', type: xrFrameSystem.EUniformType.MAT4, default: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
  ],
  images: [
    { key: 'u_brdfLUT', default: 'brdf-lut' },
    { key: 'u_baseColorMap', default: 'white', macro: 'WX_USE_BASECOLORMAP' },
    { key: 'u_metallicRoughnessMap', default: 'green', macro: 'WX_USE_METALROUGHNESSMAP' },
    { key: 'u_normalMap', default: 'white', macro: 'WX_USE_NORMALMAP' },
    { key: 'u_emissiveMap', default: 'white', macro: 'WX_USE_EMISSIVEMAP' },
    { key: 'u_occlusionMap', default: 'white', macro: 'WX_USE_OCCLUSIONMAP' },
    { key: 'u_clearcoatMap', default: 'white', macro: 'WX_USE_CLEARCOATMAP' },
    { key: 'u_specularGlossinessMap', default: 'white', macro: 'WX_USE_SPECULARGLOSSINESSMAP' },
    { key: 'u_transmissionMap', default: 'white', macro: 'WX_USE_TRANSMISSIONMAP' },
    { key: 'u_sheenColorMap', default: 'white', macro: 'WX_USE_SHEENCOLORMAP' },
    { key: 'u_metallicMap', default: 'black', macro: 'WX_USE_METALMAP' },
    { key: 'u_roughnessMap', default: 'white', macro: 'WX_USE_ROUGHNESSMAP' },
    { key: 'u_clearcoatRoughnessMap', default: 'white', macro: 'WX_USE_CLEARCOATROUGHNESSMAP' },
    { key: 'u_clearcoatNormalMap', default: 'white', macro: 'WX_USE_CLEARCOATNORMALMAP' },
    { key: 'u_sheenRoughnessMap', default: 'white', macro: 'WX_USE_SHEENROUGHNESSMAP' },
    { key: 'u_specularEnvMapMat', default: 'white' },
  ],
  shaders: [
    `#version 100

precision highp float;
precision highp int;

uniform highp mat4 u_world;
uniform highp mat4 u_view;
uniform highp mat4 u_viewInverse;
uniform highp mat4 u_projection;

attribute vec3 a_position;
attribute highp vec2 a_texCoord;
#ifdef WX_USE_UV1
attribute highp vec2 a_texCoord_1;
#endif
#ifdef WX_USE_UV2
attribute highp vec2 a_texCoord_2;
#endif
#ifdef WX_USE_UV3
attribute highp vec2 a_texCoord_3;
#endif
#ifdef WX_USE_NORMAL
  attribute highp vec3 a_normal;
  #ifdef WX_USE_TANGENT
    attribute highp vec4 a_tangent;
  #endif
#endif

varying highp vec2 v_UV;
#ifdef WX_USE_UV1
varying highp vec2 v_UV1;
#endif
#ifdef WX_USE_UV2
varying highp vec2 v_UV2;
#endif
#ifdef WX_USE_UV3
varying highp vec2 v_UV3;
#endif
varying highp vec3 v_ViewPosition;

#ifdef WX_USE_COLOR_0
    attribute vec3 a_color;
    varying highp vec3 v_Color;
#endif

#ifdef WX_USE_NORMAL
  varying highp vec3 v_Normal;
  #ifdef WX_USE_TANGENT
    varying highp vec3 v_Tangent;
    varying highp vec3 v_BitTangent;
  #endif
#endif

#ifdef WX_USE_TRANSMISSION
  varying highp vec3 v_WorldPosition;
#else
  #ifdef WX_RECEIVE_SHADOW
    varying highp vec3 v_WorldPosition;
  #endif
#endif

#ifdef WX_USE_MAIN_DIR_LIGHT
  uniform vec3 u_mainLightDir;

  varying highp vec3 v_MainLightDir;
#endif

#ifdef WX_USE_ADD_LIGHTS
  uniform vec4 u_addLightsInfo[4];
  uniform vec3 u_addLightsPos[4];
  uniform vec3 u_addLightsDir[4];

  varying highp vec3 v_AddLightsDir[WX_ADD_LIGHTS_COUNT];
  varying highp vec3 v_AddLightsPos[WX_ADD_LIGHTS_COUNT];
#endif
` +
commonVert +
`
void main()
{
#ifdef WX_SKINNED
    mat4 boneMat = getBoneMat();
    mat4 modelViewMatrix = u_view * boneMat;
#else
    mat4 modelViewMatrix = u_view * u_world;
#endif
    mat3 viewMatrixMat3 = mat3(u_view);
    mat3 normalMatrix = mat3(modelViewMatrix);
    // TODO ModleViewMatrix Inverse TransposeMatrix
    // mat3 normalMatrix = transpose(inverse(mat3(modelViewMatrix)));

    vec4 mvPosition = modelViewMatrix * vec4(a_position, 1.0);

    // varing
    v_UV = a_texCoord;
#ifdef WX_USE_UV1
    v_UV1 = a_texCoord_1;
#endif
#ifdef WX_USE_UV2
    v_UV2 = a_texCoord_2;
#endif
#ifdef WX_USE_UV3
    v_UV3 = a_texCoord_3;
#endif
    v_ViewPosition = mvPosition.xyz;

#ifdef WX_USE_COLOR_0
    v_Color = a_color;
#endif

#ifdef WX_USE_TRANSMISSION
    v_WorldPosition = (u_world * vec4(a_position, 1.0)).xyz;
#else
    #ifdef WX_RECEIVE_SHADOW
        v_WorldPosition = (u_world * vec4(a_position, 1.0)).xyz;
    #endif
#endif

#ifdef WX_USE_NORMAL
    v_Normal = normalize(vec3(normalMatrix * a_normal));
    #ifdef WX_USE_TANGENT
        vec3 transformedTangent = (modelViewMatrix * vec4(a_tangent.xyz, 0.0)).xyz;
        v_Tangent = normalize( transformedTangent );
        v_BitTangent = normalize(cross(v_Normal, v_Tangent) * a_tangent.w);
    #endif
#endif

#ifdef WX_USE_MAIN_DIR_LIGHT
    // TransformDirection
    vec3 lightDir = u_mainLightDir;

    v_MainLightDir = normalize(viewMatrixMat3 * lightDir);
#endif

#ifdef WX_USE_ADD_LIGHTS
    for(int i = 0; i < WX_ADD_LIGHTS_COUNT; ++i)
    {
      vec4 addLightInfo = u_addLightsInfo[i];
      if (addLightInfo.x == 0.0) {
        // TransformDirection
        vec3 addLightDir = u_addLightsDir[i];
        v_AddLightsDir[i] = normalize(viewMatrixMat3 * addLightDir);
      } else if (addLightInfo.x == 1.0) {
        vec3 addlightPos = u_addLightsPos[i];

        // ApplyMatrix
        v_AddLightsPos[i] = (u_view * vec4(addlightPos, 1.0)).xyz;
      } else if (addLightInfo.x == 2.0) {
        vec3 addLightDir = u_addLightsDir[i];

        // TransformDirection
        v_AddLightsDir[i] = normalize(viewMatrixMat3 * addLightDir);
        // ApplyMatrix
        v_AddLightsPos[i] = (u_view * vec4(u_addLightsPos[i], 1.0)).xyz;
      }
    }
#endif

    gl_Position = u_projection * mvPosition;

}`,
    // Fragment Shader
    `#version 100

// Temp fix Uniform limit, remove lut
#define WX_USE_BRDFLUT true

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

#ifdef WX_USE_COLOR_0
    varying highp vec3 v_Color;
#endif

#ifdef WX_USE_NORMAL
  varying highp vec3 v_Normal;

  #ifdef WX_USE_TANGENT
      varying highp vec3 v_Tangent;
      varying highp vec3 v_BitTangent;
  #endif
#endif

#ifdef WX_USE_TRANSMISSION
  varying highp vec3 v_WorldPosition;
#else
  #ifdef WX_RECEIVE_SHADOW
    varying highp vec3 v_WorldPosition;
  #endif
#endif

#ifdef WX_USE_MAIN_DIR_LIGHT
  varying highp vec3 v_MainLightDir;
#endif

#ifdef WX_USE_ADD_LIGHTS
  varying highp vec3 v_AddLightsDir[WX_ADD_LIGHTS_COUNT];
  varying highp vec3 v_AddLightsPos[WX_ADD_LIGHTS_COUNT];
#endif
` +
commonFrag +
bsdfs +
// PBR Material Info
pbr +
`
void main()
{
    vec4 diffuseColor = vec4 (diffuse, opacity);

    // ReflectedLight
    ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
    
    // Emissive
    vec3 totalEmissiveRadiance = vec3(0.0);
    // Transmission
    vec3 transmissionAll = vec3(0.0);
    float transmissionFactor = 0.0;

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

    #ifdef WX_USE_UVTRANSFORM_BASECOLOR
        uvBaseColor = (u_uvTransform * vec4( uvBaseColor, 1.0, 1.0 ) ).xy;
    #endif

    vec4 baseColor = SRGBtoLINEAR(texture2D(u_baseColorMap, uvBaseColor));
#else
    vec4 baseColor = vec4(1.0, 1.0, 1.0, 1.0);
#endif

#ifdef WX_MANUAL_LINEAR_BASECOLORFACTOR
    baseColor *= u_baseColorFactor;
#else
    baseColor *= SRGBtoLINEAR(u_baseColorFactor);
#endif

#ifdef WX_USE_ALPHA_CUTOFF
    if (baseColor.a < u_alphaCutoff) {
        discard;
    } else {
        #ifndef WX_USE_GLTF
            baseColor.a = 1.0;
        #endif
    }
#endif

    diffuseColor *= baseColor;

#ifdef WX_USE_COLOR_0
    diffuseColor *= vec4(v_Color, 1.0);
#endif

    // metallic roughness
    float roughness = u_metallicRoughnessValues.y;
    float metallic = u_metallicRoughnessValues.x;
#ifdef WX_USE_METALROUGHNESSMAP
    #ifdef WX_METALLICROUGHNESSMAP_USE_UV1
        vec2 uvMetalRougness = v_UV1;
    #elif defined(WX_METALLICROUGHNESSMAP_USE_UV2)
        vec2 uvMetalRougness = v_UV2;
    #elif defined(WX_METALLICROUGHNESSMAP_USE_UV3)
        vec2 uvMetalRougness = v_UV3;
    #else
        vec2 uvMetalRougness = v_UV;
    #endif

    #ifdef WX_USE_UVTRANSFORM_METALROUGHNESS
        uvMetalRougness = (u_uvTransform * vec4( uvMetalRougness, 1.0, 1.0 ) ).xy;
    #endif

    // Roughness is stored in the 'g' channel, metallic is stored in the 'b' channel.
    // This layout intentionally reserves the 'r' channel for (optional) occlusion map data
    vec4 mrSample = texture2D(u_metallicRoughnessMap, uvMetalRougness);
    roughness *= mrSample.g;
    metallic *= mrSample.b;
#else
    #ifdef WX_USE_ROUGHNESSMAP
        roughness *= texture2D(u_roughnessMap, v_UV).r;
    #endif
    #ifdef WX_USE_METALMAP
        metallic *= texture2D(u_metallicMap, v_UV).r;
    #endif
#endif

    // Normal
#ifdef WX_USE_NORMAL
    vec3 normal = normalize(v_Normal);

    #ifndef WX_USE_CULLON
      #ifndef WX_USE_GLTF
        float facing = gl_FrontFacing ? -1.0 : 1.0;
        normal *= facing;
      #endif
    #endif

    #ifdef WX_USE_TANGENT
        vec3 tangent = normalize(v_Tangent);

        #ifdef WX_USE_NORMALMAP
            #ifdef WX_NORMALMAP_USE_UV1
                vec2 uvNormal = v_UV1;
            #elif defined(WX_NORMALMAP_USE_UV2)
                vec2 uvNormal = v_UV2;
            #elif defined(WX_NORMALMAP_USE_UV3)
                vec2 uvNormal = v_UV3;
            #else
                vec2 uvNormal = v_UV;
            #endif

            #ifdef WX_USE_UVTRANSFORM_NORMAL
                uvNormal = (u_normalMapTransform * vec4( uvNormal, 1.0, 1.0 ) ).xy;
            #endif

            vec3 normalSample = texture2D(u_normalMap, uvNormal).xyz * 2.0 - 1.0;
            normalSample *= u_normalScale;

            vec3 bitangent = normalize( v_BitTangent );
            mat3 vTBN = mat3( tangent, bitangent, normal );
            normal = normalize( vTBN * normalSample );
        #endif
    #else
        vec3 tangent = vec3(0.0, 0.0, 0.0);
    #endif
#else
    vec3 normal = vec3(0.0, 0.0, 1.0);
#endif

    // Emissivemap
    totalEmissiveRadiance = u_emissiveFactor;
#ifdef WX_USE_EMISSIVEMAP
    #ifdef WX_EMISSIVEMAP_USE_UV1
        vec2 uvEmissive = v_UV1;
    #elif defined(WX_EMISSIVEMAP_USE_UV2)
        vec2 uvEmissive = v_UV2;
    #elif defined(WX_EMISSIVEMAP_USE_UV3)
        vec2 uvEmissive = v_UV3;
    #else
        vec2 uvEmissive = v_UV;
    #endif

    #ifdef WX_USE_UVTRANSFORM_EMISSIVE
        uvEmissive = (u_uvTransform * vec4( uvEmissive, 1.0, 1.0 ) ).xy;
    #endif

  //  vec4 emissiveColor = SRGBtoLINEAR(texture2D(u_emissiveMap, uvEmissive));
    vec4 emissiveColor  = vec4(1.0, 0.0, 0.0, 1.0);
    totalEmissiveRadiance *= emissiveColor.rgb;
#endif
      
    // Accumulation
    // ----------- start -------------
    PhysicalMaterial material;

#ifdef WX_USE_SPECULARGLOSSINESS
    vec3 specularFactor = u_specularFactor;
    float glossinessFactor = u_glossinessFactor;
    #ifdef WX_USE_SPECULARGLOSSINESSMAP
        #ifdef WX_SPECULARGLOSSINESSMAP_USE_UV1
            vec2 uvSpecularGlossiness = v_UV1;
        #elif defined(WX_EMISSIVEMAP_USE_UV2)
            vec2 uvSpecularGlossiness = v_UV2;
        #elif defined(WX_EMISSIVEMAP_USE_UV3)
            vec2 uvSpecularGlossiness = v_UV3;
        #else
            vec2 uvSpecularGlossiness = v_UV;
        #endif

        #ifdef WX_USE_UVTRANSFORM_SPECULARGLOSSINESS
            uvSpecularGlossiness = (u_uvTransform * vec4( uvSpecularGlossiness, 1.0, 1.0 ) ).xy;
        #endif

        vec4 specularGlossinessSample = texture2D(u_specularGlossinessMap, uvSpecularGlossiness);
        specularFactor *= SRGBtoLINEAR(specularGlossinessSample).rgb;
        glossinessFactor *= specularGlossinessSample.a;
    #endif

    material.diffuseColor = diffuseColor.rgb * ( 1.0 - max( specularFactor.r, max( specularFactor.g, specularFactor.b ) ) );
    material.specularColor = specularFactor;
    material.specularF90 = 1.0;

    roughness = 1.0 - glossinessFactor;
#else
    material.diffuseColor = diffuseColor.rgb * ( 1.0 - metallic );
    float specularIntensityFactor = 1.0;
    vec3 specularColorFactor = vec3( 1.0 );
    material.specularColor = mix( min( pow2( ( u_ior - 1.0 ) / ( u_ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metallic );

    material.specularF90 = 1.0;
#endif

    material.roughness = max( roughness, 0.0525 );// 0.0525 corresponds to the base mip of a 256 cubemap.
    material.roughness = min( material.roughness, 1.0 );

    GeometricContext geometry;

    geometry.position = v_ViewPosition;
    geometry.normal = normal;
    geometry.viewDir = normalize( vec3(0.0) - v_ViewPosition );

    IncidentLight directLight;

    vec3 iblIrradiance = vec3( 0.0 );
    vec3 irradiance = vec3( 0.0 );
    vec3 radiance = vec3( 0.0 );
    vec3 clearcoatRadiance = vec3( 0.0 );

    // env Rotation
    #ifdef WX_USE_MAT_ENV
        mat3 envRotationY = rotationMatY3(0.0);
    #else
        mat3 envRotationY = rotationMatY3(u_envRotation);
    #endif

#ifdef WX_USE_CLEARCOAT
    #ifdef WX_USE_CLEARCOATMAP
        #ifdef WX_CLEARCOATMAP_USE_UV1
            vec2 uvClearCoat = v_UV1;
        #elif defined(WX_CLEARCOATMAP_USE_UV2)
            vec2 uvClearCoat = v_UV2;
        #elif defined(WX_CLEARCOATMAP_USE_UV3)
            vec2 uvClearCoat = v_UV3;
        #else
            vec2 uvClearCoat = v_UV;
        #endif

        #ifdef WX_USE_UVTRANSFORM_CLEARCOAT
            uvClearCoat = (u_uvTransform * vec4( uvClearCoat, 1.0, 1.0 ) ).xy;
        #endif

        vec4 clearCoatSample = texture2D(u_clearcoatMap, uvClearCoat);
    #else
        vec4 clearCoatSample = vec4(1.0, 1.0, 1.0, 1.0);
    #endif

    #ifdef WX_USE_CLEARCOATROUGHNESSMAP
        #ifdef WX_CLEARCOATROUGHNESSMAP_USE_UV1
            vec2 uvClearCoatRoughness = v_UV1;
        #elif defined(WX_CLEARCOATROUGHNESSMAP_USE_UV2)
            vec2 uvClearCoatRoughness = v_UV2;
        #elif defined(WX_CLEARCOATROUGHNESSMAPP_USE_UV3)
            vec2 uvClearCoatRoughness = v_UV3;
        #else
            vec2 uvClearCoatRoughness = v_UV;
        #endif

        #ifdef WX_USE_UVTRANSFORM_CLEARCOATROUGHNESS
            uvClearCoatRoughness = (u_uvTransform * vec4( uvClearCoatRoughness, 1.0, 1.0 ) ).xy;
        #endif

        vec4 clearCoatRoughnessSample = texture2D(u_clearcoatRoughnessMap, uvClearCoatRoughness);
    #else
        vec4 clearCoatRoughnessSample = vec4(1.0, 1.0, 1.0, 1.0);
    #endif

    #ifdef WX_USE_CLEARCOATNORMALMAP
        #ifdef WX_CLEARCOATNORMALMAP_USE_UV1
            vec2 uvClearCoatNormal = v_UV1;
        #elif defined(WX_CLEARCOATNORMALMAP_USE_UV2)
            vec2 uvClearCoatNormal = v_UV2;
        #elif defined(WX_CLEARCOATNORMALMAP_USE_UV3)
            vec2 uvClearCoatNormal = v_UV3;
        #else
            vec2 uvClearCoatNormal = v_UV;
        #endif

        #ifdef WX_USE_UVTRANSFORM_CLEARCOATNORMAL
            uvClearCoatNormal = (u_uvTransform * vec4( uvClearCoatNormal, 1.0, 1.0 ) ).xy;
        #endif

        vec4 clearCoatNormalSample = texture2D(u_clearcoatNormalMap, uvClearCoatNormal);
    #else
        vec4 clearCoatNormalSample = vec4(1.0, 1.0, 1.0, 1.0);
    #endif

    geometry.clearcoatNormal = geometry.normal;

    material.clearcoat = u_clearcoatFactor * clearCoatSample.r;
    material.clearcoat = saturate( material.clearcoat ); // Burley clearcoat model

    material.clearcoatRoughness = u_clearcoatRoughnessFactor * clearCoatRoughnessSample.g;
    material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
    material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );

    material.clearcoatF0 = vec3( 0.04 );
	  material.clearcoatF90 = 1.0;

    clearcoatRadiance += getIBLRadiance( geometry.viewDir, geometry.clearcoatNormal, material.clearcoatRoughness, envRotationY);
#endif

#ifdef WX_USE_SHEEN
    material.sheenColor = u_sheenColorFactor;

    #ifdef WX_USE_SHEENCOLORMAP
        #ifdef WX_SHEENCOLORMAP_USE_UV1
            vec2 uvSheenColor = v_UV1;
        #elif defined(WX_SHEENCOLORMAP_USE_UV2)
            vec2 uvSheenColor = v_UV2;
        #elif defined(WX_SHEENCOLORMAP_USE_UV3)
            vec2 uvSheenColor = v_UV3;
        #else
            vec2 uvSheenColor = v_UV;
        #endif
        material.sheenColor *= SRGBtoLINEAR(texture2D( u_sheenColorMap, uvSheenColor )).rgb;
	#endif

    material.sheenRoughness = clamp( u_sheenRoughnessFactor, 0.07, 1.0 );

	#ifdef WX_USE_SHEENROUGHNESSMAP
        #ifdef WX_SHEENROUGHNESSMAP_USE_UV1
            vec2 uvSheenRoughness = v_UV1;
        #elif defined(WX_SHEENROUGHNESSMAP_USE_UV2)
            vec2 uvSheenRoughness = v_UV2;
        #elif defined(WX_SHEENROUGHNESSMAP_USE_UV3)
            vec2 uvSheenRoughness = v_UV3;
        #else
            vec2 uvSheenRoughness = v_UV;
        #endif
        material.sheenRoughness *= texture2D( u_sheenRoughnessMap, uvSheenRoughness ).a;
	#endif
#endif
    // ----------- end -------------
    
    // MainLights
#ifdef WX_USE_MAIN_DIR_LIGHT
    vec3 lightDir = v_MainLightDir;

    vec3 mainLightColor = u_mainLightColorIns.rgb * u_mainLightColorIns.a;
    directLight.color = mainLightColor;

    #ifdef WX_RECEIVE_SHADOW
        directLight.color = directLight.color * shadowCalculation(v_WorldPosition);
    #endif
    directLight.direction = lightDir;
    directLight.visible = true;
    Direct_Physical( directLight, geometry, material, reflectedLight );
#endif
  
    // AddLights
#ifdef WX_USE_ADD_LIGHTS

    for(int i = 0; i < WX_ADD_LIGHTS_COUNT; ++i)
    {
      vec4 addLightInfo = u_addLightsInfo[i];
      vec3 addLightColor = u_addLightsColorIns[i].rgb * u_addLightsColorIns[i].a;

      if (addLightInfo.x == 0.0) {
        // Directional Light
        directLight.direction = v_AddLightsDir[i];
        Direct_Physical( directLight, geometry, material, reflectedLight );
      } else if (addLightInfo.x == 1.0) {
        // Point Light
        float range = addLightInfo.y;
        vec3 pointLightPos = v_AddLightsPos[i];
        vec3 lVector = pointLightPos - geometry.position;
        
        float lightDistance = length( lVector );
        float attenuation = getDistanceAttenuation(lightDistance, range, 2.0);

        directLight.color = addLightColor * attenuation;
        directLight.direction = normalize( lVector );
        directLight.visible = ( directLight.color != vec3( 0.0 ) );

        Direct_Physical( directLight, geometry, material, reflectedLight );
      } else if (addLightInfo.x == 2.0) {
        // Spot Light
        float range = addLightInfo.y;
        vec3 spotLightPos = v_AddLightsPos[i];
        vec3 spotLightDir = v_AddLightsDir[i];
        vec3 lVector = spotLightPos - geometry.position;

        directLight.direction = normalize( lVector );

        float angleCos = dot( directLight.direction, spotLightDir );
        // Use Basic Clamp
        // float spotAttenuation = clamp((angleCos - addLightInfo.w) / (addLightInfo.z - addLightInfo.w), 0.0, 1.0);

        // Use smoothstep
        float spotAttenuation = smoothstep( addLightInfo.w, addLightInfo.z, angleCos );

        if ( spotAttenuation > 0.0 ) {
          float lightDistance = length( lVector );
    
          directLight.color = addLightColor * spotAttenuation;
          directLight.color *= getDistanceAttenuation( lightDistance, range, 1.0 );
          directLight.visible = ( directLight.color != vec3( 0.0 ) );
        } else {
          directLight.color = vec3( 0.0 );
          directLight.visible = false;
        }

        Direct_Physical( directLight, geometry, material, reflectedLight );
      }

      #ifdef WX_USE_TRANSMISSION
        transmissionFactor = u_transmissionFactor;

        #ifdef WX_USE_TRANSMISSIONMAP
            transmissionFactor *= texture2D( u_transmissionMap, v_UV ).r;
        #endif

        vec3 pos = v_WorldPosition;
        vec3 cameraPos = vec3(u_viewInverse[3][0], u_viewInverse[3][1], u_viewInverse[3][2]);

        vec3 v = normalize( cameraPos - pos );
        // vec3 n = inverseTransformDirection( normal, u_view );
        vec3 n = geometry.normal;

        vec3 transmissionVec = getIBLVolumeRefractionVec(n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90, pos, u_world);
        vec3 pointToLight = directLight.direction;
        pointToLight -= transmissionVec;
        vec3 lightDir = normalize(pointToLight);
        vec3 intensity =  getLightIntensity(addLightInfo, pointToLight, directLight.color, directLight.direction, u_addLightsColorIns[i].a);
        transmissionAll += intensity * getPunctualTransmissionIntensity(lightDir, geometry.viewDir, geometry.normal, material.specularColor, material.specularF90, material.roughness, material.diffuseColor, u_ior);
      #endif
      
    }
#endif

    // AmbientLight
#ifdef WX_USE_AMBIENT_LIGHT
    vec3 ambientLightColor = u_ambientLightColorIns.rgb * u_ambientLightColorIns.a;
    irradiance = getAmbientLightIrradiance( ambientLightColor );
#endif

#ifdef WX_USE_IBL_DIFFUSE

    // vec3 shNormal = geometry.normal;
    vec3 shNormal = inverseTransformDirection( geometry.normal, u_view );
    shNormal = shNormal * envRotationY;
    
    #ifdef WX_USE_MAT_ENV
      vec3 diffuseLight = computeDiffuseSHLight(shNormal, u_diffuseSHMat);
      iblIrradiance += diffuseLight;

    #else
      vec3 diffuseLight = computeDiffuseSHLight(shNormal, u_diffuseSH);
      iblIrradiance += diffuseLight * u_diffuseExp;

    #endif

    // iblIrradiance += diffuseLight * material.diffuseColor * u_diffuseExp;
    // iblIrradiance += diffuseLight * u_diffuseExp;

#endif

#ifdef WX_USE_IBL_SPECULAR
    #ifdef WX_USE_MAT_ENV
        radiance += getIBLRadiance(geometry.viewDir, geometry.normal, material.roughness, envRotationY);
    #else
        radiance += getIBLRadiance(geometry.viewDir, geometry.normal, material.roughness, envRotationY) * u_specularExp;
    #endif
#endif

    // IndirectDiffuse
    IndirectDiffuse_Physical( irradiance, geometry, material, reflectedLight );
    
    // IndirectSpecular
    IndirectSpecular_Physical( radiance, iblIrradiance, clearcoatRadiance, geometry, material, reflectedLight );
  
    // AO
    float ao = 1.0;
#ifdef WX_USE_OCCLUSIONMAP
    #ifdef WX_OCCLUSIONMAP_USE_UV1
      vec2 uvOcclusion = v_UV1;
    #elif defined(WX_OCCLUSIONMAP_USE_UV2)
      vec2 uvOcclusion = v_UV2;
    #elif defined(WX_OCCLUSIONMAP_USE_UV3)
      vec2 uvOcclusion = v_UV3;
    #else
      vec2 uvOcclusion = v_UV;
    #endif

    #ifdef WX_USE_UVTRANSFORM_OCCLUSION
        uvOcclusion = (u_uvTransform * vec4( uvOcclusion, 1.0, 1.0 ) ).xy;
    #endif

    ao = texture2D(u_occlusionMap, uvOcclusion).r;
    ao *= u_occlusionStrength;

    // Diffuse
    reflectedLight.indirectDiffuse *= ao;

    // SPECULAR
    #ifdef WX_USE_IBL_SPECULAR
        float dotNV = saturate( dot(geometry.normal, geometry.viewDir ) );
        reflectedLight.indirectSpecular *= saturate( pow( dotNV + ao, exp2( - 16.0 * material.roughness - 1.0 ) ) - 1.0 + ao );
    #endif
#endif

    vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
    vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
    totalDiffuse = mix( totalDiffuse, transmissionAll.rgb, transmissionFactor );

    vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;

#ifdef WX_USE_SHEEN
    // Sheen energy compensation approximation calculation can be found at the end of
    // https://drive.google.com/file/d/1T0D1VSyR4AllqIJTQAraEIzjlb5h4FKH/view?usp=sharing
    float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
    outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecular;
#endif

#ifdef WX_USE_CLEARCOAT
    float dotNVcc = saturate( dot( geometry.clearcoatNormal, geometry.viewDir ) );

    vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );

    outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + clearcoatSpecular * material.clearcoat;
#endif

    vec3 color = outgoingLight;

    // gamma correct
#ifndef WX_PP_ACTIVE
    color = gammaCorrection(color);
#endif
    #ifndef WX_USE_BLEND
      diffuseColor.a = 1.0;
    #endif
    gl_FragData[0] = vec4(color, diffuseColor.a);
}
`
  ],
}))
