<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item><a>数据报表</a></el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div id="main"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  name: "Chart",
  data(){
    return{

    }
  },
  async mounted() {
    let res = await this.$http.get('reports/type/1');
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    // 绘制图表

    //添加标题
    var cf={
      title: {
        text: '用户来源'
      },
      tooltip: {
        trigger: 'item',
        formatter: function(params)
        {
          console.log(params);
          return params.seriesName+" "+params.name+ '日'+' : '+params.data+'人';
        }
      },
    }
    myChart.setOption(res.data);
    myChart.setOption(cf);
  }
}
</script>

<style>
#main{
  height: 500px;
}
</style>
