<template>
  <v-card>
    <v-card-title primary-title class="justify-center">
      Orphan Payment History Report
    </v-card-title>
    <v-card-text>
      <!-- Report Info -->
      <v-banner>
        <v-row class="mb-n6">
          <!-- Start date field -->
          <v-col cols="5" class="pb-0">
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
          <v-col cols="5" class="pb-0">
            <v-text-field
              v-model="endDate"
              filled
              rounded
              readonly
              dense
              append-icon="mdi-calendar-end"
            ></v-text-field>
          </v-col>
          <!-- Download icon -->
          <v-col cols="1" class="d-flex justify-center mt-n2 ml-n1 pt-0">
            <v-tooltip top nudge-bottom="20">
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  color="primary"
                  size="38"
                  dark
                  v-bind="attrs"
                  v-on="on"
                  @click="downloadOrphanPaymentHistoryReport"
                >
                  mdi-download-circle
                  <!-- mdi-export -->
                </v-icon>
              </template>
              <span>Export Report to Excel</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-banner>

      <!-- Orphan Info -->
      <v-row class="mt-4">
        <!-- Orphan Code field -->
        <v-col cols="6" class="py-0">
          <v-text-field
            v-model="phrOrphanInfo.orphanCode"
            label="Orphan Code"
            outlined
            rounded
            readonly
            dense
          ></v-text-field>
        </v-col>
        <!-- Orphan Name field -->
        <v-col cols="6" class="py-0">
          <v-text-field
            v-model="phrOrphanInfo.orphanName"
            label="Orphan Name"
            outlined
            rounded
            readonly
            dense
          ></v-text-field>
        </v-col>
        <!-- Guardian Name field -->
        <v-col cols="6" class="py-0">
          <v-text-field
            v-model="phrOrphanInfo.guardianName"
            label="Guardian Name"
            outlined
            rounded
            readonly
            dense
          ></v-text-field>
        </v-col>
        <!-- Guardian Number field -->
        <v-col cols="6" class="py-0">
          <v-text-field
            v-model="phrOrphanInfo.guardianNumber"
            label="Guardian Number"
            outlined
            rounded
            readonly
            dense
          ></v-text-field>
        </v-col>
      </v-row>

      <!-- OrphanPHR table -->
      <v-sheet class="overflow-y-auto overflow-x-hidden" max-height="50vh">
        <v-data-table
          :headers="phrHeaders"
          :items="phrRows"
          item-key="id"
          multi-sort
        >
          <!-- Customize Payment date column -->
          <template #item.transactionDate="{ item }">
            {{ formatDate(item.transactionDate) }}
          </template>

          <!-- Customize table footer -->
          <template #body.append>
            <tr class="grey lighten-2 font-weight-bold text-uppercase">
              <td>total</td>
              <td class="text-end">
                {{ totalPayment }}
              </td>
              <!-- <td colspan="4"></td> -->
            </tr>
          </template>
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
    orphanPHRInput: {
      type: Object,
      required: true
      // default() {
      //   return {
      //     orphanId: '1',
      //     startDate: '2022-01-30T21:00:00.000Z',
      //     endDate: '2022-05-31T21:00:00.000Z'
      //   };
      // }
    }
  },
  data() {
    return {
      phrHeaders: [
        { text: 'Payment Date', value: 'transactionDate', align: 'start' },
        { text: 'Payment Amount(ETB)', value: 'amount', align: 'end' }
      ],
      phrRows: [],
      phrOrphanInfo: {
        orphanCode: '',
        orphanName: '',
        guardianName: '',
        guardianNumber: ''
      },
      totalPayment: 0
    };
  },

  computed: {
    startDate() {
      return this.formatDate(this.orphanPHRInput.startDate);
    },
    endDate() {
      return this.formatDate(this.orphanPHRInput.endDate);
    }
  },

  mounted() {
    this.initialize();
  },

  methods: {
    async initialize() {
      const { orphanId, startDate, endDate } = this.orphanPHRInput;
      const ophr = await this.fetchOrphanPaymentHistoryReport(
        orphanId,
        startDate,
        endDate
      );

      this.phrOrphanInfo.orphanCode = ophr.orphan.orphanCode;
      this.phrOrphanInfo.orphanName = this.orphanFullName(ophr.orphan);
      this.phrOrphanInfo.guardianName = this.guardianFullName(
        ophr.orphan.guardian
      );
      this.phrOrphanInfo.guardianNumber = ophr.orphan.guardian.mobileNumber;

      this.phrRows = ophr.financialRecords;

      this.totalPayment = this.phrRows.reduce(
        (acc, cur) => (acc += cur.amount),
        0
      );

      // console.log(this.phrRows);
    },

    downloadOrphanPaymentHistoryReport() {
      const {
        orphanCode,
        orphanName,
        guardianName,
        guardianNumber
      } = this.phrOrphanInfo;

      let jsonExportData = [
        ['Charity and Development Association (CDA)', null, null, null],
        [
          `Orphan Payment History Report from ${this.startDate} to ${this.endDate}`,
          null,
          null,
          null
        ],
        [
          `Code: ${orphanCode}`,
          `Name: ${orphanName}`,
          `Guardian: ${guardianName}`,
          `Guardian Mobile: ${guardianNumber}`
        ]
      ];

      jsonExportData.push(this.phrHeaders.map((header) => header.text));

      const exportTableDate = this.phrRows.map((row) => {
        let modifiedRow = [];

        modifiedRow[0] = this.formatDate(row.transactionDate);
        modifiedRow[1] = row.amount;

        return modifiedRow;
      });

      jsonExportData.push(...exportTableDate);
      jsonExportData.push(['Total', this.totalPayment]);

      const workBook = XLSX.utils.book_new();
      const workSheet = XLSX.utils.aoa_to_sheet(jsonExportData);

      // handle merges
      workSheet['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } }
      ];

      // sets the width of colns
      workSheet['!cols'] = [
        { wpx: 150 }, // A
        { wpx: 200 }, // B
        { wpx: 220 }, // C
        { wpx: 200 } // D
      ];

      // sets the first 2 rows bold and centered
      for (let i = 1; i <= 2; i++) {
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

      // sets the 3rd row elments to bold
      for (let i = 0; i <= 3; i++) {
        const char = String.fromCharCode(65 + i);
        workSheet[`${char}3`].s = {
          font: {
            bold: true
          },
          alignment: {
            horizontal: 'right'
          }
        };
      }

      // sets border to the table
      for (const key in workSheet) {
        const flag = key.localeCompare('A4', undefined, { numeric: true });

        if (flag < 0 || key === 'B3' || key === 'C3' || key === 'D3') continue;

        workSheet[key].s = {
          alignment: {
            horizontal: 'left',
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

      // sets the 2nd col of the table to align right
      for (const key in workSheet) {
        const flag = key.localeCompare('B4', undefined, { numeric: true });

        if (flag < 0 || !key.includes('B')) continue;

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
      }

      // sets the 4th row to bold
      for (let i = 0; i <= 1; i++) {
        const char = String.fromCharCode(65 + i);

        if (workSheet[`${char}4`] !== undefined) {
          workSheet[`${char}4`].s = {
            font: {
              bold: true
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

        // sets the 4th row 2nd col to align right
        if (workSheet[`${char}4`] !== undefined) {
          workSheet[`B4`].s = {
            font: {
              bold: true
            },
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
        }
      }

      // sets the last row to bold
      for (let i = 0; i <= 1; i++) {
        const char = String.fromCharCode(65 + i);

        if (workSheet[`${char}${jsonExportData.length}`] !== undefined) {
          workSheet[`${char}${jsonExportData.length}`].s = {
            font: {
              bold: true
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
        'Orphan Payment History Report'
      );

      // XLSX.writeFile(workBook, "orphanTest.xlsx");
      const wbOut = XLSXStyle.write(workBook, {
        bookSST: false,
        type: 'binary'
      });

      saveAs(
        new Blob([s2ab(wbOut)], { type: '' }),
        'OrphanPaymentHistoryReport.xlsx'
      );
    },

    orphanFullName(orphan) {
      return (
        `${orphan.firstName
          .substr(0, 1)
          .toUpperCase()}${orphan.firstName.substr(1)}` +
        ` ${orphan.father.firstName
          .substr(0, 1)
          .toUpperCase()}${orphan.father.firstName.substr(1)}` +
        ` ${orphan.father.lastName
          .substr(0, 1)
          .toUpperCase()}${orphan.father.lastName.substr(1)}`
      );
    },

    guardianFullName(guardian) {
      return (
        `${guardian.firstName
          .substr(0, 1)
          .toUpperCase()}${guardian.firstName.substr(1)}` +
        ` ${guardian.middleName
          .substr(0, 1)
          .toUpperCase()}${guardian.middleName.substr(1)}` +
        ` ${guardian.lastName
          .substr(0, 1)
          .toUpperCase()}${guardian.lastName.substr(1)}`
      );
    },

    formatDate(isoDate) {
      const dateStringArray = new Date(isoDate).toDateString().split(' ');
      dateStringArray.shift();
      return dateStringArray.join(' ');
    },

    async fetchOrphanPaymentHistoryReport(orphanId, startDate, endDate) {
      const generatedOPHR = await axios.post('/graphql', {
        query: `query OPHR($orphanId: ID!, $startDate: DateTime, $endDate: DateTime) {
                  generateOrphanPaymentHistoryReport(
                    input: { orphanId: $orphanId, startDate: $startDate, endDate: $endDate }
                  ) {
                    orphan {
                      orphanCode
                      firstName
                      father {
                        firstName
                        lastName
                      }
                      dateOfBirth
                      guardian {
                        firstName
                        middleName
                        lastName
                        mobileNumber
                      }
                    }
                    financialRecords {
                      id
                      amount
                      transactionDate
                    }
                  }
                }`,
        variables: {
          orphanId,
          startDate,
          endDate
        }
      });

      return generatedOPHR.data.data.generateOrphanPaymentHistoryReport;
    }
  }
};
</script>

<style lang="scss" scoped></style>
