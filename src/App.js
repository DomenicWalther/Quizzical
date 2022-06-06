import React from "react"
import StartScreen from "./components/StartScreen"
import QuizScreen from "./components/GameScreen"

export default function App() {
  /**
   * Creates a State which handles the Rendering of the StartScreen.
   * If true, the StartScreen is shown, otherwise the Quizscreen will show.
   * 
   */
  const [showStartScreen, setStartScreen] = React.useState(true)

  const amountofQuestions = 5;
  const difficulty = "easy";

  function handleStartScreen() {
    setStartScreen(false)
  }



  return (
    <main>
      {showStartScreen ? <StartScreen handleClick={handleStartScreen}/> : <QuizScreen questionAmount={amountofQuestions} difficulty={difficulty}/> }
    </main>
  )
}