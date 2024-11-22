import Table from "../../../../components/ui/table";
import pencil from "../../../../assets/images/icons/pencil.svg";
import { useState } from "react";
import Input from "../../../../components/ui/input";
import Button from "../../../../components/ui/button";

const Contracts = () => {
  const [editIndex, setEditIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2.5">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-[24px]">Contracts</p>

        <div className="flex gap-2.5">
          <Button buttonType="secondary">Tag existing contract</Button>
          <Button>Add new contract</Button>
        </div>
      </div>

      <Table.Container>
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
          {Array.from({ length: 3 }).map((item, index) => {
            const onEdit = index === editIndex;

            return (
              <Table.Row key={index}>
                <Table.Data className="h-[56px] py-1">{`Outcome ${
                  index + 1
                }`}</Table.Data>

                <Table.Data className="h-[56px] py-1">
                  {onEdit ? <Input noHelperText /> : <p>test</p>}
                </Table.Data>

                <Table.Data className="h-[56px] py-1">
                  {onEdit ? <Input noHelperText /> : <p>test</p>}
                </Table.Data>

                <Table.Data className="h-[56px] py-1">
                  {onEdit ? <Input noHelperText /> : <p>test</p>}
                </Table.Data>

                <Table.Data className="h-[56px] py-1">
                  {onEdit ? <Input noHelperText /> : <p>test</p>}
                </Table.Data>

                <Table.Data className="h-[56px] py-1">
                  {onEdit ? <Input noHelperText /> : <p>test</p>}
                </Table.Data>

                <Table.Data className="h-[56px] py-1">
                  {onEdit ? <Input noHelperText /> : <p>test</p>}
                </Table.Data>

                <Table.Data className="h-[56px] py-1">
                  <div className="flex justify-end gap-1.5">
                    {onEdit ? (
                      <>
                        <Button
                          onClick={() => setEditIndex(null)}
                          buttonType="tertiary"
                        >
                          Cancel
                        </Button>

                        <Button>Save</Button>
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

export default Contracts;

const HEADERS = [
  "Parties",
  "Outcome(s)",
  "Beneficiaries",
  "Status",
  "Start date",
  "End date",
  "Contract",
];
