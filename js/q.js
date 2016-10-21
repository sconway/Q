if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var renderer, scene, camera, stats;
var object, uniforms;
var loader = new THREE.FontLoader();

loader.load( 'js/helvetiker_bold.typeface.json', function ( font ) {
	init( font );
	animate();
} );

function init( font ) {
	camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 400;
	scene = new THREE.Scene();

	uniforms = {
		amplitude: { value: 5.0 },
		opacity:   { value: 0.3 },
		color:     { value: new THREE.Color( 0xff0000 ) }
	};

	var shaderMaterial = new THREE.ShaderMaterial( {
		uniforms:       uniforms,
		vertexShader:   document.getElementById( 'vertexshader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
		blending:       THREE.AdditiveBlending,
		depthTest:      false,
		transparent:    true
	});

	var geometry = new THREE.TextGeometry( 'Q', {
		font: font,
		size: 50,
		height: 15,
		curveSegments: 10,
		bevelThickness: 5,
		bevelSize: 1.5,
		bevelEnabled: true,
		bevelSegments: 10,
		steps: 40
	} );

	// var geometry = new THREE.PlaneGeometry( 50, 50, 64, 64 );

	geometry.center();

	var vertices = geometry.vertices;
	var buffergeometry = new THREE.BufferGeometry();

	var position = new THREE.Float32Attribute( vertices.length * 3, 3 ).copyVector3sArray( vertices );
	buffergeometry.addAttribute( 'position', position )

	var displacement = new THREE.Float32Attribute( vertices.length * 3, 3 );
	buffergeometry.addAttribute( 'displacement', displacement );

	var customColor = new THREE.Float32Attribute( vertices.length * 3, 3 );
	buffergeometry.addAttribute( 'customColor', customColor );

	var color = new THREE.Color( 0x000000 );

	for( var i = 0, l = customColor.count; i < l; i ++ ) {
		color.setHSL( i / l, 0.5, 0.5 );
		color.toArray( customColor.array, i * customColor.itemSize );
	}

	object = new THREE.Line( buffergeometry, shaderMaterial );
	object.rotation.x = 0.2;
	object.scale.set(3, 3, 3);
	scene.add( object );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setClearColor( 0xd7d7d7 );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );

	var container = document.getElementById( 'container' );
	container.appendChild( renderer.domElement );

	//
	window.addEventListener( 'resize', onWindowResize, false );
}


function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}


function animate() {
	requestAnimationFrame( animate );
	render();
}


function render() {
	var time = Date.now() * 0.001;
	object.rotation.y = 0.25 * time;

	uniforms.amplitude.value = Math.sin( 0.5 * time ) / 4;
	uniforms.color.value.offsetHSL( 0.0005, 0, 0 );

	var attributes = object.geometry.attributes;
	var array = attributes.displacement.array;

	for ( var i = 0, l = array.length; i < l; i += 3 ) {
		array[ i     ] += 0.3 * ( 0.5 - Math.random() );
		array[ i + 1 ] += 0.3 * ( 0.5 - Math.random() );
		array[ i + 2 ] += 0.3 * ( 0.5 - Math.random() );
	}

	attributes.displacement.needsUpdate = true;
	renderer.render( scene, camera );
}

