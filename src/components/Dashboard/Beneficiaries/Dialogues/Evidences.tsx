import { useQuery } from "@tanstack/react-query";
import evidenceService from "api/evidence";
import { useMemo } from "react";
import { Link } from "react-router-dom";

import add from "assets/images/icons/add.svg";
import download from "assets/images/icons/download.svg";

import { useAppSelector } from "lib/hooks";

import Button from "components/ui/button";
import Table from "components/ui/table";

interface IProps {
  handleAddOrViewEvidence?: (id?: number) => void;
}

const Evidences = ({ handleAddOrViewEvidence }: IProps) => {
  const { beneficiaryId } = useAppSelector((state) => state.evidence);

  const { data: evidenceList, isLoading } = useQuery({
    queryKey: ["evidences", beneficiaryId],

    queryFn: () => evidenceService.list(beneficiaryId as number),
  });

  const evidences = useMemo(() => evidenceList?.items || [], [evidenceList]);

  return (
    <div className="space-y-[30px]">
      <div className="flex items-center gap-12">
        <p>Evidences</p>

        <div className="flex w-full items-center gap-4">
          <hr className="w-full" />

          <button
            type="button"
            onClick={() => handleAddOrViewEvidence?.()}
            className="flex !h-8 !w-8 flex-shrink-0 items-center justify-center rounded-full bg-white text-forest-green transition-all hover:scale-[1.05] hover:opacity-80"
          >
            <img src={add} alt="add" />
          </button>
        </div>
      </div>

      <Table.Container isEmpty={!evidences.length} isLoading={isLoading}>
        <Table.Head>
          <Table.Row>
            {HEADERS.map((item, index) => {
              return <Table.Header key={index}>{item}</Table.Header>;
            })}

            <Table.Header></Table.Header>
          </Table.Row>
        </Table.Head>

        <Table.Body>
          {evidences.map((item, index) => {
            const { file, outcome, description, status, id } = item;
            return (
              <Table.Row key={index}>
                <Table.Data className="max-w-[150px]">
                  <button
                    onClick={() => handleAddOrViewEvidence?.(id)}
                    className="link underline"
                  >
                    {file?.filename}
                  </button>
                </Table.Data>

                <Table.Data>{outcome?.name} </Table.Data>

                <Table.Data className="max-w-[100px]">{description}</Table.Data>

                <Table.Data className="max-w-[100px]">
                  <span className="capitalize">{status}</span>
                </Table.Data>

                <Table.Data>
                  <Link
                    to={file?.fileUrl}
                    download
                    target="_blank"
                    type="button"
                  >
                    <img src={download} alt="download" className="min-w-4" />
                  </Link>
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
