const displayWorkers = document.getElementById('display-workers')
const displayComputers = document.getElementById('display-computers')
const displayBoard = document.getElementById('display-board')
const displayFiles = document.getElementById('display-files')
const board = document.getElementById("board")
const workerList = document.getElementById('worker-list')
const computerList = document.getElementById('computer-list')
const fileList = document.getElementById('file-list')

board.addEventListener("click", () => {
    board.classList.add("focusing")
    computerList.classList.remove("focusing")
    workerList.classList.remove('focusing')
    fileList.classList.remove('focusing')

    displayBoard.classList.remove('hidden')
    displayComputers.classList.add('hidden')
    displayWorkers.classList.add('hidden')
    displayFiles.classList.add('hidden')
})

workerList.addEventListener("click", () => {
    workerList.classList.add("focusing")
    computerList.classList.remove("focusing")
    board.classList.remove("focusing")
    fileList.classList.remove('focusing')

    displayWorkers.classList.remove('hidden')
    displayComputers.classList.add('hidden')
    displayBoard.classList.add('hidden')
    displayFiles.classList.add('hidden')
})

computerList.addEventListener("click", () => {
    computerList.classList.add("focusing")
    workerList.classList.remove("focusing")
    board.classList.remove("focusing")
    fileList.classList.remove('focusing')

    displayComputers.classList.remove('hidden')
    displayWorkers.classList.add('hidden')
    displayBoard.classList.add('hidden')
    displayFiles.classList.add('hidden')

})

fileList.addEventListener('click', () => {
    fileList.classList.add('focusing')
    computerList.classList.remove("focusing")
    workerList.classList.remove("focusing")
    board.classList.remove("focusing")

    displayFiles.classList.remove('hidden')
    displayComputers.classList.add('hidden')
    displayWorkers.classList.add('hidden')
    displayBoard.classList.add('hidden')
})