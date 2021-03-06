import React from "react"

function Answer(props) {

    /**
     * Maps over all the given answers and creates Styles Div Elements for them.
     * Every Answer has 4 different booleans which explain their current status ('isWrong', 'isCorrect', 'isActive', 'isSelected')
     */
    const answerElements = props.answers.map(item => (
        <div
            className={`answerButton ${item.isWrong ? 'wrong' : item.isCorrect ? 'correct' : item.isActive ? 'notActive' : item.isSelected ? 'selected' : ''}`}
            onClick={() => props.handleClick(props.id, item.answer)}
            key={item.answer}
        >
            {item.answer.replace(/&quot;/g, '"').replace(/&#039;/g, '\'').replace(/&amp;/g, '&')}
        </div>
    ))



    return (
        <div className="Quiz--container">

            <div className="answer--container">
                {answerElements}
            </div>
            <hr></hr>
        </div>
    )
}

export default Answer;