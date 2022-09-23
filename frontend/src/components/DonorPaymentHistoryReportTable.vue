<template>
  <v-card>
    <v-card-title class="justify-center" primary-title>
      Donor&nbsp;
      <span class="primary--text">{{ phrDonorInfo.companyName }}</span>
      &nbsp;Payment History Report
    </v-card-title>
    <v-card-text>
      <!-- Report Info -->
      <v-banner>
        <v-row class="mb-n6 d-flex justify-center">
          <!-- Start date field -->
          <v-col cols="3" class="pb-0">
            <v-text-field
              v-model="startDate"
              filled
              rounded
              readonly
              dense
              append-icon="mdi-calendar-start"
            ></v-text-field>
          </v-col>
          <!-- Arrow icon -->
          <v-col cols="1" class="d-flex justify-center pt-0">
            <v-icon color="primary" size="30">mdi-arrow-right-thick</v-icon>
          </v-col>
          <!-- End date field -->
          <v-col cols="3" class="pb-0">
            <v-text-field
              v-model="endDate"
              filled
              rounded
              readonly
              dense
              append-icon="mdi-calendar-end"
            ></v-text-field>
          </v-col>
          <!-- Download button -->
          <v-col cols="2" class="d-flex justify-center ml-n1 pt-3">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  v-bind="attrs"
                  v-on="on"
                  @click="downloadDonorPaymentHistoryReport"
                >
                  Download
                  <v-icon>
                    mdi-download-outline
                    <!-- mdi-export -->
                  </v-icon>
                </v-btn>
              </template>
              <span>Export Report to Excel</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-banner>

      <!-- DonorPHR table -->
      <v-sheet class="overflow-y-auto overflow-x-hidden" max-height="50vh">
        <v-data-table
          :headers="phrHeaders"
          :items="phrRows"
          item-key="id"
          multi-sort
          group-by="supportPlanName"
          show-group-by
        >
        </v-data-table>
      </v-sheet>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from 'axios';
import XLSX from 'xlsx';
import XLSXStyle from 'cptable-fixed-xlsx-style';
// import XLSXStyle from 'xlsx-style';
import { saveAs } from 'file-saver';

