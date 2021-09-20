import './style.css'
import * as THREE from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

// ----------------------------------------------
// ----------------- Definition -----------------
// ----------------------------------------------

let windowWidth, windowHeight, ambientLight, isMouseDown, textureResolution, printingType, baseResolution;
let sessionID = 'default'
const controls = []
const scene = []
const renderer = []
let slices = []

const manager = new THREE.LoadingManager();
const texloader = new THREE.TextureLoader(manager)

//Define Viewports
const views = [
  {
    //CBViewer
    left: 0,
    bottom: 0,
    width: 0.5,
    height: 0.5,
    background: 0x686868, //new THREE.Color(0.7, 0.5, 0.7),
    eye: [0, 0, 1000],
    fov: 50,
  },
  {
    //CBViewerClosed
    left: 0,
    bottom: 0.5,
    width: 0.5,
    height: 0.5,
    background: 0x9E9E9E, //new THREE.Color(0.5, 0.5, 0.7),
    eye: [0, 0, 1000],
    fov: 50,
  },
  {
    //CBEnvelope
    left: 0.5,
    bottom: 0.5,
    width: 0.5,
    height: 0.5,
    background: 0x838383, //new THREE.Color(0.5, 0.7, 0.7),
    eye: [0, 0, -1100],
    fov: 50,
  }, {
    //CBEnvelopeOpened
    left: 0.5,
    bottom: 0,
    width: 0.5,
    height: 0.5,
    background: 0x4F4F4F, //new THREE.Color(0.7, 0.5, 0.5),
    eye: [0, 0, -1400],
    fov: 50,
  }
];

//Define Models
const models = [
  {
    name: 'CBViewer',
    scaleFactor: 3,
    spawnPosition:
    {
      x: 0,
      y: 0,
      z: 0
    },
    spawnRotation:
    {
      x: 0.2,
      y: 0,
      z: 0
    }
  },
  {
    name: 'CBViewerClosed',
    scaleFactor: 3,
    spawnPosition:
    {
      x: 0,
      y: 0,
      z: 0
    },
    spawnRotation:
    {
      x: 0.2,
      y: 0,
      z: 0
    }
  },
  {
    name: 'CBEnvelope',
    scaleFactor: 3,
    spawnPosition:
    {
      x: 0.2,
      y: 0,
      z: 0
    },
    spawnRotation:
    {
      x: 0,
      y: 2 * 1.57079632679,
      z: 0
    }
  },
  {
    name: 'CBEnvelopeOpened',
    scaleFactor: 2.2,
    spawnPosition:
    {
      x: 0,
      y: 0,
      z: 0
    },
    spawnRotation:
    {
      x: -0.2,
      y: 2 * 1.57079632679,
      z: 0
    }
  }
];

//Define lights
const lights = [
  [ //CBViewer    
    {
      color: 0xffffff,
      intensity: 0.4,
      spawnPosition:
      {
        x: 150,
        y: 50,
        z: 15
      }
    },
    {
      color: 0xffffff,
      intensity: 0.4,
      spawnPosition:
      {
        x: -150,
        y: 50,
        z: 15
      }
    },
    {
      color: 0xffffff,
      intensity: 0.1,
      spawnPosition:
      {
        x: 0,
        y: 0,
        z: 0
      }
    },
    {
      color: 0xffffff,
      intensity: 0.1,
      spawnPosition:
      {
        x: 0,
        y: 20,
        z: 50
      }
    }
  ], [
    //CBViewerClosed
    {
      color: 0xffffff,
      intensity: 0.3,
      spawnPosition:
      {
        x: 0,
        y: 20,
        z: 50
      }
    }
  ], [
    //CBEnvelop
    {
      color: 0xffffff,
      intensity: 0.3,
      spawnPosition:
      {
        x: 0,
        y: 20,
        z: 50
      }
    }
  ], [
    //CBEnvelopeOpened
    {
      color: 0xffffff,
      intensity: 0.3,
      spawnPosition:
      {
        x: 0,
        y: 20,
        z: 50
      }
    }
  ]
]
//Define textures array
const textures = [
  [
  ], [
  ], [
  ], [
  ]
]

