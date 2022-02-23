const handleSocketFnStrategies = {
  aa: (data: any) => {
    console.log("aa=>", data);
  },
  bb: (data: any) => {
    console.log("bb=>", data);
  },
  HEARTBEAT: (data: any) => {
    console.log("HEARTBEAT=>", data);
  },
  successHello: (data: any) => {
    console.log("successHello=>", data);
  },
};

export default handleSocketFnStrategies;
