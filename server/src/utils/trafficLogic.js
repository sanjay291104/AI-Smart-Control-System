export function dynamicTrafficLogic(vehicleCount,isEmergency=false){
  if(isEmergency) return {level:"🚨 EMERGENCY",greenSeconds:90,load:100,confidence:95};
  if(vehicleCount<15) return {level:"🟢 LOW",greenSeconds:15,load:15,confidence:85};
  if(vehicleCount<30) return {level:"🟡 MEDIUM",greenSeconds:30,load:50,confidence:80};
  if(vehicleCount<50) return {level:"🟠 HIGH",greenSeconds:50,load:80,confidence:75};
  return {level:"🔴 CRITICAL",greenSeconds:70,load:100,confidence:70};
}
