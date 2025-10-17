"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorUtil = void 0;
class ErrorUtil extends Error {
    constructor(message, status = 500) {
        super(message);
        this.status = status;
    }
}
exports.ErrorUtil = ErrorUtil;
