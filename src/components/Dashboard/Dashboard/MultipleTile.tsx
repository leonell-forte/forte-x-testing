import classNames from "classnames";
import { ReactNode } from "react";

import Card from "components/Dashboard/Dashboard/Card";

type MultipleTileProps = {
  tiles: ReactNode[];
};

const MultipleTile = ({ tiles }: MultipleTileProps) => {
  return (
    <Card
      variant="outline"
      className="grid grid-cols-2 divide-x divide-panel/10"
    >
      {tiles.map((tile, index) => {
        return (
          <div key={index} className={classNames(!!index && "pl-6", "pr-2")}>
            {tile}
          </div>
        );
      })}
    </Card>
  );
};

export default MultipleTile;
