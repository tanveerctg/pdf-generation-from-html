const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

let chrome = {};
let puppeteer;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  chrome = require("chrome-aws-lambda");
  puppeteer = require("puppeteer-core");
} else {
  puppeteer = require("puppeteer");
}

app.use(cors({ origin: "*" }));
app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "hello" });
});
app.post("/", async function (req, res) {
  let options = {};

  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    options = {
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chrome.defaultViewport,
      executablePath: chrome.executablePath(),
    };
  }

  const signature = req.body.signature;
  const tableContent = req.body.tableContent;
  const dynamicContent = req.body.dynamicContent;

  try {
    //launch browser
    const browser = await puppeteer.launch(options);

    // Create a new page
    const page = await browser.newPage();

    const html = `<!DOCTYPE html>
     <html lang="en" style="padding-top:15px;padding-bottom:15px;">
       <head>
         <meta charset="UTF-8" />
         <meta http-equiv="X-UA-Compatible" content="IE=edge" />
         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
         <title>PDF</title>
         <link rel="preconnect" href="https://fonts.googleapis.com">
         <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
         <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;1,100;1,400;1,700&display=swap" rel="stylesheet">
  
         <style>
            thead {
              display: table-header-group;
              break-inside: avoid;
            }
            .parent {
              display: block;
            }
            .wrapper {
              display: block;
              float: left;
              break-inside: avoid;
            }
            .table {
              display: table;
              width: 100%;
              border-collapse: collapse;
              border-spacing: 0;
            }
            
            .thead {
              padding-left: 1rem;
              padding-right: 1rem;
            }
            
            .tr {
              color: white;
              display: table-row;
              vertical-align: middle;
              outline: 0;
              background-color: #3E4095;
            }
            
            html,
            body {
              padding: 0;
              margin: 0;
              background-color: #FAFAFB;
            }
            
            .addBtn {
              background-color: #2e5ad4;
              color: white;
              font-weight: bold;
              border-radius: 4px;
              border: none;
              left: 30px;
              bottom: 20px;
              padding: 10px;
            }
            
            .addBtn:hover {
              cursor: pointer;
            }
            
            .SubmitBtn {
              background-color: #c7d42e;
              color: black;
              font-weight: bold;
              border: none;
              border-radius: 4px;
              left: 30px;
              bottom: 20px;
              padding: 10px;
            }
            
            .DisabledBtn {
              background-color: lightgray;
              color: darkgrey;
              font-weight: bold;
              border: none;
              border-radius: 4px;
              left: 30px;
              bottom: 20px;
              padding: 10px;
              pointer-events: none;
            }
            
            .SubmitBtn:hover {
              cursor: pointer;
            }
            
            /* /// */
            
            /* .block{
              background-color: greenyellow
            } */
            
            .table {
              display: table;
              width: 100%;
              border-collapse: collapse;
              border-spacing: 0;
            }
            
            .thead {
              padding-left: 1rem;
              padding-right: 1rem;
            }
            
            .tr {
              color: white;
              display: table-row;
              vertical-align: middle;
              outline: 0;
              background-color: #3E4095;
            }
            
            .tc {
              font-family: "Roboto","Helvetica","Arial",sans-serif;
              font-weight: 400;
              font-size: 0.875rem;
              line-height: 1.43;
              letter-spacing: 0.01071em;
              display: table-cell;
              vertical-align: inherit;
              border-bottom: 1px solid rgba(224, 224, 224, 1);
              text-align: left;
              padding: 16px;
            }
            
            .tbodytr {
              color: inherit;
              display: table-row;
              vertical-align: middle;
              outline: 0;
            }
            
            .tbodytd1 {
              font-family: "Roboto","Helvetica","Arial",sans-serif;
              font-weight: 400;
              font-size: 0.875rem;
              line-height: 1.43;
              letter-spacing: 0.01071em;
              display: table-cell;
              vertical-align: inherit;
              border-bottom: 1px solid rgba(224, 224, 224, 1);
              text-align: left;
              padding: 16px;
              color: rgba(0, 0, 0, 0.87);
              width: 50%;
            }
            
            .tbodytd234 {
              font-family: "Roboto","Helvetica","Arial",sans-serif;
              font-weight: 400;
              font-size: 0.875rem;
              line-height: 1.43;
              letter-spacing: 0.01071em;
              display: table-cell;
              vertical-align: inherit;
              border-bottom: 1px solid rgba(224, 224, 224, 1);
              text-align: left;
              padding: 16px;
              vertical-align: baseline;
              width: 5%;
            }
            
            .tbodytdwidth2{
              width: 10%;
            }
            
            .t700 {
              font-weight: 700;
              font-size: .8rem;
              line-height: 1.2;
              margin-bottom: 8px;
              margin-top: 0;
            }
            
            .t500 {
              font-weight: 500;
              font-size: .8rem;
              line-height: 1.2;
              margin-bottom: 8px;
              margin-top: 0;
            };
            
            .t500_2{
              margin:0;
              font-weight:500;
              font-size:.8rem;
              line-height:1.2
            }
            
            /* .t500_2 {
              font-weight: 500;
              font-size: .8rem;
              line-height: 1.2;
              margin-top: .5rem;
              margin-bottom: .5rem;
            } */
            
            
            .t500_3 {
              font-weight: 500;
              font-size: .8rem;
              line-height: 1.2;
              margin-top: .5rem;
              margin-bottom: .5rem
            }
            
            .tm {text-align: left; margin: 0}
            
            .tpb { text-align: left; padding-bottom: .8rem }
            
            .tpbm { text-align: left; padding-bottom: .8rem; margin: 0 }
            
            .btm {
              margin-bottom: 8px
            }
            
            .my{
              margin-top: 8px;
              margin-bottom: 8px;
            }
            
            .cpd {
              text-align: left;
              padding-bottom: .8rem;
              white-space: "pre-wrap";
              margin: 0,
            }
            
            /* // */
            
            .check{
                font-family: "Roboto","Helvetica","Arial",sans-serif;
                margin-top: 16px;
                margin-bottom: 24px;
                font-weight: 400;
                font-size: 1rem;
                line-height: 1.5;
                letter-spacing: 0.00938em;
            }
            
            .check input {
              border: none;
              margin-right: 16px;
            }
            
            .sigBoxContainer{
              margin: 0 auto;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            }
            
            .sigBoxCanvas { margin-top: 16px; margin-bottom: 16px}
            
            .sigBox{
            height: 200px;
            width: 300px;
            background-color: white;
            border-radius: 4px;
            outline: 1px solid rgb(235, 232, 232);
            /* display: flex;
            align-items: center;
            justify-content: center; */
            }
            
            .sigBox img {
              height: 100% !important;
              width: 100% !important;
            }
            
            .m0{
              margin: 0;
            }
            
            .para {
              margin: 0;
              font-family: "Roboto","Helvetica","Arial",sans-serif;
              font-weight: 400;
              font-size: 0.875rem;
              line-height: 1.43;
              letter-spacing: 0.01071em;
              font-size: .83rem;
              margin-top: 1rem;
              margin-bottom: 1rem;
            }
            
            .twoColContainer{
              display: flex;
            }
            
            .twoColChild {
              flex-grow: 1;
            }
            
            .twoColHead {
              font-size: .8rem;
              margin-bottom: 0;
            }
            
            .twoColName {
              font-weight: 900;
              font-size: 1rem;
              line-height: 1.2;
              margin: 0;
            }
            
            .twoColAddress {
              margin: 0;
              font-size: .8rem;
            }
            
            .twoColRight {
              margin: 0;
              font-family: "Roboto","Helvetica","Arial",sans-serif;
              font-weight: 400;
              font-size: 1rem;
              line-height: 1.5;
              letter-spacing: 0.00938em;
            }
            
            .headAddress {
              margin: 0;
              font-family: "Roboto","Helvetica","Arial",sans-serif;
              font-weight: 500;
              letter-spacing: 0.0075em;
              font-size: .8rem;
              line-height: 1.2;
            }
            
            .headAddressBold {
              font-weight: 700;
              margin: 0;
              font-family: "Roboto","Helvetica","Arial",sans-serif;
              letter-spacing: 0.0075em;
              font-size: .8rem;
              line-height: 1.2;
            }
            
            .halfWidth{
              width: 100%;
            }
            @media print {
            
              thead {
                display: none;
              }
            }
         </style>
       </head>
       <body>
         <div class="halfWidth">
          <img src='https://i.ibb.co/4PXRWf5/logo.png'/>
          <p class="headAddressBold">Travel Marketplace Pty Limited t/as TRAVELA</p>
          <p class="headAddress">12 Dimboola Road Broadmeadows VIC 3047</p>
          <p class="headAddress">(03) 70200700</p>
          <p class="headAddress">ABN 11636954768</p>
         </div>
         ${dynamicContent}
         ${tableContent}
         <div style="margin:0 auto;display:flex;flex-direction:column;justify-content:center;align-items:center;margin-top:15px;">
          <div className="sigBoxContainer">
              <label className="check">
                <input type="checkbox" checked/>I agree with this quote
              </label>
              <div className="sigBoxCanvas">
                <div>
                  <p className="m0">Signature:</p>
                  <div className="sigBox">
                  <img src='${signature}'/>
                  </div>
                </div>
              </div>
          </div>
         </div>
       </body>
      </html>`;

    await page.setContent(html);

    //To reflect CSS used for screens instead of print
    await page.emulateMediaType("screen");

    // Downlaod the PDF
    const pdf = await page.pdf({
      // path: "./shawon.pdf",
      margin: {
        bottom: 10, // minimum required for footer msg to display
        left: 10,
        right: 10,
        top: 10,
      },
      printBackground: true,
      format: "A4",
      displayHeaderFooter: true,
      preferCSSPageSize: true,
    });

    console.log({ pdf: pdf });
    // Close the browser instance
    await browser.close();
    res.contentType("application/pdf");
    res.send(pdf);
  } catch (err) {
    console.log({ err });
    res.json({ ok: false, result: JSON.stringify(err) });
  }
});
app.listen(process.env.PORT || 9000);
