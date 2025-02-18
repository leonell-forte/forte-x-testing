import { useQuery } from "@tanstack/react-query";
import evidenceService from "api/evidence";
import { useMemo } from "react";
import { HiPlusCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

import download from "assets/images/icons/download.svg";

import { EVIDENCE_STATUS } from "lib/constants";
import { useAppSelector } from "lib/hooks";
import { Beneficiaries, IsAuthorized } from "lib/role-permissions";
import { findLabelFromOptions } from "lib/utils";

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
      {IsAuthorized([Beneficiaries.UPDATE]) && (
        <div className="flex items-center gap-5">
          <p className="heading w-fit whitespace-nowrap">Evidence</p>

          <div className="flex w-full items-center gap-5">
            <hr className="w-full" />

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleAddOrViewEvidence?.();
              }}
              className="transition-all hover:scale-[1.05] hover:opacity-80"
            >
              <HiPlusCircle className="h-auto w-8 text-white" />
            </button>
          </div>
        </div>
      )}

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
                <Table.Data className="w-[140px]">
                  <p
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddOrViewEvidence?.(id);
                    }}
                    className="link cursor-pointer truncate underline"
                  >
                    {file?.filename}
                  </p>
                </Table.Data>

                <Table.Data className="w-[100px]">{outcome?.name} </Table.Data>

                <Table.Data className="w-[140px]">{description}</Table.Data>

                <Table.Data className="w-[120px]">
                  <span>{findLabelFromOptions(EVIDENCE_STATUS, status)}</span>
                </Table.Data>

                <Table.Data>
                  <Link
                    to={file?.fileUrl}
                    download
                    target="_blank"
                    type="button"
                  >
                    <img
                      src={download}
                      alt="download"
                      className="flex-shrink-0"
                    />
                  </Link>
                </Table.Data>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Container>
    </div>
  );
};

export default Evidences;

const HEADERS = ["Evidence files", "Outcome", "Description", "Status"];
