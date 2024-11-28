import Dropdown from "../../components/ui/dropdown";
import Button from "../../components/ui/button";
import SearchInput from "../../components/ui/search-input";
import { useCallback, useState } from "react";
import closeFilter from "../../assets/images/icons/close-filter.svg";
import Table from "../../components/ui/table";
import Checkbox from "../../components/ui/checkbox";
import Pagination from "../../components/ui/pagination";
import pencil from "../../assets/images/icons/pencil.svg";
import bin from "../../assets/images/icons/bin.svg";
import BeneficiariesDialogue from "../../components/Dashboard/Beneficiaries/Dialogues/BeneficiariesDialogue";
import DeleteDialogue from "../../components/Dashboard/Beneficiaries/Dialogues/DeleteDialogue";
import ImportDialogue from "../../components/Dashboard/Beneficiaries/Dialogues/ImportDialogue";
import DatePicker from "../../components/ui/date-picker";

const BeneficiariesPage = () => {
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [modal, setModal] = useState<
    "beneficiaries" | "delete" | "import" | ""
  >("");

  const close = () => {
    setModal("");
  };

  const renderModal = useCallback(() => {
    switch (modal) {
      case "beneficiaries":
        return (
          <BeneficiariesDialogue
            isVisible={modal === "beneficiaries"}
            handleClose={close}
          />
        );

      case "delete":
        return (
          <DeleteDialogue
            isVisible={modal === "delete"}
            handleClose={close}
          />
        );

      case "import":
        return (
          <ImportDialogue
            isVisible={modal === "import"}
            handleClose={close}
          />
        );
    }
  }, [modal]);

  return (
    <>
      {renderModal()}

      <div className="space-y-1.5">
        <div className="flex justify-between items-center gap-4">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search beneficiaries"
            className="max-w-[286px]"
            onClear={() => setSearch("")}
          />

          <div className="space-x-2.5">
            <Button
              eventName="Import Beneficiaries"
              buttonType="secondary"
              onClick={() => setModal("import")}
            >
              Import beneficiaries
            </Button>
            <Button
              eventName="Add Beneficiary"
              onClick={() => setModal("beneficiaries")}
            >
              Add beneficiaries
            </Button>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-[18px]">
            <p className="text-[20px] font-medium flex-shrink-0">Filter by</p>

            <Dropdown
              noHelperText
              options={[]}
              placeholder="Projects"
              className="max-w-[166px]"
            />

            <Dropdown
              noHelperText
              options={[]}
              placeholder="Status"
              className="max-w-[166px]"
            />

            <Dropdown
              noHelperText
              options={[]}
              placeholder="Provider"
              className="max-w-[166px]"
            />

            <Dropdown
              noHelperText
              options={[]}
              placeholder="Risk Level"
              className="max-w-[166px]"
            />

            <Dropdown
              noHelperText
              options={[]}
              placeholder="Program"
              className="max-w-[166px]"
            />

            <div className="max-w-[166px]">
              <DatePicker noHelperText />
            </div>

            <button
              onClick={() => {}}
              className="flex-shrink-0"
            >
              <img
                src={closeFilter}
                alt="close-filter"
              />
            </button>
          </div>
        </div>

        <div className="space-y-[18px]">
          <div className="h-[70vh] pr-4 overflow-scroll">
            <Table.Container>
              <Table.Head>
                <Table.Row>
                  <Table.Header small>
                    <Checkbox
                      label="First name"
                      labelClass="!text-black text-[14px]"
                    />
                  </Table.Header>

                  <Table.Header>Last name</Table.Header>

                  <Table.Header>Provider</Table.Header>

                  <Table.Header>Email</Table.Header>

                  <Table.Header>Phone number</Table.Header>

                  <Table.Header>Contact</Table.Header>

                  <Table.Header>Program</Table.Header>

                  <Table.Header>Low</Table.Header>

                  <Table.Header>Withdrawn</Table.Header>

                  <Table.Header>10/10/24</Table.Header>

                  <Table.Header>09/10/25</Table.Header>

                  <Table.Header></Table.Header>
                </Table.Row>
              </Table.Head>

              <Table.Body>
                <Table.Row>
                  <Table.Data>
                    <Checkbox
                      label="First name"
                      labelClass="text-[14px]"
                    />
                  </Table.Data>
                  <Table.Data>test</Table.Data>

                  <Table.Data>test</Table.Data>

                  <Table.Data>test</Table.Data>

                  <Table.Data>test</Table.Data>

                  <Table.Data>test</Table.Data>

                  <Table.Data>test</Table.Data>

                  <Table.Data>test</Table.Data>

                  <Table.Data>test</Table.Data>

                  <Table.Data>test</Table.Data>

                  <Table.Data>test</Table.Data>

                  <Table.Data>
                    <div className="flex justify-end">
                      <Button
                        eventName="Update Beneficiary"
                        //   id={id.toString()}
                        buttonType="default"
                        type="button"
                        className="p-[3px]"
                      >
                        <img
                          alt="pencil"
                          src={pencil}
                        />
                      </Button>

                      <Button
                        eventName="Delete Beneficiary"
                        // id={id.toString()}
                        buttonType="default"
                        type="button"
                        onClick={() => {
                          setModal("delete");
                        }}
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

          <div className="flex justify-end absolute bottom-4 right-2">
            <Pagination
              page={page}
              onPageChange={(val) => setPage(val)}
              total={10}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BeneficiariesPage;
