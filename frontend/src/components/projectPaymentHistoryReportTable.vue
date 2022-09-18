<template>
  <v-card>
    <v-card-title class="justify-center" primary-title>
      Project #{{ phrProjectInfo.number }} Payment History Report
    </v-card-title>
    <v-card-text>
      <!-- Report Info -->
      <v-banner>
        <v-row class="mb-n6">
          <!-- Donor label -->
          <v-col cols="1" class="d-flex justify-end pt-4">
            <span class="text-h6 mr-n1">Donors:</span>
          </v-col>
          <!-- Donor avatars field -->
          <v-col cols="2" class="d-flex justify-center pb-0">
            <template v-for="(donor, idx) in phrProjectInfo.donors">
              <v-tooltip :key="idx" top>
                <template v-slot:activator="{ on, attrs }">
                  <v-avatar
                    class="ml-n3 project-avatar"
                    color="grey"
                    size="38"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <span class="white--text">{{ donor.nameInitials }}</span>
                  </v-avatar>
                </template>
                <span>{{ donor.companyName }}</span>
              </v-tooltip>
            </template>
          </v-col>
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
                <v-btn color="primary" v-bind="attrs" v-on="on">
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

      <!-- ProjectPHR table -->
      <v-sheet class="overflow-y-auto overflow-x-hidden" max-height="50vh">
        <v-data-table
          :headers="phrHeaders"
          :items="phrRows"
          item-key="id"
          multi-sort
          group-by="supportPlanName"
          show-group-by
        >
          <!-- Customize Payment Date column -->
          <template #item.paymentStartDate="{ item }">
            {{ formatDate(item.paymentStartDate) }}
          </template>

          <!-- Customize Admin Fee (%) column -->
          <template #item.adminFeePercentage="{ item }">
            {{ `${item.adminFeePercentage}%` }}
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
    projectPHRInput: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      phrHeaders: [
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
      phrProjectInfo: {
        number: '',
        donors: []
      }
    };
  },

  computed: {
    startDate() {
      return this.formatDate(this.projectPHRInput.startDate);
    },
    endDate() {
      return this.formatDate(this.projectPHRInput.endDate);
    }
  },

  mounted() {
    this.initialize();
  },

  methods: {
    async initialize() {
      const { projectId, startDate, endDate } = this.projectPHRInput;
      const pphr = await this.fetchProjectPaymentHistoryReport(
        projectId,
        startDate,
        endDate
      );
      console.log('pphr', pphr);

      this.phrProjectInfo.number = pphr.project.number;
      this.phrProjectInfo.donors = pphr.supportPlans
        .map((supportPlan) => supportPlan.donor)
        .reduce((donors, donor) => {
          if (!donors.some((val) => val.id === donor.id)) {
            donors.push(donor);
          }
          return donors;
        }, []);

      this.phrRows = pphr.supportPlans.reduce((prev, supportPlan) => {
        for (const payment of supportPlan.payments) {
          prev.push({
            supportPlanName: supportPlan.name,
            adminFeePercentage: supportPlan.adminFeePercentage,
            totalFund: supportPlan.totalFund,
            paymentStartDate: supportPlan.startDate,
            paymentEndDate: supportPlan.endDate,
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

    formatDate(isoDate) {
      return new Date(isoDate).toDateString();
    },

    async fetchProjectPaymentHistoryReport(projectId, startDate, endDate) {
      const generatedPPHR = await axios.post('/graphql', {
        query: `query PPHR($projectId: ID!, $startDate: DateTime, $endDate: DateTime) {
                  generateProjectPaymentHistoryReport(
                    input: { projectId: $projectId, startDate: $startDate, endDate: $endDate }
                  ) {
                    project {
                      number
                      startDate
                      endDate
                    }
                    supportPlans {
                      id
                      name
                      adminFeePercentage
                      paymentInterval
                      totalFund
                      startDate
                      endDate
                      donor {
                        id
                        nameInitials
                        companyName
                      }
                      payments {
                        id
                        startDate
                        endDate
                        paymentInPrimaryForeignCurrency
                        primaryForeignCurrency
                        paymentInSecondaryForeignCurrency
                        secondaryForeignCurrency
                        grossPaymentInDomesticCurrency
                        adminFeeInDomesticCurrency
                        netPaymentInDomesticCurrency
                        paymentPeriodInMonths
                      }
                    }
                  }
                }`,
        variables: {
          projectId,
          startDate,
          endDate
        }
      });

      return generatedPPHR.data.data.generateProjectPaymentHistoryReport;
    }
  }
};
</script>

<style scoped>
.project-avatar:hover {
  z-index: 10;
  outline: medium solid white;
}
</style>
