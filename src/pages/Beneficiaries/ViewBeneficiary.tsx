import { useQuery } from "@tanstack/react-query";
import beneficiaryService from "api/beneficiaries";
import evidenceService from "api/evidence";
import { isNumber } from "lodash";
import * as React from "react";
import { HiPencil } from "react-icons/hi";
import { usePhoneInput } from "react-international-phone";
import { useParams } from "react-router-dom";

import { isPhoneValid } from "lib/isPhoneValid";
import { getStatusVariant } from "lib/utils";

import PersonalDetailsSection from "components/Dashboard/Beneficiaries/Dialogues/Sections/PersonalDetails";
import ProjectDetailsSection from "components/Dashboard/Beneficiaries/Dialogues/Sections/ProjectsDetails";
import { showSetupBeneficiaryModal } from "components/Dashboard/Beneficiaries/Dialogues/SetupBeneficiary";
import EvidenceTable from "components/tables/Evidences";
import MilestonesTable from "components/tables/Milestones";
import Button from "components/ui/button";
import Spinner from "components/ui/spinner/spinner";
import Status from "components/ui/status";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "components/ui/tabs/Tabs";

import { useBeneficiaryStore } from "./BeneficiariesPage";

export default function ViewBeneficiary() {
  const { setBeneficiaryName } = useBeneficiaryStore();
  const params = useParams();

  const id = Number(params.beneficiaryId);

  const { data: beneficiary, isLoading } = useQuery({
    queryKey: ["beneficiary-details", id],

    queryFn: () => beneficiaryService.getOne(id),

    enabled: Boolean(id),
  });

  const { data: milestones, isLoading: isMilestoneLoading } = useQuery({
    queryKey: ["beneficiary-milestones", id],

    queryFn: () => beneficiaryService.listMilestones({ beneficiaryId: id }),

    enabled: Boolean(id),
  });

  const { data: evidences, isLoading: isEvidenceLoading } = useQuery({
    queryKey: ["beneficiary-evidences", id],

    queryFn: () => evidenceService.list(id),
  });

  const { inputValue: formattedPhone } = usePhoneInput({
    value: beneficiary?.phone,
  });

  const beneficiaryName = React.useMemo(
    () =>
      beneficiary ? `${beneficiary.firstName} ${beneficiary.lastName}` : "",
    [beneficiary]
  );

  React.useEffect(() => {
    if (!beneficiaryName) return;
    setBeneficiaryName(beneficiaryName);
  }, [beneficiaryName]);

  if (isLoading)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    );

  if (!beneficiary) return null;

  return (
    <>
      <div className="space-y-8">
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-x-2">
              <div className="t-1 text-2xl">{beneficiaryName}</div>
              <Status variant={getStatusVariant(beneficiary.status)}>
                {beneficiary.status}
              </Status>
            </div>
            <div className="space-x-0.5 text-sm opacity-50">
              <span>{beneficiary.email}</span>
              {isPhoneValid(beneficiary.phone) ? (
                <span> | {formattedPhone}</span>
              ) : null}
            </div>
          </div>

          <Button
            buttonType="secondary"
            className="group"
            onClick={() => showSetupBeneficiaryModal(beneficiary)}
          >
            <HiPencil className="h-auto w-6 transition duration-500 group-hover:fill-mint" />
            Edit
          </Button>
        </div>
        <Tabs defaultValue="project-details">
          <TabsList>
            <TabsTrigger value="project-details">Project Details</TabsTrigger>
            <TabsTrigger value="personal-details">Personal Details</TabsTrigger>
          </TabsList>
          <TabsContent value="project-details">
            <ProjectDetailsSection beneficiary={beneficiary} />
          </TabsContent>
          <TabsContent value="personal-details">
            <PersonalDetailsSection
              beneficiary={{ ...beneficiary, phone: formattedPhone }}
            />
          </TabsContent>
        </Tabs>

        <Tabs defaultValue="milestones">
          <TabsList>
            <TabsTrigger value="milestones">
              Miletones{" "}
              {milestones && isNumber(milestones?.data.length)
                ? `(${milestones.data.length})`
                : null}
            </TabsTrigger>
            <TabsTrigger value="evidences">
              {" "}
              Evidences{" "}
              {evidences && isNumber(evidences?.totalSize)
                ? `(${evidences?.totalSize})`
                : null}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="milestones">
            <MilestonesTable
              list={milestones?.data || []}
              isLoading={isMilestoneLoading}
              href="milestone/"
            />
          </TabsContent>
          <TabsContent value="evidences">
            <EvidenceTable
              list={evidences?.items || []}
              isLoading={isEvidenceLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
