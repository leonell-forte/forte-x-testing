import { useEffect, useState } from "react";

import { useModal } from "@/components/ui/dialogue/v2/Modal";
import Spinner from "@/components/ui/spinner/spinner";

const hubspotFormMeta = {
  portalId: "23558385",
  formId: "05b5519e-99d9-4960-af5d-8feacdd1d1d1",
};

export function showGetHelpModal() {
  useModal.getState().open({
    component: <GetHelpModal />,
    size: "xl",
    title: "Support",
  });
}

function GetHelpModal() {
  const [isLoading, setIsLoading] = useState(true);
  const id = "get-help";

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//js.hsforms.net/forms/embed/v2.js";
    script.charset = "utf-8";
    script.type = "text/javascript";
    script.async = true;
    script.onload = () => {
      if ((window as any).hbspt) {
        (window as any).hbspt.forms.create({
          portalId: hubspotFormMeta.portalId,
          formId: hubspotFormMeta.formId,
          target: `#${id}`,
          onFormReady: () => setIsLoading(false),
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      setIsLoading(true);
    };
  }, []);

  return (
    <div
      id="hubspotForm"
      className="flex min-h-[calc(100vh-300px)] items-center justify-center"
    >
      {isLoading && <Spinner />}
      <div id={id} className={isLoading ? "hidden" : ""} />
    </div>
  );
}
