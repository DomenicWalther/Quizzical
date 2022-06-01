import React from "react"
import Answer from "./Answer";
import { nanoid } from 'nanoid'

function QuizScreen() {


    const [questionArray, setQuestionArray] = React.useState([])
    const [playingGame, setPlayingGame] = React.useState(true)
    const [newQuestions, setNewQuestions] = React.useState(false)




    React.useEffect(() => {
        function initializeQuestionArray(data) {
            const questionanswers = data.map(item => ({
                question: item.question,
                answers: randomizeAnswerOrder(item.correct_answer, item.incorrect_answers),
                correctAnswer: item.correct_answer,
                incorrectAnswers: item.incorrect_answers,
                id: nanoid()
            }))
            setQuestionArray(questionanswers)
        }
        function shuffle(array) {
            var m = array.length, t, i;

            while (m) {
                i = Math.floor(Math.random() * m--)
                t = array[m]
                array[m] = array[i]
                array[i] = t
            }
            return array
        }

        function randomizeAnswerOrder(a, b) {
            const newArray = []
            newArray.push({ answer: a, isCorrectAnswer: true, isSelected: false, isWrong: false, isCorrect: false })
            for (let i = 0; i < b.length; i++) {
                newArray.push({ answer: b[i], isCorrectAnswer: false, isSelected: false, isWrong: false, isCorrect: false })
            }
            const shuffledArray = shuffle(newArray)
            return shuffledArray
        }


        fetch('https://opentdb.com/api.php?amount=5&difficulty=medium&type=multiple')
            .then(response => response.json())
            .then(data => initializeQuestionArray(data.results))
    }, [newQuestions])






    function toggleSelected(id, answer) {
        if(playingGame) {
        const newQuestionArray = questionArray.map(item => {
            if (item.id === id) {
                var newItem = item.answers.map(mapAnswer => {
                    return ({
                        ...mapAnswer,
                        isSelected: mapAnswer.answer === answer ? !mapAnswer.isSelected : false
                    })
                })
            }
            return ({
                ...item,
                answers: item.id === id ? newItem : item.answers
            })
        })
        setQuestionArray(newQuestionArray)
    }
    }





    const questionElements = questionArray.map(item => (
        <div className="Quiz--container">
            <h1 className="Quiz--container-question">{item.question.replace(/&#039;/g, '\'').replace(/&amp;/g, '&').replace(/&quot;/g, '"')}</h1>
            <Answer
                answers={item.answers}
                id={item.id}
                handleClick={toggleSelected}
                key={item.id}
            />
        </div>
    ))

    function handleAnswers() {
        if(playingGame) {
        const newQuestionArray = questionArray.map(item => {

            var newItem = item.answers.map(mapAnswer => {
                return ({
                    ...mapAnswer,
                    isCorrect: mapAnswer.isCorrectAnswer ? true : false,
                    isWrong: !mapAnswer.isCorrectAnswer && mapAnswer.isSelected ? true: false
                })
            })

            return ({
                ...item,
                answers: newItem
            })
        })
        setQuestionArray(newQuestionArray)
    
        setPlayingGame(false)
    } else {
        setNewQuestions(!newQuestions)
        setPlayingGame(true)
    }
    }
    
    function getAmountOfCorrectAnswers() {
        let amountOfCorrectAnswers = 0
        for (let i = 0; i < questionArray.length; i++) {
            for (let x = 0; x < questionArray[i].answers.length; x++) {
                if (questionArray[i].answers[x].isCorrectAnswer && questionArray[i].answers[x].isSelected) {
                    amountOfCorrectAnswers += 1
                }
            }
        }
        return amountOfCorrectAnswers
    }


    return (
        <div className="Questions">
            {questionElements}
            <div class="checkAnswersButton--div">
                <button type="button" className="checkAnswersButton" onClick={handleAnswers}>{`${playingGame ? "Check answers" : "New Game"}`}</button>
                {!playingGame && <h3 className="scoreAmount">You scored {getAmountOfCorrectAnswers()}/5 correct answers</h3>}
            </div>
        </div>
    );
}

export default QuizScreen;

//
// Things that are missing:
// -> Check answers
//      -> Track amount of correct Answers
            // -> Display amount of correct answers
        // -> Show different Colors depending on right/wrong answer
// -> Start a new Game
// -> Start with Splashscreen
