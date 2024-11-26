import Button from "../../components/ui/button";
import Dropdown from "../../components/ui/dropdown";
import SearchInput from "../../components/ui/search-input";
import closeFilter from "../../assets/images/icons/close-filter.svg";
import Table from "../../components/ui/table";
import pencil from "../../assets/images/icons/pencil.svg";
import bin from "../../assets/images/icons/bin.svg";
import ContractDialogue from "../../components/Dashboard/Contracts/Dialogues/ContractDialogue";
import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import contractService from "../../api/contract";

const ContractsPage = () => {
  const { data: contracts } = useQuery({
    queryKey: ["contracts"],
    queryFn: contractService.get,
  });

  console.log(contracts);

  const [modal, setModal] = useState<"contract" | null>(null);

  const close = () => {
    setModal(null);
  };

  const renderModal = useCallback(() => {
    switch (modal) {
      case "contract":
        return (
          <ContractDialogue
            isVisible={modal === "contract"}
            handleClose={close}
          />
        );
    }
  }, [modal]);

  return (
    <>
      {renderModal()}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between w-full gap-4">
          <SearchInput
            className="!w-[286px]"
            placeholder="Search contract"
          />

          <div className="flex items-center gap-6">
            <Button
              eventName="Add User"
              onClick={() => setModal("contract")}
            >
              Add contract
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-[18px]">
          <p className="text-[20px] font-medium">Filter by</p>

          <Dropdown
            noHelperText
            isMultiSelect
            placeholder="Status"
            className="max-w-[166px]"
            options={[]}
          />

          <Dropdown
            noHelperText
            options={[]}
            placeholder="Project"
            className="max-w-[166px]"
          />

          <Dropdown
            noHelperText
            options={[]}
            placeholder="Start Date"
            className="max-w-[166px]"
          />

          <button onClick={() => {}}>
            <img
              src={closeFilter}
              alt="close-filter"
            />
          </button>
        </div>

        <Table.Container>
          <Table.Head>
            <Table.Row>
              {TABLE_HEADER.map((key, headerIndex) => {
                return <Table.Header key={headerIndex}>{key}</Table.Header>;
              })}

              <Table.Header></Table.Header>
            </Table.Row>
          </Table.Head>

          <Table.Body>
            <Table.Row>
              <Table.Data>-</Table.Data>

              <Table.Data>-</Table.Data>

              <Table.Data>-</Table.Data>

              <Table.Data>-</Table.Data>

              <Table.Data>-</Table.Data>

              <Table.Data>-</Table.Data>

              <Table.Data>-</Table.Data>

              <Table.Data>-</Table.Data>

              <Table.Data>-</Table.Data>

              <Table.Data>
                <div className="flex justify-end">
                  <Button
                    eventName="Edit User"
                    // id={project}
                    buttonType="default"
                    type="button"
                    // onClick={() => handleEditUser(item)}
                    className="p-[3px]"
                  >
                    <img
                      alt="pencil"
                      src={pencil}
                    />
                  </Button>

                  <Button
                    eventName="Edit User"
                    // id={id.toString()}
                    buttonType="default"
                    type="button"
                    onClick={() => {}}
                    className="p-[3px]"
                  >
                    <img
                      alt="pencil"
                      src={bin}
                    />
                  </Button>
                </div>
              </Table.Data>
            </Table.Row>
          </Table.Body>
        </Table.Container>
      </div>
    </>
  );
};

export default ContractsPage;

const TABLE_HEADER = [
  "Parties",
  "Status",
  "Project",
  "Outcome(s)",
  "Target beneficiaries",
  "Actual beneficiaries ",
  "Start date",
  "End date",
  "Document",
];
