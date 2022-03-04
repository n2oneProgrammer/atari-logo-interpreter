const {contextBridge, ipcRenderer} = require('electron');
contextBridge.exposeInMainWorld('logoInterpreter', {
    execute: (commands) => ipcRenderer.send("execute", commands),
    handleCreateLine: (callback) => ipcRenderer.on("create-line", callback),
    getTurtles: () => ipcRenderer.invoke("get-turtles"),
    handleRefreshCanvas: (callback) => ipcRenderer.on("refresh-canvas", callback),
    handleRefreshTurtles: (callback) => ipcRenderer.on("refresh-turtles", callback),
    handleClearCanvas: (callback) => ipcRenderer.on("clear-canvas", callback),
    handleAddError: (callback) => ipcRenderer.on("add-error", callback),
    handleAddOutput: (callback) => ipcRenderer.on("add-output", callback),
    handleEditProcedure: (callback) => ipcRenderer.on("edit-procedure", callback),
    saveProcedure: (procedure) => ipcRenderer.invoke("save-procedures", procedure),
    openSaveProcedureDialog: () => ipcRenderer.invoke("open-save-procedure-dialog"),
    openLoadProcedureDialog: () => ipcRenderer.invoke("open-load-procedure-dialog")
});
