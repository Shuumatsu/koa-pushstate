import fs from 'fs'
import { partialRight } from 'lodash/fp'

export const errFirstCallbackToPromise = fn => {
  return (...args) => {
    return new Promise((resolve, reject) => {
      const callback = (err, ...values) => {
        if (err) {
          reject(err)
          return
        } 

        values.length > 1 ? resolve(values) : resolve(...values)
      }

      partialRight(fn)([callback])(...args)
    })
  }
}

export const ensureNoSlash = path => {
  path.startsWith('/') && (path = path.slice(1))
  path.endsWith('/') && (path = path.slice(0, -1))

  return path
}

export const ensureFile = filepath => errFirstCallbackToPromise(fs.access)(filepath, fs.constants.R_OK)

export const fileStats = filepath => errFirstCallbackToPromise(fs.stat)(filepath)
