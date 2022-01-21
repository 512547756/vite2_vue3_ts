// baseOption.js
export default {
  color: ["#0067E1", "#0CC1FF", "#00D1B3", "#85E814", "#FFA082"],
  tooltip: {},
  legend: {
    orient: "horizontal",
    type: "scroll",
    pageIconSize: 12,
    pageIconColor: "#aaa",
    pageIconInactiveColor: "#2f4554",
    pageTextStyle: {
      color: "#999999",
    },
    itemWidth: 20,
    itemHeight: 12,
    top: 0,
    textStyle: {
      color: "#999999",
    },
  },
  grid: {
    top: "13%",
    left: "3%",
    right: "10%",
    bottom: "2%",
    containLabel: true,
  },
  xAxis: [
    {
      axisLine: {
        lineStyle: {
          color: "rgba(65, 97, 128, 0.15)",
          // type: "dashed",
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        interval: 0,
        color: "#rgba(0, 0, 0, 0.25)",
        textStyle: {
          fontSize: 10,
        },
      },
      nameTextStyle: {
        color: "#999999",
        fontSize: 10,
      },
    },
  ],
  yAxis: [
    {
      axisLabel: {
        color: "#rgba(0, 0, 0, 0.25)",
        textStyle: {
          fontSize: 11,
        },
      },
      axisLine: {
        lineStyle: {
          color: "rgba(65, 97, 128, 0.15)",
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(65, 97, 128, 0.15)",
        },
      },
      axisTick: {
        show: false,
      },
      nameTextStyle: {
        color: "#999999",
        fontSize: 10,
        padding: [0, 20, 0, 0],
      },
      minInterval: 1,
    },
  ],
};
