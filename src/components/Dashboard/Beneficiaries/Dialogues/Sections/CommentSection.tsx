import Input from "../../../../ui/input";

const CommentSection = () => {
  return (
    <div className="space-y-2">
      <p className="font-medium">Comments</p>

      <ul>
        {Array.from({ length: 1 }).map((item, index) => {
          return (
            <li
              key={index}
              className="flex justify-between text-[13px]"
            >
              <p>The generated Lorem Ipsum is therefore always free </p>

              <div className="text-right">
                <p> Errin Burger</p>
                <p> 12-11-2024 I 12:09pm</p>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="relative">
        <Input placeholder="Comment" />

        <button className="absolute right-4 top-4 text-[12px] font-medium text-mint">
          Post Comment
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