//Define slices array
//Org 5906 x 4174
//Size on what the template below is based on: 2213 x 1564
//Ratio of 1.414949689
const digitalslices = [
  [ //CBViewer
    //X,	Y,	Height,	Width, Template Side based on an iamge of 9448 x 7087px
    [1123, 800, 413, 648, "sourceImageOutside"], //map_Kd textures/TxBottomOutsideFit.jpg
    [679, 800, 413, 648, "sourceImageInside"], //map_Kd textures/TxBottomInsideFit.jpg
    [1783, 824, 405, 251, "sourceImageOutside"], //map_Kd textures/LensOutsideFit.jpg
    [27, 824, 405, 251, "sourceImageInside"], //map_Kd textures/LensInsideFit.jpg
    [1746, 1087, 238, 107, "sourceImageOutside"], //map_Kd textures/NoseOutsideFit.jpg
    [231, 1087, 238, 107, "sourceImageInside"], //map_Kd textures/NoseInsideFit.jpg
    [467, 1194, 410, 255, "sourceImageOutside"], //map_Kd textures/TopOutsideFit.jpg
    [1339, 1194, 410, 255, "sourceImageInside"], //map_Kd textures/TopInsideFit.jpg
    [877, 1194, 247, 255, "sourceImageOutside"], //map_Kd textures/RightSideOutsideFit_1.jpg
    [1092, 1194, 247, 255, "sourceImageInside"], //map_Kd textures/RightSideInsideFit.jpg
    [1536, 1194, 243, 254, "sourceImageOutside"], //map_Kd textures/LeftSideOutsideFit.jpg
    [436, 1194, 243, 254, "sourceImageInside"], //map_Kd textures/LeftSideInsideFit.jpg
    [-35, -204, 0, 0, "sourceImageInside"] //map_Kd textures/texture.jpg
  ], [ //CBViewerClosed
    [-35, -204, 0, 0, "sourceImageInside"], //map_Kd textures/texture.jpg
    [1121, 800, 418, 103, "sourceImageOutside"], //map_Kd textures/ViewerLugOutside.jpg
    [467, 1194, 410, 255, "sourceImageOutside"], //map_Kd textures/TopOutsideFit.jpg
    [1121, 903, 418, 250, "sourceImageOutside"], //map_Kd textures/ViewerPhoneOutside.jpg
    [877, 1194, 247, 255, "sourceImageOutside"], //map_Kd textures/RightSideOutsideFit_1.jpg
    [1123, 1153, 413, 295, "sourceImageOutside"], //map_Kd textures/ViewerBottomMainOutside_1.jpg
    [1536, 1194, 243, 254, "sourceImageOutside"], //map_Kd textures/LeftSideOutsideFit.jpg
    [1783, 824, 405, 251, "sourceImageOutside"], //map_Kd textures/LensOutsideFit.jpg
    [677, 903, 418, 250, "sourceImageInside"], //map_Kd textures/ViewerPhoneInside.jpg
    [231, 1087, 238, 107, "sourceImageInside"], //map_Kd textures/NoseInsideFit.jpg
    [1746, 1087, 238, 107, "sourceImageOutside"], //map_Kd textures/NoseOutsideFit.jpg
    [436, 1194, 243, 254, "sourceImageInside"], //map_Kd textures/LeftSideInsideFit.jpg
    [1092, 1194, 247, 255, "sourceImageInside"], //map_Kd textures/RightSideInsideFit.jpg
    [679, 1153, 413, 295, "sourceImageInside"], //map_Kd textures/ViewerBottomMainInside.jpg
    [1339, 1194, 410, 255, "sourceImageInside"], //map_Kd textures/TopInsideFit.jpg
    [677, 800, 418, 103, "sourceImageInside"], //map_Kd textures/ViewerLugInside.jpg
    [27, 824, 405, 251, "sourceImageInside"] //map_Kd textures/LensInsideFit.jpg    
  ], [ //CBEnvelop
    [136, 47, 694, 231, "sourceImageOutside"], //map_Kd textures/EnvelopeOutsideFlap.jpg
    [-35, -204, 0, 0, "sourceImageInside"], //
    [-35, -204, 0, 0, "sourceImageInside"], //map_Kd textures/texture.jpg
    [136, 725, 694, 41, "sourceImageOutside"], //map_Kd textures/EnvelopeOutsideBottom.jpg
    [136, 323, 694, 402, "sourceImageOutside"], //map_Kd textures/EnvelopeOutsideFront.jpg
    [136, 766, 694, 399, "sourceImageOutside"], //map_Kd textures/EnvelopeOutsideBack.jpg
    [136, 277, 694, 46, "sourceImageOutside"], //map_Kd textures/EnvelopeOutsideTop.jpg
    [98, 769, 39, 396, "sourceImageOutside"], //map_Kd textures/EnvelopeOutsideRight.jpg
    [830, 769, 39, 396, "sourceImageOutside"] //map_Kd textures/EnvelopeOutsideLeft.jpg
  ], [ //CBEnvelopeOpened
    [1347, 769, 39, 396, "sourceImageInside"], //map_Kd textures/EnvelopeInsideLeft.jpg
    [830, 769, 39, 396, "sourceImageOutside"], //map_Kd textures/EnvelopeOutsideLeft.jpg
    [2079, 769, 39, 396, "sourceImageInside"], //map_Kd textures/EnvelopeInsideRight.jpg
    [98, 769, 39, 396, "sourceImageOutside"], //map_Kd textures/EnvelopeOutsideRight.jpg
    [2118, 769, 89, 396, "sourceImageInside"], //map_Kd textures/EnvelopeInsideSmallLug.jpg
    [9, 769, 89, 396, "sourceImageOutside"], //map_Kd textures/EnvelopeOutsideSmallLug.jpg
    [136, 766, 694, 399, "sourceImageOutside"], //map_Kd textures/EnvelopeOutsideBack.jpg
    [1385, 766, 694, 399, "sourceImageInside"], //map_Kd textures/EnvelopeInsideBack.jpg
    [869, 769, 252, 396, "sourceImageOutside"], //map_Kd textures/EnvelopeOutsideBigLug.jpg
    [1095, 769, 252, 396, "sourceImageInside"], //map_Kd textures/EnvelopeInsideBigLug.jpg
    [136, 323, 694, 402, "sourceImageOutside"], //map_Kd textures/EnvelopeOutsideFront.jpg
    [1385, 323, 694, 402, "sourceImageInside"], //map_Kd textures/EnvelopeInsideFront.jpg
    [1385, 725, 694, 41, "sourceImageInside"], //map_Kd textures/EnvelopeInsideBottom.jpg
    [136, 725, 694, 41, "sourceImageOutside"], //map_Kd textures/EnvelopeOutsideBottom.jpg
    [1385, 277, 694, 46, "sourceImageInside"], //map_Kd textures/EnvelopeInsideTop.jpg
    [136, 277, 694, 46, "sourceImageOutside"], //map_Kd textures/EnvelopeOutsideTop.jpg
    [136, 47, 694, 231, "sourceImageOutside"], //map_Kd textures/EnvelopeOutsideFlap.jpg
    [1385, 47, 694, 231, "sourceImageInside"], //map_Kd textures/EnvelopeInsideFlap.jpg
    [-35, -204, 0, 0, "sourceImageInside"] //map_Kd textures/texture.jpg
  ]
]

