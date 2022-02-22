const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('logoInterpreter', {
    execute: (commands) => ipcRenderer.send("execute", commands),
    handleCreateLine: (callback) => ipcRenderer.on("create-line", callback)
});
