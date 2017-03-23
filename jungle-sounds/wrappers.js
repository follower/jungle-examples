// Start off by initializing a new context.

const {G, L, Util} = Jungle;

context = new (window.AudioContext || window.webkitAudioContext)();

if (!context.createGain)
  context.createGain = context.createGainNode;
if (!context.createDelay)
  context.createDelay = context.createDelayNode;
if (!context.createScriptProcessor)
  context.createScriptProcessor = context.createJavaScriptNode;


const MetroCell = G({},{
    port:['click_'],
    __start(){
        this.interrupt = false;
        this.turn();
    },

    _stop(){
        this.interrupt=true;
    },

    turn(){
        this.lining.sinks.click.handle("Click");

        window.setTimeout(()=>{
            if(!this.interrupt) this.turn();
        },this.tempo*1000/60);
    },

    interrupt:false,
    _tempo:200

})


const OscillatorCell = G({
        freq:G({},{
            __freq:440,
            r(){
                return this.freq;
            }
        })
    },{
    x:'use audio',
    p(){
        this.node = this.context.createOscillator();
        this.aud = this.context.createGain();
        this.node.connect(this.aud);
        this.aud.gain.value = 0;
        this.node.start(this.context.currentTime);
        this.node.frequency.value = 440;
    },
    r(obj){
        this.node.frequency.value = obj.freq
    },

    _toggle(){
        if(this.on){
            this.on = false;
            this.aud.gain.value = 0;
        }else{
            this.on = true;
            this.aud.gain.value = 0.5;
        }
    },

    __start(time){
        this.on = true;
        this.aud.gain.value = 0.5
    },

    _stop(){
        this.on = false;
        this.aud.gain.value = 0;
    },

    aud_:undefined,
    on:false,
    node:undefined,

})


const AudioContextCell = L({
        dest:G(undefined,{
            x:'use audio',
            p(){
                this.node = this.context.destination;
            },
            node:undefined
        })
    },{
    x:'audio',
    p(){
        this.context = new (window.AudioContext || window.webkitAudioContext)();
    },

    port:['_stop', '_start'],

    lf(source, sink, srclabel, sinklabel){
        let srcAudioLabel, sinkAudioLabel;
        if(srclabel == '$'){
            srcAudioLabel = 'node';
        }else if(srclabel.match('aud')){
            srcAudioLabel = srclabel;
        }

        if(sinklabel == '$'){
            sinkAudioLabel = 'node';
        }else if(sinklabel.match('aud')){
            sinkAudioLabel = sinklabel;
        }

        if(srcAudioLabel && sinkAudioLabel){
            source[srcAudioLabel].connect(sink[sinkAudioLabel]);
        }
    },

    context:undefined
})

var AudioSetup = AudioContextCell.X({
    metro:MetroCell,
    osc1:OscillatorCell
},{
    link:[
        'osc1.aud->dest','_.start->*.start', '_.stop->*.stop', 'metro.click->osc1.toggle'
    ]
})

function createInterface(cell, containerid, defaults, name){

    let container = $(containerid)[0]

    boundingBox = document.createElement('div');
    boundingBox.className = 'jungle-button-container';
    container.append(boundingBox);

    nameBox = document.createElement('h');
    nameBox.innerHTML = name;
    boundingBox.appendChild(nameBox)

    for(let sinkKey in cell.io.shell.sinks){

        let button = document.createElement('input');
        boundingBox.append(button);
        button.value = sinkKey;
        button.type = 'button';
        button.className = 'jungle-input-button';
        button.onclick = ()=>{cell.io.shell.sinks[sinkKey].handle(defaults[sinkKey])};
    }
}
