import { FormEvent, useState } from "react";

interface IPros {
  text: string;
}

const ChangeSpan = ({ text }: IPros) => {
  const [textHtml, setTextHtml] = useState(text);

  const handleSpanClick = (event: FormEvent<HTMLSpanElement>) => {
    setTextHtml(event.currentTarget.textContent || "")
  };

  return (
    <span className="keyword" onChange={(event) => handleSpanClick(event)}>
      {textHtml}
    </span>
  );
};

export default ChangeSpan;