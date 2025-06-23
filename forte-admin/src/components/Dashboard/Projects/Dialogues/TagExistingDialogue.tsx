import { useQuery } from "@tanstack/react-query";
import organizationService from "api/organization";
import { useEffect, useMemo, useState } from "react";

import { IProjectOrganization } from "lib/types/projects";

import Button from "components/ui/button";
import Dialogue, { IDialogueProps } from "components/ui/dialogue/dialogue";
import Dropdown, { IOption } from "components/ui/dropdown";

interface IProp extends IDialogueProps {
  handleAdd?: (ids: number[]) => void;

  isPending?: boolean;

  existingPartners?: IProjectOrganization[];
}

const TagExistingDialogue = ({
  handleAdd,
  isPending,
  existingPartners,
  ...props
}: IProp) => {
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

            value: String(item.id),
          }) as IOption
      ),
    [data]
  );

  const [values, setValues] = useState<string[]>([]);

  useEffect(() => {
    if (existingPartners) {
      setValues(existingPartners.map((item) => String(item.id)));
    }
  }, [existingPartners]);

  return (
    <Dialogue center {...props}>
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
            onClick={() =>
              handleAdd?.(
                values
                  .map((item) => Number(item))
                  .filter(
                    (item) =>
                      !existingPartners?.some((partner) => partner.id === item)
                  )
              )
            }
          >
            Add
          </Button>
        </div>
      </div>
    </Dialogue>
  );
};

export default TagExistingDialogue;
