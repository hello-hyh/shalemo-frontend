// 清新风格的球体颜色配置（包含主体色、高光和阴影）
const ballColors = [
  // 红色系 - 清新珊瑚红
  {
    main: '#FF6B6B', // 主体色：柔和珊瑚红
    highlight: 'rgba(255, 255, 255, 0.7)', // 高光
    shadow: 'rgba(200, 50, 50, 0.3)', // 阴影
  },
  // 绿色系 - 薄荷绿
  {
    main: '#6BCB77', // 主体色：清新薄荷绿
    highlight: 'rgba(255, 255, 255, 0.7)',
    shadow: 'rgba(50, 150, 70, 0.3)',
  },
  // 蓝色系 - 天蓝色
  {
    main: '#4ECDC4', // 主体色：清澈天蓝色
    highlight: 'rgba(255, 255, 255, 0.7)',
    shadow: 'rgba(40, 130, 160, 0.3)',
  },
  // 黄色系 - 柠檬黄
  {
    main: '#FFD166', // 主体色：明亮柠檬黄
    highlight: 'rgba(255, 255, 255, 0.8)', // 黄色高光更亮
    shadow: 'rgba(200, 160, 50, 0.3)',
  },
  // 紫色系 - 淡薰衣草紫
  {
    main: '#A78BFA', // 主体色：柔和薰衣草紫
    highlight: 'rgba(255, 255, 255, 0.7)',
    shadow: 'rgba(90, 60, 150, 0.3)',
  },
]
export class Ball {
  public x: number = 0
  public y: number = 0
  public radius: number = 0
  public speed: number = 0
  public dx: number = 0
  public dy: number = 0
  public ctx: CanvasRenderingContext2D

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    speed: number
  ) {
    this.x = x
    this.y = y
    this.radius = radius
    this.speed = speed
    this.dx = Math.random() * 2 - 1
    this.dy = Math.random() * 2 - 1
    this.ctx = ctx
  }
  // 绘制带阴影和高光的球体
  drawBall = () => {
    const color = ballColors[Math.floor(Math.random() * ballColors.length)]
    // 绘制阴影
    this.ctx.beginPath()
    this.ctx.arc(this.x + 3, this.y + 3, this.radius, 0, Math.PI * 2)
    this.ctx.fillStyle = color.shadow
    this.ctx.fill()

    // 绘制主体
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    this.ctx.fillStyle = color.main
    this.ctx.fill()

    // 绘制高光
    this.ctx.beginPath()
    this.ctx.arc(
      this.x - this.radius * 0.3,
      this.y - this.radius * 0.3,
      this.radius * 0.25,
      0,
      Math.PI * 2
    )
    this.ctx.fillStyle = color.highlight
    this.ctx.fill()
  }
  // 更新球的位置
  updateBall = () => {
    this.x += this.dx * this.speed
    this.y += this.dy * this.speed
  }
  resetBall = (canvas: HTMLCanvasElement, speed: number) => {
    const centerX = canvas.width / (Math.random() * 4 + 1)
    const centerY = canvas.height / (Math.random() * 4 + 1)

    this.x = centerX
    this.y = centerY

    // 随机初始方向
    const angle = Math.random() * Math.PI * 2
    const speedVal = speed

    this.dx = Math.cos(angle) * speedVal
    this.dy = Math.sin(angle) * speedVal
  }

  checkCollision = (canvas: HTMLCanvasElement) => {
    if (!canvas) return
    // 左右边界
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.dx = -this.dx
    }

    // 上下边界
    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
      this.dy = -this.dy
    }
  }
}
