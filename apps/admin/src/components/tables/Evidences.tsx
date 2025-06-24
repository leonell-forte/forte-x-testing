import { HiOutlineDownload as DL } from "react-icons/hi";

import evidenceService from "@/api/evidence";
import Status from "@/components/ui/status";
import Table from "@/components/ui/table";
import Cards from "@/components/ui/table-card";
import { IsAuthorized, Milestones } from "@/lib/role-permissions";
import { Evidence } from "@/lib/types/evidence";
import { getStatusVariant } from "@/lib/utils";

interface IProps {
  list: Evidence[];
  isLoading: boolean;
}

const EvidenceTable = ({ list, isLoading }: IProps) => {
  return (
    <div className="space-y-[30px]">
      <div className="md:hidden">
        <Cards.Container>
          {list.map((item, index) => {
            const { file, description, status } = item;

            return (
              <Cards.Card key={index}>
                <div className="space-y-2">
                  <p className="font-semibold">{file?.filename}</p>
                  <Cards.Group>
                    <Cards.Details label="Description" value={description} />
                    <Cards.Details label="Status" value={status} capitalize />
                  </Cards.Group>
                  {IsAuthorized([Milestones.DOWNLOAD]) && (
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
                        <DL className="group-hover:stroke-mint h-auto w-6 transition-all" />
                      </button>
                    </div>
                  )}
                </div>
              </Cards.Card>
            );
          })}
        </Cards.Container>
      </div>

      <div className="hidden md:block">
        <Table.Container
          emptyConfig={{
            title: "No evidences yet.",
            status: !list.length,
          }}
          isLoading={isLoading}
        >
          <Table.Head>
            <Table.Row>
              {HEADERS.map((item, index) => {
                return <Table.Header key={index}>{item}</Table.Header>;
              })}

              <Table.Header></Table.Header>
            </Table.Row>
          </Table.Head>

          <Table.Body>
            {list.map((item, index) => {
              const { file, description, status } = item;
              return (
                <Table.Row key={index}>
                  <Table.Data>{file?.filename}</Table.Data>

                  <Table.Data>{description}</Table.Data>

                  <Table.Data>
                    <Status variant={getStatusVariant(status)}>{status}</Status>
                  </Table.Data>

                  <Table.Data>
                    {IsAuthorized([Milestones.DOWNLOAD]) && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          evidenceService.getFile(file.fileUrl, file.filename);
                        }}
                        className="group mt-1.5"
                      >
                        <DL className="group-hover:stroke-mint h-auto w-6 transition-all" />
                      </button>
                    )}
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

export default EvidenceTable;

const HEADERS = ["Evidence files", "Description", "Status"];
