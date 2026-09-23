import { BrowserRouter } from 'react-router-dom'
import '../styles/globals.css'
import { AppRoutes } from './routes'
import { AppShell } from './AppShell'
import { AuthProvider } from './providers/AuthProvider'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell>
          <AppRoutes />
        </AppShell>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
