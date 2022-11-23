<template>
  <v-card elevation="0">
    <v-container class="ml-3">
      <v-row>
        <v-btn fab small elevation="0" @click="$emit('back')">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          class="primary mr-n16"
          :disabled="!orphans.length"
          @click="download"
          >Download</v-btn
        >
      </v-row>
    </v-container>
    <v-card-title v-if="title.reportType === 'status-report'">
      {{
        capitalize(
          orphans.length
            ? orphans[0].currentOrphanData.sponsorshipStatus.status
            : 'No Orphans with the selected criteria'
        )
      }}
      {{ orphans.length ? 'Orphans Report' : '' }}
    </v-card-title>
    <v-card-title v-else-if="title.reportType === 'education-report'">
      {{ orphans.length ? 'Orphans Educational Report' : '' }}
    </v-card-title>
    <v-card-text>
      {{ title.grouping }}: <strong>{{ description }}</strong>
    </v-card-text>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="items"
        item-key="id"
        v-model="orphanTable"
      >
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import { capitalize, zip } from 'lodash';
import XLSX from 'xlsx';
import XLSXstyle from 'cptable-fixed-xlsx-style';
import { saveAs } from 'file-saver';
export default {
  props: {
    orphans: {
      type: Array
    },
    title: {
      type: Object
    }
  },
  created() {
    // console.log(this.title)
    // console.log(this.description)
  },
  data() {
    return {
      orphanTable: []
    };
  },
  methods: {
    capitalize,
    download() {
      let reportRows = JSON.parse(JSON.stringify(this.orphans));
      reportRows = reportRows.map((v) => {
        let next = {};
        if (this.title.reportType === 'status-report') {
          next = Object.assign(
            {},
            {
              code: v.orphanCode ?? 'N/A',
              name: `${v.firstName} ${v.father.firstName} ${v.father.lastName}`,
              gender: v.gender,
              guardianName: `${v.guardian.firstName} ${v.guardian.middleName} ${v.guardian.lastName}`,
              guardianMobile: v.guardian.mobileNumber
            }
          );
        } else if (this.title.reportType === 'education-report') {
          next = Object.assign(
            {},
            {
              code: v.orphanCode ?? 'N/A',
              name: `${v.firstName} ${v.father.firstName} ${v.father.lastName}`,
              gender: v.gender,
              age:
                new Date().getUTCFullYear() -
                new Date(Date.parse(v.dateOfBirth.toString())).getUTCFullYear(),
              gradeLevel: v.latestOrphanData.educationalRecord.level || 'N/A',
              grade: v.latestOrphanData.educationalRecord.year || 'N/A',
              enrollmentStatus:
                v.latestOrphanData.educationalRecord.enrollmentStatus,
              reason: v.latestOrphanData.educationalRecord.reason || 'N/A'
            }
          );
        }
        return next;
      });
      const reportBody = [['Charity Development Association (CDA)']];
      reportBody.push([
        this.title.reportType === 'status-report'
          ? `${capitalize(
              this.orphans[0].currentOrphanData.sponsorshipStatus.status
            )} Orphans Report`
          : 'Orphans Educational Report'
      ]);
      reportBody.push([`${this.title.grouping}: ${this.description}`]);
      reportBody.push(this.headers.map((v) => v.text));
      reportRows.forEach((v) => reportBody.push(Object.values(v)));
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(reportBody);
      ws['!merges'] =
        this.title.reportType === 'status-report'
          ? [
              { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
              { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } },
              { s: { r: 2, c: 0 }, e: { r: 2, c: 4 } }
            ]
          : [
              { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } },
              { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } },
              { s: { r: 2, c: 0 }, e: { r: 2, c: 7 } }
            ];
      function transpose(matrix) {
        return zip(...matrix);
      }
      const newArray = reportBody.slice(3);
      const widthArray = transpose(newArray).map((array) => {
        return array.reduce((a, b) => {
          return a.length > b.length ? a : b;
        }).length;
      });

      ws['!cols'] = widthArray.map((v) => ({ wch: v + 5 }));

      // Table formatting
      for (const key in ws) {
        const flag = key.localeCompare('A1');
        if (flag < 0) continue;
        ws[key].s = {
          alignment: { horizontal: 'left', vertical: 'bottom' },
          border: {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
        };
      }
      // Table columns formatting
      const rowIndex = this.title.reportType === 'status-report' ? 5 : 8;
      for (let index = 0; index < rowIndex; index++) {
        const headerChar = String.fromCharCode(65 + index);
        let formatting = {
          font: { bold: true },
          alignment: { horizontal: 'center', vertical: 'bottom' },
          border: {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
        };
        // Row #1 - #3 formatting
        for (let jIndex = 1; jIndex < 4; jIndex++) {
          const stv = {
            s: { ...ws[`${headerChar}${jIndex}`]?.s, ...formatting },
            t: 's',
            v: ws[`${headerChar}${jIndex}`]?.v ?? ''
          };
          ws[`${headerChar}${jIndex}`] = stv;
        }
        // Row #4 formatting
        for (let jIndex = 4; jIndex < 5; jIndex++) {
          formatting = {
            ...formatting,
            alignment: { ...formatting.alignment, horizontal: 'left' }
          };
          const stv = {
            s: { ...ws[`${headerChar}${jIndex}`]?.s, ...formatting },
            t: 's',
            v: ws[`${headerChar}${jIndex}`]?.v ?? ''
          };
          ws[`${headerChar}${jIndex}`] = stv;
        }
      }
      const sheetTitleSnippet =
        this.title.reportType === 'status-report' ? 'Status' : 'Education';
      XLSX.utils.book_append_sheet(
        wb,
        ws,
        `Orphans ${sheetTitleSnippet} Report`
      );
      const wbOut = XLSXstyle.write(wb, { bookType: 'xlsx', type: 'binary' });
      // create output buffer
      function stringToArrayBuffer(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
        return buf;
      }
      saveAs(
        new Blob([stringToArrayBuffer(wbOut)], {
          type: ''
        }),
        this.title.reportType === 'status-report'
          ? `${this.orphans[0].currentOrphanData.sponsorshipStatus.status.toUpperCase()}_Orphans Status Report_${this.title.grouping.toUpperCase()}_${this.description.toUpperCase()}_${new Date().toISOString()}.xlsx`
          : `Orphans Educational Report_${this.title.grouping.toUpperCase()}_${this.description.toUpperCase()}_${new Date().toISOString()}.xlsx`
      );
    }
  },
  computed: {
    description() {
      if (this.title.grouping === 'Donor') {
        const array = Array.from(this.title.beneficiaries);
        return array.find((v) => +v.value === +this.title.beneficiaryId).text;
      } else {
        return this.title.beneficiaryId;
      }
    },
    headers() {
      const headerItems = [
        { text: 'Code', value: 'orphanCode' },
        { text: 'Name', value: 'fullName' },
        { text: 'Gender', value: 'gender' }
      ];
      if (this.title.reportType === 'status-report') {
        headerItems.push(
          { text: 'Guardian Name', value: 'guardianName' },
          { text: 'Guardian Mobile', value: 'guardian.mobileNumber' }
        );
      } else if (this.title.reportType === 'education-report') {
        headerItems.push(
          { text: 'Age', value: 'age' },
          { text: 'Grade Level', value: 'gradeLevel' },
          { text: 'Grade', value: 'grade' },
          { text: 'Status', value: 'enrollmentStatus' },
          { text: 'Reason', value: 'reason' }
        );
      }
      return headerItems;
    },
    items() {
      if (this.title.reportType === 'status-report') {
        return this.orphans.map((o) => {
          return {
            ...o,
            orphanCode: o.orphanCode || 'N/A',
            guardianName: `${o.guardian.firstName} ${o.guardian.middleName} ${o.guardian.lastName}`,
            fullName: `${o.firstName} ${o.father.firstName} ${o.father.lastName}`
          };
        });
      } else if (this.title.reportType === 'education-report') {
        return this.orphans.map((o) => {
          return {
            ...o,
            orphanCode: o.orphanCode || 'N/A',
            fullName: `${o.firstName} ${o.father.firstName} ${o.father.lastName}`,
            age:
              new Date().getUTCFullYear() -
              new Date(Date.parse(o.dateOfBirth.toString())).getUTCFullYear(),
            gradeLevel: o.latestOrphanData.educationalRecord.level || 'N/A',
            grade: o.latestOrphanData.educationalRecord.year || 'N/A',
            enrollmentStatus:
              o.latestOrphanData.educationalRecord.enrollmentStatus,
            reason: o.latestOrphanData.educationalRecord.reason || 'N/A'
          };
        });
      } else return [];
    }
  }
};
</script>
