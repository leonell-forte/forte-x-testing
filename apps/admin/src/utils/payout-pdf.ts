import type { IMilestone } from "@/lib/types/milestones";
import type { Payout } from "@/lib/types/payouts";
import { formatCurrency } from "@/lib/utils";

interface PayoutPdfOptions {
  payout: Payout;
  bankDetails: any;
}

export const generatePayoutPdf = ({
  payout,
  bankDetails,
}: PayoutPdfOptions) => {
  // Group milestones by project
  const projectMilestones: Record<string, IMilestone[]> = {};

  payout.milestones.forEach((milestone) => {
    const projectName = milestone.outcome.name || "Unknown Project";
    if (!projectMilestones[projectName]) {
      projectMilestones[projectName] = [];
    }
    projectMilestones[projectName].push(milestone);
  });

  // Format date as DD Month YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };
  console.log(projectMilestones, "asdasds");

  // Current date
  const currentDate = formatDate(new Date().toISOString());

  // Calculate billing period (assuming it's the current month)
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const billingPeriod = `${formatDate(firstDayOfMonth.toISOString())} to ${formatDate(lastDayOfMonth.toISOString())}`;

  // Generate HTML content for the PDF
  return `
    <html>
      <head>
        <title>Payout #${payout.id}</title>
        <style>
          ${Array.from(document.getElementsByTagName("link"))
            .filter((link) => link.rel === "stylesheet")
            .map((link) => `<link rel="stylesheet" href="${link.href}" />`)
            .join("")}
          @import url('@/src/styles/print.css');
          
          /* Inline critical styles to ensure they're applied */
          @page {
            size: 900px 1200px;
            margin: 0 !important;
          }

           html {
            margin: 0 !important;
            padding: 0 !important;
            height: 100% !important;
            width: 100% !important;
          }
          
          body { 
            font-family: Arial, sans-serif;
            color: #000;
            background-color: white;
            margin: 0 !important; 
            padding: 0 !important; 
            max-width: 1050px;
            font-size: 14px;
          }
          
          /* Force background colors to print */
          * { 
            -webkit-print-color-adjust: exact !important; 
            color-adjust: exact !important; 
            print-color-adjust: exact !important;
          }
          
          /* Grid layout styles */
          .grid { 
            display: grid !important; 
            gap: 20px !important; 
            width: 100% !important;
            margin: 0 auto !important;
           
            box-sizing: border-box !important;
          }
          
          .grid-cols-2 { 
            grid-template-columns: 1fr 1fr !important; 
          }

          .print-container {
            display: flex;
            flex-direction: column;
            gap: 24px;
            padding: 24px 40px;
          }
          
          .print-header {
            background: linear-gradient(90deg, #000 0%, #00a99d 100%) !important;
            color: white !important;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .print-logo {
            font-size: 28px;
            font-weight: bold;
          }
          
          .print-payout-id {
            font-size: 20px;
            font-weight: bold;
          }
          
          .print-section {
            page-break-inside: avoid;
          }
          
          .print-company-info {
            display: flex;
            justify-content: space-between;
          
          }
          
          .print-company-details {
            width: 50%;
            display: flex;
            flex-direction: column;
            gap:4px
          }
          
          .print-payout-details {
            width: 50%;
            text-align: left;
            line-height: 18px;
            display: flex;
            flex-direction: column;
            gap:4px;
            > div {
              display: flex;
              justify-content: space-between;
            }
          }
          
          .print-section-header {
            background-color: #42ECA880 !important;
            color: #000 !important;
            padding: 10px 20px;
            font-weight: bold;
            border-radius: 8px 8px 0px 0px;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .print-account-summary {
            display: flex;
            flex-wrap: wrap;
            padding: 10px 20px;
          }
          
          .print-account-item {
            width: 50%;
            margin-bottom: 10px;
          }
          
          .print-account-label {
            font-weight: bold;
            margin-bottom: 5px;
            word-break: keep-all;
          }
          
          .print-account-value {
          }
          
          .print-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
            
          
          .print-table th {
            background-color: #fff;
            padding: 8px;
            text-align: left;
            font-weight: bold;
            border-bottom: 1px solid #ddd;
          }
          
          .print-table td {
            padding: 8px;
            border-bottom: 1px solid #ddd;
          }
          
          .print-project-header {
            font-weight: bold;
            font-size: 16px;
            margin: 20px 0 10px 0;
          }
          
          .print-total {
            background-color: #42ECA880 !important;
            padding: 10px 20px;
            text-align: right;
            font-weight: bold;
            margin-top: 20px;
            margin-left: auto;
            border-radius: 4px;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
            width: 238px !important;
            display: flex;
            justify-content: space-between;
          }
        </style>
      </head>
      <body>

        <div class="print-header">
            <div class="print-logo"><img src="/logo.png" alt="Forte" style="height: 40px;" /></div>
            <div class="print-payout-id">Payout #${payout.id}</div>
          </div>
        <div class="print-container">
          <!-- Header with logo and payout ID -->
        
          
          <!-- Company and payout information -->
          <div class="print-company-info">
            <div class="print-company-details">
              <div style="font-weight: bold;">Forte Global, Inc</div>
              <div>Forte Global</div>
              <div>447 Broadway, 2nd Floor, #380</div>
              <div>New York City, NY 10013</div>
              <div>Phone: +1 (917) 865-8734</div>
            </div>
            <div class="print-payout-details">
              <div class="grid grid-cols-2"><span>Date:</span> <span>${currentDate}</span></div>
              <div class="grid grid-cols-2"><span>Payout ID:</span> <span>#${payout.id}</span></div>
              <div class="grid grid-cols-2"><span>Provider Registration #:</span> <span>${payout.provider?.id || "XXXXXXXXXX"}</span></div>
            </div>
          </div>
          
          <div class="grid grid-cols-2">
            <!-- Bill To Section -->
            <div class="print-section">
            
            </div>
            
            <!-- Account Summary Section -->
            <div class="print-section">
              <div class="print-section-header">ACCOUNT SUMMARY</div>
              <div class="print-account-summary">
                <div class="print-account-item grid grid-cols-2">
                  <div class="print-account-label">Account Number</div>
                  <div class="print-account-value">XXX-XXX-XXXX</div>
                </div>
                <div class="print-account-item grid grid-cols-2">
                  <div class="print-account-label">Account Name</div>
                  <div class="print-account-value">${bankDetails?.data?.[0]?.accountHolderName || "Account Name"}</div>
                </div>
                <div class="print-account-item grid grid-cols-2" style='width: 100%;'>
                  <div class="print-account-label">Total Balance Paid out</div>
                  <div class="print-account-value">${formatCurrency(Number(payout.amount))}</div>
                </div>
                <div class="print-account-item grid grid-cols-2" style='width: 100%;'>
                  <div class="print-account-label">Billing Period</div>
                  <div class="print-account-value">${billingPeriod}</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Payout Summary Section -->
          <div class="print-section">
            <div class="print-section-header">PAYOUT SUMMARY</div>
            
            ${Object.entries(projectMilestones)
              .map(
                ([projectName, milestones]) => `
              <div class="print-project-header">${projectName} (${milestones[0].funder.name})</div>
              <table class="print-table">
                <thead>
                  <tr>
                    <th>Milestone ID</th>
                    <th>Type</th>
                    <th>Reference</th>
                    <th>Outcome name</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${milestones
                    .map(
                      (milestone) => `
                    <tr>
                      <td>ID#${milestone.id}</td>
                      <td>${milestone.type}</td>
                      <td>${milestone.reference?.name || "Contract name"}</td>
                      <td>${milestone.outcome?.name || "Graduation"}</td>
                      <td>${formatCurrency(Number(milestone.cost))}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            `
              )
              .join("")}
            
            <!-- Total Section -->
            <div class="print-total">
              <span>TOTAL:</span> <span>${formatCurrency(Number(payout.amount))}</span>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const downloadPayoutPdf = (payout: Payout, bankDetails: any) => {
  // Generate the HTML content
  const htmlContent = generatePayoutPdf({ payout, bankDetails });

  // Create a new window for printing
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups for this website");
    return;
  }

  // Write the HTML content to the new window
  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Add event listener for when content is loaded
  printWindow.onload = () => {
    // Trigger print dialog
    printWindow.print();

    // Close the window after printing (or if print is canceled)
    printWindow.onafterprint = () => {
      printWindow.close();
    };
  };
};
