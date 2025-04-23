import { get } from "lodash";
import { useMemo } from "react";
import { FaTrash as Trash } from "react-icons/fa6";

import { useAppDispatch, useAppSelector } from "lib/hooks";
import { useDeletePartnerMutation } from "lib/mutations/partners";
import { removePartner } from "lib/slice/partners";
import { IOrganization, Partner } from "lib/types/organizations";

import { queryClient } from "components/QueryProvider";
import { useCustomPrompt } from "components/ui/alert/custom-prompt";
import Table from "components/ui/table";
import Cards from "components/ui/table-card";

type PartnerProps = {
  partners: Partner[];
  orgId: string; // Add this prop
};

const config = {
  delete: {
    title: "Remove partner",
    subText: "Are you sure you want to remove this partner?",
  },
};

const Partners = ({ partners, orgId }: PartnerProps) => {
  const dispatch = useAppDispatch();
  const { partnersToAdd } = useAppSelector((state) => state.partners);

  const partnersList: Partner[] = useMemo(
    () => [...partners, ...partnersToAdd],
    [partners, partnersToAdd]
  );

  const { open } = useCustomPrompt();
  const { deletePartner } = useDeletePartnerMutation(orgId);

  const handleDelete = async (organizationId: number, partnerId?: string) => {
    if (partnerId) {
      await deletePartner(partnerId);

      queryClient.setQueryData(
        ["specific org", orgId],
        (prev: IOrganization): IOrganization => {
          console.log(prev);

          return { ...prev, noOfPartners: prev.noOfPartners! - 1 };
        }
      );
      return;
    }
    dispatch(removePartner(organizationId));
  };

  return (
    <div className="space-y-[30px]">
      <div className="md:hidden">
        <Cards.Container>
          {partnersList.map((item, index) => {
            const { partner } = item;
            const { name, registeredName, registeredNumber, id } = partner;

            return (
              <Cards.Card key={index}>
                <div className="space-y-2">
                  <p className="font-semibold">{name}</p>
                  <Cards.Group>
                    <Cards.Details
                      label="Registered name"
                      value={registeredName}
                    />
                    <Cards.Details
                      label="Registration ID"
                      value={registeredNumber}
                      capitalize
                    />
                  </Cards.Group>
                  <div className="absolute bottom-3 right-4 z-50">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        open({
                          ...get(config, "delete"),
                          onYes: () => handleDelete(id, item?.id),
                          yesLabel: "Remove",
                        });
                      }}
                      className="group"
                    >
                      <Trash className="h-auto w-4 transition-all group-hover:fill-mint" />
                    </button>
                  </div>
                </div>
              </Cards.Card>
            );
          })}
        </Cards.Container>
      </div>

      <div className="hidden md:block">
        <Table.Container
          emptyConfig={{
            title: "No partners yet.",
            description: "Add a partner by clicking the ‘Add’ button above.",
            status: !partnersList.length,
          }}
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
            {partnersList.map((item, index) => {
              const { partner } = item;
              const { name, registeredName, registeredNumber, id } = partner;

              return (
                <Table.Row key={index}>
                  <Table.Data>{name}</Table.Data>
                  <Table.Data>{registeredName}</Table.Data>
                  <Table.Data>{registeredNumber}</Table.Data>
                  <Table.Data>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        open({
                          ...get(config, "delete"),
                          onYes: () => handleDelete(id, item?.id),
                          yesLabel: "Remove",
                        });
                      }}
                      className="group"
                    >
                      <Trash className="h-auto w-4 transition-all group-hover:fill-mint" />
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

export default Partners;

const HEADERS = ["Organization name", "Registered name", "Registration ID"];
