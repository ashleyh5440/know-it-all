import { useState, useEffect } from 'react';
import '../Categories/style.css'
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

function Categories() {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const navigate = useNavigate()
    const [currentQuestions, setCurrentQuestions] = useState([]);

    const handleCategorySelection = async (categoryId) => {
        try {
            setSelectedCategory(categoryId);
            const response = await axios.get(`https://opentdb.com/api.php?amount=30&category=${categoryId}&encode=base64`);
            const trimData = response.data.results.map((item) => {
                // decode the question
                let trimmedQuestion = atob(item.question);
                let b2bQues = Uint8Array.from(trimmedQuestion, (m) =>
                  m.codePointAt(0)
                );
                let decodedB2BQ = new TextDecoder().decode(b2bQues);
    
                // decode correct answer
                let trimmedCorrect = atob(item.correct_answer);
                let b2bTrimmedCorrect = Uint8Array.from(trimmedCorrect, (m) =>
                  m.codePointAt(0)
                );
                let decodedB2BATC = new TextDecoder().decode(b2bTrimmedCorrect);
                // decode all the incorrect answers
            let trimmedIncorrect = item.incorrect_answers.map((wrongTrim) => {
                wrongTrim = atob(wrongTrim);
                let b2bWrongTrim = Uint8Array.from(wrongTrim, (m) =>
                  m.codePointAt(0)
                );
                let decodedB2BA = new TextDecoder().decode(b2bWrongTrim);
                return decodedB2BA;
              });
              const options = [...trimmedIncorrect, decodedB2BATC];
  
              // shuffle the positions of the answer options
              const shuffledOptions = [...options];
              for (let i = shuffledOptions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledOptions[i], shuffledOptions[j]] = [
                  shuffledOptions[j],
                  shuffledOptions[i],
                ];
              }
              return {
                question: decodedB2BQ,
                correctAnswer: decodedB2BATC,
                options: shuffledOptions,
              };
            });
             navigate("/game", {state: {questions:trimData, category:selectedCategory}});
        } catch (error) {
            console.error('error getting questions', error);
        }
    };

    return (
        // should I put the event listener on the container?
        //when the user clicks the button, it should go to Game with the appropriate questions for that category
        //questions should appear one by one and be timed
        //remember that some are multiple choice, some are true/false
        <section className="category-buttons">
          <div className="left">
            <Button variant="primary" onClick={() => handleCategorySelection({id: 25, title: "Art"})}>Art</Button> 
            <Button variant="primary" onClick={() => handleCategorySelection(10)}>Books</Button>
            <Button variant="primary" onClick={() => handleCategorySelection(18)}>Computers</Button>
            <Button variant="primary" onClick={() => handleCategorySelection(11)}>Film</Button>
          </div>
          <div className="right">
            <Button variant="primary" onClick={() => handleCategorySelection(23)}>History</Button>
            <Button variant="primary" onClick={() => handleCategorySelection(17)}>Science & Naure</Button>
            <Button variant="primary" onClick={() => handleCategorySelection(21)}>Sports</Button>
            <Button variant="primary" onClick={() => handleCategorySelection(14)}>TV</Button>
          </div>
        </section>
    )
};

export default Categories;

