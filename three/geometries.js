

var G = Jungle.G;

var container
var camera, scene, renderer;

init();
animate();

function init() {

    container = $('.container')[0];

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.y = 400;
    scene = new THREE.Scene();
    var light, object;
    scene.add( new THREE.AmbientLight( 0x404040 ) );
    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 1, 0 );
    scene.add( light );
    var map = new THREE.TextureLoader().load( 'textures/UV_Grid_Sm.jpg' );
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 16;

    var material = new THREE.MeshLambertMaterial( { map: map, side: THREE.DoubleSide } );
    //
    var shapeMaker = G({
        type:G(
            ["circle", "square"],{
            r(obj){
                return obj[Math.floor(Math.random()*obj.length)]
            }
        }),
        size:200,
        position:{
            x:0,y:0,z:0
        }
    },{
        r(obj){
            let shape;
            switch(obj.type){
                case "circle":{
                    shape = new THREE.Mesh( new THREE.CircleGeometry( obj.size, 50, 0, Math.PI * 2 ), material ); break;
                }
                case "square":{
                    shape = new THREE.Mesh( new THREE.PlaneGeometry( obj.size, obj.size, 4, 4 ), material ); break;
                }
                shape.position.set(obj.position.x, obj.position.y, obj.position.z);
            }
            return shape;
        }

    });


    scene.add(shapeMaker.resolve());


    object = new THREE.AxisHelper( 50 );
    object.position.set( 200, 0, -200 );
    scene.add( object );

    object = new THREE.ArrowHelper( new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 0, 0 ), 50 );
    object.position.set( 400, 0, -200 );
    scene.add( object );
    //
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    container.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

//
function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {
    var timer = Date.now() * 0.0001;
    camera.position.x = Math.cos( timer ) * 800;
    camera.position.z = Math.sin( timer ) * 800;
    camera.lookAt( scene.position );
    for ( var i = 0, l = scene.children.length; i < l; i ++ ) {
        var object = scene.children[ i ];
        object.rotation.x = timer * 5;
        object.rotation.y = timer * 2.5;
    }
    renderer.render( scene, camera );
}
