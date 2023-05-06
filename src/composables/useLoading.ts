import { onBeforeUnmount } from "vue";
import { useQuasar } from "quasar"

export const useLoading = () => {
    const $q = useQuasar();

    let timer:any;
    onBeforeUnmount(() => {
      if (timer !== void 0) {
        clearTimeout(timer)
        $q.loading.hide()
      }
    })

    return {
        showLoading () {
          $q.loading.show({
            message: 'Algún proceso importante está en marcha. Espera...'
          })
          // hiding in 3s
          timer = setTimeout(() => {
            $q.loading.hide()
            timer = void 0
          }, 1000)
        }
    }
}