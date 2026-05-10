import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const followerRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const follower = followerRef.current
    if (!cursor || !follower) return

    let mouseX = 0, mouseY = 0
    let followerX = 0, followerY = 0

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      cursor.style.left = mouseX + 'px'
      cursor.style.top = mouseY + 'px'
    }

    const animate = () => {
      followerX += (mouseX - followerX) * 0.12
      followerY += (mouseY - followerY) * 0.12
      follower.style.left = followerX + 'px'
      follower.style.top = followerY + 'px'
      requestAnimationFrame(animate)
    }

    const onMouseEnterLink = () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(2)'
      cursor.style.background = '#22D3EE'
      follower.style.width = '60px'
      follower.style.height = '60px'
      follower.style.borderColor = 'rgba(34,211,238,0.5)'
    }

    const onMouseLeaveLink = () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)'
      cursor.style.background = '#8B5CF6'
      follower.style.width = '36px'
      follower.style.height = '36px'
      follower.style.borderColor = 'rgba(139,92,246,0.5)'
    }

    document.addEventListener('mousemove', onMouseMove)
    animate()

    const addLinkListeners = () => {
      document.querySelectorAll('a, button, [role="button"], .habit-card').forEach(el => {
        el.addEventListener('mouseenter', onMouseEnterLink)
        el.addEventListener('mouseleave', onMouseLeaveLink)
      })
    }

    addLinkListeners()
    const observer = new MutationObserver(addLinkListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div ref={cursorRef} className="cursor hidden md:block" />
      <div ref={followerRef} className="cursor-follower hidden md:block" />
    </>
  )
}
