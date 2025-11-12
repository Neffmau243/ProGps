import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

// Hacer Pusher disponible globalmente
declare global {
  interface Window {
    Pusher: typeof Pusher
  }
}

window.Pusher = Pusher

// Configurar Laravel Echo con Reverb
export const echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: import.meta.env.VITE_REVERB_PORT,
  wssPort: import.meta.env.VITE_REVERB_PORT,
  forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
  enabledTransports: ['ws', 'wss'],
  disableStats: true,
})

console.log('🔌 Laravel Echo configurado con Reverb')
console.log('📡 WebSocket Host:', import.meta.env.VITE_REVERB_HOST)
console.log('🔑 App Key:', import.meta.env.VITE_REVERB_APP_KEY)

export default echo
