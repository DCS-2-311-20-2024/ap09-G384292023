//
// 応用プログラミング 第9回 自由課題 (ap0901.js)
//  G384292023 金尾駿太郎
// $Id$
//
"use strict"; // 厳格モード

// ライブラリをモジュールとして読み込む
import * as THREE from "three";
import { CSS3DRenderer, CSS3DObject } from "three/addons"
import { GLTFLoader } from "three/addons";
import { GUI } from "ili-gui";

// ３Ｄページ作成関数の定義
function init() {
  // 制御変数の定義
  const param = {
    drone: false,
    w: 0.6, h: 0.1, d: 0.6,
    nRow: 4, nCol: 11, gapX: 0.1, gapY: 0.3, gapZ: 0.4
  };

  const gui = new GUI();
  gui.add(param, "drone").name("ドローン");

  // シーン作成
  const scene = new THREE.Scene();
  // カメラの作成
  const camera1 = new THREE.PerspectiveCamera(
    50, 7 / 5, 0.1, 1000);
  {
    camera1.position.set(0, 10, 0);
    camera1.lookAt(0, 0, -2.1);
  }
  // 第2のカメラ
  const camera2 = new THREE.PerspectiveCamera(
    100, 1 / 2, 0.1, 1000);
  {
    camera2.position.set(0, 30, 6);
    camera2.rotation.y = Math.PI / 2;
    camera2.lookAt(0, 0, 6);
  }


  // 第1のレンダラ
  const nameHeight = document.getElementById("output1").clientHeight;
  const renderer = new THREE.WebGLRenderer();

  renderer.setClearColor(0x204060);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(
    0.7 * window.innerWidth,
    0.5 * window.innerWidth);
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.zIndex = 1;
  renderer.domElement.style.top = nameHeight;
  // 第2のレンダラ
  const renderer2 = new THREE.WebGLRenderer();
  renderer2.setClearColor("#1f1f1f");
  renderer2.setPixelRatio(window.devicePixelRatio);
  renderer2.setSize(
    0.3 * window.innerWidth,
    0.6 * window.innerWidth
  );
  renderer2.domElement.style.position = "absolute";
  renderer2.domElement.style.zIndex = 1000;
  renderer2.domElement.style.top = nameHeight;

  const renderer3 = new THREE.WebGLRenderer();
  renderer3.setClearColor("#ffffff");
  renderer3.setPixelRatio(window.devicePixelRatio);
  renderer3.setSize(
    0.3 * window.innerWidth,
    0.6 * window.innerWidth
  );
  renderer3.domElement.style.position = "absolute";
  renderer3.domElement.style.zIndex = 1000;
  renderer3.domElement.style.top = nameHeight;


  // CSS3Dレンダラ
  const cssRenderer = new CSS3DRenderer();
  {
    cssRenderer.setSize(
      0.7 * window.innerWidth,
      0.5 * window.innerWidth);
    cssRenderer.domElement.style.position = "absolute";
    cssRenderer.domElement.style.zIndex = 0;
    cssRenderer.domElement.style.top = nameHeight;
  }



  // 光源の設定
  { // 環境ライト
    const light = new THREE.AmbientLight();
    light.intensity = 0.4;
    scene.add(light);
  }
  { // ポイントライト
    const light = new THREE.PointLight(0xffffff, 500);
    light.position.set(0, 2, 5);
    scene.add(light);
  }
  // スクリーン
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(25, 10),
    new THREE.MeshBasicMaterial({
      color: "Black",
      opacity: 0.0,
      blending: THREE.NoBlending,
      side: THREE.DoubleSide
    })
  )
  screen.position.set(0, 0, -2.1);
  scene.add(screen);
  // 床天井の作成
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(25, 30),
    new THREE.MeshBasicMaterial({ color: "#1f1f1f" })
  )
  const plane2 = new THREE.Mesh(
    new THREE.PlaneGeometry(25, 30),
    new THREE.MeshBasicMaterial({ color: "#1f1f1f" })
  )
  plane.rotateX(-Math.PI / 2);
  plane2.rotateX(Math.PI / 2);
  plane.position.set(0, -5, 13);
  plane2.position.set(0, 4.8, 13);
  scene.add(plane);
  scene.add(plane2);
  // 壁の生成
  const sidewallMaterial = new THREE.MeshPhongMaterial({ color: "#1f1f1f" });
  const sidewall = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 10, 30), sidewallMaterial);
  sidewall.position.set(-12.4, 0, 13);
  scene.add(sidewall);
  const sidewallMaterial2 = new THREE.MeshPhongMaterial({ color: "#1f1f1f" });
  const sidewall2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 10, 30), sidewallMaterial2);
  sidewall2.position.set(12.4, 0, 13);
  scene.add(sidewall2);
  const frontwallMaterial = new THREE.MeshPhongMaterial({ color: "#1f1f1f" });
  const frontwall = new THREE.Mesh(
    new THREE.BoxGeometry(5, 10, 3), frontwallMaterial
  );
  frontwall.position.set(10, 0, -0.5);
  scene.add(frontwall);

  const frontwall2 = new THREE.Mesh(
    new THREE.BoxGeometry(5, 10, 3), frontwallMaterial
  );
  frontwall2.position.set(-10, 0, -0.5);
  scene.add(frontwall2);

  const backwall = new THREE.Mesh(
    new THREE.BoxGeometry(25, 10, 0.1), sidewallMaterial);
  backwall.position.set(0, 0, 28);
  scene.add(backwall);
  // 角度壁の生成
  const triangle = new THREE.Mesh(
    new THREE.BoxGeometry(3, 10, 0.1), frontwallMaterial
  );
  triangle.rotation.y = Math.PI / 2.9
  triangle.position.set(-7, 0, -0.7);
  scene.add(triangle);
  const triangle2 = new THREE.Mesh(
    new THREE.BoxGeometry(3, 10, 0.1), frontwallMaterial
  );
  triangle2.rotation.y = -Math.PI / 2.9
  triangle2.position.set(7, 0, -0.7);
  scene.add(triangle2);

  const triangle3 = new THREE.Mesh(
    new THREE.BoxGeometry(4.5, 10, 0.1), frontwallMaterial
  );
  triangle3.rotation.y = -Math.PI / 2.9
  triangle3.position.set(11.4, 0, 3
  );
  scene.add(triangle3);

  const triangle4 = new THREE.Mesh(
    new THREE.BoxGeometry(4.5, 10, 0.1), frontwallMaterial
  );
  triangle4.rotation.y = Math.PI / 2.9
  triangle4.position.set(-11.4, 0, 3
  );
  scene.add(triangle4);



  const frontwall3 = new THREE.Mesh(
    new THREE.BoxGeometry(20, 1, 3), frontwallMaterial
  );
  frontwall3.position.set(0, 4.5, -0.5);
  scene.add(frontwall3);
  //ステージの作成
  const stageMaterial = new THREE.MeshLambertMaterial({ color: "gray" });
  const stage = new THREE.Mesh(
    new THREE.BoxGeometry(25, 1, 7), stageMaterial
  );
  stage.position.set(0, -4.5, 1.5);
  scene.add(stage);

  const stage2 = new THREE.Mesh(
    new THREE.BoxGeometry(3, 1, 12), stageMaterial
  );
  stage2.position.set(0, -4.5, 4);
  scene.add(stage2);

  const stage3 = new THREE.Mesh(
    new THREE.CylinderGeometry(4, 4, 1, 6, 1), stageMaterial
  );
  stage3.position.set(0, -4.5, 13);
  scene.add(stage3);
  // ダミー
  function makeDummy(color) {
    const dummy = new THREE.Group();
    {
      const dhead = new THREE.Mesh(
        new THREE.SphereGeometry(0.15, 12, 12),
        new THREE.MeshLambertMaterial({ color: color })
      )
      dummy.add(dhead);
      const dbody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 0.3, 12, 1),
        new THREE.MeshLambertMaterial({ color: color })
      )
      dbody.position.set(0, -0.3, 0);
      dummy.add(dbody);
    }
    return dummy;
  }

  // 椅子
  const chair2 = new THREE.Group();
  const chairMaterial2 = new THREE.MeshLambertMaterial({ color: "#3d3d3d" });
  const ch3 = new THREE.Mesh(
    new THREE.BoxGeometry(param.w, param.h, param.d),
    chairMaterial2);
  ch3.position.set(0, 0.3, 0);
  chair2.add(ch3);
  const ch4 = new THREE.Mesh(
    new THREE.BoxGeometry(param.w, param.d, param.h),
    chairMaterial2);
  ch4.position.set(0, 0.3 + (param.h + param.d) / 2, (param.d + param.h) / 2);
  chair2.add(ch4);
  // コーナーシート
  const cornerSeats1 = new THREE.Group();
  for (let cornerSeatCount = 10; cornerSeatCount > 5; cornerSeatCount--)
    for (let a = 0; a <= cornerSeatCount; a++) {
      const angle = (Math.PI / 2) * -(a / cornerSeatCount);
      if (Math.random() < 0.3) {
        const dummy = makeDummy("white");
        dummy.position.set(
          (Math.cos(Math.PI / 2 + angle)) * cornerSeatCount + 1,
          -3.7,
          (Math.sin(Math.PI / 2 + angle)) * cornerSeatCount + 12
        )
        cornerSeats1.add(dummy);
      }
      const seat1 = chair2.clone();
      seat1.rotation.y = -angle;
      seat1.position.set(
        (Math.cos(Math.PI / 2 + angle)) * cornerSeatCount + 1,
        -4.6,
        (Math.sin(Math.PI / 2 + angle)) * cornerSeatCount + 12
      );
      cornerSeats1.add(seat1);
    }
  scene.add(cornerSeats1);
  const cornerSeats2 = new THREE.Group();
  for (let cornerSeatCount = 10; cornerSeatCount > 5; cornerSeatCount--)
    for (let a = 0; a <= cornerSeatCount; a++) {
      const angle = (Math.PI / 2) * +(a / cornerSeatCount);
      if (Math.random() < 0.3) {
        const dummy = makeDummy("white");
        dummy.position.set(
          (Math.cos(Math.PI / 2 + angle)) * cornerSeatCount - 1,
          -3.7,
          (Math.sin(Math.PI / 2 + angle)) * cornerSeatCount + 12
        );
        cornerSeats2.add(dummy);
      }
      const seat2 = chair2.clone();
      seat2.rotation.y = -angle;
      seat2.position.set(
        (Math.cos(Math.PI / 2 + angle)) * cornerSeatCount - 1,
        -4.6,
        (Math.sin(Math.PI / 2 + angle)) * cornerSeatCount + 12
      );
      cornerSeats2.add(seat2);
    }
  scene.add(cornerSeats2);

  // アバターの生成
  const avatar = makeDummy("white");
  setAvatar(
    new THREE.Vector3(6.7,
      -4.6,
      3 * (param.d + param.gapZ) + 14.7)
  )
  scene.add(avatar);

  // アバターの移動
  function setAvatar(position) {
    avatar.position.copy(position);
    avatar.position.y += 0.95;
    camera1.position.copy(avatar.position);
    camera1.lookAt(0, 0, 0
    );
    camera1.updateProjectionMatrix();
  }

  // CSS3D表示のための設定
  // iframe要素の生成
  const iframe = document.createElement("iframe");
  iframe.style.width = "1000px";
  iframe.style.height = "650px";
  iframe.style.border = "1000px";
  iframe.src = "https://www.youtube.com/embed/QI9gpOPLTeE?mute=1&autoplay=1&controls=0&loop=1&playlist=QI9gpOPLTeE";
  + "&mute=1&autoplay=1&controls=0"
    + "&loop=1&playlist=w23RIKTYF28,-9pMuSNlN6A";

  // CSSオブジェクトの生成
  const cssObject = new CSS3DObject(iframe);
  cssObject.scale.x *= 8 / 640;
  cssObject.scale.y *= 8 / 640;
  cssObject.position.z = -2.1;
  scene.add(cssObject);

  // レンダラーの配置
  document.getElementById("output1").appendChild(cssRenderer.domElement);
  document.getElementById("output1").appendChild(renderer.domElement);
  document.getElementById("right").appendChild(renderer2.domElement);

  // シート選択のための設定
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  function onMouseDown(event) {
    // マウスの位置を±1の範囲に変換
    mouse.x = (event.clientX / window.innerWidth - 0.7) * 20 / 3 - 1;
    if (mouse.x < -1) {
      mouse.x = -1;
    }
    mouse.y = -(event.clientY / (window.innerWidth * 0.6)) * 2 + 1;
    raycaster.setFromCamera(mouse, camera2);



    // 全ての座席について
    cornerSeats1.children.forEach((seat1) => {
      const intersects = raycaster.intersectObject(seat1, true);
      if (intersects.length > 0) {
        setAvatar(intersects[0].object.parent.position);
        setAvatar(seat1.position);
      }
    });
    cornerSeats2.children.forEach((seat2) => {
      const intersects = raycaster.intersectObject(seat2, true);
      if (intersects.length > 0) {
        setAvatar(intersects[0].object.parent.position);
        setAvatar(seat2.position);
      }
    });
  }
  window.addEventListener("mousedown", onMouseDown, false);
  const beamlight = new THREE.Group();
  let color = { 1: "red", 2: "brue", 3: "green", 4: "yellow", 5: "snow", 6: "orange" };
  let random = Math.floor(Math.random() * 6) + 1;
  let randomcolor = color[random];
  for (let i = 10; i >= 0; i--) {
    const beamMaterial = new THREE.MeshBasicMaterial({ color: randomcolor, opacity: i / 20, transparent: true });
    const beamGeometry = new THREE.ConeGeometry(2 - i / 5, 5, 32);
    const beam = new THREE.Mesh(beamGeometry, beamMaterial);
    beam.position.set(0, i, -2.5);
    beamlight.add(beam);
  }
  const beamlight1 = beamlight.clone();
  beamlight1.position.set(5, 0, 2);
  beamlight1.rotation.z = -(Math.PI / 2) - (Math.PI / 4);
  beamlight1.rotation.y = 6;
  beamlight1.rotation.x = -0.5
  scene.add(beamlight1);
  const beamlight2 = beamlight.clone();
  beamlight2.position.set(-5, 0, 2);
  beamlight2.rotation.z = (Math.PI / 2) + (Math.PI / 4);
  beamlight2.rotation.y = -6;
  beamlight2.rotation.x = -0.5
  scene.add(beamlight2);

  //ドローンの作成
  let drone;
  function loadModel() {
    const loader = new GLTFLoader();
    loader.load(
      "drone.glb",
      (gltf) => {
        drone = gltf.scene;
        scene.add(drone);
      }
    );
  }
  loadModel();


  const controlPoints = [
    [-8, -2, 6],
    [-7, 1, 24],
    [7, 1.5, 25],
    [7, 0, 14],
    [8, -3, 8],
    [-3, 1, 8],
    [-3, 2, 15],
    [3, 1, 16],
    [3.5, 1.5, 7],
  ]
  // コースの補間
  const p0 = new THREE.Vector3();
  const p1 = new THREE.Vector3();
  const course = new THREE.CatmullRomCurve3(
    controlPoints.map((p, i) => {
      p0.set(...p);
      p1.set(...controlPoints[(i + 1) % controlPoints.length]);
      return [
        (new THREE.Vector3()).copy(p0),
        (new THREE.Vector3()).lerpVectors(p0, p1, 1 / 3),
        (new THREE.Vector3()).lerpVectors(p0, p1, 2 / 3),
      ]
    }).flat(), true
  );
  // コースの描画
  const points = course.getPoints(200);

  const clock = new THREE.Clock();
  const dronePosition = new THREE.Vector3();
  const droneTarget = new THREE.Vector3();
  const cameraPosition = new THREE.Vector3();
  const screenPosition = new THREE.Vector3(0, 0, -2.1);
  // 描画関数
  function render() {
    if (!drone) {
      requestAnimationFrame(render);
      return;
    }
    const elapsedTime = clock.getElapsedTime() / 30;
    course.getPointAt(elapsedTime % 1, dronePosition);
    drone.position.copy(dronePosition);
    course.getPointAt((elapsedTime + 0.01) % 1, droneTarget);
    drone.lookAt(screenPosition);

    // カメラの切り替え
    if (param.drone) {
      cameraPosition.lerpVectors(droneTarget, dronePosition, 4);
      cameraPosition.y += 2.5;
      camera1.position.copy(cameraPosition);
      camera1.lookAt(screenPosition);
      camera1.up.set(0, 1, 0);
  } else {
      camera1.position.copy(avatar.position);
      camera1.position.y += 1.0;
      camera1.lookAt(new THREE.Vector3(0, 0, 0));
      camera1.updateProjectionMatrix();
  }

  renderer.render(scene, camera1);
  requestAnimationFrame(render);
  }
  if (!param.drone) {
    camera1.position.copy(avatar.position);
    camera1.position.y += 1.0;
    camera1.lookAt(new THREE.Vector3(0, 0, 0));
    camera1.updateProjectionMatrix();
}

  // 描画処理
  function update(time) {
    render();
    cssRenderer.render(scene, camera1);
    renderer.render(scene, camera1);
    renderer2.render(scene, camera2);
    renderer3.render(scene, camera1);
    requestAnimationFrame(update);
  }

  // 描画開始
  requestAnimationFrame(update);
  requestAnimationFrame(render);
}

document.onload = init();