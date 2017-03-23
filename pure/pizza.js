const Jungle = require('../dist/jungle.js');
const {G, L, Util} = Jungle;

const combine = (...ingredients)=>{
    return G(null,{
        x:'use kitchen',
        r(obj, arg){
            let combination = ""

            for (let i of ingredients){
                this.pantry[i] -= 1;
                combination += i;
            }

            return combination
        }
    })
}

const pick = (...possible) =>{
    return G(null,{
        x:'use kitchen',
        r(obj, arg){
            let sel = Math.floor(Math.random() * possible.length);
            return possible[sel]
        },
    })
}

const pizzaMachine = G({
    base:"Thin crust",
    toppings:pick('mushroom + olive', 'artichoke + jalapeno', 'tofu + red onion'),
    sauce:pick('tomato', 'pesto')
},{
    p(stock){
        Util.assoc(stock, this.pantry);
        this.oven.temperature = 350;
    },
    c(order){
        let [place, reject] = this.handle.hold();

        if(order == 'pizza'){
            place(order)
        }else{
            reject("We only do pizza")
        }
    },
    r(obj){

        return `A pizza with a ${obj.base} base,  ${obj.toppings} toppings and a ${obj.sauce} sauce`
    },

    x:'kitchen',
    oven:{full:false, temperature:0},
    pantry:{
        salt:0,
        water:0,
        flour:0,
        pesto:0,
        tomatoes:0,
        cheese:0
    }
}).prepare({
    salt:50,
    water:100,
    flour:10,
    pesto:3,
    tomatoes:5,
    cheese:20
})

console.log(pizzaMachine.resolve("Pizza"));
