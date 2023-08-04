// #lizard forgives
/*eslint-disable*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

/**
 * enARModelStatus enum.
 * @exports enARModelStatus
 * @enum {number}
 * @property {number} ARModel_Status_Default=0 ARModel_Status_Default value
 * @property {number} ARModel_Status_Init=1 ARModel_Status_Init value
 * @property {number} ARModel_Status_Sparse_Finished=2 ARModel_Status_Sparse_Finished value
 * @property {number} ARModel_Status_3d_Finished=3 ARModel_Status_3d_Finished value
 * @property {number} ARModel_Status_Object_Finished=4 ARModel_Status_Object_Finished value
 * @property {number} ARModel_Status_Marker_Finished=5 ARModel_Status_Marker_Finished value
 * @property {number} ARModel_Status_Fail=100 ARModel_Status_Fail value
 */
$root.enARModelStatus = (function() {
    var valuesById = {}, values = Object.create(valuesById);
    values[valuesById[0] = "ARModel_Status_Default"] = 0;
    values[valuesById[1] = "ARModel_Status_Init"] = 1;
    values[valuesById[2] = "ARModel_Status_Sparse_Finished"] = 2;
    values[valuesById[3] = "ARModel_Status_3d_Finished"] = 3;
    values[valuesById[4] = "ARModel_Status_Object_Finished"] = 4;
    values[valuesById[5] = "ARModel_Status_Marker_Finished"] = 5;
    values[valuesById[100] = "ARModel_Status_Fail"] = 100;
    return values;
})();

/**
 * enARAlgorithmType enum.
 * @exports enARAlgorithmType
 * @enum {number}
 * @property {number} Algorithm_Type_3D_Object=1 Algorithm_Type_3D_Object value
 * @property {number} Algorithm_Type_3D_Marker=2 Algorithm_Type_3D_Marker value
 */
$root.enARAlgorithmType = (function() {
    var valuesById = {}, values = Object.create(valuesById);
    values[valuesById[1] = "Algorithm_Type_3D_Object"] = 1;
    values[valuesById[2] = "Algorithm_Type_3D_Marker"] = 2;
    return values;
})();

/**
 * enARModelType enum.
 * @exports enARModelType
 * @enum {number}
 * @property {number} ARModel_Type_Sparse=1 ARModel_Type_Sparse value
 * @property {number} ARModel_Type_3D=2 ARModel_Type_3D value
 * @property {number} ARModel_Type_Marker=3 ARModel_Type_Marker value
 */
$root.enARModelType = (function() {
    var valuesById = {}, values = Object.create(valuesById);
    values[valuesById[1] = "ARModel_Type_Sparse"] = 1;
    values[valuesById[2] = "ARModel_Type_3D"] = 2;
    values[valuesById[3] = "ARModel_Type_Marker"] = 3;
    return values;
})();

