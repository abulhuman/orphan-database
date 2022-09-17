<template>
  <v-card>
    <v-card-title primary-title class="justify-center">
      Orphan Payment History Report
    </v-card-title>
    <v-card-text>
      <!-- Report Info -->
      <v-banner @click:icon="initialize">
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
            <v-icon>mdi-arrow-right-thick</v-icon>
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
                <v-icon color="primary" size="38" dark v-bind="attrs" v-on="on">
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
      <v-sheet class="overflow-y-auto overflow-x-hidden" max-height="50vh">
        <v-data-table
          :headers="phrHeaders"
          :items="phrRows"
          item-key="id"
          multi-sort
        >
          <!-- Customize table top -->
          <!-- <template #top>
            
          </template> -->
          <template #item.transactionDate="{ item }">
            {{ formatDate(item.transactionDate) }}
          </template>
        </v-data-table>
      </v-sheet>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from 'axios';
export default {
  props: {
    orphanPHRInput: {
      type: Object
      // required: true
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
      }
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
      return new Date(isoDate).toDateString();
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
