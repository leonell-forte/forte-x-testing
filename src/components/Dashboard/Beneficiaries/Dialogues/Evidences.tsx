import Table from "../../../../components/ui/table";
import add from "../../../../assets/images/icons/add.svg";
import download from "../../../../assets/images/icons/download.svg";
import Button from "../../../../components/ui/button";
import { useAppSelector } from "../../../../lib/hooks";
import { useQuery } from "@tanstack/react-query";
import evidenceService from "../../../../api/evidence";

interface IProps {
  handleAddOrViewEvidence?: (id?: number) => void;
}

const Evidences = ({ handleAddOrViewEvidence }: IProps) => {
  const { beneficiaryId } = useAppSelector((state) => state.evidence);

  const { data, isLoading } = useQuery({
    queryKey: ["evidences", beneficiaryId],

    queryFn: () => evidenceService.list(beneficiaryId as number),
  });

  console.log(data);

  return (
    <div className="space-y-[30px]">
      <div className="flex items-center gap-12">
        <p>Evidences</p>

        <div className="flex items-center gap-4 w-full">
          <hr className="w-full" />

          <button
            type="button"
            onClick={() => handleAddOrViewEvidence?.()}
            className="!w-8 !h-8 bg-white rounded-full flex-shrink-0 text-forest-green flex items-center justify-center hover:scale-[1.05] transition-all hover:opacity-80"
          >
            <img
              src={add}
              alt="add"
            />
          </button>
        </div>
      </div>

      <Table.Container isLoading={isLoading}>
        <Table.Head>
          <Table.Row>
            {HEADERS.map((item, index) => {
              return <Table.Header key={index}>{item}</Table.Header>;
            })}

            <Table.Header></Table.Header>
          </Table.Row>
        </Table.Head>

        <Table.Body>
          {Array.from({ length: 3 }).map((item, index) => {
            return (
              <Table.Row key={index}>
                <Table.Data>
                  <button
                    onClick={() => handleAddOrViewEvidence?.(index + 1)}
                    className="link underline"
                  >
                    Evidence file 1.pdf
                  </button>
                </Table.Data>

                <Table.Data>Lorem </Table.Data>

                <Table.Data>Employment contract</Table.Data>

                <Table.Data>More information request</Table.Data>

                <Table.Data>
                  <button type="button">
                    <img
                      src={download}
                      alt="download"
                    />
                  </button>
                </Table.Data>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Container>

      <div className="flex justify-end gap-4">
        <Button buttonType="secondary">Reject beneficiary</Button>

        <Button>Accept beneficiary</Button>
      </div>
    </div>
  );
};

export default Evidences;

const HEADERS = ["Evidence files", "Outcome", "Description", "Status"];
