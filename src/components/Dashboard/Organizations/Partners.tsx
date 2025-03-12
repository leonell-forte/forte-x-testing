import { HiPlusCircle } from "react-icons/hi";

import Table from "components/ui/table";
import Cards from "components/ui/table-card";

type PartnerProps = {
  handleAddPartner: () => void;
};

const Partners = ({ handleAddPartner }: PartnerProps) => {
  return (
    <div className="space-y-[30px]">
      <div className="flex items-center gap-5">
        <p className="heading w-fit whitespace-nowrap">Partners</p>

        <div className="flex w-full items-center gap-5">
          <hr className="w-full" />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleAddPartner();
            }}
            className="group"
          >
            <HiPlusCircle className="h-auto w-8 text-white transition-all group-hover:fill-mint" />
          </button>
        </div>
      </div>

      <div className="md:hidden">
        <Cards.Container>
          {Array.from({ length: 3 }).map((item, index) => {
            // const { file, outcome, description, status, id } = item;

            return (
              <Cards.Card
                onClick={(e) => {
                  e.stopPropagation();
                  //   handleAddOrViewEvidence?.(id);
                }}
                key={index}
              >
                <div className="space-y-2">
                  <p className="font-semibold">test</p>
                  <Cards.Group>
                    <Cards.Details label="Test" value="test" />
                    <Cards.Details label="Test" value="test" />
                    <Cards.Details label="Test" value="test" capitalize />
                  </Cards.Group>
                  <div className="absolute bottom-3 right-4 z-50">
                    {/* <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // evidenceService.getFile(file.fileUrl, file.filename);
                      }}
                      className="group"
                    >
                      <DL className="h-auto w-6 transition-all group-hover:stroke-mint" />
                    </button> */}
                  </div>
                </div>
              </Cards.Card>
            );
          })}
        </Cards.Container>
      </div>

      <div className="hidden md:block">
        <Table.Container>
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
                <Table.Row>
                  <Table.Data>test</Table.Data>
                  <Table.Data>test</Table.Data>
                  <Table.Data>test</Table.Data>
                  <Table.Data></Table.Data>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Container>
      </div>
    </div>
  );
};

export default Partners;

const HEADERS = ["test", "test", "test"];
