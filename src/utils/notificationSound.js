// Bildirim sesi - Web Audio API ile oluşturulur
export function playNotificationSound() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    
    const playTone = (frequency, startTime, duration) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = frequency
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0, startTime)
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration)
      
      oscillator.start(startTime)
      oscillator.stop(startTime + duration)
    }
    
    const now = audioContext.currentTime
    playTone(587.33, now, 0.2)        // D5
    playTone(880, now + 0.15, 0.3)    // A5  
    playTone(1174.66, now + 0.3, 0.4) // D6
    
  } catch (error) {
    console.warn('Bildirim sesi çalınamadı:', error)
  }
}
