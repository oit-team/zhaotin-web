function g_paramJson(con,cmd){
  var g_paramJson = {
    "head" : {
      "aid" : sessionStorage.userId,
      "ver" : "1.0",
      "ln" : "cn",
      "mod" : "home",
      "de" : "2019-10-16",
      "sync" : 1,
      "cmd" : cmd?cmd:10008,
      "uuid" : sessionStorage.brandId,
      "chcode" : "ef19843298ae8f2134f"
    },
    "con" : con
  };
  return g_paramJson
}

function getCurTime(){
  let now = new Date();
  let year = now.getFullYear();       //年
  let month = now.getMonth() + 1;     //月
  let day = now.getDate();            //日
  let hh = now.getHours();            //时
  let mm = now.getMinutes();          //分
  let ss = now.getSeconds();          //秒
  let clock = year + "-";
  if(month < 10)
      clock += "0";
  clock += month + "-";
  if(day < 10)
      clock += "0";
  clock += day + " ";
  if(hh < 10)
      clock += "0";
  clock += hh + ":";
  if (mm < 10)
      clock += '0';
  clock += mm + ":";
  if(ss < 10)
      clock += "0";
  clock += ss;
  return(clock);
}


function getCurDate(){
  let now = new Date();
  let year = now.getFullYear();       //年
  let month = now.getMonth() + 1;     //月
  let day = now.getDate();            //日
  let clock = year + "-";
  if(month < 10)
      clock += "0";
  clock += month + "-";
  if(day < 10)
      clock += "0";
  clock += day + " ";
  return(clock);
}



// 表格样式全局设置
// const tableHeadStyle = 'text-align:center;font-size:18px;font-weight:bold;color:#515151;line-height:30px;border-bottom:1px solid #ddd;';
// const tableCellStyle = 'border-bottom:1px solid #ddd;';
// const tableStyle = 'width: 100%;height:auto;min-height:calc(100vh - 320px);'

const tableHeadStyle = 'text-align:center;font-size:13px;font-weight:bold;color:#515151;border-bottom:1px solid #ddd;border-left:1px solid #ddd;';
const tableCellStyle = 'border-bottom:1px solid #ddd;border-left:1px solid #ddd;';  // background-color: pink;
const tableStyle = 'width: 100%;height:auto;min-height:calc(100vh - 320px);border-bottom:1px solid #fff;border-top:1px solid #ddd;'
const minCellWidth = '140';


// 微服务模块
const system_manager_server = 'system'
const task_manager_server = 'task'
const goods_manager_server = 'goods'
const data_manager_server = 'data'
const work_manager_server = 'work'

export default{
  g_paramJson,
  getCurTime,
  getCurDate,
  tableHeadStyle,
  tableCellStyle,
  tableStyle,
  minCellWidth,
  system_manager_server,
  task_manager_server,
  goods_manager_server,
  data_manager_server,
  work_manager_server
}



