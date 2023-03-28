/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.GenWxaCloudTmpCodeReq = (function() {

    /**
     * Properties of a GenWxaCloudTmpCodeReq.
     * @exports IGenWxaCloudTmpCodeReq
     * @interface IGenWxaCloudTmpCodeReq
     * @property {number|null} [CloudPlatform] GenWxaCloudTmpCodeReq CloudPlatform
     * @property {number|null} [AppUin] GenWxaCloudTmpCodeReq AppUin
     * @property {number|null} [UserUin] GenWxaCloudTmpCodeReq UserUin
     */

    /**
     * Constructs a new GenWxaCloudTmpCodeReq.
     * @exports GenWxaCloudTmpCodeReq
     * @classdesc Represents a GenWxaCloudTmpCodeReq.
     * @implements IGenWxaCloudTmpCodeReq
     * @constructor
     * @param {IGenWxaCloudTmpCodeReq=} [properties] Properties to set
     */
    function GenWxaCloudTmpCodeReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GenWxaCloudTmpCodeReq CloudPlatform.
     * @member {number} CloudPlatform
     * @memberof GenWxaCloudTmpCodeReq
     * @instance
     */
    GenWxaCloudTmpCodeReq.prototype.CloudPlatform = 0;

    /**
     * GenWxaCloudTmpCodeReq AppUin.
     * @member {number} AppUin
     * @memberof GenWxaCloudTmpCodeReq
     * @instance
     */
    GenWxaCloudTmpCodeReq.prototype.AppUin = 0;

    /**
     * GenWxaCloudTmpCodeReq UserUin.
     * @member {number} UserUin
     * @memberof GenWxaCloudTmpCodeReq
     * @instance
     */
    GenWxaCloudTmpCodeReq.prototype.UserUin = 0;

    /**
     * Creates a new GenWxaCloudTmpCodeReq instance using the specified properties.
     * @function create
     * @memberof GenWxaCloudTmpCodeReq
     * @static
     * @param {IGenWxaCloudTmpCodeReq=} [properties] Properties to set
     * @returns {GenWxaCloudTmpCodeReq} GenWxaCloudTmpCodeReq instance
     */
    GenWxaCloudTmpCodeReq.create = function create(properties) {
        return new GenWxaCloudTmpCodeReq(properties);
    };

    /**
     * Encodes the specified GenWxaCloudTmpCodeReq message. Does not implicitly {@link GenWxaCloudTmpCodeReq.verify|verify} messages.
     * @function encode
     * @memberof GenWxaCloudTmpCodeReq
     * @static
     * @param {IGenWxaCloudTmpCodeReq} message GenWxaCloudTmpCodeReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GenWxaCloudTmpCodeReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.CloudPlatform != null && message.hasOwnProperty("CloudPlatform"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.CloudPlatform);
        if (message.AppUin != null && message.hasOwnProperty("AppUin"))
            writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.AppUin);
        if (message.UserUin != null && message.hasOwnProperty("UserUin"))
            writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.UserUin);
        return writer;
    };

    /**
     * Encodes the specified GenWxaCloudTmpCodeReq message, length delimited. Does not implicitly {@link GenWxaCloudTmpCodeReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GenWxaCloudTmpCodeReq
     * @static
     * @param {IGenWxaCloudTmpCodeReq} message GenWxaCloudTmpCodeReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GenWxaCloudTmpCodeReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GenWxaCloudTmpCodeReq message from the specified reader or buffer.
     * @function decode
     * @memberof GenWxaCloudTmpCodeReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GenWxaCloudTmpCodeReq} GenWxaCloudTmpCodeReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GenWxaCloudTmpCodeReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GenWxaCloudTmpCodeReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.CloudPlatform = reader.uint32();
                break;
            case 2:
                message.AppUin = reader.uint32();
                break;
            case 3:
                message.UserUin = reader.uint32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GenWxaCloudTmpCodeReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GenWxaCloudTmpCodeReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GenWxaCloudTmpCodeReq} GenWxaCloudTmpCodeReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GenWxaCloudTmpCodeReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GenWxaCloudTmpCodeReq message.
     * @function verify
     * @memberof GenWxaCloudTmpCodeReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GenWxaCloudTmpCodeReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.CloudPlatform != null && message.hasOwnProperty("CloudPlatform"))
            if (!$util.isInteger(message.CloudPlatform))
                return "CloudPlatform: integer expected";
        if (message.AppUin != null && message.hasOwnProperty("AppUin"))
            if (!$util.isInteger(message.AppUin))
                return "AppUin: integer expected";
        if (message.UserUin != null && message.hasOwnProperty("UserUin"))
            if (!$util.isInteger(message.UserUin))
                return "UserUin: integer expected";
        return null;
    };

    /**
     * Creates a GenWxaCloudTmpCodeReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GenWxaCloudTmpCodeReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GenWxaCloudTmpCodeReq} GenWxaCloudTmpCodeReq
     */
    GenWxaCloudTmpCodeReq.fromObject = function fromObject(object) {
        if (object instanceof $root.GenWxaCloudTmpCodeReq)
            return object;
        var message = new $root.GenWxaCloudTmpCodeReq();
        if (object.CloudPlatform != null)
            message.CloudPlatform = object.CloudPlatform >>> 0;
        if (object.AppUin != null)
            message.AppUin = object.AppUin >>> 0;
        if (object.UserUin != null)
            message.UserUin = object.UserUin >>> 0;
        return message;
    };

    /**
     * Creates a plain object from a GenWxaCloudTmpCodeReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GenWxaCloudTmpCodeReq
     * @static
     * @param {GenWxaCloudTmpCodeReq} message GenWxaCloudTmpCodeReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GenWxaCloudTmpCodeReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.CloudPlatform = 0;
            object.AppUin = 0;
            object.UserUin = 0;
        }
        if (message.CloudPlatform != null && message.hasOwnProperty("CloudPlatform"))
            object.CloudPlatform = message.CloudPlatform;
        if (message.AppUin != null && message.hasOwnProperty("AppUin"))
            object.AppUin = message.AppUin;
        if (message.UserUin != null && message.hasOwnProperty("UserUin"))
            object.UserUin = message.UserUin;
        return object;
    };

    /**
     * Converts this GenWxaCloudTmpCodeReq to JSON.
     * @function toJSON
     * @memberof GenWxaCloudTmpCodeReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GenWxaCloudTmpCodeReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GenWxaCloudTmpCodeReq;
})();

$root.GenWxaCloudTmpCodeResp = (function() {

    /**
     * Properties of a GenWxaCloudTmpCodeResp.
     * @exports IGenWxaCloudTmpCodeResp
     * @interface IGenWxaCloudTmpCodeResp
     * @property {string|null} [TmpCode] GenWxaCloudTmpCodeResp TmpCode
     */

    /**
     * Constructs a new GenWxaCloudTmpCodeResp.
     * @exports GenWxaCloudTmpCodeResp
     * @classdesc Represents a GenWxaCloudTmpCodeResp.
     * @implements IGenWxaCloudTmpCodeResp
     * @constructor
     * @param {IGenWxaCloudTmpCodeResp=} [properties] Properties to set
     */
    function GenWxaCloudTmpCodeResp(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GenWxaCloudTmpCodeResp TmpCode.
     * @member {string} TmpCode
     * @memberof GenWxaCloudTmpCodeResp
     * @instance
     */
    GenWxaCloudTmpCodeResp.prototype.TmpCode = "";

    /**
     * Creates a new GenWxaCloudTmpCodeResp instance using the specified properties.
     * @function create
     * @memberof GenWxaCloudTmpCodeResp
     * @static
     * @param {IGenWxaCloudTmpCodeResp=} [properties] Properties to set
     * @returns {GenWxaCloudTmpCodeResp} GenWxaCloudTmpCodeResp instance
     */
    GenWxaCloudTmpCodeResp.create = function create(properties) {
        return new GenWxaCloudTmpCodeResp(properties);
    };

    /**
     * Encodes the specified GenWxaCloudTmpCodeResp message. Does not implicitly {@link GenWxaCloudTmpCodeResp.verify|verify} messages.
     * @function encode
     * @memberof GenWxaCloudTmpCodeResp
     * @static
     * @param {IGenWxaCloudTmpCodeResp} message GenWxaCloudTmpCodeResp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GenWxaCloudTmpCodeResp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.TmpCode != null && message.hasOwnProperty("TmpCode"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.TmpCode);
        return writer;
    };

    /**
     * Encodes the specified GenWxaCloudTmpCodeResp message, length delimited. Does not implicitly {@link GenWxaCloudTmpCodeResp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GenWxaCloudTmpCodeResp
     * @static
     * @param {IGenWxaCloudTmpCodeResp} message GenWxaCloudTmpCodeResp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GenWxaCloudTmpCodeResp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GenWxaCloudTmpCodeResp message from the specified reader or buffer.
     * @function decode
     * @memberof GenWxaCloudTmpCodeResp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GenWxaCloudTmpCodeResp} GenWxaCloudTmpCodeResp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GenWxaCloudTmpCodeResp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GenWxaCloudTmpCodeResp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.TmpCode = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GenWxaCloudTmpCodeResp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GenWxaCloudTmpCodeResp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GenWxaCloudTmpCodeResp} GenWxaCloudTmpCodeResp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GenWxaCloudTmpCodeResp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GenWxaCloudTmpCodeResp message.
     * @function verify
     * @memberof GenWxaCloudTmpCodeResp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GenWxaCloudTmpCodeResp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.TmpCode != null && message.hasOwnProperty("TmpCode"))
            if (!$util.isString(message.TmpCode))
                return "TmpCode: string expected";
        return null;
    };

    /**
     * Creates a GenWxaCloudTmpCodeResp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GenWxaCloudTmpCodeResp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GenWxaCloudTmpCodeResp} GenWxaCloudTmpCodeResp
     */
    GenWxaCloudTmpCodeResp.fromObject = function fromObject(object) {
        if (object instanceof $root.GenWxaCloudTmpCodeResp)
            return object;
        var message = new $root.GenWxaCloudTmpCodeResp();
        if (object.TmpCode != null)
            message.TmpCode = String(object.TmpCode);
        return message;
    };

    /**
     * Creates a plain object from a GenWxaCloudTmpCodeResp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GenWxaCloudTmpCodeResp
     * @static
     * @param {GenWxaCloudTmpCodeResp} message GenWxaCloudTmpCodeResp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GenWxaCloudTmpCodeResp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.TmpCode = "";
        if (message.TmpCode != null && message.hasOwnProperty("TmpCode"))
            object.TmpCode = message.TmpCode;
        return object;
    };

    /**
     * Converts this GenWxaCloudTmpCodeResp to JSON.
     * @function toJSON
     * @memberof GenWxaCloudTmpCodeResp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GenWxaCloudTmpCodeResp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GenWxaCloudTmpCodeResp;
})();

$root.GetWeAppMemberByUserReq = (function() {

    /**
     * Properties of a GetWeAppMemberByUserReq.
     * @exports IGetWeAppMemberByUserReq
     * @interface IGetWeAppMemberByUserReq
     * @property {number|null} [useruin] GetWeAppMemberByUserReq useruin
     * @property {number|null} [type] GetWeAppMemberByUserReq type
     * @property {number|null} [status] GetWeAppMemberByUserReq status
     */

    /**
     * Constructs a new GetWeAppMemberByUserReq.
     * @exports GetWeAppMemberByUserReq
     * @classdesc Represents a GetWeAppMemberByUserReq.
     * @implements IGetWeAppMemberByUserReq
     * @constructor
     * @param {IGetWeAppMemberByUserReq=} [properties] Properties to set
     */
    function GetWeAppMemberByUserReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GetWeAppMemberByUserReq useruin.
     * @member {number} useruin
     * @memberof GetWeAppMemberByUserReq
     * @instance
     */
    GetWeAppMemberByUserReq.prototype.useruin = 0;

    /**
     * GetWeAppMemberByUserReq type.
     * @member {number} type
     * @memberof GetWeAppMemberByUserReq
     * @instance
     */
    GetWeAppMemberByUserReq.prototype.type = 0;

    /**
     * GetWeAppMemberByUserReq status.
     * @member {number} status
     * @memberof GetWeAppMemberByUserReq
     * @instance
     */
    GetWeAppMemberByUserReq.prototype.status = 0;

    /**
     * Creates a new GetWeAppMemberByUserReq instance using the specified properties.
     * @function create
     * @memberof GetWeAppMemberByUserReq
     * @static
     * @param {IGetWeAppMemberByUserReq=} [properties] Properties to set
     * @returns {GetWeAppMemberByUserReq} GetWeAppMemberByUserReq instance
     */
    GetWeAppMemberByUserReq.create = function create(properties) {
        return new GetWeAppMemberByUserReq(properties);
    };

    /**
     * Encodes the specified GetWeAppMemberByUserReq message. Does not implicitly {@link GetWeAppMemberByUserReq.verify|verify} messages.
     * @function encode
     * @memberof GetWeAppMemberByUserReq
     * @static
     * @param {IGetWeAppMemberByUserReq} message GetWeAppMemberByUserReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetWeAppMemberByUserReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.useruin != null && message.hasOwnProperty("useruin"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.useruin);
        if (message.type != null && message.hasOwnProperty("type"))
            writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.type);
        if (message.status != null && message.hasOwnProperty("status"))
            writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.status);
        return writer;
    };

    /**
     * Encodes the specified GetWeAppMemberByUserReq message, length delimited. Does not implicitly {@link GetWeAppMemberByUserReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GetWeAppMemberByUserReq
     * @static
     * @param {IGetWeAppMemberByUserReq} message GetWeAppMemberByUserReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GetWeAppMemberByUserReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GetWeAppMemberByUserReq message from the specified reader or buffer.
     * @function decode
     * @memberof GetWeAppMemberByUserReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GetWeAppMemberByUserReq} GetWeAppMemberByUserReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetWeAppMemberByUserReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetWeAppMemberByUserReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.useruin = reader.uint32();
                break;
            case 2:
                message.type = reader.uint32();
                break;
            case 3:
                message.status = reader.uint32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GetWeAppMemberByUserReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GetWeAppMemberByUserReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GetWeAppMemberByUserReq} GetWeAppMemberByUserReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GetWeAppMemberByUserReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GetWeAppMemberByUserReq message.
     * @function verify
     * @memberof GetWeAppMemberByUserReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GetWeAppMemberByUserReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.useruin != null && message.hasOwnProperty("useruin"))
            if (!$util.isInteger(message.useruin))
                return "useruin: integer expected";
        if (message.type != null && message.hasOwnProperty("type"))
            if (!$util.isInteger(message.type))
                return "type: integer expected";
        if (message.status != null && message.hasOwnProperty("status"))
            if (!$util.isInteger(message.status))
                return "status: integer expected";
        return null;
    };

    /**
     * Creates a GetWeAppMemberByUserReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GetWeAppMemberByUserReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GetWeAppMemberByUserReq} GetWeAppMemberByUserReq
     */
    GetWeAppMemberByUserReq.fromObject = function fromObject(object) {
        if (object instanceof $root.GetWeAppMemberByUserReq)
            return object;
        var message = new $root.GetWeAppMemberByUserReq();
        if (object.useruin != null)
            message.useruin = object.useruin >>> 0;
        if (object.type != null)
            message.type = object.type >>> 0;
        if (object.status != null)
            message.status = object.status >>> 0;
        return message;
    };

    /**
     * Creates a plain object from a GetWeAppMemberByUserReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GetWeAppMemberByUserReq
     * @static
     * @param {GetWeAppMemberByUserReq} message GetWeAppMemberByUserReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GetWeAppMemberByUserReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.useruin = 0;
            object.type = 0;
            object.status = 0;
        }
        if (message.useruin != null && message.hasOwnProperty("useruin"))
            object.useruin = message.useruin;
        if (message.type != null && message.hasOwnProperty("type"))
            object.type = message.type;
        if (message.status != null && message.hasOwnProperty("status"))
            object.status = message.status;
        return object;
    };

    /**
     * Converts this GetWeAppMemberByUserReq to JSON.
     * @function toJSON
     * @memberof GetWeAppMemberByUserReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GetWeAppMemberByUserReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GetWeAppMemberByUserReq;
})();

$root.WeAppMemberInfo = (function() {

    /**
     * Properties of a WeAppMemberInfo.
     * @exports IWeAppMemberInfo
     * @interface IWeAppMemberInfo
     * @property {number|null} [type] WeAppMemberInfo type
     * @property {number|null} [weappuin] WeAppMemberInfo weappuin
     * @property {number|null} [useruin] WeAppMemberInfo useruin
     * @property {number|null} [status] WeAppMemberInfo status
     * @property {number|null} [createtime] WeAppMemberInfo createtime
     * @property {number|null} [updatetime] WeAppMemberInfo updatetime
     * @property {string|null} [ticket] WeAppMemberInfo ticket
     */

    /**
     * Constructs a new WeAppMemberInfo.
     * @exports WeAppMemberInfo
     * @classdesc Represents a WeAppMemberInfo.
     * @implements IWeAppMemberInfo
     * @constructor
     * @param {IWeAppMemberInfo=} [properties] Properties to set
     */
    function WeAppMemberInfo(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * WeAppMemberInfo type.
     * @member {number} type
     * @memberof WeAppMemberInfo
     * @instance
     */
    WeAppMemberInfo.prototype.type = 0;

    /**
     * WeAppMemberInfo weappuin.
     * @member {number} weappuin
     * @memberof WeAppMemberInfo
     * @instance
     */
    WeAppMemberInfo.prototype.weappuin = 0;

    /**
     * WeAppMemberInfo useruin.
     * @member {number} useruin
     * @memberof WeAppMemberInfo
     * @instance
     */
    WeAppMemberInfo.prototype.useruin = 0;

    /**
     * WeAppMemberInfo status.
     * @member {number} status
     * @memberof WeAppMemberInfo
     * @instance
     */
    WeAppMemberInfo.prototype.status = 0;

    /**
     * WeAppMemberInfo createtime.
     * @member {number} createtime
     * @memberof WeAppMemberInfo
     * @instance
     */
    WeAppMemberInfo.prototype.createtime = 0;

    /**
     * WeAppMemberInfo updatetime.
     * @member {number} updatetime
     * @memberof WeAppMemberInfo
     * @instance
     */
    WeAppMemberInfo.prototype.updatetime = 0;

    /**
     * WeAppMemberInfo ticket.
     * @member {string} ticket
     * @memberof WeAppMemberInfo
     * @instance
     */
    WeAppMemberInfo.prototype.ticket = "";

    /**
     * Creates a new WeAppMemberInfo instance using the specified properties.
     * @function create
     * @memberof WeAppMemberInfo
     * @static
     * @param {IWeAppMemberInfo=} [properties] Properties to set
     * @returns {WeAppMemberInfo} WeAppMemberInfo instance
     */
    WeAppMemberInfo.create = function create(properties) {
        return new WeAppMemberInfo(properties);
    };

    /**
     * Encodes the specified WeAppMemberInfo message. Does not implicitly {@link WeAppMemberInfo.verify|verify} messages.
     * @function encode
     * @memberof WeAppMemberInfo
     * @static
     * @param {IWeAppMemberInfo} message WeAppMemberInfo message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    WeAppMemberInfo.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.type != null && message.hasOwnProperty("type"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.type);
        if (message.weappuin != null && message.hasOwnProperty("weappuin"))
            writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.weappuin);
        if (message.useruin != null && message.hasOwnProperty("useruin"))
            writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.useruin);
        if (message.status != null && message.hasOwnProperty("status"))
            writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.status);
        if (message.createtime != null && message.hasOwnProperty("createtime"))
            writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.createtime);
        if (message.updatetime != null && message.hasOwnProperty("updatetime"))
            writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.updatetime);
        if (message.ticket != null && message.hasOwnProperty("ticket"))
            writer.uint32(/* id 7, wireType 2 =*/58).string(message.ticket);
        return writer;
    };

    /**
     * Encodes the specified WeAppMemberInfo message, length delimited. Does not implicitly {@link WeAppMemberInfo.verify|verify} messages.
     * @function encodeDelimited
     * @memberof WeAppMemberInfo
     * @static
     * @param {IWeAppMemberInfo} message WeAppMemberInfo message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    WeAppMemberInfo.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a WeAppMemberInfo message from the specified reader or buffer.
     * @function decode
     * @memberof WeAppMemberInfo
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {WeAppMemberInfo} WeAppMemberInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    WeAppMemberInfo.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WeAppMemberInfo();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.type = reader.uint32();
                break;
            case 2:
                message.weappuin = reader.uint32();
                break;
            case 3:
                message.useruin = reader.uint32();
                break;
            case 4:
                message.status = reader.uint32();
                break;
            case 5:
                message.createtime = reader.uint32();
                break;
            case 6:
                message.updatetime = reader.uint32();
                break;
            case 7:
                message.ticket = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a WeAppMemberInfo message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof WeAppMemberInfo
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {WeAppMemberInfo} WeAppMemberInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    WeAppMemberInfo.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a WeAppMemberInfo message.
     * @function verify
     * @memberof WeAppMemberInfo
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    WeAppMemberInfo.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.type != null && message.hasOwnProperty("type"))
            if (!$util.isInteger(message.type))
                return "type: integer expected";
        if (message.weappuin != null && message.hasOwnProperty("weappuin"))
            if (!$util.isInteger(message.weappuin))
                return "weappuin: integer expected";
        if (message.useruin != null && message.hasOwnProperty("useruin"))
            if (!$util.isInteger(message.useruin))
                return "useruin: integer expected";
        if (message.status != null && message.hasOwnProperty("status"))
            if (!$util.isInteger(message.status))
                return "status: integer expected";
        if (message.createtime != null && message.hasOwnProperty("createtime"))
            if (!$util.isInteger(message.createtime))
                return "createtime: integer expected";
        if (message.updatetime != null && message.hasOwnProperty("updatetime"))
            if (!$util.isInteger(message.updatetime))
                return "updatetime: integer expected";
        if (message.ticket != null && message.hasOwnProperty("ticket"))
            if (!$util.isString(message.ticket))
                return "ticket: string expected";
        return null;
    };

    /**
     * Creates a WeAppMemberInfo message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof WeAppMemberInfo
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {WeAppMemberInfo} WeAppMemberInfo
     */
    WeAppMemberInfo.fromObject = function fromObject(object) {
        if (object instanceof $root.WeAppMemberInfo)
            return object;
        var message = new $root.WeAppMemberInfo();
        if (object.type != null)
            message.type = object.type >>> 0;
        if (object.weappuin != null)
            message.weappuin = object.weappuin >>> 0;
        if (object.useruin != null)
            message.useruin = object.useruin >>> 0;
        if (object.status != null)
            message.status = object.status >>> 0;
        if (object.createtime != null)
            message.createtime = object.createtime >>> 0;
        if (object.updatetime != null)
            message.updatetime = object.updatetime >>> 0;
        if (object.ticket != null)
            message.ticket = String(object.ticket);
        return message;
    };

    /**
     * Creates a plain object from a WeAppMemberInfo message. Also converts values to other types if specified.
     * @function toObject
     * @memberof WeAppMemberInfo
     * @static
     * @param {WeAppMemberInfo} message WeAppMemberInfo
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    WeAppMemberInfo.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.type = 0;
            object.weappuin = 0;
            object.useruin = 0;
            object.status = 0;
            object.createtime = 0;
            object.updatetime = 0;
            object.ticket = "";
        }
        if (message.type != null && message.hasOwnProperty("type"))
            object.type = message.type;
        if (message.weappuin != null && message.hasOwnProperty("weappuin"))
            object.weappuin = message.weappuin;
        if (message.useruin != null && message.hasOwnProperty("useruin"))
            object.useruin = message.useruin;
        if (message.status != null && message.hasOwnProperty("status"))
            object.status = message.status;
        if (message.createtime != null && message.hasOwnProperty("createtime"))
            object.createtime = message.createtime;
        if (message.updatetime != null && message.hasOwnProperty("updatetime"))
            object.updatetime = message.updatetime;
        if (message.ticket != null && message.hasOwnProperty("ticket"))
            object.ticket = message.ticket;
        return object;
    };

    /**
     * Converts this WeAppMemberInfo to JSON.
     * @function toJSON
     * @memberof WeAppMemberInfo
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    WeAppMemberInfo.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return WeAppMemberInfo;
})();

$root.WeAppMemberInfoList = (function() {

    /**
     * Properties of a WeAppMemberInfoList.
     * @exports IWeAppMemberInfoList
     * @interface IWeAppMemberInfoList
     * @property {Array.<IWeAppMemberInfo>|null} [infos] WeAppMemberInfoList infos
     */

    /**
     * Constructs a new WeAppMemberInfoList.
     * @exports WeAppMemberInfoList
     * @classdesc Represents a WeAppMemberInfoList.
     * @implements IWeAppMemberInfoList
     * @constructor
     * @param {IWeAppMemberInfoList=} [properties] Properties to set
     */
    function WeAppMemberInfoList(properties) {
        this.infos = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * WeAppMemberInfoList infos.
     * @member {Array.<IWeAppMemberInfo>} infos
     * @memberof WeAppMemberInfoList
     * @instance
     */
    WeAppMemberInfoList.prototype.infos = $util.emptyArray;

    /**
     * Creates a new WeAppMemberInfoList instance using the specified properties.
     * @function create
     * @memberof WeAppMemberInfoList
     * @static
     * @param {IWeAppMemberInfoList=} [properties] Properties to set
     * @returns {WeAppMemberInfoList} WeAppMemberInfoList instance
     */
    WeAppMemberInfoList.create = function create(properties) {
        return new WeAppMemberInfoList(properties);
    };

    /**
     * Encodes the specified WeAppMemberInfoList message. Does not implicitly {@link WeAppMemberInfoList.verify|verify} messages.
     * @function encode
     * @memberof WeAppMemberInfoList
     * @static
     * @param {IWeAppMemberInfoList} message WeAppMemberInfoList message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    WeAppMemberInfoList.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.infos != null && message.infos.length)
            for (var i = 0; i < message.infos.length; ++i)
                $root.WeAppMemberInfo.encode(message.infos[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified WeAppMemberInfoList message, length delimited. Does not implicitly {@link WeAppMemberInfoList.verify|verify} messages.
     * @function encodeDelimited
     * @memberof WeAppMemberInfoList
     * @static
     * @param {IWeAppMemberInfoList} message WeAppMemberInfoList message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    WeAppMemberInfoList.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a WeAppMemberInfoList message from the specified reader or buffer.
     * @function decode
     * @memberof WeAppMemberInfoList
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {WeAppMemberInfoList} WeAppMemberInfoList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    WeAppMemberInfoList.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WeAppMemberInfoList();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.infos && message.infos.length))
                    message.infos = [];
                message.infos.push($root.WeAppMemberInfo.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a WeAppMemberInfoList message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof WeAppMemberInfoList
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {WeAppMemberInfoList} WeAppMemberInfoList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    WeAppMemberInfoList.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a WeAppMemberInfoList message.
     * @function verify
     * @memberof WeAppMemberInfoList
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    WeAppMemberInfoList.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.infos != null && message.hasOwnProperty("infos")) {
            if (!Array.isArray(message.infos))
                return "infos: array expected";
            for (var i = 0; i < message.infos.length; ++i) {
                var error = $root.WeAppMemberInfo.verify(message.infos[i]);
                if (error)
                    return "infos." + error;
            }
        }
        return null;
    };

    /**
     * Creates a WeAppMemberInfoList message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof WeAppMemberInfoList
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {WeAppMemberInfoList} WeAppMemberInfoList
     */
    WeAppMemberInfoList.fromObject = function fromObject(object) {
        if (object instanceof $root.WeAppMemberInfoList)
            return object;
        var message = new $root.WeAppMemberInfoList();
        if (object.infos) {
            if (!Array.isArray(object.infos))
                throw TypeError(".WeAppMemberInfoList.infos: array expected");
            message.infos = [];
            for (var i = 0; i < object.infos.length; ++i) {
                if (typeof object.infos[i] !== "object")
                    throw TypeError(".WeAppMemberInfoList.infos: object expected");
                message.infos[i] = $root.WeAppMemberInfo.fromObject(object.infos[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a WeAppMemberInfoList message. Also converts values to other types if specified.
     * @function toObject
     * @memberof WeAppMemberInfoList
     * @static
     * @param {WeAppMemberInfoList} message WeAppMemberInfoList
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    WeAppMemberInfoList.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.infos = [];
        if (message.infos && message.infos.length) {
            object.infos = [];
            for (var j = 0; j < message.infos.length; ++j)
                object.infos[j] = $root.WeAppMemberInfo.toObject(message.infos[j], options);
        }
        return object;
    };

    /**
     * Converts this WeAppMemberInfoList to JSON.
     * @function toJSON
     * @memberof WeAppMemberInfoList
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    WeAppMemberInfoList.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return WeAppMemberInfoList;
})();

module.exports = $root;