//Offset Elanders
//Size on what the template below is based on: 2362 x 1772
//Ratio of 1.333333333
const offsetslices = [
  [ //CBViewer
    //X,	Y,	Height,	Width, Template Side based on an iamge of 9448 x 7087px
    [1158, 1004, 413, 648, "sourceImageOutside"],
    [696, 1004, 413, 648, "sourceImageInside"],
    [1818, 1028, 405, 251, "sourceImageOutside"],
    [44, 1028, 405, 251, "sourceImageInside"],
    [1781, 1291, 238, 107, "sourceImageOutside"],
    [248, 1291, 238, 107, "sourceImageInside"],
    [502, 1398, 410, 255, "sourceImageOutside"],
    [1356, 1398, 410, 255, "sourceImageInside"],
    [912, 1398, 247, 255, "sourceImageOutside"],
    [1109, 1398, 247, 255, "sourceImageInside"],
    [1571, 1398, 243, 254, "sourceImageOutside"],
    [453, 1398, 243, 254, "sourceImageInside"],
    [0, 0, 0, 0, "sourceImageInside"]
  ], [ //CBViewerClosed
    [0, 0, 0, 0, "sourceImageInside"],
    [1156, 1004, 418, 103, "sourceImageOutside"],
    [502, 1398, 410, 255, "sourceImageOutside"],
    [1156, 1107, 418, 250, "sourceImageOutside"],
    [912, 1398, 247, 255, "sourceImageOutside"],
    [1158, 1357, 413, 295, "sourceImageOutside"],
    [1571, 1398, 243, 254, "sourceImageOutside"],
    [1818, 1028, 405, 251, "sourceImageOutside"],
    [694, 1107, 418, 250, "sourceImageInside"],
    [248, 1291, 238, 107, "sourceImageInside"],
    [1781, 1291, 238, 107, "sourceImageOutside"],
    [453, 1398, 243, 254, "sourceImageInside"],
    [1109, 1398, 247, 255, "sourceImageInside"],
    [696, 1357, 413, 295, "sourceImageInside"],
    [1356, 1398, 410, 255, "sourceImageInside"],
    [694, 1004, 418, 103, "sourceImageInside"],
    [44, 1028, 405, 251, "sourceImageInside"]
  ], [ //CBEnvelop
    [171, 251, 694, 231, "sourceImageOutside"],
    [0, 0, 0, 0, "sourceImageInside"],
    [0, 0, 0, 0, "sourceImageInside"],
    [171, 929, 694, 41, "sourceImageOutside"],
    [171, 527, 694, 402, "sourceImageOutside"],
    [171, 970, 694, 399, "sourceImageOutside"],
    [171, 481, 694, 46, "sourceImageOutside"],
    [133, 973, 39, 396, "sourceImageOutside"],
    [865, 973, 39, 396, "sourceImageOutside"]
  ], [ //CBEnvelopeOpened
    [1364, 973, 39, 396, "sourceImageInside"],
    [865, 973, 39, 396, "sourceImageOutside"],
    [2096, 973, 39, 396, "sourceImageInside"],
    [133, 973, 39, 396, "sourceImageOutside"],
    [2135, 973, 89, 396, "sourceImageInside"],
    [44, 973, 89, 396, "sourceImageOutside"],
    [171, 970, 694, 399, "sourceImageOutside"],
    [1402, 970, 694, 399, "sourceImageInside"],
    [904, 973, 252, 396, "sourceImageOutside"],
    [1112, 973, 252, 396, "sourceImageInside"],
    [171, 527, 694, 402, "sourceImageOutside"],
    [1402, 527, 694, 402, "sourceImageInside"],
    [1402, 929, 694, 41, "sourceImageInside"],
    [171, 929, 694, 41, "sourceImageOutside"],
    [1402, 481, 694, 46, "sourceImageInside"],
    [171, 481, 694, 46, "sourceImageOutside"],
    [171, 251, 694, 231, "sourceImageOutside"],
    [1402, 251, 694, 231, "sourceImageInside"],
    [0, 0, 0, 0, "sourceImageInside"]
  ]
]

