
var jungle = require("../dist/jungle.js");

var G = jungle.G;
var F = jungle.F;

var randomEyes = G({
    min:1,
    max:12
},{
    r(obj){
        return obj.min + Math.floor(Math.random()*(obj.max - obj.min))
    }
})

function joinTailSections(arr, arg){
    return `a tail with sections : ${arr.join(",")}`
}

function monsterBuilder(monster, arg){
    return `
        a monster with hair of ${monster.head.hair} and ${monster.head.eyes.number} eyes of ${monster.head.eyes.colour} on its head.
        It has the body of a ${monster.body} and ${monster.tail}
        `
}

function shuffle(arr){
    return arr.sort((x,y)=>{return 1-2*Math.random()})
}

var g = G({
    head:{
        hair:'snakes',
        eyes:{
            colour:'green',
            number:3
        }
    },
    body:G(
        ['bear', 'crocodile', 'falcon'],
        {
            r(obj){
                this.i = (this.i+1)%3;
                return (obj[this.i])
            },
            i:0
        }
    ),
    tail: G(['fur', 'scales', 'skin'],
            {
                r:joinTailSections
            })
},{
    r:monsterBuilder
})

for (var i = 0; i < 5; i++) {
    console.log(`monster${i}: \n \t ${g.resolve()}'\n`);
}
