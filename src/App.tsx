import { useState } from 'react'
import { DB } from './utils/db'
import HomeScreen from './screens/HomeScreen'
import WorkoutScreen from './screens/workout/WorkoutScreen'
import DataScreen from './screens/DataScreen'
import ConfigScreen from './screens/ConfigScreen'
import Onboarding from './screens/Onboarding'
import type { ScreenName } from './types'

function App() {
  const [screen, setScreen] = useState<ScreenName>('home')
  const [onboarded, setOnboarded] = useState(() => DB.get<boolean>('onboarded', false))

  if (!onboarded) return <Onboarding onDone={() => setOnboarded(true)} />

  return (
    <>
      {screen === 'home'    && <HomeScreen    navigate={setScreen} />}
      {screen === 'workout' && <WorkoutScreen navigate={setScreen} />}
      {screen === 'data'    && <DataScreen    navigate={setScreen} />}
      {screen === 'config'  && <ConfigScreen  navigate={setScreen} />}
    </>
  )
}

export default App
