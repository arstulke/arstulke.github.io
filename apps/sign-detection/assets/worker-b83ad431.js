(function() {
  "use strict";
  const shimmedSelf = self;
  shimmedSelf.document = { baseURI: location.origin };
  class CompletablePromise {
    constructor() {
      Object.defineProperty(this, "status", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "waiting"
      });
      Object.defineProperty(this, "resolve", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: () => {
          throw new Error("CompletablePromise is not yet initialized");
        }
      });
      Object.defineProperty(this, "reject", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: () => {
          throw new Error("CompletablePromise is not yet initialized");
        }
      });
      Object.defineProperty(this, "promise", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    }
    complete(t) {
      if (this.status !== "waiting")
        return;
      this.status = "resolved";
      this.resolve(t);
    }
    throw(err) {
      if (this.status !== "waiting")
        return;
      this.status = "rejected";
      this.reject(err);
    }
    get isWaiting() {
      return this.status === "waiting";
    }
    get isResolved() {
      return this.status === "resolved";
    }
    get isRejected() {
      return this.status === "rejected";
    }
  }
  function exposeSingleFunction(fn, name = "default") {
    exposeMultipleFunctions({ [name]: fn });
  }
  function exposeMultipleFunctions(fnObj) {
    new CompletablePromise();
    function sendMessage(msg) {
      self.postMessage(msg);
    }
    self.onmessage = async (event) => {
      const { data: message } = event;
      switch (message.type) {
        case "RUN_TASK":
          const taskPromise = runTask(message, fnObj);
          const abortCompletable = new CompletablePromise();
          const resultMessage = await Promise.race([
            taskPromise,
            abortCompletable.promise
          ]);
          if (resultMessage) {
            sendMessage(resultMessage);
          }
          sendMessage({ type: "IDLE" });
          break;
      }
    };
    sendMessage({ type: "STARTED" });
  }
  async function runTask(message, fnObj) {
    const { taskName, taskInput } = message;
    const taskFn = fnObj[taskName];
    try {
      const taskOutput = await taskFn(taskInput);
      return { type: "TASK_RESULT", taskResultType: "success", taskOutput };
    } catch (err) {
      return { type: "TASK_RESULT", taskResultType: "error", taskOutput: err };
    }
  }
  const dntGlobals = {};
  const dntGlobalThis = createMergeProxy(globalThis, dntGlobals);
  function createMergeProxy(baseObj, extObj) {
    return new Proxy(baseObj, {
      get(_target, prop, _receiver) {
        if (prop in extObj) {
          return extObj[prop];
        } else {
          return baseObj[prop];
        }
      },
      set(_target, prop, value) {
        if (prop in extObj) {
          delete extObj[prop];
        }
        baseObj[prop] = value;
        return true;
      },
      deleteProperty(_target, prop) {
        let success = false;
        if (prop in extObj) {
          delete extObj[prop];
          success = true;
        }
        if (prop in baseObj) {
          delete baseObj[prop];
          success = true;
        }
        return success;
      },
      ownKeys(_target) {
        const baseKeys = Reflect.ownKeys(baseObj);
        const extKeys = Reflect.ownKeys(extObj);
        const extKeysSet = new Set(extKeys);
        return [...baseKeys.filter((k) => !extKeysSet.has(k)), ...extKeys];
      },
      defineProperty(_target, prop, desc) {
        if (prop in extObj) {
          delete extObj[prop];
        }
        Reflect.defineProperty(baseObj, prop, desc);
        return true;
      },
      getOwnPropertyDescriptor(_target, prop) {
        if (prop in extObj) {
          return Reflect.getOwnPropertyDescriptor(extObj, prop);
        } else {
          return Reflect.getOwnPropertyDescriptor(baseObj, prop);
        }
      },
      has(_target, prop) {
        return prop in extObj || prop in baseObj;
      }
    });
  }
  var Module = (() => {
    var _scriptDir = document.currentScript && document.currentScript.src || new URL("assets/worker-b83ad431.js", document.baseURI).href;
    return function(Module2 = {}) {
      var Module2 = typeof Module2 != "undefined" ? Module2 : {};
      var readyPromiseResolve, readyPromiseReject;
      Module2["ready"] = new Promise(function(resolve, reject) {
        readyPromiseResolve = resolve;
        readyPromiseReject = reject;
      });
      ["___getTypeName", "__embind_initialize_bindings", "_fflush", "onRuntimeInitialized"].forEach((prop) => {
        if (!Object.getOwnPropertyDescriptor(Module2["ready"], prop)) {
          Object.defineProperty(Module2["ready"], prop, {
            get: () => abort("You are getting " + prop + " on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js"),
            set: () => abort("You are setting " + prop + " on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")
          });
        }
      });
      var moduleOverrides = Object.assign({}, Module2);
      var ENVIRONMENT_IS_WEB = true;
      var ENVIRONMENT_IS_WORKER = false;
      var ENVIRONMENT_IS_NODE = false;
      var ENVIRONMENT_IS_SHELL = false;
      if (Module2["ENVIRONMENT"]) {
        throw new Error("Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)");
      }
      var scriptDirectory = "";
      function locateFile(path) {
        if (Module2["locateFile"]) {
          return Module2["locateFile"](path, scriptDirectory);
        }
        return scriptDirectory + path;
      }
      var readBinary;
      {
        if (typeof document != "undefined" && document.currentScript) {
          scriptDirectory = document.currentScript.src;
        }
        if (_scriptDir) {
          scriptDirectory = _scriptDir;
        }
        if (scriptDirectory.indexOf("blob:") !== 0) {
          scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
        } else {
          scriptDirectory = "";
        }
        if (!(typeof dntGlobalThis == "object" || typeof importScripts == "function"))
          throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
      }
      var out = Module2["print"] || console.log.bind(console);
      var err = Module2["printErr"] || console.warn.bind(console);
      Object.assign(Module2, moduleOverrides);
      moduleOverrides = null;
      checkIncomingModuleAPI();
      if (Module2["arguments"])
        Module2["arguments"];
      legacyModuleProp("arguments", "arguments_");
      if (Module2["thisProgram"])
        Module2["thisProgram"];
      legacyModuleProp("thisProgram", "thisProgram");
      if (Module2["quit"])
        Module2["quit"];
      legacyModuleProp("quit", "quit_");
      assert(typeof Module2["memoryInitializerPrefixURL"] == "undefined", "Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead");
      assert(typeof Module2["pthreadMainPrefixURL"] == "undefined", "Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead");
      assert(typeof Module2["cdInitializerPrefixURL"] == "undefined", "Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead");
      assert(typeof Module2["filePackagePrefixURL"] == "undefined", "Module.filePackagePrefixURL option was removed, use Module.locateFile instead");
      assert(typeof Module2["read"] == "undefined", "Module.read option was removed (modify read_ in JS)");
      assert(typeof Module2["readAsync"] == "undefined", "Module.readAsync option was removed (modify readAsync in JS)");
      assert(typeof Module2["readBinary"] == "undefined", "Module.readBinary option was removed (modify readBinary in JS)");
      assert(typeof Module2["setWindowTitle"] == "undefined", "Module.setWindowTitle option was removed (modify setWindowTitle in JS)");
      assert(typeof Module2["TOTAL_MEMORY"] == "undefined", "Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY");
      legacyModuleProp("read", "read_");
      legacyModuleProp("readAsync", "readAsync");
      legacyModuleProp("readBinary", "readBinary");
      legacyModuleProp("setWindowTitle", "setWindowTitle");
      assert(!ENVIRONMENT_IS_WORKER, "worker environment detected but not enabled at build time.  Add 'worker' to `-sENVIRONMENT` to enable.");
      assert(!ENVIRONMENT_IS_NODE, "node environment detected but not enabled at build time.  Add 'node' to `-sENVIRONMENT` to enable.");
      assert(!ENVIRONMENT_IS_SHELL, "shell environment detected but not enabled at build time.  Add 'shell' to `-sENVIRONMENT` to enable.");
      var wasmBinary;
      if (Module2["wasmBinary"])
        wasmBinary = Module2["wasmBinary"];
      legacyModuleProp("wasmBinary", "wasmBinary");
      Module2["noExitRuntime"] || true;
      legacyModuleProp("noExitRuntime", "noExitRuntime");
      if (typeof WebAssembly != "object") {
        abort("no native wasm support detected");
      }
      var wasmMemory;
      var ABORT = false;
      function assert(condition, text) {
        if (!condition) {
          abort("Assertion failed" + (text ? ": " + text : ""));
        }
      }
      var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf8") : void 0;
      function UTF8ArrayToString(heapOrArray, idx, maxBytesToRead) {
        var endIdx = idx + maxBytesToRead;
        var endPtr = idx;
        while (heapOrArray[endPtr] && !(endPtr >= endIdx))
          ++endPtr;
        if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
          return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
        }
        var str = "";
        while (idx < endPtr) {
          var u0 = heapOrArray[idx++];
          if (!(u0 & 128)) {
            str += String.fromCharCode(u0);
            continue;
          }
          var u1 = heapOrArray[idx++] & 63;
          if ((u0 & 224) == 192) {
            str += String.fromCharCode((u0 & 31) << 6 | u1);
            continue;
          }
          var u2 = heapOrArray[idx++] & 63;
          if ((u0 & 240) == 224) {
            u0 = (u0 & 15) << 12 | u1 << 6 | u2;
          } else {
            if ((u0 & 248) != 240)
              warnOnce("Invalid UTF-8 leading byte " + ptrToString(u0) + " encountered when deserializing a UTF-8 string in wasm memory to a JS string!");
            u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63;
          }
          if (u0 < 65536) {
            str += String.fromCharCode(u0);
          } else {
            var ch = u0 - 65536;
            str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
          }
        }
        return str;
      }
      function UTF8ToString(ptr, maxBytesToRead) {
        assert(typeof ptr == "number");
        return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
      }
      function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
        if (!(maxBytesToWrite > 0))
          return 0;
        var startIdx = outIdx;
        var endIdx = outIdx + maxBytesToWrite - 1;
        for (var i = 0; i < str.length; ++i) {
          var u = str.charCodeAt(i);
          if (u >= 55296 && u <= 57343) {
            var u1 = str.charCodeAt(++i);
            u = 65536 + ((u & 1023) << 10) | u1 & 1023;
          }
          if (u <= 127) {
            if (outIdx >= endIdx)
              break;
            heap[outIdx++] = u;
          } else if (u <= 2047) {
            if (outIdx + 1 >= endIdx)
              break;
            heap[outIdx++] = 192 | u >> 6;
            heap[outIdx++] = 128 | u & 63;
          } else if (u <= 65535) {
            if (outIdx + 2 >= endIdx)
              break;
            heap[outIdx++] = 224 | u >> 12;
            heap[outIdx++] = 128 | u >> 6 & 63;
            heap[outIdx++] = 128 | u & 63;
          } else {
            if (outIdx + 3 >= endIdx)
              break;
            if (u > 1114111)
              warnOnce("Invalid Unicode code point " + ptrToString(u) + " encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF).");
            heap[outIdx++] = 240 | u >> 18;
            heap[outIdx++] = 128 | u >> 12 & 63;
            heap[outIdx++] = 128 | u >> 6 & 63;
            heap[outIdx++] = 128 | u & 63;
          }
        }
        heap[outIdx] = 0;
        return outIdx - startIdx;
      }
      function stringToUTF8(str, outPtr, maxBytesToWrite) {
        assert(typeof maxBytesToWrite == "number", "stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");
        return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
      }
      function lengthBytesUTF8(str) {
        var len = 0;
        for (var i = 0; i < str.length; ++i) {
          var c = str.charCodeAt(i);
          if (c <= 127) {
            len++;
          } else if (c <= 2047) {
            len += 2;
          } else if (c >= 55296 && c <= 57343) {
            len += 4;
            ++i;
          } else {
            len += 3;
          }
        }
        return len;
      }
      var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
      function updateMemoryViews() {
        var b = wasmMemory.buffer;
        Module2["HEAP8"] = HEAP8 = new Int8Array(b);
        Module2["HEAP16"] = HEAP16 = new Int16Array(b);
        Module2["HEAP32"] = HEAP32 = new Int32Array(b);
        Module2["HEAPU8"] = HEAPU8 = new Uint8Array(b);
        Module2["HEAPU16"] = HEAPU16 = new Uint16Array(b);
        Module2["HEAPU32"] = HEAPU32 = new Uint32Array(b);
        Module2["HEAPF32"] = HEAPF32 = new Float32Array(b);
        Module2["HEAPF64"] = HEAPF64 = new Float64Array(b);
      }
      assert(!Module2["STACK_SIZE"], "STACK_SIZE can no longer be set at runtime.  Use -sSTACK_SIZE at link time");
      assert(typeof Int32Array != "undefined" && typeof Float64Array !== "undefined" && Int32Array.prototype.subarray != void 0 && Int32Array.prototype.set != void 0, "JS engine does not provide full typed array support");
      assert(!Module2["wasmMemory"], "Use of `wasmMemory` detected.  Use -sIMPORTED_MEMORY to define wasmMemory externally");
      assert(!Module2["INITIAL_MEMORY"], "Detected runtime INITIAL_MEMORY setting.  Use -sIMPORTED_MEMORY to define wasmMemory dynamically");
      var wasmTable;
      function writeStackCookie() {
        var max = _emscripten_stack_get_end();
        assert((max & 3) == 0);
        if (max == 0) {
          max += 4;
        }
        HEAPU32[max >> 2] = 34821223;
        HEAPU32[max + 4 >> 2] = 2310721022;
        HEAPU32[0] = 1668509029;
      }
      function checkStackCookie() {
        if (ABORT)
          return;
        var max = _emscripten_stack_get_end();
        if (max == 0) {
          max += 4;
        }
        var cookie1 = HEAPU32[max >> 2];
        var cookie2 = HEAPU32[max + 4 >> 2];
        if (cookie1 != 34821223 || cookie2 != 2310721022) {
          abort("Stack overflow! Stack cookie has been overwritten at " + ptrToString(max) + ", expected hex dwords 0x89BACDFE and 0x2135467, but received " + ptrToString(cookie2) + " " + ptrToString(cookie1));
        }
        if (HEAPU32[0] !== 1668509029) {
          abort("Runtime error: The application has corrupted its heap memory area (address zero)!");
        }
      }
      (function() {
        var h16 = new Int16Array(1);
        var h8 = new Int8Array(h16.buffer);
        h16[0] = 25459;
        if (h8[0] !== 115 || h8[1] !== 99)
          throw "Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)";
      })();
      var __ATPRERUN__ = [];
      var __ATINIT__ = [];
      var __ATPOSTRUN__ = [];
      var runtimeInitialized = false;
      function preRun() {
        if (Module2["preRun"]) {
          if (typeof Module2["preRun"] == "function")
            Module2["preRun"] = [Module2["preRun"]];
          while (Module2["preRun"].length) {
            addOnPreRun(Module2["preRun"].shift());
          }
        }
        callRuntimeCallbacks(__ATPRERUN__);
      }
      function initRuntime() {
        assert(!runtimeInitialized);
        runtimeInitialized = true;
        checkStackCookie();
        callRuntimeCallbacks(__ATINIT__);
      }
      function postRun() {
        checkStackCookie();
        if (Module2["postRun"]) {
          if (typeof Module2["postRun"] == "function")
            Module2["postRun"] = [Module2["postRun"]];
          while (Module2["postRun"].length) {
            addOnPostRun(Module2["postRun"].shift());
          }
        }
        callRuntimeCallbacks(__ATPOSTRUN__);
      }
      function addOnPreRun(cb) {
        __ATPRERUN__.unshift(cb);
      }
      function addOnInit(cb) {
        __ATINIT__.unshift(cb);
      }
      function addOnPostRun(cb) {
        __ATPOSTRUN__.unshift(cb);
      }
      assert(Math.imul, "This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
      assert(Math.fround, "This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
      assert(Math.clz32, "This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
      assert(Math.trunc, "This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
      var runDependencies = 0;
      var runDependencyWatcher = null;
      var dependenciesFulfilled = null;
      var runDependencyTracking = {};
      function addRunDependency(id) {
        runDependencies++;
        if (Module2["monitorRunDependencies"]) {
          Module2["monitorRunDependencies"](runDependencies);
        }
        if (id) {
          assert(!runDependencyTracking[id]);
          runDependencyTracking[id] = 1;
          if (runDependencyWatcher === null && typeof setInterval != "undefined") {
            runDependencyWatcher = setInterval(function() {
              if (ABORT) {
                clearInterval(runDependencyWatcher);
                runDependencyWatcher = null;
                return;
              }
              var shown = false;
              for (var dep in runDependencyTracking) {
                if (!shown) {
                  shown = true;
                  err("still waiting on run dependencies:");
                }
                err("dependency: " + dep);
              }
              if (shown) {
                err("(end of list)");
              }
            }, 1e4);
          }
        } else {
          err("warning: run dependency added without ID");
        }
      }
      function removeRunDependency(id) {
        runDependencies--;
        if (Module2["monitorRunDependencies"]) {
          Module2["monitorRunDependencies"](runDependencies);
        }
        if (id) {
          assert(runDependencyTracking[id]);
          delete runDependencyTracking[id];
        } else {
          err("warning: run dependency removed without ID");
        }
        if (runDependencies == 0) {
          if (runDependencyWatcher !== null) {
            clearInterval(runDependencyWatcher);
            runDependencyWatcher = null;
          }
          if (dependenciesFulfilled) {
            var callback = dependenciesFulfilled;
            dependenciesFulfilled = null;
            callback();
          }
        }
      }
      function abort(what) {
        if (Module2["onAbort"]) {
          Module2["onAbort"](what);
        }
        what = "Aborted(" + what + ")";
        err(what);
        ABORT = true;
        var e = new WebAssembly.RuntimeError(what);
        readyPromiseReject(e);
        throw e;
      }
      var FS = {
        error: function() {
          abort("Filesystem support (FS) was not included. The problem is that you are using files from JS, but files were not used from C/C++, so filesystem support was not auto-included. You can force-include filesystem support with -sFORCE_FILESYSTEM");
        },
        init: function() {
          FS.error();
        },
        createDataFile: function() {
          FS.error();
        },
        createPreloadedFile: function() {
          FS.error();
        },
        createLazyFile: function() {
          FS.error();
        },
        open: function() {
          FS.error();
        },
        mkdev: function() {
          FS.error();
        },
        registerDevice: function() {
          FS.error();
        },
        analyzePath: function() {
          FS.error();
        },
        loadFilesFromDB: function() {
          FS.error();
        },
        ErrnoError: function ErrnoError() {
          FS.error();
        }
      };
      Module2["FS_createDataFile"] = FS.createDataFile;
      Module2["FS_createPreloadedFile"] = FS.createPreloadedFile;
      var dataURIPrefix = "data:application/octet-stream;base64,";
      function isDataURI(filename) {
        return filename.startsWith(dataURIPrefix);
      }
      function isFileURI(filename) {
        return filename.startsWith("file://");
      }
      function createExportWrapper(name, fixedasm) {
        return function() {
          var displayName = name;
          var asm = fixedasm;
          if (!fixedasm) {
            asm = Module2["asm"];
          }
          assert(runtimeInitialized, "native function `" + displayName + "` called before runtime initialization");
          if (!asm[name]) {
            assert(asm[name], "exported native function `" + displayName + "` not found");
          }
          return asm[name].apply(null, arguments);
        };
      }
      var wasmBinaryFile;
      if (Module2["locateFile"]) {
        wasmBinaryFile = "main.wasm";
        if (!isDataURI(wasmBinaryFile)) {
          wasmBinaryFile = locateFile(wasmBinaryFile);
        }
      } else {
        wasmBinaryFile = new URL("main.wasm", self.location).href;
      }
      function getBinary(file) {
        try {
          if (file == wasmBinaryFile && wasmBinary) {
            return new Uint8Array(wasmBinary);
          }
          if (readBinary)
            ;
          throw "both async and sync fetching of the wasm failed";
        } catch (err2) {
          abort(err2);
        }
      }
      function getBinaryPromise(binaryFile) {
        if (!wasmBinary && ENVIRONMENT_IS_WEB) {
          if (typeof fetch == "function") {
            return fetch(binaryFile, { credentials: "same-origin" }).then(function(response) {
              if (!response["ok"]) {
                throw "failed to load wasm binary file at '" + binaryFile + "'";
              }
              return response["arrayBuffer"]();
            }).catch(function() {
              return getBinary(binaryFile);
            });
          }
        }
        return Promise.resolve().then(function() {
          return getBinary(binaryFile);
        });
      }
      function instantiateArrayBuffer(binaryFile, imports, receiver) {
        return getBinaryPromise(binaryFile).then(function(binary) {
          return WebAssembly.instantiate(binary, imports);
        }).then(function(instance) {
          return instance;
        }).then(receiver, function(reason) {
          err("failed to asynchronously prepare wasm: " + reason);
          if (isFileURI(wasmBinaryFile)) {
            err("warning: Loading from a file URI (" + wasmBinaryFile + ") is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing");
          }
          abort(reason);
        });
      }
      function instantiateAsync(binary, binaryFile, imports, callback) {
        if (!binary && typeof WebAssembly.instantiateStreaming == "function" && !isDataURI(binaryFile) && typeof fetch == "function") {
          return fetch(binaryFile, { credentials: "same-origin" }).then(function(response) {
            var result = WebAssembly.instantiateStreaming(response, imports);
            return result.then(callback, function(reason) {
              err("wasm streaming compile failed: " + reason);
              err("falling back to ArrayBuffer instantiation");
              return instantiateArrayBuffer(binaryFile, imports, callback);
            });
          });
        } else {
          return instantiateArrayBuffer(binaryFile, imports, callback);
        }
      }
      function createWasm() {
        var info = {
          "env": wasmImports,
          "wasi_snapshot_preview1": wasmImports
        };
        function receiveInstance(instance, module) {
          var exports = instance.exports;
          Module2["asm"] = exports;
          wasmMemory = Module2["asm"]["memory"];
          assert(wasmMemory, "memory not found in wasm exports");
          updateMemoryViews();
          wasmTable = Module2["asm"]["__indirect_function_table"];
          assert(wasmTable, "table not found in wasm exports");
          addOnInit(Module2["asm"]["__wasm_call_ctors"]);
          removeRunDependency("wasm-instantiate");
          return exports;
        }
        addRunDependency("wasm-instantiate");
        var trueModule = Module2;
        function receiveInstantiationResult(result) {
          assert(Module2 === trueModule, "the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?");
          trueModule = null;
          receiveInstance(result["instance"]);
        }
        if (Module2["instantiateWasm"]) {
          try {
            return Module2["instantiateWasm"](info, receiveInstance);
          } catch (e) {
            err("Module.instantiateWasm callback failed with error: " + e);
            readyPromiseReject(e);
          }
        }
        instantiateAsync(wasmBinary, wasmBinaryFile, info, receiveInstantiationResult).catch(readyPromiseReject);
        return {};
      }
      function legacyModuleProp(prop, newName) {
        if (!Object.getOwnPropertyDescriptor(Module2, prop)) {
          Object.defineProperty(Module2, prop, {
            configurable: true,
            get: function() {
              abort("Module." + prop + " has been replaced with plain " + newName + " (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)");
            }
          });
        }
      }
      function ignoredModuleProp(prop) {
        if (Object.getOwnPropertyDescriptor(Module2, prop)) {
          abort("`Module." + prop + "` was supplied but `" + prop + "` not included in INCOMING_MODULE_JS_API");
        }
      }
      function isExportedByForceFilesystem(name) {
        return name === "FS_createPath" || name === "FS_createDataFile" || name === "FS_createPreloadedFile" || name === "FS_unlink" || name === "addRunDependency" || // The old FS has some functionality that WasmFS lacks.
        name === "FS_createLazyFile" || name === "FS_createDevice" || name === "removeRunDependency";
      }
      function missingGlobal(sym, msg) {
        if (typeof dntGlobalThis !== "undefined") {
          Object.defineProperty(dntGlobalThis, sym, {
            configurable: true,
            get: function() {
              warnOnce("`" + sym + "` is not longer defined by emscripten. " + msg);
              return void 0;
            }
          });
        }
      }
      missingGlobal("buffer", "Please use HEAP8.buffer or wasmMemory.buffer");
      function missingLibrarySymbol(sym) {
        if (typeof dntGlobalThis !== "undefined" && !Object.getOwnPropertyDescriptor(dntGlobalThis, sym)) {
          Object.defineProperty(dntGlobalThis, sym, {
            configurable: true,
            get: function() {
              var msg = "`" + sym + "` is a library symbol and not included by default; add it to your library.js __deps or to DEFAULT_LIBRARY_FUNCS_TO_INCLUDE on the command line";
              var librarySymbol = sym;
              if (!librarySymbol.startsWith("_")) {
                librarySymbol = "$" + sym;
              }
              msg += " (e.g. -sDEFAULT_LIBRARY_FUNCS_TO_INCLUDE=" + librarySymbol + ")";
              if (isExportedByForceFilesystem(sym)) {
                msg += ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you";
              }
              warnOnce(msg);
              return void 0;
            }
          });
        }
        unexportedRuntimeSymbol(sym);
      }
      function unexportedRuntimeSymbol(sym) {
        if (!Object.getOwnPropertyDescriptor(Module2, sym)) {
          Object.defineProperty(Module2, sym, {
            configurable: true,
            get: function() {
              var msg = "'" + sym + "' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)";
              if (isExportedByForceFilesystem(sym)) {
                msg += ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you";
              }
              abort(msg);
            }
          });
        }
      }
      function callRuntimeCallbacks(callbacks) {
        while (callbacks.length > 0) {
          callbacks.shift()(Module2);
        }
      }
      function ptrToString(ptr) {
        assert(typeof ptr === "number");
        return "0x" + ptr.toString(16).padStart(8, "0");
      }
      function warnOnce(text) {
        if (!warnOnce.shown)
          warnOnce.shown = {};
        if (!warnOnce.shown[text]) {
          warnOnce.shown[text] = 1;
          err(text);
        }
      }
      function __embind_register_bigint(primitiveType, name, size, minRange, maxRange) {
      }
      function getShiftFromSize(size) {
        switch (size) {
          case 1:
            return 0;
          case 2:
            return 1;
          case 4:
            return 2;
          case 8:
            return 3;
          default:
            throw new TypeError("Unknown type size: " + size);
        }
      }
      function embind_init_charCodes() {
        var codes = new Array(256);
        for (var i = 0; i < 256; ++i) {
          codes[i] = String.fromCharCode(i);
        }
        embind_charCodes = codes;
      }
      var embind_charCodes = void 0;
      function readLatin1String(ptr) {
        var ret = "";
        var c = ptr;
        while (HEAPU8[c]) {
          ret += embind_charCodes[HEAPU8[c++]];
        }
        return ret;
      }
      var awaitingDependencies = {};
      var registeredTypes = {};
      var typeDependencies = {};
      var char_0 = 48;
      var char_9 = 57;
      function makeLegalFunctionName(name) {
        if (void 0 === name) {
          return "_unknown";
        }
        name = name.replace(/[^a-zA-Z0-9_]/g, "$");
        var f = name.charCodeAt(0);
        if (f >= char_0 && f <= char_9) {
          return "_" + name;
        }
        return name;
      }
      function createNamedFunction(name, body) {
        name = makeLegalFunctionName(name);
        return {
          [name]: function() {
            return body.apply(this, arguments);
          }
        }[name];
      }
      function extendError(baseErrorType, errorName) {
        var errorClass = createNamedFunction(errorName, function(message) {
          this.name = errorName;
          this.message = message;
          var stack = new Error(message).stack;
          if (stack !== void 0) {
            this.stack = this.toString() + "\n" + stack.replace(/^Error(:[^\n]*)?\n/, "");
          }
        });
        errorClass.prototype = Object.create(baseErrorType.prototype);
        errorClass.prototype.constructor = errorClass;
        errorClass.prototype.toString = function() {
          if (this.message === void 0) {
            return this.name;
          } else {
            return this.name + ": " + this.message;
          }
        };
        return errorClass;
      }
      var BindingError = void 0;
      function throwBindingError(message) {
        throw new BindingError(message);
      }
      var InternalError = void 0;
      function throwInternalError(message) {
        throw new InternalError(message);
      }
      function whenDependentTypesAreResolved(myTypes, dependentTypes, getTypeConverters) {
        myTypes.forEach(function(type) {
          typeDependencies[type] = dependentTypes;
        });
        function onComplete(typeConverters2) {
          var myTypeConverters = getTypeConverters(typeConverters2);
          if (myTypeConverters.length !== myTypes.length) {
            throwInternalError("Mismatched type converter count");
          }
          for (var i = 0; i < myTypes.length; ++i) {
            registerType(myTypes[i], myTypeConverters[i]);
          }
        }
        var typeConverters = new Array(dependentTypes.length);
        var unregisteredTypes = [];
        var registered = 0;
        dependentTypes.forEach((dt, i) => {
          if (registeredTypes.hasOwnProperty(dt)) {
            typeConverters[i] = registeredTypes[dt];
          } else {
            unregisteredTypes.push(dt);
            if (!awaitingDependencies.hasOwnProperty(dt)) {
              awaitingDependencies[dt] = [];
            }
            awaitingDependencies[dt].push(() => {
              typeConverters[i] = registeredTypes[dt];
              ++registered;
              if (registered === unregisteredTypes.length) {
                onComplete(typeConverters);
              }
            });
          }
        });
        if (0 === unregisteredTypes.length) {
          onComplete(typeConverters);
        }
      }
      function registerType(rawType, registeredInstance, options = {}) {
        if (!("argPackAdvance" in registeredInstance)) {
          throw new TypeError("registerType registeredInstance requires argPackAdvance");
        }
        var name = registeredInstance.name;
        if (!rawType) {
          throwBindingError('type "' + name + '" must have a positive integer typeid pointer');
        }
        if (registeredTypes.hasOwnProperty(rawType)) {
          if (options.ignoreDuplicateRegistrations) {
            return;
          } else {
            throwBindingError("Cannot register type '" + name + "' twice");
          }
        }
        registeredTypes[rawType] = registeredInstance;
        delete typeDependencies[rawType];
        if (awaitingDependencies.hasOwnProperty(rawType)) {
          var callbacks = awaitingDependencies[rawType];
          delete awaitingDependencies[rawType];
          callbacks.forEach((cb) => cb());
        }
      }
      function __embind_register_bool(rawType, name, size, trueValue, falseValue) {
        var shift = getShiftFromSize(size);
        name = readLatin1String(name);
        registerType(rawType, {
          name,
          "fromWireType": function(wt) {
            return !!wt;
          },
          "toWireType": function(destructors, o) {
            return o ? trueValue : falseValue;
          },
          "argPackAdvance": 8,
          "readValueFromPointer": function(pointer) {
            var heap;
            if (size === 1) {
              heap = HEAP8;
            } else if (size === 2) {
              heap = HEAP16;
            } else if (size === 4) {
              heap = HEAP32;
            } else {
              throw new TypeError("Unknown boolean type size: " + name);
            }
            return this["fromWireType"](heap[pointer >> shift]);
          },
          destructorFunction: null
          // This type does not need a destructor
        });
      }
      function ClassHandle_isAliasOf(other) {
        if (!(this instanceof ClassHandle)) {
          return false;
        }
        if (!(other instanceof ClassHandle)) {
          return false;
        }
        var leftClass = this.$$.ptrType.registeredClass;
        var left = this.$$.ptr;
        var rightClass = other.$$.ptrType.registeredClass;
        var right = other.$$.ptr;
        while (leftClass.baseClass) {
          left = leftClass.upcast(left);
          leftClass = leftClass.baseClass;
        }
        while (rightClass.baseClass) {
          right = rightClass.upcast(right);
          rightClass = rightClass.baseClass;
        }
        return leftClass === rightClass && left === right;
      }
      function shallowCopyInternalPointer(o) {
        return {
          count: o.count,
          deleteScheduled: o.deleteScheduled,
          preservePointerOnDelete: o.preservePointerOnDelete,
          ptr: o.ptr,
          ptrType: o.ptrType,
          smartPtr: o.smartPtr,
          smartPtrType: o.smartPtrType
        };
      }
      function throwInstanceAlreadyDeleted(obj) {
        function getInstanceTypeName(handle) {
          return handle.$$.ptrType.registeredClass.name;
        }
        throwBindingError(getInstanceTypeName(obj) + " instance already deleted");
      }
      var finalizationRegistry = false;
      function detachFinalizer(handle) {
      }
      function runDestructor($$) {
        if ($$.smartPtr) {
          $$.smartPtrType.rawDestructor($$.smartPtr);
        } else {
          $$.ptrType.registeredClass.rawDestructor($$.ptr);
        }
      }
      function releaseClassHandle($$) {
        $$.count.value -= 1;
        var toDelete = 0 === $$.count.value;
        if (toDelete) {
          runDestructor($$);
        }
      }
      function downcastPointer(ptr, ptrClass, desiredClass) {
        if (ptrClass === desiredClass) {
          return ptr;
        }
        if (void 0 === desiredClass.baseClass) {
          return null;
        }
        var rv = downcastPointer(ptr, ptrClass, desiredClass.baseClass);
        if (rv === null) {
          return null;
        }
        return desiredClass.downcast(rv);
      }
      var registeredPointers = {};
      function getInheritedInstanceCount() {
        return Object.keys(registeredInstances).length;
      }
      function getLiveInheritedInstances() {
        var rv = [];
        for (var k in registeredInstances) {
          if (registeredInstances.hasOwnProperty(k)) {
            rv.push(registeredInstances[k]);
          }
        }
        return rv;
      }
      var deletionQueue = [];
      function flushPendingDeletes() {
        while (deletionQueue.length) {
          var obj = deletionQueue.pop();
          obj.$$.deleteScheduled = false;
          obj["delete"]();
        }
      }
      var delayFunction = void 0;
      function setDelayFunction(fn) {
        delayFunction = fn;
        if (deletionQueue.length && delayFunction) {
          delayFunction(flushPendingDeletes);
        }
      }
      function init_embind() {
        Module2["getInheritedInstanceCount"] = getInheritedInstanceCount;
        Module2["getLiveInheritedInstances"] = getLiveInheritedInstances;
        Module2["flushPendingDeletes"] = flushPendingDeletes;
        Module2["setDelayFunction"] = setDelayFunction;
      }
      var registeredInstances = {};
      function getBasestPointer(class_, ptr) {
        if (ptr === void 0) {
          throwBindingError("ptr should not be undefined");
        }
        while (class_.baseClass) {
          ptr = class_.upcast(ptr);
          class_ = class_.baseClass;
        }
        return ptr;
      }
      function getInheritedInstance(class_, ptr) {
        ptr = getBasestPointer(class_, ptr);
        return registeredInstances[ptr];
      }
      function makeClassHandle(prototype, record) {
        if (!record.ptrType || !record.ptr) {
          throwInternalError("makeClassHandle requires ptr and ptrType");
        }
        var hasSmartPtrType = !!record.smartPtrType;
        var hasSmartPtr = !!record.smartPtr;
        if (hasSmartPtrType !== hasSmartPtr) {
          throwInternalError("Both smartPtrType and smartPtr must be specified");
        }
        record.count = { value: 1 };
        return attachFinalizer(Object.create(prototype, {
          $$: {
            value: record
          }
        }));
      }
      function RegisteredPointer_fromWireType(ptr) {
        var rawPointer = this.getPointee(ptr);
        if (!rawPointer) {
          this.destructor(ptr);
          return null;
        }
        var registeredInstance = getInheritedInstance(this.registeredClass, rawPointer);
        if (void 0 !== registeredInstance) {
          if (0 === registeredInstance.$$.count.value) {
            registeredInstance.$$.ptr = rawPointer;
            registeredInstance.$$.smartPtr = ptr;
            return registeredInstance["clone"]();
          } else {
            var rv = registeredInstance["clone"]();
            this.destructor(ptr);
            return rv;
          }
        }
        function makeDefaultHandle() {
          if (this.isSmartPointer) {
            return makeClassHandle(this.registeredClass.instancePrototype, {
              ptrType: this.pointeeType,
              ptr: rawPointer,
              smartPtrType: this,
              smartPtr: ptr
            });
          } else {
            return makeClassHandle(this.registeredClass.instancePrototype, {
              ptrType: this,
              ptr
            });
          }
        }
        var actualType = this.registeredClass.getActualType(rawPointer);
        var registeredPointerRecord = registeredPointers[actualType];
        if (!registeredPointerRecord) {
          return makeDefaultHandle.call(this);
        }
        var toType;
        if (this.isConst) {
          toType = registeredPointerRecord.constPointerType;
        } else {
          toType = registeredPointerRecord.pointerType;
        }
        var dp = downcastPointer(rawPointer, this.registeredClass, toType.registeredClass);
        if (dp === null) {
          return makeDefaultHandle.call(this);
        }
        if (this.isSmartPointer) {
          return makeClassHandle(toType.registeredClass.instancePrototype, {
            ptrType: toType,
            ptr: dp,
            smartPtrType: this,
            smartPtr: ptr
          });
        } else {
          return makeClassHandle(toType.registeredClass.instancePrototype, {
            ptrType: toType,
            ptr: dp
          });
        }
      }
      function attachFinalizer(handle) {
        if ("undefined" === typeof FinalizationRegistry) {
          attachFinalizer = (handle2) => handle2;
          return handle;
        }
        finalizationRegistry = new FinalizationRegistry((info) => {
          console.warn(info.leakWarning.stack.replace(/^Error: /, ""));
          releaseClassHandle(info.$$);
        });
        attachFinalizer = (handle2) => {
          var $$ = handle2.$$;
          var hasSmartPtr = !!$$.smartPtr;
          if (hasSmartPtr) {
            var info = { $$ };
            var cls = $$.ptrType.registeredClass;
            info.leakWarning = new Error("Embind found a leaked C++ instance " + cls.name + " <" + ptrToString($$.ptr) + ">.\nWe'll free it automatically in this case, but this functionality is not reliable across various environments.\nMake sure to invoke .delete() manually once you're done with the instance instead.\nOriginally allocated");
            if ("captureStackTrace" in Error) {
              Error.captureStackTrace(info.leakWarning, RegisteredPointer_fromWireType);
            }
            finalizationRegistry.register(handle2, info, handle2);
          }
          return handle2;
        };
        detachFinalizer = (handle2) => finalizationRegistry.unregister(handle2);
        return attachFinalizer(handle);
      }
      function ClassHandle_clone() {
        if (!this.$$.ptr) {
          throwInstanceAlreadyDeleted(this);
        }
        if (this.$$.preservePointerOnDelete) {
          this.$$.count.value += 1;
          return this;
        } else {
          var clone = attachFinalizer(Object.create(Object.getPrototypeOf(this), {
            $$: {
              value: shallowCopyInternalPointer(this.$$)
            }
          }));
          clone.$$.count.value += 1;
          clone.$$.deleteScheduled = false;
          return clone;
        }
      }
      function ClassHandle_delete() {
        if (!this.$$.ptr) {
          throwInstanceAlreadyDeleted(this);
        }
        if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
          throwBindingError("Object already scheduled for deletion");
        }
        detachFinalizer(this);
        releaseClassHandle(this.$$);
        if (!this.$$.preservePointerOnDelete) {
          this.$$.smartPtr = void 0;
          this.$$.ptr = void 0;
        }
      }
      function ClassHandle_isDeleted() {
        return !this.$$.ptr;
      }
      function ClassHandle_deleteLater() {
        if (!this.$$.ptr) {
          throwInstanceAlreadyDeleted(this);
        }
        if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
          throwBindingError("Object already scheduled for deletion");
        }
        deletionQueue.push(this);
        if (deletionQueue.length === 1 && delayFunction) {
          delayFunction(flushPendingDeletes);
        }
        this.$$.deleteScheduled = true;
        return this;
      }
      function init_ClassHandle() {
        ClassHandle.prototype["isAliasOf"] = ClassHandle_isAliasOf;
        ClassHandle.prototype["clone"] = ClassHandle_clone;
        ClassHandle.prototype["delete"] = ClassHandle_delete;
        ClassHandle.prototype["isDeleted"] = ClassHandle_isDeleted;
        ClassHandle.prototype["deleteLater"] = ClassHandle_deleteLater;
      }
      function ClassHandle() {
      }
      function ensureOverloadTable(proto, methodName, humanName) {
        if (void 0 === proto[methodName].overloadTable) {
          var prevFunc = proto[methodName];
          proto[methodName] = function() {
            if (!proto[methodName].overloadTable.hasOwnProperty(arguments.length)) {
              throwBindingError("Function '" + humanName + "' called with an invalid number of arguments (" + arguments.length + ") - expects one of (" + proto[methodName].overloadTable + ")!");
            }
            return proto[methodName].overloadTable[arguments.length].apply(this, arguments);
          };
          proto[methodName].overloadTable = [];
          proto[methodName].overloadTable[prevFunc.argCount] = prevFunc;
        }
      }
      function exposePublicSymbol(name, value, numArguments) {
        if (Module2.hasOwnProperty(name)) {
          if (void 0 === numArguments || void 0 !== Module2[name].overloadTable && void 0 !== Module2[name].overloadTable[numArguments]) {
            throwBindingError("Cannot register public name '" + name + "' twice");
          }
          ensureOverloadTable(Module2, name, name);
          if (Module2.hasOwnProperty(numArguments)) {
            throwBindingError("Cannot register multiple overloads of a function with the same number of arguments (" + numArguments + ")!");
          }
          Module2[name].overloadTable[numArguments] = value;
        } else {
          Module2[name] = value;
          if (void 0 !== numArguments) {
            Module2[name].numArguments = numArguments;
          }
        }
      }
      function RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast) {
        this.name = name;
        this.constructor = constructor;
        this.instancePrototype = instancePrototype;
        this.rawDestructor = rawDestructor;
        this.baseClass = baseClass;
        this.getActualType = getActualType;
        this.upcast = upcast;
        this.downcast = downcast;
        this.pureVirtualFunctions = [];
      }
      function upcastPointer(ptr, ptrClass, desiredClass) {
        while (ptrClass !== desiredClass) {
          if (!ptrClass.upcast) {
            throwBindingError("Expected null or instance of " + desiredClass.name + ", got an instance of " + ptrClass.name);
          }
          ptr = ptrClass.upcast(ptr);
          ptrClass = ptrClass.baseClass;
        }
        return ptr;
      }
      function constNoSmartPtrRawPointerToWireType(destructors, handle) {
        if (handle === null) {
          if (this.isReference) {
            throwBindingError("null is not a valid " + this.name);
          }
          return 0;
        }
        if (!handle.$$) {
          throwBindingError('Cannot pass "' + embindRepr(handle) + '" as a ' + this.name);
        }
        if (!handle.$$.ptr) {
          throwBindingError("Cannot pass deleted object as a pointer of type " + this.name);
        }
        var handleClass = handle.$$.ptrType.registeredClass;
        var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
        return ptr;
      }
      function genericPointerToWireType(destructors, handle) {
        var ptr;
        if (handle === null) {
          if (this.isReference) {
            throwBindingError("null is not a valid " + this.name);
          }
          if (this.isSmartPointer) {
            ptr = this.rawConstructor();
            if (destructors !== null) {
              destructors.push(this.rawDestructor, ptr);
            }
            return ptr;
          } else {
            return 0;
          }
        }
        if (!handle.$$) {
          throwBindingError('Cannot pass "' + embindRepr(handle) + '" as a ' + this.name);
        }
        if (!handle.$$.ptr) {
          throwBindingError("Cannot pass deleted object as a pointer of type " + this.name);
        }
        if (!this.isConst && handle.$$.ptrType.isConst) {
          throwBindingError("Cannot convert argument of type " + (handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name) + " to parameter type " + this.name);
        }
        var handleClass = handle.$$.ptrType.registeredClass;
        ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
        if (this.isSmartPointer) {
          if (void 0 === handle.$$.smartPtr) {
            throwBindingError("Passing raw pointer to smart pointer is illegal");
          }
          switch (this.sharingPolicy) {
            case 0:
              if (handle.$$.smartPtrType === this) {
                ptr = handle.$$.smartPtr;
              } else {
                throwBindingError("Cannot convert argument of type " + (handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name) + " to parameter type " + this.name);
              }
              break;
            case 1:
              ptr = handle.$$.smartPtr;
              break;
            case 2:
              if (handle.$$.smartPtrType === this) {
                ptr = handle.$$.smartPtr;
              } else {
                var clonedHandle = handle["clone"]();
                ptr = this.rawShare(ptr, Emval.toHandle(function() {
                  clonedHandle["delete"]();
                }));
                if (destructors !== null) {
                  destructors.push(this.rawDestructor, ptr);
                }
              }
              break;
            default:
              throwBindingError("Unsupporting sharing policy");
          }
        }
        return ptr;
      }
      function nonConstNoSmartPtrRawPointerToWireType(destructors, handle) {
        if (handle === null) {
          if (this.isReference) {
            throwBindingError("null is not a valid " + this.name);
          }
          return 0;
        }
        if (!handle.$$) {
          throwBindingError('Cannot pass "' + embindRepr(handle) + '" as a ' + this.name);
        }
        if (!handle.$$.ptr) {
          throwBindingError("Cannot pass deleted object as a pointer of type " + this.name);
        }
        if (handle.$$.ptrType.isConst) {
          throwBindingError("Cannot convert argument of type " + handle.$$.ptrType.name + " to parameter type " + this.name);
        }
        var handleClass = handle.$$.ptrType.registeredClass;
        var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
        return ptr;
      }
      function simpleReadValueFromPointer(pointer) {
        return this["fromWireType"](HEAP32[pointer >> 2]);
      }
      function RegisteredPointer_getPointee(ptr) {
        if (this.rawGetPointee) {
          ptr = this.rawGetPointee(ptr);
        }
        return ptr;
      }
      function RegisteredPointer_destructor(ptr) {
        if (this.rawDestructor) {
          this.rawDestructor(ptr);
        }
      }
      function RegisteredPointer_deleteObject(handle) {
        if (handle !== null) {
          handle["delete"]();
        }
      }
      function init_RegisteredPointer() {
        RegisteredPointer.prototype.getPointee = RegisteredPointer_getPointee;
        RegisteredPointer.prototype.destructor = RegisteredPointer_destructor;
        RegisteredPointer.prototype["argPackAdvance"] = 8;
        RegisteredPointer.prototype["readValueFromPointer"] = simpleReadValueFromPointer;
        RegisteredPointer.prototype["deleteObject"] = RegisteredPointer_deleteObject;
        RegisteredPointer.prototype["fromWireType"] = RegisteredPointer_fromWireType;
      }
      function RegisteredPointer(name, registeredClass, isReference, isConst, isSmartPointer, pointeeType, sharingPolicy, rawGetPointee, rawConstructor, rawShare, rawDestructor) {
        this.name = name;
        this.registeredClass = registeredClass;
        this.isReference = isReference;
        this.isConst = isConst;
        this.isSmartPointer = isSmartPointer;
        this.pointeeType = pointeeType;
        this.sharingPolicy = sharingPolicy;
        this.rawGetPointee = rawGetPointee;
        this.rawConstructor = rawConstructor;
        this.rawShare = rawShare;
        this.rawDestructor = rawDestructor;
        if (!isSmartPointer && registeredClass.baseClass === void 0) {
          if (isConst) {
            this["toWireType"] = constNoSmartPtrRawPointerToWireType;
            this.destructorFunction = null;
          } else {
            this["toWireType"] = nonConstNoSmartPtrRawPointerToWireType;
            this.destructorFunction = null;
          }
        } else {
          this["toWireType"] = genericPointerToWireType;
        }
      }
      function replacePublicSymbol(name, value, numArguments) {
        if (!Module2.hasOwnProperty(name)) {
          throwInternalError("Replacing nonexistant public symbol");
        }
        if (void 0 !== Module2[name].overloadTable && void 0 !== numArguments) {
          Module2[name].overloadTable[numArguments] = value;
        } else {
          Module2[name] = value;
          Module2[name].argCount = numArguments;
        }
      }
      function dynCallLegacy(sig, ptr, args) {
        assert("dynCall_" + sig in Module2, "bad function pointer type - dynCall function not found for sig '" + sig + "'");
        if (args && args.length) {
          assert(args.length === sig.substring(1).replace(/j/g, "--").length);
        } else {
          assert(sig.length == 1);
        }
        var f = Module2["dynCall_" + sig];
        return args && args.length ? f.apply(null, [ptr].concat(args)) : f.call(null, ptr);
      }
      var wasmTableMirror = [];
      function getWasmTableEntry(funcPtr) {
        var func = wasmTableMirror[funcPtr];
        if (!func) {
          if (funcPtr >= wasmTableMirror.length)
            wasmTableMirror.length = funcPtr + 1;
          wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
        }
        assert(wasmTable.get(funcPtr) == func, "JavaScript-side Wasm function table mirror is out of date!");
        return func;
      }
      function dynCall(sig, ptr, args) {
        if (sig.includes("j")) {
          return dynCallLegacy(sig, ptr, args);
        }
        assert(getWasmTableEntry(ptr), "missing table entry in dynCall: " + ptr);
        var rtn = getWasmTableEntry(ptr).apply(null, args);
        return rtn;
      }
      function getDynCaller(sig, ptr) {
        assert(sig.includes("j") || sig.includes("p"), "getDynCaller should only be called with i64 sigs");
        var argCache = [];
        return function() {
          argCache.length = 0;
          Object.assign(argCache, arguments);
          return dynCall(sig, ptr, argCache);
        };
      }
      function embind__requireFunction(signature, rawFunction) {
        signature = readLatin1String(signature);
        function makeDynCaller() {
          if (signature.includes("j")) {
            return getDynCaller(signature, rawFunction);
          }
          return getWasmTableEntry(rawFunction);
        }
        var fp = makeDynCaller();
        if (typeof fp != "function") {
          throwBindingError("unknown function pointer with signature " + signature + ": " + rawFunction);
        }
        return fp;
      }
      var UnboundTypeError = void 0;
      function getTypeName(type) {
        var ptr = ___getTypeName(type);
        var rv = readLatin1String(ptr);
        _free(ptr);
        return rv;
      }
      function throwUnboundTypeError(message, types) {
        var unboundTypes = [];
        var seen = {};
        function visit(type) {
          if (seen[type]) {
            return;
          }
          if (registeredTypes[type]) {
            return;
          }
          if (typeDependencies[type]) {
            typeDependencies[type].forEach(visit);
            return;
          }
          unboundTypes.push(type);
          seen[type] = true;
        }
        types.forEach(visit);
        throw new UnboundTypeError(message + ": " + unboundTypes.map(getTypeName).join([", "]));
      }
      function __embind_register_class(rawType, rawPointerType, rawConstPointerType, baseClassRawType, getActualTypeSignature, getActualType, upcastSignature, upcast, downcastSignature, downcast, name, destructorSignature, rawDestructor) {
        name = readLatin1String(name);
        getActualType = embind__requireFunction(getActualTypeSignature, getActualType);
        if (upcast) {
          upcast = embind__requireFunction(upcastSignature, upcast);
        }
        if (downcast) {
          downcast = embind__requireFunction(downcastSignature, downcast);
        }
        rawDestructor = embind__requireFunction(destructorSignature, rawDestructor);
        var legalFunctionName = makeLegalFunctionName(name);
        exposePublicSymbol(legalFunctionName, function() {
          throwUnboundTypeError("Cannot construct " + name + " due to unbound types", [baseClassRawType]);
        });
        whenDependentTypesAreResolved([rawType, rawPointerType, rawConstPointerType], baseClassRawType ? [baseClassRawType] : [], function(base) {
          base = base[0];
          var baseClass;
          var basePrototype;
          if (baseClassRawType) {
            baseClass = base.registeredClass;
            basePrototype = baseClass.instancePrototype;
          } else {
            basePrototype = ClassHandle.prototype;
          }
          var constructor = createNamedFunction(legalFunctionName, function() {
            if (Object.getPrototypeOf(this) !== instancePrototype) {
              throw new BindingError("Use 'new' to construct " + name);
            }
            if (void 0 === registeredClass.constructor_body) {
              throw new BindingError(name + " has no accessible constructor");
            }
            var body = registeredClass.constructor_body[arguments.length];
            if (void 0 === body) {
              throw new BindingError("Tried to invoke ctor of " + name + " with invalid number of parameters (" + arguments.length + ") - expected (" + Object.keys(registeredClass.constructor_body).toString() + ") parameters instead!");
            }
            return body.apply(this, arguments);
          });
          var instancePrototype = Object.create(basePrototype, {
            constructor: { value: constructor }
          });
          constructor.prototype = instancePrototype;
          var registeredClass = new RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast);
          var referenceConverter = new RegisteredPointer(name, registeredClass, true, false, false);
          var pointerConverter = new RegisteredPointer(name + "*", registeredClass, false, false, false);
          var constPointerConverter = new RegisteredPointer(name + " const*", registeredClass, false, true, false);
          registeredPointers[rawType] = {
            pointerType: pointerConverter,
            constPointerType: constPointerConverter
          };
          replacePublicSymbol(legalFunctionName, constructor);
          return [referenceConverter, pointerConverter, constPointerConverter];
        });
      }
      function heap32VectorToArray(count, firstElement) {
        var array = [];
        for (var i = 0; i < count; i++) {
          array.push(HEAPU32[firstElement + i * 4 >> 2]);
        }
        return array;
      }
      function runDestructors(destructors) {
        while (destructors.length) {
          var ptr = destructors.pop();
          var del = destructors.pop();
          del(ptr);
        }
      }
      function new_(constructor, argumentList) {
        if (!(constructor instanceof Function)) {
          throw new TypeError("new_ called with constructor type " + typeof constructor + " which is not a function");
        }
        var dummy = createNamedFunction(constructor.name || "unknownFunctionName", function() {
        });
        dummy.prototype = constructor.prototype;
        var obj = new dummy();
        var r = constructor.apply(obj, argumentList);
        return r instanceof Object ? r : obj;
      }
      function craftInvokerFunction(humanName, argTypes, classType, cppInvokerFunc, cppTargetFunc, isAsync) {
        var argCount = argTypes.length;
        if (argCount < 2) {
          throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!");
        }
        assert(!isAsync, "Async bindings are only supported with JSPI.");
        var isClassMethodFunc = argTypes[1] !== null && classType !== null;
        var needsDestructorStack = false;
        for (var i = 1; i < argTypes.length; ++i) {
          if (argTypes[i] !== null && argTypes[i].destructorFunction === void 0) {
            needsDestructorStack = true;
            break;
          }
        }
        var returns = argTypes[0].name !== "void";
        var argsList = "";
        var argsListWired = "";
        for (var i = 0; i < argCount - 2; ++i) {
          argsList += (i !== 0 ? ", " : "") + "arg" + i;
          argsListWired += (i !== 0 ? ", " : "") + "arg" + i + "Wired";
        }
        var invokerFnBody = "return function " + makeLegalFunctionName(humanName) + "(" + argsList + ") {\nif (arguments.length !== " + (argCount - 2) + ") {\nthrowBindingError('function " + humanName + " called with ' + arguments.length + ' arguments, expected " + (argCount - 2) + " args!');\n}\n";
        if (needsDestructorStack) {
          invokerFnBody += "var destructors = [];\n";
        }
        var dtorStack = needsDestructorStack ? "destructors" : "null";
        var args1 = ["throwBindingError", "invoker", "fn", "runDestructors", "retType", "classParam"];
        var args2 = [throwBindingError, cppInvokerFunc, cppTargetFunc, runDestructors, argTypes[0], argTypes[1]];
        if (isClassMethodFunc) {
          invokerFnBody += "var thisWired = classParam.toWireType(" + dtorStack + ", this);\n";
        }
        for (var i = 0; i < argCount - 2; ++i) {
          invokerFnBody += "var arg" + i + "Wired = argType" + i + ".toWireType(" + dtorStack + ", arg" + i + "); // " + argTypes[i + 2].name + "\n";
          args1.push("argType" + i);
          args2.push(argTypes[i + 2]);
        }
        if (isClassMethodFunc) {
          argsListWired = "thisWired" + (argsListWired.length > 0 ? ", " : "") + argsListWired;
        }
        invokerFnBody += (returns || isAsync ? "var rv = " : "") + "invoker(fn" + (argsListWired.length > 0 ? ", " : "") + argsListWired + ");\n";
        if (needsDestructorStack) {
          invokerFnBody += "runDestructors(destructors);\n";
        } else {
          for (var i = isClassMethodFunc ? 1 : 2; i < argTypes.length; ++i) {
            var paramName = i === 1 ? "thisWired" : "arg" + (i - 2) + "Wired";
            if (argTypes[i].destructorFunction !== null) {
              invokerFnBody += paramName + "_dtor(" + paramName + "); // " + argTypes[i].name + "\n";
              args1.push(paramName + "_dtor");
              args2.push(argTypes[i].destructorFunction);
            }
          }
        }
        if (returns) {
          invokerFnBody += "var ret = retType.fromWireType(rv);\nreturn ret;\n";
        }
        invokerFnBody += "}\n";
        args1.push(invokerFnBody);
        var invokerFunction = new_(Function, args1).apply(null, args2);
        return invokerFunction;
      }
      function __embind_register_class_constructor(rawClassType, argCount, rawArgTypesAddr, invokerSignature, invoker, rawConstructor) {
        assert(argCount > 0);
        var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
        invoker = embind__requireFunction(invokerSignature, invoker);
        whenDependentTypesAreResolved([], [rawClassType], function(classType) {
          classType = classType[0];
          var humanName = "constructor " + classType.name;
          if (void 0 === classType.registeredClass.constructor_body) {
            classType.registeredClass.constructor_body = [];
          }
          if (void 0 !== classType.registeredClass.constructor_body[argCount - 1]) {
            throw new BindingError("Cannot register multiple constructors with identical number of parameters (" + (argCount - 1) + ") for class '" + classType.name + "'! Overload resolution is currently only performed using the parameter count, not actual type info!");
          }
          classType.registeredClass.constructor_body[argCount - 1] = () => {
            throwUnboundTypeError("Cannot construct " + classType.name + " due to unbound types", rawArgTypes);
          };
          whenDependentTypesAreResolved([], rawArgTypes, function(argTypes) {
            argTypes.splice(1, 0, null);
            classType.registeredClass.constructor_body[argCount - 1] = craftInvokerFunction(humanName, argTypes, null, invoker, rawConstructor);
            return [];
          });
          return [];
        });
      }
      function validateThis(this_, classType, humanName) {
        if (!(this_ instanceof Object)) {
          throwBindingError(humanName + ' with invalid "this": ' + this_);
        }
        if (!(this_ instanceof classType.registeredClass.constructor)) {
          throwBindingError(humanName + ' incompatible with "this" of type ' + this_.constructor.name);
        }
        if (!this_.$$.ptr) {
          throwBindingError("cannot call emscripten binding method " + humanName + " on deleted object");
        }
        return upcastPointer(this_.$$.ptr, this_.$$.ptrType.registeredClass, classType.registeredClass);
      }
      function __embind_register_class_property(classType, fieldName, getterReturnType, getterSignature, getter, getterContext, setterArgumentType, setterSignature, setter, setterContext) {
        fieldName = readLatin1String(fieldName);
        getter = embind__requireFunction(getterSignature, getter);
        whenDependentTypesAreResolved([], [classType], function(classType2) {
          classType2 = classType2[0];
          var humanName = classType2.name + "." + fieldName;
          var desc = {
            get: function() {
              throwUnboundTypeError("Cannot access " + humanName + " due to unbound types", [getterReturnType, setterArgumentType]);
            },
            enumerable: true,
            configurable: true
          };
          if (setter) {
            desc.set = () => {
              throwUnboundTypeError("Cannot access " + humanName + " due to unbound types", [getterReturnType, setterArgumentType]);
            };
          } else {
            desc.set = (v) => {
              throwBindingError(humanName + " is a read-only property");
            };
          }
          Object.defineProperty(classType2.registeredClass.instancePrototype, fieldName, desc);
          whenDependentTypesAreResolved([], setter ? [getterReturnType, setterArgumentType] : [getterReturnType], function(types) {
            var getterReturnType2 = types[0];
            var desc2 = {
              get: function() {
                var ptr = validateThis(this, classType2, humanName + " getter");
                return getterReturnType2["fromWireType"](getter(getterContext, ptr));
              },
              enumerable: true
            };
            if (setter) {
              setter = embind__requireFunction(setterSignature, setter);
              var setterArgumentType2 = types[1];
              desc2.set = function(v) {
                var ptr = validateThis(this, classType2, humanName + " setter");
                var destructors = [];
                setter(setterContext, ptr, setterArgumentType2["toWireType"](destructors, v));
                runDestructors(destructors);
              };
            }
            Object.defineProperty(classType2.registeredClass.instancePrototype, fieldName, desc2);
            return [];
          });
          return [];
        });
      }
      var emval_free_list = [];
      var emval_handle_array = [{}, { value: void 0 }, { value: null }, { value: true }, { value: false }];
      function __emval_decref(handle) {
        if (handle > 4 && 0 === --emval_handle_array[handle].refcount) {
          emval_handle_array[handle] = void 0;
          emval_free_list.push(handle);
        }
      }
      function count_emval_handles() {
        var count = 0;
        for (var i = 5; i < emval_handle_array.length; ++i) {
          if (emval_handle_array[i] !== void 0) {
            ++count;
          }
        }
        return count;
      }
      function get_first_emval() {
        for (var i = 5; i < emval_handle_array.length; ++i) {
          if (emval_handle_array[i] !== void 0) {
            return emval_handle_array[i];
          }
        }
        return null;
      }
      function init_emval() {
        Module2["count_emval_handles"] = count_emval_handles;
        Module2["get_first_emval"] = get_first_emval;
      }
      var Emval = { toValue: (handle) => {
        if (!handle) {
          throwBindingError("Cannot use deleted val. handle = " + handle);
        }
        return emval_handle_array[handle].value;
      }, toHandle: (value) => {
        switch (value) {
          case void 0:
            return 1;
          case null:
            return 2;
          case true:
            return 3;
          case false:
            return 4;
          default: {
            var handle = emval_free_list.length ? emval_free_list.pop() : emval_handle_array.length;
            emval_handle_array[handle] = { refcount: 1, value };
            return handle;
          }
        }
      } };
      function __embind_register_emval(rawType, name) {
        name = readLatin1String(name);
        registerType(rawType, {
          name,
          "fromWireType": function(handle) {
            var rv = Emval.toValue(handle);
            __emval_decref(handle);
            return rv;
          },
          "toWireType": function(destructors, value) {
            return Emval.toHandle(value);
          },
          "argPackAdvance": 8,
          "readValueFromPointer": simpleReadValueFromPointer,
          destructorFunction: null
          // This type does not need a destructor
          // TODO: do we need a deleteObject here?  write a test where
          // emval is passed into JS via an interface
        });
      }
      function embindRepr(v) {
        if (v === null) {
          return "null";
        }
        var t = typeof v;
        if (t === "object" || t === "array" || t === "function") {
          return v.toString();
        } else {
          return "" + v;
        }
      }
      function floatReadValueFromPointer(name, shift) {
        switch (shift) {
          case 2:
            return function(pointer) {
              return this["fromWireType"](HEAPF32[pointer >> 2]);
            };
          case 3:
            return function(pointer) {
              return this["fromWireType"](HEAPF64[pointer >> 3]);
            };
          default:
            throw new TypeError("Unknown float type: " + name);
        }
      }
      function __embind_register_float(rawType, name, size) {
        var shift = getShiftFromSize(size);
        name = readLatin1String(name);
        registerType(rawType, {
          name,
          "fromWireType": function(value) {
            return value;
          },
          "toWireType": function(destructors, value) {
            if (typeof value != "number" && typeof value != "boolean") {
              throw new TypeError('Cannot convert "' + embindRepr(value) + '" to ' + this.name);
            }
            return value;
          },
          "argPackAdvance": 8,
          "readValueFromPointer": floatReadValueFromPointer(name, shift),
          destructorFunction: null
          // This type does not need a destructor
        });
      }
      function __embind_register_function(name, argCount, rawArgTypesAddr, signature, rawInvoker, fn, isAsync) {
        var argTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
        name = readLatin1String(name);
        rawInvoker = embind__requireFunction(signature, rawInvoker);
        exposePublicSymbol(name, function() {
          throwUnboundTypeError("Cannot call " + name + " due to unbound types", argTypes);
        }, argCount - 1);
        whenDependentTypesAreResolved([], argTypes, function(argTypes2) {
          var invokerArgsArray = [
            argTypes2[0],
            null
            /* no class 'this'*/
          ].concat(
            argTypes2.slice(1)
            /* actual params */
          );
          replacePublicSymbol(name, craftInvokerFunction(name, invokerArgsArray, null, rawInvoker, fn, isAsync), argCount - 1);
          return [];
        });
      }
      function integerReadValueFromPointer(name, shift, signed) {
        switch (shift) {
          case 0:
            return signed ? function readS8FromPointer(pointer) {
              return HEAP8[pointer];
            } : function readU8FromPointer(pointer) {
              return HEAPU8[pointer];
            };
          case 1:
            return signed ? function readS16FromPointer(pointer) {
              return HEAP16[pointer >> 1];
            } : function readU16FromPointer(pointer) {
              return HEAPU16[pointer >> 1];
            };
          case 2:
            return signed ? function readS32FromPointer(pointer) {
              return HEAP32[pointer >> 2];
            } : function readU32FromPointer(pointer) {
              return HEAPU32[pointer >> 2];
            };
          default:
            throw new TypeError("Unknown integer type: " + name);
        }
      }
      function __embind_register_integer(primitiveType, name, size, minRange, maxRange) {
        name = readLatin1String(name);
        if (maxRange === -1) {
          maxRange = 4294967295;
        }
        var shift = getShiftFromSize(size);
        var fromWireType = (value) => value;
        if (minRange === 0) {
          var bitshift = 32 - 8 * size;
          fromWireType = (value) => value << bitshift >>> bitshift;
        }
        var isUnsignedType = name.includes("unsigned");
        var checkAssertions = (value, toTypeName) => {
          if (typeof value != "number" && typeof value != "boolean") {
            throw new TypeError('Cannot convert "' + embindRepr(value) + '" to ' + toTypeName);
          }
          if (value < minRange || value > maxRange) {
            throw new TypeError('Passing a number "' + embindRepr(value) + '" from JS side to C/C++ side to an argument of type "' + name + '", which is outside the valid range [' + minRange + ", " + maxRange + "]!");
          }
        };
        var toWireType;
        if (isUnsignedType) {
          toWireType = function(destructors, value) {
            checkAssertions(value, this.name);
            return value >>> 0;
          };
        } else {
          toWireType = function(destructors, value) {
            checkAssertions(value, this.name);
            return value;
          };
        }
        registerType(primitiveType, {
          name,
          "fromWireType": fromWireType,
          "toWireType": toWireType,
          "argPackAdvance": 8,
          "readValueFromPointer": integerReadValueFromPointer(name, shift, minRange !== 0),
          destructorFunction: null
          // This type does not need a destructor
        });
      }
      function __embind_register_memory_view(rawType, dataTypeIndex, name) {
        var typeMapping = [
          Int8Array,
          Uint8Array,
          Int16Array,
          Uint16Array,
          Int32Array,
          Uint32Array,
          Float32Array,
          Float64Array
        ];
        var TA = typeMapping[dataTypeIndex];
        function decodeMemoryView(handle) {
          handle = handle >> 2;
          var heap = HEAPU32;
          var size = heap[handle];
          var data = heap[handle + 1];
          return new TA(heap.buffer, data, size);
        }
        name = readLatin1String(name);
        registerType(rawType, {
          name,
          "fromWireType": decodeMemoryView,
          "argPackAdvance": 8,
          "readValueFromPointer": decodeMemoryView
        }, {
          ignoreDuplicateRegistrations: true
        });
      }
      function __embind_register_std_string(rawType, name) {
        name = readLatin1String(name);
        var stdStringIsUTF8 = name === "std::string";
        registerType(rawType, {
          name,
          "fromWireType": function(value) {
            var length = HEAPU32[value >> 2];
            var payload = value + 4;
            var str;
            if (stdStringIsUTF8) {
              var decodeStartPtr = payload;
              for (var i = 0; i <= length; ++i) {
                var currentBytePtr = payload + i;
                if (i == length || HEAPU8[currentBytePtr] == 0) {
                  var maxRead = currentBytePtr - decodeStartPtr;
                  var stringSegment = UTF8ToString(decodeStartPtr, maxRead);
                  if (str === void 0) {
                    str = stringSegment;
                  } else {
                    str += String.fromCharCode(0);
                    str += stringSegment;
                  }
                  decodeStartPtr = currentBytePtr + 1;
                }
              }
            } else {
              var a = new Array(length);
              for (var i = 0; i < length; ++i) {
                a[i] = String.fromCharCode(HEAPU8[payload + i]);
              }
              str = a.join("");
            }
            _free(value);
            return str;
          },
          "toWireType": function(destructors, value) {
            if (value instanceof ArrayBuffer) {
              value = new Uint8Array(value);
            }
            var length;
            var valueIsOfTypeString = typeof value == "string";
            if (!(valueIsOfTypeString || value instanceof Uint8Array || value instanceof Uint8ClampedArray || value instanceof Int8Array)) {
              throwBindingError("Cannot pass non-string to std::string");
            }
            if (stdStringIsUTF8 && valueIsOfTypeString) {
              length = lengthBytesUTF8(value);
            } else {
              length = value.length;
            }
            var base = _malloc(4 + length + 1);
            var ptr = base + 4;
            HEAPU32[base >> 2] = length;
            if (stdStringIsUTF8 && valueIsOfTypeString) {
              stringToUTF8(value, ptr, length + 1);
            } else {
              if (valueIsOfTypeString) {
                for (var i = 0; i < length; ++i) {
                  var charCode = value.charCodeAt(i);
                  if (charCode > 255) {
                    _free(ptr);
                    throwBindingError("String has UTF-16 code units that do not fit in 8 bits");
                  }
                  HEAPU8[ptr + i] = charCode;
                }
              } else {
                for (var i = 0; i < length; ++i) {
                  HEAPU8[ptr + i] = value[i];
                }
              }
            }
            if (destructors !== null) {
              destructors.push(_free, base);
            }
            return base;
          },
          "argPackAdvance": 8,
          "readValueFromPointer": simpleReadValueFromPointer,
          destructorFunction: function(ptr) {
            _free(ptr);
          }
        });
      }
      var UTF16Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf-16le") : void 0;
      function UTF16ToString(ptr, maxBytesToRead) {
        assert(ptr % 2 == 0, "Pointer passed to UTF16ToString must be aligned to two bytes!");
        var endPtr = ptr;
        var idx = endPtr >> 1;
        var maxIdx = idx + maxBytesToRead / 2;
        while (!(idx >= maxIdx) && HEAPU16[idx])
          ++idx;
        endPtr = idx << 1;
        if (endPtr - ptr > 32 && UTF16Decoder)
          return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
        var str = "";
        for (var i = 0; !(i >= maxBytesToRead / 2); ++i) {
          var codeUnit = HEAP16[ptr + i * 2 >> 1];
          if (codeUnit == 0)
            break;
          str += String.fromCharCode(codeUnit);
        }
        return str;
      }
      function stringToUTF16(str, outPtr, maxBytesToWrite) {
        assert(outPtr % 2 == 0, "Pointer passed to stringToUTF16 must be aligned to two bytes!");
        assert(typeof maxBytesToWrite == "number", "stringToUTF16(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");
        if (maxBytesToWrite === void 0) {
          maxBytesToWrite = 2147483647;
        }
        if (maxBytesToWrite < 2)
          return 0;
        maxBytesToWrite -= 2;
        var startPtr = outPtr;
        var numCharsToWrite = maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length;
        for (var i = 0; i < numCharsToWrite; ++i) {
          var codeUnit = str.charCodeAt(i);
          HEAP16[outPtr >> 1] = codeUnit;
          outPtr += 2;
        }
        HEAP16[outPtr >> 1] = 0;
        return outPtr - startPtr;
      }
      function lengthBytesUTF16(str) {
        return str.length * 2;
      }
      function UTF32ToString(ptr, maxBytesToRead) {
        assert(ptr % 4 == 0, "Pointer passed to UTF32ToString must be aligned to four bytes!");
        var i = 0;
        var str = "";
        while (!(i >= maxBytesToRead / 4)) {
          var utf32 = HEAP32[ptr + i * 4 >> 2];
          if (utf32 == 0)
            break;
          ++i;
          if (utf32 >= 65536) {
            var ch = utf32 - 65536;
            str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
          } else {
            str += String.fromCharCode(utf32);
          }
        }
        return str;
      }
      function stringToUTF32(str, outPtr, maxBytesToWrite) {
        assert(outPtr % 4 == 0, "Pointer passed to stringToUTF32 must be aligned to four bytes!");
        assert(typeof maxBytesToWrite == "number", "stringToUTF32(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");
        if (maxBytesToWrite === void 0) {
          maxBytesToWrite = 2147483647;
        }
        if (maxBytesToWrite < 4)
          return 0;
        var startPtr = outPtr;
        var endPtr = startPtr + maxBytesToWrite - 4;
        for (var i = 0; i < str.length; ++i) {
          var codeUnit = str.charCodeAt(i);
          if (codeUnit >= 55296 && codeUnit <= 57343) {
            var trailSurrogate = str.charCodeAt(++i);
            codeUnit = 65536 + ((codeUnit & 1023) << 10) | trailSurrogate & 1023;
          }
          HEAP32[outPtr >> 2] = codeUnit;
          outPtr += 4;
          if (outPtr + 4 > endPtr)
            break;
        }
        HEAP32[outPtr >> 2] = 0;
        return outPtr - startPtr;
      }
      function lengthBytesUTF32(str) {
        var len = 0;
        for (var i = 0; i < str.length; ++i) {
          var codeUnit = str.charCodeAt(i);
          if (codeUnit >= 55296 && codeUnit <= 57343)
            ++i;
          len += 4;
        }
        return len;
      }
      function __embind_register_std_wstring(rawType, charSize, name) {
        name = readLatin1String(name);
        var decodeString, encodeString, getHeap, lengthBytesUTF, shift;
        if (charSize === 2) {
          decodeString = UTF16ToString;
          encodeString = stringToUTF16;
          lengthBytesUTF = lengthBytesUTF16;
          getHeap = () => HEAPU16;
          shift = 1;
        } else if (charSize === 4) {
          decodeString = UTF32ToString;
          encodeString = stringToUTF32;
          lengthBytesUTF = lengthBytesUTF32;
          getHeap = () => HEAPU32;
          shift = 2;
        }
        registerType(rawType, {
          name,
          "fromWireType": function(value) {
            var length = HEAPU32[value >> 2];
            var HEAP = getHeap();
            var str;
            var decodeStartPtr = value + 4;
            for (var i = 0; i <= length; ++i) {
              var currentBytePtr = value + 4 + i * charSize;
              if (i == length || HEAP[currentBytePtr >> shift] == 0) {
                var maxReadBytes = currentBytePtr - decodeStartPtr;
                var stringSegment = decodeString(decodeStartPtr, maxReadBytes);
                if (str === void 0) {
                  str = stringSegment;
                } else {
                  str += String.fromCharCode(0);
                  str += stringSegment;
                }
                decodeStartPtr = currentBytePtr + charSize;
              }
            }
            _free(value);
            return str;
          },
          "toWireType": function(destructors, value) {
            if (!(typeof value == "string")) {
              throwBindingError("Cannot pass non-string to C++ string type " + name);
            }
            var length = lengthBytesUTF(value);
            var ptr = _malloc(4 + length + charSize);
            HEAPU32[ptr >> 2] = length >> shift;
            encodeString(value, ptr + 4, length + charSize);
            if (destructors !== null) {
              destructors.push(_free, ptr);
            }
            return ptr;
          },
          "argPackAdvance": 8,
          "readValueFromPointer": simpleReadValueFromPointer,
          destructorFunction: function(ptr) {
            _free(ptr);
          }
        });
      }
      function __embind_register_void(rawType, name) {
        name = readLatin1String(name);
        registerType(rawType, {
          isVoid: true,
          name,
          "argPackAdvance": 0,
          "fromWireType": function() {
            return void 0;
          },
          "toWireType": function(destructors, o) {
            return void 0;
          }
        });
      }
      function _abort() {
        abort("native code called abort()");
      }
      function _emscripten_memcpy_big(dest, src, num) {
        HEAPU8.copyWithin(dest, src, src + num);
      }
      function getHeapMax() {
        return 2147483648;
      }
      function emscripten_realloc_buffer(size) {
        var b = wasmMemory.buffer;
        try {
          wasmMemory.grow(size - b.byteLength + 65535 >>> 16);
          updateMemoryViews();
          return 1;
        } catch (e) {
          err("emscripten_realloc_buffer: Attempted to grow heap from " + b.byteLength + " bytes to " + size + " bytes, but got error: " + e);
        }
      }
      function _emscripten_resize_heap(requestedSize) {
        var oldSize = HEAPU8.length;
        requestedSize = requestedSize >>> 0;
        assert(requestedSize > oldSize);
        var maxHeapSize = getHeapMax();
        if (requestedSize > maxHeapSize) {
          err("Cannot enlarge memory, asked to go up to " + requestedSize + " bytes, but the limit is " + maxHeapSize + " bytes!");
          return false;
        }
        let alignUp = (x, multiple) => x + (multiple - x % multiple) % multiple;
        for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
          var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
          overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
          var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
          var replacement = emscripten_realloc_buffer(newSize);
          if (replacement) {
            return true;
          }
        }
        err("Failed to grow the heap from " + oldSize + " bytes to " + newSize + " bytes, not enough memory!");
        return false;
      }
      function _fd_close(fd) {
        abort("fd_close called without SYSCALLS_REQUIRE_FILESYSTEM");
      }
      function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
        return 70;
      }
      var printCharBuffers = [null, [], []];
      function printChar(stream, curr) {
        var buffer = printCharBuffers[stream];
        assert(buffer);
        if (curr === 0 || curr === 10) {
          (stream === 1 ? out : err)(UTF8ArrayToString(buffer, 0));
          buffer.length = 0;
        } else {
          buffer.push(curr);
        }
      }
      function _fd_write(fd, iov, iovcnt, pnum) {
        var num = 0;
        for (var i = 0; i < iovcnt; i++) {
          var ptr = HEAPU32[iov >> 2];
          var len = HEAPU32[iov + 4 >> 2];
          iov += 8;
          for (var j = 0; j < len; j++) {
            printChar(fd, HEAPU8[ptr + j]);
          }
          num += len;
        }
        HEAPU32[pnum >> 2] = num;
        return 0;
      }
      embind_init_charCodes();
      BindingError = Module2["BindingError"] = extendError(Error, "BindingError");
      InternalError = Module2["InternalError"] = extendError(Error, "InternalError");
      init_ClassHandle();
      init_embind();
      init_RegisteredPointer();
      UnboundTypeError = Module2["UnboundTypeError"] = extendError(Error, "UnboundTypeError");
      init_emval();
      function checkIncomingModuleAPI() {
        ignoredModuleProp("fetchSettings");
      }
      var wasmImports = {
        "_embind_register_bigint": __embind_register_bigint,
        "_embind_register_bool": __embind_register_bool,
        "_embind_register_class": __embind_register_class,
        "_embind_register_class_constructor": __embind_register_class_constructor,
        "_embind_register_class_property": __embind_register_class_property,
        "_embind_register_emval": __embind_register_emval,
        "_embind_register_float": __embind_register_float,
        "_embind_register_function": __embind_register_function,
        "_embind_register_integer": __embind_register_integer,
        "_embind_register_memory_view": __embind_register_memory_view,
        "_embind_register_std_string": __embind_register_std_string,
        "_embind_register_std_wstring": __embind_register_std_wstring,
        "_embind_register_void": __embind_register_void,
        "abort": _abort,
        "emscripten_memcpy_big": _emscripten_memcpy_big,
        "emscripten_resize_heap": _emscripten_resize_heap,
        "fd_close": _fd_close,
        "fd_seek": _fd_seek,
        "fd_write": _fd_write
      };
      createWasm();
      var _free = createExportWrapper("free");
      var ___getTypeName = Module2["___getTypeName"] = createExportWrapper("__getTypeName");
      Module2["__embind_initialize_bindings"] = createExportWrapper("_embind_initialize_bindings");
      Module2["_fflush"] = createExportWrapper("fflush");
      var _malloc = createExportWrapper("malloc");
      var _emscripten_stack_init = function() {
        return (_emscripten_stack_init = Module2["asm"]["emscripten_stack_init"]).apply(null, arguments);
      };
      var _emscripten_stack_get_end = function() {
        return (_emscripten_stack_get_end = Module2["asm"]["emscripten_stack_get_end"]).apply(null, arguments);
      };
      Module2["dynCall_jiji"] = createExportWrapper("dynCall_jiji");
      var missingLibrarySymbols = [
        "zeroMemory",
        "stringToNewUTF8",
        "exitJS",
        "setErrNo",
        "inetPton4",
        "inetNtop4",
        "inetPton6",
        "inetNtop6",
        "readSockaddr",
        "writeSockaddr",
        "getHostByName",
        "getRandomDevice",
        "traverseStack",
        "convertPCtoSourceLocation",
        "readEmAsmArgs",
        "jstoi_q",
        "jstoi_s",
        "getExecutableName",
        "listenOnce",
        "autoResumeAudioContext",
        "handleException",
        "runtimeKeepalivePush",
        "runtimeKeepalivePop",
        "callUserCallback",
        "maybeExit",
        "safeSetTimeout",
        "asmjsMangle",
        "asyncLoad",
        "alignMemory",
        "mmapAlloc",
        "HandleAllocator",
        "getNativeTypeSize",
        "STACK_SIZE",
        "STACK_ALIGN",
        "POINTER_SIZE",
        "ASSERTIONS",
        "writeI53ToI64",
        "writeI53ToI64Clamped",
        "writeI53ToI64Signaling",
        "writeI53ToU64Clamped",
        "writeI53ToU64Signaling",
        "readI53FromI64",
        "readI53FromU64",
        "convertI32PairToI53",
        "convertU32PairToI53",
        "getCFunc",
        "ccall",
        "cwrap",
        "uleb128Encode",
        "sigToWasmTypes",
        "generateFuncType",
        "convertJsFunctionToWasm",
        "getEmptyTableSlot",
        "updateTableMap",
        "getFunctionAddress",
        "addFunction",
        "removeFunction",
        "reallyNegative",
        "unSign",
        "strLen",
        "reSign",
        "formatString",
        "intArrayFromString",
        "intArrayToString",
        "AsciiToString",
        "stringToAscii",
        "allocateUTF8",
        "allocateUTF8OnStack",
        "writeStringToMemory",
        "writeArrayToMemory",
        "writeAsciiToMemory",
        "getSocketFromFD",
        "getSocketAddress",
        "registerKeyEventCallback",
        "maybeCStringToJsString",
        "findEventTarget",
        "findCanvasEventTarget",
        "getBoundingClientRect",
        "fillMouseEventData",
        "registerMouseEventCallback",
        "registerWheelEventCallback",
        "registerUiEventCallback",
        "registerFocusEventCallback",
        "fillDeviceOrientationEventData",
        "registerDeviceOrientationEventCallback",
        "fillDeviceMotionEventData",
        "registerDeviceMotionEventCallback",
        "screenOrientation",
        "fillOrientationChangeEventData",
        "registerOrientationChangeEventCallback",
        "fillFullscreenChangeEventData",
        "registerFullscreenChangeEventCallback",
        "JSEvents_requestFullscreen",
        "JSEvents_resizeCanvasForFullscreen",
        "registerRestoreOldStyle",
        "hideEverythingExceptGivenElement",
        "restoreHiddenElements",
        "setLetterbox",
        "softFullscreenResizeWebGLRenderTarget",
        "doRequestFullscreen",
        "fillPointerlockChangeEventData",
        "registerPointerlockChangeEventCallback",
        "registerPointerlockErrorEventCallback",
        "requestPointerLock",
        "fillVisibilityChangeEventData",
        "registerVisibilityChangeEventCallback",
        "registerTouchEventCallback",
        "fillGamepadEventData",
        "registerGamepadEventCallback",
        "registerBeforeUnloadEventCallback",
        "fillBatteryEventData",
        "battery",
        "registerBatteryEventCallback",
        "setCanvasElementSize",
        "getCanvasElementSize",
        "demangle",
        "demangleAll",
        "jsStackTrace",
        "stackTrace",
        "getEnvStrings",
        "checkWasiClock",
        "createDyncallWrapper",
        "setImmediateWrapped",
        "clearImmediateWrapped",
        "polyfillSetImmediate",
        "getPromise",
        "makePromise",
        "makePromiseCallback",
        "ExceptionInfo",
        "exception_addRef",
        "exception_decRef",
        "setMainLoop",
        "_setNetworkCallback",
        "heapObjectForWebGLType",
        "heapAccessShiftForWebGLHeap",
        "emscriptenWebGLGet",
        "computeUnpackAlignedImageSize",
        "emscriptenWebGLGetTexPixelData",
        "emscriptenWebGLGetUniform",
        "webglGetUniformLocation",
        "webglPrepareUniformLocationsBeforeFirstUse",
        "webglGetLeftBracePos",
        "emscriptenWebGLGetVertexAttrib",
        "writeGLArray",
        "SDL_unicode",
        "SDL_ttfContext",
        "SDL_audio",
        "GLFW_Window",
        "runAndAbortIfError",
        "ALLOC_NORMAL",
        "ALLOC_STACK",
        "allocate",
        "registerInheritedInstance",
        "unregisterInheritedInstance",
        "requireRegisteredType",
        "enumReadValueFromPointer",
        "getStringOrSymbol",
        "craftEmvalAllocator",
        "emval_get_global",
        "emval_lookupTypes",
        "emval_allocateDestructors",
        "emval_addMethodCaller"
      ];
      missingLibrarySymbols.forEach(missingLibrarySymbol);
      var unexportedSymbols = [
        "run",
        "UTF8ArrayToString",
        "UTF8ToString",
        "stringToUTF8Array",
        "stringToUTF8",
        "lengthBytesUTF8",
        "addOnPreRun",
        "addOnInit",
        "addOnPreMain",
        "addOnExit",
        "addOnPostRun",
        "addRunDependency",
        "removeRunDependency",
        "FS_createFolder",
        "FS_createPath",
        "FS_createDataFile",
        "FS_createPreloadedFile",
        "FS_createLazyFile",
        "FS_createLink",
        "FS_createDevice",
        "FS_unlink",
        "out",
        "err",
        "callMain",
        "abort",
        "keepRuntimeAlive",
        "wasmMemory",
        "stackAlloc",
        "stackSave",
        "stackRestore",
        "getTempRet0",
        "setTempRet0",
        "writeStackCookie",
        "checkStackCookie",
        "ptrToString",
        "getHeapMax",
        "emscripten_realloc_buffer",
        "ENV",
        "ERRNO_CODES",
        "ERRNO_MESSAGES",
        "DNS",
        "Protocols",
        "Sockets",
        "timers",
        "warnOnce",
        "UNWIND_CACHE",
        "readEmAsmArgsArray",
        "dynCallLegacy",
        "getDynCaller",
        "dynCall",
        "convertI32PairToI53Checked",
        "freeTableIndexes",
        "functionsInTableMap",
        "setValue",
        "getValue",
        "PATH",
        "PATH_FS",
        "UTF16Decoder",
        "UTF16ToString",
        "stringToUTF16",
        "lengthBytesUTF16",
        "UTF32ToString",
        "stringToUTF32",
        "lengthBytesUTF32",
        "SYSCALLS",
        "JSEvents",
        "specialHTMLTargets",
        "currentFullscreenStrategy",
        "restoreOldWindowedStyle",
        "ExitStatus",
        "flush_NO_FILESYSTEM",
        "dlopenMissingError",
        "promiseMap",
        "uncaughtExceptionCount",
        "exceptionLast",
        "exceptionCaught",
        "Browser",
        "wget",
        "FS",
        "MEMFS",
        "TTY",
        "PIPEFS",
        "SOCKFS",
        "tempFixedLengthArray",
        "miniTempWebGLFloatBuffers",
        "GL",
        "AL",
        "SDL",
        "SDL_gfx",
        "GLUT",
        "EGL",
        "GLFW",
        "GLEW",
        "IDBStore",
        "InternalError",
        "BindingError",
        "UnboundTypeError",
        "PureVirtualError",
        "init_embind",
        "throwInternalError",
        "throwBindingError",
        "throwUnboundTypeError",
        "ensureOverloadTable",
        "exposePublicSymbol",
        "replacePublicSymbol",
        "extendError",
        "createNamedFunction",
        "embindRepr",
        "registeredInstances",
        "getBasestPointer",
        "getInheritedInstance",
        "getInheritedInstanceCount",
        "getLiveInheritedInstances",
        "registeredTypes",
        "awaitingDependencies",
        "typeDependencies",
        "registeredPointers",
        "registerType",
        "whenDependentTypesAreResolved",
        "embind_charCodes",
        "embind_init_charCodes",
        "readLatin1String",
        "getTypeName",
        "heap32VectorToArray",
        "getShiftFromSize",
        "integerReadValueFromPointer",
        "floatReadValueFromPointer",
        "simpleReadValueFromPointer",
        "runDestructors",
        "new_",
        "craftInvokerFunction",
        "embind__requireFunction",
        "tupleRegistrations",
        "structRegistrations",
        "genericPointerToWireType",
        "constNoSmartPtrRawPointerToWireType",
        "nonConstNoSmartPtrRawPointerToWireType",
        "init_RegisteredPointer",
        "RegisteredPointer",
        "RegisteredPointer_getPointee",
        "RegisteredPointer_destructor",
        "RegisteredPointer_deleteObject",
        "RegisteredPointer_fromWireType",
        "runDestructor",
        "releaseClassHandle",
        "finalizationRegistry",
        "detachFinalizer_deps",
        "detachFinalizer",
        "attachFinalizer",
        "makeClassHandle",
        "init_ClassHandle",
        "ClassHandle",
        "ClassHandle_isAliasOf",
        "throwInstanceAlreadyDeleted",
        "ClassHandle_clone",
        "ClassHandle_delete",
        "deletionQueue",
        "ClassHandle_isDeleted",
        "ClassHandle_deleteLater",
        "flushPendingDeletes",
        "delayFunction",
        "setDelayFunction",
        "RegisteredClass",
        "shallowCopyInternalPointer",
        "downcastPointer",
        "upcastPointer",
        "validateThis",
        "char_0",
        "char_9",
        "makeLegalFunctionName",
        "emval_handle_array",
        "emval_free_list",
        "emval_symbols",
        "init_emval",
        "count_emval_handles",
        "get_first_emval",
        "Emval",
        "emval_newers",
        "emval_methodCallers",
        "emval_registeredMethods"
      ];
      unexportedSymbols.forEach(unexportedRuntimeSymbol);
      var calledRun;
      dependenciesFulfilled = function runCaller() {
        if (!calledRun)
          run();
        if (!calledRun)
          dependenciesFulfilled = runCaller;
      };
      function stackCheckInit() {
        _emscripten_stack_init();
        writeStackCookie();
      }
      function run() {
        if (runDependencies > 0) {
          return;
        }
        stackCheckInit();
        preRun();
        if (runDependencies > 0) {
          return;
        }
        function doRun() {
          if (calledRun)
            return;
          calledRun = true;
          Module2["calledRun"] = true;
          if (ABORT)
            return;
          initRuntime();
          readyPromiseResolve(Module2);
          if (Module2["onRuntimeInitialized"])
            Module2["onRuntimeInitialized"]();
          assert(!Module2["_main"], 'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]');
          postRun();
        }
        if (Module2["setStatus"]) {
          Module2["setStatus"]("Running...");
          setTimeout(function() {
            setTimeout(function() {
              Module2["setStatus"]("");
            }, 1);
            doRun();
          }, 1);
        } else {
          doRun();
        }
        checkStackCookie();
      }
      if (Module2["preInit"]) {
        if (typeof Module2["preInit"] == "function")
          Module2["preInit"] = [Module2["preInit"]];
        while (Module2["preInit"].length > 0) {
          Module2["preInit"].pop()();
        }
      }
      run();
      return Module2.ready;
    };
  })();
  async function loadWasmBinary(urlOrString) {
    const response = await fetch(urlOrString);
    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  }
  const DefaultWasmBinaryLoader = async () => {
    const url = new URL("./wasm-build/main.wasm", self.location);
    try {
      return await loadWasmBinary(url);
    } catch {
      return await Deno.readFile(url);
    }
  };
  async function runWorker(wasmModuleLoader) {
    const imageProcessor = new ImageProcessor(wasmModuleLoader);
    await imageProcessor.loaded;
    exposeSingleFunction((input) => imageProcessor.processFrameObject(input), "processFrame");
  }
  class ImageProcessor {
    constructor(wasmBinaryLoader = DefaultWasmBinaryLoader) {
      Object.defineProperty(this, "loaded", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "wasmInstance", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      this.loaded = (async () => {
        const wasmBinary = await wasmBinaryLoader();
        this.wasmInstance = await Module({ wasmBinary });
      })();
    }
    async processFrameObject({ inputFrame, start }) {
      const preComputation = new Date().toISOString();
      const inputBitmap4C = this.convertFrameToBitmap4C(inputFrame);
      const response = this.wasmInstance.processFrame(inputBitmap4C);
      const outputFrame = this.convertBitmap4CToFrame(response.output);
      this.wasmInstance.freeMemory();
      const memorySize = this.wasmInstance.HEAPU8.byteLength;
      const postComputation = new Date().toISOString();
      return {
        outputFrame,
        start,
        preComputation,
        postComputation,
        memorySize
      };
    }
    convertFrameToBitmap4C(frame) {
      const bitmap4C = new this.wasmInstance.Bitmap4C(frame.width, frame.height);
      this.wasmInstance.HEAPU8.set(frame.arr, bitmap4C.ptr);
      return bitmap4C;
    }
    convertBitmap4CToFrame({ ptr, width, height }) {
      const byteLength = width * height * 4;
      const arr = new Uint8ClampedArray(this.wasmInstance.HEAPU8.buffer.slice(ptr, ptr + byteLength));
      return { arr, width, height };
    }
  }
  runWorker(() => {
    return loadWasmBinary("main.wasm");
  });
})();
