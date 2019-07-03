import '@babel/polyfill'
import 'requestidlecallback-polyfill'
import {
  Engine
} from 'matter-js'

export async function jumpForwardInSimulation(engine, seconds) {
  const times = seconds * 100
  await internal(engine, times)
}

async function internal(engine, times) {
  if (times <= 0) return
  Engine.update(engine, 10)
  
  return new Promise(resolve => {
    requestIdleCallback(async () => {
      await internal(times - 1)
      resolve()
    })
  })
}