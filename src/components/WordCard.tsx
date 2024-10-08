import "./WordCard.css";

interface WordCard {
  word: string;
  isSelected: boolean;
}

export default function WordCard({
  word,
  isSelected,
  selectedCards,
  setSelectedCards,
}: {
  word: string;
  isSelected: boolean;
  selectedCards: { word: string; isSelected: boolean }[];
  setSelectedCards: React.Dispatch<
    React.SetStateAction<{ word: string; isSelected: boolean }[]>
  >;
}) {
  const handleCardClick = () => {
    if (!isSelected && selectedCards.length < 4) {
      // Mark the word as selected and add to selectedCards
      setSelectedCards([...selectedCards, { word, isSelected: true }]);
    } else {
      // Deselect the word and remove it from selectedCards
      setSelectedCards(selectedCards.filter((item) => item.word !== word));
    }
  };

  return (
    <>
      <button
        className={`card ${isSelected ? "selected" : ""}`}
        onClick={handleCardClick}
      >
        {word}
      </button>
    </>
  );
}
