<template>
  <div class="text">
      <input type="text" v-model="dataD"/>
     <button @click="emit">点击改变</button>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
    name:"HomeInner",
    data(){
       return{
           dataD:'',
       }
    },
    mounted(){
        console.log(this.__proto__===Vue.extend.prototype);
    },
    methods:{
        emit(){
            this.$bus.$emit("text",this.dataD)
        }
    }
}
</script>

<style>
.text{
    margin:0 auto;
    width: 300px;
    height: 300px;
    text-align: center;
}
</style>