const HttpStatus = require("http-status-codes");
const MESSAGEUTIL = require("../utils/message-util");
// const ENCRYPTIONDECRYPTIONHANDLER = require("../../common/middlewares/encryptionDecryption-handler");
const ENCRYPTIONDECRYPTIONHANDLER = require("./encryptionDecryption-handler");
const { Console } = require("console");



class ResponseHandler {
  constructor(config) {
    this.ENCRYPTIONDECRYPTIONHANDLERINST = new ENCRYPTIONDECRYPTIONHANDLER(config);
    this.responseMiddleware = this.responseMiddleware.bind(this);
    this.callDecryptionMiddlware = this.callDecryptionMiddlware.bind(this);
  }

  async responseMiddleware(req, res, next) {
    res.sendResponse = async (status, data) => {
      // console.log("statusssssssss", status, "dataaaaaaaaaaaaaa", data);
      res.header("Content-Type", "application/json");
      res.statusCode = status;
      // let encrypted_data;
      // // let encrypted_data= data
      // console.log("----data to be encrypt", data)
      // if (data != null) {
      //   // console.log("hrer in the repose handler of reporting server ::::::::::::::::", data, data.message.hasOwnProperty("ciphertext"))
      //   if (!data.data?.hasOwnProperty("ciphertext")) {
      //     console.log("inside")
      //     if(req.headers && req.headers['ocp-apim-subscription-key']){
      //       encrypted_data = data;
      //     }else{
      //       encrypted_data= await this.ENCRYPTIONDECRYPTIONHANDLERINST.encryptionMiddleware(data) ;
      //     }
      //   }else{
      //     encrypted_data= data.data
      //   }
      //   console.log("reporting server :::::::::::::::: after:::::::", encrypted_data);
      // }
      return res.status(status).send(data);
    };

    //we are sending response from here beacause this response method is used in login screen (without Login token);
    res.imgSuccess = async (dataBuffer, contentType = 'application/octet-stream',tag, message = null, code = HttpStatus.OK) => {
      let dataToSend = {
        response: MESSAGEUTIL.response().SUCCESS,
        message: message,
        data: dataBuffer,
        error: {}
      };
      res.header("Content-Type", contentType);
      res.status(code).send({
       blob: dataToSend.data,
       tag:tag
      });
    };

    res.success = async (data = null, message = null, code = HttpStatus.OK) => {
      let dataToSend = {
        response: MESSAGEUTIL.response().SUCCESS,
        message: message,
        data: data,
        error: {}
      };
      res.sendResponse(code, dataToSend);
    };

    res.created = async (data = null, message = null) => {
      let dataToSend = {
        response: MESSAGEUTIL.response().SUCCESS,
        message: message,
        data: data,
        error: {}
      };
      res.sendResponse(HttpStatus.CREATED, dataToSend);
    };

    res.accepted = async (data = null, message = null) => {
      let dataToSend = {
        response: MESSAGEUTIL.response().SUCCESS,
        message: message,
        data: data,
        error: {}
      };
      res.sendResponse(HttpStatus.ACCEPTED, dataToSend);
    };

    res.badRequest = (message = "required parameters missing or invalid") => {
      res.sendResponse(HttpStatus.BAD_REQUEST, {
        response: MESSAGEUTIL.response().FAILED,
        error: {
          code: HttpStatus.BAD_REQUEST,
          name: "BAD_REQUEST",
          message: message,
        },
      });
    };

    res.unAuthorized = (message = "invalid authentication data") => {
      res.sendResponse(HttpStatus.UNAUTHORIZED, {
        response: MESSAGEUTIL.response().FAILED,
        error: {
          code: HttpStatus.UNAUTHORIZED,
          name: "UNAUTHORIZED",
          message: message,
        },
      });
    };

    res.forbidden = (message = "authentication required") => {
      res.sendResponse(HttpStatus.FORBIDDEN, {
        response: MESSAGEUTIL.response().FAILED,
        error: {
          code: HttpStatus.FORBIDDEN,
          name: "FORBIDDEN",
          message: message
        },
      });
    };

    res.conflict = (message = "conflict") => {
      res.sendResponse(HttpStatus.CONFLICT, {
        response: MESSAGEUTIL.response().FAILED,
        error: {
          code: HttpStatus.CONFLICT,
          name: "CONFLICT",
          message: message
        },
      });
    };

    res.unsportedMedia = (message = "unsported media type") => {
      res.sendResponse(HttpStatus.NOT_FOUND, {
        response: MESSAGEUTIL.response().FAILED,
        error: {
          code: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
          name: "UNSUPPORTED_MEDIA_TYPE",
          message: message
        },
      });
    };

    res.serverError = (message = MESSAGEUTIL.response().INTERNAL_SERVER_ERROR) => {
      res.sendResponse(HttpStatus.INTERNAL_SERVER_ERROR, {
        response: message,
        error: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          name: "INTERNAL_SERVER_ERROR",
          message: message
        },
      });
    };


    res.noContent = (message = "No Content found") => {
      res.sendResponse(HttpStatus.NO_CONTENT, {
        response: MESSAGEUTIL.response().FAILED,
        error: {
          code: HttpStatus.NO_CONTENT,
          name: "NO_CONTENT",
          message: message
        },

      });

    };

    res.notFound = (message = "requested resource not available") => {
      console.log(message);
      res.sendResponse(HttpStatus.NOT_FOUND, {
        response: MESSAGEUTIL.response().FAILED,
        error: {
          code: HttpStatus.NOT_FOUND,
          name: "NOT_FOUND",
          message: message
        },
      });
    };

    res.serviceUnavailable = (data = MESSAGEUTIL.response().SERVICE_UNAVAILABLE) => {
      res.sendResponse(HttpStatus.SERVICE_UNAVAILABLE, {
        response: MESSAGEUTIL.response().FAILED,
        error: {
          code: HttpStatus.SERVICE_UNAVAILABLE,
          name: "SERVICE_UNAVAILABLE",
          message: data,
        },
      });

    };
    next();
    return;
  }

  async callDecryptionMiddlware(data) {
    console.log("calling decryption Middleware :::::::::::::::::::::");
    const encrypted_data_by_encryption_middleware = await this.ENCRYPTIONDECRYPTIONHANDLERINST.encryptionMiddleware(data);
    return encrypted_data_by_encryption_middleware;
  }

}
module.exports = ResponseHandler;
