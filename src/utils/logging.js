import {debugMode} from "../data/constants/env_constants"

export function debug(...messages) {
  if (debugMode) console.log(...messages);
}

export function debugError(...messages) {
  if (debugMode) console.error(...messages);
}

export function info(...messages) {
  console.log(...messages);
}

export function error(...messages) {
  console.error(...messages);
}