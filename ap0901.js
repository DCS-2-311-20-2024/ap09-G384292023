//
// 応用プログラミング 第9,10回 自由課題 (ap0901.js)
// G384292023 金尾駿太郎
//
"use strict"; // 厳格モード

// ライブラリをモジュールとして読み込む
import * as THREE from "three";
import { OrbitControls } from 'three/addons';
import { GUI } from "ili-gui";

// ３Ｄページ作成関数の定義
function init() {
  // 制御変数の定義
  const param = {
    axes: true, // 座標軸
    w: 0.6, h: 0.1, d: 0.6,
    nRow: 10, nCol: 55, gapX: 0.3, gapY: 0.3, gapZ: 0.4
  };

  // GUIコントローラの設定
  const gui = new GUI();
  gui.add(param, "axes").name("座標軸");

  // シーン作成
  const scene = new THREE.Scene();
 // スクリーンの作成
  const screenMaterial = new THREE.MeshBasicMaterial({color: 0x1A1A1A})
  const screen = new THREE.Mesh(
    new THREE.BoxGeometry(1.,30,45),
    screenMaterial);
    screen.position.set(0,15,-40);
    screen.rotation.y = Math.PI/2;
    scene.add(screen);
    // 土台の作成
  const wall = new THREE.Group();
  const wallMaterial = new THREE.MeshBasicMaterial({color: 0x1A1A1A});
  const dodai = new THREE.Mesh(
    new THREE.BoxGeometry(1,3,2),
    wallMaterial);
    dodai.position.set(0,-1.5,0);
    wall.add(dodai);
  // 椅子の生成
  const chair = new THREE.Group();
    const chairMaterial = new THREE.MeshBasicMaterial({ color: 0xfff8dc});
    const ch1 = new THREE.Mesh(
      new THREE.BoxGeometry(param.w, param.h, param.d),
      chairMaterial);
    ch1.position.set(0, 0.3, 0);
    chair.add(ch1);
    const ch2 = new THREE.Mesh(
      new THREE.BoxGeometry(param.w, param.d, param.h),
      chairMaterial);
    ch2.position.set(0, 0.3 + (param.h + param.d) / 2, (param.d + param.h) / 2);
    chair.add(ch2);
    // 椅子の作成2
    const chair2 = new THREE.Group();
      const chairMaterial2 = new THREE.MeshLambertMaterial({ color: 0xffffff});
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
        
  // 座席の生成1
  const seats = new THREE.Group();
  for (let r = 0; r < param.nRow; r++)
    for (let c = 14; c < param.nCol-14; c++) {
      const kabe = wall.clone();
      const seat = chair.clone();
      seat.position.set(
        (param.w + param.gapX)*(c-(param.nCol - 1)/2),
        (param.gapY)*r+3,
        (param.d + param.gapZ)*(r+19.5)
      )
      kabe.position.set(
        (param.w + param.gapX)*(c-(param.nCol - 1)/2),
        (param.gapY)*r+3,
        (param.d + param.gapZ)*(r+20)
      )
      seats.add(seat);
      seats.add(kabe);
    }
  scene.add(seats);

  // 座席の生成2
  const seats2 = new THREE.Group();
  for (let r = 0; r < param.nRow; r++) 
    for (let c = 0; c < param.nCol; c++) {
      const seat = chair.clone();
      const kabe = wall.clone();
      seat.rotation.y = Math.PI/2;
      seat.position.set(
        (param.d + param.gapZ)*(r+13),
        (param.gapY)*r+3,
        (param.w + param.gapX)*(c-(param.nCol - 1)/2-7)
      )
      kabe.position.set(
        (param.d + param.gapZ)*(r+13),
        (param.gapY)*r+3,
        (param.w + param.gapX)*(c-(param.nCol - 1)/2-7)
      )
      seats2.add(seat);
      seats2.add(kabe)
    }
  scene.add(seats2);

  // 座席の生成3
  const seats3 = new THREE.Group();
  for (let r = 0; r < param.nRow; r++)
    for (let c = 0; c < param.nCol; c++) {
      const seat = chair.clone();
      const kabe = wall.clone();
      seat.rotation.y = -Math.PI/2;
      seat.position.set(
        -((param.d + param.gapZ)*(r+13)),
        (param.gapY)*r+3,
        (param.w + param.gapX)*(c-(param.nCol - 1)/2-7)
      )
      kabe.position.set(
        -((param.d + param.gapZ)*(r+13)),
        (param.gapY)*r+3,
        (param.w + param.gapX)*(c-(param.nCol - 1)/2-7)
      )
      seats3.add(seat);
      seats3.add(kabe);
    }
  scene.add(seats3);
  // 座席の生成4
  const seats4 = new THREE.Group();
  for (let r = 18; r < param.nCol; r++)
    for (let c = 0; c < param.nRow+17; c++) {
      const seat = chair2.clone();
      seat.position.set(
        (param.w + param.gapX)*(c-(param.nCol - 3)/4),
        0,
        (param.d + param.gapZ)*(r-36)
      )
      seats4.add(seat);
    }
  scene.add(seats4);
  // 座席の生成5


  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(40,80),
    new THREE.MeshBasicMaterial({color: 0x505050})
  )
  plane.rotateX(-Math.PI/2);
  plane.position.y = 0;
  scene.add(plane);

  // 座標軸の設定
  const axes = new THREE.AxesHelper(18);
  scene.add(axes);

  // カメラの作成
  const camera = new THREE.PerspectiveCamera(
    50, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(40,30,40);
  camera.lookAt(0,0,0);
  

  // レンダラの設定
  const renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0x406080);
  renderer.setSize(window.innerWidth, innerHeight);
    document.getElementById("output").appendChild(renderer.domElement);
    const orbitControls = new OrbitControls(camera, renderer.domElement);
  // 描画処理

  // 描画関数
  function render() {
    // 座標軸の表示
    axes.visible = param.axes;
    // 描画
    orbitControls.update();
    renderer.render(scene, camera);
    // 次のフレームでの描画要請
    requestAnimationFrame(render);
  }

  // 描画開始
  render();
}

init();