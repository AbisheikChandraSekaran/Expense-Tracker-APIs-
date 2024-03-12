const mongoose = require('mongoose')
const express = require("express")
const {Expense}=require('./schema.js')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(bodyParser.json())
app.use(cors())

async function connectToDB(){
    try{
        
        await mongoose.connect('mongodb+srv://abisheik:Truegod7@cluster0.x8oghx9.mongodb.net/ExpenseTracker?retryWrites=true&w=majority&appName=Cluster0')
        console.log("DB connection established")
        const port = process.env.PORT || 8000
        app.listen(port,function(){
        console.log(`Listening on port ${port}...`)})

    }

catch(error){
    console.log(error)
    console.log("Could'nt Establish Connection")
}

}


connectToDB()


app.post('/add-expense',async function(request,response){
    try{
    await Expense.create({
        "amount":request.body.amount,
        "category": request.body.category,
        "date":request.body.date
        })
        response.status(201).json(
            {
                'status': "success",
                "message":"Entry Created"
            }
    )
    }
        catch(error){
            response.status(500).json({
                "status":"failure",
                "message":"Entry not created",
                "error":error
            })
        }
    })

    app.get('/get-expenses',async function(request,response){
        try {
            const expenseDetails = await Expense.find()
            response.status(200).json(expenseDetails)
       } 
        
        catch (error) {
            response.status(500).json({
                "status":"failure",
                "message":"Could Not fetch Data",
                "error":error
            })
            
        }
        
    })                          //mvc pattern

    app.delete('/delete-expense/:id',async function(request,response){
        try{
        const expenseEntry = await Expense.findById(request.params.id)
        if(expenseEntry){
            await Expense.findByIdAndDelete(request.params.id)
            response.status(200).json({
                'status': "success",
                "message":"Entry Deleted"
            })
        }

        else{
            response.status(404).json({
                'status': "Failure",
                "message":"Counld'nt Find Entry"
            });
        }
        }
        catch(error){
            response.status(500).json({
                "status":"failure",
                "message":"Entry not found",
               'error':error
            })
        }
    })


    app.patch('/update-expense/:id',async function(request,response){
        try{
        const expenseEntry = await Expense.findById(request.params.id)
        if(expenseEntry){
            await expenseEntry.updateOne({
                "amount": request.body.amount,
                "category": request.body.category,
                "date": request.body.date
            }) 
            response.status(200).json({
                'status': "success",
                "message":"Entry Updated"
            })
        }

        else{
            response.status(404).json({
                'status': "Failure",
                "message":"Counld'nt Update Entry"
            });
        }
        }
        catch(error){
            response.status(500).json({
                "status":"failure",
                "message":"Entry not found",
                'error':error
            })
        }
    })


