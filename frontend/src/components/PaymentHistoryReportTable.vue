<template>
  <div>
    <orphan-payment-history-report-table :orphanPHRInput="phrInput" />
  </div>
</template>

<script>
import OrphanPaymentHistoryReportTable from './OrphanPaymentHistoryReportTable.vue';

export default {
  components: {
    OrphanPaymentHistoryReportTable
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
