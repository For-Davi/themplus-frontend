<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import FormAccount from 'src/components/forms/FormAccount.vue';
import { useAccountStore } from 'src/stores/account-store';
import { storeToRefs } from 'pinia';
import { onMounted, reactive, ref } from 'vue';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import { Account } from 'src/ts/interfaces/data/Account';
import FormTransfer from 'src/components/forms/FormTransfer.vue';

defineOptions({
  name: 'Account',
});

const { getAccounts, exportAccount } = useAccountStore();
const { loadingAccount, listAccount } = storeToRefs(useAccountStore());

const showFormAccount = ref<boolean>(false);
const loadingExport = ref<boolean>(false);
const selectedDataEdit = ref<Account | null>(null);
const filterAccount = ref<string>('');
const showFormTransfer = ref<boolean>(false);
const columnsAccount = reactive<QuasarTable[]>([
  {
    name: 'name',
    label: 'Banco',
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'account_number',
    label: 'Conta',
    field: 'account_number',
    align: 'left',
    sortable: true,
  },
  {
    name: 'agency_number',
    label: 'Agência',
    field: 'agency_number',
    align: 'left',
    sortable: true,
  },
  {
    name: 'balance',
    label: 'Saldo',
    field: 'balance',
    align: 'left',
    sortable: true,
  },
  {
    name: 'description',
    label: 'Descrição',
    field: 'description',
    align: 'left',
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
]);

const openFormAccount = (): void => {
  showFormAccount.value = true;
};
const closeFormAccount = (): void => {
  showFormAccount.value = false;
  selectedDataEdit.value = null;
};
const openFormTransfer = (): void => {
  showFormTransfer.value = true;
};
const closeFormTransfer = (): void => {
  showFormTransfer.value = false;
};
const handleEdit = (account: Account) => {
  selectedDataEdit.value = account;
  openFormAccount();
};
const exportData = async (): Promise<void> => {
  loadingExport.value = true;
  await exportAccount();
  loadingExport.value = false;
};

onMounted(async () => {
  await getAccounts();
});
</script>
<template>
  <section>
    <header class="row justify-between no-wrap bg-grey-1">
      <div class="col-6">
        <TitlePage title="Gerenciamento de contas" />
      </div>
      <div class="col-6 row items-center justify-end q-gutter-x-sm">
        <q-btn
          @click="exportData"
          :loading="loadingExport"
          flat
          color="black"
          icon-right="download"
          label="Exportar"
          unelevated
          no-caps
        />
        <q-btn
          @click="openFormTransfer"
          color="blue-8"
          icon-right="assured_workload"
          label="Transferências"
          unelevated
          no-caps
        />
        <q-btn
          @click="openFormAccount"
          color="blue-8"
          icon-right="assured_workload"
          label="Contas"
          class="q-mr-sm"
          unelevated
          no-caps
        />
      </div>
    </header>
    <q-scroll-area class="main-scroll">
      <main class="q-pa-sm">
        <q-table
          :rows="loadingAccount ? [] : listAccount"
          :columns="columnsAccount"
          :filter="filterAccount"
          :loading="loadingAccount"
          flat
          bordered
          dense
          row-key="name"
          no-data-label="Nenhuma conta para mostrar"
          virtual-scroll
          :rows-per-page-options="[20]"
        >
          <template v-slot:top>
            <span class="text-subtitle2">Lista de contas</span>
            <q-space />
            <q-input filled v-model="filterAccount" dense label="Pesquisar">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" style="height: 28px">
              <q-td key="name" :props="props" class="text-left">
                {{ props.row.name }}
              </q-td>
              <q-td key="account_number" :props="props" class="text-left">
                {{ props.row.account_number }}
              </q-td>
              <q-td key="agency_number" :props="props" class="text-left">
                {{ props.row.agency_number }}
              </q-td>
              <q-td key="balance" :props="props" class="text-left">
                {{ `R$ ${props.row.balance}` }}
              </q-td>
              <q-td key="description" :props="props" class="text-left">
                {{ props.row.description }}
              </q-td>
              <q-td key="action" :props="props">
                <q-btn
                  @click="handleEdit(props.row)"
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="edit"
                  :disabled="false"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <FormAccount
          :open="showFormAccount"
          :data-edit="selectedDataEdit"
          @update:open="closeFormAccount"
        />
        <FormTransfer
          :open="showFormTransfer"
          @update:open="closeFormTransfer"
        />
      </main>
    </q-scroll-area>
  </section>
</template>
