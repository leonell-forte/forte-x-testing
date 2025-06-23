import { useQuery } from "@tanstack/react-query";
import invoiceService from "api/invoices";
import { useEffect } from "react";
import {
  createSearchParams,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import { formatCurrency, formatDate, getStatusVariant } from "lib/utils";

import MilestonesTable from "components/tables/Milestones";
import Button from "components/ui/button";
import InfoVertical from "components/ui/info-vertical/InfoVertical";
import Spinner from "components/ui/spinner/spinner";
import Status from "components/ui/status";
import { toast } from "components/ui/toast/Toast";

const IndividualInvoicePage = () => {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const id = params.invoiceId;

  const { data: invoice, isLoading } = useQuery({
    queryKey: ["invoice", id],
    queryFn: () => invoiceService.getOne(id!),
    enabled: !!id,
  });

  const onPay = (url: string) => {
    window.location.href = url;
  };

  useEffect(() => {
    if (searchParams.has("paymentStatus")) {
      const status = searchParams.get("paymentStatus");
      if (status) {
        searchParams.delete("paymentStatus");
        const newParams: { [key: string]: string } = {};
        searchParams.forEach((value: string, key: string) => {
          newParams[key] = value;
        });

        setSearchParams(newParams);
        navigate(
          {
            search: createSearchParams(newParams).toString(),
          },
          { replace: true }
        );
        if (status === "success" || status === "paid") {
          toast({ title: `Invoice ID: ${id} successfully paid` });
          return;
        }
        toast({ title: `Failed to pay Invoice ID: ${id}`, variant: "danger" });
      }
    }
    // eslint-disable-next-line
  }, []);

  if (isLoading)
    return (
      <div className="flex h-[470px] w-full items-center justify-center">
        <Spinner />
      </div>
    );

  if (!invoice) return null;

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="text-[24px] font-semibold">Invoice {id}</p>
            <Status variant={getStatusVariant(invoice.status)}>
              {invoice.status}
            </Status>
          </div>

          <div className="flex justify-end gap-4">
            {/* <Button buttonType="secondary" className="group">
              <DL className="h-auto w-6 transition-all duration-300 group-hover:stroke-mint" />
              Download
            </Button> */}

            {invoice.status === "pending" && (
              <Button
                className="!min-w-[155px]"
                onClick={() => onPay(invoice.paymentLink)}
              >
                Pay now
              </Button>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-4">
            <p className="heading w-fit whitespace-nowrap">Invoice Details</p>

            <div className="grid items-center gap-6 rounded-lg border p-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <InfoVertical label="Date Invoiced">
                {formatDate(invoice.createdAt, "dd MMMM yyy")}
              </InfoVertical>
              <InfoVertical label="Cost">
                {formatCurrency(invoice.cost, invoice.currency)}
              </InfoVertical>
              <InfoVertical label="Invoice ID">{invoice.id}</InfoVertical>

              <InfoVertical label="Date Paid">
                {invoice.paidAt
                  ? formatDate(invoice.paidAt, "dd MMMM yyy")
                  : "-"}
              </InfoVertical>
            </div>
          </div>

          <p className="text-[20px] font-semibold">Milestones</p>

          <MilestonesTable
            list={invoice.milestones || []}
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );
};

export default IndividualInvoicePage;
