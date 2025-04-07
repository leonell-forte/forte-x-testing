import * as amplitude from "@amplitude/analytics-browser";
import { useQuery } from "@tanstack/react-query";
import evidenceService from "api/evidence";
import { useMemo } from "react";
import { HiPlusCircle } from "react-icons/hi";
import { HiOutlineDownload as DL } from "react-icons/hi";

import { EVIDENCE_STATUS } from "lib/constants";
import { useAppSelector } from "lib/hooks";
import { Beneficiaries, IsAuthorized } from "lib/role-permissions";
import { findLabelFromOptions } from "lib/utils";

import Table from "components/ui/table";
import Cards from "components/ui/table-card";

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
                amplitude.track(`Add Evidence Button Click`);
              }}
              className="group"
            >
              <HiPlusCircle className="h-auto w-8 text-white transition-all group-hover:fill-mint" />
            </button>
          </div>
        </div>
      )}

      <div className="md:hidden">
        <Cards.Container>
          {evidences.map((item, index) => {
            const { file, description, status, id } = item;

            return (
              <Cards.Card
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddOrViewEvidence?.(id);
                }}
                key={index}
              >
                <div className="space-y-2">
                  <p className="font-semibold">{file?.filename}</p>
                  <Cards.Group>
                    <Cards.Details label="Description" value={description} />
                    <Cards.Details label="Status" value={status} capitalize />
                  </Cards.Group>
                  <div className="absolute bottom-3 right-4 z-50">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        evidenceService.getFile(file.fileUrl, file.filename);
                      }}
                      className="group"
                    >
                      <DL className="h-auto w-6 transition-all group-hover:stroke-mint" />
                    </button>
                  </div>
                </div>
              </Cards.Card>
            );
          })}
        </Cards.Container>
      </div>

      <div className="hidden md:block">
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
              const { file, description, status, id } = item;
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

                  <Table.Data className="w-[140px]">{description}</Table.Data>

                  <Table.Data className="w-[120px]">
                    <span>{findLabelFromOptions(EVIDENCE_STATUS, status)}</span>
                  </Table.Data>

                  <Table.Data>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        evidenceService.getFile(file.fileUrl, file.filename);
                      }}
                      className="group mt-1.5"
                    >
                      <DL className="h-auto w-6 transition-all group-hover:stroke-mint" />
                    </button>
                  </Table.Data>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Container>
      </div>
    </div>
  );
};

export default Evidences;

const HEADERS = ["Evidence files", "Description", "Status"];
