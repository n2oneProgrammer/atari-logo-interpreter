const {contextBridge, ipcRenderer} = require('electron');
contextBridge.exposeInMainWorld('logoInterpreter', {
    execute: (commands) => ipcRenderer.send("execute", commands),
    handleCreateLine: (callback) => ipcRenderer.on("create-line", callback),
    getTurtles: () => ipcRenderer.invoke("get-turtles"),
    handleRefreshCanvas: (callback) => ipcRenderer.on("refresh-canvas", callback),
    handleRefreshTurtles: (callback) => ipcRenderer.on("refresh-turtles", callback)
});
