import cardData from "../src/data/data";
import { useEffect, useState } from "react";
import "./App.css";
import WordGrid from "./components/CardGrid";
import CategoryCard from "./components/CategoryCard";

interface WordCard {
  word: string;
  isSelected: boolean;
}

interface CategoryCard {
  category: string;
  answers: string[];
}

function App() {
  const [hasLost, setHasLost] = useState<boolean>(false);

  const [categoryCards, setCategoryCards] = useState<CategoryCard[]>([]);

  const [selectedCards, setSelectedCards] = useState<WordCard[]>([]);

  const [gameDialogue, setGameDialogue] = useState<React.ReactNode | null>(
    null
  );

  const [mistakesRemaining, setMistakesRemaining] = useState<number>(4); // Max of 4 mistakes, per requirements

  const [remainingWords, setRemainingWords] = useState<WordCard[]>(() => {
    const words = cardData.flatMap((group) =>
      group.cards.map((word) => ({ word, isSelected: false }))
    );
    // Shuffle the array on each init
    for (let i = words.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [words[i], words[j]] = [words[j], words[i]];
    }
    return words;
  });

  function shuffle() {
    setRemainingWords((prevWords) => {
      const shuffledWords = [...prevWords];
      // Uses the Fisher-Yates algorithm to shuffle array
      for (let i = shuffledWords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledWords[i], shuffledWords[j]] = [
          shuffledWords[j],
          shuffledWords[i],
        ];
      }
      return shuffledWords;
    });
  }

  function submit() {
    if (selectedCards.length !== 4) {
      setGameDialogue(<p>Please select 4 cards before submitting.</p>);
      return;
    }

    const selectedWords = selectedCards.map((card) => card.word);
    const isCorrect = cardData.some(
      (group) =>
        group.cards.every((word) => selectedWords.includes(word)) &&
        selectedWords.every((word) => group.cards.includes(word))
    );
    if (isCorrect) {
      setGameDialogue(<p style={{ color: "green" }}>Correct!</p>);

      // Find the matching group of cards and add a CategoryCard for it
      const matchingGroup = cardData.find((group) =>
        group.cards.every((word) => selectedWords.includes(word))
      );

      if (matchingGroup) {
        setCategoryCards([
          ...categoryCards,
          { category: matchingGroup.title, answers: matchingGroup.cards },
        ]);
      }

      // De-render selected cards
      setRemainingWords((prevWords) =>
        prevWords.filter((card) => !selectedWords.includes(card.word))
      );

      setSelectedCards([]);
    } else {
      setGameDialogue(<p style={{ color: "red" }}>Incorrect.</p>);
      setMistakesRemaining(mistakesRemaining - 1);
    }
  }

  function handleLoss() {
    // De-render game buttons
    setHasLost(true);
    // Determine remaining category cards and render them
    const remainingCategories = cardData.filter(
      (group) => !categoryCards.some((card) => card.category === group.title)
    );

    setCategoryCards((prevCards) => [
      ...prevCards,
      ...remainingCategories.map((group) => ({
        category: group.title,
        answers: group.cards,
      })),
    ]);
  }

  // Checks for loss
  useEffect(() => {
    if (mistakesRemaining === 0) {
      handleLoss();
    }
  }, [mistakesRemaining]);

  return (
    <>
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "end",
            gap: "10px",
          }}
        >
          <h1 style={{ margin: 0 }}>Connections</h1>
          <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "lighter" }}>
            (by Coby!)
          </p>
        </div>
        <h2>Create groups of four!</h2>
      </div>
      <div className="game-container">
        {/* Render correctly-guessed category cards */}
        {categoryCards.map((item, index) => (
          <CategoryCard
            key={index}
            category={item.category}
            answers={item.answers}
          />
        ))}
        {hasLost ? null : (
          <WordGrid
            remainingWords={remainingWords}
            setRemainingWords={setRemainingWords}
            selectedCards={selectedCards}
            setSelectedCards={setSelectedCards}
          />
        )}

        {/* Handle rendering/de-rendering of CardGrid and win/lose message */}
        {mistakesRemaining === 0 ? (
          <h3>You lost.</h3>
        ) : categoryCards.length === 4 && mistakesRemaining > 0 ? (
          <h3>You won!</h3>
        ) : (
          <>
            {categoryCards.length !== 4 ? gameDialogue : null}
            <p>Mistakes remaining: {mistakesRemaining}</p>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                justifyContent: "center",
              }}
            >
              {hasLost ? null : (
                <>
                  <button onClick={shuffle}>Shuffle</button>
                  <button onClick={() => setSelectedCards([])}>
                    Deselect All
                  </button>
                  <button onClick={submit}>Submit</button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
