import add from "../../../../assets/images/icons/add.svg";

const Evidences = () => {
  return (
    <div>
      <div className="flex items-center gap-12">
        <p>Evidences</p>
        <div className="flex items-center gap-4 w-full">
          <hr className="w-full" />
          <button
            type="button"
            //   onClick={handleDelete}
            className="!w-8 !h-8 bg-white rounded-full flex-shrink-0 text-forest-green flex items-center justify-center hover:scale-[1.05] transition-all hover:opacity-80"
          >
            <img
              src={add}
              alt="add"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Evidences;
