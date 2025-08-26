<template>
  <div class="container">
    <div class="" style="text-align: center; margin-bottom: 20px;font-size: 16px;">😧 撞死潭某1.0</div>
    <canvas ref="canvas" class="canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Ball } from '../utils/ball'

// 画布引用
const canvas = ref(null)
let ctx = null
const balls = ref([])
// 动画状态
const isRunning = ref(true)
let animationId = null

// 速度控制
const speed = ref(10)

// 根据速度计算实际移动距离
const speedMultiplier = computed(() => speed.value / 4)

// 处理画布点击事件
const handleCanvasClick = (e) => {
  if (!canvas.value) return

  const rect = canvas.value.getBoundingClientRect()
  // 计算点击位置在Canvas坐标系中的坐标
  const clickX = e.clientX - rect.left
  const clickY = e.clientY - rect.top

  // 计算点击位置与球心的距离
  const distance = Math.sqrt(
    Math.pow(clickX - ball.value.x, 2) + Math.pow(clickY - ball.value.y, 2)
  )

  // 如果距离小于球的半径，则点击在球上
  if (distance <= ball.value.radius) {
    handleBallClick()
    return
  }

  // 否则视为点击画布空白处，切换动画状态
  toggleAnimation()
}

// 清除画布
const clearCanvas = () => {
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
}

const drawBall = () => {
  balls.value.forEach((ball) => {
    ball.drawBall()
  })
}
const updateBall = () => {
  balls.value.forEach((ball) => {
    ball.updateBall()
  })
  checkBallCollision()
}

const checkCollision = () => {
  balls.value.forEach((ball) => {
    ball.checkCollision(canvas.value)
  })
}
const checkBallCollision = () => {
  for (let i = 0; i < balls.value.length; i++) {
    for (let j = i + 1; j < balls.value.length; j++) {
      const ball1 = balls.value[i]
      const ball2 = balls.value[j]

      // 计算两球之间的距离
      const dx = ball2.x - ball1.x
      const dy = ball2.y - ball1.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      // 如果两球相撞
      if (distance < ball1.radius + ball2.radius) {
        // 简单的碰撞处理：交换速度方向
        const tempDx = ball1.dx
        const tempDy = ball1.dy

        ball1.dx = ball2.dx
        ball1.dy = ball2.dy

        ball2.dx = tempDx
        ball2.dy = tempDy

        // 稍微分离两球，避免卡在一起
        const overlap = 0.5 * (distance - ball1.radius - ball2.radius)
        ball1.x -= (overlap * (ball1.x - ball2.x)) / distance
        ball1.y -= (overlap * (ball1.y - ball2.y)) / distance
        ball2.x += (overlap * (ball1.x - ball2.x)) / distance
        ball2.y += (overlap * (ball1.y - ball2.y)) / distance
      }
    }
  }
}

// 动画循环
const animate = () => {
  if (!isRunning.value) return
  clearCanvas()
  checkCollision()
  updateBall()
  drawBall()
  animationId = requestAnimationFrame(animate)
}

// 重置球的位置和速度
const resetBall = () => {
  balls.value.forEach((ball) => {
    ball.resetBall(canvas.value, speedMultiplier.value)
  })
}

// 调整Canvas大小以匹配显示尺寸
const resizeCanvas = () => {
  if (!canvas.value) return

  const canvasEl = canvas.value
  const parent = canvasEl.parentElement

  // 获取显示尺寸
  const displayWidth = parent.clientWidth - 60
  const displayHeight = parent.clientHeight - 60 // 减去控制区域高度

  // 设置Canvas绘图尺寸与显示尺寸一致
  canvasEl.width = displayWidth
  canvasEl.height = displayHeight

  // 重新绘制
  clearCanvas()
  drawBall()
}
// 初始化画布
onMounted(() => {
  const canvasEl = canvas.value
  // 获取绘图上下文
  ctx = canvasEl.getContext('2d')
  const ball1 = new Ball(ctx, 100, 75, 20, speedMultiplier.value)
  const ball2 = new Ball(ctx, 100, 75, 20, speedMultiplier.value)
  const ball3 = new Ball(ctx, 100, 75, 20, speedMultiplier.value)
  const ball4 = new Ball(ctx, 100, 75, 20, speedMultiplier.value)
  const ball5 = new Ball(ctx, 100, 75, 20, speedMultiplier.value)
  balls.value = [ball1, ball2, ball3, ball4, ball5]
  // 初始化尺寸
  resizeCanvas()
  // 监听窗口大小变化
  window.addEventListener('resize', resizeCanvas)

  // 初始位置设为中心
  resetBall()

  // 开始动画
  animate()
})

// 清理动画
onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  width: 100vw;
  height: 100vh;
  padding: 30px;
}

.canvas {
  width: 100%;
  height: calc(100% - 50px);
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
}

.canvas:hover {
  transform: scale(1.01);
}

.controls {
  margin-top: 20px;
  display: flex;
  gap: 15px;
  align-items: center;
}

.control-btn {
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.control-btn:hover {
  background-color: #359e75;
}

.speed-control {
  color: #333;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.speed-slider {
  width: 100px;
}

.info {
  margin-top: 15px;
  color: #666;
  font-size: 14px;
  text-align: center;
}
</style>
