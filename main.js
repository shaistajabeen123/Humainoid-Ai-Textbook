// 3D sensor simulation
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( ambientLight );

const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
scene.add( directionalLight );

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

const sphere_geometry = new THREE.SphereGeometry( 0.5, 32, 32 );
const sphere_material = new THREE.MeshStandardMaterial( { color: 0xffff00 } );
const sphere = new THREE.Mesh( sphere_geometry, sphere_material );
sphere.position.x = 2;
scene.add( sphere );

camera.position.z = 5;

const lidarRays = new THREE.Group();
const rayCount = 100;
const rayLength = 10;
const raycaster = new THREE.Raycaster();
const intersections = [];
const pointCloudGeometry = new THREE.BufferGeometry();
const pointCloudMaterial = new THREE.PointsMaterial({color: 0xff0000, size: 0.1});
const pointCloud = new THREE.Points(pointCloudGeometry, pointCloudMaterial);
scene.add(pointCloud);

for (let i = 0; i < rayCount; i++) {
	const material = new THREE.LineBasicMaterial({color: 0xff0000});
	const geometry = new THREE.BufferGeometry().setFromPoints([
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize().multiplyScalar(rayLength)
	]);
	const line = new THREE.Line(geometry, material);
	lidarRays.add(line);
}
// scene.add(lidarRays); // We don't need to see the rays themselves

function animate() {
	requestAnimationFrame( animate );

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	sphere.rotation.x += 0.01;
	sphere.rotation.y += 0.01;

	const points = [];
	for (let i = 0; i < lidarRays.children.length; i++) {
		const ray = lidarRays.children[i];
		const direction = new THREE.Vector3().subVectors(ray.geometry.attributes.position.getXYZ(1), ray.geometry.attributes.position.getXYZ(0)).normalize();
		raycaster.set(new THREE.Vector3(0,0,0), direction);
		const intersects = raycaster.intersectObjects([cube, sphere]);

		if (intersects.length > 0) {
			points.push(intersects[0].point);
		}
	}
	pointCloud.geometry.setFromPoints(points);

	renderer.render( scene, camera );
}
animate();

// Depth camera
const depthRenderTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, {
	format: THREE.DepthFormat,
	type: THREE.UnsignedShortType,
} );
const depthCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
depthCamera.position.z = 5;

function animate() {
	requestAnimationFrame( animate );

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	sphere.rotation.x += 0.01;
	sphere.rotation.y += 0.01;

	const points = [];
	for (let i = 0; i < lidarRays.children.length; i++) {
		const ray = lidarRays.children[i];
		const direction = new THREE.Vector3().subVectors(ray.geometry.attributes.position.getXYZ(1), ray.geometry.attributes.position.getXYZ(0)).normalize();
		raycaster.set(new THREE.Vector3(0,0,0), direction);
		const intersects = raycaster.intersectObjects([cube, sphere]);

		if (intersects.length > 0) {
			points.push(intersects[0].point);
		}
	}
	pointCloud.geometry.setFromPoints(points);

	// Render depth
	renderer.setRenderTarget(depthRenderTarget);
	renderer.render(scene, depthCamera);
	renderer.setRenderTarget(null);

	// Display depth map
	const depthMapScene = new THREE.Scene();
	const depthMapCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
	const depthMapGeometry = new THREE.PlaneGeometry(0.5, 0.5);
	const depthMapMaterial = new THREE.MeshBasicMaterial({map: depthRenderTarget.depthTexture});
	const depthMapPlane = new THREE.Mesh(depthMapGeometry, depthMapMaterial);
	depthMapPlane.position.x = -0.75;
	depthMapPlane.position.y = -0.75;
	depthMapScene.add(depthMapPlane);

	renderer.autoClear = false;
	renderer.clear();
	renderer.render(scene, camera);
	renderer.clearDepth();
	renderer.render(depthMapScene, depthMapCamera);
	renderer.autoClear = true;
}
animate();
