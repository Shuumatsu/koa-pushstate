## koa-pushstate-utils

`yarn add koa-pushstate-utils`

This package constains some frequently used utils in koa-pushstate-middleware and koa-pushstate.

---

`errFirstCallbackToPromise`

It takes in a function and returns a funciton, the returned funciton's return value is a promise. 

The function's last param must be it's call back, and the callback's first param must be err (err first).

example:
```
const fn = (para1, para2, para3, callback) => {
  // ....
}

errFirstCallbackToPromise(fn)(1, 2, 3)
  // If callback has more than 2 params, value's an array.
  .then(value => console.log(value))
  .catch(err => console.error(err))
```

---

`ensureFile`

fs.access wrapped by `errFirstCallbackToPromise`

```
export const ensureFile = filepath => errFirstCallbackToPromise(fs.access)(filepath, fs.constants.R_OK)
```

---

`fileStats`

fs.stat wrapped by `errFirstCallbackToPromise`

```
export const fileStats = filepath => errFirstCallbackToPromise(fs.stat)(filepath)
```
