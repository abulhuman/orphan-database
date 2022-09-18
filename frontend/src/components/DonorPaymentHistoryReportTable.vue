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
    donorPHRInput: {
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
