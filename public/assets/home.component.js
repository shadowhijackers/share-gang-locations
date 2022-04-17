import { defineComponent } from 'vue'

export const HomeComponent = defineComponent({
  data(){
  },
  template: document.getElementById("index")?.innerHTML ?? "Not loaded",
})

export default {
  HomeComponent
}