// const slices = digitalslices

// --------------------------------------------------------
// ----------------- Initiation of Scene  -----------------
// --------------------------------------------------------

// Initate Renderer, Scenes, Views, Lights
for (let ii = 0; ii < views.length; ++ii) {

  // Create a Full Screen WebGL Renderer
  renderer[ii] = new THREE.WebGLRenderer({
    canvas: document.querySelector('#canvas'),
    antialias: true,
    alpha: true
  });
  renderer[ii].setPixelRatio(window.devicePixelRatio);
  renderer[ii].setSize(window.innerWidth, window.innerHeight);

  scene[ii] = new THREE.Scene();

  // Add ambientLight
  ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene[ii].add(ambientLight);

  //Initate Lights
  for (let kk = 0; kk < lights[ii].length; ++kk) {
    const plight = new THREE.PointLight(lights[ii][kk].color, lights[ii][kk].intensity, 1000)
    plight.position.set(
      lights[ii][kk].spawnPosition.x,
      lights[ii][kk].spawnPosition.y,
      lights[ii][kk].spawnPosition.z);
    scene[ii].add(plight);
  }
  // Initate Views
  const camera = new THREE.PerspectiveCamera(views[ii].fov, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.fromArray(views[ii].eye);
  views[ii].camera = camera;
}

function initateModels() {
  for (let jj = 0; jj < models.length; ++jj) {
    let myObjPromise = loadObj('./default/' + models[jj].name);
    myObjPromise.then(object => {
      let modelCounter = jj
      let childCounter = 0
      object.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.material.map = texloader.load(textures[modelCounter][childCounter]);
          childCounter++
        }
      })

      object.scale.x = object.scale.y = object.scale.z = models[0].scaleFactor;
      object.position.x = models[jj].spawnPosition.x;
      object.position.y = models[jj].spawnPosition.y;
      object.position.z = models[jj].spawnPosition.z;
      object.rotation.x = models[jj].spawnRotation.x;
      object.rotation.y = models[jj].spawnRotation.y;
      object.rotation.z = models[jj].spawnRotation.z;
      models[jj].object = object
      scene[jj].add(object);
    });
  }
}

