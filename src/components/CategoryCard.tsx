import "./CategoryCard.css";

export default function CategoryCard({
  category,
  answers,
}: {
  category: string;
  answers: string[];
}) {
  const getCategoryClass = (category: string) => {
    switch (category.toLowerCase()) {
      case "programming languages":
        return "programming-languages";
      case "pokemon":
        return "pokemon";
      case "aws services":
        return "aws-services";
      case "javascript libraries":
        return "javascript-libraries";
      default:
        return "";
    }
  };

  const categoryClass = getCategoryClass(category);

  return (
    <div className={`category-card ${categoryClass}`}>
      <h3>{category}</h3>
      <p>{answers.join(", ")}</p>
    </div>
  );
}
