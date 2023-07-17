const express =require('express')
const axios=require('axios')
const {utils}=require('ethers');
const createCsvWriter=require('csv-writer').createObjectCsvWriter;
require('dotenv').config()

const app=express()
const apiKey=process.env.API_KEY
class Block{
    constructor(timeStamp,blockReward){
        this.timeStamp=timeStamp;
        this.blockReward=blockReward;
    }
}



 const fetchData= async ()=> {
    try{
        const listOfBlocks =[];
        for(let blkNo =17468523; blkNo<17468780; blkNo++){
            const APIUrl= `https://api.etherscan.io/api?module=block&action=getblockreward&blockno=${blkNo} &apikey=${apiKey}`
            const response = await axios.get(APIUrl);
            const Rewardether=utils.formatEther(response.data.result.blockReward)
            const timeStamp=response.data.result.timeStamp   
            const block=new Block(timeStamp, Rewardether) 
            console.log(block)
            console.log()        
            listOfBlocks.push(block)     
            
        }
        exportToCsv(listOfBlocks)
    }catch(error){
        console.error(error);
    }
 }
 const exportToCsv = (data) => {
    console.log("Hello")
    const csvWriter = createCsvWriter({
      path: 'block_data.csv',
      header: [
        { id: 'timeStamp', title: 'timestamp' },
        { id: 'blockReward', title: 'blockReward' }
      ]
    });
  
    csvWriter
      .writeRecords(data)
      .then(() => {
        console.log('CSV file created successfully!');
      })
      .catch((error) => {
        console.error(error);
      });
  };


(async() => {
    try{
        await fetchData()
        app.listen(8000, ()=> {
            console.log("Server is running");
        })
    }catch(error){
        console.error(error);
    }
    
})()
