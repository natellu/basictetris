document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector(".grid")
    let squares = Array.from(document.querySelectorAll(".grid div"))
    const ScoreDisplay = document.querySelector("#score")
    const StartBtn = document.querySelector("#start-button")
    const width = 10
    const GRID_WIDTH = width
    let nextRandom = 0
    let timerId
    let score = 0

    let pressLeft = false
    let pressRight = false
    let pressDown = false
    let pressUp = false

    const colors = ["orange", "red", "purple", "green", "blue"]

    const lTetromino = [
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, 2],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 2],
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2],
        [GRID_WIDTH, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2 + 2]
    ]

    const zTetromino = [
        [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
        [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1],
        [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
        [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1]
    ]

    const tTetromino = [
        [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2],
        [1, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
        [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1]
    ]

    const iTetromino = [
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3],
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3]
    ]

    const theTetrominoes = [
        lTetromino,
        zTetromino,
        tTetromino,
        oTetromino,
        iTetromino
    ]

    let currentPosition = 4
    let currentRotation = 0

    let random = Math.floor(Math.random() * theTetrominoes.length)
    let current = theTetrominoes[random][currentRotation]

    function draw() {
        current.forEach((index) => {
            squares[currentPosition + index].classList.add("tetromino")
            squares[currentPosition + index].style.backgroundColor =
                colors[random]
        })
    }

    function undraw() {
        current.forEach((index) => {
            squares[currentPosition + index].classList.remove("tetromino")
            squares[currentPosition + index].style.backgroundColor = ""
        })
    }

    function control() {
        if (!timerId) {
        } else {
            if (pressLeft) {
                moveLeft()
            } else if (pressUp) {
                rotate()
            } else if (pressRight) {
                moveRight()
            } else if (pressDown) {
                moveDown()
            }
        }
    }

    function controlKeyDown(e) {
        if (e.keyCode === 37) {
            pressLeft = true
        } else if (e.keyCode === 38) {
            pressUp = true
        } else if (e.keyCode === 39) {
            pressRight = true
        } else if (e.keyCode === 40) {
            pressDown = true
        }
        control()
    }
    function controlKeyUp(e) {
        if (e.keyCode === 37) {
            pressLeft = false
        } else if (e.keyCode === 38) {
            pressUp = false
        } else if (e.keyCode === 39) {
            pressRight = false
        } else if (e.keyCode === 40) {
            pressDown = false
        }
    }
    document.addEventListener("keydown", controlKeyDown)
    document.addEventListener("keyup", controlKeyUp)

    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    function freeze() {
        if (
            current.some((index) =>
                squares[currentPosition + index + width].classList.contains(
                    "taken"
                )
            )
        ) {
            current.forEach((index) => {
                squares[currentPosition + index].classList.add("taken")
                console.log("test")
            })
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(
            (index) => (currentPosition + index) % width === 0
        )

        if (!isAtLeftEdge) currentPosition -= 1

        if (
            current.some(
                (index = squares[currentPosition + index].classList.contains(
                    "taken"
                ))
            )
        ) {
            currentPosition += 1
        }
        draw()
    }

    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(
            (index) => (currentPosition + index) % width === width - 1
        )

        if (!isAtRightEdge) currentPosition += 1

        if (
            current.some((index) =>
                squares[currentPosition + index].classList.contains("taken")
            )
        ) {
            currentPosition -= 1
        }
        draw()
    }

    function rotate() {
        undraw()

        currentRotation++
        if (currentRotation === current.length) {
            currentRotation = 0
        }
        current = theTetrominoes[random][currentRotation]
        draw()
    }

    const displaySquares = document.querySelectorAll(".mini-grid div")
    const displayWidth = 4
    let displayIndex = 0

    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2],
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
        [1, displayWidth, displayWidth + 1, displayWidth + 2],
        [0, 1, displayWidth, displayWidth + 1],
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1]
    ]

    function displayShape() {
        displaySquares.forEach((square) => {
            square.classList.remove("tetromino")
            square.style.backgroundColor = ""
        })
        upNextTetrominoes[nextRandom].forEach((index) => {
            displaySquares[displayIndex + index].classList.add("tetromino")
            displaySquares[displayIndex + index].style.backgroundColor =
                colors[nextRandom]
        })
    }

    StartBtn.addEventListener("click", () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown, 500)
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            displayShape()
        }
    })

    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [
                i,
                i + 1,
                i + 2,
                i + 3,
                i + 4,
                i + 5,
                i + 6,
                i + 7,
                i + 8,
                i + 9
            ]
            if (
                row.every((index) => squares[index].classList.contains("taken"))
            ) {
                score += 10
                ScoreDisplay.innerHTML = score
                row.forEach((index) => {
                    squares[index].classList.remove("taken")
                    squares[index].classList.remove("tetromino")
                    squares[index].style.backgroundColor = ""
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach((cell) => grid.appendChild(cell))
            }
        }
    }

    function gameOver() {
        if (
            current.some((index) =>
                squares[currentPosition + index].classList.contains("taken")
            )
        ) {
            ScoreDisplay.innerHTML = "end"
            console.log(timerId)
            clearInterval(timerId)
            timerId = null
            console.log(timerId)
        }
    }
})
