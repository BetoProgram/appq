<template>
  <q-page class="q-pl-lg q-ma-lg">
    <q-table title="Lista Estudiantes" :rows="estudiantes" :columns="columns" row-key="idMatricula" :loading="isLoading">
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>

      <template v-slot:top>
        <q-space />
        <q-btn color="primary" label="Agregar Estudiante" @click="showForm = true" />
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-sm">
          <q-btn icon="edit" color="info" dense size="sm" @click="showEditDialog(props.row.idMatricula)" />
          <q-btn icon="delete" color="negative" dense size="sm" @click="showDialogConfirm(props.row.idMatricula)" />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="showForm" persistent>
      <q-card style="min-width: 450px">
        <q-card-section>
          <div class="text-h6">{{ isEdited ? 'Editar': 'Agregar' }} Estudiante</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
            <q-input filled v-model="erq.nombre" label="Tu Nombre *" hint="Nombre completo" lazy-rules
              :rules="[val => val && val.length > 0 || 'Nombre es requerido']" />

            <q-input filled v-model="erq.apellidos" label="Tus Apellidos *" hint="Apellidos" lazy-rules
              :rules="[val => val && val.length > 0 || 'Apellidos son requeridos']" />

            <q-input filled v-model="erq.fechaNacimiento" label="Fecha de Nacimiento" lazy-rules
              :rules="[val => val && val.length > 0 || 'Fecha de Nacimiento']">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="erq.fechaNacimiento" minimal :locale="esLocale" mask="YYYY-MM-DD">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <q-input filled v-model="erq.fechaIngreso" label="Fecha de Ingreso" lazy-rules
              :rules="[val => val && val.length > 0 || 'Fecha de Ingreso']">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="erq.fechaIngreso" minimal :locale="esLocale" mask="YYYY-MM-DD">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <q-input filled v-model="erq.fechaSalida" label="Fecha de Salida" lazy-rules v-if="isEdited">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="erq.fechaSalida" minimal :locale="esLocale" mask="YYYY-MM-DD">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <div>
              <q-btn label="Enviar" type="submit" color="primary" />
              <q-btn label="Limpiar" type="reset" color="primary" flat class="q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cerrar" @click="onReset" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="hasError">
      <q-card class="bg-red text-white" style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Error</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ errorMessage }}
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-red">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useEstudiantes } from 'src/composables/useEstudiantes';
import { useLocale } from 'src/composables/useLocale';
import { EstudianteRequest } from 'src/models';
import { useQuasar } from 'quasar';

const { estudiantes,
  isLoading,
  errorMessage,
  hasError, guardarEstudiante, editarEstudiante, eliminarEstudiante } = useEstudiantes();
const { esLocale } = useLocale();
const $q = useQuasar();

const columns = [
  { name: 'idMatricula', label: 'No Matricula', field: 'idMatricula', sortable: true },
  { name: 'nombre', label: 'Nombres', field: 'nombre' },
  { name: 'fechaNacimiento', label: 'Fecha de nacimiento', field: 'fechaNacimiento' },
  { name: 'fechaIngreso', label: 'Fecha de Ingreso', field: 'fechaIngreso' },
  { name: 'fechaSalida', label: 'Fecha de Salida', field: 'fechaSalida' },
  { name: 'actions', field: 'actions', label: 'Acciones' }
]

const showForm = ref(false);
const isEdited = ref(false);
const idMatricula = ref(0);

const erq = ref<EstudianteRequest>(new EstudianteRequest());

const onSubmit = async () => {
  if (!isEdited.value) {
    await guardarEstudiante(erq.value);
  } else {
    await editarEstudiante(idMatricula.value, erq.value);
  }
  onReset();
}

const showEditDialog = (id: number) => {
  if (estudiantes.value.length > 0) {
    const estudianteEncontrado = estudiantes.value.filter(estudiante => estudiante.idMatricula === id)[0];
    erq.value.nombre = estudianteEncontrado.nombre;
    erq.value.apellidos = estudianteEncontrado.apellidos;
    erq.value.fechaIngreso = estudianteEncontrado.fechaIngreso;
    erq.value.fechaNacimiento = estudianteEncontrado.fechaNacimiento;
    erq.value.fechaSalida = estudianteEncontrado.fechaSalida;
    idMatricula.value = estudianteEncontrado.idMatricula;

    isEdited.value = true;
    showForm.value = true;
  }
}

const showDialogConfirm = async (id: number) => {
  $q.dialog({
    dark: true,
    title: 'Confirm',
    message: 'Would you like to delete user?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    await eliminarEstudiante(id);
    $q.notify({ message: 'Estudiante eliminado', icon: 'check', color: 'positive' });
  });
}

const onReset = () => {
  erq.value = new EstudianteRequest();
  isEdited.value = false;
  showForm.value = false;
  idMatricula.value = 0;
}
</script>