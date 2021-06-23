"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installDependencies = void 0;
const core_1 = require("@actions/core");
const exec_1 = require("@actions/exec");
const io_1 = require("@actions/io");
const quote_1 = __importDefault(require("quote"));
async function installDependencies() {
    core_1.info(`Installing dependencies with npm ci`);
    const npmPath = await io_1.which('npm', true);
    await exec_1.exec(quote_1.default(npmPath), ['ci']);
}
exports.installDependencies = installDependencies;
