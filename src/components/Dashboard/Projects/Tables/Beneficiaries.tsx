import Table from "../../../ui/table";
import Button from "../../../ui/button";

const Beneficiaries = () => {
  return (
    <div className="space-y-2.5">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-[24px]">Beneficiaries</p>

        <div className="flex gap-2.5">
          <Button buttonType="secondary">Import beneficiaries</Button>

          <Button buttonType="secondary">Tag existing beneficiaries</Button>

          <Button>Add new beneficiaries</Button>
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
          </Table.Row>
        </Table.Head>

        <Table.Body>
          {Array.from({ length: 3 }).map((item, index) => {
            return (
              <Table.Row key={index}>
                <Table.Data className="h-[56px] py-1">test</Table.Data>

                <Table.Data className="h-[56px] py-1">test</Table.Data>

                <Table.Data className="h-[56px] py-1">test</Table.Data>

                <Table.Data className="h-[56px] py-1">test</Table.Data>

                <Table.Data className="h-[56px] py-1">test</Table.Data>

                <Table.Data className="h-[56px] py-1">test</Table.Data>

                <Table.Data className="h-[56px] py-1">test</Table.Data>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Container>
    </div>
  );
};

export default Beneficiaries;

const HEADERS = [
  "First name",
  "Last name",
  "Partner",
  "Email",
  "Phone number",
  "Contract",
  "Program",
];
