export default function StartScreen(props) {
    return (
        <div className="startScreen">
            <h1>Quizzical</h1>
            <p>Try to answer all the Questions to the best of your abilities!</p>
            
            {/* When clicked calls the "handleStartScreen" function to show the QuizScreen */}
            <button type="button" onClick={props.handleClick} className="startQuizButton">Start quiz</button>
        </div>
    )
}