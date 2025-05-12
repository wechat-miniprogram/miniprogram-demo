export function registerGLTFLoader(THREE) {
  THREE.GLTFLoader = (function () {
    function GLTFLoader() {
      this.manager = THREE.DefaultLoadingManager
      this.dracoLoader = null
      this.ddsLoader = null
    }
    GLTFLoader.prototype = {
      constructor: GLTFLoader,
      crossOrigin: 'anonymous',
      load(url, onLoad) {
        const scope = this
        let resourcePath
        if (this.resourcePath !== undefined) {
          resourcePath = this.resourcePath
        } else if (this.path !== undefined) {
          resourcePath = this.path
        } else {
          resourcePath = THREE.LoaderUtils.extractUrlBase(url)
        }
        scope.manager.itemStart(url)
        const _onError = function (e) {
          console.error(e)
          scope.manager.itemError(url)
          scope.manager.itemEnd(url)
        }
        const loader = new THREE.FileLoader(scope.manager)
        loader.setPath(this.path)
        loader.setResponseType('arraybuffer')
        loader.load(
          url,
          function (data) {
            try {
              scope.parse(
                data,
                resourcePath,
                function (gltf) {
                  onLoad(gltf)
                  scope.manager.itemEnd(url)
                },
                _onError
              )
            } catch (e) {
              _onError(e)
            }
          },
          null,
          _onError
        )
      },
      parse(data, path, onLoad, onError) {
        let content
        const extensions = {}
        if (typeof data === 'string') {
          content = data
        } else {
          const magic = THREE.LoaderUtils.decodeText(new Uint8Array(data, 0, 4))
          if (magic === BINARY_EXTENSION_HEADER_MAGIC) {
            try {
              extensions[EXTENSIONS.KHR_BINARY_GLTF] = new GLTFBinaryExtension(data)
            } catch (error) {
              if (onError) onError(error)
              return
            }
            content = extensions[EXTENSIONS.KHR_BINARY_GLTF].content
          } else {
            content = THREE.LoaderUtils.decodeText(new Uint8Array(data))
          }
        }
        const json = JSON.parse(content)
        if (json.asset === undefined || json.asset.version[0] < 2) {
          if (onError) onError(new Error('THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported. Use LegacyGLTFLoader instead.'))
          return
        }
        if (json.extensionsUsed) {
          for (let i = 0; i < json.extensionsUsed.length; ++i) {
            const extensionName = json.extensionsUsed[i]
            const extensionsRequired = json.extensionsRequired || []
            switch (extensionName) {
              case EXTENSIONS.KHR_LIGHTS_PUNCTUAL:
                extensions[extensionName] = new GLTFLightsExtension(json)
                break
              case EXTENSIONS.KHR_MATERIALS_UNLIT:
                extensions[extensionName] = new GLTFMaterialsUnlitExtension()
                break
              case EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS:
                extensions[extensionName] = new GLTFMaterialsPbrSpecularGlossinessExtension()
                break
              case EXTENSIONS.KHR_DRACO_MESH_COMPRESSION:
                extensions[extensionName] = new GLTFDracoMeshCompressionExtension(json, this.dracoLoader)
                break
              case EXTENSIONS.MSFT_TEXTURE_DDS:
                extensions[EXTENSIONS.MSFT_TEXTURE_DDS] = new GLTFTextureDDSExtension(this.ddsLoader)
                break
              case EXTENSIONS.KHR_TEXTURE_TRANSFORM:
                extensions[EXTENSIONS.KHR_TEXTURE_TRANSFORM] = new GLTFTextureTransformExtension()
                break
              default:
                if (extensionsRequired.indexOf(extensionName) >= 0) {
                  console.warn('THREE.GLTFLoader: Unknown extension "' + extensionName + '".')
                }
            }
          }
        }
        const parser = new GLTFParser(json, extensions, {
          path: path || this.resourcePath || '',
          crossOrigin: this.crossOrigin,
          manager: this.manager
        })
        parser.parse(onLoad, onError)
      }
    }
    function GLTFRegistry() {
      let objects = {}
      return {
        get(key) {
          return objects[key]
        },
        add(key, object) {
          objects[key] = object
        },
        remove(key) {
          delete objects[key]
        },
        removeAll() {
          objects = {}
        }
      }
    }
    var EXTENSIONS = {
      KHR_BINARY_GLTF: 'KHR_binary_glTF',
      KHR_DRACO_MESH_COMPRESSION: 'KHR_draco_mesh_compression',
      KHR_LIGHTS_PUNCTUAL: 'KHR_lights_punctual',
      KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS: 'KHR_materials_pbrSpecularGlossiness',
      KHR_MATERIALS_UNLIT: 'KHR_materials_unlit',
      KHR_TEXTURE_TRANSFORM: 'KHR_texture_transform',
      MSFT_TEXTURE_DDS: 'MSFT_texture_dds'
    }
    function GLTFTextureDDSExtension(ddsLoader) {
      if (!ddsLoader) {
        throw new Error('THREE.GLTFLoader: Attempting to load .dds texture without importing THREE.DDSLoader')
      }
      this.name = EXTENSIONS.MSFT_TEXTURE_DDS
      this.ddsLoader = ddsLoader
    }
    function GLTFLightsExtension(json) {
      this.name = EXTENSIONS.KHR_LIGHTS_PUNCTUAL
      const extension = (json.extensions && json.extensions[EXTENSIONS.KHR_LIGHTS_PUNCTUAL]) || {}
      this.lightDefs = extension.lights || []
    }
    GLTFLightsExtension.prototype.loadLight = function (lightIndex) {
      const lightDef = this.lightDefs[lightIndex]
      let lightNode
      const color = new THREE.Color(0xffffff)
      if (lightDef.color !== undefined) color.fromArray(lightDef.color)
      const range = lightDef.range !== undefined ? lightDef.range : 0
      switch (lightDef.type) {
        case 'directional':
          lightNode = new THREE.DirectionalLight(color)
          lightNode.target.position.set(0, 0, -1)
          lightNode.add(lightNode.target)
          break
        case 'point':
          lightNode = new THREE.PointLight(color)
          lightNode.distance = range
          break
        case 'spot':
          lightNode = new THREE.SpotLight(color)
          lightNode.distance = range
          lightDef.spot = lightDef.spot || {}
          lightDef.spot.innerConeAngle = lightDef.spot.innerConeAngle !== undefined ? lightDef.spot.innerConeAngle : 0
          lightDef.spot.outerConeAngle = lightDef.spot.outerConeAngle !== undefined ? lightDef.spot.outerConeAngle : Math.PI / 4.0
          lightNode.angle = lightDef.spot.outerConeAngle
          lightNode.penumbra = 1.0 - lightDef.spot.innerConeAngle / lightDef.spot.outerConeAngle
          lightNode.target.position.set(0, 0, -1)
          lightNode.add(lightNode.target)
          break
        default:
          throw new Error('THREE.GLTFLoader: Unexpected light type, "' + lightDef.type + '".')
      }
      lightNode.position.set(0, 0, 0)
      lightNode.decay = 2
      if (lightDef.intensity !== undefined) lightNode.intensity = lightDef.intensity
      lightNode.name = lightDef.name || ('light_' + lightIndex)
      return Promise.resolve(lightNode)
    }
    function GLTFMaterialsUnlitExtension() {
      this.name = EXTENSIONS.KHR_MATERIALS_UNLIT
    }
    GLTFMaterialsUnlitExtension.prototype.getMaterialType = function () {
      return THREE.MeshBasicMaterial
    }
    GLTFMaterialsUnlitExtension.prototype.extendParams = function (materialParams, materialDef, parser) {
      const pending = []
      materialParams.color = new THREE.Color(1.0, 1.0, 1.0)
      materialParams.opacity = 1.0
      const metallicRoughness = materialDef.pbrMetallicRoughness
      if (metallicRoughness) {
        if (Array.isArray(metallicRoughness.baseColorFactor)) {
          const array = metallicRoughness.baseColorFactor
          materialParams.color.fromArray(array)
          materialParams.opacity = array[3]
        }
        if (metallicRoughness.baseColorTexture !== undefined) {
          pending.push(parser.assignTexture(materialParams, 'map', metallicRoughness.baseColorTexture))
        }
      }
      return Promise.all(pending)
    }
    var BINARY_EXTENSION_HEADER_MAGIC = 'glTF'
    const BINARY_EXTENSION_HEADER_LENGTH = 12
    const BINARY_EXTENSION_CHUNK_TYPES = {
      JSON: 0x4E4F534A,
      BIN: 0x004E4942
    }
    function GLTFBinaryExtension(data) {
      this.name = EXTENSIONS.KHR_BINARY_GLTF
      this.content = null
      this.body = null
      const headerView = new DataView(data, 0, BINARY_EXTENSION_HEADER_LENGTH)
      this.header = {
        magic: THREE.LoaderUtils.decodeText(new Uint8Array(data.slice(0, 4))),
        version: headerView.getUint32(4, true),
        length: headerView.getUint32(8, true)
      }
      if (this.header.magic !== BINARY_EXTENSION_HEADER_MAGIC) {
        throw new Error('THREE.GLTFLoader: Unsupported glTF-Binary header.')
      } else if (this.header.version < 2.0) {
        throw new Error('THREE.GLTFLoader: Legacy binary file detected. Use LegacyGLTFLoader instead.')
      }
      const chunkView = new DataView(data, BINARY_EXTENSION_HEADER_LENGTH)
      let chunkIndex = 0
      while (chunkIndex < chunkView.byteLength) {
        const chunkLength = chunkView.getUint32(chunkIndex, true)
        chunkIndex += 4
        const chunkType = chunkView.getUint32(chunkIndex, true)
        chunkIndex += 4
        if (chunkType === BINARY_EXTENSION_CHUNK_TYPES.JSON) {
          const contentArray = new Uint8Array(data, BINARY_EXTENSION_HEADER_LENGTH + chunkIndex, chunkLength)
          this.content = THREE.LoaderUtils.decodeText(contentArray)
        } else if (chunkType === BINARY_EXTENSION_CHUNK_TYPES.BIN) {
          const byteOffset = BINARY_EXTENSION_HEADER_LENGTH + chunkIndex
          this.body = data.slice(byteOffset, byteOffset + chunkLength)
        }
        chunkIndex += chunkLength
      }
      if (this.content === null) {
        throw new Error('THREE.GLTFLoader: JSON content not found.')
      }
    }
    function GLTFDracoMeshCompressionExtension(json, dracoLoader) {
      if (!dracoLoader) {
        throw new Error('THREE.GLTFLoader: No DRACOLoader instance provided.')
      }
      this.name = EXTENSIONS.KHR_DRACO_MESH_COMPRESSION
      this.json = json
      this.dracoLoader = dracoLoader
    }
    GLTFDracoMeshCompressionExtension.prototype.decodePrimitive = function (primitive, parser) {
      const json = this.json
      const dracoLoader = this.dracoLoader
      const bufferViewIndex = primitive.extensions[this.name].bufferView
      const gltfAttributeMap = primitive.extensions[this.name].attributes
      const threeAttributeMap = {}
      const attributeNormalizedMap = {}
      const attributeTypeMap = {}
      for (var attributeName in gltfAttributeMap) {
        var threeAttributeName = ATTRIBUTES[attributeName] || attributeName.toLowerCase()
        threeAttributeMap[threeAttributeName] = gltfAttributeMap[attributeName]
      }
      for (attributeName in primitive.attributes) {
        var threeAttributeName = ATTRIBUTES[attributeName] || attributeName.toLowerCase()
        if (gltfAttributeMap[attributeName] !== undefined) {
          const accessorDef = json.accessors[primitive.attributes[attributeName]]
          const componentType = WEBGL_COMPONENT_TYPES[accessorDef.componentType]
          attributeTypeMap[threeAttributeName] = componentType
          attributeNormalizedMap[threeAttributeName] = accessorDef.normalized === true
        }
      }
      return parser.getDependency('bufferView', bufferViewIndex).then(function (bufferView) {
        return new Promise(function (resolve) {
          dracoLoader.decodeDracoFile(
            bufferView,
            function (geometry) {
              for (const attributeName in geometry.attributes) {
                const attribute = geometry.attributes[attributeName]
                const normalized = attributeNormalizedMap[attributeName]
                if (normalized !== undefined) attribute.normalized = normalized
              }
              resolve(geometry)
            },
            threeAttributeMap,
            attributeTypeMap
          )
        })
      })
    }
    function GLTFTextureTransformExtension() {
      this.name = EXTENSIONS.KHR_TEXTURE_TRANSFORM
    }
    GLTFTextureTransformExtension.prototype.extendTexture = function (texture, transform) {
      texture = texture.clone()
      if (transform.offset !== undefined) {
        texture.offset.fromArray(transform.offset)
      }
      if (transform.rotation !== undefined) {
        texture.rotation = transform.rotation
      }
      if (transform.scale !== undefined) {
        texture.repeat.fromArray(transform.scale)
      }
      if (transform.texCoord !== undefined) {
        console.warn('THREE.GLTFLoader: Custom UV sets in "' + this.name + '" extension not yet supported.')
      }
      texture.needsUpdate = true
      return texture
    }
    function GLTFMaterialsPbrSpecularGlossinessExtension() {
      return {
        name: EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS,
        specularGlossinessParams: ['color', 'map', 'lightMap', 'lightMapIntensity', 'aoMap', 'aoMapIntensity', 'emissive', 'emissiveIntensity', 'emissiveMap', 'bumpMap', 'bumpScale', 'normalMap', 'displacementMap', 'displacementScale', 'displacementBias', 'specularMap', 'specular', 'glossinessMap', 'glossiness', 'alphaMap', 'envMap', 'envMapIntensity', 'refractionRatio'],
        getMaterialType() {
          return THREE.ShaderMaterial
        },
        extendParams(materialParams, materialDef, parser) {
          const pbrSpecularGlossiness = materialDef.extensions[this.name]
          const shader = THREE.ShaderLib.standard
          const uniforms = THREE.UniformsUtils.clone(shader.uniforms)
          const specularMapParsFragmentChunk = ['#ifdef USE_SPECULARMAP', '	uniform sampler2D specularMap;', '#endif'].join('\n')
          const glossinessMapParsFragmentChunk = ['#ifdef USE_GLOSSINESSMAP', '	uniform sampler2D glossinessMap;', '#endif'].join('\n')
          const specularMapFragmentChunk = ['vec3 specularFactor = specular;', '#ifdef USE_SPECULARMAP', '	vec4 texelSpecular = texture2D( specularMap, vUv );', '	texelSpecular = sRGBToLinear( texelSpecular );', '	// reads channel RGB, compatible with a glTF Specular-Glossiness (RGBA) texture', '	specularFactor *= texelSpecular.rgb;', '#endif'].join('\n')
          const glossinessMapFragmentChunk = ['float glossinessFactor = glossiness;', '#ifdef USE_GLOSSINESSMAP', '	vec4 texelGlossiness = texture2D( glossinessMap, vUv );', '	// reads channel A, compatible with a glTF Specular-Glossiness (RGBA) texture', '	glossinessFactor *= texelGlossiness.a;', '#endif'].join('\n')
          const lightPhysicalFragmentChunk = ['PhysicalMaterial material;', 'material.diffuseColor = diffuseColor.rgb;', 'material.specularRoughness = clamp( 1.0 - glossinessFactor, 0.04, 1.0 );', 'material.specularColor = specularFactor.rgb;'].join('\n')
          const fragmentShader = shader.fragmentShader.replace('uniform float roughness;', 'uniform vec3 specular;').replace('uniform float metalness;', 'uniform float glossiness;').replace('#include <roughnessmap_pars_fragment>', specularMapParsFragmentChunk).replace('#include <metalnessmap_pars_fragment>', glossinessMapParsFragmentChunk)
            .replace('#include <roughnessmap_fragment>', specularMapFragmentChunk)
            .replace('#include <metalnessmap_fragment>', glossinessMapFragmentChunk)
            .replace('#include <lights_physical_fragment>', lightPhysicalFragmentChunk)
          delete uniforms.roughness
          delete uniforms.metalness
          delete uniforms.roughnessMap
          delete uniforms.metalnessMap
          uniforms.specular = {
            value: new THREE.Color().setHex(0x111111)
          }
          uniforms.glossiness = {
            value: 0.5
          }
          uniforms.specularMap = {
            value: null
          }
          uniforms.glossinessMap = {
            value: null
          }
          materialParams.vertexShader = shader.vertexShader
          materialParams.fragmentShader = fragmentShader
          materialParams.uniforms = uniforms
          materialParams.defines = {
            STANDARD: ''
          }
          materialParams.color = new THREE.Color(1.0, 1.0, 1.0)
          materialParams.opacity = 1.0
          const pending = []
          if (Array.isArray(pbrSpecularGlossiness.diffuseFactor)) {
            const array = pbrSpecularGlossiness.diffuseFactor
            materialParams.color.fromArray(array)
            materialParams.opacity = array[3]
          }
          if (pbrSpecularGlossiness.diffuseTexture !== undefined) {
            pending.push(parser.assignTexture(materialParams, 'map', pbrSpecularGlossiness.diffuseTexture))
          }
          materialParams.emissive = new THREE.Color(0.0, 0.0, 0.0)
          materialParams.glossiness = pbrSpecularGlossiness.glossinessFactor !== undefined ? pbrSpecularGlossiness.glossinessFactor : 1.0
          materialParams.specular = new THREE.Color(1.0, 1.0, 1.0)
          if (Array.isArray(pbrSpecularGlossiness.specularFactor)) {
            materialParams.specular.fromArray(pbrSpecularGlossiness.specularFactor)
          }
          if (pbrSpecularGlossiness.specularGlossinessTexture !== undefined) {
            const specGlossMapDef = pbrSpecularGlossiness.specularGlossinessTexture
            pending.push(parser.assignTexture(materialParams, 'glossinessMap', specGlossMapDef))
            pending.push(parser.assignTexture(materialParams, 'specularMap', specGlossMapDef))
          }
          return Promise.all(pending)
        },
        createMaterial(params) {
          const material = new THREE.ShaderMaterial({
            defines: params.defines,
            vertexShader: params.vertexShader,
            fragmentShader: params.fragmentShader,
            uniforms: params.uniforms,
            fog: true,
            lights: true,
            opacity: params.opacity,
            transparent: params.transparent
          })
          material.isGLTFSpecularGlossinessMaterial = true
          material.color = params.color
          material.map = params.map === undefined ? null : params.map
          material.lightMap = null
          material.lightMapIntensity = 1.0
          material.aoMap = params.aoMap === undefined ? null : params.aoMap
          material.aoMapIntensity = 1.0
          material.emissive = params.emissive
          material.emissiveIntensity = 1.0
          material.emissiveMap = params.emissiveMap === undefined ? null : params.emissiveMap
          material.bumpMap = params.bumpMap === undefined ? null : params.bumpMap
          material.bumpScale = 1
          material.normalMap = params.normalMap === undefined ? null : params.normalMap
          if (params.normalScale) material.normalScale = params.normalScale
          material.displacementMap = null
          material.displacementScale = 1
          material.displacementBias = 0
          material.specularMap = params.specularMap === undefined ? null : params.specularMap
          material.specular = params.specular
          material.glossinessMap = params.glossinessMap === undefined ? null : params.glossinessMap
          material.glossiness = params.glossiness
          material.alphaMap = null
          material.envMap = params.envMap === undefined ? null : params.envMap
          material.envMapIntensity = 1.0
          material.refractionRatio = 0.98
          material.extensions.derivatives = true
          return material
        },
        cloneMaterial(source) {
          const target = source.clone()
          target.isGLTFSpecularGlossinessMaterial = true
          const params = this.specularGlossinessParams
          for (let i = 0,
            il = params.length; i < il; i++) {
            const value = source[params[i]]
            target[params[i]] = (value && value.isColor) ? value.clone() : value
          }
          return target
        },
        refreshUniforms(renderer, scene, camera, geometry, material) {
          if (material.isGLTFSpecularGlossinessMaterial !== true) {
            return
          }
          const uniforms = material.uniforms
          const defines = material.defines
          uniforms.opacity.value = material.opacity
          uniforms.diffuse.value.copy(material.color)
          uniforms.emissive.value.copy(material.emissive).multiplyScalar(material.emissiveIntensity)
          uniforms.map.value = material.map
          uniforms.specularMap.value = material.specularMap
          uniforms.alphaMap.value = material.alphaMap
          uniforms.lightMap.value = material.lightMap
          uniforms.lightMapIntensity.value = material.lightMapIntensity
          uniforms.aoMap.value = material.aoMap
          uniforms.aoMapIntensity.value = material.aoMapIntensity
          let uvScaleMap
          if (material.map) {
            uvScaleMap = material.map
          } else if (material.specularMap) {
            uvScaleMap = material.specularMap
          } else if (material.displacementMap) {
            uvScaleMap = material.displacementMap
          } else if (material.normalMap) {
            uvScaleMap = material.normalMap
          } else if (material.bumpMap) {
            uvScaleMap = material.bumpMap
          } else if (material.glossinessMap) {
            uvScaleMap = material.glossinessMap
          } else if (material.alphaMap) {
            uvScaleMap = material.alphaMap
          } else if (material.emissiveMap) {
            uvScaleMap = material.emissiveMap
          }
          if (uvScaleMap !== undefined) {
            if (uvScaleMap.isWebGLRenderTarget) {
              uvScaleMap = uvScaleMap.texture
            }
            if (uvScaleMap.matrixAutoUpdate === true) {
              uvScaleMap.updateMatrix()
            }
            uniforms.uvTransform.value.copy(uvScaleMap.matrix)
          }
          if (material.envMap) {
            uniforms.envMap.value = material.envMap
            uniforms.envMapIntensity.value = material.envMapIntensity
            uniforms.flipEnvMap.value = material.envMap.isCubeTexture ? -1 : 1
            uniforms.reflectivity.value = material.reflectivity
            uniforms.refractionRatio.value = material.refractionRatio
            uniforms.maxMipLevel.value = renderer.properties.get(material.envMap).__maxMipLevel
          }
          uniforms.specular.value.copy(material.specular)
          uniforms.glossiness.value = material.glossiness
          uniforms.glossinessMap.value = material.glossinessMap
          uniforms.emissiveMap.value = material.emissiveMap
          uniforms.bumpMap.value = material.bumpMap
          uniforms.normalMap.value = material.normalMap
          uniforms.displacementMap.value = material.displacementMap
          uniforms.displacementScale.value = material.displacementScale
          uniforms.displacementBias.value = material.displacementBias
          if (uniforms.glossinessMap.value !== null && defines.USE_GLOSSINESSMAP === undefined) {
            defines.USE_GLOSSINESSMAP = ''
            defines.USE_ROUGHNESSMAP = ''
          }
          if (uniforms.glossinessMap.value === null && defines.USE_GLOSSINESSMAP !== undefined) {
            delete defines.USE_GLOSSINESSMAP
            delete defines.USE_ROUGHNESSMAP
          }
        }
      }
    }
    function GLTFCubicSplineInterpolant(parameterPositions, sampleValues, sampleSize, resultBuffer) {
      THREE.Interpolant.call(this, parameterPositions, sampleValues, sampleSize, resultBuffer)
    }
    GLTFCubicSplineInterpolant.prototype = Object.create(THREE.Interpolant.prototype)
    GLTFCubicSplineInterpolant.prototype.constructor = GLTFCubicSplineInterpolant
    GLTFCubicSplineInterpolant.prototype.copySampleValue_ = function (index) {
      const result = this.resultBuffer
      const values = this.sampleValues
      const valueSize = this.valueSize
      const offset = index * valueSize * 3 + valueSize
      for (let i = 0; i !== valueSize; i++) {
        result[i] = values[offset + i]
      }
      return result
    }
    GLTFCubicSplineInterpolant.prototype.beforeStart_ = GLTFCubicSplineInterpolant.prototype.copySampleValue_
    GLTFCubicSplineInterpolant.prototype.afterEnd_ = GLTFCubicSplineInterpolant.prototype.copySampleValue_
    GLTFCubicSplineInterpolant.prototype.interpolate_ = function (i1, t0, t, t1) {
      const result = this.resultBuffer
      const values = this.sampleValues
      const stride = this.valueSize
      const stride2 = stride * 2
      const stride3 = stride * 3
      const td = t1 - t0
      const p = (t - t0) / td
      const pp = p * p
      const ppp = pp * p
      const offset1 = i1 * stride3
      const offset0 = offset1 - stride3
      const s2 = -2 * ppp + 3 * pp
      const s3 = ppp - pp
      const s0 = 1 - s2
      const s1 = s3 - pp + p
      for (let i = 0; i !== stride; i++) {
        const p0 = values[offset0 + i + stride]
        const m0 = values[offset0 + i + stride2] * td
        const p1 = values[offset1 + i + stride]
        const m1 = values[offset1 + i] * td
        result[i] = s0 * p0 + s1 * m0 + s2 * p1 + s3 * m1
      }
      return result
    }
    const WEBGL_CONSTANTS = {
      FLOAT: 5126,
      FLOAT_MAT3: 35675,
      FLOAT_MAT4: 35676,
      FLOAT_VEC2: 35664,
      FLOAT_VEC3: 35665,
      FLOAT_VEC4: 35666,
      LINEAR: 9729,
      REPEAT: 10497,
      SAMPLER_2D: 35678,
      POINTS: 0,
      LINES: 1,
      LINE_LOOP: 2,
      LINE_STRIP: 3,
      TRIANGLES: 4,
      TRIANGLE_STRIP: 5,
      TRIANGLE_FAN: 6,
      UNSIGNED_BYTE: 5121,
      UNSIGNED_SHORT: 5123
    }
    var WEBGL_COMPONENT_TYPES = {
      5120: Int8Array,
      5121: Uint8Array,
      5122: Int16Array,
      5123: Uint16Array,
      5125: Uint32Array,
      5126: Float32Array
    }
    const WEBGL_FILTERS = {
      9728: THREE.NearestFilter,
      9729: THREE.LinearFilter,
      9984: THREE.NearestMipmapNearestFilter,
      9985: THREE.LinearMipmapNearestFilter,
      9986: THREE.NearestMipmapLinearFilter,
      9987: THREE.LinearMipmapLinearFilter
    }
    const WEBGL_WRAPPINGS = {
      33071: THREE.ClampToEdgeWrapping,
      33648: THREE.MirroredRepeatWrapping,
      10497: THREE.RepeatWrapping
    }
    const WEBGL_TYPE_SIZES = {
      SCALAR: 1,
      VEC2: 2,
      VEC3: 3,
      VEC4: 4,
      MAT2: 4,
      MAT3: 9,
      MAT4: 16
    }
    var ATTRIBUTES = {
      POSITION: 'position',
      NORMAL: 'normal',
      TANGENT: 'tangent',
      TEXCOORD_0: 'uv',
      TEXCOORD_1: 'uv2',
      COLOR_0: 'color',
      WEIGHTS_0: 'skinWeight',
      JOINTS_0: 'skinIndex',
    }
    const PATH_PROPERTIES = {
      scale: 'scale',
      translation: 'position',
      rotation: 'quaternion',
      weights: 'morphTargetInfluences'
    }
    const INTERPOLATION = {
      CUBICSPLINE: undefined,
      LINEAR: THREE.InterpolateLinear,
      STEP: THREE.InterpolateDiscrete
    }
    const ALPHA_MODES = {
      OPAQUE: 'OPAQUE',
      MASK: 'MASK',
      BLEND: 'BLEND'
    }
    const MIME_TYPE_FORMATS = {
      'image/png': THREE.RGBAFormat,
      'image/jpeg': THREE.RGBFormat
    }
    function resolveURL(url, path) {
      if (typeof url !== 'string' || url === '') return ''
      if (/^https?:\/\//i.test(path) && /^\//.test(url)) {
        path = path.replace(/(^https?:\/\/[^\/]+).*/i, '$1')
      }
      if (/^(https?:)?\/\//i.test(url)) return url
      if (/^data:.*,.*$/i.test(url)) return url
      if (/^blob:.*$/i.test(url)) return url
      return path + url
    }
    let defaultMaterial
    function createDefaultMaterial() {
      defaultMaterial = defaultMaterial || new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        emissive: 0x000000,
        metalness: 1,
        roughness: 1,
        transparent: false,
        depthTest: true,
        side: THREE.FrontSide
      })
      return defaultMaterial
    }
    function addUnknownExtensionsToUserData(knownExtensions, object, objectDef) {
      for (const name in objectDef.extensions) {
        if (knownExtensions[name] === undefined) {
          object.userData.gltfExtensions = object.userData.gltfExtensions || {}
          object.userData.gltfExtensions[name] = objectDef.extensions[name]
        }
      }
    }
    function assignExtrasToUserData(object, gltfDef) {
      if (gltfDef.extras !== undefined) {
        if (typeof gltfDef.extras === 'object') {
          Object.assign(object.userData, gltfDef.extras)
        } else {
          console.warn('THREE.GLTFLoader: Ignoring primitive type .extras, ' + gltfDef.extras)
        }
      }
    }
    function addMorphTargets(geometry, targets, parser) {
      let hasMorphPosition = false
      let hasMorphNormal = false
      for (var i = 0,
        il = targets.length; i < il; i++) {
        var target = targets[i]
        if (target.POSITION !== undefined) hasMorphPosition = true
        if (target.NORMAL !== undefined) hasMorphNormal = true
        if (hasMorphPosition && hasMorphNormal) break
      }
      if (!hasMorphPosition && !hasMorphNormal) return Promise.resolve(geometry)
      const pendingPositionAccessors = []
      const pendingNormalAccessors = []
      for (var i = 0,
        il = targets.length; i < il; i++) {
        var target = targets[i]
        if (hasMorphPosition) {
          var pendingAccessor = target.POSITION !== undefined ? parser.getDependency('accessor', target.POSITION) : geometry.attributes.position
          pendingPositionAccessors.push(pendingAccessor)
        }
        if (hasMorphNormal) {
          var pendingAccessor = target.NORMAL !== undefined ? parser.getDependency('accessor', target.NORMAL) : geometry.attributes.normal
          pendingNormalAccessors.push(pendingAccessor)
        }
      }
      return Promise.all([Promise.all(pendingPositionAccessors), Promise.all(pendingNormalAccessors)]).then(function (accessors) {
        const morphPositions = accessors[0]
        const morphNormals = accessors[1]
        for (var i = 0,
          il = morphPositions.length; i < il; i++) {
          if (geometry.attributes.position === morphPositions[i]) continue
          morphPositions[i] = cloneBufferAttribute(morphPositions[i])
        }
        for (var i = 0,
          il = morphNormals.length; i < il; i++) {
          if (geometry.attributes.normal === morphNormals[i]) continue
          morphNormals[i] = cloneBufferAttribute(morphNormals[i])
        }
        for (var i = 0,
          il = targets.length; i < il; i++) {
          const target = targets[i]
          const attributeName = 'morphTarget' + i
          if (hasMorphPosition) {
            if (target.POSITION !== undefined) {
              const positionAttribute = morphPositions[i]
              positionAttribute.name = attributeName
              const position = geometry.attributes.position
              for (var j = 0,
                jl = positionAttribute.count; j < jl; j++) {
                positionAttribute.setXYZ(j, positionAttribute.getX(j) + position.getX(j), positionAttribute.getY(j) + position.getY(j), positionAttribute.getZ(j) + position.getZ(j))
              }
            }
          }
          if (hasMorphNormal) {
            if (target.NORMAL !== undefined) {
              const normalAttribute = morphNormals[i]
              normalAttribute.name = attributeName
              const normal = geometry.attributes.normal
              for (var j = 0,
                jl = normalAttribute.count; j < jl; j++) {
                normalAttribute.setXYZ(j, normalAttribute.getX(j) + normal.getX(j), normalAttribute.getY(j) + normal.getY(j), normalAttribute.getZ(j) + normal.getZ(j))
              }
            }
          }
        }
        if (hasMorphPosition) geometry.morphAttributes.position = morphPositions
        if (hasMorphNormal) geometry.morphAttributes.normal = morphNormals
        return geometry
      })
    }
    function updateMorphTargets(mesh, meshDef) {
      mesh.updateMorphTargets()
      if (meshDef.weights !== undefined) {
        for (var i = 0,
          il = meshDef.weights.length; i < il; i++) {
          mesh.morphTargetInfluences[i] = meshDef.weights[i]
        }
      }
      if (meshDef.extras && Array.isArray(meshDef.extras.targetNames)) {
        const targetNames = meshDef.extras.targetNames
        if (mesh.morphTargetInfluences.length === targetNames.length) {
          mesh.morphTargetDictionary = {}
          for (var i = 0,
            il = targetNames.length; i < il; i++) {
            mesh.morphTargetDictionary[targetNames[i]] = i
          }
        } else {
          console.warn('THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.')
        }
      }
    }
    function createPrimitiveKey(primitiveDef) {
      const dracoExtension = primitiveDef.extensions && primitiveDef.extensions[EXTENSIONS.KHR_DRACO_MESH_COMPRESSION]
      let geometryKey
      if (dracoExtension) {
        geometryKey = 'draco:' + dracoExtension.bufferView + ':' + dracoExtension.indices + ':' + createAttributesKey(dracoExtension.attributes)
      } else {
        geometryKey = primitiveDef.indices + ':' + createAttributesKey(primitiveDef.attributes) + ':' + primitiveDef.mode
      }
      return geometryKey
    }
    function createAttributesKey(attributes) {
      let attributesKey = ''
      const keys = Object.keys(attributes).sort()
      for (let i = 0,
        il = keys.length; i < il; i++) {
        attributesKey += keys[i] + ':' + attributes[keys[i]] + ';'
      }
      return attributesKey
    }
    function cloneBufferAttribute(attribute) {
      if (attribute.isInterleavedBufferAttribute) {
        const count = attribute.count
        const itemSize = attribute.itemSize
        const array = attribute.array.slice(0, count * itemSize)
        for (let i = 0,
          j = 0; i < count; ++i) {
          array[j++] = attribute.getX(i)
          if (itemSize >= 2) array[j++] = attribute.getY(i)
          if (itemSize >= 3) array[j++] = attribute.getZ(i)
          if (itemSize >= 4) array[j++] = attribute.getW(i)
        }
        return new THREE.BufferAttribute(array, itemSize, attribute.normalized)
      }
      return attribute.clone()
    }
    function GLTFParser(json, extensions, options) {
      this.json = json || {}
      this.extensions = extensions || {}
      this.options = options || {}
      this.cache = new GLTFRegistry()
      this.primitiveCache = {}
      this.textureLoader = new THREE.TextureLoader(this.options.manager)
      this.textureLoader.setCrossOrigin(this.options.crossOrigin)
      this.fileLoader = new THREE.FileLoader(this.options.manager)
      this.fileLoader.setResponseType('arraybuffer')
    }
    GLTFParser.prototype.parse = function (onLoad, onError) {
      const parser = this
      const json = this.json
      const extensions = this.extensions
      this.cache.removeAll()
      this.markDefs()
      Promise.all([this.getDependencies('scene'), this.getDependencies('animation'), this.getDependencies('camera')]).then(function (dependencies) {
        const result = {
          scene: dependencies[0][json.scene || 0],
          scenes: dependencies[0],
          animations: dependencies[1],
          cameras: dependencies[2],
          asset: json.asset,
          parser,
          userData: {}
        }
        addUnknownExtensionsToUserData(extensions, result, json)
        assignExtrasToUserData(result, json)
        onLoad(result)
      })
        .catch(onError)
    }
    GLTFParser.prototype.markDefs = function () {
      const nodeDefs = this.json.nodes || []
      const skinDefs = this.json.skins || []
      const meshDefs = this.json.meshes || []
      const meshReferences = {}
      const meshUses = {}
      for (let skinIndex = 0,
        skinLength = skinDefs.length; skinIndex < skinLength; skinIndex++) {
        const joints = skinDefs[skinIndex].joints
        for (let i = 0,
          il = joints.length; i < il; i++) {
          nodeDefs[joints[i]].isBone = true
        }
      }
      for (let nodeIndex = 0,
        nodeLength = nodeDefs.length; nodeIndex < nodeLength; nodeIndex++) {
        const nodeDef = nodeDefs[nodeIndex]
        if (nodeDef.mesh !== undefined) {
          if (meshReferences[nodeDef.mesh] === undefined) {
            meshReferences[nodeDef.mesh] = meshUses[nodeDef.mesh] = 0
          }
          meshReferences[nodeDef.mesh]++
          if (nodeDef.skin !== undefined) {
            meshDefs[nodeDef.mesh].isSkinnedMesh = true
          }
        }
      }
      this.json.meshReferences = meshReferences
      this.json.meshUses = meshUses
    }
    GLTFParser.prototype.getDependency = function (type, index) {
      const cacheKey = type + ':' + index
      let dependency = this.cache.get(cacheKey)
      if (!dependency) {
        switch (type) {
          case 'scene':
            dependency = this.loadScene(index)
            break
          case 'node':
            dependency = this.loadNode(index)
            break
          case 'mesh':
            dependency = this.loadMesh(index)
            break
          case 'accessor':
            dependency = this.loadAccessor(index)
            break
          case 'bufferView':
            dependency = this.loadBufferView(index)
            break
          case 'buffer':
            dependency = this.loadBuffer(index)
            break
          case 'material':
            dependency = this.loadMaterial(index)
            break
          case 'texture':
            dependency = this.loadTexture(index)
            break
          case 'skin':
            dependency = this.loadSkin(index)
            break
          case 'animation':
            dependency = this.loadAnimation(index)
            break
          case 'camera':
            dependency = this.loadCamera(index)
            break
          case 'light':
            dependency = this.extensions[EXTENSIONS.KHR_LIGHTS_PUNCTUAL].loadLight(index)
            break
          default:
            throw new Error('Unknown type: ' + type)
        }
        this.cache.add(cacheKey, dependency)
      }
      return dependency
    }
    GLTFParser.prototype.getDependencies = function (type) {
      let dependencies = this.cache.get(type)
      if (!dependencies) {
        const parser = this
        const defs = this.json[type + (type === 'mesh' ? 'es' : 's')] || []
        dependencies = Promise.all(defs.map(function (def, index) {
          return parser.getDependency(type, index)
        }))
        this.cache.add(type, dependencies)
      }
      return dependencies
    }
    GLTFParser.prototype.loadBuffer = function (bufferIndex) {
      const bufferDef = this.json.buffers[bufferIndex]
      const loader = this.fileLoader
      if (bufferDef.type && bufferDef.type !== 'arraybuffer') {
        throw new Error('THREE.GLTFLoader: ' + bufferDef.type + ' buffer type is not supported.')
      }
      if (bufferDef.uri === undefined && bufferIndex === 0) {
        return Promise.resolve(this.extensions[EXTENSIONS.KHR_BINARY_GLTF].body)
      }
      const options = this.options
      return new Promise(function (resolve, reject) {
        loader.load(
          resolveURL(bufferDef.uri, options.path),
          resolve,
          undefined,
          function () {
            reject(new Error('THREE.GLTFLoader: Failed to load buffer "' + bufferDef.uri + '".'))
          }
        )
      })
    }
    GLTFParser.prototype.loadBufferView = function (bufferViewIndex) {
      const bufferViewDef = this.json.bufferViews[bufferViewIndex]
      return this.getDependency('buffer', bufferViewDef.buffer).then(function (buffer) {
        const byteLength = bufferViewDef.byteLength || 0
        const byteOffset = bufferViewDef.byteOffset || 0
        return buffer.slice(byteOffset, byteOffset + byteLength)
      })
    }
    GLTFParser.prototype.loadAccessor = function (accessorIndex) {
      const parser = this
      const json = this.json
      const accessorDef = this.json.accessors[accessorIndex]
      if (accessorDef.bufferView === undefined && accessorDef.sparse === undefined) {
        return Promise.resolve(null)
      }
      const pendingBufferViews = []
      if (accessorDef.bufferView !== undefined) {
        pendingBufferViews.push(this.getDependency('bufferView', accessorDef.bufferView))
      } else {
        pendingBufferViews.push(null)
      }
      if (accessorDef.sparse !== undefined) {
        pendingBufferViews.push(this.getDependency('bufferView', accessorDef.sparse.indices.bufferView))
        pendingBufferViews.push(this.getDependency('bufferView', accessorDef.sparse.values.bufferView))
      }
      return Promise.all(pendingBufferViews).then(function (bufferViews) {
        const bufferView = bufferViews[0]
        const itemSize = WEBGL_TYPE_SIZES[accessorDef.type]
        const TypedArray = WEBGL_COMPONENT_TYPES[accessorDef.componentType]
        const elementBytes = TypedArray.BYTES_PER_ELEMENT
        const itemBytes = elementBytes * itemSize
        const byteOffset = accessorDef.byteOffset || 0
        const byteStride = accessorDef.bufferView !== undefined ? json.bufferViews[accessorDef.bufferView].byteStride : undefined
        const normalized = accessorDef.normalized === true
        let array; let
          bufferAttribute
        if (byteStride && byteStride !== itemBytes) {
          const ibSlice = Math.floor(byteOffset / byteStride)
          const ibCacheKey = 'InterleavedBuffer:' + accessorDef.bufferView + ':' + accessorDef.componentType + ':' + ibSlice + ':' + accessorDef.count
          let ib = parser.cache.get(ibCacheKey)
          if (!ib) {
            array = new TypedArray(bufferView, ibSlice * byteStride, accessorDef.count * byteStride / elementBytes)
            ib = new THREE.InterleavedBuffer(array, byteStride / elementBytes)
            parser.cache.add(ibCacheKey, ib)
          }
          bufferAttribute = new THREE.InterleavedBufferAttribute(ib, itemSize, (byteOffset % byteStride) / elementBytes, normalized)
        } else {
          if (bufferView === null) {
            array = new TypedArray(accessorDef.count * itemSize)
          } else {
            array = new TypedArray(bufferView, byteOffset, accessorDef.count * itemSize)
          }
          bufferAttribute = new THREE.BufferAttribute(array, itemSize, normalized)
        }
        if (accessorDef.sparse !== undefined) {
          const itemSizeIndices = WEBGL_TYPE_SIZES.SCALAR
          const TypedArrayIndices = WEBGL_COMPONENT_TYPES[accessorDef.sparse.indices.componentType]
          const byteOffsetIndices = accessorDef.sparse.indices.byteOffset || 0
          const byteOffsetValues = accessorDef.sparse.values.byteOffset || 0
          const sparseIndices = new TypedArrayIndices(bufferViews[1], byteOffsetIndices, accessorDef.sparse.count * itemSizeIndices)
          const sparseValues = new TypedArray(bufferViews[2], byteOffsetValues, accessorDef.sparse.count * itemSize)
          if (bufferView !== null) {
            bufferAttribute.setArray(bufferAttribute.array.slice())
          }
          for (let i = 0,
            il = sparseIndices.length; i < il; i++) {
            const index = sparseIndices[i]
            bufferAttribute.setX(index, sparseValues[i * itemSize])
            if (itemSize >= 2) bufferAttribute.setY(index, sparseValues[i * itemSize + 1])
            if (itemSize >= 3) bufferAttribute.setZ(index, sparseValues[i * itemSize + 2])
            if (itemSize >= 4) bufferAttribute.setW(index, sparseValues[i * itemSize + 3])
            if (itemSize >= 5) throw new Error('THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.')
          }
        }
        return bufferAttribute
      })
    }
    GLTFParser.prototype.loadTexture = function (textureIndex) {
      const parser = this
      const json = this.json
      const options = this.options
      const textureLoader = this.textureLoader
      // var URL = global.URL;
      const textureDef = json.textures[textureIndex]
      const textureExtensions = textureDef.extensions || {}
      let source
      if (textureExtensions[EXTENSIONS.MSFT_TEXTURE_DDS]) {
        source = json.images[textureExtensions[EXTENSIONS.MSFT_TEXTURE_DDS].source]
      } else {
        source = json.images[textureDef.source]
      }
      let sourceURI = source.uri
      let isObjectURL = false
      if (source.bufferView !== undefined) {
        sourceURI = parser.getDependency('bufferView', source.bufferView).then(function (bufferView) {
          isObjectURL = true
          // 微信小程序不支持 Blob 对象，则使用 base64 编码的字符串来创建 data URI
          const base64Str = wx.arrayBufferToBase64(bufferView)
          sourceURI = `data:${source.mimeType};base64,${base64Str}`
          return sourceURI
        })
      }
      return Promise.resolve(sourceURI).then(function (sourceURI) {
        let loader = THREE.Loader.Handlers.get(sourceURI)
        if (!loader) {
          loader = textureExtensions[EXTENSIONS.MSFT_TEXTURE_DDS] ? parser.extensions[EXTENSIONS.MSFT_TEXTURE_DDS].ddsLoader : textureLoader
        }
        return new Promise(function (resolve, reject) {
          loader.load(resolveURL(sourceURI, options.path), resolve, undefined, reject)
        })
      }).then(function (texture) {
        if (isObjectURL === true) {
          // URL.revokeObjectURL(sourceURI)
        }
        texture.flipY = false
        if (textureDef.name !== undefined) texture.name = textureDef.name
        if (source.mimeType in MIME_TYPE_FORMATS) {
          texture.format = MIME_TYPE_FORMATS[source.mimeType]
        }
        const samplers = json.samplers || {}
        const sampler = samplers[textureDef.sampler] || {}
        texture.magFilter = WEBGL_FILTERS[sampler.magFilter] || THREE.LinearFilter
        texture.minFilter = WEBGL_FILTERS[sampler.minFilter] || THREE.LinearMipmapLinearFilter
        texture.wrapS = WEBGL_WRAPPINGS[sampler.wrapS] || THREE.RepeatWrapping
        texture.wrapT = WEBGL_WRAPPINGS[sampler.wrapT] || THREE.RepeatWrapping
        return texture
      })
    }
    GLTFParser.prototype.assignTexture = function (materialParams, mapName, mapDef) {
      const parser = this
      return this.getDependency('texture', mapDef.index).then(function (texture) {
        if (!texture.isCompressedTexture) {
          switch (mapName) {
            case 'aoMap':
            case 'emissiveMap':
            case 'metalnessMap':
            case 'normalMap':
            case 'roughnessMap':
              texture.format = THREE.RGBFormat
              break
          }
        }
        if (parser.extensions[EXTENSIONS.KHR_TEXTURE_TRANSFORM]) {
          const transform = mapDef.extensions !== undefined ? mapDef.extensions[EXTENSIONS.KHR_TEXTURE_TRANSFORM] : undefined
          if (transform) {
            texture = parser.extensions[EXTENSIONS.KHR_TEXTURE_TRANSFORM].extendTexture(texture, transform)
          }
        }
        materialParams[mapName] = texture
      })
    }
    GLTFParser.prototype.assignFinalMaterial = function (mesh) {
      const geometry = mesh.geometry
      let material = mesh.material
      const extensions = this.extensions
      const useVertexTangents = geometry.attributes.tangent !== undefined
      const useVertexColors = geometry.attributes.color !== undefined
      const useFlatShading = geometry.attributes.normal === undefined
      const useSkinning = mesh.isSkinnedMesh === true
      const useMorphTargets = Object.keys(geometry.morphAttributes).length > 0
      const useMorphNormals = useMorphTargets && geometry.morphAttributes.normal !== undefined
      if (mesh.isPoints) {
        var cacheKey = 'PointsMaterial:' + material.uuid
        let pointsMaterial = this.cache.get(cacheKey)
        if (!pointsMaterial) {
          pointsMaterial = new THREE.PointsMaterial()
          THREE.Material.prototype.copy.call(pointsMaterial, material)
          pointsMaterial.color.copy(material.color)
          pointsMaterial.map = material.map
          pointsMaterial.lights = false
          pointsMaterial.sizeAttenuation = false
          this.cache.add(cacheKey, pointsMaterial)
        }
        material = pointsMaterial
      } else if (mesh.isLine) {
        var cacheKey = 'LineBasicMaterial:' + material.uuid
        let lineMaterial = this.cache.get(cacheKey)
        if (!lineMaterial) {
          lineMaterial = new THREE.LineBasicMaterial()
          THREE.Material.prototype.copy.call(lineMaterial, material)
          lineMaterial.color.copy(material.color)
          lineMaterial.lights = false
          this.cache.add(cacheKey, lineMaterial)
        }
        material = lineMaterial
      }
      if (useVertexTangents || useVertexColors || useFlatShading || useSkinning || useMorphTargets) {
        var cacheKey = 'ClonedMaterial:' + material.uuid + ':'
        if (material.isGLTFSpecularGlossinessMaterial) cacheKey += 'specular-glossiness:'
        if (useSkinning) cacheKey += 'skinning:'
        if (useVertexTangents) cacheKey += 'vertex-tangents:'
        if (useVertexColors) cacheKey += 'vertex-colors:'
        if (useFlatShading) cacheKey += 'flat-shading:'
        if (useMorphTargets) cacheKey += 'morph-targets:'
        if (useMorphNormals) cacheKey += 'morph-normals:'
        let cachedMaterial = this.cache.get(cacheKey)
        if (!cachedMaterial) {
          cachedMaterial = material.isGLTFSpecularGlossinessMaterial ? extensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS].cloneMaterial(material) : material.clone()
          if (useSkinning) cachedMaterial.skinning = true
          if (useVertexTangents) cachedMaterial.vertexTangents = true
          if (useVertexColors) cachedMaterial.vertexColors = THREE.VertexColors
          if (useFlatShading) cachedMaterial.flatShading = true
          if (useMorphTargets) cachedMaterial.morphTargets = true
          if (useMorphNormals) cachedMaterial.morphNormals = true
          this.cache.add(cacheKey, cachedMaterial)
        }
        material = cachedMaterial
      }
      if (material.aoMap && geometry.attributes.uv2 === undefined && geometry.attributes.uv !== undefined) {
        console.log('THREE.GLTFLoader: Duplicating UVs to support aoMap.')
        geometry.addAttribute('uv2', new THREE.BufferAttribute(geometry.attributes.uv.array, 2))
      }
      if (material.isGLTFSpecularGlossinessMaterial) {
        mesh.onBeforeRender = extensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS].refreshUniforms
      }
      mesh.material = material
    }
    GLTFParser.prototype.loadMaterial = function (materialIndex) {
      const parser = this
      const json = this.json
      const extensions = this.extensions
      const materialDef = json.materials[materialIndex]
      let materialType
      const materialParams = {}
      const materialExtensions = materialDef.extensions || {}
      const pending = []
      if (materialExtensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS]) {
        const sgExtension = extensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS]
        materialType = sgExtension.getMaterialType()
        pending.push(sgExtension.extendParams(materialParams, materialDef, parser))
      } else if (materialExtensions[EXTENSIONS.KHR_MATERIALS_UNLIT]) {
        const kmuExtension = extensions[EXTENSIONS.KHR_MATERIALS_UNLIT]
        materialType = kmuExtension.getMaterialType()
        pending.push(kmuExtension.extendParams(materialParams, materialDef, parser))
      } else {
        materialType = THREE.MeshStandardMaterial
        const metallicRoughness = materialDef.pbrMetallicRoughness || {}
        materialParams.color = new THREE.Color(1.0, 1.0, 1.0)
        materialParams.opacity = 1.0
        if (Array.isArray(metallicRoughness.baseColorFactor)) {
          const array = metallicRoughness.baseColorFactor
          materialParams.color.fromArray(array)
          materialParams.opacity = array[3]
        }
        if (metallicRoughness.baseColorTexture !== undefined) {
          pending.push(parser.assignTexture(materialParams, 'map', metallicRoughness.baseColorTexture))
        }
        materialParams.metalness = metallicRoughness.metallicFactor !== undefined ? metallicRoughness.metallicFactor : 1.0
        materialParams.roughness = metallicRoughness.roughnessFactor !== undefined ? metallicRoughness.roughnessFactor : 1.0
        if (metallicRoughness.metallicRoughnessTexture !== undefined) {
          pending.push(parser.assignTexture(materialParams, 'metalnessMap', metallicRoughness.metallicRoughnessTexture))
          pending.push(parser.assignTexture(materialParams, 'roughnessMap', metallicRoughness.metallicRoughnessTexture))
        }
      }
      if (materialDef.doubleSided === true) {
        materialParams.side = THREE.DoubleSide
      }
      const alphaMode = materialDef.alphaMode || ALPHA_MODES.OPAQUE
      if (alphaMode === ALPHA_MODES.BLEND) {
        materialParams.transparent = true
      } else {
        materialParams.transparent = false
        if (alphaMode === ALPHA_MODES.MASK) {
          materialParams.alphaTest = materialDef.alphaCutoff !== undefined ? materialDef.alphaCutoff : 0.5
        }
      }
      if (materialDef.normalTexture !== undefined && materialType !== THREE.MeshBasicMaterial) {
        pending.push(parser.assignTexture(materialParams, 'normalMap', materialDef.normalTexture))
        materialParams.normalScale = new THREE.Vector2(1, 1)
        if (materialDef.normalTexture.scale !== undefined) {
          materialParams.normalScale.set(materialDef.normalTexture.scale, materialDef.normalTexture.scale)
        }
      }
      if (materialDef.occlusionTexture !== undefined && materialType !== THREE.MeshBasicMaterial) {
        pending.push(parser.assignTexture(materialParams, 'aoMap', materialDef.occlusionTexture))
        if (materialDef.occlusionTexture.strength !== undefined) {
          materialParams.aoMapIntensity = materialDef.occlusionTexture.strength
        }
      }
      if (materialDef.emissiveFactor !== undefined && materialType !== THREE.MeshBasicMaterial) {
        materialParams.emissive = new THREE.Color().fromArray(materialDef.emissiveFactor)
      }
      if (materialDef.emissiveTexture !== undefined && materialType !== THREE.MeshBasicMaterial) {
        pending.push(parser.assignTexture(materialParams, 'emissiveMap', materialDef.emissiveTexture))
      }
      return Promise.all(pending).then(function () {
        let material
        if (materialType === THREE.ShaderMaterial) {
          material = extensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS].createMaterial(materialParams)
        } else {
          material = new materialType(materialParams)
        }
        if (materialDef.name !== undefined) material.name = materialDef.name
        if (material.map) material.map.encoding = THREE.sRGBEncoding
        if (material.emissiveMap) material.emissiveMap.encoding = THREE.sRGBEncoding
        if (material.specularMap) material.specularMap.encoding = THREE.sRGBEncoding
        assignExtrasToUserData(material, materialDef)
        if (materialDef.extensions) addUnknownExtensionsToUserData(extensions, material, materialDef)
        return material
      })
    }
    function addPrimitiveAttributes(geometry, primitiveDef, parser) {
      const attributes = primitiveDef.attributes
      const pending = []
      function assignAttributeAccessor(accessorIndex, attributeName) {
        return parser.getDependency('accessor', accessorIndex).then(function (accessor) {
          geometry.addAttribute(attributeName, accessor)
        })
      }
      for (const gltfAttributeName in attributes) {
        const threeAttributeName = ATTRIBUTES[gltfAttributeName] || gltfAttributeName.toLowerCase()
        if (threeAttributeName in geometry.attributes) continue
        pending.push(assignAttributeAccessor(attributes[gltfAttributeName], threeAttributeName))
      }
      if (primitiveDef.indices !== undefined && !geometry.index) {
        const accessor = parser.getDependency('accessor', primitiveDef.indices).then(function (accessor) {
          geometry.setIndex(accessor)
        })
        pending.push(accessor)
      }
      assignExtrasToUserData(geometry, primitiveDef)
      return Promise.all(pending).then(function () {
        return primitiveDef.targets !== undefined ? addMorphTargets(geometry, primitiveDef.targets, parser) : geometry
      })
    }
    GLTFParser.prototype.loadGeometries = function (primitives) {
      const parser = this
      const extensions = this.extensions
      const cache = this.primitiveCache
      function createDracoPrimitive(primitive) {
        return extensions[EXTENSIONS.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(primitive, parser).then(function (geometry) {
          return addPrimitiveAttributes(geometry, primitive, parser)
        })
      }
      const pending = []
      for (let i = 0,
        il = primitives.length; i < il; i++) {
        const primitive = primitives[i]
        const cacheKey = createPrimitiveKey(primitive)
        const cached = cache[cacheKey]
        if (cached) {
          pending.push(cached.promise)
        } else {
          var geometryPromise
          if (primitive.extensions && primitive.extensions[EXTENSIONS.KHR_DRACO_MESH_COMPRESSION]) {
            geometryPromise = createDracoPrimitive(primitive)
          } else {
            geometryPromise = addPrimitiveAttributes(new THREE.BufferGeometry(), primitive, parser)
          }
          cache[cacheKey] = {
            primitive,
            promise: geometryPromise
          }
          pending.push(geometryPromise)
        }
      }
      return Promise.all(pending)
    }
    GLTFParser.prototype.loadMesh = function (meshIndex) {
      const parser = this
      const json = this.json
      const meshDef = json.meshes[meshIndex]
      const primitives = meshDef.primitives
      const pending = []
      for (let i = 0,
        il = primitives.length; i < il; i++) {
        const material = primitives[i].material === undefined ? createDefaultMaterial() : this.getDependency('material', primitives[i].material)
        pending.push(material)
      }
      return Promise.all(pending).then(function (originalMaterials) {
        return parser.loadGeometries(primitives).then(function (geometries) {
          const meshes = []
          for (var i = 0,
            il = geometries.length; i < il; i++) {
            const geometry = geometries[i]
            const primitive = primitives[i]
            var mesh
            const material = originalMaterials[i]
            if (primitive.mode === WEBGL_CONSTANTS.TRIANGLES || primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP || primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN || primitive.mode === undefined) {
              mesh = meshDef.isSkinnedMesh === true ? new THREE.SkinnedMesh(geometry, material) : new THREE.Mesh(geometry, material)
              if (mesh.isSkinnedMesh === true && !mesh.geometry.attributes.skinWeight.normalized) {
                mesh.normalizeSkinWeights()
              }
              if (primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP) {
                mesh.drawMode = THREE.TriangleStripDrawMode
              } else if (primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN) {
                mesh.drawMode = THREE.TriangleFanDrawMode
              }
            } else if (primitive.mode === WEBGL_CONSTANTS.LINES) {
              mesh = new THREE.LineSegments(geometry, material)
            } else if (primitive.mode === WEBGL_CONSTANTS.LINE_STRIP) {
              mesh = new THREE.Line(geometry, material)
            } else if (primitive.mode === WEBGL_CONSTANTS.LINE_LOOP) {
              mesh = new THREE.LineLoop(geometry, material)
            } else if (primitive.mode === WEBGL_CONSTANTS.POINTS) {
              mesh = new THREE.Points(geometry, material)
            } else {
              throw new Error('THREE.GLTFLoader: Primitive mode unsupported: ' + primitive.mode)
            }
            if (Object.keys(mesh.geometry.morphAttributes).length > 0) {
              updateMorphTargets(mesh, meshDef)
            }
            mesh.name = meshDef.name || ('mesh_' + meshIndex)
            if (geometries.length > 1) mesh.name += '_' + i
            assignExtrasToUserData(mesh, meshDef)
            parser.assignFinalMaterial(mesh)
            meshes.push(mesh)
          }
          if (meshes.length === 1) {
            return meshes[0]
          }
          const group = new THREE.Group()
          for (var i = 0,
            il = meshes.length; i < il; i++) {
            group.add(meshes[i])
          }
          return group
        })
      })
    }
    GLTFParser.prototype.loadCamera = function (cameraIndex) {
      let camera
      const cameraDef = this.json.cameras[cameraIndex]
      const params = cameraDef[cameraDef.type]
      if (!params) {
        console.warn('THREE.GLTFLoader: Missing camera parameters.')
        return
      }
      if (cameraDef.type === 'perspective') {
        camera = new THREE.PerspectiveCamera(THREE.Math.radToDeg(params.yfov), params.aspectRatio || 1, params.znear || 1, params.zfar || 2e6)
      } else if (cameraDef.type === 'orthographic') {
        camera = new THREE.OrthographicCamera(params.xmag / -2, params.xmag / 2, params.ymag / 2, params.ymag / -2, params.znear, params.zfar)
      }
      if (cameraDef.name !== undefined) camera.name = cameraDef.name
      assignExtrasToUserData(camera, cameraDef)
      return Promise.resolve(camera)
    }
    GLTFParser.prototype.loadSkin = function (skinIndex) {
      const skinDef = this.json.skins[skinIndex]
      const skinEntry = {
        joints: skinDef.joints
      }
      if (skinDef.inverseBindMatrices === undefined) {
        return Promise.resolve(skinEntry)
      }
      return this.getDependency('accessor', skinDef.inverseBindMatrices).then(function (accessor) {
        skinEntry.inverseBindMatrices = accessor
        return skinEntry
      })
    }
    GLTFParser.prototype.loadAnimation = function (animationIndex) {
      const json = this.json
      const animationDef = json.animations[animationIndex]
      const pendingNodes = []
      const pendingInputAccessors = []
      const pendingOutputAccessors = []
      const pendingSamplers = []
      const pendingTargets = []
      for (let i = 0,
        il = animationDef.channels.length; i < il; i++) {
        const channel = animationDef.channels[i]
        const sampler = animationDef.samplers[channel.sampler]
        const target = channel.target
        const name = target.node !== undefined ? target.node : target.id
        const input = animationDef.parameters !== undefined ? animationDef.parameters[sampler.input] : sampler.input
        const output = animationDef.parameters !== undefined ? animationDef.parameters[sampler.output] : sampler.output
        pendingNodes.push(this.getDependency('node', name))
        pendingInputAccessors.push(this.getDependency('accessor', input))
        pendingOutputAccessors.push(this.getDependency('accessor', output))
        pendingSamplers.push(sampler)
        pendingTargets.push(target)
      }
      return Promise.all([Promise.all(pendingNodes), Promise.all(pendingInputAccessors), Promise.all(pendingOutputAccessors), Promise.all(pendingSamplers), Promise.all(pendingTargets)]).then(function (dependencies) {
        const nodes = dependencies[0]
        const inputAccessors = dependencies[1]
        const outputAccessors = dependencies[2]
        const samplers = dependencies[3]
        const targets = dependencies[4]
        const tracks = []
        for (let i = 0,
          il = nodes.length; i < il; i++) {
          const node = nodes[i]
          const inputAccessor = inputAccessors[i]
          const outputAccessor = outputAccessors[i]
          const sampler = samplers[i]
          const target = targets[i]
          if (node === undefined) continue
          node.updateMatrix()
          node.matrixAutoUpdate = true
          var TypedKeyframeTrack
          switch (PATH_PROPERTIES[target.path]) {
            case PATH_PROPERTIES.weights:
              TypedKeyframeTrack = THREE.NumberKeyframeTrack
              break
            case PATH_PROPERTIES.rotation:
              TypedKeyframeTrack = THREE.QuaternionKeyframeTrack
              break
            case PATH_PROPERTIES.position:
            case PATH_PROPERTIES.scale:
            default:
              TypedKeyframeTrack = THREE.VectorKeyframeTrack
              break
          }
          const targetName = node.name ? node.name : node.uuid
          const interpolation = sampler.interpolation !== undefined ? INTERPOLATION[sampler.interpolation] : THREE.InterpolateLinear
          var targetNames = []
          if (PATH_PROPERTIES[target.path] === PATH_PROPERTIES.weights) {
            node.traverse(function (object) {
              if (object.isMesh === true && object.morphTargetInfluences) {
                targetNames.push(object.name ? object.name : object.uuid)
              }
            })
          } else {
            targetNames.push(targetName)
          }
          let outputArray = outputAccessor.array
          if (outputAccessor.normalized) {
            var scale
            if (outputArray.constructor === Int8Array) {
              scale = 1 / 127
            } else if (outputArray.constructor === Uint8Array) {
              scale = 1 / 255
            } else if (outputArray.constructor == Int16Array) {
              scale = 1 / 32767
            } else if (outputArray.constructor === Uint16Array) {
              scale = 1 / 65535
            } else {
              throw new Error('THREE.GLTFLoader: Unsupported output accessor component type.')
            }
            const scaled = new Float32Array(outputArray.length)
            for (var j = 0,
              jl = outputArray.length; j < jl; j++) {
              scaled[j] = outputArray[j] * scale
            }
            outputArray = scaled
          }
          for (var j = 0,
            jl = targetNames.length; j < jl; j++) {
            const track = new TypedKeyframeTrack(targetNames[j] + '.' + PATH_PROPERTIES[target.path], inputAccessor.array, outputArray, interpolation)
            if (sampler.interpolation === 'CUBICSPLINE') {
              track.createInterpolant = function InterpolantFactoryMethodGLTFCubicSpline(result) {
                return new GLTFCubicSplineInterpolant(this.times, this.values, this.getValueSize() / 3, result)
              }
              track.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = true
            }
            tracks.push(track)
          }
        }
        const name = animationDef.name !== undefined ? animationDef.name : 'animation_' + animationIndex
        return new THREE.AnimationClip(name, undefined, tracks)
      })
    }
    GLTFParser.prototype.loadNode = function (nodeIndex) {
      const json = this.json
      const extensions = this.extensions
      const parser = this
      const meshReferences = json.meshReferences
      const meshUses = json.meshUses
      const nodeDef = json.nodes[nodeIndex]
      return (function () {
        const pending = []
        if (nodeDef.mesh !== undefined) {
          pending.push(parser.getDependency('mesh', nodeDef.mesh).then(function (mesh) {
            let node
            if (meshReferences[nodeDef.mesh] > 1) {
              const instanceNum = meshUses[nodeDef.mesh]++
              node = mesh.clone()
              node.name += '_instance_' + instanceNum
              node.onBeforeRender = mesh.onBeforeRender
              for (let i = 0,
                il = node.children.length; i < il; i++) {
                node.children[i].name += '_instance_' + instanceNum
                node.children[i].onBeforeRender = mesh.children[i].onBeforeRender
              }
            } else {
              node = mesh
            }
            if (nodeDef.weights !== undefined) {
              node.traverse(function (o) {
                if (!o.isMesh) return
                for (let i = 0,
                  il = nodeDef.weights.length; i < il; i++) {
                  o.morphTargetInfluences[i] = nodeDef.weights[i]
                }
              })
            }
            return node
          }))
        }
        if (nodeDef.camera !== undefined) {
          pending.push(parser.getDependency('camera', nodeDef.camera))
        }
        if (nodeDef.extensions && nodeDef.extensions[EXTENSIONS.KHR_LIGHTS_PUNCTUAL] && nodeDef.extensions[EXTENSIONS.KHR_LIGHTS_PUNCTUAL].light !== undefined) {
          pending.push(parser.getDependency('light', nodeDef.extensions[EXTENSIONS.KHR_LIGHTS_PUNCTUAL].light))
        }
        return Promise.all(pending)
      }()).then(function (objects) {
        let node
        if (nodeDef.isBone === true) {
          node = new THREE.Bone()
        } else if (objects.length > 1) {
          node = new THREE.Group()
        } else if (objects.length === 1) {
          node = objects[0]
        } else {
          node = new THREE.Object3D()
        }
        if (node !== objects[0]) {
          for (let i = 0,
            il = objects.length; i < il; i++) {
            node.add(objects[i])
          }
        }
        if (nodeDef.name !== undefined) {
          node.userData.name = nodeDef.name
          node.name = THREE.PropertyBinding.sanitizeNodeName(nodeDef.name)
        }
        assignExtrasToUserData(node, nodeDef)
        if (nodeDef.extensions) addUnknownExtensionsToUserData(extensions, node, nodeDef)
        if (nodeDef.matrix !== undefined) {
          const matrix = new THREE.Matrix4()
          matrix.fromArray(nodeDef.matrix)
          node.applyMatrix(matrix)
        } else {
          if (nodeDef.translation !== undefined) {
            node.position.fromArray(nodeDef.translation)
          }
          if (nodeDef.rotation !== undefined) {
            node.quaternion.fromArray(nodeDef.rotation)
          }
          if (nodeDef.scale !== undefined) {
            node.scale.fromArray(nodeDef.scale)
          }
        }
        return node
      })
    }
    GLTFParser.prototype.loadScene = (function () {
      function buildNodeHierachy(nodeId, parentObject, json, parser) {
        const nodeDef = json.nodes[nodeId]
        return parser.getDependency('node', nodeId).then(function (node) {
          if (nodeDef.skin === undefined) return node
          let skinEntry
          return parser.getDependency('skin', nodeDef.skin).then(function (skin) {
            skinEntry = skin
            const pendingJoints = []
            for (let i = 0,
              il = skinEntry.joints.length; i < il; i++) {
              pendingJoints.push(parser.getDependency('node', skinEntry.joints[i]))
            }
            return Promise.all(pendingJoints)
          }).then(function (jointNodes) {
            node.traverse(function (mesh) {
              if (!mesh.isMesh) return
              const bones = []
              const boneInverses = []
              for (let j = 0,
                jl = jointNodes.length; j < jl; j++) {
                const jointNode = jointNodes[j]
                if (jointNode) {
                  bones.push(jointNode)
                  const mat = new THREE.Matrix4()
                  if (skinEntry.inverseBindMatrices !== undefined) {
                    mat.fromArray(skinEntry.inverseBindMatrices.array, j * 16)
                  }
                  boneInverses.push(mat)
                } else {
                  console.warn('THREE.GLTFLoader: Joint "%s" could not be found.', skinEntry.joints[j])
                }
              }
              mesh.bind(new THREE.Skeleton(bones, boneInverses), mesh.matrixWorld)
            })
            return node
          })
        }).then(function (node) {
          parentObject.add(node)
          const pending = []
          if (nodeDef.children) {
            const children = nodeDef.children
            for (let i = 0,
              il = children.length; i < il; i++) {
              const child = children[i]
              pending.push(buildNodeHierachy(child, node, json, parser))
            }
          }
          return Promise.all(pending)
        })
      }
      return function loadScene(sceneIndex) {
        const json = this.json
        const extensions = this.extensions
        const sceneDef = this.json.scenes[sceneIndex]
        const parser = this
        const scene = new THREE.Scene()
        if (sceneDef.name !== undefined) scene.name = sceneDef.name
        assignExtrasToUserData(scene, sceneDef)
        if (sceneDef.extensions) addUnknownExtensionsToUserData(extensions, scene, sceneDef)
        const nodeIds = sceneDef.nodes || []
        const pending = []
        for (let i = 0,
          il = nodeIds.length; i < il; i++) {
          pending.push(buildNodeHierachy(nodeIds[i], scene, json, parser))
        }
        return Promise.all(pending).then(function () {
          return scene
        })
      }
    }())
    return GLTFLoader
  }())
}