export default {
  props: {
    donorPHRInput: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      phrHeaders: [
        {
          text: 'S/N',
          value: 'id',
          align: 'start'
        },
        {
          text: 'Payment Date',
          value: 'paymentStartDate',
          align: 'start',
          width: '15%'
        },
        {
          text: 'Admin Fee (%)',
          value: 'adminFeePercentage',
          align: 'end',
          groupable: false
        },
        {
          text: 'Support Plan',
          value: 'supportPlanName',
          align: 'end'
        },
        {
          text: 'Payment in Primary Foreign Currency',
          value: 'paymentInPFC',
          align: 'end',
          width: '13%',
          groupable: false
        },
        {
          text: 'Payment in Secondary Foreign Currency',
          value: 'paymentInSFC',
          align: 'end',
          width: '13%',
          groupable: false
        },
        {
          text: 'Gross (ETB)',
          value: 'grossPaymentInDC',
          align: 'end',
          groupable: false
        },
        {
          text: 'Admin Fee (ETB)',
          value: 'adminFeeInDC',
          align: 'end',
          groupable: false
        },
        {
          text: 'Net (ETB)',
          value: 'netPaymentInDC',
          align: 'end',
          groupable: false
        }
      ],
      phrRows: [],
      phrDonorInfo: {
        companyName: ''
      }
    };
  },

  computed: {
    startDate() {
      return this.formatDate(this.donorPHRInput.startDate);
    },
    endDate() {
      return this.formatDate(this.donorPHRInput.endDate);
    }
  },

  mounted() {
    this.initialize();
  },

  methods: {
    async initialize() {
      const { donorId, startDate, endDate } = this.donorPHRInput;
      const dphr = await this.fetchDonorPaymentHistoryReport(
        donorId,
        startDate,
        endDate
      );
      console.log('dphr', dphr);

      this.phrDonorInfo.companyName = dphr.donor.companyName;

      this.phrRows = dphr.supportPlans.reduce((prev, supportPlan) => {
        for (const payment of supportPlan.payments) {
          prev.push({
            id: payment.id,
            supportPlanName: supportPlan.name,
            adminFeePercentage: `${supportPlan.adminFeePercentage}%`,
            totalFund: supportPlan.totalFund,
            paymentStartDate: this.formatDate(supportPlan.startDate),
            paymentEndDate: this.formatDate(supportPlan.endDate),
            paymentInPFC: payment.paymentInPrimaryForeignCurrency || 'N/A',
            paymentInSFC: payment.secondaryForeignCurrency || 'N/A',
            grossPaymentInDC: payment.grossPaymentInDomesticCurrency || 'N/A',
            adminFeeInDC: payment.adminFeeInDomesticCurrency || 'N/A',
            netPaymentInDC: payment.netPaymentInDomesticCurrency || 'N/A',
            paymentPeriodInMonths: payment.paymentPeriodInMonths
          });
        }
        return prev;
      }, []);

      console.log(this.phrRows);
    },

    downloadDonorPaymentHistoryReport() {
      console.log(this.phrRows);

      let jsonExportData = [
        [
          'Charity and Development Association (CDA)',
          null,
          null,
          null,
          null,
          null,
          null,
          null
        ],
        [
          `Payment History Report For Donor ${this.phrDonorInfo.companyName}`,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        ],
        [
          `Payment Period From ${this.startDate} - ${this.endDate}`,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        ]
      ];

      jsonExportData.push(this.phrHeaders.map((header) => header.text));

      const categories = {};

      const exportTableData = this.phrRows.map((row, idx) => {
        let modifiedRows = [];

        if (!categories[row.supportPlanName])
          categories[row.supportPlanName] = [];

        categories[row.supportPlanName].push(idx);

        for (const key in this.phrHeaders) {
          if (Object.hasOwnProperty.call(row, this.phrHeaders[key].value))
            modifiedRows.push(row[this.phrHeaders[key].value]);
        }

        return modifiedRows;
      });

      let exportTableDataWithCategory = [],
        categoryCounter = 0,
        decimalCounter = 0;

      const categoryKeys = Object.keys(categories);
      let categoryIdxs = [];

      categoryKeys.forEach((key) => {
        categoryCounter++;
        exportTableDataWithCategory.push([`${categoryCounter}`, key]);
        categoryIdxs.push(exportTableDataWithCategory.length - 1);

        decimalCounter = 0;
        categories[key].forEach((rowIdx) => {
          decimalCounter++;
          exportTableDataWithCategory.push(exportTableData[rowIdx]);
          exportTableDataWithCategory[
            exportTableDataWithCategory.length - 1
          ][0] = `${categoryCounter}.${decimalCounter}`;
        });
      });

      // jsonExportData.push(...exportTableData);
      jsonExportData.push(...exportTableDataWithCategory);

      console.log(exportTableDataWithCategory);

      const workBook = XLSX.utils.book_new();
      const workSheet = XLSX.utils.aoa_to_sheet(jsonExportData);

      // handle merges
      workSheet['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 8 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: 8 } }
      ];

      // sets the width of colns
      workSheet['!cols'] = [
        { wpx: 40 }, // A
        { wpx: 80 }, // B
        { wpx: 80 }, // C
        { wpx: 80 }, // D
        { wpx: 80 }, // E
        { wpx: 80 }, // F
        { wpx: 80 }, // G
        { wpx: 80 }, // H
        { wpx: 80 } // I
      ];

      // sets the first 3 rows bold and centered
      for (let i = 1; i <= 3; i++) {
        workSheet[`A${i}`].s = {
          font: {
            bold: true
          },
          alignment: {
            horizontal: 'center',
            vertical: 'center'
          }
        };
      }

      // sets border and align to right to the table
      for (const key in workSheet) {
        const flag = key.localeCompare('A4', undefined, { numeric: true });

        if (flag < 0) continue;

        workSheet[key].s = {
          alignment: {
            horizontal: 'right'
          },
          border: {
            top: {
              style: 'thin',
              color: '000000'
            },
            bottom: {
              style: 'thin',
              color: '000000'
            },
            left: {
              style: 'thin',
              color: '000000'
            },
            right: {
              style: 'thin',
              color: '000000'
            }
          }
        };

        // for categories
        for (const idx of categoryIdxs) {
          if (key === `A${idx + 5}` || key === `B${idx + 5}`) {
            workSheet[key].s = {
              font: {
                bold: true
              },
              alignment: {
                horizontal: 'center',
                wrapText: false
              }
            };
          }
        }
      }

      // sets the 4th row (headers of the table) to bold and text-wrap
      for (let i = 0; i <= 25; i++) {
        const char = String.fromCharCode(65 + i);

        if (workSheet[`${char}4`] !== undefined) {
          workSheet[`${char}4`].s = {
            font: {
              bold: true
            },
            alignment: {
              horizontal: 'center',
              vertical: 'center',
              wrapText: true
            },
            border: {
              top: {
                style: 'thin',
                color: '000000'
              },
              bottom: {
                style: 'thin',
                color: '000000'
              },
              left: {
                style: 'thin',
                color: '000000'
              },
              right: {
                style: 'thin',
                color: '000000'
              }
            }
          };
        }
      }

      // creates an output buffer
      function s2ab(s) {
        if (typeof ArrayBuffer !== 'undefined') {
          const buf = new ArrayBuffer(s.length);
          const view = new Uint8Array(buf);
          for (let i = 0; i !== s.length; ++i) {
            view[i] = s.charCodeAt(i) & 0xff;
          }
          return buf;
        } else {
          const buf = new Array(s.length);
          for (let i = 0; i !== s.length; ++i) {
            buf[i] = s.charCodeAt(i) & 0xff;
          }
          return buf;
        }
      }

      XLSX.utils.book_append_sheet(
        workBook,
        workSheet,
        'Donor Payment History Report'
      );

      // XLSX.writeFile(workBook, "orphanTest.xlsx");
      const wbOut = XLSXStyle.write(workBook, {
        bookSST: false,
        type: 'binary'
      });

      saveAs(
        new Blob([s2ab(wbOut)], { type: '' }),
        'DonorPaymentHistoryReport.xlsx'
      );
    },

    formatDate(isoDate) {
      const dateStringArray = new Date(isoDate).toDateString().split(' ');
      dateStringArray.shift();
      return dateStringArray.join(' ');
    },

    async fetchDonorPaymentHistoryReport(donorId, startDate, endDate) {
      const generatedDPHR = await axios.post('/graphql', {
        query: `query DPHR($donorId: ID!, $startDate: DateTime, $endDate: DateTime) {
                  generateDonorPaymentHistoryReport(
                    input: { donorId: $donorId, startDate: $startDate, endDate: $endDate }
                  ) {
                    donor {
                      id
                      companyName
                    }
                    supportPlans {
                      id
                      name
                      adminFeePercentage
                      totalFund
                      startDate
                      endDate
                      payments {
                        id
                        startDate
                        endDate
                        paymentInPrimaryForeignCurrency
                        primaryForeignCurrency
                        primaryExchangeRate
                        paymentInSecondaryForeignCurrency
                        secondaryForeignCurrency
                        secondaryExchangeRate
                        grossPaymentInDomesticCurrency
                        adminFeeInDomesticCurrency
                        netPaymentInDomesticCurrency
                        paymentPeriodInMonths
                      }
                    }
                  }
                }`,
        variables: {
          donorId,
          startDate,
          endDate
        }
      });

      return generatedDPHR.data.data.generateDonorPaymentHistoryReport;
    }
  }
};
</script>

<style scoped></style>
