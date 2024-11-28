import Table from "../../../../components/ui/table";
import pencil from "../../../../assets/images/icons/pencil.svg";
import { useState } from "react";
import Input from "../../../../components/ui/input";
import Button from "../../../../components/ui/button";
import { IOutcome, ProjectFieldValues } from "../../../../lib/types/projects";
import { Control, Controller, FormState } from "react-hook-form";

interface IProps {
  outcomes?: IOutcome[];

  isLoading?: boolean;

  control: Control<ProjectFieldValues>;

  formState: FormState<ProjectFieldValues>;

  onSubmit: () => void;
}

const Outcomes = ({
  outcomes = [],
  isLoading,
  control,
  formState,
  onSubmit,
}: IProps) => {
  const { errors } = formState;

  const [editIndex, setEditIndex] = useState<number | null>(null);

  const closeEdit = () => {
    setEditIndex(null);
  };

  return (
    <div className="space-y-2.5">
      <p className="font-semibold text-[24px]">Outcomes</p>

      <Table.Container isLoading={isLoading}>
        <Table.Head>
          <Table.Row>
            {HEADERS.map((item, index) => {
              return (
                <Table.Header
                  small
                  key={index}
                >
                  {item}
                </Table.Header>
              );
            })}

            <Table.Header></Table.Header>
          </Table.Row>
        </Table.Head>

        <Table.Body>
          {outcomes.map((item, index) => {
            const { name, description } = item;

            const onEdit = index === editIndex;

            return (
              <Table.Row key={index}>
                <Table.Data className=" py-1">{`Outcome ${
                  index + 1
                }`}</Table.Data>

                <Table.Data className=" py-1">
                  {onEdit ? (
                    <Controller
                      name={`outcomes.${index}.name`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          small
                          {...field}
                          noHelperText
                          error={!!errors.outcomes?.[index]?.name?.message}
                          helperText={errors.outcomes?.[index]?.name?.message}
                        />
                      )}
                    />
                  ) : (
                    <p>{name}</p>
                  )}
                </Table.Data>

                <Table.Data className=" py-1">
                  {onEdit ? (
                    <Controller
                      name={`outcomes.${index}.description`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          small
                          {...field}
                          noHelperText
                          error={
                            !!errors.outcomes?.[index]?.description?.message
                          }
                          helperText={
                            errors.outcomes?.[index]?.description?.message
                          }
                        />
                      )}
                    />
                  ) : (
                    <p>{description}</p>
                  )}
                </Table.Data>

                <Table.Data className=" py-1">
                  <div className="flex justify-end gap-1.5">
                    {onEdit ? (
                      <>
                        <Button
                          onClick={closeEdit}
                          buttonType="tertiary"
                        >
                          Cancel
                        </Button>

                        <Button
                          onClick={() => {
                            onSubmit();
                            closeEdit();
                          }}
                        >
                          Save
                        </Button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setEditIndex(index)}
                      >
                        <img
                          src={pencil}
                          alt=""
                        />
                      </button>
                    )}
                  </div>
                </Table.Data>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Container>
    </div>
  );
};

export default Outcomes;

const HEADERS = ["Outcome", "Name", "Outcome(s)"];
