const canvas = document.querySelector("canvas")

const c = canvas.getContext("2d")
canvas.width = 1024
canvas.height = 768
const gravity = 1.5

// Classes
class Player {
  constructor({ image }) {
    this.position = {
      x: 100,
      y: 100,
    }

    this.image = image
    this.width = 120
    this.height = 90

    this.speed = 8
    this.velocity = {
      x: 0,
      y: 0,
    }

    this.frames = 0
  }

  draw() {
    c.drawImage(
      this.image,
      98 * this.frames,
      3,
      98,
      56,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    )
  }

  update() {
    this.frames++
    if (this.frames > 8) {
      this.frames = 0
    }
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity
    }
  }
}

class Platform {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    }

    this.image = image
    this.width = image.width
    this.height = image.height
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y)
  }
}

class Scenery {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    }

    this.image = image

    this.width = image.width
    this.height = image.height
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y)
  }
}

// Handle images
function createImage(url) {
  const image = new Image()
  image.onload = function () {}
  image.src = url
  return image
}
const platformImage = createImage("assets/platform.png")

// Initialize objects
let player = new Player({
  image: createImage("assets/sprite_stand_right.png"),
})
let platforms = []
let scenery = []
let scrollOffset
const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
}

// (Re)start game
function init() {
  player = new Player({
    image: createImage("assets/sprite_stand_right.png"),
  })

  platforms = [
    new Platform({
      x: 0,
      y: 768 - platformImage.height,
      image: platformImage,
    }),
    new Platform({
      x: 900,
      y: 768 - 150,
      image: createImage("assets/platform_narrow.png"),
    }),
    new Platform({
      x: platformImage.width,
      y: 768 - platformImage.height,
      image: platformImage,
    }),
    new Platform({
      x: 2 * platformImage.width + 300,
      y: 768 - platformImage.height,
      image: platformImage,
    }),
    new Platform({
      x: 3 * platformImage.width + 450,
      y: 768 - platformImage.height,
      image: platformImage,
    }),

    new Platform({
      x: 4 * platformImage.width + 500,
      y: 768 - platformImage.height - 100,
      image: createImage("assets/platform_narrow.png"),
    }),
    new Platform({
      x: 4 * platformImage.width + 650,
      y: 768 - platformImage.height - 200,
      image: createImage("assets/platform_narrow.png"),
    }),

    new Platform({
      x: 5 * platformImage.width + 500,
      y: 768 - platformImage.height,
      image: platformImage,
    }),
    new Platform({
      x: 6 * platformImage.width + 500,
      y: 768 - platformImage.height,
      image: platformImage,
    }),

    new Platform({
      x: 7 * platformImage.width + 550,
      y: 768 - platformImage.height - 100,
      image: createImage("assets/platform_narrow.png"),
    }),
    new Platform({
      x: 7 * platformImage.width + 700,
      y: 768 - platformImage.height - 200,
      image: createImage("assets/platform_narrow.png"),
    }),
    new Platform({
      x: 7 * platformImage.width + 850,
      y: 768 - platformImage.height - 300,
      image: createImage("assets/platform_narrow.png"),
    }),
    new Platform({
      x: 7 * platformImage.width + 1050,
      y: 768 - platformImage.height - 150,
      image: createImage("assets/platform_narrow.png"),
    }),

    new Platform({
      x: 9 * platformImage.width + 500,
      y: 768 - platformImage.height,
      image: platformImage,
    }),

    new Platform({
      x: 10 * platformImage.width + 700,
      y: 768 - platformImage.height,
      image: createImage("assets/platform_narrow.png"),
    }),

    new Platform({
      x: 11 * platformImage.width + 600,
      y: 768 - platformImage.height,
      image: platformImage,
    }),
    new Platform({
      x: 12 * platformImage.width + 600,
      y: 768 - platformImage.height,
      image: platformImage,
    }),

    new Platform({
      x: 11 * platformImage.width + 800,
      y: 768 - platformImage.height - 200,
      image: createImage("assets/win_text.png"),
    }),
  ]

  scenery = [
    new Scenery({
      x: 0,
      y: 0,
      image: createImage("assets/background.png"),
    }),
  ]

  scrollOffset = 0
}

// Animation loop
function animate() {
  requestAnimationFrame(animate)
  c.fillStyle = "white"
  c.fillRect(0, 0, canvas.width, canvas.height)

  scenery.forEach((item) => {
    item.draw()
  })
  platforms.forEach((platform) => {
    platform.draw()
  })
  player.update()

  // Horizontal movement
  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed
  } else if (
    (keys.left.pressed && player.position.x > 100) ||
    (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)
  ) {
    player.velocity.x = -player.speed
  } else {
    player.velocity.x = 0

    if (keys.right.pressed) {
      scrollOffset += player.speed
      platforms.forEach((platform) => {
        platform.position.x -= player.speed
      })
      scenery.forEach((item) => {
        item.position.x -= player.speed * 0.5
      })
    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= player.speed
      platforms.forEach((platform) => {
        platform.position.x += player.speed
      })
      scenery.forEach((item) => {
        item.position.x += player.speed * 0.5
      })
    }
  }

  // Platform collision detection
  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + 0.9 * player.width >= platform.position.x &&
      player.position.x + 0.1 * player.width <=
        platform.position.x + platform.width
    ) {
      player.velocity.y = 0
    }
  })

  // Win condition
  if (scrollOffset > 10 * platformImage.width + 800) {
    init()
  }

  if (player.position.y > canvas.height) {
    init()
  }
}

init()
animate()

// Event listeners
window.addEventListener("keydown", ({ keyCode, repeat }) => {
  switch (keyCode) {
    case 65: // a (left)
      keys.left.pressed = true
      break
    case 83: // s (down)
      break
    case 68: // d (right)
      keys.right.pressed = true
      break
    case 87: // w (up)
      if (repeat) {
        return
      }
      if (player.velocity.y === 0) {
        player.velocity.y = -25
      }
      break
  }
})

window.addEventListener("keyup", ({ keyCode }) => {
  switch (keyCode) {
    case 65: // a (left)
      keys.left.pressed = false
      break
    case 83: // s (down)
      break
    case 68: // d (right)
      keys.right.pressed = false
      break
    case 87: // w (up)
      break
  }
})

const wBtn = document.getElementById("w-btn")
wBtn.addEventListener("pointerdown", () => {
  if (player.velocity.y === 0) {
    player.velocity.y = -25
  }
})

const aBtn = document.getElementById("a-btn")
aBtn.addEventListener("pointerdown", () => {
  keys.left.pressed = true
})
aBtn.addEventListener("pointerup", () => {
  keys.left.pressed = false
})

const dBtn = document.getElementById("d-btn")
dBtn.addEventListener("pointerdown", () => {
  keys.right.pressed = true
})
dBtn.addEventListener("pointerup", () => {
  keys.right.pressed = false
})

window.oncontextmenu = function (event) {
  event.preventDefault()
  event.stopPropagation()
  return false
}
