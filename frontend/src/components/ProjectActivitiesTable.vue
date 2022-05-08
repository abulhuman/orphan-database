<template>
  <v-card style="margin: auto;">
    <v-card-title>
      Project Activities
      <v-spacer></v-spacer>
      <v-btn icon class="mr-3" @click="initialize"
        ><v-icon>mdi-refresh</v-icon></v-btn
      >
      <!-- <v-btn v-if="downloadButton" class="mr-3" small :disabled="downloadButton"> -->
      <v-btn
        v-if="downloadButton"
        class="mr-3"
        small
        @click="downloadActivityReport"
      >
        <v-icon dense class="mr-2">mdi-download</v-icon>Download</v-btn
      >
      <v-dialog
        v-model="showReport.dialog"
        max-width="350px"
        transition="dialog-transition"
      >
        <template #activator="{on,attrs}">
          <v-btn v-on="on" v-bind="attrs" class="primary" small
            >Show Report</v-btn
          >
        </template>
        <v-card>
          <v-card-title primary-title>
            Project Activity Progress Report
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-form class="mx-3" lazy-validation ref="showReportForm">
              <v-row v-if="showReport.validDateRangeInfo"
                ><v-col class="mt-3 ml-6"
                  ><p color="error" class="mb-n5 error--text">
                    {{ showReport.validDateRangeInfo }}
                  </p></v-col
                ></v-row
              >
              <v-row>
                <v-col>
                  <v-menu
                    ref="fromDateMenu"
                    v-model="fromDateMenu"
                    :close-on-content-click="false"
                    :return-value.sync="fromDate"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="fromDate"
                        label="From Date"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="fromDate"
                      label="Date"
                      no-title
                      scrollable
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="fromDateMenu = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.fromDateMenu.save(fromDate)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  ><v-menu
                    ref="endDateMenu"
                    v-model="endDateMenu"
                    :close-on-content-click="false"
                    :return-value.sync="toDate"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="toDate"
                        label="To Date"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="toDate" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="endDateMenu = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.endDateMenu.save(toDate)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu></v-col
                >
              </v-row>
              <v-row>
                <v-col>
                  <v-select
                    label="Report Interval"
                    v-model="showReport.interval"
                    :items="[
                      { text: 'Monthly', value: 'm' },
                      { text: 'Quarterly', value: 'q' },
                      { text: 'Yearly', value: 'y' }
                    ]"
                    :rules="[rules.required, rules.wip]"
                  ></v-select>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer />
            <v-btn
              @click="showReport.dialog = !showReport.dialog"
              class="secondary lighten-2"
              >Cancel</v-btn
            >
            <v-btn @click="reportParamsNext()" class="primary">Next</v-btn>
          </v-card-actions>
        </v-card> </v-dialog
      ><v-btn
        icon
        dark
        small
        class="ml-3"
        color="error"
        @click="$emit('closeProjectActivitiesTable')"
        ><v-icon>mdi-close</v-icon></v-btn
      >
    </v-card-title>
    <v-divider></v-divider>
    <v-data-table
      :headers="headers"
      :items="activities"
      hide-default-footer
      class="elevation-0 align-self-center"
      item-key="id"
      loading="true"
      dense
      group-by="Category"
    >
    </v-data-table>
  </v-card>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import XLSX from 'xlsx';
