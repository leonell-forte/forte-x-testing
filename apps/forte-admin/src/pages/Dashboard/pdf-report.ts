import { IOption } from "@/components/ui/dropdown";

export const generatePdf = ({
  customFilename,
  styleText,
  pageTitle,
  contentClone,
  project,
}: {
  customFilename: string;
  styleText: string;
  pageTitle: string;
  contentClone: HTMLElement;
  project: IOption | null;
}) => {
  return `
        <html>
          <head>
            <title>${customFilename}</title>
            <style>
              ${styleText}
              /* Additional print-specific styles */
              @page {
                size: 1300px 2080px;
              }
              
              html, body {
                height: 100%;
                width: 100%;
                margin: 0;
                padding: 0;
                overflow: visible;
              }
              body { 
                margin: 0; 
                padding: 50px 0 !important; 
                color: #000000 !important; 
                background-color: white !important;
                font-family: Arial, sans-serif !important;
              }
              * { 
                -webkit-print-color-adjust: exact !important; 
                color-adjust: exact !important; 
                print-color-adjust: exact !important;
              }
              p, span, h1, h2, h3, h4, h5, h6, div { color: #000000 !important; }
              .text-white, .text-gray-400, .text-gray-500 { color: #000000 !important; }
              
              /* Dashboard header styling - more compact */
              .dashboard-header {
               max-width:1050px;
               margin: 0 auto;
              }
              .dashboard-title {
                font-size: 58px;
                font-weight: 800;
                color: #000000;
              }
              
              /* Force two-column layout with even widths and compact spacing */
              .grid { 
                display: grid !important; 
                grid-template-columns: calc(50% - 10px) calc(50% - 10px) !important; 
                gap: 20px !important; 
                width: 100% !important;
                max-width: 1000px !important;
                margin: 0 auto !important;
                padding: 0 15px !important;
                box-sizing: border-box !important;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
              .grid-cols-1 { grid-template-columns: calc(50% - 10px) calc(50% - 10px) !important; }
              .lg:grid-cols-2 { grid-template-columns: calc(50% - 10px) calc(50% - 10px) !important; }
              
              /* Ensure each grid item takes full width of its column with compact spacing */
              .grid > * {
                width: 100% !important;
                box-sizing: border-box !important;
                background-color: white !important;
                border-radius: 6px !important;
                // box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
                overflow: hidden !important;
                margin-bottom: 10px !important;
                padding: 10px !important;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
              
              /* Compact spacing for text elements */
              p, h1, h2, h3, h4, h5, h6 {
                margin-bottom: 5px !important;
                line-height: 1.3 !important;
                font-size: 0.95em !important;
              }
              
              /* Compact table spacing */
              table {
                border-spacing: 4px !important;
                width: 100% !important;
                font-size: 0.9em !important;
              }
              
              td, th {
                padding: 4px !important;
              }
              
              /* Prevent page breaks */
              * {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
              
              /* Make legends more compact */
              .legend, [class*='legend'], [class*='more'] {
                display: inline-block !important;
                margin-right: 10px !important;
                font-size: 0.85em !important;
              }
              
              /* Fix SVG and chart colors */
              svg, canvas {
                max-width: 100% !important;
              }
              
              /* Make segmented progress bar border black for printing */
              svg rect {
                stroke: #000000 !important;
                stroke-width: 1px !important;
              }
              
              /* Make contract milestone segments black for printing */
              .contract-milestone-segment {
                fill: #000000 !important;
              }
              
              /* Fix SVG rendering for printing */
              svg {
                width: 100% !important;
                height: auto !important;
                max-width: 100% !important;
                overflow: visible !important;
                display: block !important;
              }
              
              /* Ensure paths within SVGs are visible */
              svg path {
                vector-effect: non-scaling-stroke !important;
              }

              .data-text-component.wrapper {
              padding-top:30px !important}

              .data-text-component,.data-text-component * {
                padding: 0 !important; 
              }

              
              
              /* Fix DataText component trend icons */
              .data-text-component .print-trend-container {
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
              }
              
              .print-trend-icon {
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                width: 16px !important;
                height: 16px !important;
                min-width: 16px !important;
                min-height: 16px !important;
              }
              
              .print-trend-icon svg {
                width: 16px !important;
                height: 16px !important;
                min-width: 16px !important;
                min-height: 16px !important;
                display: block !important;
              }
              
              .print-visible, .print-visible-icon {
                visibility: visible !important;
                display: block !important;
              }
              
              /* Fix for tile header icons */
              svg.print-visible-icon {
                width: 24px !important;
                height: 24px !important;
                min-width: 24px !important;
                min-height: 24px !important;
                fill: #000000 !important;
                stroke: #000000 !important;
                display: inline-block !important;
              }

              .action-item {
                height: 38.67px !important;
              }

              .action-item * {
                font-size: 10.84px !important;
              }

              .tile-header, .tile-header * {
              padding: 0 !important;
                margin: 0 !important;
              }
              
              /* Ensure TileHeader icons are visible */
              .tile-header svg {
                width: 24px !important;
                height: 24px !important;
                min-width: 24px !important;
                min-height: 24px !important;
                fill: #000000 !important;
                stroke: #000000 !important;
                display: inline-block !important;
              }
              
              /* Fix Budget component text alignment */
              .budget-content {
                padding: 16px 0 !important;
                margin-top: 0 !important;
              }
              
              .budget-remaining {
                margin-bottom: 16px !important;
              }
              
              .budget-remaining p {
                text-align: left !important;
                margin-bottom: 4px !important;
              }
              
              /* Fix ActionItems alignment to match Budget */
              .action-items-list {
                margin-top: 0 !important;
                padding-top: 16px !important;
              }
              
              /* Ensure consistent card heights */
              #pdf .grid > div {
                height: auto !important;
                min-height: 0 !important;
              }
              
              /* Ensure consistent spacing in cards */
              .card {
                display: flex !important;
                flex-direction: column !important;
              }
              
              /* Make card content fill available space */
              .card > div:nth-child(2) {
                flex: 1 !important;
              }

              .data-legend * {
                padding: 0 !important;  
              }

              .segmented-tick-container {
                transform: translateY(-16px) !important;
              }
              
              /* Fix SegmentedProgressBar alignment */
              .segmented-progress-bar * {
                margin: 0 !important;
                padding: 0 !important;
              }

              .segmented-progress-bar .label-container {
                top: -30px !important;
              }

              .tile-container {
                padding: 0 !important;
                margin: 0 !important;
              }
              
              .segmented-tick-value {
                font-size: 13.54px !important;
              } .segmented-tick-label {
                font-size: 10.84px !important;
              }
              
              /* Fix tick labels alignment */
              .segmented-progress-bar .flex.justify-between {
                margin-top: 8px !important;
                text-align: left !important;
              }
              
              .segmented-progress-bar .flex.justify-between > div:first-child {
                text-align: left !important;
              }
              
              .segmented-progress-bar .flex.justify-between > div:last-child {
                text-align: right !important;
              }

              .data-text-value {
padding-left: 8px;
font-size: 18.96px !important;
              }
              
              /* Fix legend alignment */
              .budget-legend {
              margin: 0 !important;
                padding: 0 0 !important;
                display: flex !important;
                flex-wrap: wrap !important;
                justify-content: center !important;
              }
              
              /* Make pie chart stroke black for printing */
              .recharts-pie .recharts-sector {
                stroke: #000000 !important;
                stroke-width: 1px !important;
              }
              
              /* Hide any unnecessary elements for print */
              button, .hidden-print, .hide-in-print {
                display: none !important;
              }
              
              /* Hide InfoTooltip component when printing */
              .info-tooltip-icon {
                display: none !important;
              }
              
              /* Make truncated text wrap instead of using ellipsis in print */
              .print-wrap-text {
                white-space: normal !important;
                overflow: visible !important;
                text-overflow: clip !important;
                word-wrap: break-word !important;
                word-break: break-word !important;
                max-width: none !important;
              }
              
              /* Ensure consistent spacing between tiles */
              #pdf .grid {
                display: grid !important;
                grid-template-columns: 1fr 1fr !important;
                gap: 40px !important;
                row-gap: 40px !important;
                column-gap: 40px !important;
              }
              
              /* Reset any margins that might cause inconsistent spacing */
              #pdf .grid > * {
                margin: 0 !important;
                padding: 0 !important;
              }
              
              /* Add consistent padding to cards */
              .card, .dashboard-card {
                margin: 0 !important;
                box-shadow: none !important;
                border: none !important;
                border-bottom: 1px solid #E5E5E5 !important;
              }
              
              /* Ensure MultipleTile has consistent spacing */
              .multiple-tile {
                margin: 0 !important;
                padding: 0 !important;
              }
              
              /* Ensure consistent spacing for all components */
              #pdf .grid > div > div {
                margin-bottom: 0 !important;
              }
              
              /* Style the dashboard header for print */
              
              .dashboard-title {
                font-family: sans-serif !important;
                color: #000000 !important;
              }
              
              .dashboard-filter {
                font-family: sans-serif !important;
                color: #000000 !important;
              }
            </style>
            ${Array.from(document.getElementsByTagName("link"))
              .filter((link) => link.rel === "stylesheet")
              .map((link) => `<link rel="stylesheet" href="${link.href}" />`)
              .join("")}
            <script>
              // Set document title for filename
              document.title = "${customFilename}";
            </script>
          </head>
          <body>
            <div class='dashboard-header' style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding: 0 40px;">
              <div class="dashboard-title" style="font-size: 58px; font-weight: 600;">${pageTitle}</div>
              <div class="dashboard-filter" style="display: flex; align-items: center;">
                <div style="display: flex; align-items: center; gap: 8px;">


                  <span style="font-weight: 500;">${project?.label || "All projects"}</span>
                </div>
              </div>
            </div>
            <div style="color: #000000;">
              ${contentClone.innerHTML}
            </div>
          </body>
        </html>
      `;
};
