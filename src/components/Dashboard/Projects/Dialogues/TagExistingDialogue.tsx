import { useQuery } from "@tanstack/react-query";
import organizationService from "api/organization";
import { useMemo, useState } from "react";

import Button from "components/ui/button";
import Dialogue, { IDialogueProps } from "components/ui/dialogue/dialogue";
import Dropdown, { IOption } from "components/ui/dropdown";

interface IProp extends IDialogueProps {
  handleAdd?: (ids: number[]) => void;

  isPending?: boolean;
}

const TagExistingDialogue = ({ handleAdd, isPending, ...props }: IProp) => {
  const { data, isLoading } = useQuery({
    queryKey: ["organizations"],

    queryFn: () =>
      organizationService.list({
        listAll: true,

        page: 1,
      }),
  });

  const organizations = useMemo(
    () =>
      data?.items.map(
        (item) =>
          ({
            label: item.name,

            value: item.id,
          }) as IOption
      ),
    [data]
  );

  const [values, setValues] = useState<string[]>([]);

  return (
    <Dialogue {...props}>
      <div className="space-y-6">
        <Dropdown
          enableSearch
          value={values}
          handleSelect={(val) => setValues(val as string[])}
          isMultiSelect
          showAsTags
          options={organizations as IOption[]}
          loading={isLoading}
          placeholder="Search and select"
        />

        <div className="flex justify-end gap-2.5">
          <Button onClick={props.handleClose} buttonType="secondary">
            Cancel
          </Button>

          <Button
            loading={isPending}
            onClick={() => handleAdd?.(values.map((item) => Number(item)))}
          >
            Add
          </Button>
        </div>
      </div>
    </Dialogue>
  );
};

export default TagExistingDialogue;
