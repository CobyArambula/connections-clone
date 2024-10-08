import WordCard from "./WordCard.tsx";
import "./CardGrid.css";

interface WordCard {
  word: string;
  isSelected: boolean;
}
export default function CardGrid({
  remainingWords,
  selectedCards,
  setSelectedCards,
}: {
  remainingWords: WordCard[];
  setRemainingWords: React.Dispatch<
    React.SetStateAction<{ word: string; isSelected: boolean }[]>
  >;
  selectedCards: WordCard[];
  setSelectedCards: React.Dispatch<
    React.SetStateAction<{ word: string; isSelected: boolean }[]>
  >;
}) {
  return (
    <div className="word-card-grid">
      {remainingWords.map((item) => (
        <WordCard
          key={item.word}
          word={item.word}
          isSelected={selectedCards.some((card) => card.word === item.word)}
          selectedCards={selectedCards}
          setSelectedCards={setSelectedCards}
        />
      ))}
    </div>
  );
}
