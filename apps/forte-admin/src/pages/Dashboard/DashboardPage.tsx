import { format } from "date-fns";
import { useCallback, useMemo } from "react";

import Download from "@/assets/images/icons/download.svg?react";
import ActionItems from "@/components/Dashboard/Dashboard/ActionItems";
import BeneficiariesTile from "@/components/Dashboard/Dashboard/BeneficiariesTile";
import Budget from "@/components/Dashboard/Dashboard/Budget";
import Contract from "@/components/Dashboard/Dashboard/Contract";
import ContractMilestoneProgress from "@/components/Dashboard/Dashboard/ContractMilestoneProgress";
import DashboardFilter from "@/components/Dashboard/Dashboard/DashboardFilter";
import Milestones from "@/components/Dashboard/Dashboard/Milestones";
import MultipleTile from "@/components/Dashboard/Dashboard/MultipleTile";
import Project from "@/components/Dashboard/Dashboard/Project";
import ProjectMilestone from "@/components/Dashboard/Dashboard/ProjectMilestone";
import ProjectMilestoneProgress from "@/components/Dashboard/Dashboard/ProjectMilestoneProgress";
import { useDashboardState } from "@/components/Dashboard/Dashboard/useDashboardState";
import { DEFAULT_DATE_FORMAT } from "@/lib/constants";

import { generatePdf } from "./pdf-report";

function DashboardPage() {
  const { project } = useDashboardState();

  const printPdfSection = useCallback(() => {
    const printContent = document.getElementById("pdf");
    // Use a fixed title instead of trying to query with Tailwind classes
    const pageTitle = "Dashboard";

    if (printContent) {
      // Clone the content to modify it without affecting the original
      const contentClone = printContent.cloneNode(true) as HTMLElement;

      // Ensure the grid has the right class for two columns
      const gridElement = contentClone.querySelector(".grid") as HTMLElement;
      if (gridElement) {
        // Reset the grid to ensure consistent styling
        gridElement.className = "grid grid-cols-2";
        gridElement.style.display = "grid";
        gridElement.style.gridTemplateColumns = "1fr 1fr";
        gridElement.style.height = "auto";
        gridElement.style.margin = "0 auto";
        gridElement.style.padding = "40px";

        // Set explicit and consistent gap values
        gridElement.style.gap = "40px";
        gridElement.style.rowGap = "40px";
        gridElement.style.columnGap = "40px";

        // Ensure all direct children have consistent margins and padding
        const gridChildren = gridElement.children;
        for (let i = 0; i < gridChildren.length; i++) {
          const child = gridChildren[i] as HTMLElement;
          child.style.margin = "0";
          child.style.padding = "0";
        }
      }

      // Ensure all content stays on a single page by compressing it
      const allElements = contentClone.querySelectorAll("*");
      allElements.forEach((el: Element) => {
        if (el instanceof HTMLElement) {
          // Reduce margins and padding to fit everything on one page
          if (el.className.includes("flex") || el.className.includes("grid")) {
            el.style.padding = "8px";
            el.style.margin = "0";
          }

          // Make sure no page breaks occur within elements
          el.style.pageBreakInside = "avoid";
          el.style.breakInside = "avoid";
        }
      });

      // Ensure SVG elements are properly rendered
      const svgElements = contentClone.querySelectorAll("svg");
      svgElements.forEach((svg: SVGElement) => {
        // Make sure SVGs have explicit width and height
        if (!svg.hasAttribute("width") || !svg.hasAttribute("height")) {
          const rect = svg.getBoundingClientRect();
          svg.setAttribute("width", `${Math.ceil(rect.width)}px`);
          svg.setAttribute("height", `${Math.ceil(rect.height)}px`);
        }
        // Ensure SVG has viewBox for proper scaling
        if (
          !svg.hasAttribute("viewBox") &&
          svg.hasAttribute("width") &&
          svg.hasAttribute("height")
        ) {
          const width = parseFloat(svg.getAttribute("width") || "0");
          const height = parseFloat(svg.getAttribute("height") || "0");
          svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        }
      });

      // Fix segmented progress bars specifically
      const progressBars = contentClone.querySelectorAll(
        ".segmented-progress-bar"
      );
      progressBars.forEach((bar: Element) => {
        if (bar instanceof HTMLElement) {
          bar.style.width = "100%";
          bar.style.maxWidth = "none";
          bar.style.overflow = "visible";
        }
      });

      // Find and compress any legends or extra elements that might cause page breaks
      const legendElements = contentClone.querySelectorAll(
        ".legend, [class*='legend'], [class*='more']"
      );
      legendElements.forEach((el: Element) => {
        if (el instanceof HTMLElement) {
          el.style.display = "inline-block";
          el.style.marginRight = "10px";
        }
      });
      // Create a new window for printing
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert("Please allow popups for this website");
        return;
      }

      // Get all stylesheets from the current document
      const stylesheets = Array.from(document.styleSheets);
      let styleText = "";

      // Try to extract CSS rules from stylesheets
      stylesheets.forEach((stylesheet) => {
        try {
          if (stylesheet.cssRules) {
            const cssRules = Array.from(stylesheet.cssRules);
            cssRules.forEach((rule) => {
              styleText += rule.cssText + "\n";
            });
          }
        } catch (e) {
          // Some stylesheets may not be accessible due to CORS
          console.log("Could not access stylesheet", e);
        }
      });

      // Set custom filename for the PDF
      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;
      const customFilename = `${project?.label || "All projects"} - ${format(new Date(formattedDate), DEFAULT_DATE_FORMAT)}.pdf`;

      // Add necessary styles to the new window
      printWindow.document.write(
        generatePdf({
          customFilename,
          styleText,
          pageTitle,
          contentClone,
          project,
        })
      );

      printWindow.document.close();
      printWindow.focus();

      // Print after content is loaded
      printWindow.onload = function () {
        // Set document title which will be used as filename
        printWindow.document.title = customFilename;
        printWindow.print();
        printWindow.onafterprint = function () {
          printWindow.close();
        };
      };
    }
  }, [project]);

  const multipleTiles = useMemo(() => {
    if (project) {
      return [
        <Contract key="contract" />,
        <ProjectMilestone key="project-milestone" />,
      ];
    }
    return [<Project key="project" />, <Contract key="contract" />];
  }, [project]);

  return (
    <div className="flex h-full flex-col space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-[24px] font-semibold">Dashboard</p>
        <div className="flex items-center gap-4">
          <DashboardFilter />
          <button
            onClick={printPdfSection}
            className="flex cursor-pointer items-center gap-[14px]"
          >
            <Download stroke="#ffffff" className="!opaceity-1" />
            <span className="font-[450] underline underline-offset-4">
              Download report
            </span>
          </button>
        </div>
      </div>

      <div id="pdf" className="flex h-full flex-col justify-between gap-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Budget />
          <ActionItems />
          <MultipleTile tiles={multipleTiles} />
          <BeneficiariesTile />
          {!project && <Milestones />}
          {project && <ContractMilestoneProgress />}
          {project && <ProjectMilestoneProgress />}
        </div>
      </div>
      {/* <Components /> */}
    </div>
  );
}

export default DashboardPage;
