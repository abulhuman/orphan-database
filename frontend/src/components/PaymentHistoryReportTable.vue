<template>
  <div>
    <orphan-payment-history-report-table
      v-if="phrInput.reportType === 'orphanPHR'"
      :orphanPHRInput="phrInput"
    />
    <project-payment-history-report-table
      v-if="phrInput.reportType === 'projectPHR'"
      :projectPHRInput="phrInput"
    />
    <donor-payment-history-report-table
      v-if="phrInput.reportType === 'donorPHR'"
      :donorPHRInput="phrInput"
    />
  </div>
</template>

<script>
import DonorPaymentHistoryReportTable from './DonorPaymentHistoryReportTable.vue';
import OrphanPaymentHistoryReportTable from './OrphanPaymentHistoryReportTable.vue';
import ProjectPaymentHistoryReportTable from './projectPaymentHistoryReportTable.vue';

export default {
  components: {
    OrphanPaymentHistoryReportTable,
    ProjectPaymentHistoryReportTable,
    DonorPaymentHistoryReportTable
  },

  props: {
    phrInput: {
      type: Object,
      required: true
    }
  },

  data() {
    return {};
  },

  created() {},

  methods: {}
};
</script>

<style scoped></style>
