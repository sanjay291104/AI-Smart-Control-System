import fs from "fs";
import FormData from "form-data";
import axios from "axios";

export async function sendToAI(filePath,kind){
  const url=`${process.env.AI_SERVICE_URL || "http://localhost:8000"}/analyze/${kind}`;
  const form=new FormData();
  form.append(kind,fs.createReadStream(filePath));
  const response=await axios.post(url,form,{headers:form.getHeaders(),maxBodyLength:50*1024*1024,maxContentLength:50*1024*1024,timeout:180000});
  return response.data;
}
