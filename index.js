new Vue({
    el: "#root",
    data:{
        title: "Mazao Fertilizer Dashboard",
        orders:[
            {name:"Riggy G", description:"2 Bags", address:"Muranga", telephone:"0712345678", open:true},
            {name:"Lebron James", description:"1 Bag", address:"Homa Bay", telephone:"0709876543", open:true},
            {name:"Mary Jane", description:"5 Bags", address:"Nakuru", telephone:"0734567890", open:true},
            {name:"Africas Talking", description:"6 Bags", address:"Lavington", telephone:"0732547698", open:true},
            {name:"Tupac Shakur", description:"7 Bags", address:"Mombasa", telephone:"0112365789", open:true}
        ]
    },
    created(){
        var pusher = new pusher('03ef99860b4d142637b0',{
            cluster:'PusherCluster',
            encrypted:true
        })
        var channel = pusher.subscribe('orders')
        channel.bind('customerOrder', (data) => {
            console.log(data)
            this.orders.push(data)
        })
    },
    methods:{
        // close completed order
        close(orderToClose){
            if ( confirm('Are you sure you want to close the order?') === true){
                this.orders = this.orders.map(order => {
                    if(order.name !== orderToClose.name && order.description !== orderToClose.description){
                        return order;
                    }
                    const change = {
                        open: !order.open
                    }
                    return change;
                })
            } 
        }
    }
})