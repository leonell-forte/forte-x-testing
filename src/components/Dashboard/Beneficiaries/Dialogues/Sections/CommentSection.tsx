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
              className="flex justify-between text-[13px] gap-12"
            >
              <p>
                There are many variations of passages of Lorem Ipsum available,
                but the majority have suffered alteration in some form, by
                injected humour, or randomised words which don't look
              </p>

              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-4">
                  <p> Errin Burger</p>

                  <button
                    type="button"
                    className="link"
                  >
                    Delete
                  </button>
                </div>
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