$root.ModelCos = (function() {

    /**
     * Properties of a ModelCos.
     * @exports IModelCos
     * @interface IModelCos
     * @property {Array.<ModelCos.IModelCosId>|null} [modelList] ModelCos modelList
     */

    /**
     * Constructs a new ModelCos.
     * @exports ModelCos
     * @classdesc Represents a ModelCos.
     * @implements IModelCos
     * @constructor
     * @param {IModelCos=} [properties] Properties to set
     */
    function ModelCos(properties) {
        this.modelList = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ModelCos modelList.
     * @member {Array.<ModelCos.IModelCosId>} modelList
     * @memberof ModelCos
     * @instance
     */
    ModelCos.prototype.modelList = $util.emptyArray;

    /**
     * Creates a new ModelCos instance using the specified properties.
     * @function create
     * @memberof ModelCos
     * @static
     * @param {IModelCos=} [properties] Properties to set
     * @returns {ModelCos} ModelCos instance
     */
    ModelCos.create = function create(properties) {
        return new ModelCos(properties);
    };

    /**
     * Encodes the specified ModelCos message. Does not implicitly {@link ModelCos.verify|verify} messages.
     * @function encode
     * @memberof ModelCos
     * @static
     * @param {IModelCos} message ModelCos message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ModelCos.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.modelList != null && message.modelList.length)
            for (var i = 0; i < message.modelList.length; ++i)
                $root.ModelCos.ModelCosId.encode(message.modelList[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified ModelCos message, length delimited. Does not implicitly {@link ModelCos.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ModelCos
     * @static
     * @param {IModelCos} message ModelCos message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ModelCos.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ModelCos message from the specified reader or buffer.
     * @function decode
     * @memberof ModelCos
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ModelCos} ModelCos
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ModelCos.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ModelCos();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.modelList && message.modelList.length))
                    message.modelList = [];
                message.modelList.push($root.ModelCos.ModelCosId.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a ModelCos message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ModelCos
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ModelCos} ModelCos
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ModelCos.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ModelCos message.
     * @function verify
     * @memberof ModelCos
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ModelCos.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.modelList != null && message.hasOwnProperty("modelList")) {
            if (!Array.isArray(message.modelList))
                return "modelList: array expected";
            for (var i = 0; i < message.modelList.length; ++i) {
                var error = $root.ModelCos.ModelCosId.verify(message.modelList[i]);
                if (error)
                    return "modelList." + error;
            }
        }
        return null;
    };

    /**
     * Creates a ModelCos message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ModelCos
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ModelCos} ModelCos
     */
    ModelCos.fromObject = function fromObject(object) {
        if (object instanceof $root.ModelCos)
            return object;
        var message = new $root.ModelCos();
        if (object.modelList) {
            if (!Array.isArray(object.modelList))
                throw TypeError(".ModelCos.modelList: array expected");
            message.modelList = [];
            for (var i = 0; i < object.modelList.length; ++i) {
                if (typeof object.modelList[i] !== "object")
                    throw TypeError(".ModelCos.modelList: object expected");
                message.modelList[i] = $root.ModelCos.ModelCosId.fromObject(object.modelList[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a ModelCos message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ModelCos
     * @static
     * @param {ModelCos} message ModelCos
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ModelCos.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.modelList = [];
        if (message.modelList && message.modelList.length) {
            object.modelList = [];
            for (var j = 0; j < message.modelList.length; ++j)
                object.modelList[j] = $root.ModelCos.ModelCosId.toObject(message.modelList[j], options);
        }
        return object;
    };

    /**
     * Converts this ModelCos to JSON.
     * @function toJSON
     * @memberof ModelCos
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ModelCos.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    ModelCos.ModelCosId = (function() {

        /**
         * Properties of a ModelCosId.
         * @memberof ModelCos
         * @interface IModelCosId
         * @property {enARModelType|null} [modelType] ModelCosId modelType
         * @property {string|null} [modelCosid] ModelCosId modelCosid
         * @property {string|null} [errmsg] ModelCosId errmsg
         */

        /**
         * Constructs a new ModelCosId.
         * @memberof ModelCos
         * @classdesc Represents a ModelCosId.
         * @implements IModelCosId
         * @constructor
         * @param {ModelCos.IModelCosId=} [properties] Properties to set
         */
        function ModelCosId(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ModelCosId modelType.
         * @member {enARModelType} modelType
         * @memberof ModelCos.ModelCosId
         * @instance
         */
        ModelCosId.prototype.modelType = 1;

        /**
         * ModelCosId modelCosid.
         * @member {string} modelCosid
         * @memberof ModelCos.ModelCosId
         * @instance
         */
        ModelCosId.prototype.modelCosid = "";

        /**
         * ModelCosId errmsg.
         * @member {string} errmsg
         * @memberof ModelCos.ModelCosId
         * @instance
         */
        ModelCosId.prototype.errmsg = "";

        /**
         * Creates a new ModelCosId instance using the specified properties.
         * @function create
         * @memberof ModelCos.ModelCosId
         * @static
         * @param {ModelCos.IModelCosId=} [properties] Properties to set
         * @returns {ModelCos.ModelCosId} ModelCosId instance
         */
        ModelCosId.create = function create(properties) {
            return new ModelCosId(properties);
        };

        /**
         * Encodes the specified ModelCosId message. Does not implicitly {@link ModelCos.ModelCosId.verify|verify} messages.
         * @function encode
         * @memberof ModelCos.ModelCosId
         * @static
         * @param {ModelCos.IModelCosId} message ModelCosId message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ModelCosId.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.modelType != null && Object.hasOwnProperty.call(message, "modelType"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.modelType);
            if (message.modelCosid != null && Object.hasOwnProperty.call(message, "modelCosid"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.modelCosid);
            if (message.errmsg != null && Object.hasOwnProperty.call(message, "errmsg"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.errmsg);
            return writer;
        };

        /**
         * Encodes the specified ModelCosId message, length delimited. Does not implicitly {@link ModelCos.ModelCosId.verify|verify} messages.
         * @function encodeDelimited
         * @memberof ModelCos.ModelCosId
         * @static
         * @param {ModelCos.IModelCosId} message ModelCosId message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ModelCosId.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ModelCosId message from the specified reader or buffer.
         * @function decode
         * @memberof ModelCos.ModelCosId
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {ModelCos.ModelCosId} ModelCosId
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ModelCosId.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ModelCos.ModelCosId();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.modelType = reader.int32();
                    break;
                case 2:
                    message.modelCosid = reader.string();
                    break;
                case 3:
                    message.errmsg = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ModelCosId message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof ModelCos.ModelCosId
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {ModelCos.ModelCosId} ModelCosId
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ModelCosId.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ModelCosId message.
         * @function verify
         * @memberof ModelCos.ModelCosId
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ModelCosId.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.modelType != null && message.hasOwnProperty("modelType"))
                switch (message.modelType) {
                default:
                    return "modelType: enum value expected";
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.modelCosid != null && message.hasOwnProperty("modelCosid"))
                if (!$util.isString(message.modelCosid))
                    return "modelCosid: string expected";
            if (message.errmsg != null && message.hasOwnProperty("errmsg"))
                if (!$util.isString(message.errmsg))
                    return "errmsg: string expected";
            return null;
        };

        /**
         * Creates a ModelCosId message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof ModelCos.ModelCosId
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {ModelCos.ModelCosId} ModelCosId
         */
        ModelCosId.fromObject = function fromObject(object) {
            if (object instanceof $root.ModelCos.ModelCosId)
                return object;
            var message = new $root.ModelCos.ModelCosId();
            switch (object.modelType) {
            case "ARModel_Type_Sparse":
            case 1:
                message.modelType = 1;
                break;
            case "ARModel_Type_3D":
            case 2:
                message.modelType = 2;
                break;
            case "ARModel_Type_Marker":
            case 3:
                message.modelType = 3;
                break;
            }
            if (object.modelCosid != null)
                message.modelCosid = String(object.modelCosid);
            if (object.errmsg != null)
                message.errmsg = String(object.errmsg);
            return message;
        };

        /**
         * Creates a plain object from a ModelCosId message. Also converts values to other types if specified.
         * @function toObject
         * @memberof ModelCos.ModelCosId
         * @static
         * @param {ModelCos.ModelCosId} message ModelCosId
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ModelCosId.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.modelType = options.enums === String ? "ARModel_Type_Sparse" : 1;
                object.modelCosid = "";
                object.errmsg = "";
            }
            if (message.modelType != null && message.hasOwnProperty("modelType"))
                object.modelType = options.enums === String ? $root.enARModelType[message.modelType] : message.modelType;
            if (message.modelCosid != null && message.hasOwnProperty("modelCosid"))
                object.modelCosid = message.modelCosid;
            if (message.errmsg != null && message.hasOwnProperty("errmsg"))
                object.errmsg = message.errmsg;
            return object;
        };

        /**
         * Converts this ModelCosId to JSON.
         * @function toJSON
         * @memberof ModelCos.ModelCosId
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ModelCosId.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ModelCosId;
    })();

    return ModelCos;
})();

$root.ARModel = (function() {

    /**
     * Properties of a ARModel.
     * @exports IARModel
     * @interface IARModel
     * @property {string|null} [cosid] ARModel cosid
     * @property {number|null} [bizuin] ARModel bizuin
     * @property {string|null} [name] ARModel name
     * @property {number|null} [uploadTime] ARModel uploadTime
     * @property {enARModelStatus|null} [modelStatus] ARModel modelStatus
     * @property {enARAlgorithmType|null} [algoType] ARModel algoType
     * @property {IModelCos|null} [modelCos] ARModel modelCos
     */

    /**
     * Constructs a new ARModel.
     * @exports ARModel
     * @classdesc Represents a ARModel.
     * @implements IARModel
     * @constructor
     * @param {IARModel=} [properties] Properties to set
     */
    function ARModel(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ARModel cosid.
     * @member {string} cosid
     * @memberof ARModel
     * @instance
     */
    ARModel.prototype.cosid = "";

    /**
     * ARModel bizuin.
     * @member {number} bizuin
     * @memberof ARModel
     * @instance
     */
    ARModel.prototype.bizuin = 0;

    /**
     * ARModel name.
     * @member {string} name
     * @memberof ARModel
     * @instance
     */
    ARModel.prototype.name = "";

    /**
     * ARModel uploadTime.
     * @member {number} uploadTime
     * @memberof ARModel
     * @instance
     */
    ARModel.prototype.uploadTime = 0;

    /**
     * ARModel modelStatus.
     * @member {enARModelStatus} modelStatus
     * @memberof ARModel
     * @instance
     */
    ARModel.prototype.modelStatus = 0;

    /**
     * ARModel algoType.
     * @member {enARAlgorithmType} algoType
     * @memberof ARModel
     * @instance
     */
    ARModel.prototype.algoType = 1;

    /**
     * ARModel modelCos.
     * @member {IModelCos|null|undefined} modelCos
     * @memberof ARModel
     * @instance
     */
    ARModel.prototype.modelCos = null;

    /**
     * Creates a new ARModel instance using the specified properties.
     * @function create
     * @memberof ARModel
     * @static
     * @param {IARModel=} [properties] Properties to set
     * @returns {ARModel} ARModel instance
     */
    ARModel.create = function create(properties) {
        return new ARModel(properties);
    };

    /**
     * Encodes the specified ARModel message. Does not implicitly {@link ARModel.verify|verify} messages.
     * @function encode
     * @memberof ARModel
     * @static
     * @param {IARModel} message ARModel message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ARModel.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.cosid != null && Object.hasOwnProperty.call(message, "cosid"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.cosid);
        if (message.bizuin != null && Object.hasOwnProperty.call(message, "bizuin"))
            writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.bizuin);
        if (message.name != null && Object.hasOwnProperty.call(message, "name"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.name);
        if (message.uploadTime != null && Object.hasOwnProperty.call(message, "uploadTime"))
            writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.uploadTime);
        if (message.modelStatus != null && Object.hasOwnProperty.call(message, "modelStatus"))
            writer.uint32(/* id 5, wireType 0 =*/40).int32(message.modelStatus);
        if (message.algoType != null && Object.hasOwnProperty.call(message, "algoType"))
            writer.uint32(/* id 6, wireType 0 =*/48).int32(message.algoType);
        if (message.modelCos != null && Object.hasOwnProperty.call(message, "modelCos"))
            $root.ModelCos.encode(message.modelCos, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified ARModel message, length delimited. Does not implicitly {@link ARModel.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ARModel
     * @static
     * @param {IARModel} message ARModel message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ARModel.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ARModel message from the specified reader or buffer.
     * @function decode
     * @memberof ARModel
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ARModel} ARModel
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ARModel.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ARModel();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.cosid = reader.string();
                break;
            case 2:
                message.bizuin = reader.uint32();
                break;
            case 3:
                message.name = reader.string();
                break;
            case 4:
                message.uploadTime = reader.uint32();
                break;
            case 5:
                message.modelStatus = reader.int32();
                break;
            case 6:
                message.algoType = reader.int32();
                break;
            case 7:
                message.modelCos = $root.ModelCos.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a ARModel message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ARModel
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ARModel} ARModel
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ARModel.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ARModel message.
     * @function verify
     * @memberof ARModel
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ARModel.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.cosid != null && message.hasOwnProperty("cosid"))
            if (!$util.isString(message.cosid))
                return "cosid: string expected";
        if (message.bizuin != null && message.hasOwnProperty("bizuin"))
            if (!$util.isInteger(message.bizuin))
                return "bizuin: integer expected";
        if (message.name != null && message.hasOwnProperty("name"))
            if (!$util.isString(message.name))
                return "name: string expected";
        if (message.uploadTime != null && message.hasOwnProperty("uploadTime"))
            if (!$util.isInteger(message.uploadTime))
                return "uploadTime: integer expected";
        if (message.modelStatus != null && message.hasOwnProperty("modelStatus"))
            switch (message.modelStatus) {
            default:
                return "modelStatus: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 100:
                break;
            }
        if (message.algoType != null && message.hasOwnProperty("algoType"))
            switch (message.algoType) {
            default:
                return "algoType: enum value expected";
            case 1:
            case 2:
                break;
            }
        if (message.modelCos != null && message.hasOwnProperty("modelCos")) {
            var error = $root.ModelCos.verify(message.modelCos);
            if (error)
                return "modelCos." + error;
        }
        return null;
    };

    /**
     * Creates a ARModel message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ARModel
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ARModel} ARModel
     */
    ARModel.fromObject = function fromObject(object) {
        if (object instanceof $root.ARModel)
            return object;
        var message = new $root.ARModel();
        if (object.cosid != null)
            message.cosid = String(object.cosid);
        if (object.bizuin != null)
            message.bizuin = object.bizuin >>> 0;
        if (object.name != null)
            message.name = String(object.name);
        if (object.uploadTime != null)
            message.uploadTime = object.uploadTime >>> 0;
        switch (object.modelStatus) {
        case "ARModel_Status_Default":
        case 0:
            message.modelStatus = 0;
            break;
        case "ARModel_Status_Init":
        case 1:
            message.modelStatus = 1;
            break;
        case "ARModel_Status_Sparse_Finished":
        case 2:
            message.modelStatus = 2;
            break;
        case "ARModel_Status_3d_Finished":
        case 3:
            message.modelStatus = 3;
            break;
        case "ARModel_Status_Object_Finished":
        case 4:
            message.modelStatus = 4;
            break;
        case "ARModel_Status_Marker_Finished":
        case 5:
            message.modelStatus = 5;
            break;
        case "ARModel_Status_Fail":
        case 100:
            message.modelStatus = 100;
            break;
        }
        switch (object.algoType) {
        case "Algorithm_Type_3D_Object":
        case 1:
            message.algoType = 1;
            break;
        case "Algorithm_Type_3D_Marker":
        case 2:
            message.algoType = 2;
            break;
        }
        if (object.modelCos != null) {
            if (typeof object.modelCos !== "object")
                throw TypeError(".ARModel.modelCos: object expected");
            message.modelCos = $root.ModelCos.fromObject(object.modelCos);
        }
        return message;
    };

    /**
     * Creates a plain object from a ARModel message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ARModel
     * @static
     * @param {ARModel} message ARModel
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ARModel.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.cosid = "";
            object.bizuin = 0;
            object.name = "";
            object.uploadTime = 0;
            object.modelStatus = options.enums === String ? "ARModel_Status_Default" : 0;
            object.algoType = options.enums === String ? "Algorithm_Type_3D_Object" : 1;
            object.modelCos = null;
        }
        if (message.cosid != null && message.hasOwnProperty("cosid"))
            object.cosid = message.cosid;
        if (message.bizuin != null && message.hasOwnProperty("bizuin"))
            object.bizuin = message.bizuin;
        if (message.name != null && message.hasOwnProperty("name"))
            object.name = message.name;
        if (message.uploadTime != null && message.hasOwnProperty("uploadTime"))
            object.uploadTime = message.uploadTime;
        if (message.modelStatus != null && message.hasOwnProperty("modelStatus"))
            object.modelStatus = options.enums === String ? $root.enARModelStatus[message.modelStatus] : message.modelStatus;
        if (message.algoType != null && message.hasOwnProperty("algoType"))
            object.algoType = options.enums === String ? $root.enARAlgorithmType[message.algoType] : message.algoType;
        if (message.modelCos != null && message.hasOwnProperty("modelCos"))
            object.modelCos = $root.ModelCos.toObject(message.modelCos, options);
        return object;
    };

    /**
     * Converts this ARModel to JSON.
     * @function toJSON
     * @memberof ARModel
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ARModel.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ARModel;
})();

$root.GenerateARModelReq = (function() {

    /**
     * Properties of a GenerateARModelReq.
     * @exports IGenerateARModelReq
     * @interface IGenerateARModelReq
     * @property {number|null} [bizuin] GenerateARModelReq bizuin
     * @property {string|null} [name] GenerateARModelReq name
     * @property {Uint8Array|null} [buffer] GenerateARModelReq buffer
     * @property {string|null} [url] GenerateARModelReq url
     * @property {enARAlgorithmType|null} [algoType] GenerateARModelReq algoType
     * @property {number|null} [lod] GenerateARModelReq lod
     * @property {boolean|null} [getmesh] GenerateARModelReq getmesh
     * @property {boolean|null} [gettexture] GenerateARModelReq gettexture
     */

    /**
     * Constructs a new GenerateARModelReq.
     * @exports GenerateARModelReq
     * @classdesc Represents a GenerateARModelReq.
     * @implements IGenerateARModelReq
     * @constructor
     * @param {IGenerateARModelReq=} [properties] Properties to set
     */
    function GenerateARModelReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GenerateARModelReq bizuin.
     * @member {number} bizuin
     * @memberof GenerateARModelReq
     * @instance
     */
    GenerateARModelReq.prototype.bizuin = 0;

    /**
     * GenerateARModelReq name.
     * @member {string} name
     * @memberof GenerateARModelReq
     * @instance
     */
    GenerateARModelReq.prototype.name = "";

    /**
     * GenerateARModelReq buffer.
     * @member {Uint8Array} buffer
     * @memberof GenerateARModelReq
     * @instance
     */
    GenerateARModelReq.prototype.buffer = $util.newBuffer([]);

    /**
     * GenerateARModelReq url.
     * @member {string} url
     * @memberof GenerateARModelReq
     * @instance
     */
    GenerateARModelReq.prototype.url = "";

    /**
     * GenerateARModelReq algoType.
     * @member {enARAlgorithmType} algoType
     * @memberof GenerateARModelReq
     * @instance
     */
    GenerateARModelReq.prototype.algoType = 1;

    /**
     * GenerateARModelReq lod.
     * @member {number} lod
     * @memberof GenerateARModelReq
     * @instance
     */
    GenerateARModelReq.prototype.lod = 0;

    /**
     * GenerateARModelReq getmesh.
     * @member {boolean} getmesh
     * @memberof GenerateARModelReq
     * @instance
     */
    GenerateARModelReq.prototype.getmesh = false;

    /**
     * GenerateARModelReq gettexture.
     * @member {boolean} gettexture
     * @memberof GenerateARModelReq
     * @instance
     */
    GenerateARModelReq.prototype.gettexture = false;

    /**
     * Creates a new GenerateARModelReq instance using the specified properties.
     * @function create
     * @memberof GenerateARModelReq
     * @static
     * @param {IGenerateARModelReq=} [properties] Properties to set
     * @returns {GenerateARModelReq} GenerateARModelReq instance
     */
    GenerateARModelReq.create = function create(properties) {
        return new GenerateARModelReq(properties);
    };

    /**
     * Encodes the specified GenerateARModelReq message. Does not implicitly {@link GenerateARModelReq.verify|verify} messages.
     * @function encode
     * @memberof GenerateARModelReq
     * @static
     * @param {IGenerateARModelReq} message GenerateARModelReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GenerateARModelReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.bizuin != null && Object.hasOwnProperty.call(message, "bizuin"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.bizuin);
        if (message.name != null && Object.hasOwnProperty.call(message, "name"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
        if (message.buffer != null && Object.hasOwnProperty.call(message, "buffer"))
            writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.buffer);
        if (message.url != null && Object.hasOwnProperty.call(message, "url"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.url);
        if (message.algoType != null && Object.hasOwnProperty.call(message, "algoType"))
            writer.uint32(/* id 5, wireType 0 =*/40).int32(message.algoType);
        if (message.lod != null && Object.hasOwnProperty.call(message, "lod"))
            writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.lod);
        if (message.getmesh != null && Object.hasOwnProperty.call(message, "getmesh"))
            writer.uint32(/* id 7, wireType 0 =*/56).bool(message.getmesh);
        if (message.gettexture != null && Object.hasOwnProperty.call(message, "gettexture"))
            writer.uint32(/* id 8, wireType 0 =*/64).bool(message.gettexture);
        return writer;
    };

    /**
     * Encodes the specified GenerateARModelReq message, length delimited. Does not implicitly {@link GenerateARModelReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GenerateARModelReq
     * @static
     * @param {IGenerateARModelReq} message GenerateARModelReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GenerateARModelReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GenerateARModelReq message from the specified reader or buffer.
     * @function decode
     * @memberof GenerateARModelReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GenerateARModelReq} GenerateARModelReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GenerateARModelReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GenerateARModelReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.bizuin = reader.uint32();
                break;
            case 2:
                message.name = reader.string();
                break;
            case 3:
                message.buffer = reader.bytes();
                break;
            case 4:
                message.url = reader.string();
                break;
            case 5:
                message.algoType = reader.int32();
                break;
            case 6:
                message.lod = reader.uint32();
                break;
            case 7:
                message.getmesh = reader.bool();
                break;
            case 8:
                message.gettexture = reader.bool();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GenerateARModelReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GenerateARModelReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GenerateARModelReq} GenerateARModelReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GenerateARModelReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GenerateARModelReq message.
     * @function verify
     * @memberof GenerateARModelReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GenerateARModelReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.bizuin != null && message.hasOwnProperty("bizuin"))
            if (!$util.isInteger(message.bizuin))
                return "bizuin: integer expected";
        if (message.name != null && message.hasOwnProperty("name"))
            if (!$util.isString(message.name))
                return "name: string expected";
        if (message.buffer != null && message.hasOwnProperty("buffer"))
            if (!(message.buffer && typeof message.buffer.length === "number" || $util.isString(message.buffer)))
                return "buffer: buffer expected";
        if (message.url != null && message.hasOwnProperty("url"))
            if (!$util.isString(message.url))
                return "url: string expected";
        if (message.algoType != null && message.hasOwnProperty("algoType"))
            switch (message.algoType) {
            default:
                return "algoType: enum value expected";
            case 1:
            case 2:
                break;
            }
        if (message.lod != null && message.hasOwnProperty("lod"))
            if (!$util.isInteger(message.lod))
                return "lod: integer expected";
        if (message.getmesh != null && message.hasOwnProperty("getmesh"))
            if (typeof message.getmesh !== "boolean")
                return "getmesh: boolean expected";
        if (message.gettexture != null && message.hasOwnProperty("gettexture"))
            if (typeof message.gettexture !== "boolean")
                return "gettexture: boolean expected";
        return null;
    };

    /**
     * Creates a GenerateARModelReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GenerateARModelReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GenerateARModelReq} GenerateARModelReq
     */
    GenerateARModelReq.fromObject = function fromObject(object) {
        if (object instanceof $root.GenerateARModelReq)
            return object;
        var message = new $root.GenerateARModelReq();
        if (object.bizuin != null)
            message.bizuin = object.bizuin >>> 0;
        if (object.name != null)
            message.name = String(object.name);
        if (object.buffer != null)
            if (typeof object.buffer === "string")
                $util.base64.decode(object.buffer, message.buffer = $util.newBuffer($util.base64.length(object.buffer)), 0);
            else if (object.buffer.length)
                message.buffer = object.buffer;
        if (object.url != null)
            message.url = String(object.url);
        switch (object.algoType) {
        case "Algorithm_Type_3D_Object":
        case 1:
            message.algoType = 1;
            break;
        case "Algorithm_Type_3D_Marker":
        case 2:
            message.algoType = 2;
            break;
        }
        if (object.lod != null)
            message.lod = object.lod >>> 0;
        if (object.getmesh != null)
            message.getmesh = Boolean(object.getmesh);
        if (object.gettexture != null)
            message.gettexture = Boolean(object.gettexture);
        return message;
    };

    /**
     * Creates a plain object from a GenerateARModelReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GenerateARModelReq
     * @static
     * @param {GenerateARModelReq} message GenerateARModelReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GenerateARModelReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.bizuin = 0;
            object.name = "";
            if (options.bytes === String)
                object.buffer = "";
            else {
                object.buffer = [];
                if (options.bytes !== Array)
                    object.buffer = $util.newBuffer(object.buffer);
            }
            object.url = "";
            object.algoType = options.enums === String ? "Algorithm_Type_3D_Object" : 1;
            object.lod = 0;
            object.getmesh = false;
            object.gettexture = false;
        }
        if (message.bizuin != null && message.hasOwnProperty("bizuin"))
            object.bizuin = message.bizuin;
        if (message.name != null && message.hasOwnProperty("name"))
            object.name = message.name;
        if (message.buffer != null && message.hasOwnProperty("buffer"))
            object.buffer = options.bytes === String ? $util.base64.encode(message.buffer, 0, message.buffer.length) : options.bytes === Array ? Array.prototype.slice.call(message.buffer) : message.buffer;
        if (message.url != null && message.hasOwnProperty("url"))
            object.url = message.url;
        if (message.algoType != null && message.hasOwnProperty("algoType"))
            object.algoType = options.enums === String ? $root.enARAlgorithmType[message.algoType] : message.algoType;
        if (message.lod != null && message.hasOwnProperty("lod"))
            object.lod = message.lod;
        if (message.getmesh != null && message.hasOwnProperty("getmesh"))
            object.getmesh = message.getmesh;
        if (message.gettexture != null && message.hasOwnProperty("gettexture"))
            object.gettexture = message.gettexture;
        return object;
    };

    /**
     * Converts this GenerateARModelReq to JSON.
     * @function toJSON
     * @memberof GenerateARModelReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GenerateARModelReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GenerateARModelReq;
})();

$root.GenerateARModelResp = (function() {

    /**
     * Properties of a GenerateARModelResp.
     * @exports IGenerateARModelResp
     * @interface IGenerateARModelResp
     * @property {string|null} [url] GenerateARModelResp url
     * @property {string|null} [host] GenerateARModelResp host
     * @property {string|null} [cosid] GenerateARModelResp cosid
     * @property {string|null} [errmsg] GenerateARModelResp errmsg
     */

    /**
     * Constructs a new GenerateARModelResp.
     * @exports GenerateARModelResp
     * @classdesc Represents a GenerateARModelResp.
     * @implements IGenerateARModelResp
     * @constructor
     * @param {IGenerateARModelResp=} [properties] Properties to set
     */
    function GenerateARModelResp(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GenerateARModelResp url.
     * @member {string} url
     * @memberof GenerateARModelResp
     * @instance
     */
    GenerateARModelResp.prototype.url = "";

    /**
     * GenerateARModelResp host.
     * @member {string} host
     * @memberof GenerateARModelResp
     * @instance
     */
    GenerateARModelResp.prototype.host = "";

    /**
     * GenerateARModelResp cosid.
     * @member {string} cosid
     * @memberof GenerateARModelResp
     * @instance
     */
    GenerateARModelResp.prototype.cosid = "";

    /**
     * GenerateARModelResp errmsg.
     * @member {string} errmsg
     * @memberof GenerateARModelResp
     * @instance
     */
    GenerateARModelResp.prototype.errmsg = "";

    /**
     * Creates a new GenerateARModelResp instance using the specified properties.
     * @function create
     * @memberof GenerateARModelResp
     * @static
     * @param {IGenerateARModelResp=} [properties] Properties to set
     * @returns {GenerateARModelResp} GenerateARModelResp instance
     */
    GenerateARModelResp.create = function create(properties) {
        return new GenerateARModelResp(properties);
    };

    /**
     * Encodes the specified GenerateARModelResp message. Does not implicitly {@link GenerateARModelResp.verify|verify} messages.
     * @function encode
     * @memberof GenerateARModelResp
     * @static
     * @param {IGenerateARModelResp} message GenerateARModelResp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GenerateARModelResp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.url != null && Object.hasOwnProperty.call(message, "url"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.url);
        if (message.host != null && Object.hasOwnProperty.call(message, "host"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.host);
        if (message.cosid != null && Object.hasOwnProperty.call(message, "cosid"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.cosid);
        if (message.errmsg != null && Object.hasOwnProperty.call(message, "errmsg"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.errmsg);
        return writer;
    };

    /**
     * Encodes the specified GenerateARModelResp message, length delimited. Does not implicitly {@link GenerateARModelResp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GenerateARModelResp
     * @static
     * @param {IGenerateARModelResp} message GenerateARModelResp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GenerateARModelResp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GenerateARModelResp message from the specified reader or buffer.
     * @function decode
     * @memberof GenerateARModelResp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GenerateARModelResp} GenerateARModelResp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GenerateARModelResp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GenerateARModelResp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.url = reader.string();
                break;
            case 2:
                message.host = reader.string();
                break;
            case 3:
                message.cosid = reader.string();
                break;
            case 4:
                message.errmsg = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GenerateARModelResp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GenerateARModelResp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GenerateARModelResp} GenerateARModelResp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GenerateARModelResp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GenerateARModelResp message.
     * @function verify
     * @memberof GenerateARModelResp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GenerateARModelResp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.url != null && message.hasOwnProperty("url"))
            if (!$util.isString(message.url))
                return "url: string expected";
        if (message.host != null && message.hasOwnProperty("host"))
            if (!$util.isString(message.host))
                return "host: string expected";
        if (message.cosid != null && message.hasOwnProperty("cosid"))
            if (!$util.isString(message.cosid))
                return "cosid: string expected";
        if (message.errmsg != null && message.hasOwnProperty("errmsg"))
            if (!$util.isString(message.errmsg))
                return "errmsg: string expected";
        return null;
    };

    /**
     * Creates a GenerateARModelResp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GenerateARModelResp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GenerateARModelResp} GenerateARModelResp
     */
    GenerateARModelResp.fromObject = function fromObject(object) {
        if (object instanceof $root.GenerateARModelResp)
            return object;
        var message = new $root.GenerateARModelResp();
        if (object.url != null)
            message.url = String(object.url);
        if (object.host != null)
            message.host = String(object.host);
        if (object.cosid != null)
            message.cosid = String(object.cosid);
        if (object.errmsg != null)
            message.errmsg = String(object.errmsg);
        return message;
    };

    /**
     * Creates a plain object from a GenerateARModelResp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GenerateARModelResp
     * @static
     * @param {GenerateARModelResp} message GenerateARModelResp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GenerateARModelResp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.url = "";
            object.host = "";
            object.cosid = "";
            object.errmsg = "";
        }
        if (message.url != null && message.hasOwnProperty("url"))
            object.url = message.url;
        if (message.host != null && message.hasOwnProperty("host"))
            object.host = message.host;
        if (message.cosid != null && message.hasOwnProperty("cosid"))
            object.cosid = message.cosid;
        if (message.errmsg != null && message.hasOwnProperty("errmsg"))
            object.errmsg = message.errmsg;
        return object;
    };

    /**
     * Converts this GenerateARModelResp to JSON.
     * @function toJSON
     * @memberof GenerateARModelResp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GenerateARModelResp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GenerateARModelResp;
})();

$root.GetARModelListReq = (function() {

    /**
     * Properties of a GetARModelListReq.
     * @exports IGetARModelListReq
     * @interface IGetARModelListReq
     * @property {number|null} [bizuin] GetARModelListReq bizuin
     * @property {number|null} [modelStatus] GetARModelListReq modelStatus
     * @property {number|null} [startTime] GetARModelListReq startTime
     * @property {number|null} [endTime] GetARModelListReq endTime
     * @property {number|null} [offset] GetARModelListReq offset
     * @property {number|null} [limit] GetARModelListReq limit
     * @property {number|null} [algoType] GetARModelListReq algoType
     */

    /**
     * Constructs a new GetARModelListReq.
     * @exports GetARModelListReq
     * @classdesc Represents a GetARModelListReq.
     * @implements IGetARModelListReq
     * @constructor
     * @param {IGetARModelListReq=} [properties] Properties to set
     */
    function GetARModelListReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GetARModelListReq bizuin.
     * @member {number} bizuin
     * @memberof GetARModelListReq
     * @instance
     */
    GetARModelListReq.prototype.bizuin = 0;

    /**
     * GetARModelListReq modelStatus.
     * @member {number} modelStatus
     * @memberof GetARModelListReq
     * @instance
     */
    GetARModelListReq.prototype.modelStatus = 0;

    /**
     * GetARModelListReq startTime.
     * @member {number} startTime
     * @memberof GetARModelListReq
     * @instance
     */
    GetARModelListReq.prototype.startTime = 0;

    /**
     * GetARModelListReq endTime.
     * @member {number} endTime
     * @memberof GetARModelListReq
     * @instance
     */
    GetARModelListReq.prototype.endTime = 0;

    /**
     * GetARModelListReq offset.
     * @member {number} offset
     * @memberof GetARModelListReq
     * @instance
     */
    GetARModelListReq.prototype.offset = 0;

    /**
     * GetARModelListReq limit.
     * @member {number} limit
     * @memberof GetARModelListReq
     * @instance
     */
    GetARModelListReq.prototype.limit = 0;

    /**
     * GetARModelListReq algoType.
     * @member {number} algoType
     * @memberof GetARModelListReq
     * @instance
     */
    GetARModelListReq.prototype.algoType = 0;

    /**
     * Creates a new GetARModelListReq instance using the specified properties.
     * @function create
     * @memberof GetARModelListReq
     * @static
     * @param {IGetARModelListReq=} [properties] Properties to set
     * @returns {GetARModelListReq} GetARModelListReq instance
     */
    GetARModelListReq.create = function create(properties) {
        return new GetARModelListReq(properties);
    };

    /**
     * Encodes the specified GetARModelListReq message. Does not implicitly {@link GetARModelListReq.verify|verify} messages.
     * @function encode
     * @memberof GetARModelListReq
     * @static
     * @param {IGetARModelListReq} message GetARModelListReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetARModelListReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.bizuin != null && Object.hasOwnProperty.call(message, "bizuin"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.bizuin);
        if (message.modelStatus != null && Object.hasOwnProperty.call(message, "modelStatus"))
            writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.modelStatus);
        if (message.startTime != null && Object.hasOwnProperty.call(message, "startTime"))
            writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.startTime);
        if (message.endTime != null && Object.hasOwnProperty.call(message, "endTime"))
            writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.endTime);
        if (message.offset != null && Object.hasOwnProperty.call(message, "offset"))
            writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.offset);
        if (message.limit != null && Object.hasOwnProperty.call(message, "limit"))
            writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.limit);
        if (message.algoType != null && Object.hasOwnProperty.call(message, "algoType"))
            writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.algoType);
        return writer;
    };

    /**
     * Encodes the specified GetARModelListReq message, length delimited. Does not implicitly {@link GetARModelListReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GetARModelListReq
     * @static
     * @param {IGetARModelListReq} message GetARModelListReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetARModelListReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GetARModelListReq message from the specified reader or buffer.
     * @function decode
     * @memberof GetARModelListReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GetARModelListReq} GetARModelListReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetARModelListReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetARModelListReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.bizuin = reader.uint32();
                break;
            case 2:
                message.modelStatus = reader.uint32();
                break;
            case 3:
                message.startTime = reader.uint32();
                break;
            case 4:
                message.endTime = reader.uint32();
                break;
            case 5:
                message.offset = reader.uint32();
                break;
            case 6:
                message.limit = reader.uint32();
                break;
            case 7:
                message.algoType = reader.uint32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GetARModelListReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GetARModelListReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GetARModelListReq} GetARModelListReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetARModelListReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GetARModelListReq message.
     * @function verify
     * @memberof GetARModelListReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GetARModelListReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.bizuin != null && message.hasOwnProperty("bizuin"))
            if (!$util.isInteger(message.bizuin))
                return "bizuin: integer expected";
        if (message.modelStatus != null && message.hasOwnProperty("modelStatus"))
            if (!$util.isInteger(message.modelStatus))
                return "modelStatus: integer expected";
        if (message.startTime != null && message.hasOwnProperty("startTime"))
            if (!$util.isInteger(message.startTime))
                return "startTime: integer expected";
        if (message.endTime != null && message.hasOwnProperty("endTime"))
            if (!$util.isInteger(message.endTime))
                return "endTime: integer expected";
        if (message.offset != null && message.hasOwnProperty("offset"))
            if (!$util.isInteger(message.offset))
                return "offset: integer expected";
        if (message.limit != null && message.hasOwnProperty("limit"))
            if (!$util.isInteger(message.limit))
                return "limit: integer expected";
        if (message.algoType != null && message.hasOwnProperty("algoType"))
            if (!$util.isInteger(message.algoType))
                return "algoType: integer expected";
        return null;
    };

    /**
     * Creates a GetARModelListReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GetARModelListReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GetARModelListReq} GetARModelListReq
     */
    GetARModelListReq.fromObject = function fromObject(object) {
        if (object instanceof $root.GetARModelListReq)
            return object;
        var message = new $root.GetARModelListReq();
        if (object.bizuin != null)
            message.bizuin = object.bizuin >>> 0;
        if (object.modelStatus != null)
            message.modelStatus = object.modelStatus >>> 0;
        if (object.startTime != null)
            message.startTime = object.startTime >>> 0;
        if (object.endTime != null)
            message.endTime = object.endTime >>> 0;
        if (object.offset != null)
            message.offset = object.offset >>> 0;
        if (object.limit != null)
            message.limit = object.limit >>> 0;
        if (object.algoType != null)
            message.algoType = object.algoType >>> 0;
        return message;
    };

    /**
     * Creates a plain object from a GetARModelListReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GetARModelListReq
     * @static
     * @param {GetARModelListReq} message GetARModelListReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GetARModelListReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.bizuin = 0;
            object.modelStatus = 0;
            object.startTime = 0;
            object.endTime = 0;
            object.offset = 0;
            object.limit = 0;
            object.algoType = 0;
        }
        if (message.bizuin != null && message.hasOwnProperty("bizuin"))
            object.bizuin = message.bizuin;
        if (message.modelStatus != null && message.hasOwnProperty("modelStatus"))
            object.modelStatus = message.modelStatus;
        if (message.startTime != null && message.hasOwnProperty("startTime"))
            object.startTime = message.startTime;
        if (message.endTime != null && message.hasOwnProperty("endTime"))
            object.endTime = message.endTime;
        if (message.offset != null && message.hasOwnProperty("offset"))
            object.offset = message.offset;
        if (message.limit != null && message.hasOwnProperty("limit"))
            object.limit = message.limit;
        if (message.algoType != null && message.hasOwnProperty("algoType"))
            object.algoType = message.algoType;
        return object;
    };

    /**
     * Converts this GetARModelListReq to JSON.
     * @function toJSON
     * @memberof GetARModelListReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GetARModelListReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GetARModelListReq;
})();

$root.GetARModelListResp = (function() {

    /**
     * Properties of a GetARModelListResp.
     * @exports IGetARModelListResp
     * @interface IGetARModelListResp
     * @property {Array.<IARModel>|null} [modelList] GetARModelListResp modelList
     */

    /**
     * Constructs a new GetARModelListResp.
     * @exports GetARModelListResp
     * @classdesc Represents a GetARModelListResp.
     * @implements IGetARModelListResp
     * @constructor
     * @param {IGetARModelListResp=} [properties] Properties to set
     */
    function GetARModelListResp(properties) {
        this.modelList = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GetARModelListResp modelList.
     * @member {Array.<IARModel>} modelList
     * @memberof GetARModelListResp
     * @instance
     */
    GetARModelListResp.prototype.modelList = $util.emptyArray;

    /**
     * Creates a new GetARModelListResp instance using the specified properties.
     * @function create
     * @memberof GetARModelListResp
     * @static
     * @param {IGetARModelListResp=} [properties] Properties to set
     * @returns {GetARModelListResp} GetARModelListResp instance
     */
    GetARModelListResp.create = function create(properties) {
        return new GetARModelListResp(properties);
    };

    /**
     * Encodes the specified GetARModelListResp message. Does not implicitly {@link GetARModelListResp.verify|verify} messages.
     * @function encode
     * @memberof GetARModelListResp
     * @static
     * @param {IGetARModelListResp} message GetARModelListResp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetARModelListResp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.modelList != null && message.modelList.length)
            for (var i = 0; i < message.modelList.length; ++i)
                $root.ARModel.encode(message.modelList[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified GetARModelListResp message, length delimited. Does not implicitly {@link GetARModelListResp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GetARModelListResp
     * @static
     * @param {IGetARModelListResp} message GetARModelListResp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetARModelListResp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GetARModelListResp message from the specified reader or buffer.
     * @function decode
     * @memberof GetARModelListResp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GetARModelListResp} GetARModelListResp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetARModelListResp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetARModelListResp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.modelList && message.modelList.length))
                    message.modelList = [];
                message.modelList.push($root.ARModel.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GetARModelListResp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GetARModelListResp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GetARModelListResp} GetARModelListResp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetARModelListResp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GetARModelListResp message.
     * @function verify
     * @memberof GetARModelListResp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GetARModelListResp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.modelList != null && message.hasOwnProperty("modelList")) {
            if (!Array.isArray(message.modelList))
                return "modelList: array expected";
            for (var i = 0; i < message.modelList.length; ++i) {
                var error = $root.ARModel.verify(message.modelList[i]);
                if (error)
                    return "modelList." + error;
            }
        }
        return null;
    };

    /**
     * Creates a GetARModelListResp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GetARModelListResp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GetARModelListResp} GetARModelListResp
     */
    GetARModelListResp.fromObject = function fromObject(object) {
        if (object instanceof $root.GetARModelListResp)
            return object;
        var message = new $root.GetARModelListResp();
        if (object.modelList) {
            if (!Array.isArray(object.modelList))
                throw TypeError(".GetARModelListResp.modelList: array expected");
            message.modelList = [];
            for (var i = 0; i < object.modelList.length; ++i) {
                if (typeof object.modelList[i] !== "object")
                    throw TypeError(".GetARModelListResp.modelList: object expected");
                message.modelList[i] = $root.ARModel.fromObject(object.modelList[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a GetARModelListResp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GetARModelListResp
     * @static
     * @param {GetARModelListResp} message GetARModelListResp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GetARModelListResp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.modelList = [];
        if (message.modelList && message.modelList.length) {
            object.modelList = [];
            for (var j = 0; j < message.modelList.length; ++j)
                object.modelList[j] = $root.ARModel.toObject(message.modelList[j], options);
        }
        return object;
    };

    /**
     * Converts this GetARModelListResp to JSON.
     * @function toJSON
     * @memberof GetARModelListResp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GetARModelListResp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GetARModelListResp;
})();

$root.ARModelData = (function() {

    /**
     * Properties of a ARModelData.
     * @exports IARModelData
     * @interface IARModelData
     * @property {Uint8Array|null} [meshModel] ARModelData meshModel
     * @property {Uint8Array|null} [textureModel] ARModelData textureModel
     * @property {Uint8Array|null} [preview] ARModelData preview
     * @property {Uint8Array|null} [meshBlob] ARModelData meshBlob
     * @property {Uint8Array|null} [textureBlob] ARModelData textureBlob
     */

    /**
     * Constructs a new ARModelData.
     * @exports ARModelData
     * @classdesc Represents a ARModelData.
     * @implements IARModelData
     * @constructor
     * @param {IARModelData=} [properties] Properties to set
     */
    function ARModelData(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ARModelData meshModel.
     * @member {Uint8Array} meshModel
     * @memberof ARModelData
     * @instance
     */
    ARModelData.prototype.meshModel = $util.newBuffer([]);

    /**
     * ARModelData textureModel.
     * @member {Uint8Array} textureModel
     * @memberof ARModelData
     * @instance
     */
    ARModelData.prototype.textureModel = $util.newBuffer([]);

    /**
     * ARModelData preview.
     * @member {Uint8Array} preview
     * @memberof ARModelData
     * @instance
     */
    ARModelData.prototype.preview = $util.newBuffer([]);

    /**
     * ARModelData meshBlob.
     * @member {Uint8Array} meshBlob
     * @memberof ARModelData
     * @instance
     */
    ARModelData.prototype.meshBlob = $util.newBuffer([]);

    /**
     * ARModelData textureBlob.
     * @member {Uint8Array} textureBlob
     * @memberof ARModelData
     * @instance
     */
    ARModelData.prototype.textureBlob = $util.newBuffer([]);

    /**
     * Creates a new ARModelData instance using the specified properties.
     * @function create
     * @memberof ARModelData
     * @static
     * @param {IARModelData=} [properties] Properties to set
     * @returns {ARModelData} ARModelData instance
     */
    ARModelData.create = function create(properties) {
        return new ARModelData(properties);
    };

    /**
     * Encodes the specified ARModelData message. Does not implicitly {@link ARModelData.verify|verify} messages.
     * @function encode
     * @memberof ARModelData
     * @static
     * @param {IARModelData} message ARModelData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ARModelData.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.meshModel != null && Object.hasOwnProperty.call(message, "meshModel"))
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.meshModel);
        if (message.textureModel != null && Object.hasOwnProperty.call(message, "textureModel"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.textureModel);
        if (message.preview != null && Object.hasOwnProperty.call(message, "preview"))
            writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.preview);
        if (message.meshBlob != null && Object.hasOwnProperty.call(message, "meshBlob"))
            writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.meshBlob);
        if (message.textureBlob != null && Object.hasOwnProperty.call(message, "textureBlob"))
            writer.uint32(/* id 5, wireType 2 =*/42).bytes(message.textureBlob);
        return writer;
    };

    /**
     * Encodes the specified ARModelData message, length delimited. Does not implicitly {@link ARModelData.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ARModelData
     * @static
     * @param {IARModelData} message ARModelData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ARModelData.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ARModelData message from the specified reader or buffer.
     * @function decode
     * @memberof ARModelData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ARModelData} ARModelData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ARModelData.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ARModelData();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.meshModel = reader.bytes();
                break;
            case 2:
                message.textureModel = reader.bytes();
                break;
            case 3:
                message.preview = reader.bytes();
                break;
            case 4:
                message.meshBlob = reader.bytes();
                break;
            case 5:
                message.textureBlob = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a ARModelData message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ARModelData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ARModelData} ARModelData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ARModelData.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ARModelData message.
     * @function verify
     * @memberof ARModelData
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ARModelData.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.meshModel != null && message.hasOwnProperty("meshModel"))
            if (!(message.meshModel && typeof message.meshModel.length === "number" || $util.isString(message.meshModel)))
                return "meshModel: buffer expected";
        if (message.textureModel != null && message.hasOwnProperty("textureModel"))
            if (!(message.textureModel && typeof message.textureModel.length === "number" || $util.isString(message.textureModel)))
                return "textureModel: buffer expected";
        if (message.preview != null && message.hasOwnProperty("preview"))
            if (!(message.preview && typeof message.preview.length === "number" || $util.isString(message.preview)))
                return "preview: buffer expected";
        if (message.meshBlob != null && message.hasOwnProperty("meshBlob"))
            if (!(message.meshBlob && typeof message.meshBlob.length === "number" || $util.isString(message.meshBlob)))
                return "meshBlob: buffer expected";
        if (message.textureBlob != null && message.hasOwnProperty("textureBlob"))
            if (!(message.textureBlob && typeof message.textureBlob.length === "number" || $util.isString(message.textureBlob)))
                return "textureBlob: buffer expected";
        return null;
    };

    /**
     * Creates a ARModelData message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ARModelData
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ARModelData} ARModelData
     */
    ARModelData.fromObject = function fromObject(object) {
        if (object instanceof $root.ARModelData)
            return object;
        var message = new $root.ARModelData();
        if (object.meshModel != null)
            if (typeof object.meshModel === "string")
                $util.base64.decode(object.meshModel, message.meshModel = $util.newBuffer($util.base64.length(object.meshModel)), 0);
            else if (object.meshModel.length)
                message.meshModel = object.meshModel;
        if (object.textureModel != null)
            if (typeof object.textureModel === "string")
                $util.base64.decode(object.textureModel, message.textureModel = $util.newBuffer($util.base64.length(object.textureModel)), 0);
            else if (object.textureModel.length)
                message.textureModel = object.textureModel;
        if (object.preview != null)
            if (typeof object.preview === "string")
                $util.base64.decode(object.preview, message.preview = $util.newBuffer($util.base64.length(object.preview)), 0);
            else if (object.preview.length)
                message.preview = object.preview;
        if (object.meshBlob != null)
            if (typeof object.meshBlob === "string")
                $util.base64.decode(object.meshBlob, message.meshBlob = $util.newBuffer($util.base64.length(object.meshBlob)), 0);
            else if (object.meshBlob.length)
                message.meshBlob = object.meshBlob;
        if (object.textureBlob != null)
            if (typeof object.textureBlob === "string")
                $util.base64.decode(object.textureBlob, message.textureBlob = $util.newBuffer($util.base64.length(object.textureBlob)), 0);
            else if (object.textureBlob.length)
                message.textureBlob = object.textureBlob;
        return message;
    };

    /**
     * Creates a plain object from a ARModelData message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ARModelData
     * @static
     * @param {ARModelData} message ARModelData
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ARModelData.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            if (options.bytes === String)
                object.meshModel = "";
            else {
                object.meshModel = [];
                if (options.bytes !== Array)
                    object.meshModel = $util.newBuffer(object.meshModel);
            }
            if (options.bytes === String)
                object.textureModel = "";
            else {
                object.textureModel = [];
                if (options.bytes !== Array)
                    object.textureModel = $util.newBuffer(object.textureModel);
            }
            if (options.bytes === String)
                object.preview = "";
            else {
                object.preview = [];
                if (options.bytes !== Array)
                    object.preview = $util.newBuffer(object.preview);
            }
            if (options.bytes === String)
                object.meshBlob = "";
            else {
                object.meshBlob = [];
                if (options.bytes !== Array)
                    object.meshBlob = $util.newBuffer(object.meshBlob);
            }
            if (options.bytes === String)
                object.textureBlob = "";
            else {
                object.textureBlob = [];
                if (options.bytes !== Array)
                    object.textureBlob = $util.newBuffer(object.textureBlob);
            }
        }
        if (message.meshModel != null && message.hasOwnProperty("meshModel"))
            object.meshModel = options.bytes === String ? $util.base64.encode(message.meshModel, 0, message.meshModel.length) : options.bytes === Array ? Array.prototype.slice.call(message.meshModel) : message.meshModel;
        if (message.textureModel != null && message.hasOwnProperty("textureModel"))
            object.textureModel = options.bytes === String ? $util.base64.encode(message.textureModel, 0, message.textureModel.length) : options.bytes === Array ? Array.prototype.slice.call(message.textureModel) : message.textureModel;
        if (message.preview != null && message.hasOwnProperty("preview"))
            object.preview = options.bytes === String ? $util.base64.encode(message.preview, 0, message.preview.length) : options.bytes === Array ? Array.prototype.slice.call(message.preview) : message.preview;
        if (message.meshBlob != null && message.hasOwnProperty("meshBlob"))
            object.meshBlob = options.bytes === String ? $util.base64.encode(message.meshBlob, 0, message.meshBlob.length) : options.bytes === Array ? Array.prototype.slice.call(message.meshBlob) : message.meshBlob;
        if (message.textureBlob != null && message.hasOwnProperty("textureBlob"))
            object.textureBlob = options.bytes === String ? $util.base64.encode(message.textureBlob, 0, message.textureBlob.length) : options.bytes === Array ? Array.prototype.slice.call(message.textureBlob) : message.textureBlob;
        return object;
    };

    /**
     * Converts this ARModelData to JSON.
     * @function toJSON
     * @memberof ARModelData
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ARModelData.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ARModelData;
})();

$root.GetARModelReq = (function() {

    /**
     * Properties of a GetARModelReq.
     * @exports IGetARModelReq
     * @interface IGetARModelReq
     * @property {number|null} [bizuin] GetARModelReq bizuin
     * @property {string|null} [cosid] GetARModelReq cosid
     * @property {number|null} [modelType] GetARModelReq modelType
     * @property {number|null} [needData] GetARModelReq needData
     * @property {number|null} [useIntranet] GetARModelReq useIntranet
     * @property {number|null} [expireTime] GetARModelReq expireTime
     */

    /**
     * Constructs a new GetARModelReq.
     * @exports GetARModelReq
     * @classdesc Represents a GetARModelReq.
     * @implements IGetARModelReq
     * @constructor
     * @param {IGetARModelReq=} [properties] Properties to set
     */
    function GetARModelReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GetARModelReq bizuin.
     * @member {number} bizuin
     * @memberof GetARModelReq
     * @instance
     */
    GetARModelReq.prototype.bizuin = 0;

    /**
     * GetARModelReq cosid.
     * @member {string} cosid
     * @memberof GetARModelReq
     * @instance
     */
    GetARModelReq.prototype.cosid = "";

    /**
     * GetARModelReq modelType.
     * @member {number} modelType
     * @memberof GetARModelReq
     * @instance
     */
    GetARModelReq.prototype.modelType = 0;

    /**
     * GetARModelReq needData.
     * @member {number} needData
     * @memberof GetARModelReq
     * @instance
     */
    GetARModelReq.prototype.needData = 1;

    /**
     * GetARModelReq useIntranet.
     * @member {number} useIntranet
     * @memberof GetARModelReq
     * @instance
     */
    GetARModelReq.prototype.useIntranet = 0;

    /**
     * GetARModelReq expireTime.
     * @member {number} expireTime
     * @memberof GetARModelReq
     * @instance
     */
    GetARModelReq.prototype.expireTime = 0;

    /**
     * Creates a new GetARModelReq instance using the specified properties.
     * @function create
     * @memberof GetARModelReq
     * @static
     * @param {IGetARModelReq=} [properties] Properties to set
     * @returns {GetARModelReq} GetARModelReq instance
     */
    GetARModelReq.create = function create(properties) {
        return new GetARModelReq(properties);
    };

    /**
     * Encodes the specified GetARModelReq message. Does not implicitly {@link GetARModelReq.verify|verify} messages.
     * @function encode
     * @memberof GetARModelReq
     * @static
     * @param {IGetARModelReq} message GetARModelReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetARModelReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.bizuin != null && Object.hasOwnProperty.call(message, "bizuin"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.bizuin);
        if (message.cosid != null && Object.hasOwnProperty.call(message, "cosid"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.cosid);
        if (message.modelType != null && Object.hasOwnProperty.call(message, "modelType"))
            writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.modelType);
        if (message.needData != null && Object.hasOwnProperty.call(message, "needData"))
            writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.needData);
        if (message.useIntranet != null && Object.hasOwnProperty.call(message, "useIntranet"))
            writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.useIntranet);
        if (message.expireTime != null && Object.hasOwnProperty.call(message, "expireTime"))
            writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.expireTime);
        return writer;
    };

    /**
     * Encodes the specified GetARModelReq message, length delimited. Does not implicitly {@link GetARModelReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GetARModelReq
     * @static
     * @param {IGetARModelReq} message GetARModelReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetARModelReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GetARModelReq message from the specified reader or buffer.
     * @function decode
     * @memberof GetARModelReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GetARModelReq} GetARModelReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetARModelReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetARModelReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.bizuin = reader.uint32();
                break;
            case 2:
                message.cosid = reader.string();
                break;
            case 3:
                message.modelType = reader.uint32();
                break;
            case 4:
                message.needData = reader.uint32();
                break;
            case 5:
                message.useIntranet = reader.uint32();
                break;
            case 6:
                message.expireTime = reader.uint32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GetARModelReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GetARModelReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GetARModelReq} GetARModelReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetARModelReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GetARModelReq message.
     * @function verify
     * @memberof GetARModelReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GetARModelReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.bizuin != null && message.hasOwnProperty("bizuin"))
            if (!$util.isInteger(message.bizuin))
                return "bizuin: integer expected";
        if (message.cosid != null && message.hasOwnProperty("cosid"))
            if (!$util.isString(message.cosid))
                return "cosid: string expected";
        if (message.modelType != null && message.hasOwnProperty("modelType"))
            if (!$util.isInteger(message.modelType))
                return "modelType: integer expected";
        if (message.needData != null && message.hasOwnProperty("needData"))
            if (!$util.isInteger(message.needData))
                return "needData: integer expected";
        if (message.useIntranet != null && message.hasOwnProperty("useIntranet"))
            if (!$util.isInteger(message.useIntranet))
                return "useIntranet: integer expected";
        if (message.expireTime != null && message.hasOwnProperty("expireTime"))
            if (!$util.isInteger(message.expireTime))
                return "expireTime: integer expected";
        return null;
    };

    /**
     * Creates a GetARModelReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GetARModelReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GetARModelReq} GetARModelReq
     */
    GetARModelReq.fromObject = function fromObject(object) {
        if (object instanceof $root.GetARModelReq)
            return object;
        var message = new $root.GetARModelReq();
        if (object.bizuin != null)
            message.bizuin = object.bizuin >>> 0;
        if (object.cosid != null)
            message.cosid = String(object.cosid);
        if (object.modelType != null)
            message.modelType = object.modelType >>> 0;
        if (object.needData != null)
            message.needData = object.needData >>> 0;
        if (object.useIntranet != null)
            message.useIntranet = object.useIntranet >>> 0;
        if (object.expireTime != null)
            message.expireTime = object.expireTime >>> 0;
        return message;
    };

    /**
     * Creates a plain object from a GetARModelReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GetARModelReq
     * @static
     * @param {GetARModelReq} message GetARModelReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GetARModelReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.bizuin = 0;
            object.cosid = "";
            object.modelType = 0;
            object.needData = 1;
            object.useIntranet = 0;
            object.expireTime = 0;
        }
        if (message.bizuin != null && message.hasOwnProperty("bizuin"))
            object.bizuin = message.bizuin;
        if (message.cosid != null && message.hasOwnProperty("cosid"))
            object.cosid = message.cosid;
        if (message.modelType != null && message.hasOwnProperty("modelType"))
            object.modelType = message.modelType;
        if (message.needData != null && message.hasOwnProperty("needData"))
            object.needData = message.needData;
        if (message.useIntranet != null && message.hasOwnProperty("useIntranet"))
            object.useIntranet = message.useIntranet;
        if (message.expireTime != null && message.hasOwnProperty("expireTime"))
            object.expireTime = message.expireTime;
        return object;
    };

    /**
     * Converts this GetARModelReq to JSON.
     * @function toJSON
     * @memberof GetARModelReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GetARModelReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GetARModelReq;
})();

$root.GetARModelResp = (function() {

    /**
     * Properties of a GetARModelResp.
     * @exports IGetARModelResp
     * @interface IGetARModelResp
     * @property {IARModelData|null} [modelData] GetARModelResp modelData
     * @property {string|null} [url] GetARModelResp url
     * @property {string|null} [host] GetARModelResp host
     * @property {string|null} [errMsg] GetARModelResp errMsg
     */

    /**
     * Constructs a new GetARModelResp.
     * @exports GetARModelResp
     * @classdesc Represents a GetARModelResp.
     * @implements IGetARModelResp
     * @constructor
     * @param {IGetARModelResp=} [properties] Properties to set
     */
    function GetARModelResp(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GetARModelResp modelData.
     * @member {IARModelData|null|undefined} modelData
     * @memberof GetARModelResp
     * @instance
     */
    GetARModelResp.prototype.modelData = null;

    /**
     * GetARModelResp url.
     * @member {string} url
     * @memberof GetARModelResp
     * @instance
     */
    GetARModelResp.prototype.url = "";

    /**
     * GetARModelResp host.
     * @member {string} host
     * @memberof GetARModelResp
     * @instance
     */
    GetARModelResp.prototype.host = "";

    /**
     * GetARModelResp errMsg.
     * @member {string} errMsg
     * @memberof GetARModelResp
     * @instance
     */
    GetARModelResp.prototype.errMsg = "";

    /**
     * Creates a new GetARModelResp instance using the specified properties.
     * @function create
     * @memberof GetARModelResp
     * @static
     * @param {IGetARModelResp=} [properties] Properties to set
     * @returns {GetARModelResp} GetARModelResp instance
     */
    GetARModelResp.create = function create(properties) {
        return new GetARModelResp(properties);
    };

    /**
     * Encodes the specified GetARModelResp message. Does not implicitly {@link GetARModelResp.verify|verify} messages.
     * @function encode
     * @memberof GetARModelResp
     * @static
     * @param {IGetARModelResp} message GetARModelResp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetARModelResp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.modelData != null && Object.hasOwnProperty.call(message, "modelData"))
            $root.ARModelData.encode(message.modelData, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.url != null && Object.hasOwnProperty.call(message, "url"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.url);
        if (message.host != null && Object.hasOwnProperty.call(message, "host"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.host);
        if (message.errMsg != null && Object.hasOwnProperty.call(message, "errMsg"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.errMsg);
        return writer;
    };

    /**
     * Encodes the specified GetARModelResp message, length delimited. Does not implicitly {@link GetARModelResp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GetARModelResp
     * @static
     * @param {IGetARModelResp} message GetARModelResp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetARModelResp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GetARModelResp message from the specified reader or buffer.
     * @function decode
     * @memberof GetARModelResp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GetARModelResp} GetARModelResp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetARModelResp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetARModelResp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.modelData = $root.ARModelData.decode(reader, reader.uint32());
                break;
            case 2:
                message.url = reader.string();
                break;
            case 3:
                message.host = reader.string();
                break;
            case 4:
                message.errMsg = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GetARModelResp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GetARModelResp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GetARModelResp} GetARModelResp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetARModelResp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GetARModelResp message.
     * @function verify
     * @memberof GetARModelResp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GetARModelResp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.modelData != null && message.hasOwnProperty("modelData")) {
            var error = $root.ARModelData.verify(message.modelData);
            if (error)
                return "modelData." + error;
        }
        if (message.url != null && message.hasOwnProperty("url"))
            if (!$util.isString(message.url))
                return "url: string expected";
        if (message.host != null && message.hasOwnProperty("host"))
            if (!$util.isString(message.host))
                return "host: string expected";
        if (message.errMsg != null && message.hasOwnProperty("errMsg"))
            if (!$util.isString(message.errMsg))
                return "errMsg: string expected";
        return null;
    };

    /**
     * Creates a GetARModelResp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GetARModelResp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GetARModelResp} GetARModelResp
     */
    GetARModelResp.fromObject = function fromObject(object) {
        if (object instanceof $root.GetARModelResp)
            return object;
        var message = new $root.GetARModelResp();
        if (object.modelData != null) {
            if (typeof object.modelData !== "object")
                throw TypeError(".GetARModelResp.modelData: object expected");
            message.modelData = $root.ARModelData.fromObject(object.modelData);
        }
        if (object.url != null)
            message.url = String(object.url);
        if (object.host != null)
            message.host = String(object.host);
        if (object.errMsg != null)
            message.errMsg = String(object.errMsg);
        return message;
    };

    /**
     * Creates a plain object from a GetARModelResp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GetARModelResp
     * @static
     * @param {GetARModelResp} message GetARModelResp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GetARModelResp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.modelData = null;
            object.url = "";
            object.host = "";
            object.errMsg = "";
        }
        if (message.modelData != null && message.hasOwnProperty("modelData"))
            object.modelData = $root.ARModelData.toObject(message.modelData, options);
        if (message.url != null && message.hasOwnProperty("url"))
            object.url = message.url;
        if (message.host != null && message.hasOwnProperty("host"))
            object.host = message.host;
        if (message.errMsg != null && message.hasOwnProperty("errMsg"))
            object.errMsg = message.errMsg;
        return object;
    };

    /**
     * Converts this GetARModelResp to JSON.
     * @function toJSON
     * @memberof GetARModelResp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GetARModelResp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GetARModelResp;
})();

module.exports = $root;
