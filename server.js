    //import * as africastalking from 'africastalking';
    //requirements
    const Pusher = require('pusher')
    const credentials = require('./cred')
    //var africastalking = require('africastalking')(credentials.AT)
    var cors = require('cors')
    var bodyParser = require('body-parser')
    const express = require('express')
    const path = require('path')

    //modules
    //var express = require('express')
    var app = express()
    var port = 3000
    //var path = require('path')

    var pusher = new Pusher(credentials.pusher)
    app.use(cors())
    app.use(bodyParser.urlencoded({extended:false}))
    app.use(bodyParser.json())

    //static files
    app.get('/', function(req, res){
        res.sendFile(path.join(__dirname + "/index.html"))
    })
    app.use(express.static(__dirname + '/'))

    
    //AT
    var webURL = 'https://bit.ly/Fertilizer12'
    var welcomeMsg = `CON Hello and welcome to Mazao-Fertilizer.
    Have your Fertilizer delivered quick and easy!
    Please find more info ${webURL}
    Enter your name to continue`
    var orderDetails = {
        name: "",
        description: "",
        county: "",
        constituency: "",
        telephone: "",
        open: true
    }
    var lastData = "";

    app.post('/order', function(req, res){
        console.log(req.body);
        var message = 'Hello' 
    
        var sessionId = req.body.sessionId
        var serviceCode = req.body.serviceCode
        var phoneNumber = req.body.phoneNumber
        var text = req.body.text
        var textValue = text.split('*').length
    
        if(text == ''){
            message = welcomeMsg
        }else if(textValue == 1){
            message = "CON How many bags do you need?"
            orderDetails.name = text;
        }else if(textValue == 2){
            message = "CON Where do we deliver it(county)?"
            orderDetails.description = text.split('*')[1];
        }else if(textValue == 3){
            message = "CON Where do we deliver it(constituency)?"
            orderDetails.description = text.split('*')[2];
        }else if(textValue == 4){
            message = "CON What's your telephone number?"
            orderDetails.address = text.split('*')[3];
        }else if(textValue == 5){
            message = `CON Would you like to place this order?
            1. Yes
            2. No`
            lastData = text.split('*')[4];
        }else{
            message = `END Thanks for your order
            Our team is workin on it ASAP`
            orderDetails.telephone = lastData   
        }
        
        res.contentType('text/plain');
        res.send(message, 200);
    
        console.log(orderDetails)
        if(orderDetails.name != "" && orderDetails.county != '' && orderDetails.constituency != '' && orderDetails.description != '' && orderDetails.telephone != ''){
            pusher.trigger('orders', 'customerOrder', orderDetails)
        }
        if(orderDetails.telephone != ''){
            //reset data
        orderDetails.name= ""
        orderDetails.description= ""
        orderDetails.county= ""
        orderDetails.constituency= ""
        orderDetails.telephone= ""
        }
    
    })
    //listen on port 
    app.listen(port, function(err, res){
        if(err) throw err
        console.log("App running on port " + port)
    })
    