import XLSXStyle from 'cptable-fixed-xlsx-style';
import { saveAs } from 'file-saver';
export default {
  props: ['projectId'],
  data() {
    return {
      item: null,
      downloadButton: true,
      activities: [],
      headers: [
        {
          text: 'S/N',
          value: 'id'
        },
        {
          text: 'Activity',
          value: 'title'
        },
        {
          text: 'Unit',
          value: 'unitOfMeasurement'
        },
        // {
        //   text: 'Annual Plan',
        //   value: 'planOfAYear'
        // },
        {
          text: 'Plan of 6 months',
          value: 'planOfSixMonths'
        },
        // {
        //   text: 'Quarterly Plan',
        //   value: 'planOfAQuarter'
        // },
        {
          text: 'Monthly Plan',
          value: 'planOfAMonth'
        }
      ],
      fromDate: '2021-01-01T21:00:00.000Z', //null,
      fromDateMenu: false,
      toDate: '2021-01-31T21:00:00.000Z', //null,
      endDateMenu: false,
      showReport: {
        dialog: false,
        validDateRangeInfo: null,
        interval: null,
        reportDuration: null,
        reportDurationOptions: [
          'Total So Far',
          'This Year So Far',
          'Yearly',
          'Semi-annual',
          'Quarterly',
          'Monthly',
          'Daily',
          'Other'
        ],
        year: null,
        yearOptions: [],
        half: null,
        halfOptions: []
      },
      rules: {
        required: (v) => !!v || 'Required',
        wip: (v) => v === 'm' || 'Work In Progress',
        isNumeric: (v) => /[0-9]/.test(v) || 'Must numeric'
      }
    };
  },
  created() {
    this.initialize();
  },
  methods: {
    async initialize() {
      const query = `query getProjectActivitiesByProjectId($projectId: ID!) {
                        items: getProjectActivitiesByProjectId(projectId: $projectId) {
                            id
                            title
                            unitOfMeasurement
                            Category: category
                            planOfAYear
                            planOfSixMonths
                            planOfAQuarter
                            planOfAMonth
                            dailyActivities {
                                id
                                planOfADay
                                accomplishmentPercentage
                                accomplishmentAmount
                            }
                            project {
                                startDate
                                endDate
                                location {
                                    district {
                                    name
                                    zone {
                                      name
                                      region {
                                        name
                                      }
                                    }
                                    }
                                }
                            }
                            socialWorker {
                                districts {
                                    name
                                }
                            }
                        }
                    }`;
      const variables = { projectId: this.projectId };
      const res = await axios.post('/graphql', { query, variables });
      this.activities = res.data.data.items;
      this.headers = [
        {
          text: 'S/N',
          value: 'id'
        },
        {
          text: 'Activity',
          value: 'title'
        },
        {
          text: 'Unit',
          value: 'unitOfMeasurement'
        },
        // {
        //   text: 'Annual Plan',
        //   value: 'planOfAYear'
        // },
        {
          text: 'Plan of 6 months',
          value: 'planOfSixMonths'
        },
        // {
        //   text: 'Quarterly Plan',
        //   value: 'planOfAQuarter'
        // },
        {
          text: 'Monthly Plan',
          value: 'planOfAMonth'
        }
      ];
    },
    reportParamsNext() {
      this.headers = [
        {
          text: 'S/N',
          value: 'id'
        },
        {
          text: 'Activity',
          value: 'title'
        },
        {
          text: 'Unit',
          value: 'unitOfMeasurement'
        },
        {
          text: 'Plan of 6 months',
          value: 'planOfSixMonths'
        },
        {
          text: 'Monthly Plan',
          value: 'planOfAMonth'
        }
      ];
      if (new Date(this.fromDate) >= new Date(this.toDate)) {
        this.showReport.validDateRangeInfo = `The date range is equal or reversed. Please enter proper dates.`;
        return;
      }
      this.showReport.validDateRangeInfo = null;
      if (this.$refs.showReportForm.validate()) {
        const variables = {
          fromDate: this.fromDate,
          toDate: this.toDate
        };
        // this only works for dates that are within a year of eachother
        // so we can get a monthly report for each month in a single year at once
        if (this.showReport.interval === 'm') {
          let dateStart = moment(variables.fromDate);
          let dateEnd = moment(variables.toDate);
          let timeValues = [];

          while (
            dateEnd > dateStart ||
            dateStart.format('M') === dateEnd.format('M')
          ) {
            timeValues.push(dateStart.toISOString());
            dateStart.add(1, 'month');
          }
          timeValues = timeValues.map((v) => ({
            month: moment(v).format('MMMM'),
            date: v,
            activities: []
          }));

          this.activities.forEach(async (activity) => {
            variables['projectActivityId'] = activity.id;

            const query = `query getFilteredDailyActivities(
                            $projectActivityId: ID!
                            $fromDate: DateTime
                            $toDate: DateTime
                          ) {
                            items: getDailyActivitiesByProjectActivityId(
                              projectActivityId: $projectActivityId
                              fromDate: $fromDate
                              toDate: $toDate
                            ) {
                              id
                              created_at
                              planOfADay
                              accomplishmentAmount
                              accomplishmentPercentage
                            }
                          }`;

            const res = await axios.post('/graphql', { query, variables });

            const { items } = res.data.data;

            timeValues.forEach((tv) => {
              items.forEach((item) => {
                if (moment(item.created_at).isSame(tv.date, 'month')) {
                  tv.activities.push(item);
                }
              });
            });

            timeValues.forEach((v) => {
              activity[`${v.month}_planned`] = 0;
              activity[`${v.month}_accomplishment`] = 0;
              activity[`${v.month}_percentage`] = 0;
              v.activities.forEach((item) => {
                activity[`${v.month}_planned`] += parseFloat(item.planOfADay);
                activity[`${v.month}_accomplishment`] += parseFloat(
                  item.accomplishmentAmount
                );
              });
              let tmp =
                activity[`${v.month}_accomplishment`] /
                activity[`${v.month}_planned`];
              tmp *= 100;
              activity[`${v.month}_percentage`] += parseFloat(tmp.toFixed(2));
            });
          });

          // timed to 4secs to ensure the operation happens
          // after the above is done synchronously
          setTimeout(() => {
            timeValues.forEach((tv) => {
              if (tv.activities.length > 0) {
                this.headers.push({
                  text: `${tv.month} Planned`,
                  value: `${tv.month}_planned`
                });
                this.headers.push({
                  text: `${tv.month} Accomplished`,
                  value: `${tv.month}_accomplishment`
                });
                this.headers.push({
                  text: `Performance %`,
                  value: `${tv.month}_percentage`
                });
              }
            });
          }, 4000);
        }

        this.$refs.showReportForm.reset();
        this.showReport.dialog = false;
        this.downloadButton = true;
      }
    },
    downloadActivityReport() {
      // console.log(this.activities);

      let districtName = this.activities[0].project.location[0].district.name,
        zoneName = this.activities[0].project.location[0].district.zone.name,
        regionName = this.activities[0].project.location[0].district.zone.region
          .name;

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
          `Montly work accomplishment Report Format`,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        ],
        [
          `Region: ${regionName}`,
          null,
          `Zone: ${zoneName}`,
          null,
          `District: ${districtName}`,
          null,
          null,
          null
        ]
      ];

      jsonExportData.push(this.headers.map((header) => header.text));

      let categories = {};

      let exportTableData = this.activities.map((activity, idx) => {
        let modifiedActivities = [];

        if (!categories[activity.Category]) categories[activity.Category] = [];

        categories[activity.Category].push(idx);

        for (const key in this.headers) {
          if (Object.hasOwnProperty.call(activity, this.headers[key].value))
            modifiedActivities.push(activity[this.headers[key].value]);
        }

        return modifiedActivities;
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

      const workBook = XLSX.utils.book_new();
      const workSheet = XLSX.utils.aoa_to_sheet(jsonExportData);

      // console.log('workSheet: ', workSheet);

      // handle merges
      workSheet['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 8 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: 1 } },
        { s: { r: 2, c: 2 }, e: { r: 2, c: 3 } },
        { s: { r: 2, c: 4 }, e: { r: 2, c: 5 } }
      ];

      // sets the width of colns
      workSheet['!cols'] = [
        { wpx: 40 }, // A
        { wpx: 320 }, // B
        { wpx: 80 }, // C
        { wpx: 80 }, // D
        { wpx: 80 }, // E
        { wpx: 80 }, // F
        { wpx: 80 }, // G
        { wpx: 80 }, // H
        { wpx: 80 } // I
      ];

      // // sets the height of rows
      // workSheet['!rows'] = [
      //   { hpx: 150 }, // 1
      //   { hpx: 150 }, // 2
      //   { hpx: 150 }, // 3
      //   { hpx: 150 }, // 4
      //   { hpx: 150 } // 5
      // ];

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

      // sets the 3th row elments to bold
      for (let i = 0; i <= 4; i += 2) {
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

        if (flag < 0 || key === 'C3' || key === 'E3') continue;

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

      // sets the 4th row to bold and text-wrap
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
        'Project Activities Sheet'
      );

      // XLSX.writeFile(workBook, "orphanTest.xlsx");
      const wbOut = XLSXStyle.write(workBook, {
        bookSST: false,
        type: 'binary'
      });

      saveAs(
        new Blob([s2ab(wbOut)], { type: '' }),
        'ProjectActivitiesReport.xlsx'
      );

      console.log('jsonExportData', jsonExportData);
    }
  }
};
</script>
