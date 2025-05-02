import { useQuery } from "@tanstack/react-query";
import beneficiaryService from "api/beneficiaries";
import evidenceService from "api/evidence";
import { isNumber } from "lodash";
import * as React from "react";
import { usePhoneInput } from "react-international-phone";
import { useParams } from "react-router-dom";

import { ReactComponent as Pencil } from "assets/images/icons/pencil.svg";

import { isPhoneValid } from "lib/isPhoneValid";
import { Beneficiaries, IsAuthorized } from "lib/role-permissions";
import { getStatusVariant } from "lib/utils";

import PersonalDetailsSection from "components/Dashboard/Beneficiaries/Dialogues/Sections/PersonalDetails";
import ProjectDetailsSection from "components/Dashboard/Beneficiaries/Dialogues/Sections/ProjectsDetails";
import { showSetupBeneficiaryModal } from "components/Dashboard/Beneficiaries/Dialogues/SetupBeneficiary";
import EvidenceTable from "components/tables/Evidences";
import MilestonesTable from "components/tables/Milestones";
import Button from "components/ui/button";
import Spinner from "components/ui/spinner/spinner";
import Status from "components/ui/status";
import Tabs from "components/ui/tabs/Tabs";

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
    value: beneficiary?.phone || "",
  });

  const beneficiaryName = React.useMemo(
    () =>
      beneficiary ? `${beneficiary.firstName} ${beneficiary.lastName}` : "",
    [beneficiary]
  );

  const upperTabs = React.useMemo(() => {
    if (!beneficiary) return [];
    return [
      {
        value: "project-details",
        label: "Project Details",
        content: <ProjectDetailsSection beneficiary={beneficiary} />,
      },
      {
        value: "personal-details",
        label: "Personal Details",
        content: (
          <PersonalDetailsSection
            beneficiary={{ ...beneficiary, phone: formattedPhone }}
          />
        ),
      },
    ];
  }, [beneficiary, formattedPhone]);

  const lowerTabs = React.useMemo(() => {
    return [
      {
        value: "milestones",
        label: `Milestones ${
          milestones && isNumber(milestones?.data.length)
            ? `(${milestones.data.length})`
            : null
        }`,
        content: (
          <MilestonesTable
            list={milestones?.data || []}
            isLoading={isMilestoneLoading}
            href="milestone/"
          />
        ),
      },
      {
        value: "evidences",
        label: `Evidences ${
          evidences && isNumber(evidences?.totalSize)
            ? `(${evidences?.totalSize})`
            : null
        }`,
        content: (
          <EvidenceTable
            list={evidences?.items || []}
            isLoading={isEvidenceLoading}
          />
        ),
      },
    ];
  }, [milestones, isMilestoneLoading, evidences, isEvidenceLoading]);

  React.useEffect(() => {
    if (!beneficiaryName) return;
    setBeneficiaryName(beneficiaryName);
  }, [beneficiaryName, setBeneficiaryName]);

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
              {isPhoneValid(beneficiary?.phone) ? (
                <span> | {formattedPhone}</span>
              ) : null}
            </div>
          </div>

          {IsAuthorized([Beneficiaries.UPDATE]) && (
            <Button
              buttonType="secondary"
              className="group"
              onClick={() =>
                showSetupBeneficiaryModal({ beneficiaryDetails: beneficiary })
              }
            >
              <Pencil height={14} />
              Edit
            </Button>
          )}
        </div>
        <Tabs tabs={upperTabs} />

        <Tabs tabs={lowerTabs} />
      </div>
    </>
  );
}
