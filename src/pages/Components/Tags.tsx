import Tag from "../../components/ui/tag";
import { useState } from "react";

const Tags = () => {
  const [tags, setTags] = useState([
    "Item 1",
    "Item 2",
    "Item 3",
    "Item 4",
    "Item 5",
  ]);
  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((item) => item !== tag));
  };
  return (
    <div>
      <p className="text-2xl text-white font-semibold uppercase mb-2">
        Filter Tags
      </p>
      <div className="flex flex-wrap gap-4">
        {tags.map((item, index) => {
          return (
            <Tag
              label={item}
              key={index}
              handleRemove={() => handleRemoveTag(item)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Tags;
