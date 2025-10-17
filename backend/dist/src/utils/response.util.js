"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseUtil = void 0;
class ResponseUtil {
    static success(res, message, data, meta, status = 200) {
        res.status(status).json({ success: true, message, data, meta });
    }
    static error(res, message = "Server error", status = 500) {
        res.status(status).json({ success: false, message });
    }
}
exports.ResponseUtil = ResponseUtil;