function loadObj(path) {
  return new Promise(function (resolve) {
    let mtlLoader = new MTLLoader(manager)
    mtlLoader.load(path + '.mtl', function (materials) {
      materials.preload();
      let objLoader = new OBJLoader(manager);
      objLoader.setMaterials(materials),
        objLoader.load(path + ".obj", resolve);
    });
  });
}

function sessionHandler() {
  let fullURL = document.location.href;
  let pattern = 'sId='
  let result = fullURL.search(pattern);
  if (result > 0 && sessionID == 'default') { //sessionID exists
    sessionID = fullURL.substr(result + 4, fullURL.length);
    // console.log(`sessionID already existing: ${sessionID}`);
  } else if (sessionID == 'default') { //sessionID does not exist
    sessionID = Math.random().toString(36).substr(2, 9);
    window.history.replaceState(null, null, "?sId=" + sessionID);
    // console.log(`sessionID ${sessionID} created and URL updated`);
  }
  return sessionID
}

// ----------------- ----------------------------------------
// ----------------- Handle Custom Textures -----------------
// ----------------- ----------------------------------------

// Upload Custom Texture file
document.getElementById("loadCustomTextureFileOutside").addEventListener('change', (e) => {
  let uploadedTextureURLOutside = URL.createObjectURL(e.target.files[0]);

  let imgOutside = document.getElementById("sourceImageOutside")
  imgOutside.src = uploadedTextureURLOutside
  document.getElementById("sourceImageDiv").appendChild(imgOutside)
});

document.getElementById("loadCustomTextureFileInside").addEventListener('change', (e) => {
  let uploadedTextureURLInside = URL.createObjectURL(e.target.files[0]);

  let imgInside = document.getElementById("sourceImageInside")
  imgInside.src = uploadedTextureURLInside
  document.getElementById("sourceImageDiv").appendChild(imgInside)
});

function getPrintingType() {
  let ratio = document.getElementById("sourceImageOutside").width / document.getElementById("sourceImageOutside").height
  //Digital ratio of 1.414949689
  //Offset ratio of 1.33333333
  if (ratio < 1.4) {
    printingType = "Offset"
  } else {
    printingType = "Digital"
  }
  console.log(`printingType: ${printingType}`)
  return printingType
}

function getTextureResolution() {
  let refImage = document.getElementById("sourceImageOutside").width

  if (printingType == "Offset") {
    // Offset 2362 x 1772
    baseResolution = 2362
  } else {
    // Digital 2213 x 1564
    baseResolution = 2213
  }

  textureResolution = refImage / baseResolution
  console.log(`textureResolution: ${textureResolution}`)
  return textureResolution
}

