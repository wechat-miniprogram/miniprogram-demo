export default /* glsl */`
// temporary
vec3 clearcoatSpecular = vec3( 0.0 );
vec3 sheenSpecular = vec3( 0.0 );

vec3 diffuse = vec3( 1.0 );
float opacity = 1.0;

struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float roughness;
	float specularF90;

	#ifdef WX_USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef WX_USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
};

uniform sampler2D u_brdfLUT;
uniform float u_envRotation;

uniform vec2 u_metallicRoughnessValues;
uniform vec4 u_baseColorFactor;
uniform vec3 u_emissiveFactor;

uniform float u_ior;

#ifdef WX_USE_ALPHA_CUTOFF
	uniform float u_alphaCutoff;
#endif

#ifdef WX_USE_CLEARCOAT
	uniform float u_clearcoatFactor;
	uniform float u_clearcoatRoughnessFactor;
	uniform float u_clearcoatNormalScale;
#endif

#ifdef WX_USE_BASECOLORMAP
	uniform sampler2D u_baseColorMap;
	// uniform mat3 u_baseColorMapTransform;
#endif
#ifdef WX_USE_NORMALMAP
	uniform sampler2D u_normalMap;
	uniform float u_normalScale;
	uniform mat4 u_normalMapTransform;
#endif
#ifdef WX_USE_EMISSIVEMAP
	uniform sampler2D u_emissiveMap;
	// uniform mat3 u_emissiveMapTransform;
#endif
#ifdef WX_USE_METALMAP
	uniform sampler2D u_metallicMap;
#endif
#ifdef WX_USE_ROUGHNESSMAP
	uniform sampler2D u_roughnessMap;
#endif
#ifdef WX_USE_METALROUGHNESSMAP
	uniform sampler2D u_metallicRoughnessMap;
	// uniform mat3 u_metallicRoughnessMapTransform;
#endif
#ifdef WX_USE_OCCLUSIONMAP
	uniform sampler2D u_occlusionMap;
	uniform float u_occlusionStrength;
	// uniform mat3 u_occlusionMapTransform;
#endif
#ifdef WX_USE_CLEARCOATMAP
	uniform sampler2D u_clearcoatMap;
	// uniform mat3 u_clearcoatMapTransform;
#endif
#ifdef WX_USE_CLEARCOATROUGHNESSMAP
	uniform sampler2D u_clearcoatRoughnessMap;
	// uniform mat3 u_clearcoatRoughnessMapTransform;
#endif
#ifdef WX_USE_CLEARCOATNORMALMAP
	uniform sampler2D u_clearcoatNormalMap;
	// uniform mat3 u_clearcoatNormalMapTransform;
#endif
#ifdef WX_USE_SPECULARGLOSSINESS
	uniform vec3 u_specularFactor;
	uniform float u_glossinessFactor;

	#ifdef WX_USE_SPECULARGLOSSINESSMAP
		uniform sampler2D u_specularGlossinessMap;
		// uniform mat3 u_specularGlossinessMapTransform;
	#endif
#endif
#ifdef WX_USE_TRANSMISSION
	uniform float u_transmissionFactor;

	#ifdef WX_USE_TRANSMISSIONMAP
		uniform sampler2D u_transmissionMap;
		// uniform mat3 u_transmissionMapTransform;
	#endif
#endif

#ifdef WX_USE_SHEEN
	uniform vec3 u_sheenColorFactor;
	uniform float u_sheenRoughnessFactor;

	#ifdef WX_USE_SHEENCOLORMAP
			uniform sampler2D u_sheenColorMap;
	#endif

	#ifdef WX_USE_SHEENROUGHNESSMAP
			uniform sampler2D u_sheenRoughnessMap;
	#endif
#endif

#ifdef WX_USE_UVTRANSFORM
	uniform mat4 u_uvTransform;
#endif

#ifdef WX_USE_MAT_ENV
	uniform vec3 u_diffuseSHMat[9];
	uniform float u_diffuseExpMat;
	uniform sampler2D u_specularEnvMapMat;
	uniform float u_specularExpMat;
	uniform float u_specularEnvMapMipCountMat;
#else
	uniform vec3 u_diffuseSH[9];
	uniform float u_diffuseExp;
	uniform sampler2D u_specularEnvMap;
	uniform float u_specularExp;
	uniform float u_specularEnvMapMipCount;
#endif


#ifdef WX_RECEIVE_SHADOW
	uniform float u_shadowStrength;
	uniform float u_shadowBias;
	uniform vec3 u_shadowColor;
	uniform sampler2D u_shadowMap;

	uniform mat4 u_csmLightSpaceMatrices[4];
	uniform vec4 u_csmFarBounds;
	uniform vec4 u_shadowTilingOffsets[4];
#endif

// ----- Start Func -----

#ifdef WX_USE_SHEEN
	// https://github.com/google/filament/blob/master/shaders/src/brdf.fs
	float D_Charlie( float roughness, float dotNH ) {

		float alpha = pow2( roughness );

		// Estevez and Kulla 2017, "Production Friendly Microfacet Sheen BRDF"
		float invAlpha = 1.0 / alpha;
		float cos2h = dotNH * dotNH;
		float sin2h = max( 1.0 - cos2h, 0.0078125 ); // 2^(-14/2), so sin2h^2 > 0 in fp16

		return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );

	}

	// https://github.com/google/filament/blob/master/shaders/src/brdf.fs
	float V_Neubelt( float dotNV, float dotNL ) {

		// Neubelt and Pettineo 2013, "Crafting a Next-gen Material Pipeline for The Order: 1886"
		return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );

	}

	vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {

		vec3 halfDir = normalize( lightDir + viewDir );

		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );

		float D = D_Charlie( sheenRoughness, dotNH );
		float V = V_Neubelt( dotNV, dotNL );

		return sheenColor * ( D * V );

	}

	// This is a curve-fit approxmation to the "Charlie sheen" BRDF integrated over the hemisphere from 
	// Estevez and Kulla 2017, "Production Friendly Microfacet Sheen BRDF". The analysis can be found
	// in the Sheen section of https://drive.google.com/file/d/1T0D1VSyR4AllqIJTQAraEIzjlb5h4FKH/view?usp=sharing
	float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {

		float dotNV = saturate( dot( normal, viewDir ) );

		float r2 = roughness * roughness;

		float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;

		float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;

		float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );

		return saturate( DG * RECIPROCAL_PI );

	}

#endif

#ifdef WX_USE_TRANSMISSION
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior,  mat4 modelMatrix ) {
		// Direction of refracted light.
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );

		vec3 modelScale;
		modelScale.x = length(vec3(modelMatrix[0].xyz));
		modelScale.y = length(vec3(modelMatrix[1].xyz));
		modelScale.z = length(vec3(modelMatrix[2].xyz));

		// The thickness is specified in local space.
		return normalize( refractionVector ) * modelScale * thickness;
	}

	vec3 getIBLVolumeRefractionVec (const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position,  mat4 modelMatrix) {
			
			vec3 transmissionRay = getVolumeTransmissionRay(n, v, 1.0, 1.0, modelMatrix);
			vec3 refractedRayExit = position + transmissionRay;

			return refractedRayExit;
	}

	float getRangeAttenuation(float range, float distance)
	{
		// negative range means infinite
			if (range <= 0.0)
			{
					return 1.0 / pow(distance, 2.0);
			}
			return max(min(1.0 - pow(distance / range, 4.0), 1.0), 0.0) / pow(distance, 2.0);
	}

	float getSpotAttenuation(vec3 pointToLight, vec3 spotDirection, float outerConeCos, float innerConeCos)
	{
			float actualCos = dot(normalize(spotDirection), normalize(-pointToLight));
			if (actualCos > outerConeCos)
			{
					if (actualCos < innerConeCos)
					{
							return smoothstep(outerConeCos, innerConeCos, actualCos);
					}
					return 1.0;
			}
			return 0.0;
	}

	vec3 getLightIntensity(vec4 sourceLight, vec3 pointToLight, vec3 color, vec3 direction, float intensity)
	{
		float rangeAttenuation = 1.0;
			float spotAttenuation = 1.0;
			if (sourceLight.x != 0.0)
			{
					rangeAttenuation = getRangeAttenuation(sourceLight.y, length(pointToLight));
			}
			if (sourceLight.x == 2.0)
			{
					spotAttenuation = getSpotAttenuation(pointToLight, direction, sourceLight.w, sourceLight.z);
			}
			return rangeAttenuation * spotAttenuation * color * intensity;
		//return sourceLight.color;
	}

	float iorToRoughness(float roughness, float ior)
	{
			// an IOR of 1.0 results in no microfacet refraction
			// an IOR of 1.5 results in the default amount of microfacet refraction.
			return roughness * clamp(ior * 2.0 - 2.0, 0.0, 1.0);
	}

	vec3 getPunctualTransmissionIntensity( const in vec3 lightDir, const in vec3 view, const in vec3 normal, const in vec3 f0, const in float f90, const in float roughness, const in vec3 baseColor, const in float ior )
	{

		float alphaRoughness = pow2( roughness ); 
		float tranmissionRoughness = iorToRoughness(alphaRoughness, ior);
		vec3 normalDir = normalize( normal );
		vec3 viewDir = normalize( view );
		vec3 lightDirMirror = normalize(lightDir + 2.0 * normalDir * dot(-lightDir, normalDir));
		vec3 halfDir = normalize( lightDirMirror + viewDir );

		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );

		vec3 F = F_Schlick( f0, f90, dotVH );

		float V = V_GGX_SmithCorrelated( alphaRoughness, dotNL, dotNV );

		float D = D_GGX( alphaRoughness, dotNH );

		return (1.0 - F) * baseColor * D * V;
	}
#endif
// ----- end Func -----

vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}

float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	// based upon Frostbite 3 Moving to Physically-based Rendering
	// page 32, equation 26: E[window1]
	// https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );

	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}

void Direct_Physical( const in IncidentLight directLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {

	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );

	vec3 irradiance = dotNL * directLight.color;

	vec3 brdf = BRDF_GGX( directLight.direction, geometry.viewDir, geometry.normal, material.specularColor, material.specularF90, material.roughness );

	vec3 irradianceBRDF = irradiance * brdf;

	// TODO fix brdf too big or too small
	irradianceBRDF = vec3(saturate(irradianceBRDF.x), saturate(irradianceBRDF.y), saturate(irradianceBRDF.z));

	#ifdef WX_USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometry.clearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecular += ccIrradiance * BRDF_GGX( directLight.direction, geometry.viewDir, geometry.clearcoatNormal, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif

	#ifdef WX_USE_SHEEN
		sheenSpecular += irradiance * BRDF_Sheen( directLight.direction, geometry.viewDir, geometry.normal, material.sheenColor, material.sheenRoughness );
	#endif

	reflectedLight.directSpecular += irradianceBRDF;

	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	
	// reflectedLight.directDiffuse += irradiance;
	// reflectedLight.directDiffuse += vec3(dotNL, dotNL, dotNL);
	// reflectedLight.directDiffuse += geometry.normal;
	// reflectedLight.directDiffuse += directLight.direction;
}

void IndirectDiffuse_Physical( const in vec3 irradiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}

void IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef WX_USE_BRDFLUT
		float dotNV = clamp( dot(geometry.normal, geometry.viewDir), 0.001, 0.999);
		// @Fix change (1.0 - material.roughness) to (material.roughness), for using u_brdfLUT that is Y filp.
		// @Fix texture2D(u_brdfLUT, vec2(0.0, 1.0)) has Wrong Return. g is 65.
		vec3 brdf = texture2D(u_brdfLUT, vec2(dotNV, clamp(material.roughness, 0.001, 0.999))).rgb;
		reflectedLight.indirectSpecular += radiance * (material.specularColor * brdf.x + brdf.y);
		reflectedLight.indirectDiffuse += irradiance * material.diffuseColor;

		#ifdef WX_USE_CLEARCOAT
				clearcoatSpecular += clearcoatRadiance * (material.specularColor * brdf.x + brdf.y);
		#endif

		#ifdef WX_USE_SHEEN
				sheenSpecular += irradiance * material.sheenColor * IBLSheenBRDF( geometry.normal, geometry.viewDir, material.sheenRoughness );
				// sheenSpecular += irradiance;
		#endif
	#else
		// Both indirect specular and indirect diffuse light accumulate here
		vec3 singleScattering = vec3( 0.0 );
		vec3 multiScattering = vec3( 0.0 );
		vec3 cosineWeightedIrradiance = irradiance;

		computeMultiscattering( geometry.normal, geometry.viewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );

		vec3 diffuse = material.diffuseColor * ( 1.0 - ( singleScattering + multiScattering ) );

		reflectedLight.indirectSpecular += radiance * singleScattering;
		reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;

		reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;

		#ifdef WX_USE_CLEARCOAT
				clearcoatSpecular += clearcoatRadiance * singleScattering;
		#endif

		#ifdef WX_USE_SHEEN
				sheenSpecular += irradiance * material.sheenColor * IBLSheenBRDF( geometry.normal, geometry.viewDir, material.sheenRoughness );
		#endif

	#endif
}

vec3 getIBLRadiance(vec3 viewDir, vec3 normal, float roughness, mat3 envRotationY) {
	float u_specularEnvIntensity = 1.0;

    vec3 reflectVec = reflect( - viewDir, normal );

    // Mixing the reflection with the normal is more accurate and keeps rough objects from gathering light from behind their tangent plane.
    reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );

    reflectVec = inverseTransformDirection( reflectVec, u_view );

	reflectVec = reflectVec * envRotationY;

    #ifdef WX_USE_SPECULAR_MIPMAPS
        float mipCount = 7.0;

        float mip = clamp(roughness * mipCount * 1.5, 0.0, mipCount);
        float mipF = fract( mip );
		    float mipInt = floor( mip );
        float mipBig = clamp(mipInt + 1.0, 0.0, mipCount);

				#ifdef WX_USE_MAT_ENV
					vec4 specularEnvMapInt = textureEnvMapIncludeMipmapsLod(u_specularEnvMapMat, reflectVec, mipInt);
					vec4 specularEnvMapBig = textureEnvMapIncludeMipmapsLod(u_specularEnvMapMat, reflectVec, mipBig);
				#else
					vec4 specularEnvMapInt = textureEnvMapIncludeMipmapsLod(u_specularEnvMap, reflectVec, mipInt);
					vec4 specularEnvMapBig = textureEnvMapIncludeMipmapsLod(u_specularEnvMap, reflectVec, mipBig);
				#endif

        vec4 specularEnvMap = mix(specularEnvMapInt, specularEnvMapBig, mipF);

    #else
				#ifdef WX_USE_MAT_ENV
					vec4 specularEnvMap = textureBilinearEnvMap(u_specularEnvMapMat, reflectVec, roughness);
				#else
					vec4 specularEnvMap = textureBilinearEnvMap(u_specularEnvMap, reflectVec, roughness);
				#endif
    #endif

    #ifdef WX_USE_SPECULAR_RGBD
        vec3 specularLight = decodeRGBD(specularEnvMap);
    #else
        vec3 specularLight = specularEnvMap.rgb;
        specularLight = removeGammaCorrection(specularLight);
    #endif

    return specularLight * u_specularEnvIntensity;
}

#ifdef WX_RECEIVE_SHADOW
	float unpackDepth(const in vec4 rgbaDepth)
	{
		vec4 bitShift = vec4(1.0 / (256.0 * 256.0 * 256.0), 1.0 / (256.0 * 256.0), 1.0 / 256.0, 1.0);
		float depth = dot(rgbaDepth, bitShift);
		return depth;
	}

	float shadowCalculation(vec3 posWorld) {
		float srcShadow = 1.0;

		vec4 shadowCoord = u_csmLightSpaceMatrices[0] * vec4(posWorld, 1.0);
		shadowCoord.xyz = shadowCoord.xyz / shadowCoord.w;
		shadowCoord = shadowCoord * 0.5 + 0.5;
		shadowCoord.z = shadowCoord.z + step(shadowCoord.x, 0.001) + step(shadowCoord.y, 0.001) + step(0.999, shadowCoord.x) + step(0.999, shadowCoord.y);
		shadowCoord.xy = shadowCoord.xy * u_shadowTilingOffsets[0].xy + u_shadowTilingOffsets[0].zw;

		if (shadowCoord.z > 1.0)
		{
			shadowCoord.z = 1.0;
		}

		float currentDepth = shadowCoord.z;

		float bias = u_shadowBias;
		float zRef = currentDepth - bias;

		float sourceVal = float(zRef < unpackDepth(texture2D(u_shadowMap, shadowCoord.xy)));
		srcShadow = sourceVal;

		return srcShadow;
		
		// return unpackDepth(texture2D(u_shadowMap, shadowCoord.xy));
	}
#endif
`
