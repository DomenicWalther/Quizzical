import React from "react"
import Answer from "./Answer";
import { nanoid } from 'nanoid'

function QuizScreen() {


    const [questionArray, setQuestionArray] = React.useState([])

    const [playingGame, setPlayingGame] = React.useState(true)


    /* The entire function of this is to control the usage of the useEffect which handles the fetching
    *  of Questions and creating a workable Array of Data.
    */
    const [newQuestions, setNewQuestions] = React.useState(false)




    React.useEffect(() => {

        /**
         * Loops over the different Objects in a given data-set and asigns them Keys.
         * Set's the questionArray to the processed data.
         * @param {*} data The data to process. 
         */
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
        /**
         * Randomizes an Array with the Fisher–Yates Shuffle.
         * @param {Array} array The array to process. 
         * @returns {Array} Returns the randomized array.
         */
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

        /**
         * Creates one randomized Array from two Arrays.
         * @param {Array} array The correct answer given by the API.
         * @param {Array} array The wrong answers given by the API.
         * @returns {Array} Returns the combined and randomized Array.
         */
        function randomizeAnswerOrder(a, b) {
            const newArray = []
            newArray.push({ answer: a, isCorrectAnswer: true, isSelected: false, isWrong: false, isCorrect: false, isActive: false })
            for (let i = 0; i < b.length; i++) {
                newArray.push({ answer: b[i], isCorrectAnswer: false, isSelected: false, isWrong: false, isCorrect: false, isActive: false })
            }
            const shuffledArray = shuffle(newArray)
            return shuffledArray
        }


        fetch('https://opentdb.com/api.php?amount=5&difficulty=medium&type=multiple')
            .then(response => response.json())
            .then(data => initializeQuestionArray(data.results))
    }, [newQuestions])





    /**
     * Only runs when playingGame is true.
     * Maps over the current questionArray and compares the given ID with the ID of all the Objects.
     * A new Object 'newItem' is created where all the answers are looped over. 
     * If the answer is the same as the given one, the state of 'isSelected' will be reversed, this happens in case the User clicks an Answer twice to de-select it.
     * Otherwise isSelected will be set to false, meaning that when an answer was already selected and the User chooses another one, the already selected Answer will be deselected.
     * 
     * 
     * @param {*} id ID that was given to the Question/Answer Set
     * @param {string} answer String of the Answer that was clicked
     */
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




    /**
     * Maps over the questionArray and creates a Component with the Question and uses the Answer Component.
     * The Answer Component is given an array of Answers, the unique ID of the QuestionArray and a function that can be called.
     */
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

    /**
     * Only runs when playingGame is true.
     * Maps over the current questionArray and changes the Status of the Answer Elements depending on different comparisons between Answers 
     * being selected by the User and being the correct Answer/
     * For example: The correct answer will always be green, if no other Answer has been selected by the user, all other ones will get the Attribute
     * isActive: true. If the user selected an wrong answer the Attribute 'isWrong' will be true.
     * Sets the QuestionArray to the newQuestionArray.
     * Sets playingGame to false.
     * If ran while playingGame is false, will inverse the state of newQuestions, which will run the useEffect to get new Questions.
     * In that case, playingGame will be set to true.
     */
    function handleAnswers() {
        if(playingGame) {
        const newQuestionArray = questionArray.map(item => {

            var newItem = item.answers.map(mapAnswer => {
                return ({
                    ...mapAnswer,
                    isCorrect: mapAnswer.isCorrectAnswer ? true : false,
                    isWrong: !mapAnswer.isCorrectAnswer && mapAnswer.isSelected ? true: false,
                    isActive: !mapAnswer.isCorrectAnswer && !mapAnswer.isSelected ? true : false
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
    
    /**
     * The amount of elements which have both the correctAnswer and isSelected Attribute will be counted
     * @returns An Integer with the Amount of correct answers.
     */
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