function sliceSourceImage() {
  if (printingType == "Offset") {
    slices = offsetslices
  } else {
    slices = digitalslices
  }

  let sliceCanvas = []
  let ctx = []
  let sliceCanvasCoutner = 0

  // Loop through models
  for (let jj = 0; jj < models.length; ++jj) {

    // Loop through textures
    for (let kk = 0; kk < slices[jj].length; ++kk) {

      // Create new canvas to slice in
      sliceCanvas[sliceCanvasCoutner] = document.createElement("canvas")
      sliceCanvas[sliceCanvasCoutner].width = slices[jj][kk][2] * textureResolution
      sliceCanvas[sliceCanvasCoutner].height = slices[jj][kk][3] * textureResolution
      ctx[sliceCanvasCoutner] = sliceCanvas[sliceCanvasCoutner].getContext("2d")

      // Slice source images
      ctx[sliceCanvasCoutner].drawImage(document.getElementById(slices[jj][kk][4]),

        slices[jj][kk][0] * textureResolution,
        slices[jj][kk][1] * textureResolution,
        slices[jj][kk][2] * textureResolution,
        slices[jj][kk][3] * textureResolution,
        0,
        0,
        slices[jj][kk][2] * textureResolution,
        slices[jj][kk][3] * textureResolution);

      // Update  textures array
      textures[jj][kk] = sliceCanvas[sliceCanvasCoutner].toDataURL()

      sliceCanvasCoutner++
    }
  }
}

function initiateTextures() {
  sessionID = sessionHandler()

  let textureOnServer = false
  textureOnServer = CheckUrl('./' + sessionID + '/Outside.jpg')

  if (textureOnServer) {
    loadExistingTextures(sessionID);
  } else {
    loadExistingTextures('default')
  }
}

function updateTextures() {
  sessionID = sessionHandler()
  printingType = getPrintingType()
  textureResolution = getTextureResolution()
  sliceSourceImage();
  removeAllModels();
  initateModels(sessionID);
}

function CheckUrl(url) {
  let http = new XMLHttpRequest();
  http.open('HEAD', url, false);
  http.send();
  console.log(`Result of url check: ${http.status}`)
  return http.status != 404;
}

function loadExistingTextures(sessionID) {
  // Outside
  let imgOutside = document.createElement("img");
  imgOutside.id = "sourceImageOutside"
  imgOutside.src = './' + sessionID + '/Outside.jpg'
  document.getElementById("sourceImageDiv").appendChild(imgOutside)

  // Inside
  let imgInside = document.createElement("img");
  imgInside.id = "sourceImageInside"
  imgInside.src = './' + sessionID + '/Inside.jpg'
  document.getElementById("sourceImageDiv").appendChild(imgInside)
}

document.querySelector('#updateTextures').addEventListener('click', () => {
  updateTextures()
})

function removeAllModels() {
  // INFO: This only works because there are same amount of models as views
  for (let jj = 0; jj < models.length; ++jj) {
    let object = models[jj].object
    scene[jj].remove(object);
  }
}

// ----------------- --------------------------------------
// ----------------- Animation & Renderer -----------------
// ----------------- --------------------------------------

// OrbitControls
for (let ii = 0; ii < views.length; ++ii) {
  controls[ii] = new OrbitControls(views[ii].camera, renderer[ii].domElement);
}

// Disable rotation if mouse is over
window.addEventListener('mousedown', onMouseDown);
window.addEventListener('mouseup', onMouseUp);

function onMouseDown() {
  isMouseDown = true;
}

function onMouseUp() {
  isMouseDown = false;
}

function updateSize() {
  if (windowWidth != window.innerWidth || windowHeight != window.innerHeight) {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    renderer[0].setSize(windowWidth, windowHeight);
  }
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  updateSize();

  for (let ii = 0; ii < views.length; ++ii) {
    const view = views[ii];
    const camera = view.camera;

    const left = Math.floor(windowWidth * view.left);
    const bottom = Math.floor(windowHeight * view.bottom + document.getElementById("topcontainer").clientHeight / 2);
    const width = Math.floor(windowWidth * view.width);
    const height = Math.floor(windowHeight * view.height);

    renderer[0].setViewport(left, bottom, width, height);
    renderer[0].setScissor(left, bottom, width, height);
    renderer[0].setScissorTest(true);
    renderer[0].setClearColor(view.background);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer[0].render(scene[ii], camera);
  }
  for (let jj = 0; jj < models.length; ++jj) {
    if (!isMouseDown) {
      models[jj].object.rotation.y += 0.02
      // models[jj].object.rotation.x = 
    }
  }
}
initiateTextures();

window.onload = function () {
  // initateModels(sessionID)
  updateTextures(sessionID)
};

animate();