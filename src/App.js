import React from "react"
import StartScreen from "./components/StartScreen"
import QuizScreen from "./components/GameScreen"

export default function App() {

  const [showStartScreen, setStartScreen] = React.useState(true)

  function handleStartScreen() {
    setStartScreen(false)
  }



  return (
    <main>
      {showStartScreen ? <StartScreen handleClick={handleStartScreen}/> : <QuizScreen /> }
    </main>
  )
}