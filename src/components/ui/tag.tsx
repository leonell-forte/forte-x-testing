interface ITagProps {
  label?: string;
  handleRemove?: () => void;
}

const Tag = ({ label, handleRemove }: ITagProps) => {
  return (
    <div className="rounded-[4px] bg-white bg-opacity-[30%] h-8 px-2.5 flex items-center w-fit gap-2.5">
      <span>{label}</span>
      <button onClick={handleRemove}>
        <img alt="close" src="/images/icons/close.svg" />
      </button>
    </div>
  );
};

export default Tag;
