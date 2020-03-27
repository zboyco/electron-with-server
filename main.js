// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const exec = require('child_process').exec

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
  // 运行后台服务子进程
  runExec()
  // 创建窗体
  createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on("will-quit", function () {
  // 判断子进程是否存在，存在就杀掉子进程
  if (workerProcess) {
    workerProcess.kill('SIGHUP')
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// 任何你期望执行的cmd命令，ls都可以
let cmdStr = "./server"
// 执行cmd命令的目录，如果使用cd xx && 上面的命令，这种将会无法正常退出子进程
let cmdPath = "/path/"
// 子进程变量
let workerProcess

function runExec() {
  // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
  workerProcess = exec(cmdStr, { cwd: cmdPath })
  // 不受child_process默认的缓冲区大小的使用方法，没参数也要写上{}：workerProcess = exec(cmdStr, {})

  // 打印正常的后台可执行程序输出
  workerProcess.stdout.on('data', function (data) {
    console.log(data);
  });

  // 打印错误的后台可执行程序输出
  workerProcess.stderr.on('data', function (data) {
    console.log(data);
  });

  // 退出之后的输出
  workerProcess.on('close', function (code) {
    console.log('out code：' + code);
  })
}
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.